import React, { useState } from "react";
import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  GiftOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Input, Modal, Row, Space, Typography } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import NewsletterSignup from "../components/newsletter/NewsletterSignup";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import addToAppleWalletLogo from "../assets/add_to_apple_wallet.png";
import addToGoogleWalletLogo from "../assets/add_to_google_wallet.png";

const { Paragraph, Text, Title } = Typography;

const MOSVOLD_HERO_IMAGE =
  "https://www.mosvoldhotels.com/wp-content/uploads/2025/05/About-Mosvold-1920x600-1.jpg";

const HERO_FEATURES = [
  "Complimentary 15-Day Pass",
  "Apple Wallet & Google Wallet Access",
  "Local Discounts & Perks",
  "Ahangama Guide & Map",
];

const RECEIVE_ITEMS = [
  "15-Day Digital Pass",
  "Instant Delivery",
  "Apple Wallet & Google Wallet",
  "Discounts at Cafes & Restaurants",
  "Wellness & Fitness Partner Offers",
  "Surf & Experience Benefits",
  "Ahangama Guide 2026/27",
  "Curated Ahangama Map",
];

const FEATURED_BENEFITS = [
  { title: "Living Room Concept Store", benefit: "10% Off" },
  { title: "Hakuna Matata", benefit: "10% Off Food" },
  { title: "Global Surf Lodge", benefit: "10% Off Rooms" },
  { title: "Pura Pilates", benefit: "10% Off Classes" },
  { title: "Coconut Court", benefit: "Member Rate Pickleball" },
  { title: "Frosty's", benefit: "10% Off Entry & Memberships" },
];

const DISCOVER_CARDS = [
  {
    title: "Ahangama Guide 2026/27",
    description:
      "Editorial recommendations from the local Ahangama.com team.",
    detail:
      "Best cafes, beaches, surf spots, wellness experiences and places to explore.",
    ctaLabel: "View Guide",
    href: "/blogs",
  },
  {
    title: "Curated Ahangama Map",
    description: "Discover:",
    highlights: [
      "Best Breakfasts",
      "Sunset Spots",
      "Beginner Surf",
      "Coffee & Workspaces",
      "Wellness Studios",
      "Date Night Picks",
      "Local Favourites",
    ],
    ctaLabel: "Open Map",
    href: "/map",
  },
];

const LOCAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/ahangama.pass",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/94777908790?text=Hi%20Ahangama%20-%20I%20would%20love%20some%20local%20recommendations.",
  },
  {
    label: "Email",
    href: "mailto:hello@ahangama.com?subject=Ahangama%20Enquiry",
  },
];

export default function MosvoldPage() {
  const canonical = absUrl("/mosvold");
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(true);

  return (
    <SiteLayout navOverlayHero>
      <Seo
        title="Mosvold Guest Pass"
        description="A premium Mosvold guest benefit offering a complimentary Ahangama Pass, with local perks, wallet access, and curated recommendations included with the stay."
        canonical={canonical}
        ogImage={MOSVOLD_HERO_IMAGE}
      />

      <Modal
        open={isDisclaimerOpen}
        onOk={() => setIsDisclaimerOpen(false)}
        onCancel={() => setIsDisclaimerOpen(false)}
        okText="Continue"
        cancelText="Close"
        centered
        title="Disclaimer"
      >
        <Paragraph style={{ marginBottom: 0, color: "#4B463F", lineHeight: 1.8 }}>
          This page is for demonstration purposes only and is not associated with
          Mosvold at this time.
        </Paragraph>
      </Modal>

      <div
        className="dm-canvas"
        style={{
          marginTop: 0,
          paddingTop: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      >
        <div className="dm-wrap">
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
                minHeight: "92svh",
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
                      "linear-gradient(90deg, rgba(10,14,18,0.84) 0%, rgba(10,14,18,0.74) 22%, rgba(10,14,18,0.5) 42%, rgba(10,14,18,0.16) 68%, rgba(10,14,18,0.02) 100%)",
                    pointerEvents: "none",
                    zIndex: 2,
                  }}
                />
                <img
                  className="home-hero-image"
                  src={MOSVOLD_HERO_IMAGE}
                  alt="Mosvold villa exterior"
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
                    minHeight: "92svh",
                    maxWidth: 720,
                    padding:
                      "clamp(44px, 5vw, 68px) clamp(32px, 4.8vw, 72px) 44px",
                  }}
                >
                  <Space size={12} wrap style={{ marginBottom: 18 }}>
                    {["Mosvold Guest Access"].map((item) => (
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
                  </Space>

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
                      Complimentary
                    </span>
                    <span
                      className="home-hero-titleLine"
                      style={{ color: "#FFFFFF" }}
                    >
                      Ahangama Pass
                    </span>
                    <span
                      className="home-hero-titleLine"
                      style={{ color: "#FFFFFF" }}
                    >
                      Exclusively for Mosvold Guests
                    </span>
                  </Title>

                  <Text
                    style={{
                      display: "block",
                      marginTop: 18,
                      color: "rgba(255,255,255,0.92)",
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: 1.6,
                      textTransform: "uppercase",
                    }}
                  >
                    A complimentary benefit included with your stay.
                  </Text>

                  <Paragraph
                    style={{
                      marginTop: 24,
                      marginBottom: 22,
                      maxWidth: 560,
                      color: "#FFFFFF",
                      fontSize: "clamp(16px, 1.45vw, 19px)",
                      lineHeight: 1.72,
                    }}
                  >
                    Unlock discounts, local recommendations and curated
                    experiences across cafes, wellness spaces, surf spots and
                    independent businesses throughout Ahangama.
                  </Paragraph>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: 10,
                      maxWidth: 620,
                      marginBottom: 26,
                    }}
                  >
                    {HERO_FEATURES.map((item) => (
                      <div
                        key={item}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          color: "rgba(255,255,255,0.94)",
                          fontSize: 14,
                          lineHeight: 1.5,
                        }}
                      >
                        <span style={{ color: "#D8C3A0", fontSize: 16 }}>•</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <Space wrap size={12}>
                    <Button
                      type="primary"
                      size="large"
                      href="#mosvold-signup-form"
                    >
                      Claim Your Pass
                    </Button>
                    <Button
                      size="large"
                      href="#mosvold-benefits"
                      icon={<ArrowRightOutlined />}
                    >
                      See Included Benefits
                    </Button>
                  </Space>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dm-canvas">
        <div className="dm-wrap" style={{ paddingBottom: 56 }}>
          <Row gutter={[24, 24]} style={{ marginTop: 28 }}>
            <Col xs={24} lg={14}>
              <Card
                id="mosvold-benefits"
                style={{
                  borderRadius: 28,
                  border: "1px solid rgba(32,30,27,0.08)",
                  background:
                    "linear-gradient(180deg, #fffdf9 0%, #f7f0e6 100%)",
                }}
                bodyStyle={{ padding: 30 }}
              >
                <Text
                  style={{
                    display: "block",
                    marginBottom: 12,
                    color: "#B08E62",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: 1.8,
                    textTransform: "uppercase",
                  }}
                >
                  Included With Your Stay
                </Text>
                <Title
                  level={2}
                  style={{
                    marginTop: 0,
                    marginBottom: 14,
                    color: "#201E1B",
                    fontFamily:
                      '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                    fontSize: "clamp(30px, 4vw, 54px)",
                    lineHeight: 0.98,
                    fontWeight: 500,
                  }}
                >
                  A Complimentary Local Access Pass.
                </Title>
                <Paragraph
                  style={{
                    color: "#4B463F",
                    fontSize: 17,
                    lineHeight: 1.8,
                    marginBottom: 16,
                  }}
                >
                  The Ahangama Pass is a curated visitor pass designed to help
                  you experience the best of Ahangama.
                </Paragraph>
                <Paragraph
                  style={{
                    color: "#4B463F",
                    fontSize: 17,
                    lineHeight: 1.8,
                    marginBottom: 16,
                  }}
                >
                  Usually purchased separately, Mosvold guests receive
                  complimentary access as part of their stay.
                </Paragraph>
                <Paragraph
                  style={{
                    color: "#4B463F",
                    fontSize: 17,
                    lineHeight: 1.8,
                    marginBottom: 24,
                  }}
                >
                  The pass provides access to exclusive offers, local
                  recommendations and savings across a growing network of
                  independent businesses.
                </Paragraph>

                <Row gutter={[18, 18]}>
                  {DISCOVER_CARDS.map((item) => (
                    <Col xs={24} md={12} key={item.title}>
                      <Card
                        style={{
                          height: "100%",
                          borderRadius: 22,
                          border: "1px solid rgba(32,30,27,0.08)",
                          background: "rgba(255,255,255,0.84)",
                        }}
                        bodyStyle={{ padding: 22 }}
                      >
                        <Title
                          level={3}
                          style={{
                            marginTop: 0,
                            marginBottom: 12,
                            color: "#201E1B",
                            fontFamily:
                              '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                            fontSize: 28,
                            lineHeight: 1.05,
                          }}
                        >
                          {item.title}
                        </Title>
                        <Paragraph
                          style={{
                            color: "#4B463F",
                            lineHeight: 1.8,
                            marginBottom: 10,
                          }}
                        >
                          {item.description}
                        </Paragraph>
                        {item.detail ? (
                          <Paragraph
                            style={{
                              color: "#4B463F",
                              lineHeight: 1.8,
                              marginBottom: 22,
                            }}
                          >
                            {item.detail}
                          </Paragraph>
                        ) : null}
                        {item.highlights ? (
                          <div style={{ marginBottom: 22, display: "grid", gap: 6 }}>
                            {item.highlights.map((highlight) => (
                              <Text
                                key={highlight}
                                style={{ color: "#4B463F", lineHeight: 1.7 }}
                              >
                                {`• ${highlight}`}
                              </Text>
                            ))}
                          </div>
                        ) : null}
                        <Button href={item.href} icon={<ArrowRightOutlined />}>
                          {item.ctaLabel}
                        </Button>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>

            <Col xs={24} lg={10}>
              <Card
                id="mosvold-signup-form"
                style={{
                  borderRadius: 28,
                  border: "1px solid rgba(32,30,27,0.08)",
                  background: "#FFFFFF",
                  boxShadow: "0 22px 54px rgba(47,62,58,0.08)",
                }}
                bodyStyle={{ padding: 30 }}
              >
                <Text
                  style={{
                    display: "block",
                    marginBottom: 10,
                    color: "#B08E62",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: 1.8,
                    textTransform: "uppercase",
                  }}
                >
                  Mosvold Guest Access
                </Text>
                <Title
                  level={3}
                  style={{
                    marginTop: 0,
                    marginBottom: 10,
                    color: "#201E1B",
                    fontFamily:
                      '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                    fontSize: "clamp(30px, 3vw, 42px)",
                    lineHeight: 1,
                    fontWeight: 500,
                  }}
                >
                  Claim Your Complimentary Pass
                </Title>
                <Paragraph
                  style={{
                    color: "#5A554D",
                    fontSize: 15,
                    lineHeight: 1.75,
                    marginBottom: 22,
                  }}
                >
                  Complete the short form below.
                </Paragraph>
                <Paragraph
                  style={{
                    color: "#5A554D",
                    fontSize: 15,
                    lineHeight: 1.75,
                    marginBottom: 22,
                  }}
                >
                  Your digital pass will be issued immediately and can be added
                  directly to Apple Wallet or Google Wallet.
                </Paragraph>

                <Space direction="vertical" size={14} style={{ width: "100%" }}>
                  <div>
                    <Text
                      style={{
                        display: "block",
                        marginBottom: 8,
                        fontWeight: 600,
                      }}
                    >
                      Full name
                    </Text>
                    <Input size="large" placeholder="Enter guest name" />
                  </div>

                  <div>
                    <Text
                      style={{
                        display: "block",
                        marginBottom: 8,
                        fontWeight: 600,
                      }}
                    >
                      Email address
                    </Text>
                    <Input size="large" placeholder="Enter guest email" />
                  </div>

                  <div>
                    <Text
                      style={{
                        display: "block",
                        marginBottom: 8,
                        fontWeight: 600,
                      }}
                    >
                      Phone number
                    </Text>
                    <Input size="large" placeholder="Enter guest number" />
                  </div>

                  <div>
                    <Text
                      style={{
                        display: "block",
                        marginBottom: 8,
                        fontWeight: 600,
                      }}
                    >
                      Room number or stay reference
                    </Text>
                    <Input size="large" placeholder="Optional stay reference" />
                  </div>

                  <Button
                    type="primary"
                    size="large"
                    block
                    style={{ marginTop: 6 }}
                  >
                    Get My Complimentary Pass
                  </Button>
                </Space>

                <Card
                  style={{
                    marginTop: 20,
                    borderRadius: 20,
                    border: "1px solid rgba(176,142,98,0.18)",
                    background:
                      "linear-gradient(180deg, #fffaf1 0%, #f6ebd9 100%)",
                  }}
                  bodyStyle={{ padding: 18 }}
                >
                  <Text
                    style={{
                      display: "block",
                      color: "#7A5B32",
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: 1.2,
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    Instant Digital Delivery
                  </Text>
                  <Paragraph
                    style={{
                      marginBottom: 10,
                      color: "#5A554D",
                      lineHeight: 1.7,
                    }}
                  >
                    Your pass is delivered immediately after submission.
                  </Paragraph>
                  <Text
                    style={{
                      display: "block",
                      color: "#5A554D",
                      lineHeight: 1.7,
                    }}
                  >
                    Add it directly to:
                  </Text>
                  <Text
                    style={{
                      display: "block",
                      marginTop: 8,
                      color: "#201E1B",
                      lineHeight: 1.8,
                    }}
                  >
                    Apple Wallet
                  </Text>
                  <Text
                    style={{
                      display: "block",
                      color: "#201E1B",
                      lineHeight: 1.8,
                    }}
                  >
                    Google Wallet
                  </Text>
                  <Space size={8} align="center" style={{ marginTop: 14 }}>
                    <img
                      src={addToAppleWalletLogo}
                      alt="Apple Wallet"
                      style={{ display: "block", height: 30, width: "auto" }}
                    />
                    <img
                      src={addToGoogleWalletLogo}
                      alt="Google Wallet"
                      style={{ display: "block", height: 30, width: "auto" }}
                    />
                  </Space>
                  <Paragraph
                    style={{
                      marginTop: 14,
                      marginBottom: 0,
                      color: "#5A554D",
                      lineHeight: 1.7,
                    }}
                  >
                    No app required.
                  </Paragraph>
                  <Paragraph
                    style={{
                      marginTop: 8,
                      marginBottom: 0,
                      color: "#5A554D",
                      lineHeight: 1.7,
                    }}
                  >
                    Simply show your pass when visiting participating venues.
                  </Paragraph>
                </Card>
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} style={{ marginTop: 8 }}>
            <Col xs={24} lg={14}>
              <Card
                style={{
                  borderRadius: 28,
                  border: "1px solid rgba(32,30,27,0.08)",
                  background: "#FFFFFF",
                  boxShadow: "0 22px 54px rgba(47,62,58,0.06)",
                }}
                bodyStyle={{ padding: 30 }}
              >
                <Text
                  style={{
                    display: "block",
                    marginBottom: 12,
                    color: "#B08E62",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: 1.8,
                    textTransform: "uppercase",
                  }}
                >
                  What You Receive
                </Text>
                <Title
                  level={2}
                  style={{
                    marginTop: 0,
                    marginBottom: 22,
                    color: "#201E1B",
                    fontFamily:
                      '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                    fontSize: "clamp(30px, 4vw, 54px)",
                    lineHeight: 0.98,
                    fontWeight: 500,
                  }}
                >
                  Featured Benefits
                </Title>

                <Row gutter={[18, 18]}>
                  <Col xs={24} md={12}>
                    <Card
                      style={{
                        height: "100%",
                        borderRadius: 22,
                        border: "1px solid rgba(32,30,27,0.08)",
                        background: "rgba(255,255,255,0.84)",
                      }}
                      bodyStyle={{ padding: 22 }}
                    >
                      <Space
                        direction="vertical"
                        size={12}
                        style={{ width: "100%" }}
                      >
                        <GiftOutlined
                          style={{ fontSize: 22, color: "#B08E62" }}
                        />
                        <Text
                          style={{
                            color: "#201E1B",
                            fontSize: 14,
                            fontWeight: 700,
                            letterSpacing: 1.2,
                            textTransform: "uppercase",
                          }}
                        >
                          What You Receive
                        </Text>
                        {RECEIVE_ITEMS.map((item) => (
                          <div
                            key={item}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 10,
                            }}
                          >
                            <CheckCircleOutlined
                              style={{ color: "#B08E62", marginTop: 4 }}
                            />
                            <Text style={{ color: "#4B463F", lineHeight: 1.7 }}>
                              {item}
                            </Text>
                          </div>
                        ))}
                      </Space>
                    </Card>
                  </Col>

                  <Col xs={24} md={12}>
                    <Card
                      style={{
                        height: "100%",
                        borderRadius: 22,
                        border: "1px solid rgba(32,30,27,0.08)",
                        background: "rgba(255,255,255,0.84)",
                      }}
                      bodyStyle={{ padding: 22 }}
                    >
                      <Space
                        direction="vertical"
                        size={12}
                        style={{ width: "100%" }}
                      >
                        <SafetyCertificateOutlined
                          style={{ fontSize: 22, color: "#B08E62" }}
                        />
                        <Text
                          style={{
                            color: "#201E1B",
                            fontSize: 14,
                            fontWeight: 700,
                            letterSpacing: 1.2,
                            textTransform: "uppercase",
                          }}
                        >
                          Featured Benefits
                        </Text>
                        {FEATURED_BENEFITS.map((item) => (
                          <div
                            key={item.title}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: 16,
                              paddingBottom: 10,
                              borderBottom: "1px solid rgba(32,30,27,0.08)",
                            }}
                          >
                            <Text
                              style={{
                                color: "#201E1B",
                                lineHeight: 1.7,
                                fontWeight: 500,
                              }}
                            >
                              {item.title}
                            </Text>
                            <Text
                              style={{
                                color: "#B08E62",
                                lineHeight: 1.7,
                                textAlign: "right",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {item.benefit}
                            </Text>
                          </div>
                        ))}
                        <Text style={{ color: "#6B645C", fontSize: 13, lineHeight: 1.7 }}>
                          Benefits vary by venue and may change throughout the season.
                        </Text>
                      </Space>
                    </Card>
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col xs={24} lg={10}>
              <Card
                style={{
                  borderRadius: 28,
                  border: "1px solid rgba(32,30,27,0.08)",
                  background: "#FFFFFF",
                  boxShadow: "0 22px 54px rgba(47,62,58,0.06)",
                }}
                bodyStyle={{ padding: 30 }}
              >
                <Text
                  style={{
                    display: "block",
                    marginBottom: 12,
                    color: "#B08E62",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: 1.8,
                    textTransform: "uppercase",
                  }}
                >
                  Powered By Ahangama.com
                </Text>
                <Title
                  level={2}
                  style={{
                    marginTop: 0,
                    marginBottom: 14,
                    color: "#201E1B",
                    fontFamily:
                      '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                    fontSize: "clamp(30px, 4vw, 46px)",
                    lineHeight: 0.98,
                    fontWeight: 500,
                  }}
                >
                  Built By Locals
                </Title>
                <Paragraph style={{ color: "#4B463F", lineHeight: 1.8, marginBottom: 16 }}>
                  Created by the Ahangama.com editorial team.
                </Paragraph>
                <Paragraph style={{ color: "#4B463F", lineHeight: 1.8, marginBottom: 16 }}>
                  A local guide dedicated to showcasing the best of Ahangama,
                  its businesses, people and experiences.
                </Paragraph>
                <Paragraph style={{ color: "#4B463F", lineHeight: 1.8, marginBottom: 24 }}>
                  Covering cafes, wellness, surf, stays, experiences and the
                  people that make this place special.
                </Paragraph>

                <Space size={18} wrap>
                  {LOCAL_LINKS.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#2F3E3A",
                        textDecoration: "none",
                        fontSize: 14,
                        letterSpacing: 0.2,
                      }}
                    >
                      {link.label}
                    </a>
                  ))}
                </Space>
              </Card>
            </Col>
          </Row>

          <Card
            style={{
              marginTop: 24,
              borderRadius: 28,
              border: "1px solid rgba(32,30,27,0.08)",
              background: "#FFFFFF",
              boxShadow: "0 22px 54px rgba(47,62,58,0.06)",
            }}
            bodyStyle={{ padding: 30 }}
          >
            <NewsletterSignup
              variant="compact"
              source="mosvold_newsletter"
              label="MONTHLY LETTER"
              title="The Ahangama Dispatch"
              description="A monthly collection of local recommendations, new openings, events and stories from around the South Coast."
            />
          </Card>
        </div>
      </div>
    </SiteLayout>
  );
}
