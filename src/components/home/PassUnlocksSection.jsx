import React, { useMemo, useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Card,
  Input,
  Segmented,
  Space,
  Tag,
  Typography,
  Row,
  Col,
  Button,
} from "antd";
import {
  SearchOutlined,
  EnvironmentOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import { PLACES } from "../../data/places";

const { Title, Text, Paragraph } = Typography;

const DEFAULT_CENTER = { lat: 5.9699, lng: 80.3666 }; // Ahangama-ish

const CATEGORY_LABELS = {
  eat: "Eat & Drink",
  stays: "Stays",
  experiences: "Experiences",
  culture: "Culture",
  wellness: "Wellness",
  surf: "Surf",
  "work-long-stays": "Work & Long Stays",
  "getting-around": "Getting Around",
  "shops-essentials": "Shops & Essentials",
  community: "Community",
};

function safeLatLng(p) {
  const lat = p?.position?.lat ?? p?.lat;
  const lng = p?.position?.lng ?? p?.lng;
  if (typeof lat !== "number" || typeof lng !== "number") return null;
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { lat, lng };
}

function categoryAccent(cat) {
  // subtle, functional accents (low saturation)
  if (cat === "eat") return "tag-food";
  if (cat === "surf") return "tag-surf";
  if (cat === "stays") return "tag-stays";
  if (cat === "wellness") return "tag-wellness";
  return "tag-neutral";
}

function PlaceRow({ p }) {
  const fallbackImage =
    "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400";

  // Parse offers into tags
  const parseOfferTags = (offer) => {
    if (!offer) return [];

    const tags = [];
    const offerLower = offer.toLowerCase();

    // Extract percentage discounts
    const percentMatch = offer.match(/(\d+)%\s*off/i);
    if (percentMatch) {
      tags.push(`${percentMatch[1]}% Discount`);
    }

    // Extract free items
    if (offerLower.includes("free coffee")) {
      tags.push("Free Coffee");
    } else if (offerLower.includes("free smoothie")) {
      tags.push("Free Smoothie");
    } else if (offerLower.includes("free class")) {
      tags.push("Free Class");
    }

    // Extract room upgrades
    if (offerLower.includes("room upgrade")) {
      tags.push("Room Upgrade");
    }

    // Extract late checkout
    if (offerLower.includes("late checkout")) {
      tags.push("Late Checkout");
    }

    // If no specific tags found, create a generic one
    if (tags.length === 0) {
      // Extract key benefit words
      if (offerLower.includes("discount")) {
        tags.push("Discount");
      } else if (offerLower.includes("free")) {
        tags.push("Free Perk");
      } else {
        tags.push("Special Offer");
      }
    }

    return tags;
  };

  const offerTags = parseOfferTags(p.offer);

  return (
    <article
      className="place-card"
      onClick={() =>
        p.slug && (window.location.href = `/${p.category}/${p.slug}`)
      }
      style={{
        background: "#fffdf9",
        borderRadius: "14px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 30px rgba(0, 0, 0, 0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        className="place-card__image"
        style={{
          position: "relative",
          aspectRatio: "4 / 3",
          overflow: "hidden",
        }}
      >
        <img
          src={p.image || fallbackImage}
          alt={p.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.4s ease",
          }}
        />
        <div
          className="place-card__meta"
          style={{
            position: "absolute",
            bottom: "10px",
            left: "12px",
            fontSize: "11px",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#ffffff",
            background:
              "linear-gradient(to right, rgba(0,0,0,0.55), rgba(0,0,0,0))",
            padding: "6px 10px",
            borderRadius: "8px",
          }}
        >
          {CATEGORY_LABELS[p.category] || p.category} · {p.area || "AHANGAMA"}
        </div>
      </div>

      <div className="place-card__body" style={{ padding: "14px 16px 18px" }}>
        <h3
          className="place-card__title"
          style={{
            fontSize: "18px",
            margin: "0 0 12px",
            lineHeight: "1.25",
            color: "#222",
            fontWeight: "600",
          }}
        >
          {p.name}
        </h3>

        {offerTags.length > 0 && (
          <div
            className="place-card__tags"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              marginBottom: "10px",
            }}
          >
            {offerTags.map((tag, index) => (
              <span
                key={index}
                className="offer-tag"
                style={{
                  display: "inline-block",
                  fontSize: "11px",
                  padding: "4px 8px",
                  borderRadius: "12px",
                  background: "#e8f5e8",
                  color: "#2d5016",
                  fontWeight: "500",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <span
          className="place-card__cta"
          style={{
            display: "inline-block",
            fontSize: "14px",
            color: "#8b5a2b",
            fontWeight: "500",
          }}
        >
          Discover →
        </span>
      </div>
    </article>
  );
}

export default function PassUnlocksSection({ destinationSlug = "ahangama" }) {
  const token = import.meta.env.VITE_MAPBOX_TOKEN;
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const [view, setView] = useState("List");
  const [q, setQ] = useState("");
  const [selectedCats, setSelectedCats] = useState([]); // multi-select
  const [selected, setSelected] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const passPlaces = useMemo(() => {
    const query = q.trim().toLowerCase();

    return PLACES.filter((p) => p.destinationSlug === destinationSlug)
      .filter((p) => !!p.offer) // only pass venues (discounts/value adds)
      .filter((p) => {
        if (!selectedCats.length) return true;
        return selectedCats.includes(p.category);
      })
      .filter((p) => {
        if (!query) return true;
        const hay = `${p.name ?? ""} ${p.area ?? ""} ${p.category ?? ""} ${
          p.description ?? ""
        } ${p.offer ?? ""}`.toLowerCase();
        return hay.includes(query);
      })
      .map((p) => ({ ...p, _latlng: safeLatLng(p) }));
  }, [destinationSlug, q, selectedCats]);

  const catsAvailable = useMemo(() => {
    const set = new Set(passPlaces.map((p) => p.category).filter(Boolean));
    return Array.from(set);
  }, [passPlaces]);

  const mappable = useMemo(
    () => passPlaces.filter((p) => !!p._latlng),
    [passPlaces]
  );
  const center = mappable[0]?._latlng || DEFAULT_CENTER;

  const toggleCat = (cat) => {
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((x) => x !== cat) : [...prev, cat]
    );
  };

  // Initialize Mapbox when view switches to Map
  useEffect(() => {
    if (view !== "Map" || !token || !mapContainerRef.current || mapRef.current)
      return;

    mapboxgl.accessToken = token;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [center.lng, center.lat],
      zoom: 12.3,
    });

    mapRef.current.on("load", () => {
      setMapLoaded(true);
    });

    // Add navigation control
    mapRef.current.addControl(new mapboxgl.NavigationControl());

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        setMapLoaded(false);
      }
    };
  }, [view, token, center.lat, center.lng]);

  // Update markers when mappable places change
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || view !== "Map") return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    mappable.forEach((place) => {
      if (!place._latlng) return;

      const markerEl = document.createElement("div");
      markerEl.className = `pu-pin ${categoryAccent(place.category)}`;
      markerEl.innerHTML =
        '<span class="anticon anticon-environment"><svg viewBox="64 64 896 896" focusable="false" data-icon="environment" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M854.6 289.1a362.49 362.49 0 00-79.9-115.7 370.83 370.83 0 00-118.2-77.8C610.7 76.6 562.1 67 512 67c-50.1 0-98.7 9.6-144.5 28.5-44.3 18.3-84.1 44.5-118.2 77.8A363.6 363.6 0 00169.4 289c-19.5 45-29.4 92.8-29.4 142.7 0 70.62 18.9 140.94 54.7 203.36a458.08 458.08 0 00123.07 150.21L512 960l194.26-174.73a458.08 458.08 0 00123.07-150.21A424.83 424.83 0 00884 431.7c0-49.9-9.9-97.7-29.4-142.6zM512 615c-97.2 0-176-78.8-176-176s78.8-176 176-176 176 78.8 176 176-78.8 176-176 176z"></path></svg></span>';
      markerEl.style.cursor = "pointer";

      const marker = new mapboxgl.Marker({
        element: markerEl,
        anchor: "bottom",
      })
        .setLngLat([place._latlng.lng, place._latlng.lat])
        .addTo(mapRef.current);

      // Add click handler
      markerEl.addEventListener("click", (e) => {
        e.stopPropagation();
        setSelected(place);

        // Close any existing popup
        if (mapRef.current.getPopup?.()?.isOpen?.()) {
          mapRef.current.closePopup();
        }

        // Create and show popup
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          anchor: "top",
          maxWidth: "320px",
        })
          .setLngLat([place._latlng.lng, place._latlng.lat])
          .setHTML(
            `
            <div class="pu-popup">
              <div class="pu-popupTop">
                <div>
                  <div class="pu-popupName">${place.name}</div>
                  <div class="pu-popupMeta">
                    ${CATEGORY_LABELS[place.category] || place.category}
                    ${place.area ? ` • ${place.area}` : ""}
                  </div>
                </div>
                <button class="pu-popupClose" type="button">×</button>
              </div>
              <div class="pu-popupOffer">${place.offer}</div>
              ${
                place.slug
                  ? `<a class="pu-popupLink" href="/${place.category}/${place.slug}">View →</a>`
                  : ""
              }
            </div>
          `
          )
          .addTo(mapRef.current);

        // Add close button handler
        const closeBtn = popup.getElement().querySelector(".pu-popupClose");
        if (closeBtn) {
          closeBtn.addEventListener("click", () => {
            popup.remove();
            setSelected(null);
          });
        }
      });

      markersRef.current.push(marker);
    });
  }, [mappable, mapLoaded, view]);

  // Helper function to get category colors (same as before)
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
    <Card
      className="pu-shell"
      bodyStyle={{ padding: 18 }}
      style={{
        borderRadius: 20,
        border: "2px solid rgba(255,215,0,0.1)",
        background:
          "linear-gradient(135deg, rgba(255,248,220,0.3) 0%, rgba(255,255,255,0.8) 100%)",
        boxShadow: "0 4px 20px rgba(255,215,0,0.08)",
      }}
    >
      <Row gutter={[12, 12]} align="middle" justify="space-between">
        <Col>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "4px",
            }}
          >
            <span style={{ fontSize: "20px" }}>🎁</span>
            <Title
              level={3}
              className="pu-h"
              style={{ margin: 0, color: "#8B4513" }}
            >
              Your Pass Unlocks
            </Title>
          </div>
          <Text type="secondary" style={{ fontSize: "14px", color: "#666" }}>
            Real savings at places we'd recommend to friends ✨
          </Text>
        </Col>

        <Col>
          <Space wrap size={10}>
            <Segmented
              value={view}
              onChange={setView}
              options={[
                { label: "🏪 List", value: "List" },
                { label: "🗺️ Map", value: "Map" },
              ]}
              className="pu-toggle"
              style={{
                background: "rgba(255,255,255,0.8)",
                borderRadius: "16px",
                border: "1px solid rgba(139,69,19,0.1)",
              }}
            />
            <Button
              type="primary"
              href="/card"
              icon={<QrcodeOutlined />}
              style={{
                borderRadius: "16px",
                background: "linear-gradient(135deg, #FFD700, #FFA500)",
                border: "none",
                color: "#fff",
                fontWeight: "600",
                boxShadow: "0 2px 8px rgba(255,165,0,0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(255,165,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 2px 8px rgba(255,165,0,0.2)";
              }}
            >
              Get your Pass
            </Button>
          </Space>
        </Col>
      </Row>

      <div style={{ height: 12 }} />

      <Row gutter={[10, 10]} align="middle">
        <Col xs={24} md={10}>
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            prefix={<SearchOutlined />}
            size="large"
            placeholder="Search offers, places, areas…"
            className="pu-search"
          />
        </Col>

        <Col xs={24} md={14}>
          <div className="pu-filters">
            {catsAvailable.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`pu-filterBtn ${
                  selectedCats.includes(cat) ? "is-active" : ""
                }`}
                onClick={() => toggleCat(cat)}
              >
                {CATEGORY_LABELS[cat] || cat}
              </button>
            ))}
            {!!selectedCats.length && (
              <button
                type="button"
                className="pu-clear"
                onClick={() => setSelectedCats([])}
              >
                Clear
              </button>
            )}
          </div>
        </Col>
      </Row>

      <div style={{ height: 14 }} />

      {view === "List" ? (
        <Row gutter={[16, 16]}>
          {passPlaces.length === 0 ? (
            <Col span={24}>
              <div
                className="pu-empty"
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  background: "#fafafa",
                  borderRadius: "12px",
                  border: "2px dashed #d9d9d9",
                }}
              >
                <Text type="secondary">
                  No matches. Try removing filters or searching something
                  broader.
                </Text>
              </div>
            </Col>
          ) : (
            passPlaces.map((p) => (
              <Col
                xs={24}
                sm={12}
                md={8}
                lg={6}
                xl={6}
                key={p.id || p.slug || p.name}
              >
                <PlaceRow p={p} />
              </Col>
            ))
          )}
        </Row>
      ) : (
        <div className="pu-mapWrap">
          {!token ? (
            <div className="pu-mapFallback">
              <Title level={5} style={{ marginTop: 0 }}>
                Map view needs a Mapbox token
              </Title>
              <Paragraph type="secondary" style={{ marginBottom: 10 }}>
                Add <Text code>VITE_MAPBOX_TOKEN</Text> and ensure pass venues
                have <Text code>position.lat/lng</Text>.
              </Paragraph>
              <Space wrap>
                <Button href="/map">Open full map →</Button>
                <Button type="primary" href="/map-google">
                  Use Google map →
                </Button>
              </Space>
            </div>
          ) : mappable.length === 0 ? (
            <div className="pu-mapFallback">
              <Title level={5} style={{ marginTop: 0 }}>
                No coordinates yet
              </Title>
              <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                Add <Text code>position: {"{ lat, lng }"}</Text> to pass venues
                to show them on the map.
              </Paragraph>
            </div>
          ) : (
            <div
              ref={mapContainerRef}
              style={{
                width: "100%",
                height: "420px",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            />
          )}
        </div>
      )}
    </Card>
  );
}
