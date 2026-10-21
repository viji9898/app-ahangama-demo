import React, { useEffect, useMemo, useRef, useState } from "react";
import { Tooltip } from "antd";
import {
  AimOutlined,
  CloseOutlined,
  EnvironmentOutlined,
  ExportOutlined,
  InfoCircleOutlined,
  StarFilled,
} from "@ant-design/icons";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import SiteLayout from "../components/layout/SiteLayout";
import { HOTEL_OPPORTUNITY_CONFIG } from "../config/hotelOpportunityConfig";
import { AHANGAMA_MAP_PLACES } from "../data/ahangama-map-places";
import {
  adaptPlacesForHotelAnalysis,
  analyzeHotelOpportunities,
  classifyHotelOpportunity,
} from "../utils/hotelOpportunityAnalysis";
import "../styles/wellness-map.css";

export const WELLNESS_MAP_PATH = "/wellness/map";

const MAP_CENTER = { lat: 5.9764, lng: 80.3698 };
const MAP_SCRIPT_ID = "ahangama-google-maps";

const CATEGORY_META = {
  gym: { label: "Gyms", color: "#e85d3f" },
  crossfit: { label: "CrossFit", color: "#17231d" },
  pilates: { label: "Pilates", color: "#d3a62c" },
  yoga: { label: "Yoga", color: "#397565" },
  accommodation: { label: "Stays", color: "#2474a6" },
  cafe: { label: "Cafés", color: "#a15c32" },
  restaurant: { label: "Restaurants", color: "#bf3f4a" },
  bar: { label: "Bars", color: "#76508e" },
};

const WELLNESS_PLACES = [
  { placeId: "ChIJJfNpPABr4ToRRSeHfrj5QT0", name: "CrossFit Ceylon Palm", category: "crossfit", rating: 5, reviews: 27, lat: 5.9885696, lng: 80.3823203 },
  { placeId: "ChIJpzkHTwAT4ToRTS4QRmLZz6M", name: "Krish Combat and Fitness", category: "gym", rating: 5, reviews: 315, lat: 5.9800629, lng: 80.3585861 },
  { placeId: "ChIJNUSgsWZr4ToR4kkNcnnSizE", name: "Loka Lanka Fitness", category: "gym", rating: 5, reviews: 313, lat: 5.9882658, lng: 80.3755558 },
  { placeId: "ChIJawHZVgAT4ToRqUmKVlre_ko", name: "Krozz Fit Surf Coast Gym", category: "gym", rating: 4.9, reviews: 150, lat: 5.9773439, lng: 80.3647306 },
  { placeId: "ChIJhYlrfgAV4ToRp0GwTEQqDWM", name: "GYM ERA", category: "gym", rating: 5, reviews: 123, lat: 5.9690498, lng: 80.3706786 },
  { placeId: "ChIJZdc4DSoV4ToRi_7V0Wbn3NE", name: "Melanne Powerpoint Gym", category: "gym", rating: 4.4, reviews: 98, lat: 5.9733234, lng: 80.3617169 },
  { placeId: "ChIJ_UywB1gT4ToR5A07UeP2Gxk", name: "Singhe Shakthi Gym", category: "gym", rating: 4.6, reviews: 83, lat: 5.9759875, lng: 80.3601406 },
  { placeId: "ChIJVc-ADgAT4ToR-MdoK01Qnvs", name: "Sellam Gym", category: "gym", rating: 4.9, reviews: 50, lat: 5.9737732, lng: 80.3642614 },
  { placeId: "ChIJYSipV9YT4ToRgT72vBMZ7Oc", name: "Anytime Fitzone Ahangama", category: "gym", rating: 5, reviews: 2, lat: 5.9716228, lng: 80.3655294 },
  { placeId: "ChIJ65RdaAAT4ToRM-NGKuW5Vg0", name: "Kris's Fit Surf Coast Gym", category: "gym", rating: 5, reviews: 2, lat: 5.9770309, lng: 80.3646711 },
  { placeId: "ChIJjc-DaFAT4ToRcz7WeQuQErA", name: "ULU House of Pilates", category: "pilates", rating: 4.9, reviews: 709, lat: 5.9734375, lng: 80.3605625 },
  { placeId: "ChIJjfeQiSAT4ToR899oWpZWPfs", name: "Pura Pilates", category: "pilates", rating: 4.9, reviews: 189, lat: 5.9797922, lng: 80.3656219 },
  { placeId: "ChIJb7arJmcT4ToR-Y7jXEhNegI", name: "Flowground Yoga Retreat", category: "yoga", rating: 5, reviews: 168, lat: 5.9823169, lng: 80.3617318 },
  { placeId: "ChIJtQh3DgAV4ToRI3EEnnrM0xE", name: "Shramalaya", category: "yoga", rating: 4.9, reviews: 147, lat: 5.973168, lng: 80.384811 },
  { placeId: "ChIJtRRGsMVb4joRuiVbNX2_g3Y", name: "One Bhakthi", category: "yoga", rating: 4.8, reviews: 136, lat: 5.9859128, lng: 80.3462842 },
  { placeId: "ChIJ3aSEARpr4ToRWdmMIhMvWyc", name: "Senses Yoga Studio", category: "yoga", rating: 4.8, reviews: 115, lat: 5.9851256, lng: 80.3923134 },
  { placeId: "ChIJr1wSMqgU4ToR-f1NeWqZRp8", name: "Sunshinestories Surf & Yoga", category: "yoga", rating: 4.8, reviews: 93, lat: 5.9747651, lng: 80.36623 },
  { placeId: "ChIJ1wR54a4T4ToRkuhOxYYubqo", name: "Vagabond Temple", category: "yoga", rating: 5, reviews: 68, lat: 5.9752456, lng: 80.365864 },
  { placeId: "ChIJhw7MrqwU4ToRXWKBnbcdyKc", name: "Villa My Way Yoga Retreat", category: "yoga", rating: 4.7, reviews: 52, lat: 5.9822235, lng: 80.3718793 },
  { placeId: "ChIJ9cKSBFET4ToRikANAplAzi4", name: "Camp Poe", category: "yoga", rating: 4.7, reviews: 36, lat: 5.975237, lng: 80.3581819 },
  { placeId: "ChIJI2Gxn4oV4ToRf3f_4lmMtcE", name: "Pulse Nest", category: "yoga", rating: 5, reviews: 27, lat: 5.9678598, lng: 80.3782461 },
];

const ALL_PLACES = (() => {
  const placesById = new Map(WELLNESS_PLACES.map((place) => [
    place.placeId,
    { ...place, categories: [place.category] },
  ]));

  AHANGAMA_MAP_PLACES.forEach((place) => {
    const existingPlace = placesById.get(place.placeId);
    if (!existingPlace) {
      placesById.set(place.placeId, place);
      return;
    }

    placesById.set(place.placeId, {
      ...place,
      ...existingPlace,
      categories: [...new Set([...existingPlace.categories, ...place.categories])],
    });
  });

  return [...placesById.values()];
})();

const CATEGORY_COUNTS = Object.fromEntries(Object.keys(CATEGORY_META).map((category) => [
  category,
  ALL_PLACES.filter((place) => place.categories.includes(category)).length,
]));
const MAPPED_PLACES = adaptPlacesForHotelAnalysis(ALL_PLACES);
const ANALYSIS_FILTERS = [
  { key: "restaurants", label: "Restaurants", categories: ["restaurant"] },
  { key: "bars", label: "Bars", categories: ["bar"] },
  { key: "gymsWellness", label: "Gyms / wellness", categories: ["gym", "wellness"] },
  { key: "villas", label: "Villas / stays", categories: ["villa"] },
];
const ANALYSIS_MODES = {
  opportunity: { label: "Overall opportunity", scoreKey: "hotelOpportunity" },
  amenities: { label: "Amenity density", scoreKey: "amenityDensity" },
  demand: { label: "Visitor demand", scoreKey: "visitorDemand" },
  gap: { label: "Accommodation gap", scoreKey: "accommodationGap" },
  competition: { label: "Competition", scoreKey: "competition", invertColor: true },
};
const CLASSIFICATION_LABELS = {
  "very-strong": "Very strong",
  promising: "Promising",
  conditional: "Conditional",
  weak: "Weak / saturated",
  unsuitable: "Unsuitable from current data",
};
const OPPORTUNITY_METRIC_META = {
  restaurants: {
    label: "Restaurants",
    tooltip: "Mapped restaurants and cafés within 1.5 km. The displayed value is a venue count; distance weighting is applied when calculating scores.",
  },
  bars: {
    label: "Bars",
    tooltip: "Mapped bars, pubs and cocktail venues within 1.5 km. The displayed value is a venue count; distance weighting is applied when calculating scores.",
  },
  gymsWellness: {
    label: "Gyms / wellness",
    tooltip: "Mapped gyms, CrossFit, Pilates, yoga and wellness venues within 1.5 km.",
  },
  villas: {
    label: "Villas / stays",
    tooltip: "Mapped accommodation within 1.5 km. Room counts are unavailable, so each listing currently contributes one supply unit.",
  },
  amenityDiversity: {
    label: "Amenity diversity",
    tooltip: "A 0–100 score based on how many input groups are present: restaurants, bars, gyms/wellness and accommodation. A score of 75 means three of four groups are present.",
  },
  visitorDemand: {
    label: "Visitor demand",
    tooltip: "A 0–100 proxy inferred from mapped accommodation density. Moderate supply scores positively; no mapped supply or very high supply scores lower.",
  },
  accommodationGap: {
    label: "Accommodation gap",
    tooltip: "A 0–100 score that rises when food and wellness activity is strong relative to mapped accommodation supply. A high score is not proof of unmet hotel demand.",
  },
  competition: {
    label: "Competition",
    tooltip: "A 0–100 score based on mapped accommodation supply. Higher values indicate more nearby accommodation competition.",
  },
};

function OpportunityMetric({ metricKey, value }) {
  const metric = OPPORTUNITY_METRIC_META[metricKey];
  return (
    <div>
      <dt>
        <span>{metric.label}</span>
        <Tooltip
          title={metric.tooltip}
          placement="bottom"
          trigger={["hover", "focus", "click"]}
        >
          <button type="button" aria-label={`Explain ${metric.label}`}>
            <InfoCircleOutlined aria-hidden="true" />
          </button>
        </Tooltip>
      </dt>
      <dd>{value}</dd>
    </div>
  );
}

function getAnalysisDisplayScore(hexagon, mode) {
  const modeMeta = ANALYSIS_MODES[mode];
  const score = hexagon.scores[modeMeta.scoreKey];
  return modeMeta.invertColor ? 100 - score : score;
}

function googleMapsUrl(place) {
  const parameters = new URLSearchParams({
    api: "1",
    query: place.name,
    query_place_id: place.placeId,
  });
  return `https://www.google.com/maps/search/?${parameters.toString()}`;
}

function loadGoogleMaps(apiKey) {
  if (window.google?.maps) return Promise.resolve(window.google.maps);

  return new Promise((resolve, reject) => {
    const existingScript = document.getElementById(MAP_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.google.maps), { once: true });
      existingScript.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = MAP_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export default function WellnessMapPage() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_GOOGLE_MAPS_KEY || "";
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const opportunityPolygonsRef = useRef([]);
  const infoWindowRef = useRef(null);
  const [mapsReady, setMapsReady] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedPlaceId, setSelectedPlaceId] = useState(ALL_PLACES[0].placeId);
  const [analysisEnabled, setAnalysisEnabled] = useState(false);
  const [analysisMode, setAnalysisMode] = useState("opportunity");
  const [analysisOpacity, setAnalysisOpacity] = useState(0.55);
  const [analysisTopLimit, setAnalysisTopLimit] = useState("all");
  const [selectedHexId, setSelectedHexId] = useState("");
  const [analysisFilters, setAnalysisFilters] = useState({
    restaurants: true,
    bars: true,
    gymsWellness: true,
    villas: true,
  });

  const visiblePlaces = useMemo(() => {
    if (activeCategory === "all") return ALL_PLACES;

    return ALL_PLACES
      .filter((place) => place.categories.includes(activeCategory))
      .sort((first, second) => (
        Number(second.category === activeCategory) - Number(first.category === activeCategory)
        || second.reviews - first.reviews
        || first.name.localeCompare(second.name)
      ));
  }, [activeCategory]);

  const includedAnalysisCategories = useMemo(() => (
    ANALYSIS_FILTERS.flatMap((filter) => (
      analysisFilters[filter.key] ? filter.categories : []
    ))
  ), [analysisFilters]);

  const opportunityHexagons = useMemo(() => analyzeHotelOpportunities(MAPPED_PLACES, {
    includedCategories: includedAnalysisCategories,
  }), [includedAnalysisCategories]);

  const displayedOpportunityHexagons = useMemo(() => {
    const sortedHexagons = [...opportunityHexagons].sort((first, second) => (
      getAnalysisDisplayScore(second, analysisMode) - getAnalysisDisplayScore(first, analysisMode)
    ));
    if (analysisTopLimit === "all") return sortedHexagons;
    return sortedHexagons.slice(0, Number(analysisTopLimit));
  }, [analysisMode, analysisTopLimit, opportunityHexagons]);

  const selectedHexagon = useMemo(() => (
    opportunityHexagons.find((hexagon) => hexagon.hexId === selectedHexId) || null
  ), [opportunityHexagons, selectedHexId]);

  const selectCategory = (category) => {
    const firstVisiblePlace = category === "all"
      ? ALL_PLACES[0]
      : ALL_PLACES.find((place) => place.categories.includes(category));

    setActiveCategory(category);
    setSelectedPlaceId(firstVisiblePlace?.placeId || "");
  };

  useEffect(() => {
    if (!apiKey) return;

    loadGoogleMaps(apiKey)
      .then(() => setMapsReady(true))
      .catch(() => setMapError(true));
  }, [apiKey]);

  useEffect(() => {
    if (!mapsReady || !mapContainerRef.current) return;

    const { maps } = window.google;
    if (!mapRef.current) {
      mapRef.current = new maps.Map(mapContainerRef.current, {
        center: MAP_CENTER,
        zoom: 13,
        clickableIcons: false,
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        styles: [
          { featureType: "poi.business", stylers: [{ visibility: "off" }] },
          { featureType: "transit", stylers: [{ visibility: "off" }] },
        ],
      });
      infoWindowRef.current = new maps.InfoWindow();
    }

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
    const bounds = new maps.LatLngBounds();

    visiblePlaces.forEach((place) => {
      const position = { lat: place.lat, lng: place.lng };
      const displayCategory = activeCategory === "all" ? place.category : activeCategory;
      const marker = new maps.Marker({
        map: mapRef.current,
        position,
        title: place.name,
        icon: {
          path: maps.SymbolPath.CIRCLE,
          fillColor: CATEGORY_META[displayCategory].color,
          fillOpacity: 1,
          scale: selectedPlaceId === place.placeId ? 11 : 8,
          strokeColor: "#ffffff",
          strokeWeight: selectedPlaceId === place.placeId ? 3 : 2,
        },
        zIndex: selectedPlaceId === place.placeId ? 10 : 1,
      });

      marker.addListener("click", () => {
        setSelectedPlaceId(place.placeId);
        infoWindowRef.current.setContent(
          `<div class="wm-popup"><strong>${place.name}</strong><span>${CATEGORY_META[displayCategory].label}${place.rating ? ` · ${place.rating} ★` : ""}</span><a href="${googleMapsUrl(place)}" target="_blank" rel="noopener noreferrer">Open in Google Maps</a></div>`,
        );
        infoWindowRef.current.open({ anchor: marker, map: mapRef.current });
      });

      markersRef.current.push(marker);
      bounds.extend(position);
    });

    if (visiblePlaces.length === 1) {
      mapRef.current.setCenter({ lat: visiblePlaces[0].lat, lng: visiblePlaces[0].lng });
      mapRef.current.setZoom(15);
    } else {
      mapRef.current.fitBounds(bounds, 48);
    }
  }, [activeCategory, mapsReady, selectedPlaceId, visiblePlaces]);

  useEffect(() => {
    opportunityPolygonsRef.current.forEach((polygon) => polygon.setMap(null));
    opportunityPolygonsRef.current = [];
    if (!analysisEnabled || !mapsReady || !mapRef.current) return undefined;

    const { maps } = window.google;
    const polygons = displayedOpportunityHexagons.map((hexagon) => {
      const displayScore = getAnalysisDisplayScore(hexagon, analysisMode);
      const displayClassification = classifyHotelOpportunity(displayScore);
      const color = HOTEL_OPPORTUNITY_CONFIG.classificationColors[displayClassification];
      const polygon = new maps.Polygon({
        map: mapRef.current,
        paths: hexagon.boundary.map(({ latitude, longitude }) => ({
          lat: latitude,
          lng: longitude,
        })),
        clickable: true,
        fillColor: color,
        fillOpacity: analysisOpacity,
        strokeColor: color,
        strokeOpacity: 0.9,
        strokeWeight: selectedHexId === hexagon.hexId ? 3 : 1,
        zIndex: selectedHexId === hexagon.hexId ? 3 : 2,
      });
      polygon.addListener("click", () => setSelectedHexId(hexagon.hexId));
      return polygon;
    });

    opportunityPolygonsRef.current = polygons;
    return () => {
      polygons.forEach((polygon) => polygon.setMap(null));
    };
  }, [analysisEnabled, analysisMode, analysisOpacity, displayedOpportunityHexagons, mapsReady, selectedHexId]);

  const selectPlace = (place) => {
    setSelectedPlaceId(place.placeId);
    if (mapRef.current) {
      mapRef.current.panTo({ lat: place.lat, lng: place.lng });
      mapRef.current.setZoom(15);
    }
  };

  const toggleAnalysisFilter = (key) => {
    setAnalysisFilters((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <SiteLayout>
      <Seo
        title="Ahangama Map — Places to Stay, Eat, Drink and Move"
        description="Explore accommodation, cafés, restaurants, bars, gyms, CrossFit, Pilates and yoga around Ahangama."
        canonical={absUrl(WELLNESS_MAP_PATH)}
      />

      <main className="wm-page">
        <header className="wm-header">
          <div>
            <span className="wm-eyebrow">Ahangama local directory</span>
            <h1>Find your place around town.</h1>
          </div>
          <p>Places to stay, eat, drink and move, mapped in one practical view.</p>
        </header>

        <nav className="wm-filters" aria-label="Filter places">
          <button
            type="button"
            className={activeCategory === "all" ? "is-active" : ""}
            onClick={() => selectCategory("all")}
          >
            All <span>{ALL_PLACES.length}</span>
          </button>
          {Object.entries(CATEGORY_META).map(([key, meta]) => (
            <button
              type="button"
              className={activeCategory === key ? "is-active" : ""}
              onClick={() => selectCategory(key)}
              key={key}
            >
              <i style={{ backgroundColor: meta.color }} />
              {meta.label}
              <span>{CATEGORY_COUNTS[key]}</span>
            </button>
          ))}
        </nav>

        <section className={`wm-analysis${analysisEnabled ? " is-active" : ""}`}>
          <div className="wm-analysis__primary">
            <label className="wm-analysis__toggle">
              <input
                type="checkbox"
                checked={analysisEnabled}
                onChange={(event) => setAnalysisEnabled(event.target.checked)}
              />
              <span aria-hidden="true" />
              <strong>Hotel Opportunity</strong>
            </label>
            <p>Preliminary signals based only on currently mapped venues.</p>
          </div>

          {analysisEnabled ? (
            <div className="wm-analysis__controls">
              <label>
                View
                <select value={analysisMode} onChange={(event) => setAnalysisMode(event.target.value)}>
                  {Object.entries(ANALYSIS_MODES).map(([key, mode]) => (
                    <option value={key} key={key}>{mode.label}</option>
                  ))}
                </select>
              </label>
              <label>
                Areas
                <select value={analysisTopLimit} onChange={(event) => setAnalysisTopLimit(event.target.value)}>
                  <option value="all">All scored areas</option>
                  <option value="50">Top 50</option>
                  <option value="25">Top 25</option>
                  <option value="10">Top 10</option>
                </select>
              </label>
              <label className="wm-analysis__opacity">
                Opacity <span>{Math.round(analysisOpacity * 100)}%</span>
                <input
                  type="range"
                  min="0.15"
                  max="0.85"
                  step="0.05"
                  value={analysisOpacity}
                  onChange={(event) => setAnalysisOpacity(Number(event.target.value))}
                />
              </label>
              <fieldset>
                <legend>Inputs</legend>
                {ANALYSIS_FILTERS.map((filter) => (
                  <label key={filter.key}>
                    <input
                      type="checkbox"
                      checked={analysisFilters[filter.key]}
                      onChange={() => toggleAnalysisFilter(filter.key)}
                    />
                    {filter.label}
                  </label>
                ))}
              </fieldset>
            </div>
          ) : null}
        </section>

        <div className="wm-workspace">
          <section className="wm-list" aria-label={`${visiblePlaces.length} places`}>
            <div className="wm-list__summary">
              <strong>{visiblePlaces.length} places</strong>
              <span>Ratings sourced from Google</span>
            </div>
            {visiblePlaces.map((place, index) => (
              <article
                className={`wm-place${selectedPlaceId === place.placeId ? " is-selected" : ""}`}
                key={place.placeId}
              >
                <button type="button" className="wm-place__select" onClick={() => selectPlace(place)}>
                  <span className="wm-place__number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="wm-place__body">
                    <span className="wm-place__category">
                      {CATEGORY_META[activeCategory === "all" ? place.category : activeCategory].label}
                    </span>
                    <strong>{place.name}</strong>
                    {place.rating ? (
                      <span className="wm-place__rating">
                        <StarFilled aria-hidden="true" /> {place.rating}
                        <small>{place.reviews} reviews</small>
                      </span>
                    ) : null}
                  </span>
                  <AimOutlined aria-hidden="true" />
                </button>
                <a href={googleMapsUrl(place)} target="_blank" rel="noopener noreferrer">
                  Directions <ExportOutlined aria-hidden="true" />
                </a>
              </article>
            ))}
          </section>

          <section className="wm-map" aria-label="Google map of Ahangama places">
            <div ref={mapContainerRef} className="wm-map__canvas" />
            {!apiKey || mapError ? (
              <div className="wm-map__state">
                <EnvironmentOutlined aria-hidden="true" />
                <strong>Google Maps is not configured.</strong>
                <span>Add a referrer-restricted browser key as VITE_GOOGLE_MAPS_API_KEY.</span>
              </div>
            ) : null}
            {apiKey && !mapsReady && !mapError ? (
              <div className="wm-map__state"><span>Loading map…</span></div>
            ) : null}
            <div className="wm-legend" aria-hidden="true">
              {Object.entries(CATEGORY_META).map(([key, meta]) => (
                <span key={key}><i style={{ backgroundColor: meta.color }} />{meta.label}</span>
              ))}
            </div>
            {analysisEnabled ? (
              <div className="wm-opportunity-legend" aria-label="Hotel opportunity classifications">
                <strong>{ANALYSIS_MODES[analysisMode].label}</strong>
                {Object.entries(CLASSIFICATION_LABELS).map(([classification, label]) => (
                  <span key={classification}>
                    <i style={{ backgroundColor: HOTEL_OPPORTUNITY_CONFIG.classificationColors[classification] }} />
                    {label}
                  </span>
                ))}
              </div>
            ) : null}
            {analysisEnabled && selectedHexagon ? (
              <aside className="wm-opportunity-panel" aria-label="Selected hotel opportunity area">
                <button
                  type="button"
                  className="wm-opportunity-panel__close"
                  onClick={() => setSelectedHexId("")}
                  aria-label="Close opportunity details"
                >
                  <CloseOutlined aria-hidden="true" />
                </button>
                <div className="wm-opportunity-panel__heading">
                  <span className="wm-eyebrow">Preliminary opportunity signal</span>
                  <Tooltip
                    title="This screening score uses only mapped restaurants, bars, wellness venues and accommodation within 1.5 km. It does not assess land availability, planning, access, cost, environmental risk or development feasibility."
                    placement="bottom"
                    trigger={["hover", "focus", "click"]}
                  >
                    <button type="button" aria-label="Explain preliminary opportunity signal">
                      <InfoCircleOutlined aria-hidden="true" />
                    </button>
                  </Tooltip>
                </div>
                <div className="wm-opportunity-panel__score">
                  <strong>{Math.round(selectedHexagon.scores.hotelOpportunity)}</strong>
                  <span>Overall opportunity<br />out of 100</span>
                </div>
                <p>{selectedHexagon.explanation}</p>
                <dl className="wm-opportunity-panel__metrics">
                  <OpportunityMetric metricKey="restaurants" value={selectedHexagon.counts.restaurants} />
                  <OpportunityMetric metricKey="bars" value={selectedHexagon.counts.bars} />
                  <OpportunityMetric metricKey="gymsWellness" value={selectedHexagon.counts.gymsWellness} />
                  <OpportunityMetric metricKey="villas" value={selectedHexagon.counts.villas} />
                  <OpportunityMetric metricKey="amenityDiversity" value={Math.round(selectedHexagon.scores.amenityDiversity)} />
                  <OpportunityMetric metricKey="visitorDemand" value={Math.round(selectedHexagon.scores.visitorDemand)} />
                  <OpportunityMetric metricKey="accommodationGap" value={Math.round(selectedHexagon.scores.accommodationGap)} />
                  <OpportunityMetric metricKey="competition" value={Math.round(selectedHexagon.scores.competition)} />
                </dl>
                <div className="wm-opportunity-panel__nearby">
                  <strong>Closest mapped venues</strong>
                  <ol>
                    {selectedHexagon.closestPlaces.map((place) => (
                      <li key={place.id}>
                        <span>{place.name}</span>
                        <small>{place.distanceMeters} m</small>
                      </li>
                    ))}
                  </ol>
                </div>
                <small className="wm-opportunity-panel__coordinates">
                  {selectedHexagon.centre.latitude.toFixed(6)}, {selectedHexagon.centre.longitude.toFixed(6)}
                </small>
              </aside>
            ) : null}
          </section>
        </div>
      </main>
    </SiteLayout>
  );
}