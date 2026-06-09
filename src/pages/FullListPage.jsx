import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GoogleMap, InfoWindowF, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import {
  ArrowRightOutlined,
  EnvironmentOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Grid, Row, Space, Tag, Typography } from "antd";
import { usePlaces } from "../app/placesContext";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import EditorialNextArticle from "../components/ui/EditorialNextArticle";
import SiteLayout from "../components/layout/SiteLayout";
import { trackPassCtaClick } from "../analytics";
import { buildPassCtaUrl } from "../lib/passAttribution";
import {
  buildBestForGroups,
  FULL_LIST_PATH,
  getPassPlaces,
} from "../lib/passPartners";

const { Paragraph, Text, Title } = Typography;
const { useBreakpoint } = Grid;

const SHARED_GOOGLE_MAP_URL = "https://maps.app.goo.gl/zvo1rFQegTtS87ZT8";
const TWELVE_THINGS_GROUP_KEY = "12-things-to-do";
const TWELVE_THINGS_TAG_SLUG = "12-things-to-do";
const TWELVE_THINGS_POST_PATH = "/12-things";
const TWELVE_THINGS_POST_IMAGE =
  "https://sunshinestories.com/wp-content/uploads/2016/08/Sunshinestories-surf-travel-blog-IMG_8420.jpg";
const MAP_DEFAULT_CENTER = { lat: 5.9699, lng: 80.3666 };
const MAP_DEFAULT_ZOOM = 14;

const TWELVE_THINGS_MAP_OPTIONS = {
  disableDefaultUI: true,
  zoomControl: true,
  gestureHandling: "greedy",
  clickableIcons: false,
  styles: [
    {
      featureType: "administrative",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b6f6a" }],
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [{ color: "#f6f0e6" }],
    },
    {
      featureType: "poi",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#e5dfd5" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#7e7a73" }],
    },
    {
      featureType: "transit",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#d7e4ea" }],
    },
  ],
};

const TWELVE_THINGS_MAP_CATEGORIES = {
  eat: { label: "Eat", color: "#C46A3A" },
  stays: { label: "Stay", color: "#6B7C5A" },
  surf: { label: "Surf", color: "#3E5F73" },
  wellness: { label: "Wellness", color: "#7A6A86" },
  shops: { label: "Retail", color: "#8F6A4A" },
  scooters: { label: "Scooters", color: "#B27A2C" },
  experiences: { label: "Experiences", color: "#4F6F86" },
};

const TWELVE_THINGS_MAP_CATEGORY_ICONS = {
  eat: "<path d=\"M15 9v7.25c0 1.63-1.11 2.99-2.62 3.38V31h-2.2V19.63C8.67 19.24 7.56 17.88 7.56 16.25V9h2.06v7.11h1.48V9h2.05v7.11h1.48V9H15Zm10.44 0c1.87 0 3.39 1.7 3.39 3.8v7.77h-2.06V31h-2.2V20.57h-2.3V12.8c0-2.1 1.3-3.8 3.17-3.8Z\" fill=\"white\"/>",
  stays: "<path d=\"M8 18.6V31h2.2v-4.2h19.6V31H32V16.2c0-1.82-1.48-3.3-3.3-3.3H20.9c-.95 0-1.86.4-2.49 1.11l-1.78 1.99H11.3A3.3 3.3 0 0 0 8 18.6Zm4.2 1.6h5.24l1.78-1.98c.21-.24.51-.37.83-.37h8.65c.6 0 1.1.5 1.1 1.1v3.65H10.2V21.3c0-.6.49-1.1 1.1-1.1ZM10.7 11.1a2.8 2.8 0 1 1 5.6 0 2.8 2.8 0 0 1-5.6 0Z\" fill=\"white\"/>",
  surf: "<path d=\"M7.8 24.5c2.56 0 3.72-1.15 4.75-2.17.98-.97 1.83-1.8 3.48-1.8 1.66 0 2.5.83 3.49 1.8 1.03 1.02 2.18 2.17 4.75 2.17 2.57 0 3.72-1.15 4.75-2.17.98-.97 1.83-1.8 3.49-1.8V18.3c-2.57 0-3.72 1.15-4.76 2.17-.97.97-1.82 1.8-3.48 1.8-1.65 0-2.5-.83-3.48-1.8-1.04-1.02-2.19-2.17-4.76-2.17-2.57 0-3.72 1.15-4.75 2.17-.98.97-1.83 1.8-3.48 1.8-1.66 0-2.5-.83-3.49-1.8-1.03-1.02-2.18-2.17-4.75-2.17v2.2c1.65 0 2.5.83 3.48 1.8 1.04 1.02 2.19 2.17 4.76 2.17Zm2.4-8.08 11.57-7.5 1.2 1.84-11.57 7.5-1.2-1.84Zm11.56 1.2 6.05-3.93 1.2 1.84-6.05 3.93-1.2-1.84Z\" fill=\"white\"/>",
  wellness: "<path d=\"M20 8.5c3.03 0 5.5 2.47 5.5 5.5 0 1.58-.68 3.09-1.86 4.13l-1.32 1.16L20 21.32l-2.32-2.03-1.32-1.16A5.49 5.49 0 0 1 14.5 14c0-3.03 2.47-5.5 5.5-5.5Zm0 15.78 5.92-5.2A8.63 8.63 0 0 0 28.7 14c0-4.8-3.9-8.7-8.7-8.7-4.8 0-8.7 3.9-8.7 8.7 0 1.94.67 3.82 1.88 5.29L20 24.28Zm-6.84 1.04c1.96 1.6 4.34 2.48 6.84 2.48s4.88-.88 6.84-2.48l1.4 1.7A13.23 13.23 0 0 1 20 31c-3.02 0-5.92-1.03-8.24-2.98l1.4-1.66Z\" fill=\"white\"/>",
  shops: "<path d=\"M10.3 13.2h19.4l-1.42 5.67a3.3 3.3 0 0 1-3.2 2.5H14.9a3.3 3.3 0 0 1-3.2-2.5L10.3 13.2Zm2.82-4.2h13.76l.92 2.2h2.37L28.8 6.8H11.2L9.83 11.2h2.37l.92-2.2ZM12.2 23.4h15.6V31h-2.2v-5.4h-11.2V31h-2.2v-7.6Z\" fill=\"white\"/>",
  scooters: "<path d=\"M12.8 24.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Zm14.4 0a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Zm-14.4 2.2a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2Zm14.4 0a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2Zm-6.82-12.2 2.93 5.14h4.87c1.6 0 2.9 1.3 2.9 2.9v.95h-2.2v-.95c0-.39-.31-.7-.7-.7h-6.14l-2.9-5.09h-3.5v-2.2h4.74Z\" fill=\"white\"/>",
  experiences: "<path d=\"M20 7.4 23 14l7.2.62-5.45 4.72 1.64 7-6.39-3.8-6.39 3.8 1.64-7L9.8 14.62 17 14l3-6.6Zm0 3.54-1.58 3.48-.27.58-.63.05-3.8.33 2.88 2.5.48.41-.14.62-.87 3.7 3.37-2 .56-.34.56.34 3.37 2-.87-3.7-.14-.62.48-.41 2.88-2.5-3.8-.33-.63-.05-.27-.58L20 10.94Z\" fill=\"white\"/>",
};

const TWELVE_THINGS_RETAIL_SLUGS = new Set([
  "gusta",
  "qamar-by-zan",
  "yiva-essentials",
]);

const TWELVE_THINGS_RETAIL_NAMES = new Set([
  "gusta",
  "qamar by zan",
  "yiva essentials",
]);

const TWELVE_THINGS_CATEGORY_ORDER = [
  "eat",
  "stays",
  "wellness",
  "surf",
  "scooters",
  "shops",
  "experiences",
];

const TWELVE_THINGS_HIDDEN_INFO_TAGS = new Set([
  "pilates",
  "mobility",
  "wellness",
  "12-things-to-do",
  "editorial-wellness",
]);

const TWELVE_THINGS_CURATED_ORDER = [
  "pura",
  "gik-bike-rentals",
  "coconut-c",
  "frostys-recovery-centre-hangout",
  "kumbuk-community",
  "spa-station-midigama",
  "sarana-ahangama",
  "palm-and-paint",
  "living-r-c-s",
  "yiva-essentials",
  "hakuna-matata-ahangama",
  "qamar-by-zan",
  "global-surf-lodge",
  "gusta",
];

const TWELVE_THINGS_FALLBACK_PLACES = {
  "yiva-essentials": {
    id: "fallback-yiva-essentials",
    slug: "yiva-essentials",
    name: "Yiva Essentials",
    category: "retail",
    area: "Ahangama",
    bestFor: ["Retail", "Shopping"],
    offer: "Enjoy 10% savings on selected purchases with the Ahangama Pass.",
    offers: [
      "Enjoy 10% savings on selected purchases with the Ahangama Pass.",
    ],
    excerpt:
      "Explore a curated concept store of coastal-inspired lifestyle pieces, design objects, and essentials.",
    href: null,
  },
  "qamar-by-zan": {
    id: "fallback-qamar-by-zan",
    slug: "qamar-by-zan",
    name: "Qamar by Zan",
    category: "retail",
    area: "Ahangama",
    bestFor: ["Retail", "Jewellery"],
    offer:
      "Unlock up to 70% savings on the personalized jewelry experience.",
    offers: [
      "Unlock up to 70% savings on the personalized jewelry experience.",
    ],
    excerpt:
      "Create a personalized jewelry piece in a guided studio session shaped by coastal inspiration.",
    href: null,
  },
};

function safeLatLng(place) {
  const lat = place?.position?.lat ?? place?.lat;
  const lng = place?.position?.lng ?? place?.lng;

  if (typeof lat !== "number" || typeof lng !== "number") return null;
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

  return { lat, lng };
}

function isTwelveThingsRetailVenue(place) {
  const slug = String(place?.slug || "").trim().toLowerCase();
  const name = String(place?.name || "").trim().toLowerCase();

  return (
    TWELVE_THINGS_RETAIL_SLUGS.has(slug) ||
    TWELVE_THINGS_RETAIL_NAMES.has(name)
  );
}

function normalizeTag(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function hasTwelveThingsTag(place) {
  return (place.bestFor || []).some(
    (entry) => normalizeTag(entry) === TWELVE_THINGS_TAG_SLUG,
  );
}

function getTwelveThingsCuratedIndex(place) {
  const index = TWELVE_THINGS_CURATED_ORDER.indexOf(place.slug);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function getTwelveThingsPlaces(places) {
  const placeMap = new Map(
    places
      .filter(
        (place) =>
          hasTwelveThingsTag(place) ||
          TWELVE_THINGS_CURATED_ORDER.includes(place.slug),
      )
      .map((place) => [place.slug, place]),
  );

  Object.entries(TWELVE_THINGS_FALLBACK_PLACES).forEach(([slug, place]) => {
    if (!placeMap.has(slug)) {
      placeMap.set(slug, place);
    }
  });

  return Array.from(placeMap.values()).sort((left, right) => {
      const curatedIndexDiff =
        getTwelveThingsCuratedIndex(left) - getTwelveThingsCuratedIndex(right);
      if (curatedIndexDiff !== 0) return curatedIndexDiff;

      return String(left.name || "").localeCompare(String(right.name || ""));
    });
}

function getTwelveThingsMapCategory(place) {
  const category = String(place?.category || "").toLowerCase();
  const text = [
    place?.category,
    ...(place?.bestFor || []),
    ...(place?.tags || []),
    ...(Array.isArray(place?.offers) ? place.offers : [place?.offer]),
    place?.name,
    place?.excerpt,
    place?.description,
    place?.slug,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (
    category.includes("eat") ||
    text.includes("cafe") ||
    text.includes("restaurant") ||
    text.includes("brunch")
  ) {
    return "eat";
  }

  if (
    category.includes("stay") ||
    text.includes("villa") ||
    text.includes("hostel") ||
    text.includes("accommodation")
  ) {
    return "stays";
  }

  if (
    category.includes("wellness") ||
    text.includes("spa") ||
    text.includes("massage") ||
    text.includes("ayurveda") ||
    text.includes("recovery") ||
    text.includes("pilates") ||
    text.includes("yoga")
  ) {
    return "wellness";
  }

  if (isTwelveThingsRetailVenue(place)) {
    return "shops";
  }

  if (
    text.includes("scooter") ||
    text.includes("bike rental") ||
    text.includes("transport") ||
    text.includes("tuk") ||
    text.includes("airport transfer")
  ) {
    return "scooters";
  }

  if (category.includes("surf") || text.includes("surf")) {
    return "surf";
  }

  return "experiences";
}

function getPrimaryOffer(place) {
  const firstOffer = (Array.isArray(place?.offers) ? place.offers : [place?.offer])
    .flatMap((entry) => (Array.isArray(entry) ? entry : [entry]))
    .filter(Boolean)
    .map((entry) => String(entry).trim())
    .find(Boolean);

  return firstOffer || place?.cardPerk || "Pass venue";
}

function getPlaceHref(place) {
  if (Object.prototype.hasOwnProperty.call(place || {}, "href")) {
    return place.href;
  }

  if (!place?.slug) return FULL_LIST_PATH;

  const category = String(place.category || "").toLowerCase();

  if (category === "shops-essentials" || category === "retail") {
    return `/retail/${place.slug}`;
  }

  return `/${place.category}/${place.slug}`;
}

function getInstagramHref(place) {
  if (place?.instagramUrl) return place.instagramUrl;

  if (place?.instagram) {
    return `https://www.instagram.com/${String(place.instagram).replace(/^@/, "")}/`;
  }

  return null;
}

function getDirectionsHref(place) {
  if (place?.mapUrl) return place.mapUrl;

  if (place?._latlng) {
    return `https://www.google.com/maps/search/?api=1&query=${place._latlng.lat},${place._latlng.lng}`;
  }

  const query = [place?.name, place?.area || "Ahangama"].filter(Boolean).join(" ");
  return query
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
    : null;
}

function getVisibleInfoTags(place, limit = 4) {
  return (place?.bestFor || [])
    .filter((tag) => {
      if (!tag) return false;
      return !TWELVE_THINGS_HIDDEN_INFO_TAGS.has(normalizeTag(tag));
    })
    .slice(0, limit);
}

function createPinIcon(googleMaps, color, iconMarkup, isActive) {
  const size = isActive ? 40 : 34;
  const height = size + 12;
  const stroke = isActive ? "rgba(52,42,33,0.88)" : "rgba(52,42,33,0.4)";
  const innerFill = isActive ? "#FFF9F1" : "#FFFCF7";
  const innerStroke = isActive ? "rgba(143,106,74,0.7)" : "rgba(143,106,74,0.48)";
  const iconFill = isActive ? "#2E261F" : "#43372D";
  const renderedIconMarkup = String(iconMarkup || "").replaceAll(
    'fill="white"',
    `fill="${iconFill}"`,
  );
  const svg = encodeURIComponent(`
    <svg width="${size}" height="${height}" viewBox="0 0 40 52" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="rgba(31,29,26,0.22)"/>
        </filter>
        <linearGradient id="pin-fill" x1="20" y1="2" x2="20" y2="49" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="${color}" stop-opacity="0.96"/>
          <stop offset="1" stop-color="${color}" stop-opacity="0.82"/>
        </linearGradient>
      </defs>
      <path filter="url(#shadow)" d="M20 2C10.059 2 2 10.059 2 20c0 12.322 14.06 26.61 16.537 29.024a2.06 2.06 0 0 0 2.926 0C23.94 46.61 38 32.322 38 20 38 10.059 29.941 2 20 2Z" fill="url(#pin-fill)" stroke="${stroke}" stroke-width="1.8"/>
      <ellipse cx="20" cy="14.8" rx="8.8" ry="4.2" fill="rgba(255,255,255,0.14)"/>
      <circle cx="20" cy="20" r="10.4" fill="${innerFill}" stroke="${innerStroke}" stroke-width="1.15"/>
      <g transform="translate(0 0) scale(0.74) translate(6.9 7.2)">
        ${renderedIconMarkup}
      </g>
    </svg>
  `);

  return {
    url: `data:image/svg+xml;charset=UTF-8,${svg}`,
    scaledSize: new googleMaps.maps.Size(size, height),
    anchor: new googleMaps.maps.Point(size / 2, size + 10),
  };
}

function getTwelveThingsMappedPlaces(places) {
  return places
    .map((place) => ({
      ...place,
      _latlng: safeLatLng(place),
      _mapCategory: getTwelveThingsMapCategory(place),
      _primaryOffer: getPrimaryOffer(place),
    }))
    .filter((place) => !!place._latlng);
}

function TwelveThingsMap({ mappedPlaces, selectedPlace, onSelectPlace, isMobile }) {
  const googleMapsApiKey =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
    import.meta.env.VITE_GOOGLE_MAPS_KEY ||
    "";
  const { isLoaded, loadError } = useJsApiLoader({
    id: "ahangama-twelve-things-map",
    googleMapsApiKey,
  });
  const mapRef = useRef(null);

  const fitMapToPlaces = useCallback(
    (map) => {
      if (!window.google || !map || !mappedPlaces.length) return;

      if (mappedPlaces.length === 1) {
        map.setCenter(mappedPlaces[0]._latlng);
        map.setZoom(15);
        return;
      }

      const bounds = new window.google.maps.LatLngBounds();
      mappedPlaces.forEach((place) => bounds.extend(place._latlng));
      map.fitBounds(bounds, isMobile ? 42 : 60);
    },
    [isMobile, mappedPlaces],
  );

  const handleMapLoad = useCallback(
    (map) => {
      mapRef.current = map;
      fitMapToPlaces(map);
    },
    [fitMapToPlaces],
  );

  useEffect(() => {
    if (mapRef.current && mappedPlaces.length) {
      fitMapToPlaces(mapRef.current);
    }
  }, [fitMapToPlaces, mappedPlaces]);

  useEffect(() => {
    if (mapRef.current && selectedPlace?._latlng) {
      mapRef.current.panTo(selectedPlace._latlng);
    }
  }, [selectedPlace]);

  const pinIcons = useMemo(() => {
    if (!isLoaded || !window.google) return {};

    return Object.entries(TWELVE_THINGS_MAP_CATEGORIES).reduce(
      (accumulator, [key, config]) => {
        const iconMarkup = TWELVE_THINGS_MAP_CATEGORY_ICONS[key];
        accumulator[key] = {
          default: createPinIcon(window.google, config.color, iconMarkup, false),
          active: createPinIcon(window.google, config.color, iconMarkup, true),
        };
        return accumulator;
      },
      {},
    );
  }, [isLoaded]);

  const selectedPlaceTags = getVisibleInfoTags(selectedPlace, 4);
  const selectedPlaceInstagramHref = selectedPlace ? getInstagramHref(selectedPlace) : null;
  const selectedPlaceDirectionsHref = selectedPlace ? getDirectionsHref(selectedPlace) : null;

  return (
    <div style={{ display: "grid", gap: 14, marginBottom: 18 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {Object.entries(TWELVE_THINGS_MAP_CATEGORIES)
          .filter(([key]) => mappedPlaces.some((place) => place._mapCategory === key))
          .map(([key, config]) => (
            <span
              key={key}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderRadius: 999,
                border: "1px solid rgba(31,42,36,0.1)",
                background: "rgba(255,255,255,0.78)",
                color: "#1F2A24",
                padding: "8px 12px",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: config.color,
                }}
              />
              {config.label}
            </span>
          ))}
      </div>

      <div
        style={{
          width: "100%",
          marginLeft: 0,
          minHeight: isMobile ? 320 : 420,
          borderRadius: 20,
          overflow: "hidden",
          border: "1px solid rgba(47,62,58,0.08)",
          background: "rgba(255,255,255,0.82)",
        }}
      >
        {!googleMapsApiKey ? (
          <div
            style={{
              minHeight: isMobile ? 320 : 420,
              display: "grid",
              placeItems: "center",
              padding: 24,
              textAlign: "center",
            }}
          >
            <div>
              <EnvironmentOutlined style={{ fontSize: 22, color: "#4F6F86", marginBottom: 10 }} />
              <Text strong style={{ display: "block", marginBottom: 6 }}>
                Google Maps key needed
              </Text>
              <Text style={{ color: "#6B655D" }}>
                Add `VITE_GOOGLE_MAPS_API_KEY` to show the 12 Things venue map.
              </Text>
            </div>
          </div>
        ) : loadError ? (
          <div
            style={{
              minHeight: isMobile ? 320 : 420,
              display: "grid",
              placeItems: "center",
              padding: 24,
              textAlign: "center",
            }}
          >
            <div>
              <EnvironmentOutlined style={{ fontSize: 22, color: "#4F6F86", marginBottom: 10 }} />
              <Text strong style={{ display: "block", marginBottom: 6 }}>
                Map could not load
              </Text>
              <Text style={{ color: "#6B655D" }}>
                Check the current Google Maps browser key restrictions.
              </Text>
            </div>
          </div>
        ) : !isLoaded ? (
          <div
            style={{
              minHeight: isMobile ? 320 : 420,
              display: "grid",
              placeItems: "center",
            }}
          >
            <Text strong>Loading map…</Text>
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: isMobile ? "320px" : "420px" }}
            center={MAP_DEFAULT_CENTER}
            zoom={MAP_DEFAULT_ZOOM}
            options={TWELVE_THINGS_MAP_OPTIONS}
            onLoad={handleMapLoad}
          >
            {mappedPlaces.map((place) => {
              const pinSet = pinIcons[place._mapCategory];
              return (
                <MarkerF
                  key={place.id || place.slug || place.name}
                  position={place._latlng}
                  title={place.name}
                  icon={selectedPlace?.id === place.id ? pinSet?.active : pinSet?.default}
                  onClick={() => onSelectPlace(place)}
                />
              );
            })}

            {selectedPlace?._latlng ? (
              <InfoWindowF
                position={selectedPlace._latlng}
                options={{
                  pixelOffset: window.google
                    ? new window.google.maps.Size(0, -34)
                    : undefined,
                  disableAutoPan: isMobile,
                }}
              >
                <div
                  style={{
                    minWidth: isMobile ? 180 : 220,
                    maxWidth: isMobile ? 220 : 260,
                    padding: 2,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      marginBottom: 8,
                    }}
                  >
                    {selectedPlace.logo ? (
                      <div
                        style={{
                          width: 54,
                          height: 54,
                          flex: "0 0 54px",
                          borderRadius: 16,
                          background: "rgba(255,255,255,0.96)",
                          border: "1px solid rgba(47,62,58,0.08)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={selectedPlace.logo}
                          alt={`${selectedPlace.name} logo`}
                          style={{
                            maxWidth: 54,
                            maxHeight: 54,
                            width: "auto",
                            height: "auto",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                    ) : null}
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <Text
                        style={{
                          display: "block",
                          color: "#8B5A3C",
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: 1,
                          marginBottom: 4,
                        }}
                      >
                        {TWELVE_THINGS_MAP_CATEGORIES[selectedPlace._mapCategory]?.label ||
                          "Venue"}
                      </Text>
                      <Title
                        level={5}
                        style={{
                          marginTop: 0,
                          marginBottom: 6,
                          fontSize: 18,
                          color: "#201B17",
                        }}
                      >
                        {selectedPlace.name}
                      </Title>
                    </div>
                  </div>
                  <Paragraph
                    style={{
                      marginBottom: selectedPlaceTags.length ? 10 : 12,
                      color: "#2B241E",
                      fontSize: 13,
                      lineHeight: 1.5,
                      fontWeight: 500,
                    }}
                  >
                    {selectedPlace._primaryOffer}
                  </Paragraph>
                  {selectedPlaceTags.length ? (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 6,
                        marginBottom: 12,
                      }}
                    >
                      {selectedPlaceTags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            borderRadius: 999,
                            padding: "4px 8px",
                            background: "#F5E8C9",
                            color: "#6F5235",
                            fontSize: 11,
                            fontWeight: 700,
                            lineHeight: 1.1,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {selectedPlaceInstagramHref ? (
                      <a
                        href={selectedPlaceInstagramHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minHeight: 34,
                          padding: "0 12px",
                          borderRadius: 999,
                          border: "1px solid rgba(47,62,58,0.12)",
                          background: "rgba(255,255,255,0.9)",
                          color: "#2B241E",
                          fontSize: 12,
                          fontWeight: 700,
                          textDecoration: "none",
                        }}
                      >
                        Instagram
                      </a>
                    ) : null}
                    {selectedPlaceDirectionsHref ? (
                      <a
                        href={selectedPlaceDirectionsHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minHeight: 34,
                          padding: "0 12px",
                          borderRadius: 999,
                          border: "1px solid #2F3E3A",
                          background: "#2F3E3A",
                          color: "#FFF9F1",
                          fontSize: 12,
                          fontWeight: 700,
                          textDecoration: "none",
                        }}
                      >
                        Directions
                      </a>
                    ) : null}
                  </div>
                </div>
              </InfoWindowF>
            ) : null}
          </GoogleMap>
        )}
      </div>
    </div>
  );
}

function TwelveThingsCard({ group, places, isMobile }) {
  const mappedPlaces = useMemo(
    () => getTwelveThingsMappedPlaces(places),
    [places],
  );
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);

  useEffect(() => {
    setSelectedPlaceId((current) => {
      if (current && mappedPlaces.some((place) => place.id === current)) {
        return current;
      }

      return mappedPlaces[0]?.id || null;
    });
  }, [mappedPlaces]);

  const selectedPlace = useMemo(
    () =>
      mappedPlaces.find((place) => place.id === selectedPlaceId) ||
      mappedPlaces[0] ||
      null,
    [mappedPlaces, selectedPlaceId],
  );

  const selectPlace = useCallback((place) => {
    if (!place) return;
    setSelectedPlaceId(place.id);
  }, []);

  const selectPlaceByName = useCallback((name) => {
    const normalizedName = normalizeTag(name);
    const match = mappedPlaces.find((place) => {
      const normalizedPlaceName = normalizeTag(place.name);
      return (
        normalizedPlaceName === normalizedName ||
        normalizedPlaceName.includes(normalizedName) ||
        normalizedName.includes(normalizedPlaceName)
      );
    });

    if (match) {
      setSelectedPlaceId(match.id);
    }
  }, [mappedPlaces]);

  const venueHighlightStyle = {
    display: "inline",
    padding: 0,
    margin: 0,
    border: "none",
    borderRadius: 0,
    background: "linear-gradient(180deg, transparent 58%, rgba(229, 189, 99, 0.75) 58%)",
    color: "#3A2B1D",
    fontSize: "0.95em",
    fontWeight: 700,
    lineHeight: "inherit",
    cursor: "pointer",
    boxShadow: "none",
    textDecoration: "none",
  };

  const VenueHighlight = ({ name }) => (
    <button
      type="button"
      onClick={() => selectPlaceByName(name)}
      style={venueHighlightStyle}
    >
      {name}
    </button>
  );

  return (
    <Card
      key={group.key}
      id={`best-for-${group.key}`}
      style={{
        borderRadius: 24,
        border: "1px solid rgba(47,62,58,0.08)",
        background: "linear-gradient(180deg, #fffdf9 0%, #faf4eb 100%)",
      }}
      bodyStyle={{ padding: 24 }}
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={9}>
          <Text
            style={{
              display: "block",
              color: "#8B5A3C",
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 10,
              textTransform: "uppercase",
              letterSpacing: 1.4,
            }}
          >
            Main best for
          </Text>
          <Title level={2} style={{ marginTop: 0, marginBottom: 12 }}>
            {group.label}
          </Title>
          <Paragraph style={{ color: "#5C5953", marginBottom: 14 }}>
            {places.length} venues include this as one of their best-for tags.
          </Paragraph>

          <div style={{ display: "grid", gap: 12 }}>
            <div
              style={{
                padding: isMobile ? "16px 14px" : "18px 20px",
                borderRadius: 18,
                border: "1px solid rgba(47,62,58,0.08)",
                background: "rgba(255,255,255,0.72)",
              }}
            >
              <Text
                style={{
                  display: "block",
                  marginBottom: 8,
                  color: "#8B5A3C",
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1.1,
                }}
              >
                Morning Start
              </Text>
              <Paragraph style={{ marginBottom: 0, color: "#2B241E", lineHeight: 1.75 }}>
                Start your morning at <VenueHighlight name="Living Room Concept Store" />
                with 10% off coffee and brunch before picking up a scooter from
                <VenueHighlight name="GIK Bike Rentals" /> with 25% off rentals.
              </Paragraph>
            </div>

            <div
              style={{
                padding: isMobile ? "16px 14px" : "18px 20px",
                borderRadius: 18,
                border: "1px solid rgba(47,62,58,0.08)",
                background: "rgba(255,255,255,0.72)",
              }}
            >
              <Text
                style={{
                  display: "block",
                  marginBottom: 8,
                  color: "#8B5A3C",
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1.1,
                }}
              >
                Wellness Scene
              </Text>
              <Paragraph style={{ marginBottom: 0, color: "#2B241E", lineHeight: 1.75 }}>
                <VenueHighlight name="Pura Pilates" /> — 10% off
                <br />
                <VenueHighlight name="Sarana" /> — 20% off spa treatments
                <br />
                <VenueHighlight name="Frosty's" /> — 10% off entry fees and memberships
                <br />
                <VenueHighlight name="Spa Station Midigama" /> — 10% off treatments + free aromatherapy
                <br />
                <VenueHighlight name="Coconut Court" /> — Exclusive member rates on pickleball
              </Paragraph>
            </div>

            <div
              style={{
                padding: isMobile ? "16px 14px" : "18px 20px",
                borderRadius: 18,
                border: "1px solid rgba(47,62,58,0.08)",
                background: "rgba(255,255,255,0.72)",
              }}
            >
              <Text
                style={{
                  display: "block",
                  marginBottom: 8,
                  color: "#8B5A3C",
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1.1,
                }}
              >
                Local Experiences
              </Text>
              <Paragraph style={{ marginBottom: 0, color: "#2B241E", lineHeight: 1.75 }}>
                <VenueHighlight name="Kumbuk Community" /> — 10% off
                <br />
                <VenueHighlight name="Palm and Paint" /> — 10% off
              </Paragraph>
            </div>
          </div>
        </Col>

        <Col xs={24} lg={15}>
          <TwelveThingsMap
            mappedPlaces={mappedPlaces}
            selectedPlace={selectedPlace}
            onSelectPlace={selectPlace}
            isMobile={isMobile}
          />

          <div
            style={{
              width: "100%",
              marginLeft: 0,
              display: "grid",
              gap: 12,
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))",
            }}
          >
            <div
              style={{
                padding: isMobile ? "16px 14px" : "18px 20px",
                borderRadius: 18,
                border: "1px solid rgba(47,62,58,0.08)",
                background: "rgba(255,255,255,0.72)",
              }}
            >
              <Text
                style={{
                  display: "block",
                  marginBottom: 8,
                  color: "#8B5A3C",
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1.1,
                }}
              >
                Shops And Lifestyle
              </Text>
              <Paragraph style={{ marginBottom: 0, color: "#2B241E", lineHeight: 1.75 }}>
                <VenueHighlight name="Qamar by Zan" /> — 70% off selected bills + complimentary jewellery-making
                <br />
                <VenueHighlight name="Yiva Essentials" /> — 10% off Yiva products and 5% off larger purchases
                <br />
                <VenueHighlight name="Gusta" /> — 5-10% off selected items
              </Paragraph>
            </div>

            <div
              style={{
                padding: isMobile ? "16px 14px" : "18px 20px",
                borderRadius: 18,
                border: "1px solid rgba(47,62,58,0.08)",
                background: "rgba(255,255,255,0.72)",
              }}
            >
              <Text
                style={{
                  display: "block",
                  marginBottom: 8,
                  color: "#8B5A3C",
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1.1,
                }}
              >
                Evening Wind Down
              </Text>
              <Paragraph style={{ marginBottom: 0, color: "#2B241E", lineHeight: 1.75 }}>
                As evening arrives, enjoy dinner at <VenueHighlight name="Hakuna Matata" /> with 10% off,
                and if you&apos;re staying a little longer, <VenueHighlight name="Global Surf Lodge" /> offers
                10% off rooms and 10% off yoga classes.
              </Paragraph>
            </div>
          </div>
        </Col>
      </Row>

      <EditorialNextArticle
        href={TWELVE_THINGS_POST_PATH}
        kicker="Discover More"
        title="12 Ways to Experience Ahangama"
        image={TWELVE_THINGS_POST_IMAGE}
        ctaLabel="Read now ->"
        style={{
          marginTop: 24,
          marginBottom: 0,
          borderRadius: 22,
          overflow: "hidden",
        }}
      />
    </Card>
  );
}

function OfferPills({ place }) {
  const offerTags = Array.isArray(place.offers)
    ? place.offers.filter(Boolean).slice(0, 2)
    : [];

  if (!offerTags.length && !place.offer) return null;

  const fallbackTag =
    typeof place.offer === "string" && place.offer.trim()
      ? place.offer.trim()
      : null;

  const tags = offerTags.length ? offerTags : [fallbackTag];

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
      {tags.filter(Boolean).map((tag) => (
        <span
          key={tag}
          style={{
            background: "#f3ecd9",
            color: "#6F5A33",
            borderRadius: 999,
            padding: "6px 10px",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function PlaceLinks({ places }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {places.map((place) => {
        const href = getPlaceHref(place);
        const visibleTags = getVisibleInfoTags(place, 2);
        const content = (
          <>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              {place.logo ? (
                <div
                  style={{
                    width: 50,
                    height: 50,
                    flex: "0 0 50px",
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.92)",
                    border: "1px solid rgba(47,62,58,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={place.logo}
                    alt={`${place.name} logo`}
                    style={{
                      maxWidth: 50,
                      maxHeight: 50,
                      width: "auto",
                      height: "auto",
                      objectFit: "contain",
                    }}
                  />
                </div>
              ) : null}
              <div style={{ minWidth: 0, flex: 1 }}>
                <Text
                  style={{
                    display: "block",
                    color: "#2F3E3A",
                    fontSize: 16,
                    fontWeight: 700,
                    marginBottom: 4,
                  }}
                >
                  {place.name}
                </Text>
                <Text style={{ color: "#6C665E", fontSize: 13 }}>
                  {place.area || "Ahangama"}
                  {visibleTags.length
                    ? ` • ${visibleTags.join(" • ")}`
                    : ""}
                </Text>
                <OfferPills place={place} />
              </div>
            </div>
          </>
        );

        const cardStyle = {
          display: "block",
          padding: "14px 16px",
          borderRadius: 16,
          border: "1px solid rgba(47,62,58,0.08)",
          background: "rgba(255,255,255,0.72)",
          textDecoration: "none",
          color: "inherit",
        };

        if (!href) {
          return (
            <div key={place.id || place.slug || place.name} style={cardStyle}>
              {content}
            </div>
          );
        }

        return (
          <a
            key={place.id || place.slug || place.name}
            href={href}
            style={cardStyle}
          >
            {content}
          </a>
        );
      })}
    </div>
  );
}

function TwelveThingsGroupedPlaceLinks({ places }) {
  const groupedPlaces = useMemo(() => {
    const groups = TWELVE_THINGS_CATEGORY_ORDER.map((key) => ({
      key,
      label: TWELVE_THINGS_MAP_CATEGORIES[key]?.label || key,
      color: TWELVE_THINGS_MAP_CATEGORIES[key]?.color || "#4F6F86",
      places: [],
    }));

    const groupMap = new Map(groups.map((group) => [group.key, group]));

    places.forEach((place) => {
      const categoryKey = getTwelveThingsMapCategory(place);
      const targetGroup = groupMap.get(categoryKey) || groupMap.get("experiences");
      targetGroup?.places.push(place);
    });

    return groups.filter((group) => group.places.length > 0);
  }, [places]);

  return (
    <div style={{ display: "grid", gap: 18 }}>
      {groupedPlaces.map((group) => (
        <section key={group.key} style={{ display: "grid", gap: 10 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              paddingBottom: 8,
              borderBottom: "1px solid rgba(47,62,58,0.08)",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: group.color,
                flex: "0 0 10px",
              }}
            />
            <Text
              style={{
                color: "#2F3E3A",
                fontSize: 13,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1.1,
              }}
            >
              {group.label} ({group.places.length})
            </Text>
          </div>

          <PlaceLinks places={group.places} />
        </section>
      ))}
    </div>
  );
}

export default function FullListPage() {
  const { places: allPlaces } = usePlaces();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const passCtaUrl = buildPassCtaUrl();
  const canonical = absUrl(FULL_LIST_PATH);

  const passPlaces = useMemo(() => getPassPlaces(allPlaces), [allPlaces]);
  const { topBestFors, groups, otherPlaces } = useMemo(
    () => buildBestForGroups(passPlaces),
    [passPlaces],
  );
  const twelveThingsPlaces = useMemo(
    () => getTwelveThingsPlaces(passPlaces),
    [passPlaces],
  );

  return (
    <SiteLayout>
      <Seo
        title="Ahangama Pass Full List"
        description="Browse the full list of Ahangama Pass partners, organized by the top best-for categories from the live venue data."
        canonical={canonical}
      />

      <div className="dm-heroCut" />
      <div className="dm-canvas">
        <div className="dm-wrap">
          <Card
            style={{
              borderRadius: 30,
              border: "1px solid rgba(47,62,58,0.08)",
              background:
                "linear-gradient(135deg, rgba(245,236,225,0.94) 0%, rgba(255,251,245,0.98) 100%)",
              overflow: "hidden",
              marginBottom: 28,
            }}
            bodyStyle={{ padding: 30 }}
          >
            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} xl={16}>
                <Space wrap size={[8, 8]} style={{ marginBottom: 12 }}>
                  <Tag style={{ borderRadius: 999, padding: "6px 12px" }}>
                    Full List
                  </Tag>
                  <Tag style={{ borderRadius: 999, padding: "6px 12px" }}>
                    Top 10 best-for groups
                  </Tag>
                </Space>

                <Title
                  level={1}
                  style={{
                    marginTop: 0,
                    marginBottom: 12,
                    fontSize: 42,
                    lineHeight: 1.03,
                  }}
                >
                  Ahangama Pass Holders Full List
                </Title>

                <Paragraph
                  style={{
                    fontSize: 18,
                    lineHeight: 1.8,
                    color: "#5C5953",
                    marginBottom: 18,
                  }}
                >
                  The full pass-partner list, organized by the top ten
                  `best_for` themes with the highest occurrence in the live
                  Ahangama data. Each venue is assigned to its strongest
                  matching theme so the list stays readable instead of
                  duplicating cards across every tag.
                </Paragraph>

                <Space wrap size={12}>
                  <Button
                    href="/"
                    icon={<ArrowRightOutlined />}
                    style={{ borderRadius: 999 }}
                  >
                    Back home
                  </Button>
                  <Button
                    type="primary"
                    href={passCtaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    icon={<QrcodeOutlined />}
                    onClick={() => {
                      trackPassCtaClick({
                        ctaLocation: "full_list_page",
                        destinationUrl: passCtaUrl,
                      });
                    }}
                    style={{
                      borderRadius: 999,
                      background: "linear-gradient(135deg, #FFD700, #FFA500)",
                      border: "none",
                    }}
                  >
                    Get The Pass
                  </Button>
                </Space>
              </Col>

              <Col xs={24} xl={8}>
                <Card
                  style={{
                    borderRadius: 24,
                    border: "1px solid rgba(47,62,58,0.08)",
                    background: "rgba(255,255,255,0.7)",
                  }}
                  bodyStyle={{ padding: 22 }}
                >
                  <Text
                    style={{
                      display: "block",
                      color: "#8B5A3C",
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 1.2,
                      marginBottom: 10,
                    }}
                  >
                    Top best-for tags
                  </Text>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {topBestFors.map((item) => (
                      <a
                        key={item.key}
                        href={`#best-for-${item.key}`}
                        style={{ textDecoration: "none" }}
                      >
                        <span
                          style={{
                            borderRadius: 999,
                            padding: "10px 14px",
                            margin: 0,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "linear-gradient(180deg, #fffaf1 0%, #f3e4ca 100%)",
                            border: "1px solid rgba(139,90,60,0.18)",
                            color: "#6F5235",
                            fontSize: 13,
                            fontWeight: 700,
                            lineHeight: 1,
                            letterSpacing: 0.2,
                            boxShadow: "0 6px 14px rgba(111,82,53,0.08)",
                          }}
                        >
                          {item.label} ({item.count})
                        </span>
                      </a>
                    ))}
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>

          <Card
            style={{
              borderRadius: 24,
              border: "1px solid rgba(47,62,58,0.08)",
              background: "rgba(255,255,255,0.86)",
              marginBottom: 28,
            }}
            bodyStyle={{ padding: isMobile ? 20 : 24 }}
          >
            <Row gutter={[20, 20]} align="middle" justify="space-between">
              <Col xs={24} lg={16}>
                <Text
                  style={{
                    display: "block",
                    color: "#8B5A3C",
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 1.2,
                    marginBottom: 8,
                  }}
                >
                  Shared Google Map
                </Text>
                <Title
                  level={3}
                  style={{
                    marginTop: 0,
                    marginBottom: 8,
                    fontSize: isMobile ? 24 : 28,
                    lineHeight: 1.1,
                  }}
                >
                  Save all pass venues to your Google Maps
                </Title>
                <Paragraph
                  style={{
                    marginBottom: 0,
                    color: "#6B655D",
                    fontSize: 15,
                    lineHeight: 1.75,
                    maxWidth: 760,
                  }}
                >
                  Open the shared Google Map for all venues on the pass, then
                  save it in Google Maps before you head out.
                  {isMobile
                    ? " On mobile, it opens directly in the Google Maps app."
                    : ""}
                </Paragraph>
              </Col>

              <Col xs={24} lg={8}>
                <Space wrap size={12}>
                  <Button
                    href={SHARED_GOOGLE_MAP_URL}
                    target={isMobile ? undefined : "_blank"}
                    rel={isMobile ? undefined : "noopener noreferrer"}
                    icon={<EnvironmentOutlined />}
                    type="primary"
                    style={{
                      borderRadius: 999,
                      background: "#2F3E3A",
                      borderColor: "#2F3E3A",
                    }}
                  >
                    Open Shared Google Map
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {groups.map((group) => {
              const displayPlaces =
                group.key === TWELVE_THINGS_GROUP_KEY
                  ? twelveThingsPlaces
                  : group.places;

              if (group.key === TWELVE_THINGS_GROUP_KEY) {
                return (
                  <TwelveThingsCard
                    key={group.key}
                    group={group}
                    places={displayPlaces}
                    isMobile={isMobile}
                  />
                );
              }

              return (
                <Card
                  key={group.key}
                  id={`best-for-${group.key}`}
                  style={{
                    borderRadius: 24,
                    border: "1px solid rgba(47,62,58,0.08)",
                    background:
                      "linear-gradient(180deg, #fffdf9 0%, #faf4eb 100%)",
                  }}
                  bodyStyle={{ padding: 24 }}
                >
                  <Row gutter={[24, 24]}>
                    <Col xs={24} lg={7}>
                      <Text
                        style={{
                          display: "block",
                          color: "#8B5A3C",
                          fontSize: 12,
                          fontWeight: 700,
                          marginBottom: 10,
                          textTransform: "uppercase",
                          letterSpacing: 1.4,
                        }}
                      >
                        Main best for
                      </Text>
                      <Title level={2} style={{ marginTop: 0, marginBottom: 12 }}>
                        {group.label}
                      </Title>
                      <Paragraph style={{ color: "#5C5953", marginBottom: 0 }}>
                        {group.count} venues include this as one of their best-for
                        tags.
                      </Paragraph>
                    </Col>
                    <Col xs={24} lg={17}>
                      <PlaceLinks places={displayPlaces} />
                    </Col>
                  </Row>
                </Card>
              );
            })}

            {otherPlaces.length ? (
              <Card
                style={{
                  borderRadius: 24,
                  border: "1px solid rgba(47,62,58,0.08)",
                  background:
                    "linear-gradient(180deg, #fffdf9 0%, #faf4eb 100%)",
                }}
                bodyStyle={{ padding: 24 }}
              >
                <Title level={3} style={{ marginTop: 0 }}>
                  More venues
                </Title>
                <Paragraph style={{ color: "#5C5953" }}>
                  These partners are in the pass list but do not map cleanly
                  into the current top ten best-for groups.
                </Paragraph>
                <PlaceLinks places={otherPlaces} />
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
