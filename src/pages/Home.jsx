import React from "react";
import { Card, Row, Col, Typography, Button, Space, Spin, Tag } from "antd";
import QRCode from "react-qr-code";
import {
  CoffeeOutlined,
  HomeOutlined,
  CompassOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  LaptopOutlined,
  QrcodeOutlined,
  ArrowRightOutlined,
  ThunderboltOutlined,
  ExclamationCircleOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";
import { usePlaces } from "../app/placesContext";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { trackPassCtaClick } from "../analytics";
import { buildPassCtaUrl } from "../lib/passAttribution";
import PassUnlocksSection from "../components/home/PassUnlocksSection";
import PassUnlocksMobile from "../components/home/PassUnlocksMobile";
import HomeMapSection from "../components/home/HomeMapSection";
import HomeMapSectionMobile from "../components/home/HomeMapSectionMobile";
import HomeGoogleMapSection from "../components/home/HomeGoogleMapSection";
import GettingAroundSection from "../components/home/GettingAroundSection";
import TwelveThingsSection from "../components/home/TwelveThingsSection";
import FreeGuideCtaMobile from "../components/home/FreeGuideCtaMobile";
import HeroSectionMobile from "../components/home/HeroSectionMobile";

const { Title, Paragraph, Text } = Typography;

const MAX_EDITORIAL_PICKS = 5;

export default function Home() {
  const { loading } = usePlaces();
  const canonical = absUrl("/");
  const passCtaUrl = buildPassCtaUrl();

  const heroImage =
    "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/hero-coffee-ocean.jpg";
  const guideHighlights = [
    { key: "coffee", icon: <CoffeeOutlined />, label: "Great coffee" },
    { key: "work", icon: <LaptopOutlined />, label: "Work friendly" },
    { key: "healthy", icon: <HeartOutlined />, label: "Healthy options" },
    { key: "views", icon: <CompassOutlined />, label: "Ocean views" },
  ];
  const editorialPicks = [
    {
      key: "surf",
      label: "12 Must Things in Ahangama",
      href: "/12-things",
      image:
        "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=80",
    },
    {
      key: "eat",
      label: "Eat & Drink",
      href: "/eat",
      image: heroImage,
    },
    {
      key: "stays",
      label: "Stays",
      href: "/stays",
      image:
        "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80",
    },
    {
      key: "wellness",
      label: "Wellness",
      href: "/wellness",
      image:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
    },
    {
      key: "local-life",
      label: "Local Life",
      href: "/master-index",
      image:
        "https://images.unsplash.com/photo-1544986581-efac024faf62?auto=format&fit=crop&w=1200&q=80",
    },
    {
      key: "maps",
      label: "Maps & Itineraries",
      href: "/12-things",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  return (
    <SiteLayout>
      <Seo
        title="Ahangama Guide to Perks & Discounts at the Best Local Spots"
        description="Ahangama guide to perks and discounts at the best cafés, stays, surf spots, and experiences—curated local favourites, unlocked with one pass."
        canonical={canonical}
        ogImage={heroImage}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "ahangama.com",
          url: canonical,
        }}
      />
      {/* DISCLAIMER CARD */}
      {/* <div
        className="dm-canvas"
        style={{ paddingTop: "16px", paddingBottom: "0" }}
      >
        <div className="dm-wrap">
          <Card
            style={{
              marginBottom: "24px",
              border: "2px solid var(--orange)",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #fff9f2 0%, #fff 100%)",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}
            >
              <ExclamationCircleOutlined
                style={{
                  color: "var(--orange)",
                  fontSize: "24px",
                  marginTop: "2px",
                }}
              />
              <div style={{ flex: 1 }}>
                <Title
                  level={5}
                  style={{ margin: "0 0 8px 0", color: "var(--dm-ink)" }}
                >
                  Concept Site / Prototype
                </Title>
                <Text
                  style={{
                    color: "var(--ink-muted)",
                    fontSize: "14px",
                    display: "block",
                    marginBottom: "12px",
                  }}
                >
                  This is a demonstration website. All venue information,
                  pricing, and data shown are for testing purposes only and may
                  not reflect actual businesses or services.
                </Text>
                <Button
                  type="primary"
                  icon={<WhatsAppOutlined />}
                  size="small"
                  style={{
                    backgroundColor: "#25D366",
                    borderColor: "#25D366",
                    borderRadius: "6px",
                    fontSize: "12px",
                  }}
                  onClick={() => {
                    window.open(
                      "https://wa.me/94777908790?text=Hi!%20I%20have%20concerns%20about%20the%20test%20data%20on%20your%20concept%20site.",
                      "_blank"
                    );
                  }}
                >
                  Have concerns? Contact us
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div> */}
      {/* HERO */}
      <div className="dm-heroCut" />
      <div className="dm-canvas">
        <div className="dm-wrap">
          {/* Desktop version */}
          <div className="desktop-only" style={{ display: "block" }}>
            <div
              className="ahg-hero"
              style={{
                borderRadius: 30,
                background: "#f7f2ea",
                boxShadow: "0 24px 60px rgba(47,62,58,0.08)",
              }}
            >
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  minHeight: 620,
                }}
              >
                <Row gutter={0} align="stretch">
                  <Col xs={24} xl={10}>
                    <div
                      style={{
                        position: "relative",
                        zIndex: 2,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        minHeight: 620,
                        padding: "88px 56px 44px",
                        background:
                          "linear-gradient(90deg, rgba(249,245,239,0.99) 0%, rgba(249,245,239,0.96) 70%, rgba(249,245,239,0.58) 100%)",
                      }}
                    >
                      <div>
                        <Text
                          style={{
                            display: "block",
                            marginBottom: 20,
                            color: "#B08E62",
                            fontSize: 13,
                            fontWeight: 700,
                            letterSpacing: 2.2,
                            textTransform: "uppercase",
                          }}
                        >
                          The Ahangama Guide
                        </Text>

                        <Title
                          style={{
                            margin: 0,
                            color: "#201E1B",
                            fontSize: 86,
                            lineHeight: 0.9,
                            fontWeight: 500,
                            letterSpacing: -2.6,
                            fontFamily:
                              '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                          }}
                        >
                          <span style={{ whiteSpace: "nowrap" }}>
                            Your guide to
                          </span>
                          <br />
                          <span style={{ whiteSpace: "nowrap" }}>
                            Ahangama
                          </span>
                        </Title>

                        <Paragraph
                          style={{
                            marginTop: 26,
                            marginBottom: 34,
                            maxWidth: 470,
                            color: "#49443D",
                            fontSize: 18,
                            lineHeight: 1.65,
                          }}
                        >
                          Local recommendations, hidden gems and editorial picks
                          to help you eat well, stay well, surf more and
                          experience the best of Ahangama.
                        </Paragraph>

                        <Space wrap size={14}>
                          <Button
                            type="primary"
                            size="large"
                            href="/12-things"
                            icon={<ArrowRightOutlined />}
                            style={{
                              height: 54,
                              paddingInline: 28,
                              borderRadius: 16,
                              background: "#201E1B",
                              borderColor: "#201E1B",
                              boxShadow: "none",
                              fontWeight: 600,
                            }}
                          >
                            Explore the Guide
                          </Button>
                        </Space>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "nowrap",
                          justifyContent: "space-between",
                          gap: 14,
                          paddingTop: 18,
                        }}
                      >
                        {guideHighlights.map((item) => (
                          <div
                            key={item.key}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              color: "#2F2B26",
                              minWidth: "fit-content",
                            }}
                          >
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 22,
                                height: 22,
                                fontSize: 16,
                                color: "#2F2B26",
                              }}
                            >
                              {item.icon}
                            </span>
                            <Text
                              style={{
                                color: "#3A342E",
                                fontSize: 11,
                                fontWeight: 700,
                                letterSpacing: 0.3,
                                textTransform: "uppercase",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {item.label}
                            </Text>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Col>

                  <Col xs={24} xl={14}>
                    <div
                      style={{
                        minHeight: 620,
                        backgroundImage: `linear-gradient(90deg, rgba(249,245,239,0.98) 0%, rgba(249,245,239,0.9) 10%, rgba(249,245,239,0.56) 22%, rgba(249,245,239,0.16) 34%, rgba(0,0,0,0.12) 100%), url(${heroImage})`,
                        backgroundSize: "cover, cover",
                        backgroundPosition: "center, center center",
                        backgroundRepeat: "no-repeat, no-repeat",
                        filter: "saturate(0.96) contrast(1.02)",
                      }}
                    />
                  </Col>
                </Row>

                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: "35%",
                    width: 300,
                    background:
                      "linear-gradient(90deg, rgba(249,245,239,0.98) 0%, rgba(249,245,239,0.64) 42%, rgba(249,245,239,0.12) 82%, rgba(249,245,239,0) 100%)",
                    filter: "blur(28px)",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>
          </div>
          {/* Mobile version */}
          <div className="mobile-only" style={{ display: "none" }}>
            <HeroSectionMobile heroImage={heroImage} />
          </div>

          <div style={{ marginTop: 24 }}>
            <div
              style={{
                borderRadius: 28,
                border: "1px solid rgba(47,62,58,0.08)",
                background:
                  "linear-gradient(180deg, rgba(255,253,249,0.98) 0%, rgba(247,242,234,0.94) 100%)",
                boxShadow: "0 18px 40px rgba(47,62,58,0.05)",
                padding: "28px 28px 30px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  marginBottom: 20,
                }}
              >
                <div>
                  <Text
                    style={{
                      display: "block",
                      marginBottom: 8,
                      color: "#B08E62",
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                    }}
                  >
                    Editor&apos;s Picks
                  </Text>
                  <Title
                    level={2}
                    style={{
                      margin: 0,
                      color: "#201E1B",
                      fontSize: 28,
                      lineHeight: 1.1,
                      fontWeight: 500,
                      fontFamily:
                        '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                    }}
                  >
                    Discover the best of Ahangama
                  </Title>
                </div>

                <a
                  href="/blogs"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    color: "#9F7D56",
                    fontSize: 14,
                    fontWeight: 700,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  View all guides
                  <ArrowRightOutlined />
                </a>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 18,
                }}
              >
                {editorialPicks.slice(0, MAX_EDITORIAL_PICKS).map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    style={{
                      position: "relative",
                      display: "block",
                      minHeight: 202,
                      borderRadius: 18,
                      overflow: "hidden",
                      textDecoration: "none",
                      backgroundImage: `linear-gradient(180deg, rgba(24,20,14,0.02) 0%, rgba(24,20,14,0.52) 100%), url(${item.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      boxShadow: "0 14px 28px rgba(47,62,58,0.10)",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: 18,
                        border: "1px solid rgba(255,255,255,0.12)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        left: 18,
                        right: 18,
                        bottom: 16,
                      }}
                    >
                      <Text
                        style={{
                          display: "block",
                          color: "#FFF8F0",
                          fontSize: 15,
                          fontWeight: 700,
                          lineHeight: 1.15,
                          letterSpacing: 0.5,
                          textTransform: "uppercase",
                        }}
                      >
                        {item.label}
                      </Text>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <HomeGoogleMapSection />
          </div>

          <div style={{ marginTop: 24 }}>
            <TwelveThingsSection />
          </div>

          <div style={{ marginTop: 24 }}>
            <GettingAroundSection />
          </div>

          {/* FREE GUIDE CTA */}
          <div style={{ marginTop: 24 }}>
            {/* Desktop version */}
            {/* <div className="desktop-only" style={{ display: "block" }}>
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
                      Our favourite cafés, stays, wellness, and hidden
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
            </div> */}
            {/* Mobile version */}
            {/* <div className="mobile-only" style={{ display: "none" }}>
              <FreeGuideCtaMobile onGuideClick={handleFreeGuideClick} />
            </div> */}
          </div>

          <div style={{ marginTop: 24 }}>
            {/* Desktop version */}
            {/* <div className="desktop-only" style={{ display: "block" }}>
              <HomeMapSection />
            </div> */}
            {/* Mobile version */}
            {/* <div className="mobile-only" style={{ display: "none" }}>
              <HomeMapSectionMobile />
            </div> */}
          </div>
          <div style={{ marginTop: 16 }}>
            {loading ? (
              <Card
                style={{
                  borderRadius: 18,
                  border: "1px solid rgba(0,0,0,0.06)",
                  background:
                    "linear-gradient(135deg, rgba(255,248,220,0.25) 0%, rgba(255,255,255,0.95) 100%)",
                }}
                bodyStyle={{ padding: 32 }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                    minHeight: 180,
                  }}
                >
                  <Spin size="large" />
                  <Text type="secondary">Loading venues...</Text>
                </div>
              </Card>
            ) : (
              <>
                {/* Desktop version */}
                <div className="desktop-only" style={{ display: "block" }}>
                  <PassUnlocksSection destinationSlug="ahangama" />
                </div>
                {/* Mobile version */}
                <div className="mobile-only" style={{ display: "none" }}>
                  <PassUnlocksMobile destinationSlug="ahangama" />
                </div>
              </>
            )}
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
                    href={passCtaUrl}
                    icon={<QrcodeOutlined />}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackPassCtaClick({
                        ctaLocation: "home_card_section",
                        destinationUrl: passCtaUrl,
                      });
                    }}
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
