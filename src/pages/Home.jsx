import React, { useMemo } from "react";
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
import PassPartnersStrip from "../components/home/PassPartnersStrip";
import HomeMapSection from "../components/home/HomeMapSection";
import HomeMapSectionMobile from "../components/home/HomeMapSectionMobile";
import HomeGoogleMapSection from "../components/home/HomeGoogleMapSection";
import GettingAroundSection from "../components/home/GettingAroundSection";
import WellnessGuideSection from "../components/home/WellnessGuideSection";
import FreeGuideCtaMobile from "../components/home/FreeGuideCtaMobile";
import HeroSectionMobile from "../components/home/HeroSectionMobile";
import { shouldShowPlace } from "../data/placeStatus";

const { Title, Paragraph, Text } = Typography;

const TWELVE_THINGS_ORDER = [
  "pura",
  "gik-bike-rentals",
  "coconut-c",
  "frostys-recovery-centre-hangout",
  "kumbuk-community",
  "spa-station-midigama",
  "sarana-ahangama",
  "palm-and-paint",
  "living-r-c-s",
  "yiva-essentials",
  "hakuna-matata-ahangama",
  "qamar-by-zan",
];

export default function Home() {
  const { loading, places } = usePlaces();
  const canonical = absUrl("/");
  const passCtaUrl = buildPassCtaUrl();
  const sectionSpacing = 32;

  const heroImage =
    "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/hero-coffee-ocean.jpg";
  const guideHighlights = [
    { key: "coffee", icon: <CoffeeOutlined />, label: "Great coffee" },
    { key: "work", icon: <LaptopOutlined />, label: "Work friendly" },
    { key: "healthy", icon: <HeartOutlined />, label: "Healthy options" },
    { key: "views", icon: <CompassOutlined />, label: "Ocean views" },
  ];
  const twelveThingsMosaic = useMemo(() => {
    const placesBySlug = new Map(
      (places || [])
        .filter((place) => place.destinationSlug === "ahangama")
        .filter((place) => shouldShowPlace(place))
        .map((place) => [place.slug, place]),
    );

    return TWELVE_THINGS_ORDER.map((slug) => placesBySlug.get(slug))
      .filter(Boolean)
      .map((place) => ({
        slug: place.slug,
        image: place.image || place.logo || heroImage,
        name: place.name,
      }));
  }, [places, heroImage]);

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
                  <Col xs={24} lg={11} xl={10}>
                    <div
                      style={{
                        position: "relative",
                        zIndex: 2,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        minHeight: "clamp(520px, 56vw, 620px)",
                        padding:
                          "clamp(52px, 7vw, 88px) clamp(28px, 4.5vw, 56px) 44px",
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
                            fontSize: "clamp(62px, 7.2vw, 86px)",
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
                          <span style={{ whiteSpace: "nowrap" }}>Ahangama</span>
                        </Title>

                        <Paragraph
                          style={{
                            marginTop: 26,
                            marginBottom: 34,
                            maxWidth: 430,
                            color: "#49443D",
                            fontSize: "clamp(16px, 1.65vw, 18px)",
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

                  <Col xs={24} lg={13} xl={14}>
                    <div
                      style={{
                        minHeight: "clamp(520px, 56vw, 620px)",
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

          <div style={{ marginTop: sectionSpacing }}>
            <Card
              style={{
                borderRadius: 26,
                border: "1px solid rgba(32,30,27,0.08)",
                background:
                  "linear-gradient(180deg, rgba(251,248,242,0.98) 0%, rgba(247,243,236,0.98) 100%)",
                overflow: "hidden",
                boxShadow: "0 14px 32px rgba(32,30,27,0.05)",
              }}
              bodyStyle={{ padding: 28 }}
            >
              <Row gutter={[20, 20]} align="middle">
                <Col xs={24} xl={16}>
                  <Space wrap size={[8, 8]} style={{ marginBottom: 12 }}>
                    <Tag style={{ borderRadius: 999, padding: "6px 12px" }}>
                      Personal Story
                    </Tag>
                    <Tag style={{ borderRadius: 999, padding: "6px 12px" }}>
                      3-Day Ahangama Guide
                    </Tag>
                    <Tag style={{ borderRadius: 999, padding: "6px 12px" }}>
                      Wellness + Coworking
                    </Tag>
                  </Space>

                  <Title
                    level={2}
                    style={{
                      marginTop: 0,
                      marginBottom: 12,
                      color: "#1F1D1A",
                      lineHeight: 1.08,
                      letterSpacing: -0.02,
                    }}
                  >
                    3 Days in Ahangama: My Wellness Stay at Samba
                  </Title>

                  <Paragraph
                    style={{
                      marginBottom: 18,
                      color: "#5F574E",
                      fontSize: 16,
                      lineHeight: 1.75,
                      maxWidth: 760,
                    }}
                  >
                    I wanted three days in Ahangama that felt personal, soft,
                    and still slightly useful: enough time to work a little,
                    train a little, recover properly, and still keep the town
                    feeling light. So I based the whole trip at Samba and built
                    the days around the live pass partners that actually
                    improve that kind of stay.
                  </Paragraph>

                  <Button
                    type="primary"
                    href="/3-days-in-ahangama"
                    icon={<ArrowRightOutlined />}
                    style={{
                      borderRadius: 999,
                      height: 44,
                      paddingInline: 18,
                      boxShadow: "none",
                    }}
                  >
                    Read the story
                  </Button>
                </Col>

                <Col xs={24} xl={8}>
                  <div
                    style={{
                      minHeight: 240,
                      borderRadius: 22,
                      backgroundImage:
                        "linear-gradient(180deg, rgba(18,25,24,0.04) 0%, rgba(18,25,24,0.22) 100%), url(https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/stays/Asset+33samba.webp)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </Col>
              </Row>
            </Card>
          </div>

          <div style={{ marginTop: sectionSpacing }}>
            <Card
              style={{
                borderRadius: 26,
                border: "1px solid rgba(32,30,27,0.08)",
                background:
                  "linear-gradient(180deg, rgba(251,248,242,0.98) 0%, rgba(247,243,236,0.98) 100%)",
                overflow: "hidden",
                boxShadow: "0 14px 32px rgba(32,30,27,0.05)",
              }}
              bodyStyle={{ padding: 28 }}
            >
              <Row gutter={[20, 20]} align="middle">
                <Col xs={24} xl={16}>
                  <Space wrap size={[8, 8]} style={{ marginBottom: 12 }}>
                    <Tag style={{ borderRadius: 999, padding: "6px 12px" }}>
                      Editorial Guide
                    </Tag>
                    <Tag style={{ borderRadius: 999, padding: "6px 12px" }}>
                      12 Things to Do
                    </Tag>
                    <Tag style={{ borderRadius: 999, padding: "6px 12px" }}>
                      Experiences + Local Favourites
                    </Tag>
                  </Space>

                  <Title
                    level={2}
                    style={{
                      marginTop: 0,
                      marginBottom: 12,
                      color: "#1F1D1A",
                      lineHeight: 1.08,
                      letterSpacing: -0.02,
                    }}
                  >
                    12 Things to Do in Ahangama
                  </Title>

                  <Paragraph
                    style={{
                      marginBottom: 18,
                      color: "#5F574E",
                      fontSize: 16,
                      lineHeight: 1.75,
                      maxWidth: 760,
                    }}
                  >
                    A more editorial way to explore Ahangama: twelve standout
                    experiences across wellness, adventure, food, shopping, and
                    slow coastal rituals. It is the guide to open when you want
                    a better feel for what is actually worth doing while you are
                    here.
                  </Paragraph>

                  <Button
                    type="primary"
                    href="/12-things"
                    icon={<ArrowRightOutlined />}
                    style={{
                      borderRadius: 999,
                      height: 44,
                      paddingInline: 18,
                      boxShadow: "none",
                    }}
                  >
                    Read the guide
                  </Button>
                </Col>

                <Col xs={24} xl={8}>
                  <div
                    style={{
                      minHeight: 240,
                      borderRadius: 22,
                      padding: 10,
                      background: "rgba(255,255,255,0.58)",
                      border: "1px solid rgba(32,30,27,0.08)",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                        gap: 8,
                      }}
                    >
                      {twelveThingsMosaic.map((item) => (
                        <div
                          key={item.slug}
                          title={item.name}
                          style={{
                            aspectRatio: "1 / 1",
                            borderRadius: 12,
                            backgroundImage: `linear-gradient(180deg, rgba(18,25,24,0.04) 0%, rgba(18,25,24,0.18) 100%), url(${item.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>

          <div style={{ marginTop: sectionSpacing }}>
            <GettingAroundSection />
          </div>

          <div style={{ marginTop: sectionSpacing }}>
            <WellnessGuideSection />
          </div>

          {/* FREE GUIDE CTA */}
          <div style={{ marginTop: sectionSpacing }}>
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
          <div style={{ marginTop: sectionSpacing - 8 }}>
            {loading ? (
              <Card
                style={{
                  borderRadius: 18,
                  border: "1px solid rgba(32,30,27,0.08)",
                  background:
                    "linear-gradient(180deg, rgba(251,248,242,0.96) 0%, rgba(247,243,236,0.96) 100%)",
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
                <PassPartnersStrip destinationSlug="ahangama" />
              </>
            )}
          </div>

          <div style={{ marginTop: sectionSpacing }}>
            <HomeGoogleMapSection />
          </div>

          {/* CARD CTA */}
          <div style={{ marginTop: sectionSpacing - 8 }}>
            <Card
              className="ahg-cardCta"
              style={{
                borderRadius: 22,
                border: "1px solid rgba(32,30,27,0.08)",
                background:
                  "linear-gradient(180deg, rgba(251,248,242,0.98) 0%, rgba(246,240,231,0.98) 100%)",
              }}
              bodyStyle={{ padding: 24 }}
            >
              <Row gutter={[16, 16]} align="middle">
                <Col xs={24} md={16}>
                  <Title level={3} style={{ marginTop: 0, marginBottom: 8 }}>
                    The Ahangama Card
                  </Title>
                  <Paragraph style={{ marginBottom: 0, color: "#5F574E" }}>
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
