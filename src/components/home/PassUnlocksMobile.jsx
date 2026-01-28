import React, { useMemo, useState } from "react";
import {
  Card,
  Input,
  Space,
  Tag,
  Typography,
  Row,
  Col,
  Button,
  Carousel,
} from "antd";
import {
  SearchOutlined,
  QrcodeOutlined,
  FilterOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { PLACES } from "../../data/places";
import { shouldShowPlace } from "../../data/placeStatus";
import PlaceStatusTag from "../ui/PlaceStatusTag";

const { Title, Text } = Typography;

const CATEGORY_LABELS = {
  eat: "Eat & Drink",
  stays: "Stays",
  wellness: "Wellness",
  culture: "Culture",
  surf: "Surf",
  "work-long-stays": "Work & Long Stays",
  "getting-around": "Getting Around",
  "shops-essentials": "Shops & Essentials",
  retail: "Retail",
  community: "Community",
};

function MobilePlaceCard({ p }) {
    // Helper to get correct Google Maps URL
    const getGoogleMapsUrl = (url) => {
      if (!url) return null;
      // If url is a place_id or starts with place_id:
      const placeIdMatch = url.match(/^place_id:(.+)$/i);
      if (placeIdMatch) {
        const placeId = placeIdMatch[1].trim();
        return `https://www.google.com/maps/search/?api=1&query_place_id=${encodeURIComponent(placeId)}`;
      }
      // If url looks like a full Google Maps URL, return as is
      return url;
    };
  const fallbackImage =
    "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400";

  // Parse offers into tags
  const parseOfferTags = (offer) => {
    if (!offer) return [];
    if (Array.isArray(offer)) return offer;

    const tags = [];
    const offerLower = offer.toLowerCase();

    const percentMatch = offer.match(/(\d+)%\s*off/i);
    if (percentMatch) {
      tags.push(`${percentMatch[1]}% Off`);
    }

    if (offerLower.includes("free coffee")) {
      tags.push("Free Coffee");
    } else if (offerLower.includes("free smoothie")) {
      tags.push("Free Smoothie");
    } else if (offerLower.includes("free class")) {
      tags.push("Free Class");
    } else if (offerLower.includes("room upgrade")) {
      tags.push("Room Upgrade");
    } else if (offerLower.includes("late checkout")) {
      tags.push("Late Checkout");
    }

    if (tags.length === 0) {
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

  const getTagColors = (category) => {
    if (category === "stays") {
      return { background: "#fff4e6", color: "#d46b08" };
    }
    if (category === "wellness") {
      return { background: "#f6f0ff", color: "#8B5A96" };
    }
    if (category === "culture") {
      return { background: "#e6f7ff", color: "#1890ff" };
    }
    if (category === "retail") {
      return { background: "#f0e6ff", color: "#9c5a95" };
    }
    return { background: "#e8f5e8", color: "#2d5016" };
  };

  const tagColors = getTagColors(p.category);

  return (
    <div
      onClick={() =>
        p.slug && (window.location.href = `/${p.category}/${p.slug}`)
      }
      style={{
        background: "#fff",
        borderRadius: "14px",
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        marginBottom: "16px",
        position: "relative",
        minHeight: 140,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      {/* Main content */}
      <div style={{ display: "flex", height: "120px" }}>
        {/* Image section */}
        <div
          style={{
            width: "100px",
            flexShrink: 0,
            position: "relative",
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
            }}
          />
          {/* Category badge */}
          <div
            style={{
              position: "absolute",
              top: "6px",
              left: "6px",
              background: "rgba(0,0,0,0.75)",
              color: "#fff",
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "9px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {CATEGORY_LABELS[p.category]?.split(" ")[0] || p.category}
          </div>
        </div>
        {/* Info section */}
        <div
          style={{
            flex: 1,
            padding: "12px 12px 8px 12px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            minWidth: 0,
          }}
        >
          <h4
            style={{
              fontSize: "15px",
              fontWeight: "600",
              margin: "0 0 4px 0",
              color: "#222",
              lineHeight: "1.3",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {p.name}
            <PlaceStatusTag place={p} />
          </h4>
          <Text
            style={{
              fontSize: "12px",
              color: "#666",
              display: "block",
              marginBottom: "6px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {p.area || "Ahangama"}
          </Text>
          {/* Reviews and Stars */}
          {typeof p.stars === "number" && typeof p.reviews === "number" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 6,
              }}
            >
              <span style={{ color: "#FFD700", fontSize: 14, marginRight: 2 }}>
                ★
              </span>
              <span style={{ fontWeight: 500, color: "#222", fontSize: 13 }}>
                {p.stars.toFixed(1)}
              </span>
              <span style={{ color: "#888", fontSize: 12 }}>
                ({p.reviews.toLocaleString()} reviews)
              </span>
            </div>
          )}
          {/* Google Maps link */}
          {p.mapUrl && (
            <div style={{ margin: "2px 0 0 0" }}>
              <span
                role="button"
                tabIndex={0}
                style={{
                  color: "#388e3c",
                  fontWeight: 600,
                  fontSize: 13,
                  textDecoration: "underline",
                  letterSpacing: "0.02em",
                  cursor: "pointer",
                  outline: "none",
                  display: "inline-block",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  const mapUrl = getGoogleMapsUrl(p.mapUrl);
                  const win = window.open(mapUrl, "_blank");
                  if (!win) {
                    window.location.href = mapUrl;
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                    e.preventDefault();
                    const mapUrl = getGoogleMapsUrl(p.mapUrl);
                    const win = window.open(mapUrl, "_blank");
                    if (!win) {
                      window.location.href = mapUrl;
                    }
                  }
                }}
              >
                Open in Google Maps →
              </span>
            </div>
          )}
        </div>
      </div>
      {/* Offer bar at the bottom */}
      {offerTags.length > 0 && (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            // background: "#e8f5e8",
            boxShadow:
              "0 2px 8px 0 rgba(44, 62, 80, 0.10), 0 -2px 8px 0 rgba(44, 62, 80, 0.04) inset",
            borderBottomLeftRadius: 14,
            borderBottomRightRadius: 14,
            padding: "12px 12px 10px 12px",
            minHeight: 44,
            alignItems: "center",
            position: "relative",
            zIndex: 2,
            marginTop: 0,
          }}
        >
          {offerTags.map((tag, index) => (
            <span
              key={index}
              style={{
                background: "#b7e4c7",
                color: "#205c3b",
                fontWeight: 700,
                fontSize: 10,
                textTransform: "uppercase",
                borderRadius: 999,
                padding: "7px 16px",
                letterSpacing: "0.08em",
                boxShadow: "0 1px 4px 0 rgba(44, 62, 80, 0.08)",
                margin: 0,
                display: "inline-block",
                border: "none",
                outline: "none",
                cursor: "pointer",
                userSelect: "none",
                transition: "background 0.2s, color 0.2s",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PassUnlocksMobile({ destinationSlug = "ahangama" }) {
  const [selectedCats, setSelectedCats] = useState([]);

  const passPlaces = useMemo(() => {
    return PLACES.filter((p) => p.destinationSlug === destinationSlug)
      .filter((p) => shouldShowPlace(p)) // Only show active places
      .filter((p) => !!p.offer)
      .filter((p) => {
        if (!selectedCats.length) return true;
        return selectedCats.includes(p.category);
      });
  }, [destinationSlug, selectedCats]);

  const catsAvailable = useMemo(() => {
    const set = new Set(
      PLACES.filter((p) => p.destinationSlug === destinationSlug && p.offer)
        .filter((p) => shouldShowPlace(p)) // Only show active places
        .map((p) => p.category)
        .filter(Boolean),
    );
    return Array.from(set);
  }, [destinationSlug]);

  const toggleCat = (cat) => {
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((x) => x !== cat) : [...prev, cat],
    );
  };

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, rgba(255,248,220,0.3) 0%, rgba(255,255,255,0.9) 100%)",
        borderRadius: "16px",
        padding: "16px",
        margin: "0 -8px",
      }}
    >
      {/* Compact Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "18px" }}>🎁</span>
          <div>
            <Title
              level={4}
              style={{
                margin: 0,
                color: "#8B4513",
                fontSize: "18px",
                lineHeight: "1.2",
              }}
            >
              Your Pass Unlocks
            </Title>
            <Text
              style={{
                fontSize: "11px",
                color: "#666",
                display: "block",
                lineHeight: "1.2",
              }}
            >
              {passPlaces.length} deals available
            </Text>
          </div>
        </div>
        <Button
          type="primary"
          size="small"
          href="/card"
          icon={<QrcodeOutlined />}
          style={{
            borderRadius: "12px",
            background: "linear-gradient(135deg, #FFD700, #FFA500)",
            border: "none",
            fontSize: "12px",
            height: "32px",
            boxShadow: "0 2px 6px rgba(255,165,0,0.2)",
          }}
        >
          Get Pass
        </Button>
      </div>

      {/* Filter Pills */}
      <div
        style={{
          marginBottom: "12px",
          background: "rgba(255,255,255,0.7)",
          padding: "12px",
          borderRadius: "12px",
          border: "1px solid rgba(139,69,19,0.1)",
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
          <Text strong style={{ fontSize: "12px", color: "#8B4513" }}>
            Filter by category
          </Text>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {catsAvailable.map((cat) => (
            <Tag
              key={cat}
              color={selectedCats.includes(cat) ? "#8B4513" : "default"}
              style={{
                cursor: "pointer",
                fontSize: "11px",
                margin: 0,
                padding: "4px 8px",
                borderRadius: "8px",
              }}
              onClick={() => toggleCat(cat)}
            >
              {CATEGORY_LABELS[cat] || cat}
            </Tag>
          ))}
          {selectedCats.length > 0 && (
            <Tag
              color="red"
              style={{
                cursor: "pointer",
                fontSize: "11px",
                margin: 0,
                padding: "4px 8px",
                borderRadius: "8px",
              }}
              onClick={() => setSelectedCats([])}
            >
              Clear all
            </Tag>
          )}
        </div>
      </div>

      {/* Places List - Optimized for mobile scrolling */}
      <div
        style={{
          maxHeight: "1000px",
          overflowY: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {passPlaces.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "24px 12px",
              background: "rgba(255,255,255,0.5)",
              borderRadius: "12px",
              border: "2px dashed #d9d9d9",
            }}
          >
            <Text type="secondary" style={{ fontSize: "13px" }}>
              No matches found. Try adjusting your search or filters.
            </Text>
          </div>
        ) : (
          passPlaces.map((p, index) => (
            <MobilePlaceCard
              key={p.id || p.slug || `${p.name}-${index}`}
              p={p}
            />
          ))
        )}
      </div>

      {/* View All Button */}
      {passPlaces.length > 0 && (
        <div style={{ textAlign: "center", marginTop: "12px" }}>
          <Button
            type="dashed"
            block
            href="/card"
            style={{
              borderRadius: "12px",
              height: "40px",
              fontSize: "13px",
              fontWeight: "500",
              color: "#8B4513",
              borderColor: "rgba(139,69,19,0.3)",
            }}
          >
            GET THE PASS →
          </Button>
        </div>
      )}
    </div>
  );
}
