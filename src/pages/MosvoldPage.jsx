import React, { useState } from "react";
import {
  ArrowRightOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Input, Modal, Row, Space, Typography } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
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

const PASS_EDITORIAL_NOTES = [
  "A local access pass designed to open up Ahangama with more depth and less guesswork.",
  "Perks and privileges across 150+ venues, from cafes and restaurants to wellness studios, surf spaces, stays and everyday essentials.",
  "Access to a curated guide and map shaped around more authentic local experiences, useful recommendations and places actually worth knowing.",
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
                  maxWidth: "none",
                  margin: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    minHeight: "100svh",
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
                      style={{ color: "#FFFFFF", whiteSpace: "normal" }}
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
                  </Space>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dm-canvas">
        <div className="dm-wrap" style={{ paddingBottom: 8 }}>
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
                  <Space size={8} align="center" style={{ marginTop: 14 }}>
                    <img
                      src={addToAppleWalletLogo}
                      alt="Apple Wallet"
                      style={{ display: "block", height: 45, width: "auto" }}
                    />
                    <img
                      src={addToGoogleWalletLogo}
                      alt="Google Wallet"
                      style={{ display: "block", height: 45, width: "auto" }}
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

          <Card
            style={{
              marginTop: 8,
              borderRadius: 28,
              border: "1px solid rgba(32,30,27,0.08)",
              background: "linear-gradient(180deg, #fffdf9 0%, #f7f0e6 100%)",
              boxShadow: "0 22px 54px rgba(47,62,58,0.06)",
            }}
            bodyStyle={{ padding: 30 }}
          >
            <Row gutter={[28, 28]} align="top">
              <Col xs={24} lg={10}>
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
                  What Is The Ahangama Pass
                </Text>
                <Title
                  level={2}
                  style={{
                    marginTop: 0,
                    marginBottom: 14,
                    color: "#201E1B",
                    fontFamily:
                      '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                    fontSize: "clamp(34px, 4vw, 58px)",
                    lineHeight: 0.96,
                    fontWeight: 500,
                  }}
                >
                  A considered way into Ahangama.
                </Title>
                <a
                  href="https://ahangama.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    color: "#2F3E3A",
                    textDecoration: "none",
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: 0.2,
                  }}
                >
                  Explore Ahangama.com -&gt;
                </a>
              </Col>

              <Col xs={24} lg={14}>
                <div style={{ display: "grid", gap: 18 }}>
                  {PASS_EDITORIAL_NOTES.map((item) => (
                    <Paragraph
                      key={item}
                      style={{
                        margin: 0,
                        color: "#4B463F",
                        fontSize: 17,
                        lineHeight: 1.9,
                        maxWidth: 760,
                      }}
                    >
                      {item}
                    </Paragraph>
                  ))}

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                      gap: 12,
                      marginTop: 4,
                    }}
                  >
                    {[
                      "150+ venues across Ahangama",
                      "Perks, privileges and everyday savings",
                      "Curated local guide and map",
                      "More authentic local experiences",
                    ].map((item) => (
                      <div
                        key={item}
                        style={{
                          padding: "12px 14px",
                          borderTop: "1px solid rgba(32,30,27,0.12)",
                          color: "#201E1B",
                          fontSize: 14,
                          lineHeight: 1.6,
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </SiteLayout>
  );
}
