import React, { useMemo } from "react";
import { Card, Row, Col, Typography, Button, Space, Spin, Tag } from "antd";
import QRCode from "react-qr-code";
import {
  CoffeeOutlined,
  HomeOutlined,
  CompassOutlined,
  EnvironmentOutlined,
  CheckOutlined,
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
import { PLACES } from "../data/places";
import { shouldShowPlace } from "../data/placeStatus";
import addToAppleWalletLogo from "../assets/add_to_apple_wallet.png";
import addToGoogleWalletLogo from "../assets/add_to_google_wallet.png";
import heroPassAppleWallet from "../assets/hero_pass_apple_wallet.png";

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

const DENITSA_STORY_TAGS = [
  "Ahangama",
  "Personal Story",
  "Digital Nomad",
  "Wellness + Surf",
];

const DENITSA_DAY_CHIPS = [
  "Wellness Focused",
  "Solo Friendly",
  "Walkable",
  "2-4 Day Stay",
];

const DENITSA_FEATURED_PLACES = [
  "Pura Pilates",
  "Oyummy",
  "Rollingpin",
  "Lighthouse",
];

const THREE_DAYS_STORY_TAGS = [
  "Ahangama",
  "Personal Story",
  "3 Days",
  "Wellness + Coworking",
];

const THREE_DAYS_HIGHLIGHTS = [
  "Stayed at Samba",
  "Daily Pilates",
  "Morning Coworking",
  "Ice Bath Recovery",
  "Sunset Sessions",
];

const THREE_DAYS_FEATURED_PLACES = [
  "Samba",
  "Pura Pilates",
  "Frosty's",
  "Kaffi",
];

const TWELVE_THINGS_GUIDE_META = [
  "12 Experiences",
  "5 Categories",
  "Updated Monthly",
  "Most Read Guide",
];

const TWELVE_THINGS_GUIDE_PREVIEW = [
  "Sauna & Ice Bath",
  "Self Drive Tuk Tuk",
  "Pickleball",
  "Lighthouse Sunset",
];

export default function Home() {
  const { loading, places } = usePlaces();
  const canonical = absUrl("/");
  const passCtaUrl = buildPassCtaUrl();
  const sectionSpacing = 32;
  const editorialSerifFont =
    '"Cormorant Garamond", "Libre Baskerville", Georgia, serif';
  const featureTagRailStyle = {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    paddingBottom: 4,
    marginBottom: 14,
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  };
  const featureTagStyle = {
    borderRadius: 999,
    padding: "6px 10px",
    flex: "0 0 auto",
    marginInlineEnd: 0,
    whiteSpace: "nowrap",
    background: "rgba(255,255,255,0.46)",
    border: "1px solid rgba(32,30,27,0.08)",
    color: "#8B7B63",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  };
  const editorialCardStyle = {
    borderRadius: 30,
    border: "1px solid rgba(32,30,27,0.08)",
    background:
      "linear-gradient(180deg, rgba(244,241,236,0.98) 0%, rgba(249,245,239,0.98) 100%)",
    overflow: "hidden",
    boxShadow: "0 18px 40px rgba(32,30,27,0.05)",
  };
  const editorialEyebrowStyle = {
    display: "block",
    marginBottom: 10,
    color: "#B08E62",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  };
  const editorialTitleStyle = {
    marginTop: 0,
    marginBottom: 12,
    color: "#1F1D1A",
    lineHeight: 1.02,
    letterSpacing: -0.02,
    fontFamily: editorialSerifFont,
  };
  const editorialCopyStyle = {
    marginBottom: 20,
    color: "#5F574E",
    fontSize: 16,
    lineHeight: 1.8,
    maxWidth: 760,
  };
  const editorialPrimaryButtonStyle = {
    borderRadius: 999,
    height: 44,
    paddingInline: 18,
    boxShadow: "none",
    background: "#2F3E3A",
    borderColor: "#2F3E3A",
  };

  const heroImage =
    "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/hero-coffee-ocean.jpg";
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
  const liveAhangamaPlaces = useMemo(
    () =>
      (places || [])
        .filter((place) => place.destinationSlug === "ahangama")
        .filter((place) => shouldShowPlace(place)),
    [places],
  );
  const heroStats = useMemo(
    () => [
      {
        label: "Places",
        value: loading ? "..." : String(liveAhangamaPlaces.length),
      },
      {
        label: "Cafes",
        value: loading
          ? "..."
          : String(
              liveAhangamaPlaces.filter((place) => place.category === "eat")
                .length,
            ),
      },
      { label: "Beaches", value: "14" },
      {
        label: "Wellness Spots",
        value: loading
          ? "..."
          : String(
              liveAhangamaPlaces.filter(
                (place) => place.category === "wellness",
              ).length,
            ),
      },
      { label: "Pass Perks", value: "100+" },
    ],
    [liveAhangamaPlaces, loading],
  );
  const featuredHeroStories = [
    { label: "Best Cafes To Work From", href: "/eat" },
    { label: "12 Must Do Things", href: "/12-things" },
    {
      label: "Ultimate Wellness Guide",
      href: "/the-ultimate-wellness-guide-to-ahangama-yoga-gyms-pilates-ice-baths-spas",
    },
  ];
  const heroCurrentIssue = {
    month: "June 2026",
    title: "The Wellness Edition",
    highlights: [
      "Best Wellness Spots",
      "Hidden Beaches",
      "New Openings",
      "Local Recommendations",
    ],
  };
  const heroEditorsPicks = [
    "Kaffi",
    "Frosty's",
    "Pura Pilates",
    "Lighthouse Ahangama",
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
                    <div style={featureTagRailStyle}>
                      <Tag style={featureTagStyle}>
                  pricing, and data shown are for testing purposes only and may
                  not reflect actual businesses or services.
                      <Tag style={featureTagStyle}>
                <Button
                  type="primary"
                      <Tag style={featureTagStyle}>
                  size="small"
                  style={{
                    </div>
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
                borderRadius: 34,
                background:
                  "linear-gradient(180deg, rgba(244,241,236,0.98) 0%, rgba(249,245,239,0.98) 100%)",
                boxShadow: "0 26px 64px rgba(47,62,58,0.08)",
              }}
            >
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  minHeight: 720,
                }}
              >
                <Row gutter={0} align="stretch">
                  <Col xs={24} lg={14} xl={14}>
                    <div
                      style={{
                        position: "relative",
                        zIndex: 2,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        minHeight: "clamp(620px, 64vw, 720px)",
                        padding:
                          "clamp(58px, 7vw, 92px) clamp(32px, 4.8vw, 72px) 52px",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 12,
                            marginBottom: 18,
                          }}
                        >
                          {[
                            "Issue 2026 / 27",
                            "The Ahangama Guide",
                            "Updated Weekly",
                            "Local Editorial Team",
                          ].map((item) => (
                            <Text
                              key={item}
                              style={{
                                color: "#8B7B63",
                                fontSize: 11,
                                fontWeight: 700,
                                letterSpacing: 1.6,
                                textTransform: "uppercase",
                              }}
                            >
                              {item}
                            </Text>
                          ))}
                        </div>

                        <Text style={editorialEyebrowStyle}>Cover Story</Text>

                        <Title
                          style={{
                            margin: 0,
                            color: "#201E1B",
                            fontSize: "clamp(54px, 6vw, 76px)",
                            lineHeight: 0.92,
                            fontWeight: 500,
                            letterSpacing: -2.1,
                            fontFamily:
                              '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                          }}
                        >
                          The Ahangama Guide
                        </Title>

                        <Paragraph
                          style={{
                            marginTop: 24,
                            marginBottom: 22,
                            maxWidth: 520,
                            color: "#49443D",
                            fontSize: "clamp(16px, 1.45vw, 19px)",
                            lineHeight: 1.72,
                          }}
                        >
                          A curated guide to cafes, stays, wellness, surf, food
                          and local experiences across Ahangama. Written and
                          updated by a local team who live here.
                        </Paragraph>

                        <div
                          style={{
                            maxWidth: 520,
                            marginBottom: 28,
                            paddingTop: 18,
                            borderTop: "1px solid rgba(32,30,27,0.08)",
                          }}
                        >
                          <Text style={editorialEyebrowStyle}>
                            From the Editor
                          </Text>
                          <Paragraph
                            style={{
                              marginBottom: 0,
                              color: "#5F574E",
                              fontSize: 15,
                              lineHeight: 1.78,
                            }}
                          >
                            Ahangama has transformed from a quiet surf town into
                            one of Sri Lanka&apos;s most interesting
                            destinations. This guide exists to help visitors
                            discover the places, people and experiences that
                            make it special.
                          </Paragraph>
                        </div>

                        <div style={{ maxWidth: 520, marginBottom: 30 }}>
                          <Text style={editorialEyebrowStyle}>
                            Featured This Week
                          </Text>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 10,
                            }}
                          >
                            {featuredHeroStories.map((story) => (
                              <a
                                key={story.label}
                                href={story.href}
                                style={{
                                  color: "#2F3E3A",
                                  textDecoration: "none",
                                  fontSize: 18,
                                  lineHeight: 1.45,
                                }}
                              >
                                {story.label} <ArrowRightOutlined />
                              </a>
                            ))}
                          </div>
                        </div>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "minmax(0, 1fr) minmax(180px, 220px)",
                            gap: 24,
                            maxWidth: 560,
                          }}
                        >
                          <div>
                            <Text style={editorialEyebrowStyle}>
                              Start Exploring
                            </Text>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 10,
                              }}
                            >
                              <a
                                href="/12-things"
                                style={{
                                  color: "#2F3E3A",
                                  textDecoration: "none",
                                  fontSize: 16,
                                  fontWeight: 600,
                                }}
                              >
                                Read the guide <ArrowRightOutlined />
                              </a>
                              <a
                                href="/search"
                                style={{
                                  color: "#2F3E3A",
                                  textDecoration: "none",
                                  fontSize: 16,
                                  fontWeight: 500,
                                }}
                              >
                                Browse places <ArrowRightOutlined />
                              </a>
                              <a
                                href="/map"
                                style={{
                                  color: "#2F3E3A",
                                  textDecoration: "none",
                                  fontSize: 16,
                                  fontWeight: 500,
                                }}
                              >
                                Open the map <ArrowRightOutlined />
                              </a>
                            </div>
                          </div>
                          <div>
                            <Text style={editorialEyebrowStyle}>
                              Member Benefits
                            </Text>
                            <a
                              href={passCtaUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => {
                                trackPassCtaClick({
                                  ctaLocation: "hero_text_link",
                                  destinationUrl: passCtaUrl,
                                });
                              }}
                              style={{
                                color: "#8B7B63",
                                textDecoration: "none",
                                fontSize: 16,
                                fontWeight: 600,
                                lineHeight: 1.55,
                              }}
                            >
                              Get the Ahangama Pass <ArrowRightOutlined />
                            </a>
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                          gap: 18,
                          paddingTop: 26,
                          borderTop: "1px solid rgba(32,30,27,0.08)",
                        }}
                      >
                        <div style={{ gridColumn: "1 / -1", marginBottom: -2 }}>
                          <Text style={editorialEyebrowStyle}>
                            Destination Index
                          </Text>
                        </div>
                        {heroStats.map((item) => (
                          <div
                            key={item.label}
                            style={{
                              minWidth: 0,
                            }}
                          >
                            <Text
                              style={{
                                display: "block",
                                marginBottom: 2,
                                color: "#8B7B63",
                                fontSize: 11,
                                fontWeight: 700,
                                letterSpacing: 1.5,
                                textTransform: "uppercase",
                              }}
                            >
                              {item.value}
                            </Text>
                            <Text
                              style={{
                                display: "block",
                                color: "#1F1D1A",
                                fontSize: 12,
                                fontWeight: 700,
                                letterSpacing: 1.3,
                                textTransform: "uppercase",
                              }}
                            >
                              {item.label}
                            </Text>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Col>

                  <Col xs={24} lg={10} xl={10}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 18,
                        minHeight: "clamp(620px, 64vw, 720px)",
                        padding: "28px 28px 26px 0",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "minmax(0, 1.15fr) minmax(0, 0.85fr)",
                          gap: 14,
                        }}
                      >
                        <div
                          style={{
                            padding: 18,
                            borderRadius: 22,
                            background: "rgba(255,255,255,0.48)",
                            border: "1px solid rgba(32,30,27,0.08)",
                          }}
                        >
                          <Text
                            style={{
                              display: "block",
                              color: "#8B7B63",
                              fontSize: 11,
                              fontWeight: 700,
                              letterSpacing: 1.5,
                              textTransform: "uppercase",
                            }}
                          >
                            {heroCurrentIssue.month}
                          </Text>
                          <Text
                            style={{ ...editorialEyebrowStyle, marginTop: 8 }}
                          >
                            Current Issue
                          </Text>
                          <Title
                            level={4}
                            style={{
                              marginTop: 0,
                              marginBottom: 12,
                              color: "#1F1D1A",
                              fontFamily: editorialSerifFont,
                              fontSize: 28,
                              lineHeight: 1.02,
                            }}
                          >
                            {heroCurrentIssue.title}
                          </Title>
                          <Text
                            style={{
                              display: "block",
                              marginBottom: 8,
                              color: "#8B7B63",
                              fontSize: 11,
                              fontWeight: 700,
                              letterSpacing: 1.5,
                              textTransform: "uppercase",
                            }}
                          >
                            Featuring
                          </Text>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 6,
                            }}
                          >
                            {heroCurrentIssue.highlights.map((item) => (
                              <Text
                                key={item}
                                style={{
                                  color: "#5F574E",
                                  fontSize: 14,
                                  lineHeight: 1.6,
                                }}
                              >
                                • {item}
                              </Text>
                            ))}
                          </div>
                        </div>

                        <div
                          style={{
                            padding: 18,
                            borderRadius: 22,
                            background: "rgba(255,255,255,0.38)",
                            border: "1px solid rgba(32,30,27,0.08)",
                          }}
                        >
                          <Text style={editorialEyebrowStyle}>
                            Editor&apos;s Picks
                          </Text>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 10,
                            }}
                          >
                            {heroEditorsPicks.map((item) => (
                              <Text
                                key={item}
                                style={{
                                  color: "#2F3E3A",
                                  fontSize: 15,
                                  lineHeight: 1.45,
                                }}
                              >
                                • {item}
                              </Text>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          flex: 1,
                          minHeight: 420,
                          borderRadius: 12,
                          backgroundImage: `linear-gradient(180deg, rgba(18,25,24,0.04) 0%, rgba(18,25,24,0.18) 100%), url(${heroImage})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center center",
                          backgroundRepeat: "no-repeat",
                          filter: "saturate(0.94) contrast(1.01)",
                          boxShadow: "0 20px 44px rgba(32,30,27,0.08)",
                        }}
                      />

                      <div
                        style={{
                          paddingTop: 4,
                          borderTop: "1px solid rgba(32,30,27,0.08)",
                        }}
                      >
                        <Text style={editorialEyebrowStyle}>
                          Featured This Week
                        </Text>
                        <Title
                          level={4}
                          style={{
                            marginTop: 0,
                            marginBottom: 8,
                            color: "#1F1D1A",
                            fontFamily: editorialSerifFont,
                            fontSize: 30,
                            lineHeight: 1.04,
                          }}
                        >
                          Morning at Kaffi
                        </Title>
                        <Paragraph
                          style={{
                            marginBottom: 10,
                            color: "#5F574E",
                            fontSize: 15,
                            lineHeight: 1.72,
                          }}
                        >
                          One of our favourite spots for coffee, breakfast and
                          ocean views.
                        </Paragraph>
                        <a
                          href="/eat"
                          style={{
                            color: "#2F3E3A",
                            textDecoration: "none",
                            fontSize: 15,
                            fontWeight: 600,
                          }}
                        >
                          Read Story <ArrowRightOutlined />
                        </a>
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

          <div style={{ marginTop: sectionSpacing }}>
            <Row className="story-teasers-row" gutter={[24, 24]} align="stretch">
              <Col xs={24} sm={12} xl={12}>
                <Card
                  className="perfect-day-card"
                  style={{ ...editorialCardStyle, height: "100%" }}
                  bodyStyle={{ padding: 32, height: "100%" }}
                >
                  <Row className="perfect-day-row" gutter={[28, 28]} align="top">
                    <Col xs={{ span: 12, order: 1 }} xl={{ span: 10, order: 1 }}>
                      <div
                        className="perfect-day-media"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 16,
                          maxWidth: 420,
                          margin: "0 auto",
                        }}
                      >
                        <div
                          className="perfect-day-tags"
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 10,
                          }}
                        >
                          {DENITSA_STORY_TAGS.map((item) => (
                            <Text
                              key={item}
                              style={{
                                color: "#8B7B63",
                                fontSize: 11,
                                fontWeight: 700,
                                letterSpacing: 1.5,
                                textTransform: "uppercase",
                              }}
                            >
                              {item}
                            </Text>
                          ))}
                        </div>

                        <div
                          style={{
                            aspectRatio: "4 / 5",
                            borderRadius: 26,
                            overflow: "hidden",
                            border: "1px solid rgba(32,30,27,0.08)",
                            background:
                              "linear-gradient(180deg, rgba(255,255,255,0.62) 0%, rgba(239,231,218,0.92) 100%)",
                            boxShadow: "0 16px 34px rgba(32,30,27,0.08)",
                          }}
                        >
                          <video
                            src="https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/videos/denitsa_perfect_day.mp4"
                            muted
                            loop
                            autoPlay
                            playsInline
                            style={{
                              display: "block",
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>

                        <div
                          className="perfect-day-hashtags"
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 10,
                          }}
                        >
                          {DENITSA_DAY_CHIPS.map((item) => (
                            <Text
                              key={item}
                              style={{
                                color: "#8B7B63",
                                fontSize: 12,
                                fontWeight: 600,
                                lineHeight: 1.2,
                              }}
                            >
                              #{item}
                            </Text>
                          ))}
                        </div>
                      </div>
                    </Col>

                    <Col xs={{ span: 12, order: 2 }} xl={{ span: 14, order: 2 }}>
                      <Title
                        level={2}
                        className="perfect-day-title"
                        style={{
                          ...editorialTitleStyle,
                          marginBottom: 14,
                          fontSize: "clamp(29px, 3vw, 41px)",
                          lineHeight: 0.94,
                        }}
                      >
                        Perfect Day in Ahangama
                      </Title>

                      <Paragraph
                        className="perfect-day-excerpt"
                        style={{
                          marginBottom: 16,
                          color: "#5F574E",
                          fontSize: 16,
                          lineHeight: 1.7,
                          maxWidth: 560,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        Pilates, surf, coffee, a slow afternoon and sunset at
                        Lighthouse. Denitsa shares how she would spend a perfect
                        day in Ahangama.
                      </Paragraph>

                      <div className="perfect-day-chip-group" style={{ marginBottom: 20 }}>
                        <Text style={editorialEyebrowStyle}>Places Featured</Text>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 10,
                          }}
                        >
                          {DENITSA_FEATURED_PLACES.map((item) => (
                            <span
                              key={item}
                              className="perfect-day-chip"
                              style={{
                                padding: "8px 12px",
                                borderRadius: 999,
                                border: "1px solid rgba(32,30,27,0.08)",
                                background: "rgba(255,255,255,0.32)",
                                color: "#2F2A24",
                                fontSize: 13,
                                fontWeight: 600,
                                lineHeight: 1,
                              }}
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div
                        className="perfect-day-cta"
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <a
                          href="/blogs"
                          style={{
                            color: "#2F3E3A",
                            textDecoration: "none",
                            fontSize: 16,
                            fontWeight: 600,
                            letterSpacing: 0.1,
                          }}
                        >
                          Read Story <ArrowRightOutlined />
                        </a>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>

              <Col xs={24} sm={12} xl={12}>
                <Card
                  className="three-days-card"
                  style={{ ...editorialCardStyle, height: "100%" }}
                  bodyStyle={{ padding: 32, height: "100%" }}
                >
                  <Row className="three-days-row" gutter={[32, 32]} align="middle">
                    <Col xs={{ span: 12, order: 2 }} xl={{ span: 14, order: 1 }}>

                  <Title
                    level={2}
                    className="three-days-title"
                    style={{
                      ...editorialTitleStyle,
                      marginBottom: 14,
                      fontSize: "clamp(29px, 3vw, 41px)",
                      lineHeight: 0.94,
                      maxWidth: 760,
                    }}
                  >
                    3 Days in Ahangama: My Wellness Stay at Samba
                  </Title>

                  <Paragraph
                    className="three-days-excerpt"
                    style={{
                      ...editorialCopyStyle,
                      maxWidth: 580,
                      marginBottom: 20,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    Three days at Samba settled into a slower rhythm of
                    Pilates, coworking, recovery and unhurried sunsets.
                    Ahangama felt calm, social and easy to stay in.
                  </Paragraph>

                  <div className="three-days-chip-group" style={{ marginBottom: 20 }}>
                    <Text style={editorialEyebrowStyle}>Places Featured</Text>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 10,
                      }}
                    >
                      {THREE_DAYS_FEATURED_PLACES.map((item) => (
                        <span
                          key={item}
                          className="three-days-chip"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            minHeight: 34,
                            padding: "7px 12px",
                            borderRadius: 999,
                            background: "rgba(255,255,255,0.66)",
                            border: "1px solid rgba(32,30,27,0.08)",
                            color: "#3F3A34",
                            fontSize: 13,
                            fontWeight: 600,
                          }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="three-days-cta" style={{ marginTop: 4 }}>
                    <a
                      href="/3-days-in-ahangama"
                      style={{
                        color: "#2F3E3A",
                        textDecoration: "none",
                        fontSize: 16,
                        fontWeight: 600,
                        letterSpacing: 0.1,
                      }}
                    >
                      Read Story <ArrowRightOutlined />
                    </a>
                  </div>
                    </Col>

                    <Col xs={{ span: 12, order: 1 }} xl={{ span: 10, order: 2 }}>
                      <div
                        className="three-days-media"
                        style={{
                          minHeight: 440,
                          borderRadius: 26,
                          backgroundImage:
                            "linear-gradient(180deg, rgba(18,25,24,0.04) 0%, rgba(18,25,24,0.18) 100%), url(https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/pura_pilates.jpeg)",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          border: "1px solid rgba(32,30,27,0.08)",
                          boxShadow: "0 16px 34px rgba(32,30,27,0.06)",
                        }}
                      >
                        <div
                          className="three-days-tags"
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 10,
                            padding: "16px 16px 0",
                          }}
                        >
                          {THREE_DAYS_STORY_TAGS.map((item) => (
                            <Text
                              key={item}
                              style={{
                                color: "rgba(255,248,239,0.9)",
                                fontSize: 11,
                                fontWeight: 700,
                                letterSpacing: 1.5,
                                textTransform: "uppercase",
                                textShadow: "0 1px 10px rgba(18,25,24,0.18)",
                              }}
                            >
                              {item}
                            </Text>
                          ))}
                        </div>
                        <div
                          className="three-days-hashtags"
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 10,
                            padding: "0 16px 16px",
                            marginTop: 300,
                          }}
                        >
                          {THREE_DAYS_HIGHLIGHTS.map((item) => (
                            <Text
                              key={item}
                              style={{
                                color: "rgba(255,248,239,0.9)",
                                fontSize: 12,
                                fontWeight: 600,
                                lineHeight: 1.2,
                                textShadow: "0 1px 10px rgba(18,25,24,0.28)",
                              }}
                            >
                              #{item}
                            </Text>
                          ))}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </div>

          <div style={{ marginTop: 20 }}>
            <Row className="guide-cards-row" gutter={[24, 24]} align="stretch">
              <Col xs={24} lg={12}>
                <Card
                  className="pass-guide-card"
                  style={{ ...editorialCardStyle, height: "100%" }}
                  bodyStyle={{ padding: 30, height: "100%" }}
                >
                  <Row className="pass-guide-row" gutter={[18, 18]} align="middle">
                    <Col xs={24} xl={15}>
                  <Text style={editorialEyebrowStyle}>Field Guide</Text>
                  <div style={featureTagRailStyle}>
                    <Tag style={featureTagStyle}>Pass Guide</Tag>
                    <Tag style={featureTagStyle}>Wallet Ready</Tag>
                    <Tag style={featureTagStyle}>Savings + Perks</Tag>
                  </div>

                  <Title
                    level={3}
                    className="pass-guide-title"
                    style={{ ...editorialTitleStyle, fontSize: 38 }}
                  >
                    What is the Ahangama Pass?
                  </Title>

                  <Paragraph
                    className="pass-guide-excerpt"
                    style={{
                      ...editorialCopyStyle,
                      fontSize: 15,
                      maxWidth: 700,
                    }}
                  >
                    A simple local access pass you keep in Apple Wallet or
                    Google Wallet for partner perks, curated recommendations,
                    and extras that can add up fast, including tea tins,
                    postcards, and member savings across Ahangama.
                  </Paragraph>

                  <Button
                    type="primary"
                    href="/what-is-ahangama-pass"
                    icon={<ArrowRightOutlined />}
                    style={editorialPrimaryButtonStyle}
                  >
                    Read the guide
                  </Button>
                    </Col>

                    <Col xs={24} xl={9}>
                      <div
                        className="pass-guide-media"
                        style={{
                          minHeight: 240,
                          borderRadius: 24,
                          border: "1px solid rgba(32,30,27,0.08)",
                          background:
                            "radial-gradient(circle at top, rgba(255,255,255,0.78) 0%, rgba(239,231,218,0.96) 42%, rgba(227,216,201,0.98) 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 18,
                        }}
                      >
                    <img
                      src={heroPassAppleWallet}
                      alt="Ahangama Pass displayed in an iPhone with Apple Wallet and Google Wallet"
                      style={{
                        display: "block",
                        maxWidth: "100%",
                        maxHeight: 210,
                        width: "auto",
                        height: "auto",
                        objectFit: "contain",
                      }}
                    />
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card
                  className="twelve-things-card"
                  style={{ ...editorialCardStyle, height: "100%" }}
                  bodyStyle={{ padding: 32, height: "100%" }}
                >
                  <Row className="twelve-things-row" gutter={[28, 28]} align="middle">
                    <Col xs={{ span: 12, order: 2 }} xl={{ span: 14, order: 1 }}>
                  <Title
                    level={2}
                    className="twelve-things-title"
                    style={{
                      ...editorialTitleStyle,
                      marginBottom: 14,
                      fontSize: "clamp(36px, 3.5vw, 54px)",
                      lineHeight: 0.96,
                    }}
                  >
                    12 Things to Do in Ahangama
                  </Title>

                  <div
                    className="twelve-things-meta"
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 10,
                      marginBottom: 18,
                    }}
                  >
                    {TWELVE_THINGS_GUIDE_META.map((item) => (
                      <Text
                        key={item}
                        style={{
                          color: "#8B7B63",
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: 1.5,
                          textTransform: "uppercase",
                        }}
                      >
                        {item}
                      </Text>
                    ))}
                  </div>

                  <div
                    className="twelve-things-excerpt"
                    style={{
                      maxWidth: 420,
                      marginBottom: 20,
                    }}
                  >
                    <Text style={editorialEyebrowStyle}>Inside This Guide</Text>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                        paddingTop: 14,
                        borderTop: "1px solid rgba(32,30,27,0.08)",
                      }}
                    >
                      {TWELVE_THINGS_GUIDE_PREVIEW.map((item, index) => (
                        <div
                          key={item}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "32px minmax(0, 1fr)",
                            gap: 10,
                            alignItems: "baseline",
                          }}
                        >
                          <Text
                            style={{
                              color: "#8B7B63",
                              fontSize: 12,
                              fontWeight: 700,
                              letterSpacing: 1.1,
                            }}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </Text>
                          <Text
                            style={{
                              color: "#2F2A24",
                              fontSize: 16,
                              lineHeight: 1.45,
                            }}
                          >
                            {item}
                          </Text>
                        </div>
                      ))}
                      <Text
                        style={{
                          paddingTop: 2,
                          color: "#8B7B63",
                          fontSize: 12,
                          fontWeight: 700,
                          letterSpacing: 1.2,
                          textTransform: "uppercase",
                        }}
                      >
                        + 8 More Experiences
                      </Text>
                    </div>
                  </div>

                  <div className="twelve-things-cta" style={{ marginTop: 28 }}>
                    <a
                      href="/12-things"
                      style={{
                        color: "#2F3E3A",
                        textDecoration: "none",
                        fontSize: 16,
                        fontWeight: 600,
                        letterSpacing: 0.1,
                      }}
                    >
                      Explore All 12 Experiences <ArrowRightOutlined />
                    </a>
                  </div>
                    </Col>

                    <Col xs={{ span: 12, order: 1 }} xl={{ span: 10, order: 2 }}>
                      <div
                        className="twelve-things-media"
                        style={{
                          minHeight: 300,
                          borderRadius: 26,
                          padding: 12,
                          background: "rgba(255,255,255,0.58)",
                          border: "1px solid rgba(32,30,27,0.08)",
                          boxShadow: "0 16px 34px rgba(32,30,27,0.06)",
                        }}
                      >
                    <div
                      className="twelve-things-mosaic"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                        gap: 8,
                      }}
                    >
                      {twelveThingsMosaic.map((item) => (
                        <a
                          key={item.slug}
                          href="/12-things"
                          title={item.name}
                          aria-label={`Open 12 Things guide from ${item.name}`}
                          style={{
                            display: "block",
                            aspectRatio: "1 / 1",
                            borderRadius: 12,
                            backgroundImage: `linear-gradient(180deg, rgba(18,25,24,0.04) 0%, rgba(18,25,24,0.18) 100%), url(${item.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            textDecoration: "none",
                            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)",
                          }}
                        />
                      ))}
                    </div>
                    <Text
                      className="twelve-things-caption"
                      style={{
                        display: "block",
                        marginTop: 12,
                        color: "#8B7B63",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: 1.2,
                        textTransform: "uppercase",
                      }}
                    >
                      Open any tile to enter the guide
                    </Text>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
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
              style={editorialCardStyle}
              bodyStyle={{ padding: 30 }}
            >
              <Row gutter={[16, 16]} align="middle">
                <Col xs={24} md={16}>
                  <Text style={editorialEyebrowStyle}>Pass Access</Text>
                  <Title
                    level={3}
                    style={{
                      ...editorialTitleStyle,
                      marginBottom: 10,
                      fontSize: 38,
                    }}
                  >
                    The Ahangama Card
                  </Title>
                  <Paragraph
                    style={{
                      ...editorialCopyStyle,
                      marginBottom: 16,
                      fontSize: 15,
                    }}
                  >
                    Built for people staying more than a few days. Simple vendor
                    verification, real perks, and a curated venue list that
                    grows over time.
                  </Paragraph>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={addToAppleWalletLogo}
                      alt="Add to Apple Wallet"
                      style={{
                        display: "block",
                        height: 40,
                        width: "auto",
                      }}
                    />
                    <img
                      src={addToGoogleWalletLogo}
                      alt="Add to Google Wallet"
                      style={{
                        display: "block",
                        height: 40,
                        width: "auto",
                      }}
                    />
                  </div>
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
                    style={{ ...editorialPrimaryButtonStyle, width: "100%" }}
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
