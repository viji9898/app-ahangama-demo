import React from "react";
import {
  BookOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  InstagramOutlined,
  MailOutlined,
  NotificationOutlined,
  ReadOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Typography } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";

const { Paragraph, Text, Title } = Typography;

const HERO_IMAGE =
  "https://polarsteps.s3.amazonaws.com/user_images/steps/large_thumb/u_8317798/3f3fcfc3-61bc-44c9-9e07-5bc8d35ab99c_455b553f-d99d-40ca-ad04-3a5774a62cef.jpg";

const PRODUCT_TIERS = [
  {
    name: "Pass Partner",
    price: "Free",
    billing: "",
    summary:
      "Join the Ahangama Pass network and offer a benefit to visitors.",
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
  { label: "Ahangama.com", icon: HomeOutlined },
  { label: "Ahangama Pass", icon: TagOutlined },
  { label: "Ahangama Map", icon: EnvironmentOutlined },
  { label: "Ahangama Guide 2026/27", icon: BookOutlined },
  { label: "Visitor Email Campaigns", icon: MailOutlined },
  { label: "Hotel Partnerships", icon: HomeOutlined },
  { label: "Concierge Recommendations", icon: NotificationOutlined },
  { label: "Instagram & Social Media", icon: InstagramOutlined },
  { label: "Editorial Features", icon: ReadOutlined },
];

const PROMOTIONAL_PRODUCTS = [
  { name: "Featured Venue of the Week", price: "$50", icon: NotificationOutlined },
  { name: "Newsletter Sponsor", price: "$25", icon: MailOutlined },
  { name: "Event Promotion", price: "$25", icon: CalendarOutlined },
  { name: "Seasonal Campaign", price: "$100", icon: TagOutlined },
  { name: "Dedicated Editorial Story", price: "$250", icon: ReadOutlined },
  { name: "New Venue Launch Package", price: "$250", icon: BookOutlined },
  { name: "Homepage Feature", price: "$250 /month", icon: HomeOutlined },
];

export default function Partners() {
  const canonical = absUrl("/partners");

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
                      connecting visitors with the town&apos;s most relevant stays,
                      experiences, food, retail and wellness brands through a
                      tiered commercial product.
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

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 18,
                }}
              >
                {AUDIENCE_REACH_CHANNELS.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.label}>
                      <div
                        style={{
                          height: "100%",
                          textAlign: "left",
                          padding: "16px 0",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
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
                      </div>
                    </div>
                  );
                })}
              </div>
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