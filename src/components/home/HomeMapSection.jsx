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
      .slice(0, 100); // Show up to 20 places for homepage
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

  // Update markers and clustering when places change
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    // Clear existing markers and sources
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Remove existing sources and layers if they exist
    if (mapRef.current.getSource("places")) {
      if (mapRef.current.getLayer("clusters"))
        mapRef.current.removeLayer("clusters");
      if (mapRef.current.getLayer("cluster-count"))
        mapRef.current.removeLayer("cluster-count");
      if (mapRef.current.getLayer("unclustered-point"))
        mapRef.current.removeLayer("unclustered-point");
      mapRef.current.removeSource("places");
    }

    // Create GeoJSON data for clustering
    const geojson = {
      type: "FeatureCollection",
      features: places.map((place) => ({
        type: "Feature",
        properties: {
          name: place.name,
          category: place.category,
          offer: place.offer,
          logo: place.logo,
          stars: place.stars,
          reviews: place.reviews,
          area: place.area,
          slug: place.slug,
          description: place.description,
        },
        geometry: {
          type: "Point",
          coordinates: [place._latlng.lng, place._latlng.lat],
        },
      })),
    };

    // Clean up existing sources and layers
    if (mapRef.current.getSource("places")) {
      [
        "clusters",
        "cluster-count",
        "unclustered-point",
        "unclustered-point-bg",
      ].forEach((layerId) => {
        if (mapRef.current.getLayer(layerId)) {
          mapRef.current.removeLayer(layerId);
        }
      });
      mapRef.current.removeSource("places");
    }

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add clustering source
    mapRef.current.addSource("places", {
      type: "geojson",
      data: geojson,
      cluster: true,
      clusterMaxZoom: 15,
      clusterRadius: 60,
    });

    // Cluster circle layer
    mapRef.current.addLayer({
      id: "clusters",
      type: "circle",
      source: "places",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": [
          "step",
          ["get", "point_count"],
          "#11b4da",
          10,
          "#f1f075",
          100,
          "#f28cb1",
        ],
        "circle-radius": ["step", ["get", "point_count"], 20, 10, 30, 100, 40],
        "circle-stroke-width": 2,
        "circle-stroke-color": "#fff",
      },
    });

    // Cluster count layer
    mapRef.current.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "places",
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12,
      },
      paint: {
        "text-color": "#ffffff",
      },
    });

    // Unclustered point layer with place names
    mapRef.current.addLayer({
      id: "unclustered-point",
      type: "symbol",
      source: "places",
      filter: ["!", ["has", "point_count"]],
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 11,
        "text-anchor": "center",
        "text-offset": [0, 2],
        "text-max-width": 10,
        "text-allow-overlap": false,
        "text-ignore-placement": false,
      },
      paint: {
        "text-color": [
          "case",
          ["==", ["get", "category"], "eat"],
          "#c46a3a",
          ["==", ["get", "category"], "stays"],
          "#6b7c5a",
          ["==", ["get", "category"], "experiences"],
          "#3e5f73",
          ["==", ["get", "category"], "surf"],
          "#3e5f73",
          ["==", ["get", "category"], "wellness"],
          "#7a6a86",
          ["==", ["get", "category"], "culture"],
          "#7a6a86",
          ["==", ["get", "category"], "work-long-stays"],
          "#6b7c5a",
          ["==", ["get", "category"], "getting-around"],
          "#4f6f86",
          ["==", ["get", "category"], "shops-essentials"],
          "#6b6f6a",
          ["==", ["get", "category"], "community"],
          "#4f6f86",
          "#4f6f86",
        ],
        "text-halo-color": "#ffffff",
        "text-halo-width": 2,
        "text-halo-blur": 1,
      },
    });

    // Add background circles for better visibility
    mapRef.current.addLayer(
      {
        id: "unclustered-point-bg",
        type: "circle",
        source: "places",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": [
            "case",
            ["==", ["get", "category"], "eat"],
            "#c46a3a",
            ["==", ["get", "category"], "stays"],
            "#6b7c5a",
            ["==", ["get", "category"], "experiences"],
            "#3e5f73",
            ["==", ["get", "category"], "surf"],
            "#3e5f73",
            ["==", ["get", "category"], "wellness"],
            "#7a6a86",
            ["==", ["get", "category"], "culture"],
            "#7a6a86",
            ["==", ["get", "category"], "work-long-stays"],
            "#6b7c5a",
            ["==", ["get", "category"], "getting-around"],
            "#4f6f86",
            ["==", ["get", "category"], "shops-essentials"],
            "#6b6f6a",
            ["==", ["get", "category"], "community"],
            "#4f6f86",
            "#4f6f86",
          ],
          "circle-radius": 5,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
          "circle-opacity": 0.8,
        },
      },
      "unclustered-point"
    );

    // Add event handlers using standard Mapbox API
    mapRef.current.on("click", "clusters", (e) => {
      const features = mapRef.current.queryRenderedFeatures(e.point, {
        layers: ["clusters"],
      });
      const clusterId = features[0].properties.cluster_id;
      mapRef.current
        .getSource("places")
        .getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;
          mapRef.current.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom,
          });
        });
    });

    mapRef.current.on("click", "unclustered-point", (e) => {
      const place = e.features[0].properties;

      // Update UI state only - don't move the map
      setSelectedPlace(place);
    });

    mapRef.current.on("mouseenter", "clusters", () => {
      mapRef.current.getCanvas().style.cursor = "pointer";
    });

    mapRef.current.on("mouseleave", "clusters", () => {
      mapRef.current.getCanvas().style.cursor = "";
    });

    mapRef.current.on("mouseenter", "unclustered-point", () => {
      mapRef.current.getCanvas().style.cursor = "pointer";
    });

    mapRef.current.on("mouseleave", "unclustered-point", () => {
      mapRef.current.getCanvas().style.cursor = "";
    });

    // Also add hover events for the background circles
    mapRef.current.on("mouseenter", "unclustered-point-bg", () => {
      mapRef.current.getCanvas().style.cursor = "pointer";
    });

    mapRef.current.on("mouseleave", "unclustered-point-bg", () => {
      mapRef.current.getCanvas().style.cursor = "";
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
