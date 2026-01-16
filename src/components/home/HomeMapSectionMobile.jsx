import React, { useRef, useEffect, useState, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card, Button, Space, Tag, Typography, Input } from "antd";
import {
  EnvironmentOutlined,
  ArrowRightOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { PLACES } from "../../data/places";
import { shouldShowPlace } from "../../data/placeStatus";

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

export default function HomeMapSectionMobile() {
  const token = import.meta.env.VITE_MAPBOX_TOKEN || MAPBOX_ACCESS_TOKEN;
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const places = useMemo(() => {
    return PLACES.filter((p) => p.destinationSlug === "ahangama")
      .filter((p) => shouldShowPlace(p)) // Only show active places
      .filter((p) => {
        if (selectedCategory === "all") {
          // Include eat, stays, wellness, and surf for "all" filter like desktop
          return ["eat", "stays", "wellness", "surf"].includes(p.category);
        }
        return p.category === selectedCategory;
      })
      .filter((p) => {
        if (!searchQuery) return true;
        return (
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.area && p.area.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      })
      .map((p) => ({ ...p, _latlng: safeLatLng(p) }))
      .filter((p) => !!p._latlng)
      .slice(0, 100); // Increase limit like desktop for better performance
  }, [selectedCategory, searchQuery]);

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
      zoom: 13,
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

      // Navigate to place detail page
      if (place.slug) {
        window.location.href = `/${place.category}/${place.slug}`;
      }
    });

    // Also make the background circles clickable
    mapRef.current.on("click", "unclustered-point-bg", (e) => {
      const place = e.features[0].properties;

      // Navigate to place detail page
      if (place.slug) {
        window.location.href = `/${place.category}/${place.slug}`;
      }
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
      experiences: "#8B5A96",
      surf: "#3e5f73",
      wellness: "#7a6a86",
      culture: "#1890ff",
      "work-long-stays": "#6b7c5a",
      "getting-around": "#4f6f86",
      "shops-essentials": "#6b6f6a",
      community: "#4f6f86",
    };
    return colors[category] || "#4f6f86";
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
        <div
          style={{ display: "flex", flexDirection: "column", height: "400px" }}
        >
          {/* Top Filters Bar */}
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(255,248,220,0.3) 0%, rgba(255,255,255,0.8) 100%)",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              padding: "12px 16px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <Title
                level={5}
                style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}
              >
                Explore Places
              </Title>
              <Button
                size="small"
                type="text"
                icon={<FilterOutlined />}
                onClick={() => setShowFilters(!showFilters)}
                style={{ padding: "4px" }}
              />
            </div>

            {/* Search */}
            <Input
              placeholder="Search places..."
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                borderRadius: "8px",
                border: "1px solid rgba(0,0,0,0.06)",
                marginBottom: showFilters ? "8px" : 0,
              }}
              size="small"
            />

            {/* Collapsible Filters */}
            {showFilters && (
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  overflowX: "auto",
                  paddingBottom: "4px",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  WebkitScrollbar: { display: "none" },
                }}
              >
                {availableCategories.map((category) => (
                  <Tag
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    style={{
                      cursor: "pointer",
                      border:
                        selectedCategory === category
                          ? "1px solid #4f6f86"
                          : "1px solid rgba(0,0,0,0.06)",
                      background:
                        selectedCategory === category ? "#4f6f86" : "white",
                      color: selectedCategory === category ? "white" : "#666",
                      borderRadius: "12px",
                      padding: "3px 6px",
                      fontSize: "10px",
                      whiteSpace: "nowrap",
                      margin: 0,
                    }}
                  >
                    {CATEGORY_LABELS[category] || category}
                  </Tag>
                ))}
              </div>
            )}

            {/* Places Count */}
            <Text type="secondary" style={{ fontSize: "10px" }}>
              {places.length} places on map
            </Text>
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
                  <Title level={5}>Map view unavailable</Title>
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
                bottom: "12px",
                right: "12px",
                zIndex: 1000,
              }}
            >
              <Button
                type="primary"
                href="/map-google"
                icon={<EnvironmentOutlined />}
                style={{
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  fontSize: "12px",
                  height: "32px",
                  padding: "0 12px",
                }}
              >
                Full Map
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
