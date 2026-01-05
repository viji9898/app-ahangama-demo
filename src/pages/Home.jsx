import React from "react";
import { Card, Row, Col, Typography, Button, Space, Tag } from "antd";
import QRCode from "react-qr-code";
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
import { CATEGORIES } from "../data/categories";
import { PLACES } from "../data/places";
import PassUnlocksSection from "../components/home/PassUnlocksSection";
import PassUnlocksMobile from "../components/home/PassUnlocksMobile";
import HomeMapSection from "../components/home/HomeMapSection";
import HomeMapSectionMobile from "../components/home/HomeMapSectionMobile";
import FreeGuideCtaMobile from "../components/home/FreeGuideCtaMobile";
import HeroSectionMobile from "../components/home/HeroSectionMobile";

const { Title, Paragraph, Text } = Typography;

export default function Home() {
  const canonical = absUrl("/");
  const categories = CATEGORIES.filter((c) =>
    ["eat", "stays", "experiences", "culture"].includes(c.key)
  );

  const handleFreeGuideClick = () => {
    if (window.gtag) {
      window.gtag("event", "click_free_guide_whatsapp", {
        guide: "ahangama_free_guide",
        source: "website",
        page: window.location.pathname,
      });
    }

    window.open(
      "https://wa.me/94777908790?text=please%20send%20me%20the%20Ahangama%20Guide",
      "_blank"
    );
  };

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
    "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/hero.jpg";

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
      <div className="dm-heroCut" />
      <div className="dm-canvas">
        <div className="dm-wrap">
          {/* Desktop version */}
          <div className="desktop-only" style={{ display: "block" }}>
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
                      A clean, opinionated guide to where to stay, eat, and
                      spend your days — plus a <strong>$18 card</strong> that
                      unlocks local privileges at selected venues.
                    </Paragraph>

                    <Space wrap size={10}>
                      <Button
                        type="primary"
                        size="large"
                        href="/search"
                        icon={<ArrowRightOutlined />}
                      >
                        Start exploring
                      </Button>
                      <Button
                        size="large"
                        href="/card"
                        icon={<QrcodeOutlined />}
                      >
                        Get the Card
                      </Button>
                      {/* <Button size="large" href="/search">
                        Search everything
                      </Button> */}
                    </Space>

                    <div className="ahg-metrics">
                      {/* <div className="ahg-metric">
                        <Text type="secondary">Categories</Text>
                        <div className="ahg-metricVal">4</div>
                      </div> */}
                      <div className="ahg-metric">
                        <Text type="secondary">Partners</Text>
                        <div className="ahg-metricVal">
                          {
                            PLACES.filter(
                              (p) => p.destinationSlug === "ahangama"
                            ).length
                          }
                        </div>
                      </div>
                      <div className="ahg-metric">
                        <Text type="secondary">Card</Text>
                        <div className="ahg-metricVal">$18</div>
                      </div>
                    </div>
                  </Col>

                  <Col xs={24} md={11}>
                    <div className="ahg-heroMedia">
                      <div className="ahg-heroImg" />
                      <div className="ahg-heroOverlay">
                        <div className="ahg-overlayTop">
                          <Text strong style={{ color: "#fff" }}>
                            {/* This week in Ahangama */}
                          </Text>
                          <Text
                            style={{
                              color: "rgba(255,255,255,0.75)",
                              fontSize: 12,
                            }}
                          >
                            {/* (Placeholder spotlight) */}
                          </Text>
                        </div>
                        <div className="ahg-overlayBottom">
                          <Space wrap size={[6, 6]}>
                            <Tag
                              className="ahg-overlayTag"
                              icon={<CoffeeOutlined />}
                            >
                              Best coffee mornings
                            </Tag>
                            <Tag
                              className="ahg-overlayTag"
                              icon={<CompassOutlined />}
                            >
                              Sunset experience
                            </Tag>
                            <Tag
                              className="ahg-overlayTag"
                              icon={<HomeOutlined />}
                            >
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
          </div>
          {/* Mobile version */}
          <div className="mobile-only" style={{ display: "none" }}>
            <HeroSectionMobile heroImage={heroImage} />
          </div>

          {/* FREE GUIDE CTA */}
          <div style={{ marginTop: 24 }}>
            {/* Desktop version */}
            <div className="desktop-only" style={{ display: "block" }}>
              <Card
                style={{
                  borderRadius: 18,
                  border: "1px solid rgba(0,0,0,0.06)",
                  background:
                    "linear-gradient(135deg, rgba(37,211,102,0.05) 0%, rgba(255,255,255,0.9) 100%)",
                }}
                bodyStyle={{ padding: 24 }}
              >
                <Row gutter={[24, 16]} align="middle">
                  <Col xs={24} lg={14}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "12px",
                          background:
                            "linear-gradient(135deg, #25D366, #128C7E)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "18px",
                        }}
                      >
                        📄
                      </div>
                      <div>
                        <Title
                          level={3}
                          style={{
                            margin: 0,
                            color: "#2F3349",
                            fontSize: "20px",
                          }}
                        >
                          Free Ahangama Guide
                        </Title>
                        <Text type="secondary" style={{ fontSize: "13px" }}>
                          Comprehensive guide
                        </Text>
                      </div>
                    </div>
                    <Paragraph
                      style={{
                        marginBottom: 0,
                        fontSize: "15px",
                        color: "#5A6C7D",
                        lineHeight: 1.6,
                      }}
                    >
                      Our favourite cafés, stays, experiences, and hidden
                      corners — with simple local context so you know where to
                      go, when, and why. Sent straight to WhatsApp for easy
                      access anytime.
                    </Paragraph>
                  </Col>

                  <Col xs={24} lg={10}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        justifyContent: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ textAlign: "center" }}>
                        <div style={{ marginBottom: "8px" }}>
                          <Text
                            strong
                            style={{ fontSize: "13px", color: "#2F3349" }}
                          >
                            Scan to get guide
                          </Text>
                        </div>
                        <div
                          style={{
                            padding: "12px",
                            background: "#fff",
                            borderRadius: "12px",
                            border: "2px solid rgba(37,211,102,0.2)",
                            boxShadow: "0 4px 12px rgba(37,211,102,0.15)",
                            display: "inline-block",
                          }}
                        >
                          <QRCode
                            value="https://wa.me/94777908790?text=please%20send%20me%20the%20Ahangama%20Guide"
                            size={90}
                            level="M"
                            fgColor="#2F3349"
                          />
                        </div>
                      </div>

                      <div style={{ textAlign: "center" }}>
                        <div style={{ marginBottom: "8px" }}>
                          <Text
                            strong
                            style={{ fontSize: "13px", color: "#2F3349" }}
                          >
                            Or click here
                          </Text>
                        </div>
                        <Button
                          type="primary"
                          size="large"
                          onClick={handleFreeGuideClick}
                          style={{
                            background:
                              "linear-gradient(135deg, #25D366, #128C7E)",
                            borderColor: "transparent",
                            borderRadius: "12px",
                            height: "48px",
                            padding: "0 20px",
                            fontWeight: "600",
                            boxShadow: "0 4px 12px rgba(37,211,102,0.25)",
                            border: "none",
                          }}
                          icon={
                            <span
                              style={{ fontSize: "16px", marginRight: "4px" }}
                            >
                              💬
                            </span>
                          }
                        >
                          WhatsApp Guide
                        </Button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
            </div>
            {/* Mobile version */}
            <div className="mobile-only" style={{ display: "none" }}>
              <FreeGuideCtaMobile onGuideClick={handleFreeGuideClick} />
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            {/* Desktop version */}
            <div className="desktop-only" style={{ display: "block" }}>
              <HomeMapSection />
            </div>
            {/* Mobile version */}
            <div className="mobile-only" style={{ display: "none" }}>
              <HomeMapSectionMobile />
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            {/* Desktop version */}
            <div className="desktop-only" style={{ display: "block" }}>
              <PassUnlocksSection destinationSlug="ahangama" />
            </div>
            {/* Mobile version */}
            <div className="mobile-only" style={{ display: "none" }}>
              <PassUnlocksMobile destinationSlug="ahangama" />
            </div>
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
                    verification, real perks, and a curated venue list that
                    grows over time.
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
                  {/* <Button style={{ marginTop: 10 }} block href="/card/my">
                    View my QR
                  </Button> */}
                </Col>
              </Row>
            </Card>
          </div>
        </div>{" "}
        {/* dm-wrap */}
      </div>{" "}
      {/* dm-canvas */}
    </SiteLayout>
  );
}
