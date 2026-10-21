import {
  cellToBoundary,
  cellToLatLng,
  latLngToCell,
} from "h3-js";
import { HOTEL_OPPORTUNITY_CONFIG } from "../config/hotelOpportunityConfig.js";

const ANALYSIS_CATEGORIES = new Set(["restaurant", "bar", "gym", "wellness", "villa"]);
const CATEGORY_TO_COUNT = {
  restaurant: "restaurants",
  bar: "bars",
  gym: "gymsWellness",
  wellness: "gymsWellness",
  villa: "villas",
};

const clamp = (value, minimum = 0, maximum = 100) => (
  Math.min(maximum, Math.max(minimum, value))
);
const roundScore = (value) => Math.round(clamp(value) * 10) / 10;

export function isValidCoordinate(latitude, longitude) {
  return Number.isFinite(latitude)
    && Number.isFinite(longitude)
    && latitude >= -90
    && latitude <= 90
    && longitude >= -180
    && longitude <= 180;
}

export function getDistanceMeters(first, second) {
  if (!isValidCoordinate(first.latitude, first.longitude)
    || !isValidCoordinate(second.latitude, second.longitude)) return Number.POSITIVE_INFINITY;

  const toRadians = (degrees) => degrees * Math.PI / 180;
  const latitudeDelta = toRadians(second.latitude - first.latitude);
  const longitudeDelta = toRadians(second.longitude - first.longitude);
  const value = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(toRadians(first.latitude))
      * Math.cos(toRadians(second.latitude))
      * Math.sin(longitudeDelta / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

export function getDistanceWeight(distanceMeters, distanceBands = HOTEL_OPPORTUNITY_CONFIG.distanceBands) {
  if (!Number.isFinite(distanceMeters) || distanceMeters < 0) return 0;
  return distanceBands.find(({ maxMeters }) => distanceMeters <= maxMeters)?.weight || 0;
}

export function normalizeMetric(value, cap) {
  if (!Number.isFinite(value) || !Number.isFinite(cap) || cap <= 0) return 0;
  return roundScore((value / cap) * 100);
}

export function calculateVisitorDemandScore(villas, config = HOTEL_OPPORTUNITY_CONFIG) {
  const value = Math.max(0, Number(villas) || 0);
  const { idealVillaDensity, saturationVillaDensity } = config.visitorDemand;
  if (value <= idealVillaDensity) return roundScore((value / idealVillaDensity) * 100);
  if (value >= saturationVillaDensity) return 0;
  return roundScore(100 * (1 - ((value - idealVillaDensity) / (saturationVillaDensity - idealVillaDensity))));
}

export function calculateAccommodationGapScore({ restaurants, bars, gyms, villas }, config = HOTEL_OPPORTUNITY_CONFIG) {
  const caps = config.normalizationCaps;
  const amenitySupport = (
    normalizeMetric(restaurants, caps.restaurants) * 0.55
    + normalizeMetric(bars, caps.bars) * 0.15
    + normalizeMetric(gyms, caps.gymsWellness) * 0.30
  );
  const competition = normalizeMetric(villas, caps.villas);
  return roundScore(amenitySupport * (1 - (competition / 100)));
}

export function calculateHotelOpportunityScore({
  restaurants,
  bars,
  gyms,
  villas,
  amenityDiversity,
  distanceWeightedActivity,
}, config = HOTEL_OPPORTUNITY_CONFIG) {
  const caps = config.normalizationCaps;
  const normalizedRestaurants = normalizeMetric(restaurants, caps.restaurants);
  const normalizedBars = normalizeMetric(bars, caps.bars);
  const normalizedGyms = normalizeMetric(gyms, caps.gymsWellness);
  const visitorDemand = calculateVisitorDemandScore(villas, config);
  const accommodationGap = calculateAccommodationGapScore({ restaurants, bars, gyms, villas }, config);
  const activityAdjustment = normalizeMetric(distanceWeightedActivity, caps.totalActivity) / 100;
  const weights = config.opportunityWeights;
  const baseScore = normalizedRestaurants * weights.restaurants
    + normalizedGyms * weights.gymsWellness
    + normalizedBars * weights.bars
    + clamp(amenityDiversity) * weights.amenityDiversity
    + visitorDemand * weights.visitorDemand
    + accommodationGap * weights.accommodationGap;

  return roundScore(baseScore * (0.85 + activityAdjustment * 0.15));
}

export function classifyHotelOpportunity(score, config = HOTEL_OPPORTUNITY_CONFIG) {
  const thresholds = config.classificationThresholds;
  if (score >= thresholds.veryStrong) return "very-strong";
  if (score >= thresholds.promising) return "promising";
  if (score >= thresholds.conditional) return "conditional";
  if (score >= thresholds.weak) return "weak";
  return "unsuitable";
}

export function adaptPlacesForHotelAnalysis(places) {
  return places.flatMap((place) => {
    const latitude = Number(place.latitude ?? place.lat);
    const longitude = Number(place.longitude ?? place.lng);
    if (!isValidCoordinate(latitude, longitude)) return [];

    const sourceId = String(place.id || place.placeId || `${latitude}:${longitude}:${place.name}`);
    const categories = new Set([place.category, ...(place.categories || [])]);
    const mappedCategories = [];
    if (categories.has("restaurant") || categories.has("cafe")) mappedCategories.push("restaurant");
    if (categories.has("bar")) mappedCategories.push("bar");
    if (categories.has("gym") || categories.has("crossfit")) mappedCategories.push("gym");
    if (categories.has("pilates") || categories.has("yoga") || categories.has("wellness")) mappedCategories.push("wellness");
    if (categories.has("accommodation") || categories.has("villa")) mappedCategories.push("villa");

    return [...new Set(mappedCategories)].map((category) => ({
      id: `${sourceId}:${category}`,
      sourceId,
      name: place.name || "Unnamed place",
      category,
      latitude,
      longitude,
      ...(Number.isFinite(place.roomCount) && place.roomCount > 0 ? { roomCount: place.roomCount } : {}),
    }));
  });
}

function getCandidateHexagons(places, config) {
  const validPlaces = places.filter((place) => isValidCoordinate(place.latitude, place.longitude));
  if (validPlaces.length === 0) return [];

  return [...new Set(validPlaces.map((place) => (
    latLngToCell(place.latitude, place.longitude, config.h3Resolution)
  )))];
}

function buildClosestPlaces(records, limit = 6) {
  const placesBySource = new Map();
  records.sort((first, second) => first.distanceMeters - second.distanceMeters).forEach((record) => {
    const existing = placesBySource.get(record.place.sourceId);
    if (existing) {
      existing.categories = [...new Set([...existing.categories, record.place.category])];
      return;
    }
    placesBySource.set(record.place.sourceId, {
      id: record.place.sourceId,
      name: record.place.name,
      categories: [record.place.category],
      distanceMeters: Math.round(record.distanceMeters),
    });
  });
  return [...placesBySource.values()].slice(0, limit);
}

function buildExplanation(scores) {
  if (scores.amenityDensity >= 65 && scores.visitorDemand >= 50 && scores.accommodationGap >= 60) {
    return "Strong restaurant and wellness activity, proven villa demand and relatively limited accommodation supply.";
  }
  if (scores.competition >= 70) {
    return "Strong mapped visitor demand, but high accommodation supply may indicate local saturation.";
  }
  if (scores.amenityDensity >= 60 && scores.accommodationGap >= 45) {
    return "Good nearby amenity activity with a moderate accommodation gap worth further investigation.";
  }
  if (scores.visitorDemand >= 55) {
    return "Mapped accommodation suggests visitor demand, while surrounding amenities remain mixed.";
  }
  return "Limited or uneven mapped activity produces a weaker preliminary opportunity signal.";
}

function applyExtensions(baseScore, context, config) {
  const positive = config.positiveScoringFactors.reduce((total, factor) => (
    total + (Number(factor.calculate?.(context)) || 0) * (factor.weight || 1)
  ), 0);
  const penalties = config.riskPenalties.reduce((total, factor) => (
    total + (Number(factor.calculate?.(context)) || 0) * (factor.weight || 1)
  ), 0);
  return roundScore(baseScore + positive - penalties);
}

export function analyzeHotelOpportunities(places, options = {}) {
  const config = options.config || HOTEL_OPPORTUNITY_CONFIG;
  const includedCategories = new Set(options.includedCategories || ANALYSIS_CATEGORIES);
  const candidatePlaces = places.filter((place) => ANALYSIS_CATEGORIES.has(place.category));
  const scoringPlaces = candidatePlaces.filter((place) => includedCategories.has(place.category));

  return getCandidateHexagons(candidatePlaces, config).map((hexId) => {
    const [latitude, longitude] = cellToLatLng(hexId);
    const centre = { latitude, longitude };
    const nearbyRecords = scoringPlaces.flatMap((place) => {
      const distanceMeters = getDistanceMeters(centre, place);
      const weight = getDistanceWeight(distanceMeters, config.distanceBands);
      return weight > 0 ? [{ place, distanceMeters, weight }] : [];
    });
    const counts = { restaurants: 0, bars: 0, gymsWellness: 0, villas: 0 };
    const weighted = { restaurants: 0, bars: 0, gymsWellness: 0, villas: 0 };
    nearbyRecords.forEach(({ place, weight }) => {
      const countKey = CATEGORY_TO_COUNT[place.category];
      counts[countKey] += 1;
      weighted[countKey] += weight * (place.category === "villa" ? place.roomCount || 1 : 1);
    });

    const activeCategoryCount = Object.values(weighted).filter((value) => value > 0).length;
    const amenityDiversity = activeCategoryCount / 4 * 100;
    const distanceWeightedActivity = Object.values(weighted).reduce((total, value) => total + value, 0);
    const amenityDensity = (
      normalizeMetric(weighted.restaurants, config.normalizationCaps.restaurants)
      + normalizeMetric(weighted.bars, config.normalizationCaps.bars)
      + normalizeMetric(weighted.gymsWellness, config.normalizationCaps.gymsWellness)
    ) / 3;
    const competition = normalizeMetric(weighted.villas, config.normalizationCaps.villas);
    const visitorDemand = calculateVisitorDemandScore(weighted.villas, config);
    const accommodationGap = calculateAccommodationGapScore({
      restaurants: weighted.restaurants,
      bars: weighted.bars,
      gyms: weighted.gymsWellness,
      villas: weighted.villas,
    }, config);
    const baseOpportunity = calculateHotelOpportunityScore({
      restaurants: weighted.restaurants,
      bars: weighted.bars,
      gyms: weighted.gymsWellness,
      villas: weighted.villas,
      amenityDiversity,
      distanceWeightedActivity,
    }, config);
    const extensionContext = { centre, counts, weighted, nearbyRecords };
    const hotelOpportunity = applyExtensions(baseOpportunity, extensionContext, config);
    const scores = {
      amenityDensity: roundScore(amenityDensity),
      amenityDiversity: roundScore(amenityDiversity),
      visitorDemand,
      accommodationGap,
      competition,
      hotelOpportunity,
    };

    return {
      hexId,
      centre,
      boundary: cellToBoundary(hexId).map(([boundaryLatitude, boundaryLongitude]) => ({
        latitude: boundaryLatitude,
        longitude: boundaryLongitude,
      })),
      counts,
      metrics: {
        restaurantDensity: roundScore(weighted.restaurants),
        barDensity: roundScore(weighted.bars),
        gymsWellnessDensity: roundScore(weighted.gymsWellness),
        villaDensity: roundScore(weighted.villas),
        distanceWeightedActivity: roundScore(distanceWeightedActivity),
      },
      scores,
      classification: classifyHotelOpportunity(hotelOpportunity, config),
      explanation: buildExplanation(scores),
      closestPlaces: buildClosestPlaces(nearbyRecords),
    };
  }).sort((first, second) => second.scores.hotelOpportunity - first.scores.hotelOpportunity);
}
