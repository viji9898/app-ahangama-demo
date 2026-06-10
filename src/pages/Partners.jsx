import React, { useState } from "react";
import {
  BookOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  HomeOutlined,
  InstagramOutlined,
  MailOutlined,
  MenuOutlined,
  NotificationOutlined,
  ReadOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Typography } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import ahangamaPassMobileWallet from "../assets/ahangama-pass-mobie-wallet.jpg";

const { Paragraph, Text, Title } = Typography;

const HERO_IMAGE =
  "https://polarsteps.s3.amazonaws.com/user_images/steps/large_thumb/u_8317798/3f3fcfc3-61bc-44c9-9e07-5bc8d35ab99c_455b553f-d99d-40ca-ad04-3a5774a62cef.jpg";

const HOME_PAGE_HERO_IMAGE =
  "https://images.suitcasemag.com/wp-content/uploads/2025/05/01113553/Hero-AhanagamaGuide-SriLanka.jpeg";

const PRODUCT_TIERS = [
  {
    name: "Pass Partner",
    price: "Free",
    billing: "",
    summary: "Join the Ahangama Pass network and offer a benefit to visitors.",
    intro: "Perfect for venues wanting exposure without any commitment.",
    points: [
      "Venue profile",
      "Pass offer displayed",
      "Map listing",
      "Website, WhatsApp and Instagram links",
      "Inclusion in pass search",
      "Pass partner badge",
      "Basic analytics",
    ],
  },
  {
    name: "Ahangama Circle",
    price: "$29",
    billing: "/month",
    summary: "For venues looking to increase visibility and foot traffic.",
    intro: "Everything in Pass Partner plus:",
    points: [
      "Featured category placement",
      "Weekly visitor newsletter inclusion",
      "What's On This Week inclusion",
      "Event submissions",
      "Priority search placement",
      "Access to Ahangama Circle business community",
      "Monthly performance summary",
    ],
  },
  {
    name: "Ahangama Circle Plus",
    price: "$79",
    billing: "/month",
    summary:
      "For businesses wanting stronger visibility and editorial support.",
    intro: "Everything in Circle plus:",
    points: [
      "Recommended by Ahangama.com",
      "Inclusion in Ahangama Season Guide 2026/27",
      "Dedicated venue story",
      "Priority newsletter placement",
      "Concierge referrals",
      "Social media features",
      "Quarterly spotlight",
      "Seasonal campaigns",
    ],
  },
  {
    name: "Premium Partner",
    price: "$199",
    billing: "/month",
    summary: "Maximum exposure across the Ahangama ecosystem.",
    intro: "Everything in Circle Plus plus:",
    points: [
      "Homepage features",
      "Arrival email campaigns",
      "Featured newsletter placements",
      "Dedicated marketing campaigns",
      "Priority concierge referrals",
      "New venue launch support",
      "Seasonal destination features",
      "Premium guide placement",
    ],
  },
];

const PLATFORM_AREAS = [
  "Stays, villas and hospitality brands",
  "Restaurants, cafes and beach clubs",
  "Surf, wellness and experience-led operators",
  "Retail, culture and destination businesses",
];

const AUDIENCE_REACH_CHANNELS = [
  {
    label: "Ahangama.com",
    icon: HomeOutlined,
    description:
      "The leading independent guide to Ahangama, helping visitors discover where to stay, eat, work, surf, and explore.",
    reach: [
      "50,000+ annual website visitors",
      "150,000+ annual page views",
      "Visitors from 80+ countries",
      "High-intent travel audience planning trips to Sri Lanka",
      "These are estimated figures. We will invest monthly in Google Search Ads and paid targeted promotion to reach high-intent audiences.",
    ],
  },
  {
    label: "Ahangama Pass",
    icon: TagOutlined,
    description:
      "A visitor membership programme connecting travellers with local businesses through exclusive offers, experiences, and recommendations.",
    reach: [
      "3,000+ pass holders annually",
      "15,000+ offer views per month",
      "Visitors actively seeking places to spend during their stay",
      "Direct exposure at the point of decision-making",
      "Primary distribution via hotel partners and travel agents",
    ],
  },
  {
    label: "Ahangama Map",
    icon: EnvironmentOutlined,
    description:
      "The most comprehensive visitor map of Ahangama, featuring curated venues, experiences, services, and local recommendations.",
    reach: [
      "25,000+ annual map views",
      "Frequently accessed by visitors already in destination",
      "Used for navigation and venue discovery",
      "Strong visibility across mobile devices",
    ],
  },
  {
    label: "Ahangama Guide 2026/27",
    icon: BookOutlined,
    description:
      "A printed and digital editorial guide showcasing the best of Ahangama through stories, recommendations, and local insights.",
    reach: [
      "5,000 printed copies annually",
      "Distributed through hotels, cafes, villas, surf camps, and partner venues",
      "Long shelf life and repeated readership",
      "Premium publication designed to be kept, not discarded",
    ],
  },
  {
    label: "Visitor Email Campaigns",
    icon: MailOutlined,
    description:
      "Targeted communications sent to visitors before, during, and after their stay in Ahangama.",
    reach: [
      "10,000+ subscriber database",
      "Monthly editorial newsletters",
      "Seasonal destination guides",
      "Dedicated partner features and recommendations",
    ],
  },
  {
    label: "Hotel Partnerships",
    icon: HomeOutlined,
    description:
      "A network of accommodation partners introducing guests to Ahangama experiences, venues, and offers.",
    reach: [
      "100+ hotel and villa partners",
      "Direct access to guests during trip planning and arrival",
      "Visibility at reception desks, guest welcome packs, and concierge recommendations",
      "Estimated 50,000+ annual guest impressions",
    ],
  },
  {
    label: "Concierge Recommendations",
    icon: NotificationOutlined,
    description:
      "Personalised recommendations provided to visitors seeking trusted local advice.",
    reach: [
      "High-intent travellers actively looking for places to visit",
      "Direct referrals from concierge teams and hospitality partners",
      "Strong conversion due to trusted recommendation format",
      "Premium audience segment with higher spending potential",
    ],
  },
  {
    label: "Instagram & Social Media",
    icon: InstagramOutlined,
    description:
      "Daily destination content featuring local businesses, experiences, events, and editorial recommendations.",
    reach: [
      "100,000+ monthly impressions",
      "Destination-focused audience",
      "Reels, stories, venue features, and editorial content",
      "Strong engagement from visitors currently travelling in Sri Lanka",
    ],
  },
  {
    label: "Editorial Features",
    icon: ReadOutlined,
    description:
      "Long-form stories, guides, interviews, and curated recommendations highlighting exceptional businesses and experiences.",
    reach: [
      "Featured permanently within Ahangama.com",
      "Shared across newsletter and social channels",
      "Search engine visibility throughout the year",
      "Builds credibility through trusted editorial endorsement",
    ],
  },
];

const PROMOTIONAL_PRODUCTS = [
  {
    name: "Featured Venue of the Week",
    price: "$50",
    icon: NotificationOutlined,
  },
  { name: "Newsletter Sponsor", price: "$25", icon: MailOutlined },
  { name: "Event Promotion", price: "$25", icon: CalendarOutlined },
  { name: "Seasonal Campaign", price: "$100", icon: TagOutlined },
  { name: "Dedicated Editorial Story", price: "$250", icon: ReadOutlined },
  { name: "New Venue Launch Package", price: "$250", icon: BookOutlined },
  { name: "Homepage Feature", price: "$250 /month", icon: HomeOutlined },
];

export default function Partners() {
  const canonical = absUrl("/partners");
  const [activeReachChannel, setActiveReachChannel] = useState(
    AUDIENCE_REACH_CHANNELS[0].label,
  );
  const selectedReachChannel =
    AUDIENCE_REACH_CHANNELS.find((item) => item.label === activeReachChannel) ??
    AUDIENCE_REACH_CHANNELS[0];
  const showAhangamaWebsitePreview =
    selectedReachChannel.label === "Ahangama.com";
  const showAhangamaPassPreview =
    selectedReachChannel.label === "Ahangama Pass";
  const showAhangamaMapPreview = selectedReachChannel.label === "Ahangama Map";

  return (
    <SiteLayout navOverlayHero>
      <Seo
        title="Ahangama.com Platform"
        description="Ahangama.com is positioned as the customer acquisition and distribution platform for tourism businesses in Ahangama."
        canonical={canonical}
        ogImage={HERO_IMAGE}
      />

      <div
        className="dm-canvas"
        style={{
          marginTop: 0,
          paddingTop: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          background: "#ffffff",
        }}
      >
        <div className="dm-wrap">
          <div>
            <div
              className="ahg-hero"
              style={{
                width: "100vw",
                marginLeft: "calc(50% - 50vw)",
                marginRight: "calc(50% - 50vw)",
                borderRadius: 0,
                background: "#FFFFFF",
                boxShadow: "none",
              }}
            >
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  minHeight: "100svh",
                }}
              >
                <div
                  aria-hidden="true"
                  className="home-hero-media-layer"
                  style={{
                    position: "absolute",
                    inset: 0,
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="home-hero-overlay"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(90deg, rgba(10,14,18,0.82) 0%, rgba(10,14,18,0.74) 20%, rgba(10,14,18,0.5) 38%, rgba(10,14,18,0.2) 56%, rgba(10,14,18,0.04) 74%, rgba(10,14,18,0) 100%)",
                      pointerEvents: "none",
                      zIndex: 2,
                    }}
                  />
                  <img
                    className="home-hero-image"
                    src={HERO_IMAGE}
                    alt="Ahangama coastline hero"
                    style={{
                      position: "absolute",
                      inset: 0,
                      zIndex: 1,
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center center",
                    }}
                  />
                </div>

                <div
                  style={{
                    position: "relative",
                    zIndex: 3,
                    width: "100%",
                    maxWidth: 1100,
                    margin: "0 auto",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      minHeight: "100svh",
                      maxWidth: 700,
                      padding:
                        "clamp(44px, 5vw, 68px) clamp(32px, 4.8vw, 72px) 36px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 12,
                        marginBottom: 18,
                      }}
                    >
                      {[
                        "Ahangama.com",
                        "Customer Acquisition",
                        "Distribution Platform",
                      ].map((item) => (
                        <Text
                          key={item}
                          style={{
                            color: "#FFFFFF",
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

                    <Title
                      className="home-hero-title"
                      style={{
                        margin: 0,
                        color: "#FFFFFF",
                        fontWeight: 500,
                        fontFamily:
                          '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                      }}
                    >
                      <span
                        className="home-hero-titleLine"
                        style={{ color: "#FFFFFF" }}
                      >
                        Ahangama.com
                      </span>
                      <span
                        className="home-hero-titleLine"
                        style={{ color: "#FFFFFF" }}
                      >
                        for Tourism
                      </span>
                      <span
                        className="home-hero-titleLine"
                        style={{ color: "#FFFFFF" }}
                      >
                        Businesses
                      </span>
                    </Title>

                    <Text
                      style={{
                        display: "block",
                        marginTop: 14,
                        color: "#FFFFFF",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: 1.6,
                        textTransform: "uppercase",
                      }}
                    >
                      Platform Overview
                    </Text>

                    <Paragraph
                      style={{
                        marginTop: 24,
                        marginBottom: 0,
                        maxWidth: 580,
                        color: "#FFFFFF",
                        fontSize: "clamp(16px, 1.45vw, 19px)",
                        lineHeight: 1.72,
                      }}
                    >
                      Ahangama.com is positioned as the customer acquisition and
                      distribution platform for tourism businesses in Ahangama,
                      connecting visitors with the town&apos;s most relevant
                      stays, experiences, food, retail and wellness brands
                      through a tiered commercial product.
                    </Paragraph>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dm-wrap" style={{ paddingTop: 40, paddingBottom: 72 }}>
          <div style={{ maxWidth: 1120, margin: "0 auto" }}>
            <div style={{ maxWidth: 820, marginBottom: 40 }}>
              <Text
                style={{
                  display: "block",
                  marginBottom: 10,
                  color: "#8A7B68",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.6,
                  textTransform: "uppercase",
                }}
              >
                Positioning
              </Text>
              <Title
                level={2}
                style={{
                  marginBottom: 16,
                  color: "#2F2A24",
                  fontFamily:
                    '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                  fontSize: "clamp(34px, 4vw, 52px)",
                  lineHeight: 1.02,
                }}
              >
                A commercial layer for discovering, promoting and distributing
                tourism products in Ahangama.
              </Title>
              <Paragraph
                style={{
                  marginBottom: 0,
                  color: "#55514B",
                  fontSize: 18,
                  lineHeight: 1.8,
                  maxWidth: 760,
                }}
              >
                This page reframes Ahangama.com as more than a guide. It is a
                platform model designed to help local tourism businesses earn
                attention, generate qualified traffic and convert that demand
                into direct commercial outcomes across different product tiers.
              </Paragraph>
            </div>

            <div style={{ marginBottom: 52 }}>
              <div style={{ textAlign: "left", marginBottom: 26 }}>
                <Text
                  style={{
                    display: "block",
                    marginBottom: 10,
                    color: "#8A7B68",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1.6,
                    textTransform: "uppercase",
                  }}
                >
                  Audience Reach
                </Text>
                <Paragraph
                  style={{
                    margin: 0,
                    color: "#55514B",
                    fontSize: 18,
                    lineHeight: 1.7,
                    maxWidth: 760,
                  }}
                >
                  We connect your business with visitors across multiple trusted
                  channels.
                </Paragraph>
              </div>

              <Row gutter={[24, 24]} align="top">
                <Col xs={24} lg={10}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(180px, 1fr))",
                      gap: 18,
                    }}
                  >
                    {AUDIENCE_REACH_CHANNELS.map((item) => {
                      const Icon = item.icon;
                      const isActive =
                        item.label === selectedReachChannel.label;

                      return (
                        <div key={item.label}>
                          <button
                            type="button"
                            onClick={() => setActiveReachChannel(item.label)}
                            style={{
                              height: "100%",
                              textAlign: "left",
                              width: "100%",
                              padding: "18px 18px",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                              borderRadius: 18,
                              border: isActive
                                ? "1px solid rgba(86, 72, 57, 0.26)"
                                : "1px solid rgba(86, 72, 57, 0.1)",
                              background: "#FFFFFF",
                              boxShadow: isActive
                                ? "0 14px 32px rgba(47, 42, 36, 0.08)"
                                : "0 8px 18px rgba(47, 42, 36, 0.04)",
                              cursor: "pointer",
                            }}
                          >
                            <Icon
                              style={{
                                fontSize: 34,
                                color: "#61766A",
                                marginBottom: 12,
                                display: "block",
                              }}
                            />
                            <Text
                              style={{
                                color: "#2F2A24",
                                fontSize: 16,
                                lineHeight: 1.4,
                                fontWeight: 600,
                                display: "block",
                              }}
                            >
                              {item.label}
                            </Text>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </Col>

                <Col xs={24} lg={14}>
                  <Card
                    style={{
                      borderRadius: "20px",
                      background: "#FFFFFF",
                      border: "1px solid rgba(86, 72, 57, 0.12)",
                      boxShadow: "0 14px 36px rgba(47, 42, 36, 0.06)",
                    }}
                    bodyStyle={{ padding: "26px 24px" }}
                  >
                    {showAhangamaWebsitePreview ||
                    showAhangamaPassPreview ||
                    showAhangamaMapPreview ? (
                      <div>
                        <Text
                          style={{
                            display: "block",
                            marginBottom: 10,
                            color: "#8A7B68",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: 1.6,
                            textTransform: "uppercase",
                          }}
                        >
                          Selected Channel
                        </Text>
                        <Row gutter={[28, 28]} align="top">
                          <Col xs={24} md={10}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <div
                                style={{
                                  width: "min(100%, 240px)",
                                  padding: 10,
                                  borderRadius: 36,
                                  background: "#111111",
                                  boxShadow: "0 28px 50px rgba(0, 0, 0, 0.22)",
                                }}
                              >
                                <div
                                  style={{
                                    position: "relative",
                                    overflow: "hidden",
                                    borderRadius: 28,
                                    background: "#0f1713",
                                    aspectRatio: "9 / 19.5",
                                    width: "100%",
                                  }}
                                >
                                  {showAhangamaWebsitePreview ? (
                                    <>
                                      <div
                                        style={{
                                          position: "absolute",
                                          top: 10,
                                          left: "50%",
                                          transform: "translateX(-50%)",
                                          width: 128,
                                          height: 24,
                                          background: "#111111",
                                          borderRadius: 16,
                                          zIndex: 5,
                                        }}
                                      />
                                      <div
                                        style={{
                                          position: "relative",
                                          zIndex: 3,
                                          padding: "28px 16px 0",
                                          color: "#FFFFFF",
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            marginTop: 10,
                                            marginBottom: 170,
                                          }}
                                        >
                                          <div
                                            style={{
                                              fontFamily:
                                                '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                                              fontSize: 19,
                                              lineHeight: 1,
                                              letterSpacing: 0.2,
                                              color: "#FFFFFF",
                                            }}
                                          >
                                            AHANGAMA
                                          </div>
                                          <div
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: 16,
                                            }}
                                          >
                                            <HeartOutlined
                                              style={{
                                                color: "#FFFFFF",
                                                fontSize: 17,
                                              }}
                                            />
                                            <MenuOutlined
                                              style={{
                                                color: "#FFFFFF",
                                                fontSize: 20,
                                              }}
                                            />
                                          </div>
                                        </div>

                                        <div
                                          style={{
                                            display: "flex",
                                            gap: 16,
                                            marginBottom: 18,
                                            flexWrap: "wrap",
                                            color: "#FFFFFF",
                                            fontSize: 9,
                                            fontWeight: 700,
                                            letterSpacing: 1.4,
                                            textTransform: "uppercase",
                                          }}
                                        >
                                          <span>Week 24</span>
                                          <span>Updated Weekly</span>
                                        </div>

                                        <div
                                          style={{
                                            fontFamily:
                                              '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                                            fontSize: 34,
                                            lineHeight: 0.86,
                                            color: "#FFFFFF",
                                            marginBottom: 8,
                                          }}
                                        >
                                          <div>This Week In</div>
                                          <div>Ahangama</div>
                                        </div>

                                        <div
                                          style={{
                                            marginBottom: 20,
                                            color: "#FFFFFF",
                                            fontSize: 9,
                                            fontWeight: 700,
                                            letterSpacing: 1.4,
                                            textTransform: "uppercase",
                                          }}
                                        >
                                          From the Editor
                                        </div>

                                        <div
                                          style={{
                                            maxWidth: 200,
                                            color: "rgba(255,255,255,0.96)",
                                            fontSize: 10,
                                            lineHeight: 1.45,
                                            marginBottom: 18,
                                          }}
                                        >
                                          A curated guide to cafes, stays,
                                          wellness, surf, food and local
                                          experiences across Ahangama. Written
                                          and updated by a local team who live
                                          here.
                                        </div>

                                        <div
                                          style={{
                                            marginBottom: 12,
                                            color: "#FFFFFF",
                                            fontSize: 9,
                                            fontWeight: 700,
                                            letterSpacing: 1.4,
                                            textTransform: "uppercase",
                                          }}
                                        >
                                          Member Benefits
                                        </div>
                                        <div
                                          style={{
                                            color: "#FFFFFF",
                                            fontSize: 13,
                                            lineHeight: 1.3,
                                            fontWeight: 600,
                                          }}
                                        >
                                          Get the Ahangama Pass -&gt;
                                        </div>
                                      </div>
                                      <img
                                        src={HOME_PAGE_HERO_IMAGE}
                                        alt="Ahangama homepage hero preview"
                                        style={{
                                          position: "absolute",
                                          inset: 0,
                                          width: "100%",
                                          height: "100%",
                                          objectFit: "cover",
                                          objectPosition: "right 72%",
                                        }}
                                      />
                                      <div
                                        style={{
                                          position: "absolute",
                                          inset: 0,
                                          background:
                                            "linear-gradient(180deg, rgba(11,16,13,0.26) 0%, rgba(11,16,13,0.22) 18%, rgba(11,16,13,0.48) 46%, rgba(11,16,13,0.72) 72%, rgba(11,16,13,0.9) 100%)",
                                        }}
                                      />
                                    </>
                                  ) : showAhangamaMapPreview ? (
                                    <div
                                      style={{
                                        position: "absolute",
                                        inset: 0,
                                        background: "#F2F0EA",
                                      }}
                                    >
                                      <div
                                        style={{
                                          position: "absolute",
                                          top: 18,
                                          left: 16,
                                          right: 16,
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          zIndex: 3,
                                        }}
                                      >
                                        <div
                                          style={{
                                            padding: "8px 10px",
                                            borderRadius: 999,
                                            background:
                                              "rgba(255,255,255,0.88)",
                                            color: "#2F2A24",
                                            fontSize: 10,
                                            fontWeight: 700,
                                            letterSpacing: 1.2,
                                            textTransform: "uppercase",
                                          }}
                                        >
                                          Ahangama Map
                                        </div>
                                      </div>

                                      <iframe
                                        title="Ahangama Google Map preview"
                                        src="https://www.google.com/maps?q=Ahangama,Sri%20Lanka&z=14&output=embed"
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        style={{
                                          position: "absolute",
                                          inset: "0 6px 6px 6px",
                                          width: "calc(100% - 12px)",
                                          height: "calc(100% - 6px)",
                                          border: 0,
                                          borderRadius: 22,
                                          background: "#FFFFFF",
                                          boxShadow:
                                            "0 16px 32px rgba(47, 42, 36, 0.12)",
                                        }}
                                      />
                                    </div>
                                  ) : (
                                    <div
                                      style={{
                                        position: "absolute",
                                        inset: 0,
                                        display: "flex",
                                        alignItems: "flex-start",
                                        justifyContent: "flex-start",
                                        padding: 14,
                                        background: "#FFFFFF",
                                      }}
                                    >
                                      <img
                                        src={ahangamaPassMobileWallet}
                                        alt="Ahangama Pass iPhone preview"
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                          objectFit: "contain",
                                          objectPosition: "top center",
                                          borderRadius: 18,
                                          transform: "scale(1.1)",
                                          transformOrigin: "top center",
                                        }}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Col>

                          <Col xs={24} md={14}>
                            <Paragraph
                              style={{
                                marginBottom: 18,
                                color: "#55514B",
                                fontSize: 17,
                                lineHeight: 1.75,
                                maxWidth: 760,
                              }}
                            >
                              {selectedReachChannel.description}
                            </Paragraph>
                            <div style={{ maxWidth: 760 }}>
                              {selectedReachChannel.reach.map((point) => (
                                <div
                                  key={point}
                                  style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 10,
                                    marginBottom: 10,
                                  }}
                                >
                                  <CheckCircleOutlined
                                    style={{
                                      color: "#6A8A71",
                                      fontSize: 16,
                                      marginTop: 3,
                                    }}
                                  />
                                  <div style={{ display: "grid", gap: 12 }}>
                                    <Text
                                      style={{
                                        color: "#2F2A24",
                                        fontSize: 15,
                                        lineHeight: 1.6,
                                      }}
                                    >
                                      {point}
                                    </Text>
                                    {showAhangamaMapPreview &&
                                    point ===
                                      "Strong visibility across mobile devices" ? (
                                      <a
                                        href="https://maps.app.goo.gl/nh4DYnE3haE3euCT6"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                          display: "inline-flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          justifySelf: "start",
                                          padding: "12px 18px",
                                          borderRadius: 999,
                                          background: "#2F2A24",
                                          color: "#FFFFFF",
                                          fontSize: 14,
                                          fontWeight: 600,
                                          lineHeight: 1,
                                          textDecoration: "none",
                                          boxShadow:
                                            "0 14px 30px rgba(47, 42, 36, 0.14)",
                                        }}
                                      >
                                        Open in Google Maps
                                      </a>
                                    ) : null}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Col>
                        </Row>
                      </div>
                    ) : (
                      <div>
                        <Text
                          style={{
                            display: "block",
                            marginBottom: 10,
                            color: "#8A7B68",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: 1.6,
                            textTransform: "uppercase",
                          }}
                        >
                          Selected Channel
                        </Text>
                        <Title
                          level={3}
                          style={{
                            marginBottom: 12,
                            color: "#2F2A24",
                            fontFamily:
                              '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                            fontSize: "clamp(28px, 3vw, 36px)",
                            lineHeight: 1.05,
                          }}
                        >
                          {selectedReachChannel.label}
                        </Title>
                        <Paragraph
                          style={{
                            marginBottom: 18,
                            color: "#55514B",
                            fontSize: 17,
                            lineHeight: 1.75,
                            maxWidth: 760,
                          }}
                        >
                          {selectedReachChannel.description}
                        </Paragraph>
                        <Text
                          style={{
                            display: "block",
                            marginBottom: 12,
                            color: "#2F2A24",
                            fontSize: 14,
                            fontWeight: 700,
                            letterSpacing: 1.2,
                            textTransform: "uppercase",
                          }}
                        ></Text>
                        <div style={{ maxWidth: 760 }}>
                          {selectedReachChannel.reach.map((point) => (
                            <div
                              key={point}
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 10,
                                marginBottom: 10,
                              }}
                            >
                              <CheckCircleOutlined
                                style={{
                                  color: "#6A8A71",
                                  fontSize: 16,
                                  marginTop: 3,
                                }}
                              />
                              <div style={{ display: "grid", gap: 12 }}>
                                <Text
                                  style={{
                                    color: "#2F2A24",
                                    fontSize: 15,
                                    lineHeight: 1.6,
                                  }}
                                >
                                  {point}
                                </Text>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                </Col>
              </Row>
            </div>

            <div style={{ marginBottom: 18 }}>
              <Text
                style={{
                  display: "block",
                  marginBottom: 10,
                  color: "#8A7B68",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.6,
                  textTransform: "uppercase",
                }}
              >
                Partnership Options
              </Text>
            </div>

            <Row gutter={[24, 24]} style={{ marginBottom: 40 }}>
              {PRODUCT_TIERS.map((tier) => (
                <Col xs={24} md={12} xl={6} key={tier.name}>
                  <Card
                    style={{
                      height: "100%",
                      borderRadius: "24px",
                      background: "#F7F1E8",
                      border: "1px solid rgba(86, 72, 57, 0.12)",
                      boxShadow: "0 18px 42px rgba(47, 42, 36, 0.08)",
                    }}
                    bodyStyle={{ padding: "28px 24px" }}
                  >
                    <Text
                      style={{
                        display: "block",
                        marginBottom: 12,
                        color: "#8A7B68",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: 1.5,
                        textTransform: "uppercase",
                      }}
                    >
                      Product Tier
                    </Text>
                    <Title
                      level={3}
                      style={{
                        marginBottom: 10,
                        color: "#2F2A24",
                        fontFamily:
                          '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                        fontSize: 26,
                        lineHeight: 1,
                      }}
                    >
                      {tier.name}
                    </Title>
                    <div style={{ marginBottom: 14 }}>
                      <Text
                        style={{
                          color: "#234731",
                          fontSize: 18,
                          fontWeight: 700,
                        }}
                      >
                        {tier.price}
                      </Text>
                      {tier.billing ? (
                        <Text
                          style={{
                            color: "#55514B",
                            fontSize: 14,
                            marginLeft: 4,
                          }}
                        >
                          {tier.billing}
                        </Text>
                      ) : null}
                    </div>
                    <Paragraph
                      style={{
                        color: "#55514B",
                        fontSize: 15,
                        lineHeight: 1.7,
                        marginBottom: 16,
                      }}
                    >
                      {tier.summary}
                    </Paragraph>
                    <Paragraph
                      style={{
                        color: "#2F2A24",
                        fontSize: 15,
                        lineHeight: 1.65,
                        marginBottom: 16,
                        fontWeight: 600,
                      }}
                    >
                      {tier.intro}
                    </Paragraph>
                    {tier.points.map((point) => (
                      <div
                        key={point}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                          marginBottom: 10,
                        }}
                      >
                        <CheckCircleOutlined
                          style={{
                            color: "#6A8A71",
                            fontSize: 16,
                            marginTop: 3,
                          }}
                        />
                        <Text
                          style={{
                            color: "#2F2A24",
                            fontSize: 15,
                            lineHeight: 1.55,
                          }}
                        >
                          {point}
                        </Text>
                      </div>
                    ))}
                  </Card>
                </Col>
              ))}
            </Row>

            <div style={{ marginBottom: 52 }}>
              <div style={{ textAlign: "center", marginBottom: 26 }}>
                <Text
                  style={{
                    display: "block",
                    marginBottom: 10,
                    color: "#8A7B68",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1.6,
                    textTransform: "uppercase",
                  }}
                >
                  Additional Promotional Products
                </Text>
              </div>

              <Row gutter={[18, 18]}>
                {PROMOTIONAL_PRODUCTS.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Col xs={24} sm={12} md={8} xl={24 / 7} key={item.name}>
                      <Card
                        style={{
                          height: "100%",
                          borderRadius: "20px",
                          background: "#FBF8F2",
                          border: "1px solid rgba(86, 72, 57, 0.1)",
                          boxShadow: "0 12px 30px rgba(47, 42, 36, 0.05)",
                        }}
                        bodyStyle={{
                          padding: "24px 18px",
                          textAlign: "center",
                        }}
                      >
                        <Icon
                          style={{
                            fontSize: 30,
                            color: "#61766A",
                            marginBottom: 14,
                          }}
                        />
                        <Title
                          level={4}
                          style={{
                            marginBottom: 12,
                            color: "#2F2A24",
                            fontSize: 18,
                            lineHeight: 1.2,
                          }}
                        >
                          {item.name}
                        </Title>
                        <Text
                          style={{
                            color: "#234731",
                            fontSize: 18,
                            fontWeight: 700,
                          }}
                        >
                          {item.price}
                        </Text>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </div>

            <div
              style={{
                borderTop: "1px solid rgba(86, 72, 57, 0.12)",
                paddingTop: 28,
                maxWidth: 920,
              }}
            >
              <Text
                style={{
                  display: "block",
                  marginBottom: 14,
                  color: "#8A7B68",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.6,
                  textTransform: "uppercase",
                }}
              >
                Best Fit
              </Text>
              <Title
                level={3}
                style={{
                  marginBottom: 18,
                  color: "#2F2A24",
                  fontFamily:
                    '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                  fontSize: "clamp(28px, 3vw, 40px)",
                  lineHeight: 1.05,
                }}
              >
                Built for the businesses shaping the Ahangama destination.
              </Title>
              <Row gutter={[16, 16]}>
                {PLATFORM_AREAS.map((item) => (
                  <Col xs={24} sm={12} key={item}>
                    <Card
                      style={{
                        borderRadius: "20px",
                        background: "#FFFFFF",
                        border: "1px solid rgba(86, 72, 57, 0.12)",
                        boxShadow: "0 12px 30px rgba(47, 42, 36, 0.05)",
                      }}
                      bodyStyle={{ padding: "18px 20px" }}
                    >
                      <Text
                        style={{
                          color: "#2F2A24",
                          fontSize: 16,
                          lineHeight: 1.5,
                        }}
                      >
                        {item}
                      </Text>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
