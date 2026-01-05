import React, { useRef, useEffect, useState, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card, Button, Space, Tag, Typography } from "antd";
import { EnvironmentOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { PLACES } from "../../data/places";

const { Title, Text } = Typography;

const DEFAULT_CENTER = { lat: 5.9699, lng: 80.3666 }; // Ahangama-ish
const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoidmlqaXciLCJhIjoiY21qZHlrbHNoMGM5ejNlcHE5dDY4a2V2aiJ9.9H0iEZmTR17WCYkBki-XRQ";

const CATEGORY_LABELS = {
  all: "All",
  eat: "Eat & Drink",
  stays: "Stays",
  wellness: "Wellness",
  culture: "Culture",
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

export default function HomeMapSection() {
  const token = import.meta.env.VITE_MAPBOX_TOKEN || MAPBOX_ACCESS_TOKEN;
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const selectedMarkerRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPlace, setSelectedPlace] = useState(null);

  const places = useMemo(() => {
    return PLACES.filter((p) => p.destinationSlug === "ahangama")
      .filter((p) => {
        if (selectedCategory === "all") {
          // Explicitly include eat, stays, wellness, and surf for "all" filter
          return ["eat", "stays", "wellness", "surf"].includes(p.category);
        }
        return p.category === selectedCategory;
      })
      .map((p) => ({ ...p, _latlng: safeLatLng(p) }))
      .filter((p) => !!p._latlng)
      .slice(0, 40); // Show up to 20 places for homepage
  }, [selectedCategory]);

  const availableCategories = useMemo(() => {
    const categories = ["all"];
    const categorySet = new Set(
      PLACES.filter((p) => p.destinationSlug === "ahangama")
        .map((p) => p.category)
        .filter(Boolean)
    );
    return [...categories, ...Array.from(categorySet)];
  }, []);

  // Initialize Mapbox GL map
  useEffect(() => {
    if (!token || !mapContainerRef.current) return;

    mapboxgl.accessToken = token;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [DEFAULT_CENTER.lng, DEFAULT_CENTER.lat],
      zoom: 14,
      interactive: true,
    });

    mapRef.current.on("load", () => {
      setMapLoaded(true);
    });

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

      // Create custom marker element following MapGoogle example
      const customElement = document.createElement("div");
      customElement.className = "custom-marker-element";
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
            background-image: url('${
              place.logo ||
              place.ogImage ||
              "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1600"
            }');
            background-size: cover;
            background-position: center;
            border-radius: 50%;
            border: 2px solid ${getCategoryColor(place.category)};
            box-shadow: 0 1px 5px rgba(0,0,0,0.3);
          "></div>
          <div style="
            background: linear-gradient(135deg, rgba(255,248,220,0.3) 0%, rgba(255,255,255,0.8) 100%);
            color: #8B4513;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: bold;
            margin-top: 4px;
            white-space: nowrap;
            max-width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: center;
          ">
            ${
              place.name.length > 12
                ? place.name.substring(0, 12) + "..."
                : place.name
            }
          </div>
        </div>
      `;

      const marker = new mapboxgl.Marker({
        element: customElement,
        anchor: "bottom",
      })
        .setLngLat([place._latlng.lng, place._latlng.lat])
        .addTo(mapRef.current);

      // Add click handler to marker
      customElement.addEventListener("click", () => {
        // Reset previous selected marker appearance
        if (selectedMarkerRef.current) {
          selectedMarkerRef.current
            .getElement()
            .classList.remove("marker-selected");
        }

        // Update new selected marker appearance
        customElement.classList.add("marker-selected");

        // Update refs and state
        selectedMarkerRef.current = marker;
        setSelectedPlace(place);
      });

      markersRef.current.push(marker);
    });
  }, [places, mapLoaded]);

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

  // Helper function to format offers
  const formatOffers = (offer) => {
    if (!offer) return "";

    if (Array.isArray(offer)) {
      return offer
        .map(
          (tag) => `<span style="
        display: inline-block;
        background: rgba(79, 111, 134, 0.12);
        color: rgba(31, 42, 36, 0.9);
        padding: 3px 6px;
        border-radius: 10px;
        font-size: 10px;
        font-weight: 500;
        margin-right: 3px;
        margin-bottom: 3px;
      ">${tag}</span>`
        )
        .join("");
    }

    return `<div style="
      font-size: 11px;
      color: rgba(31, 42, 36, 0.8);
      padding: 5px 6px;
      background: rgba(79, 111, 134, 0.08);
      border-radius: 6px;
      border-left: 2px solid rgba(79, 111, 134, 0.3);
    ">${offer}</div>`;
  };

  return (
    <>
      <style>
        {`
          .custom-marker-element {
            transform-origin: bottom center !important;
          }
          
          .custom-marker-element > div {
            transform-origin: bottom center !important;
            transition: transform 0.2s ease;
          }
          
          .custom-marker-element:hover > div {
            transform: scale(1.05);
          }
          
          .marker-selected > div {
            transform: scale(1.1) !important;
          }
          
          .marker-selected > div > div:first-child {
            box-shadow: 0 2px 8px rgba(0,0,0,0.4) !important;
          }
        `}
      </style>
      <Card
        style={{
          borderRadius: 18,
          border: "1px solid rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
        bodyStyle={{ padding: 0 }}
      >
        {/* Container with filters on top and map below */}
        <div
          style={{ display: "flex", flexDirection: "column", height: "550px" }}
        >
          {/* Top Filters Bar */}
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(255,248,220,0.3) 0%, rgba(255,255,255,0.8) 100%)",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              padding: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                <Title
                  level={5}
                  style={{ margin: "0 0 8px", fontSize: "13px", color: "#666" }}
                >
                  FILTER BY TYPE
                </Title>
                <div className="map-filters">
                  {availableCategories.map((category) => (
                    <button
                      key={category}
                      className={`map-filter ${
                        selectedCategory === category ? "is-active" : ""
                      }`}
                      onClick={() => setSelectedCategory(category)}
                      type="button"
                    >
                      {CATEGORY_LABELS[category] || category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Text type="secondary" style={{ fontSize: "11px" }}>
                  Showing {places.length} places
                </Text>
              </div>
            </div>
          </div>

          {/* Main content area with sidebar and map */}
          <div style={{ display: "flex", flex: 1 }}>
            {/* Left Sidebar for Selected Place */}
            <div
              style={{
                width: "300px",
                height: "100%",
                minHeight: "370px",
                transition: "all 0.3s ease",
                overflow: "hidden",
                background:
                  "linear-gradient(135deg, rgba(255,248,220,0.3) 0%, rgba(255,255,255,0.8) 100%)",
                borderRight: "1px solid rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  padding: "20px",
                  height: "100%",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 0,
                }}
              >
                {selectedPlace ? (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "16px",
                      }}
                    >
                      <Title
                        level={5}
                        style={{ margin: 0, fontSize: "13px", color: "#666" }}
                      >
                        SELECTED PLACE
                      </Title>
                      <button
                        onClick={() => {
                          // Reset selected marker appearance
                          if (selectedMarkerRef.current) {
                            selectedMarkerRef.current
                              .getElement()
                              .classList.remove("marker-selected");
                            selectedMarkerRef.current = null;
                          }
                          setSelectedPlace(null);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          fontSize: "18px",
                          cursor: "pointer",
                          color: "#999",
                          padding: "4px",
                        }}
                      >
                        ×
                      </button>
                    </div>

                    {/* Name with Logo */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "12px",
                      }}
                    >
                      {/* Venue Logo */}
                      {selectedPlace.logo && (
                        <div
                          style={{
                            height: "40px",
                            width: "40px",
                            backgroundImage: `url('${selectedPlace.logo}')`,
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            borderRadius: "6px",
                            border: "1px solid rgba(0,0,0,0.08)",
                            backgroundColor: "rgba(255,255,255,0.9)",
                            flexShrink: 0,
                          }}
                        />
                      )}

                      <Title level={4} style={{ margin: 0, fontSize: "18px" }}>
                        {selectedPlace.name}
                      </Title>
                    </div>

                    {/* Reviews */}
                    {(selectedPlace.stars || selectedPlace.reviews) && (
                      <div style={{ marginBottom: "16px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          {selectedPlace.stars && (
                            <span
                              style={{ fontSize: "16px", fontWeight: "600" }}
                            >
                              ⭐ {selectedPlace.stars}
                            </span>
                          )}
                          {selectedPlace.reviews && (
                            <Text type="secondary" style={{ fontSize: "13px" }}>
                              ({selectedPlace.reviews} reviews)
                            </Text>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Offers */}
                    {selectedPlace.offer && (
                      <div style={{ marginBottom: "20px" }}>
                        <Title
                          level={5}
                          style={{
                            margin: "0 0 8px",
                            fontSize: "12px",
                            color: "#666",
                            textTransform: "uppercase",
                          }}
                        >
                          Pass Offers
                        </Title>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: formatOffers(selectedPlace.offer),
                          }}
                        />
                      </div>
                    )}

                    {/* Spacer to push buttons to bottom */}
                    <div style={{ flex: 1 }} />

                    {/* Action Buttons */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        marginTop: "auto",
                      }}
                    >
                      <Button
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${selectedPlace.name} ${
                            selectedPlace.area || "Ahangama"
                          }`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ borderRadius: "6px" }}
                      >
                        View on Google Maps
                      </Button>

                      {selectedPlace.slug && (
                        <Button
                          type="primary"
                          href={`/${selectedPlace.category}/${selectedPlace.slug}`}
                          style={{ borderRadius: "6px" }}
                        >
                          Discover
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  /* Default content when no place is selected */
                  <>
                    <Title
                      level={5}
                      style={{
                        margin: "0 0 16px",
                        fontSize: "13px",
                        color: "#666",
                      }}
                    >
                      SELECT A PLACE
                    </Title>

                    <div style={{ textAlign: "center", padding: "40px 20px" }}>
                      <div
                        style={{
                          fontSize: "48px",
                          marginBottom: "16px",
                          opacity: 0.3,
                        }}
                      >
                        📍
                      </div>
                      <Text
                        type="secondary"
                        style={{ fontSize: "14px", lineHeight: 1.5 }}
                      >
                        Click on any marker on the map to view place details,
                        ratings, and offers.
                      </Text>
                    </div>

                    {/* Spacer */}
                    <div style={{ flex: 1 }} />

                    <div style={{ textAlign: "center", padding: "20px" }}>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        Showing {places.length} places on map
                      </Text>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Map Container */}
            <div style={{ flex: 1, position: "relative" }}>
              {!token ? (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f5f5f5",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <Title level={4}>Map view unavailable</Title>
                    <Text type="secondary">Mapbox token missing</Text>
                  </div>
                </div>
              ) : (
                <div
                  ref={mapContainerRef}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              )}

              {/* Bottom Action */}
              <div
                style={{
                  position: "absolute",
                  bottom: "16px",
                  right: "16px",
                  zIndex: 1000,
                }}
              >
                <Space>
                  <Button
                    type="primary"
                    href="/map-google"
                    icon={<ArrowRightOutlined />}
                    style={{
                      borderRadius: "12px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    Full Map
                  </Button>
                </Space>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
