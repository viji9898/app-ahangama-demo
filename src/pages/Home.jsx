import React from "react";
import { Card, Row, Col, Typography, Button, Space, Tag, Divider } from "antd";
import {
  CoffeeOutlined,
  HomeOutlined,
  CompassOutlined,
  QrcodeOutlined,
  ArrowRightOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import CategoryGrid from "../components/ui/CategoryGrid";
import { CATEGORIES } from "../data/categories";
import { PLACES } from "../data/places";

const { Title, Paragraph, Text } = Typography;

function FeaturedCard({ title, subtitle, image, href, icon }) {
  return (
    <a href={href} style={{ textDecoration: "none" }}>
      <Card
        hoverable
        className="ahg-feature"
        style={{
          borderRadius: 18,
          border: "1px solid rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
        bodyStyle={{ padding: 16 }}
      >
        <div
          style={{
            height: 170,
            borderRadius: 16,
            background: `url(${image}) center/cover no-repeat`,
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        />
        <div style={{ marginTop: 12 }}>
          <Space align="center" size={10}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 12,
                display: "grid",
                placeItems: "center",
                border: "1px solid rgba(0,0,0,0.08)",
                background: "rgba(255,255,255,0.8)",
              }}
            >
              {icon}
            </div>
            <div style={{ minWidth: 0 }}>
              <Text strong style={{ fontSize: 16, display: "block" }}>
                {title}
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {subtitle}
              </Text>
            </div>
          </Space>
        </div>
      </Card>
    </a>
  );
}

export default function Home() {
  const canonical = absUrl("/");
  const categories = CATEGORIES.filter((c) =>
    ["eat", "stays", "experiences", "culture"].includes(c.key)
  );

  // Quick “featured” picks from your arrays (first items per category)
  const eat = PLACES.find(
    (p) => p.destinationSlug === "ahangama" && p.category === "eat"
  );
  const stays = PLACES.find(
    (p) => p.destinationSlug === "ahangama" && p.category === "stays"
  );
  const exp = PLACES.find(
    (p) => p.destinationSlug === "ahangama" && p.category === "experiences"
  );

  const heroImage =
    "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=1800";

  return (
    <SiteLayout>
      <Seo
        title="Ahangama"
        description="Curated guides to stays, food, experiences and culture in Ahangama — plus a discount card that gives you more for your money."
        canonical={canonical}
        ogImage={heroImage}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "ahangama.com",
          url: canonical,
        }}
      />

      {/* HERO */}
      <div className="ahg-hero">
        <div className="ahg-heroInner">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={13}>
              <div className="ahg-pillRow">
                <Tag className="ahg-pill" icon={<ThunderboltOutlined />}>
                  Curated
                </Tag>
                <Tag className="ahg-pill">FIT-friendly</Tag>
                <Tag className="ahg-pill">Long-stay</Tag>
                <Tag className="ahg-pill" icon={<QrcodeOutlined />}>
                  Discount card
                </Tag>
              </div>

              <Title className="ahg-h1">
                Ahangama,
                <br />
                but curated.
              </Title>

              <Paragraph className="ahg-sub">
                A clean, opinionated guide to where to stay, eat, and spend your
                days — plus a <strong>$35 card</strong> that unlocks local
                privileges at selected venues.
              </Paragraph>

              <Space wrap size={10}>
                <Button
                  type="primary"
                  size="large"
                  href="/eat"
                  icon={<ArrowRightOutlined />}
                >
                  Start exploring
                </Button>
                <Button size="large" href="/card" icon={<QrcodeOutlined />}>
                  Get the Card
                </Button>
                <Button size="large" href="/search">
                  Search everything
                </Button>
              </Space>

              <div className="ahg-metrics">
                <div className="ahg-metric">
                  <Text type="secondary">Categories</Text>
                  <div className="ahg-metricVal">4</div>
                </div>
                <div className="ahg-metric">
                  <Text type="secondary">Curated places</Text>
                  <div className="ahg-metricVal">
                    {
                      PLACES.filter((p) => p.destinationSlug === "ahangama")
                        .length
                    }
                  </div>
                </div>
                <div className="ahg-metric">
                  <Text type="secondary">Card</Text>
                  <div className="ahg-metricVal">$35</div>
                </div>
              </div>
            </Col>

            <Col xs={24} md={11}>
              <div className="ahg-heroMedia">
                <div className="ahg-heroImg" />
                <div className="ahg-heroOverlay">
                  <div className="ahg-overlayTop">
                    <Text strong style={{ color: "#fff" }}>
                      This week in Ahangama
                    </Text>
                    <Text
                      style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}
                    >
                      (Placeholder spotlight)
                    </Text>
                  </div>
                  <div className="ahg-overlayBottom">
                    <Space wrap size={[6, 6]}>
                      <Tag className="ahg-overlayTag" icon={<CoffeeOutlined />}>
                        Best coffee mornings
                      </Tag>
                      <Tag
                        className="ahg-overlayTag"
                        icon={<CompassOutlined />}
                      >
                        Sunset experience
                      </Tag>
                      <Tag className="ahg-overlayTag" icon={<HomeOutlined />}>
                        Long-stay pick
                      </Tag>
                    </Space>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* QUICK FEATURED */}
      <div style={{ marginTop: 16 }}>
        <Row gutter={[12, 12]}>
          <Col xs={24} md={8}>
            <FeaturedCard
              title="Eat & Drink"
              subtitle="Cafés + restaurants worth returning to"
              href="/eat"
              image={
                eat?.image ||
                "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1600"
              }
              icon={<CoffeeOutlined />}
            />
          </Col>
          <Col xs={24} md={8}>
            <FeaturedCard
              title="Stays"
              subtitle="Design-led, calm, well-located"
              href="/stays"
              image={
                stays?.image ||
                "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1600"
              }
              icon={<HomeOutlined />}
            />
          </Col>
          <Col xs={24} md={8}>
            <FeaturedCard
              title="Experiences"
              subtitle="Surf, wellness, and day-makers"
              href="/experiences"
              image={
                "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/surfing_ahangama_surf_camp_poe_waves_sri_lanka-scaled.jpg"
              }
              icon={<CompassOutlined />}
            />
          </Col>
          <Col xs={24} md={8}>
            <FeaturedCard
              title="Culture"
              subtitle="Rituals, heritage, and local life"
              image={
                "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/yaka-mask.jpg"
              }
              icon={<CompassOutlined />}
            />
          </Col>
        </Row>
      </div>

      {/* CATEGORY GRID */}
      <div style={{ marginTop: 16 }}>
        <Card
          style={{ borderRadius: 18, border: "1px solid rgba(0,0,0,0.06)" }}
          bodyStyle={{ padding: 18 }}
        >
          <Row align="middle" justify="space-between" gutter={[12, 12]}>
            <Col>
              <Title level={3} style={{ margin: 0 }}>
                Browse the guide
              </Title>
              <Text type="secondary">
                No rankings. Just picks we’d send to a friend.
              </Text>
            </Col>
            <Col>
              <Button href="/search" icon={<ArrowRightOutlined />}>
                Open the index
              </Button>
            </Col>
          </Row>
          <Divider style={{ margin: "14px 0" }} />
          <CategoryGrid categories={categories} />
        </Card>
      </div>

      {/* CARD CTA */}
      <div style={{ marginTop: 16 }}>
        <Card
          className="ahg-cardCta"
          style={{ borderRadius: 18, border: "1px solid rgba(0,0,0,0.06)" }}
          bodyStyle={{ padding: 18 }}
        >
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={16}>
              <Title level={3} style={{ marginTop: 0, marginBottom: 6 }}>
                The Ahangama Card
              </Title>
              <Paragraph style={{ marginBottom: 0 }}>
                Built for people staying more than a few days. Simple vendor
                verification, real perks, and a curated venue list that grows
                over time.
              </Paragraph>
            </Col>
            <Col xs={24} md={8}>
              <Button
                type="primary"
                size="large"
                block
                href="/card"
                icon={<QrcodeOutlined />}
              >
                Get the Card
              </Button>
              <Button style={{ marginTop: 10 }} block href="/card/my">
                View my QR
              </Button>
            </Col>
          </Row>
        </Card>
      </div>
    </SiteLayout>
  );
}
