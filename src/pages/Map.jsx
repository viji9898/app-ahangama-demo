import React, { useMemo, useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { Card, Input, Space, Tag, Typography } from "antd";
import { EnvironmentOutlined, SearchOutlined } from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { PLACES } from "../data/places";

const { Title, Text } = Typography;

const MAP_CENTER = { lat: 5.9699, lng: 80.3666 }; // Ahangama-ish center
const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoidmlqaXciLCJhIjoiY21qZHlrbHNoMGM5ejNlcHE5dDY4a2V2aiJ9.9H0iEZmTR17WCYkBki-XRQ";

const CATEGORY_KEYS = [
  { key: "all", label: "All" },
  { key: "eat", label: "Eat" },
  { key: "stays", label: "Stays" },
  { key: "experiences", label: "Experiences" },
  { key: "culture", label: "Culture" },
  { key: "surf", label: "Surf" },
  { key: "wellness", label: "Wellness" },
  { key: "work-long-stays", label: "Work & Long Stays" },
  { key: "getting-around", label: "Getting Around" },
  { key: "shops-essentials", label: "Shops & Essentials" },
  { key: "community", label: "Community" },
];

function safeLatLng(p) {
  const lat = p?.position?.lat ?? p?.lat;
  const lng = p?.position?.lng ?? p?.lng;
  if (typeof lat !== "number" || typeof lng !== "number") return null;
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { lat, lng };
}

export default function MapPage() {
  const canonical = absUrl("/map");
  const token = import.meta.env.VITE_MAPBOX_TOKEN || MAPBOX_ACCESS_TOKEN;
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const [category, setCategory] = useState("all");
  const [q, setQ] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);

  const places = useMemo(() => {
    const query = q.trim().toLowerCase();

    return PLACES.filter((p) => p.destinationSlug === "ahangama")
      .filter((p) => {
        if (category === "all") return true;
        return p.category === category;
      })
      .filter((p) => {
        if (!query) return true;
        const hay = `${p.name ?? ""} ${p.area ?? ""} ${p.category ?? ""} ${
          p.description ?? ""
        }`.toLowerCase();
        return hay.includes(query);
      })
      .map((p) => ({ ...p, _latlng: safeLatLng(p) }))
      .filter((p) => !!p._latlng);
  }, [category, q]);

  // Initialize Mapbox GL map
  useEffect(() => {
    if (!token || !mapContainerRef.current) return;

    // Set access token
    mapboxgl.accessToken = token;

    // Create the map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [MAP_CENTER.lng, MAP_CENTER.lat], // [lng, lat]
      zoom: 12.3,
    });

    // Handle map load
    mapRef.current.on("load", () => {
      setMapLoaded(true);
    });

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [token]);

  // Update markers when places change
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    places.forEach((place) => {
      if (!place._latlng) return;

      let marker;

      // Special custom marker for coffee places
      if (place.id === "cactus-cafe" || place.id === "marshmellow-surf-cafe") {
        const customElement = document.createElement("div");
        customElement.className = "coffee-marker";
        const displayName =
          place.id === "cactus-cafe" ? "Cactus" : "Marshmellow";
        customElement.innerHTML = `
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            transform-origin: bottom center;
            transition: transform 0.3s ease;
          ">
            <div style="
              background: #c46a3a;
              border-radius: 4px;
              padding: 4px;
              box-shadow: 0 1px 5px rgba(0,0,0,0.3);
              border: 1px solid white;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
                <path d="M2 21V19H20V21H2M20 8V5L18 5V8H20M20 3A2 2 0 0 1 22 5V8A2 2 0 0 1 20 10H18V13A4 4 0 0 1 14 17H8A4 4 0 0 1 4 13V3H20M16 5H6V13A2 2 0 0 0 8 15H14A2 2 0 0 0 16 13V5Z"/>
              </svg>
            </div>
            <div style="
              background: rgba(0,0,0,0.8);
              color: white;
              padding: 1px 3px;
              border-radius: 2px;
              font-size: 6px;
              font-weight: bold;
              margin-top: 4px;
              white-space: nowrap;
            ">
              ${displayName}
            </div>
          </div>
        `;

        marker = new mapboxgl.Marker({
          element: customElement,
          anchor: "bottom",
        });

        // Add zoom-based scaling
        const updateScale = () => {
          const zoom = mapRef.current.getZoom();
          // Scale from 0.5 to 2.0 based on zoom level (10-18)
          const minZoom = 10;
          const maxZoom = 18;
          const minScale = 0.5;
          const maxScale = 2.0;

          const normalizedZoom = Math.max(
            0,
            Math.min(1, (zoom - minZoom) / (maxZoom - minZoom))
          );
          const scale = minScale + (maxScale - minScale) * normalizedZoom;

          const markerElement = customElement.querySelector("div");
          if (markerElement) {
            markerElement.style.transform = `scale(${scale})`;
          }
        };

        // Initial scale
        updateScale();

        // Update scale on zoom
        mapRef.current.on("zoom", updateScale);
      } else {
        // Default colored marker for other places
        marker = new mapboxgl.Marker({
          color: getCategoryColor(place.category),
        });
      }

      marker
        .setLngLat([place._latlng.lng, place._latlng.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div style="padding: 8px;">
                <h4 style="margin: 0 0 4px 0; font-size: 14px;">${
                  place.name
                }</h4>
                <p style="margin: 0; color: #666; font-size: 12px;">${
                  place.category
                } • ${place.area || "Ahangama"}</p>
                ${
                  place.description
                    ? `<p style="margin: 8px 0 0 0; font-size: 13px;">${place.description}</p>`
                    : ""
                }
              </div>`
          )
        )
        .addTo(mapRef.current);

      markersRef.current.push(marker);
    });
  }, [places, mapLoaded]);

  // Helper function to get category colors
  const getCategoryColor = (category) => {
    const colors = {
      eat: "#c46a3a",
      stays: "#6b7c5a",
      experiences: "#3e5f73",
      surf: "#3e5f73",
      wellness: "#7a6a86",
      culture: "#7a6a86",
      "work-long-stays": "#6b7c5a",
      "getting-around": "#4f6f86",
      "shops-essentials": "#6b6f6a",
      community: "#4f6f86",
    };
    return colors[category] || "#4f6f86";
  };

  return (
    <SiteLayout>
      <Seo
        title="Map — Ahangama"
        description="A calm, curated map of places in Ahangama — designed to guide, not overwhelm."
        canonical={canonical}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Map — Ahangama",
          url: canonical,
        }}
      />

      <div className="map-wrap">
        <div className="map-shell">
          {/* Left panel */}
          <div className="map-panel">
            <Card className="map-card" bodyStyle={{ padding: 16 }}>
              <Tag className="map-pill">AHANGAMA</Tag>
              <Title level={2} className="map-title" style={{ margin: 0 }}>
                Map
              </Title>
              <Text type="secondary">
                A curated view — with just enough detail to move through town
                well.
              </Text>

              <div style={{ height: 12 }} />

              <Input
                size="large"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                prefix={<SearchOutlined />}
                placeholder="Search cafés, areas, stays…"
                className="map-search"
              />

              <div style={{ height: 12 }} />

              <div className="map-filters">
                {CATEGORY_KEYS.map((c) => (
                  <button
                    key={c.key}
                    className={`map-filter ${
                      category === c.key ? "is-active" : ""
                    }`}
                    onClick={() => setCategory(c.key)}
                    type="button"
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <div style={{ height: 12 }} />

              <div className="map-resultsMeta">
                <Text type="secondary">
                  Showing <strong>{places.length}</strong> places
                </Text>
              </div>

              {/* Places list */}
              <div className="map-miniList">
                {places.slice(0, 10).map((p) => (
                  <button
                    key={p.id || p.slug || p.name}
                    className="map-miniRow"
                    onClick={() => {
                      if (mapRef.current && p._latlng) {
                        mapRef.current.flyTo({
                          center: [p._latlng.lng, p._latlng.lat],
                          zoom: 15,
                        });
                      }
                    }}
                    type="button"
                  >
                    <span className="map-miniName">{p.name}</span>
                    <span className="map-miniMeta">{p.area || p.category}</span>
                  </button>
                ))}
                {places.length > 10 && (
                  <Text
                    type="secondary"
                    style={{ display: "block", marginTop: 10 }}
                  >
                    Click places to zoom. Showing first 10 of {places.length}.
                  </Text>
                )}
              </div>
            </Card>
          </div>

          {/* Interactive Map */}
          <div className="map-canvas">
            {!token ? (
              <Card className="map-card" bodyStyle={{ padding: 16 }}>
                <Title level={4} style={{ marginTop: 0 }}>
                  Mapbox token missing
                </Title>
                <Text type="secondary">
                  Add <Text code>VITE_MAPBOX_TOKEN</Text> to{" "}
                  <Text code>.env.local</Text>, then restart.
                </Text>
              </Card>
            ) : (
              <div
                ref={mapContainerRef}
                style={{
                  width: "100%",
                  height: "640px",
                  borderRadius: "22px",
                  overflow: "hidden",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
