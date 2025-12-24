import React, { useMemo, useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { Card, Input, Space, Tag, Typography, Button } from "antd";
import { SearchOutlined, ArrowRightOutlined } from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { PLACES } from "../data/places";

const { Title, Text } = Typography;

const MAP_CENTER = { lat: 5.9699, lng: 80.3666 }; // Ahangama center-ish
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

export default function MapGoogle() {
  const canonical = absUrl("/map-google");
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
      .filter((p) => (category === "all" ? true : p.category === category))
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
      zoom: 12,
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

      // Special custom marker for Cactus
      const isCactus = place.name?.toLowerCase().includes("cactus");
      if (isCactus) {
        const customElement = document.createElement("div");
        customElement.className = "cactus-marker";
        customElement.innerHTML = `
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            transform-origin: bottom center;
          ">
            <div style="
              width: 32px;
              height: 32px;
              background-image: url('https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/cactus-logo.jpg');
              background-size: cover;
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 1px 5px rgba(0,0,0,0.3);
            "></div>
            <div style="
              background: rgba(0,0,0,0.8);
              color: white;
              padding: 2px 6px;
              border-radius: 3px;
              font-size: 10px;
              font-weight: bold;
              margin-top: 4px;
              white-space: nowrap;
            ">
              Cactus
            </div>
          </div>
        `;

        marker = new mapboxgl.Marker({
          element: customElement,
          anchor: "bottom",
        });
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
            `<div style="padding: 12px; max-width: 260px;">
                ${
                  place.image
                    ? `<div style="margin-bottom: 8px; text-align: center;">
                  <img
                    src="${place.image}"
                    alt="${place.name}"
                    style="
                      width: 60px;
                      height: 60px;
                      object-fit: cover;
                      border-radius: 8px;
                      border: 2px solid #f0f0f0;
                    "
                  />
                </div>`
                    : ""
                }
                <div style="font-weight: 800; margin-bottom: 4px;">${
                  place.name
                }</div>
                <div style="font-size: 12px; opacity: 0.75; margin-bottom: 8px;">
                  ${place.category} • ${place.area || "Ahangama"}
                </div>
                ${
                  place.description
                    ? `<div style="
                  font-size: 13px;
                  line-height: 1.4;
                  margin-bottom: 10px;
                ">${place.description}</div>`
                    : ""
                }
                <div style="display: grid; gap: 6px;">
                  ${
                    place.slug
                      ? `<a href="/${place.category}/${place.slug}">Open page →</a>`
                      : ""
                  }
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${place.name} ${place.area || "Ahangama"}`
                    )}"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open in Google Maps →
                  </a>
                </div>
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
        title="Map (Google) — Ahangama"
        description="A calm, curated map of places in Ahangama — now powered by Mapbox."
        canonical={canonical}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Map (Google) — Ahangama",
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
                Map (Google)
              </Title>
              <Text type="secondary">
                Same calm experience — now powered by Mapbox.
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

              <div style={{ marginTop: 14 }}>
                <Space wrap size={10}>
                  <Button
                    type="primary"
                    href="/master-index"
                    icon={<ArrowRightOutlined />}
                  >
                    Master Index
                  </Button>
                  <Button href="/card">Get the Pass</Button>
                </Space>
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
