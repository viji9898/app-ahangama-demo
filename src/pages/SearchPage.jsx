import React, { useMemo, useState } from "react";
import { Card, Row, Col, Input, Tag, Space, Typography, Empty } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import PlaceCard from "../components/ui/PlaceCard";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { PLACES } from "../data/places";
import { CATEGORIES } from "../data/categories";

const { Title, Paragraph, Text } = Typography;

function normalize(s) {
  return (s || "").toLowerCase().trim();
}

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState(null);

  const places = useMemo(
    () => PLACES.filter((p) => p.destinationSlug === "ahangama"),
    []
  );
  const filtered = useMemo(() => {
    const nq = normalize(q);
    return places.filter((p) => {
      if (cat && p.category !== cat) return false;
      if (!nq) return true;
      const hay = normalize(
        [
          p.name,
          p.excerpt,
          p.description,
          p.area,
          p.price,
          ...(p.bestFor || []),
          ...(p.tags || []),
        ].join(" ")
      );
      return hay.includes(nq);
    });
  }, [places, q, cat]);

  const canonical = absUrl("/search");

  return (
    <SiteLayout>
      <Seo
        title="Search Ahangama"
        description="Browse everything in Ahangama — search across food, stays, and experiences."
        canonical={canonical}
        ogImage={places[0]?.ogImage || places[0]?.image}
      />

      <Card
        style={{ borderRadius: 16, border: "1px solid #eee" }}
        bodyStyle={{ padding: 20 }}
      >
        <Title level={1} style={{ marginTop: 0 }}>
          Search
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 10 }}>
          A crawlable index that helps users (and Google) discover content
          faster.
        </Paragraph>

        <Input
          placeholder="Search: coffee, surf, boutique, long-stay…"
          allowClear
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <div style={{ marginTop: 12 }}>
          <Space wrap>
            <Tag
              color={!cat ? "blue" : "default"}
              style={{ cursor: "pointer" }}
              onClick={() => setCat(null)}
            >
              All
            </Tag>
            {CATEGORIES.filter((c) =>
              ["eat", "stays", "experiences"].includes(c.key)
            ).map((c) => (
              <Tag
                key={c.key}
                color={cat === c.key ? "blue" : "default"}
                style={{ cursor: "pointer" }}
                onClick={() => setCat(c.key)}
              >
                {c.title}
              </Tag>
            ))}
          </Space>
        </div>

        <Text
          type="secondary"
          style={{ fontSize: 12, display: "block", marginTop: 10 }}
        >
          Results: {filtered.length}
        </Text>
      </Card>

      <Row gutter={[12, 12]} style={{ marginTop: 14 }}>
        {filtered.map((p) => (
          <Col xs={24} md={8} key={p.id}>
            <PlaceCard place={p} basePath={`/${p.category}`} />
          </Col>
        ))}
      </Row>

      {filtered.length === 0 && (
        <div style={{ marginTop: 18 }}>
          <Empty
            description={
              <Text type="secondary">No matches. Try a different keyword.</Text>
            }
          />
        </div>
      )}
    </SiteLayout>
  );
}
