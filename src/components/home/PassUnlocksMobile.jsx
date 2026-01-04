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

const { Title, Text } = Typography;

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

function MobilePlaceCard({ p }) {
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
    if (category === "experiences") {
      return { background: "#f6f0ff", color: "#8B5A96" };
    }
    if (category === "culture") {
      return { background: "#e6f7ff", color: "#1890ff" };
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
        borderRadius: "12px",
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        marginBottom: "12px",
        position: "relative",
      }}
    >
      {/* Horizontal layout for mobile */}
      <div style={{ display: "flex", height: "120px" }}>
        {/* Image section - smaller for mobile */}
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

        {/* Content section */}
        <div
          style={{
            flex: 1,
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Top section */}
          <div>
            <h4
              style={{
                fontSize: "15px",
                fontWeight: "600",
                margin: "0 0 4px 0",
                color: "#222",
                lineHeight: "1.3",
              }}
            >
              {p.name}
            </h4>
            <Text
              style={{
                fontSize: "12px",
                color: "#666",
                display: "block",
                marginBottom: "8px",
              }}
            >
              {p.area || "Ahangama"}
            </Text>
          </div>

          {/* Offer tags */}
          {offerTags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {offerTags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  style={{
                    fontSize: "10px",
                    padding: "3px 6px",
                    borderRadius: "8px",
                    background: tagColors.background,
                    color: tagColors.color,
                    fontWeight: "500",
                    textTransform: "uppercase",
                    letterSpacing: "0.3px",
                  }}
                >
                  {tag}
                </span>
              ))}
              {offerTags.length > 2 && (
                <span
                  style={{
                    fontSize: "10px",
                    padding: "3px 6px",
                    borderRadius: "8px",
                    background: "#f0f0f0",
                    color: "#666",
                    fontWeight: "500",
                  }}
                >
                  +{offerTags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PassUnlocksMobile({ destinationSlug = "ahangama" }) {
  const [q, setQ] = useState("");
  const [selectedCats, setSelectedCats] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const passPlaces = useMemo(() => {
    const query = q.trim().toLowerCase();

    return PLACES.filter((p) => p.destinationSlug === destinationSlug)
      .filter((p) => !!p.offer)
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
      });
  }, [destinationSlug, q, selectedCats]);

  const catsAvailable = useMemo(() => {
    const set = new Set(
      PLACES.filter((p) => p.destinationSlug === destinationSlug && p.offer)
        .map((p) => p.category)
        .filter(Boolean)
    );
    return Array.from(set);
  }, [destinationSlug]);

  const toggleCat = (cat) => {
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((x) => x !== cat) : [...prev, cat]
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

      {/* Search Bar */}
      <div style={{ marginBottom: "12px" }}>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          prefix={<SearchOutlined style={{ color: "#999" }} />}
          placeholder="Search offers..."
          size="large"
          style={{
            borderRadius: "12px",
            border: "1px solid rgba(139,69,19,0.1)",
            fontSize: "14px",
          }}
          suffix={
            <Button
              type="text"
              size="small"
              icon={<FilterOutlined />}
              onClick={() => setShowFilters(!showFilters)}
              style={{
                color: selectedCats.length > 0 ? "#8B4513" : "#999",
                fontWeight: selectedCats.length > 0 ? "600" : "normal",
              }}
            >
              {selectedCats.length > 0 && (
                <span
                  style={{
                    background: "#8B4513",
                    color: "#fff",
                    borderRadius: "50%",
                    width: "16px",
                    height: "16px",
                    fontSize: "10px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: "4px",
                  }}
                >
                  {selectedCats.length}
                </span>
              )}
            </Button>
          }
        />
      </div>

      {/* Collapsible Filter Pills */}
      {showFilters && (
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
            <Button
              type="text"
              size="small"
              icon={<CloseOutlined />}
              onClick={() => setShowFilters(false)}
              style={{ color: "#999" }}
            />
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
      )}

      {/* Places List - Optimized for mobile scrolling */}
      <div
        style={{
          maxHeight: "400px",
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
            View Full Map & More Details →
          </Button>
        </div>
      )}
    </div>
  );
}
