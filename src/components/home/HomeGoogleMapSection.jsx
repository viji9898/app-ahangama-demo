import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  GoogleMap,
  MarkerF,
  OverlayViewF,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Button, Card, Space, Tag, Typography } from "antd";
import { EnvironmentOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { usePlaces } from "../../app/placesContext";
import { shouldShowPlace } from "../../data/placeStatus";
import HomeGoogleMapMarker from "./HomeGoogleMapMarker";

const { Title, Text } = Typography;

const DEFAULT_CENTER = { lat: 5.9699, lng: 80.3666 };
const OVERLAY_PANE = "overlayMouseTarget";
const DEFAULT_ZOOM = 14;
const AHANGAMA_GOOGLE_MAP_URL = "https://maps.app.goo.gl/wmdoPd4SQroGZ6Jv5";

const MAP_OPTIONS = {
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

function safeLatLng(place) {
  const lat = place?.position?.lat ?? place?.lat;
  const lng = place?.position?.lng ?? place?.lng;

  if (typeof lat !== "number" || typeof lng !== "number") return null;
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

  return { lat, lng };
}

function getOfferSummary(place) {
  const offerCandidates =
    Array.isArray(place?.offers) && place.offers.length > 0
      ? place.offers.filter(Boolean)
      : [place?.offer].filter(Boolean);

  const cleanedOffer = offerCandidates
    .map((entry) => String(entry).trim())
    .find((entry) => entry.length > 0);

  if (!cleanedOffer) return "";

  const compactOffer = cleanedOffer
    .split(/\s*[•|,;]\s*/)
    .map((part) => part.trim())
    .find(Boolean);

  if (!compactOffer) return "";

  const lower = compactOffer.toLowerCase();

  const replacements = [
    { pattern: /(\d+)%\s*off.*$/, value: (_, amount) => `${amount}% off` },
    { pattern: /late check[- ]?out.*/i, value: () => "Late checkout" },
    { pattern: /early check[- ]?in.*/i, value: () => "Early check-in" },
    { pattern: /free drink.*/i, value: () => "Free drink" },
    { pattern: /free coffee.*/i, value: () => "Free coffee" },
    { pattern: /free smoothie.*/i, value: () => "Free smoothie" },
    { pattern: /room.*discount.*/i, value: () => "Room discount" },
    { pattern: /room upgrade.*/i, value: () => "Room upgrade" },
  ];

  for (const replacement of replacements) {
    const match = lower.match(replacement.pattern);
    if (match) {
      return replacement.value(...match).slice(0, 26);
    }
  }

  const normalized = compactOffer.replace(/\s+/g, " ").trim();
  return normalized.length > 26
    ? `${normalized.slice(0, 23).trim()}...`
    : normalized;
}

function getPlacePriority(place, selectedId, hoveredId) {
  let priority = place.priorityScore || 0;

  if (place.id === selectedId) priority += 10000;
  if (place.id === hoveredId) priority += 8000;
  if (place.isFeatured) priority += 2500;
  if (place.isPassVenue) priority += 1800;
  if (place.staffPick) priority += 900;
  if (place.passPriority) priority += place.passPriority;

  return priority;
}

function getLabelDensitySettings(zoom) {
  if (zoom < 13)
    return { maxLabels: 2, columns: 3, rows: 2, featuredOnly: true };
  if (zoom < 15)
    return { maxLabels: 5, columns: 4, rows: 3, featuredOnly: false };
  if (zoom < 16.5)
    return { maxLabels: 8, columns: 5, rows: 4, featuredOnly: false };
  return { maxLabels: 12, columns: 6, rows: 5, featuredOnly: false };
}

function isInBounds(place, bounds) {
  if (!bounds) return true;

  const north = bounds.getNorthEast().lat();
  const east = bounds.getNorthEast().lng();
  const south = bounds.getSouthWest().lat();
  const west = bounds.getSouthWest().lng();

  return (
    place._latlng.lat <= north &&
    place._latlng.lat >= south &&
    place._latlng.lng <= east &&
    place._latlng.lng >= west
  );
}

function getCellKey(place, bounds, columns, rows) {
  if (!bounds) return place.id;

  const north = bounds.getNorthEast().lat();
  const east = bounds.getNorthEast().lng();
  const south = bounds.getSouthWest().lat();
  const west = bounds.getSouthWest().lng();
  const latSpan = Math.max(north - south, 0.0001);
  const lngSpan = Math.max(east - west, 0.0001);
  const x = Math.min(
    columns - 1,
    Math.max(0, Math.floor(((place._latlng.lng - west) / lngSpan) * columns)),
  );
  const y = Math.min(
    rows - 1,
    Math.max(0, Math.floor(((north - place._latlng.lat) / latSpan) * rows)),
  );

  return `${x}:${y}`;
}

function createPinIcon(googleMaps, { isActive, zoom }) {
  const scale = zoom < 13 ? 0.82 : zoom < 16 ? 0.92 : 1;
  const size = Math.round((isActive ? 32 : 28) * scale);
  const dotSize = Math.round(size * 0.3);
  const svg = encodeURIComponent(`
    <svg width="${size}" height="${size + 10}" viewBox="0 0 36 46" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="pinShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.22)"/>
        </filter>
      </defs>
      <path filter="url(#pinShadow)" d="M18 1C9.163 1 2 8.163 2 17c0 10.95 12.5 23.659 14.7 25.804a1.86 1.86 0 0 0 2.6 0C21.5 40.659 34 27.95 34 17 34 8.163 26.837 1 18 1Z" fill="#D93025"/>
      <circle cx="18" cy="17" r="${dotSize}" fill="white"/>
    </svg>
  `);

  return {
    url: `data:image/svg+xml;charset=UTF-8,${svg}`,
    scaledSize: new googleMaps.maps.Size(size, size + 10),
    anchor: new googleMaps.maps.Point(size / 2, size + 8),
    labelOrigin: new googleMaps.maps.Point(size / 2, 10),
  };
}

export default function HomeGoogleMapSection() {
  const { places: allPlaces } = usePlaces();
  const googleMapsApiKey =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
    import.meta.env.VITE_GOOGLE_MAPS_KEY ||
    "";

  const { isLoaded, loadError } = useJsApiLoader({
    id: "ahangama-home-google-map",
    googleMapsApiKey,
  });
  const mapRef = useRef(null);

  const places = useMemo(() => {
    return allPlaces
      .filter((place) => place.destinationSlug === "ahangama")
      .filter((place) => shouldShowPlace(place))
      .map((place) => ({
        ...place,
        _latlng: safeLatLng(place),
        _shortOffer: getOfferSummary(place),
      }))
      .filter((place) => !!place._latlng)
      .sort((left, right) => {
        const rightScore =
          (right.isFeatured ? 1000 : 0) +
          (right.staffPick ? 100 : 0) +
          (right.priorityScore || 0);
        const leftScore =
          (left.isFeatured ? 1000 : 0) +
          (left.staffPick ? 100 : 0) +
          (left.priorityScore || 0);

        if (rightScore !== leftScore) return rightScore - leftScore;
        return String(left.name || "").localeCompare(String(right.name || ""));
      });
  }, [allPlaces]);

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [hoveredPlaceId, setHoveredPlaceId] = useState(null);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [bounds, setBounds] = useState(null);

  useEffect(() => {
    if (!places.length) {
      setSelectedPlace(null);
      return;
    }

    setSelectedPlace((current) => {
      if (current && places.some((place) => place.id === current.id)) {
        return current;
      }

      return places[0];
    });
  }, [places]);

  const handleMapLoad = useCallback(
    (map) => {
      mapRef.current = map;

      if (!window.google || !places.length) return;

      const bounds = new window.google.maps.LatLngBounds();
      places.forEach((place) => {
        bounds.extend(place._latlng);
      });

      if (places.length === 1) {
        map.setCenter(places[0]._latlng);
        map.setZoom(15);
        return;
      }

      map.fitBounds(bounds, 72);
    },
    [places],
  );

  const handleMapIdle = useCallback(() => {
    if (!mapRef.current) return;

    setZoom(mapRef.current.getZoom() || DEFAULT_ZOOM);
    setBounds(mapRef.current.getBounds() || null);
  }, []);

  const handleOpenGoogleMap = useCallback(() => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = AHANGAMA_GOOGLE_MAP_URL;
      return;
    }

    window.open(AHANGAMA_GOOGLE_MAP_URL, "_blank", "noopener,noreferrer");
  }, []);

  const labelPlaces = useMemo(() => {
    const visiblePlaces = places.filter((place) => isInBounds(place, bounds));
    const { maxLabels, columns, rows, featuredOnly } =
      getLabelDensitySettings(zoom);
    const chosen = [];
    const occupiedCells = new Set();
    const forceIds = new Set(
      [selectedPlace?.id, hoveredPlaceId].filter(Boolean),
    );

    const sortedPlaces = [...visiblePlaces].sort(
      (left, right) =>
        getPlacePriority(right, selectedPlace?.id, hoveredPlaceId) -
        getPlacePriority(left, selectedPlace?.id, hoveredPlaceId),
    );

    for (const place of sortedPlaces) {
      const forced = forceIds.has(place.id);
      const eligiblePriority =
        forced ||
        !featuredOnly ||
        place.isFeatured ||
        place.isPassVenue ||
        place.staffPick;

      if (!eligiblePriority) continue;

      const cellKey = getCellKey(place, bounds, columns, rows);
      if (!forced && occupiedCells.has(cellKey)) continue;

      chosen.push(place);
      occupiedCells.add(cellKey);

      if (!forced && chosen.length >= maxLabels + forceIds.size) break;
    }

    return chosen;
  }, [bounds, hoveredPlaceId, places, selectedPlace?.id, zoom]);

  const labelIds = useMemo(
    () => new Set(labelPlaces.map((place) => place.id)),
    [labelPlaces],
  );

  const selectedIcon = useMemo(() => {
    if (!isLoaded || !window.google) return null;
    return createPinIcon(window.google, { isActive: true, zoom });
  }, [isLoaded, zoom]);

  const defaultIcon = useMemo(() => {
    if (!isLoaded || !window.google) return null;
    return createPinIcon(window.google, { isActive: false, zoom });
  }, [isLoaded, zoom]);

  return (
    <section className="home-gmap">
      <Card className="home-gmap__shell" bodyStyle={{ padding: 20 }}>
        <div className="home-gmap__header">
          <div>
            <Tag className="home-gmap__pill">Live Map</Tag>
            <Title level={3} className="home-gmap__title">
              Member Perks Allround ahangama.
            </Title>
            <Text className="home-gmap__intro">
              Active venues only, pinned around Ahangama with the current offer
              visible when you tap a marker.
            </Text>
          </div>

          <Space size={10} wrap>
            <div className="home-gmap__meta">
              <span className="home-gmap__metaValue">{places.length}</span>
              <span className="home-gmap__metaLabel">live listings</span>
            </div>
            <Button icon={<ArrowRightOutlined />} onClick={handleOpenGoogleMap}>
              Open in Google Maps
            </Button>
          </Space>
        </div>

        <div className="home-gmap__frame">
          {!googleMapsApiKey ? (
            <div className="home-gmap__state">
              <EnvironmentOutlined className="home-gmap__stateIcon" />
              <Text strong>Google Maps needs a browser key</Text>
              <Text type="secondary">
                Add VITE_GOOGLE_MAPS_API_KEY to render the home page map.
              </Text>
            </div>
          ) : loadError ? (
            <div className="home-gmap__state">
              <EnvironmentOutlined className="home-gmap__stateIcon" />
              <Text strong>Map could not load</Text>
              <Text type="secondary">
                Check the Google Maps key restrictions and try again.
              </Text>
            </div>
          ) : !isLoaded ? (
            <div className="home-gmap__state">
              <EnvironmentOutlined className="home-gmap__stateIcon" />
              <Text strong>Loading map…</Text>
            </div>
          ) : (
            <GoogleMap
              mapContainerClassName="home-gmap__map"
              center={DEFAULT_CENTER}
              zoom={DEFAULT_ZOOM}
              options={MAP_OPTIONS}
              onLoad={handleMapLoad}
              onIdle={handleMapIdle}
            >
              {places.map((place, index) => (
                <MarkerF
                  key={place.id || place.slug || place.name}
                  position={place._latlng}
                  title={place.name}
                  icon={
                    selectedPlace?.id === place.id ? selectedIcon : defaultIcon
                  }
                  zIndex={
                    selectedPlace?.id === place.id
                      ? 1000
                      : places.length - index
                  }
                  onClick={() => setSelectedPlace(place)}
                  onMouseOver={() => setHoveredPlaceId(place.id)}
                  onMouseOut={() => {
                    setHoveredPlaceId((current) =>
                      current === place.id ? null : current,
                    );
                  }}
                />
              ))}

              {labelPlaces.map((place) => (
                <OverlayViewF
                  key={`label-${place.id || place.slug || place.name}`}
                  position={place._latlng}
                  mapPaneName={OVERLAY_PANE}
                  getPixelPositionOffset={(width, height) => ({
                    x: Math.round(-(width / 2)),
                    y: Math.round(-height - (labelIds.has(place.id) ? 32 : 28)),
                  })}
                  zIndex={labelIds.has(place.id) ? 1200 : 900}
                >
                  <div className="home-gmap-markerWrap home-gmap-markerWrap--labelOnly">
                    <HomeGoogleMapMarker
                      name={place.name}
                      discount={place._shortOffer}
                      isActive={selectedPlace?.id === place.id}
                      onClick={() => setSelectedPlace(place)}
                    />
                  </div>
                </OverlayViewF>
              ))}
            </GoogleMap>
          )}
        </div>
      </Card>
    </section>
  );
}
