export const opportunityWeights = {
  restaurants: 0.25,
  gymsWellness: 0.15,
  bars: 0.08,
  amenityDiversity: 0.12,
  visitorDemand: 0.20,
  accommodationGap: 0.20,
};

export const HOTEL_OPPORTUNITY_CONFIG = {
  h3Resolution: 9,
  maxDistanceMeters: 1500,
  distanceBands: [
    { maxMeters: 500, weight: 1 },
    { maxMeters: 1000, weight: 0.7 },
    { maxMeters: 1500, weight: 0.35 },
  ],
  normalizationCaps: {
    restaurants: 18,
    bars: 7,
    gymsWellness: 7,
    villas: 16,
    totalActivity: 32,
  },
  visitorDemand: {
    idealVillaDensity: 6,
    saturationVillaDensity: 16,
  },
  classificationThresholds: {
    veryStrong: 80,
    promising: 65,
    conditional: 50,
    weak: 35,
  },
  classificationColors: {
    "very-strong": "#17623a",
    promising: "#79b86b",
    conditional: "#e3c94f",
    weak: "#dc8737",
    unsuitable: "#b9433f",
  },
  opportunityWeights,
  positiveScoringFactors: [],
  riskPenalties: [],
};
