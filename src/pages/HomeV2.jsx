import React, { useState } from "react";
import { Card, Row, Col, Typography, Tag, Rate, Input, Select, Space, Button } from "antd";
import { PLACES } from "../data/places";
import SiteLayout from "../components/layout/SiteLayout";

const { Title, Text } = Typography;

// Extract unique categories for filtering
const categories = Array.from(new Set(PLACES.filter(p => p.status === "active").map(p => p.category)));

export default function HomeV2() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(undefined);

  // Filter active venues
  const filtered = PLACES.filter(
    (p) =>
      p.status === "active" &&
      (!category || p.category === category) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.cardPerk && p.cardPerk.toLowerCase().includes(search.toLowerCase())) ||
        (p.tags && p.tags.join(" ").toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <SiteLayout>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
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
            onChange={e => setSearch(e.target.value)}
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
            <Button onClick={() => { setSearch(""); setCategory(undefined); }}>
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
          {filtered.map((place) => (
            <Col xs={12} sm={12} md={8} lg={6} key={place.id}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => place.mapUrl && window.open(place.mapUrl, '_blank', 'noopener,noreferrer')}
                onKeyPress={e => {
                  if ((e.key === 'Enter' || e.key === ' ') && place.mapUrl) {
                    window.open(place.mapUrl, '_blank', 'noopener,noreferrer');
                  }
                }}
                style={{ cursor: place.mapUrl ? 'pointer' : 'default', borderRadius: 12 }}
              >
                <Card
                  size="small"
                  className="ahg-card-hoverable"
                  title={
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {place.logo && (
                        <img
                          src={place.logo}
                          alt={place.name + " logo"}
                          style={{ width: 32, height: 32, objectFit: "cover", borderRadius: 8, background: "#f5f5f5" }}
                          loading="lazy"
                        />
                      )}
                      <span style={{ fontWeight: 600 }}>{place.name}</span>
                    </div>
                  }
                  extra={place.discount ? <Tag color="gold">{Math.round(place.discount * 100)}% Off</Tag> : null}
                  style={{ minHeight: 180, transition: 'box-shadow 0.18s, border-color 0.18s', borderRadius: 12 }}
                  bodyStyle={{ padding: 12 }}
                >
                  <div style={{ marginBottom: 4 }}>
                    <Rate disabled value={place.stars || 0} allowHalf style={{ fontSize: 14 }} />
                    <Text type="secondary" style={{ marginLeft: 6, fontSize: 13 }}>
                      {place.stars ? place.stars.toFixed(1) : "-"} • {place.reviews || 0} reviews
                    </Text>
                  </div>
                  <div
                    className="ahg-hide-mobile-desc"
                    style={{ fontSize: 13, marginBottom: 6, color: '#555', display: 'block' }}
                  >
                    {place.cardPerk}
                  </div>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 2 }}>{place.tags && place.tags.join(", ")}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{place.area || place.category}</div>
                </Card>
              </div>
                  <style>{`
                    @media (max-width: 600px) {
                      .ahg-hide-mobile-desc {
                        display: none !important;
                      }
                    }
                    .ahg-card-hoverable {
                      border: 1px solid #eee;
                    }
                    .ahg-card-hoverable:hover {
                      box-shadow: 0 4px 18px rgba(79,111,134,0.13), 0 1.5px 6px rgba(0,0,0,0.07);
                      border: 1.5px solid #b2c7d9 !important;
                    }
                  `}</style>
            </Col>
          ))}
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
