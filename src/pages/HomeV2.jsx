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
    (p) =>
      p.status === "active" &&
      (!category || p.category === category) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.cardPerk &&
          p.cardPerk.toLowerCase().includes(search.toLowerCase())) ||
        (p.tags &&
          p.tags.join(" ").toLowerCase().includes(search.toLowerCase()))),
  );

  return (
    <SiteLayout>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
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
                Unlock exclusive access & perks in
                <strong>{` Ahangama.`}</strong>
              </div>
              <div
                className="ahg-banner-desc"
                style={{ fontSize: 17, color: "#6b6f6a", marginTop: 6 }}
              >
                One pass to save at cafés, surf-schools, hostels, and shops
                owned by locals.
              </div>
            </div>
          </div>
          <a
            href="https://pass.ahangama.com"
            target="_blank"
            rel="noopener noreferrer"
            className="ahg-banner-btn"
            style={{
              display: "inline-block",
              background: "linear-gradient(90deg, #f7b733 60%, #fc8803 100%)",
              color: "#fff",
              fontWeight: 600,
              fontSize: 20,
              padding: "14px 38px",
              borderRadius: 999,
              boxShadow: "0 2px 8px rgba(252,136,3,0.10)",
              textDecoration: "none",
              transition: "background 0.2s, box-shadow 0.2s",
              marginLeft: 32,
              whiteSpace: "nowrap",
              marginTop: 0,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(90deg, #fc8803 60%, #f7b733 100%)";
              e.currentTarget.style.boxShadow =
                "0 4px 16px rgba(252,136,3,0.18)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(90deg, #f7b733 60%, #fc8803 100%)";
              e.currentTarget.style.boxShadow =
                "0 2px 8px rgba(252,136,3,0.10)";
            }}
          >
            Get Your Pass
          </a>
        </div>
        <style>{`
          @media (max-width: 700px) {
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
          <Title level={2} style={{ marginBottom: 0, fontSize: 28 }}>
            All Active Venues & Discounts
          </Title>
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
            return (
              <Col xs={12} sm={12} md={8} lg={6} key={place.id}>
                <div
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
                    borderRadius: 12,
                  }}
                >
                  <Card
                    size="small"
                    className="ahg-card-hoverable"
                    title={
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        {place.logo && (
                          <img
                            src={place.logo}
                            alt={place.name + " logo"}
                            style={{
                              width: 32,
                              height: 32,
                              objectFit: "cover",
                              borderRadius: 8,
                              background: "#f5f5f5",
                            }}
                            loading="lazy"
                          />
                        )}
                        <span style={{ fontWeight: 600 }}>{place.name}</span>
                      </div>
                    }
                    extra={
                      place.discount ? (
                        <Tag color="gold">
                          {Math.round(place.discount * 100)}% Off
                        </Tag>
                      ) : null
                    }
                    style={{
                      minHeight: 180,
                      transition: "box-shadow 0.18s, border-color 0.18s",
                      borderRadius: 12,
                    }}
                    bodyStyle={{ padding: 12 }}
                  >
                    <div style={{ marginBottom: 4 }}>
                      <Rate
                        disabled
                        value={place.stars || 0}
                        allowHalf
                        style={{ fontSize: 14 }}
                      />
                      <Text
                        type="secondary"
                        style={{ marginLeft: 6, fontSize: 13 }}
                      >
                        {place.stars ? place.stars.toFixed(1) : "-"} •{" "}
                        {place.reviews || 0} reviews
                      </Text>
                    </div>
                    <div
                      className="ahg-hide-mobile-desc"
                      style={{
                        fontSize: 13,
                        marginBottom: 6,
                        color: "#555",
                        display: "block",
                      }}
                    >
                      {place.cardPerk}
                    </div>
                    <div
                      style={{ fontSize: 12, color: "#888", marginBottom: 2 }}
                    >
                      {place.tags && place.tags.join(", ")}
                    </div>
                    <div style={{ fontSize: 12, color: "#888" }}>
                      {place.area || place.category}
                    </div>
                    {distance !== null && (
                      <div
                        style={{ fontSize: 12, color: "#4f6f86", marginTop: 4 }}
                      >
                        {distance < 1
                          ? `${Math.round(distance * 1000)} m`
                          : `${distance.toFixed(1)} km`}{" "}
                        away
                      </div>
                    )}
                  </Card>
                </div>
              </Col>
            );
          })}
          <style>{`
                @media (max-width: 600px) {
                  .ahg-hide-mobile-desc {
                    display: none !important;
                  }
                }
              `}</style>
        </Row>
      </div>
    </SiteLayout>
  );
}
