import React, { useState, useEffect } from "react";
// Haversine formula to calculate distance between two lat/lng points in km
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Rate,
  Input,
  Select,
  Space,
  Button,
} from "antd";
import { PLACES } from "../data/places";
import SiteLayout from "../components/layout/SiteLayout";

const { Title, Text } = Typography;

// Extract unique categories for filtering
const categories = Array.from(
  new Set(PLACES.filter((p) => p.status === "active").map((p) => p.category)),
);

export default function HomeV2() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(undefined);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {},
        { enableHighAccuracy: true, timeout: 10000 },
      );
    }
  }, []);

  // Filter active venues
  const filtered = PLACES.filter(
    (p) => p.statu,
    s === "active" &&
      (!category || p.category === category) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.cardPerk &&
          p.cardPerk.toLowerCase().includes(search.toLowerCase())) ||
        (p.tags &&
          p.tags.join(" ").toLowerCase().includes(search.toLowerCase()))),
  );

  return (
    <SiteLayout>
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: 24,
          position: "relative",
        }}
      >
        {/* Floating Get Pass button for mobile */}
        <a
          href="https://pass.ahangama.com"
          target="_blank"
          rel="noopener noreferrer"
          className="ahg-floating-getpass-btn"
          style={{
            display: "none",
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            margin: "0 auto",
            zIndex: 1000,
            width: "100vw",
            maxWidth: 500,
            background: "linear-gradient(90deg, #f7b733 60%, #fc8803 100%)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 20,
            padding: "18px 0 16px 0",
            borderRadius: "18px 18px 0 0",
            boxShadow: "0 -2px 16px rgba(79,111,134,0.10)",
            textAlign: "center",
            textDecoration: "none",
            letterSpacing: 0.5,
            transition: "background 0.2s, box-shadow 0.2s",
          }}
        >
          Get Your Pass
        </a>
        {/* Banner Section */}
        <div
          className="ahg-banner-responsive"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundImage: ` url('https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/banner_background.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            borderRadius: 16,
            boxShadow: "0 2px 8px rgba(79,111,134,0.06)",
            padding: "28px 32px 24px 24px",
            marginBottom: 32,
            position: "relative",
            overflow: "hidden",
            flexWrap: "wrap",
          }}
        >
          <div
            className="ahg-banner-content"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              flex: 1,
              minWidth: 0,
            }}
          >
            <img
              src="https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/pass_sample.jpeg"
              alt="Ahangama Pass Illustration"
              style={{
                width: 64,
                height: "100%",
                borderRadius: 6,
                background: "#fff",
                boxShadow: "0 1px 4px #e0e0e0",
                flexShrink: 0,
              }}
            />
            <div style={{ minWidth: 0 }}>
              <div
                className="ahg-banner-title"
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#222",
                  lineHeight: 1.2,
                }}
              >
                Guide to exclusive privileges in <strong>{` Ahangama.`}</strong>
              </div>
              <div
                className="ahg-banner-desc"
                style={{ fontSize: 17, color: "#6b6f6a", marginTop: 6 }}
              >
                One pass to save at cafés, surf-schools, hostels,experiences and
                shops
              </div>
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width: 700px) {
            .ahg-mobile-top-image {
              display: flex !important;
            }
            .ahg-banner-responsive {
              flex-direction: column !important;
              align-items: flex-start !important;
              padding: 18px 10px 18px 10px !important;
            }
            .ahg-banner-content {
              flex-direction: row !important;
              gap: 12px !important;
              margin-bottom: 12px !important;
            }
            .ahg-banner-title {
              font-size: 20px !important;
            }
            .ahg-banner-desc {
              font-size: 15px !important;
            }
            .ahg-banner-btn {
              width: 100% !important;
              margin-left: 0 !important;
              margin-top: 16px !important;
              font-size: 18px !important;
              text-align: center !important;
              padding: 14px 0 !important;
            }
            .ahg-floating-getpass-btn {
              display: block !important;
            }
          }
        `}</style>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <Input.Search
            placeholder="Search venues or perks"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", maxWidth: 340 }}
            allowClear
          />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              overflowX: "auto",
            }}
          >
            <Button
              onClick={() => setCategory(undefined)}
              type={!category ? "primary" : "default"}
              style={{ minWidth: 70 }}
            >
              All
            </Button>
            {categories.map((c) => (
              <Button
                key={c}
                type={category === c ? "primary" : "default"}
                onClick={() => setCategory(category === c ? undefined : c)}
                style={{ textTransform: "capitalize", minWidth: 70 }}
              >
                {c}
              </Button>
            ))}
            <Button
              onClick={() => {
                setSearch("");
                setCategory(undefined);
              }}
            >
              Reset
            </Button>
          </div>
        </div>
        <Row gutter={[16, 16]}>
          {filtered.length === 0 && (
            <Col span={24}>
              <Text type="secondary">No venues found.</Text>
            </Col>
          )}
          {filtered.map((place) => {
            let distance = null;
            if (userLocation && place.lat && place.lng) {
              distance = getDistanceFromLatLonInKm(
                userLocation.lat,
                userLocation.lng,
                place.lat,
                place.lng,
              );
            }
            // Category to emoji mapping
            const categoryIcons = {
              food: "🍽️",
              eat: "🍽️",
              drink: "🍹",
              stay: "🏨",
              sleep: "🛏️",
              sport: "🏄",
              surf: "🏄",
              yoga: "🧘",
              shop: "🛍️",
              wellness: "💆",
              art: "🎨",
              music: "🎵",
            };
            // Try to match category, fallback to generic icon
            const icon =
              categoryIcons[(place.category || "").toLowerCase()] || "⭐";
            return (
              <Col xs={24} sm={24} md={24} lg={6} key={place.id}>
                <div
                  className="ahg-listing-card-shell"
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    place.mapUrl &&
                    window.open(place.mapUrl, "_blank", "noopener,noreferrer")
                  }
                  onKeyPress={(e) => {
                    if ((e.key === "Enter" || e.key === " ") && place.mapUrl) {
                      window.open(
                        place.mapUrl,
                        "_blank",
                        "noopener,noreferrer",
                      );
                    }
                  }}
                  style={{
                    cursor: place.mapUrl ? "pointer" : "default",
                    borderRadius: 16,
                    background: "#fff",
                    boxShadow: "0 1px 8px rgba(79,111,134,0.07)",
                    padding: 12,
                    margin: "0 auto",
                    minHeight: 104,
                    maxHeight: 148,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    gap: 12,
                    position: "relative",
                    maxWidth: 430,
                  }}
                >
                  {/* Left: Image */}
                  <div className="ahg-listing-card-imgcol">
                    <div
                      style={{
                        position: "relative",
                        width: "120px",
                        height: "120px",
                        margin: 0,
                        padding: 0,
                        flex: "0 0 120px",
                      }}
                    >
                      {place.image && (
                        <img
                          src={place.image}
                          alt={place.name + " photo"}
                          className="ahg-listing-card-img"
                          style={{
                            width: "120px",
                            height: "120px",
                            objectFit: "cover",
                            borderRadius: "14px",
                            display: "block",
                            margin: 0,
                            padding: 0,
                            boxSizing: "border-box",
                          }}
                          loading="lazy"
                        />
                      )}
                      {place.discount && (
                        <span
                          style={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            background: "rgba(255, 215, 64, 0.95)",
                            color: "#7a5c00",
                            fontWeight: 700,
                            fontSize: 13,
                            borderRadius: 10,
                            padding: "2px 10px",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                            zIndex: 2,
                            letterSpacing: 0.2,
                          }}
                        >
                          {Math.round(place.discount * 100)}% Off
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Right: Content */}
                  <div className="ahg-listing-card-content">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 2,
                      }}
                    >
                      <span style={{ fontSize: 20, marginRight: 2 }}>
                        {icon}
                      </span>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: 20,
                          lineHeight: "28px",
                          color: "#222",
                          flex: 1,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {place.name}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        marginBottom: 2,
                      }}
                    >
                      <span
                        style={{
                          color: "#FFC700",
                          fontSize: 18,
                          letterSpacing: "-1px",
                        }}
                      >
                        {"★★★★★".slice(0, Math.round(place.stars || 0))}
                      </span>
                      <span
                        style={{
                          color: "#888",
                          fontWeight: 500,
                          fontSize: 15,
                          marginLeft: 2,
                        }}
                      >
                        {place.stars ? place.stars.toFixed(1) : "-"}
                      </span>
                      <span style={{ color: "#888", fontSize: 15 }}>
                        · {place.reviews || 0} reviews
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 15,
                        color: "#555",
                        marginBottom: 2,
                        lineHeight: "20px",
                        maxHeight: 40,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {place.excerpt || place.cardPerk}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 2,
                      }}
                    >
                      {distance !== null && (
                        <span style={{ color: "#888", fontSize: 15 }}>
                          {distance < 1
                            ? `${Math.round(distance * 1000)} m`
                            : `${distance.toFixed(1)} km`}{" "}
                          away
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 2,
                      }}
                    >
                      {place.offer && place.offer.length > 0
                        ? place.offer
                            .filter(
                              (offer) => !(offer && /%\s*off/i.test(offer)),
                            )
                            .slice(0, 2)
                            .map((offer, i) => (
                              <span
                                key={i}
                                style={{
                                  background: i === 0 ? "#F8E9C7" : "#E6F0FA",
                                  color: i === 0 ? "#A67C00" : "#2176AE",
                                  fontSize: 14,
                                  borderRadius: 16,
                                  padding: "3px 12px",
                                  fontWeight: 600,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 4,
                                }}
                              >
                                {i === 0 ? (
                                  <svg
                                    width="16"
                                    height="16"
                                    style={{ marginRight: 2 }}
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      fill="#F8E9C7"
                                    />
                                    <path
                                      d="M8 12l2 2 4-4"
                                      stroke="#A67C00"
                                      strokeWidth="2"
                                      fill="none"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    width="16"
                                    height="16"
                                    style={{ marginRight: 2 }}
                                    viewBox="0 0 24 24"
                                  >
                                    <rect
                                      x="2"
                                      y="6"
                                      width="20"
                                      height="12"
                                      rx="6"
                                      fill="#E6F0FA"
                                    />
                                    <path
                                      d="M8 12h8"
                                      stroke="#2176AE"
                                      strokeWidth="2"
                                    />
                                  </svg>
                                )}
                                {offer}
                              </span>
                            ))
                        : place.tags &&
                          place.tags.slice(0, 2).map((tag, i) => (
                            <span
                              key={i}
                              style={{
                                background: "#eee",
                                color: "#666",
                                fontSize: 14,
                                borderRadius: 16,
                                padding: "3px 12px",
                                fontWeight: 500,
                                display: "inline-flex",
                                alignItems: "center",
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                    </div>
                  </div>
                </div>
              </Col>
            );
          })}
          <style>{`
                @media (max-width: 600px) {
                  .ahg-hide-mobile-desc {
                    display: none !important;
                  }
                  .ahg-listing-image-wrapper {
                    display: block;
                  }
                  .ahg-listing-image {
                    width: 100% !important;
                    height: 70px !important;
                    border-radius: 10px 10px 0 0 !important;
                  }
                  .ahg-card-hoverable {
                    min-height: 90px !important;
                    padding: 6px 6px 8px 6px !important;
                  }
                  .ant-card-body {
                    padding: 8px 6px 8px 6px !important;
                  }
                  .ahg-card-hoverable .ant-card-head {
                    min-height: 32px !important;
                    padding: 0 6px !important;
                  }
                  .ahg-card-hoverable .ant-card-head-title {
                    font-size: 15px !important;
                  }
                  .ahg-card-hoverable .ant-card-head img {
                    width: 22px !important;
                    height: 22px !important;
                  }
                  .ahg-card-hoverable .ant-card-head span {
                    font-size: 15px !important;
                  }
                  .ahg-card-hoverable .ant-rate {
                    font-size: 12px !important;
                  }
                  .ahg-card-hoverable .ant-typography {
                    font-size: 11px !important;
                  }
                  .ahg-card-hoverable .ant-tag {
                    font-size: 11px !important;
                    height: 18px !important;
                    padding: 0 6px !important;
                  }
                  .ahg-card-hoverable .ant-card-body > div,
                  .ahg-card-hoverable .ant-card-body > span {
                    margin-bottom: 2px !important;
                  }
                  .ahg-card-hoverable .ant-card-body {
                    font-size: 12px !important;
                  }
                  .ahg-card-hoverable .ant-card-body > div[style*="color: #555"] {
                    display: none !important;
                  }
                  .ahg-card-hoverable .ant-card-body > div[style*="color: #888"] {
                    display: none !important;
                  }
                }
                @media (min-width: 601px) {
                  .ahg-listing-image-wrapper {
                    display: block;
                  }
                  .ahg-listing-image {
                    width: 100% !important;
                    height: 120px !important;
                    border-radius: 12px 12px 0 0 !important;
                  }
                }
              `}</style>
        </Row>
      </div>
    </SiteLayout>
  );
}
