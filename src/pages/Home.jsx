import React from "react";
import { Card, Row, Col, Typography, Button, Space, Tag } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import CategoryGrid from "../components/ui/CategoryGrid";
import { CATEGORIES } from "../data/categories";

const { Title, Paragraph, Text } = Typography;

export default function Home() {
  const canonical = absUrl("/");

  return (
    <SiteLayout>
      <Seo
        title="Ahangama"
        description="Curated guides to stays, food, experiences and culture in Ahangama — plus a discount card that gives you more for your money."
        canonical={canonical}
        ogImage="https://images.pexels.com/photos/1699020/pexels-photo-1699020.jpeg?auto=compress&cs=tinysrgb&w=1600"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "ahangama.com",
          url: canonical,
        }}
      />

      <Card
        style={{ borderRadius: 16, border: "1px solid #eee" }}
        bodyStyle={{ padding: 22 }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={14}>
            <Title
              level={1}
              style={{ margin: 0, fontSize: 40, lineHeight: 1.05 }}
            >
              Ahangama
            </Title>
            <Paragraph style={{ fontSize: 16, marginTop: 10, maxWidth: 760 }}>
              A curated guide for independent travellers — where to stay, where
              to eat, what to do, and local context that makes your trip
              smoother.
            </Paragraph>

            <Space wrap>
              <Button type="primary" size="large" href="/eat">
                Start with Eat & Drink
              </Button>
              <Button size="large" href="/stays">
                Browse stays
              </Button>
              <Button size="large" href="/experiences">
                Browse experiences
              </Button>
            </Space>

            <div style={{ marginTop: 12 }}>
              <Tag>Curated</Tag>
              <Tag>FIT-friendly</Tag>
              <Tag>Long-stay</Tag>
              <Tag>Discount card</Tag>
            </div>
          </Col>

          <Col xs={24} md={10}>
            <div
              style={{
                height: 220,
                borderRadius: 16,
                background:
                  "url(https://images.pexels.com/photos/1699020/pexels-photo-1699020.jpeg?auto=compress&cs=tinysrgb&w=1600) center/cover no-repeat",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              (Placeholder image URL — swap later.)
            </Text>
          </Col>
        </Row>
      </Card>

      <div style={{ marginTop: 14 }}>
        <CategoryGrid
          categories={CATEGORIES.filter((c) =>
            ["eat", "stays", "experiences", "culture"].includes(c.key)
          )}
        />
      </div>

      <Card
        style={{ marginTop: 14, borderRadius: 16, border: "1px solid #eee" }}
        bodyStyle={{ padding: 18 }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={16}>
            <Title level={3} style={{ marginTop: 0 }}>
              Get more for your money
            </Title>
            <Paragraph style={{ marginBottom: 0 }}>
              The Ahangama Card gives you local privileges across selected
              venues — built for people staying more than a few days.
            </Paragraph>
          </Col>
          <Col xs={24} md={8}>
            <Button type="primary" size="large" block href="/card">
              Get the Card
            </Button>
          </Col>
        </Row>
      </Card>

      <Card
        style={{ marginTop: 14, borderRadius: 16, border: "1px solid #eee" }}
        bodyStyle={{ padding: 18 }}
      >
        <Title level={4} style={{ marginTop: 0 }}>
          Browse everything
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          Prefer a full index? Use the search page.
        </Paragraph>
        <Button style={{ marginTop: 10 }} href="/search">
          Open Search
        </Button>
      </Card>
    </SiteLayout>
  );
}
