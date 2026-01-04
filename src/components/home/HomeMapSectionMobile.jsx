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

const { Title, Text } = Typography;

const DEFAULT_CENTER = { lat: 5.9699, lng: 80.3666 }; // Ahangama-ish
const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoidmlqaXciLCJhIjoiY21qZHlrbHNoMGM5ejNlcHE5dDY4a2V2aiJ9.9H0iEZmTR17WCYkBki-XRQ";

const CATEGORY_LABELS = {
  all: "All",
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
      .filter((p) => {
        if (selectedCategory === "all") {
          return ["eat", "stays", "experiences"].includes(p.category);
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
      .slice(0, 20);
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

  // Update markers when places change
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    places.forEach((place) => {
      if (!place._latlng) return;

      // Create custom marker element
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
            width: 28px;
            height: 28px;
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
            background: linear-gradient(135deg, rgba(255,248,220,0.3) 0%, rgba(255,255,255,0.9) 100%);
            color: #8B4513;
            padding: 1px 4px;
            border-radius: 3px;
            font-size: 9px;
            font-weight: bold;
            margin-top: 2px;
            white-space: nowrap;
            max-width: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: center;
          ">
            ${
              place.name.length > 10
                ? place.name.substring(0, 10) + "..."
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
        if (place.slug) {
          window.location.href = `/${place.category}/${place.slug}`;
        } else {
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${place.name} ${place.area || "Ahangama"}`
          )}`;
          window.open(mapsUrl, "_blank");
        }
      });

      markersRef.current.push(marker);
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
