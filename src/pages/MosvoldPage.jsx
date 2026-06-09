import React from "react";
import {
  ArrowRightOutlined,
  BookOutlined,
  CheckCircleOutlined,
  GiftOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Input, Row, Space, Typography } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import addToAppleWalletLogo from "../assets/add_to_apple_wallet.png";
import addToGoogleWalletLogo from "../assets/add_to_google_wallet.png";

const { Paragraph, Text, Title } = Typography;

const MOSVOLD_HERO_IMAGE =
  "https://www.mosvoldhotels.com/wp-content/uploads/2025/05/About-Mosvold-1920x600-1.jpg";

const BENEFITS = [
  "A 15-day Ahangama Pass, usually priced at USD 30, offered complimentary by Mosvold.",
  "Issued immediately after the guest shares their details through this page.",
  "Curated partner perks across cafes, wellness, stays, surf, retail, and local experiences.",
  "A simpler way to explore Ahangama without researching every venue from scratch.",
];

const HOW_IT_WORKS = [
  {
    body: "Guest shares basic details through the form below.",
    icon: <BookOutlined style={{ fontSize: 18, color: "#B08E62" }} />,
  },
  {
    body: "The complimentary 15-day pass is issued immediately after submission.",
    icon: <CheckCircleOutlined style={{ fontSize: 18, color: "#B08E62" }} />,
  },
  {
    body: "The guest uses the pass across Ahangama partner venues during their stay and beyond within the 15-day validity.",
    icon: <SafetyCertificateOutlined style={{ fontSize: 18, color: "#B08E62" }} />,
  },
];

export default function MosvoldPage() {
  const canonical = absUrl("/mosvold");

  return (
    <SiteLayout navOverlayHero>
      <Seo
        title="Mosvold Guest Pass"
        description="A dedicated landing page for Mosvold guests to receive a complimentary 15-day Ahangama Pass, usually priced at USD 30 and issued immediately after sign-up."
        canonical={canonical}
        ogImage={MOSVOLD_HERO_IMAGE}
      />

      <div
        className="dm-canvas"
        style={{ marginTop: 0, paddingTop: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
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
                    {[
                      "Mosvold Guest Access",
                      "Complimentary Ahangama Pass",
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
                    <span className="home-hero-titleLine" style={{ color: "#FFFFFF" }}>
                      Complimentary
                    </span>
                    <span className="home-hero-titleLine" style={{ color: "#FFFFFF" }}>
                      Ahangama Pass
                    </span>
                    <span className="home-hero-titleLine" style={{ color: "#FFFFFF" }}>
                      For Mosvold Guests
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
                    Dedicated Guest Sign-Up Page
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
                    A Mosvold guest benefit that unlocks a complimentary 15-day Ahangama
                    Pass, usually priced at USD 30. Guests can submit their details,
                    receive the pass immediately, and use it as a curated way into cafes,
                    wellness spaces, surf, retail, and experiences across town.
                  </Paragraph>

                  <Space wrap size={12}>
                    <Button
                      type="primary"
                      size="large"
                      href="#mosvold-signup-form"
                    >
                      Request Your Pass
                    </Button>
                    <Button size="large" href="/offers" icon={<ArrowRightOutlined />}>
                      Explore Pass Benefits
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
                style={{
                  borderRadius: 28,
                  border: "1px solid rgba(32,30,27,0.08)",
                  background: "linear-gradient(180deg, #fffdf9 0%, #f7f0e6 100%)",
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
                  Why This Page Exists
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
                  A branded Mosvold entry point into the Ahangama Pass.
                </Title>
                <Paragraph
                  style={{
                    color: "#4B463F",
                    fontSize: 17,
                    lineHeight: 1.8,
                    marginBottom: 24,
                  }}
                >
                  This page is structured as a guest-facing landing page where Mosvold can
                  offer eligible guests a complimentary 15-day Ahangama Pass that usually
                  costs USD 30. The guest shares a few details, the pass is issued
                  immediately, and the page frames the benefit in a clear hotel-branded way.
                </Paragraph>

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
                      <Space direction="vertical" size={12} style={{ width: "100%" }}>
                        <GiftOutlined style={{ fontSize: 22, color: "#B08E62" }} />
                        <Text
                          style={{
                            color: "#201E1B",
                            fontSize: 14,
                            fontWeight: 700,
                            letterSpacing: 1.2,
                            textTransform: "uppercase",
                          }}
                        >
                          Pass Benefits
                        </Text>
                        {BENEFITS.map((item) => (
                          <div
                            key={item}
                            style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
                          >
                            <CheckCircleOutlined
                              style={{ color: "#B08E62", marginTop: 4 }}
                            />
                            <Text style={{ color: "#4B463F", lineHeight: 1.7 }}>{item}</Text>
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
                      <Space direction="vertical" size={12} style={{ width: "100%" }}>
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
                          How It Works
                        </Text>
                        {HOW_IT_WORKS.map((item, index) => (
                          <div
                            key={item.body}
                            style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
                          >
                            <Text
                              style={{
                                minWidth: 22,
                                color: "#B08E62",
                                fontWeight: 700,
                              }}
                            >
                              {index + 1}.
                            </Text>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                              <span
                                style={{
                                  minWidth: 24,
                                  display: "inline-flex",
                                  justifyContent: "center",
                                  paddingTop: 2,
                                }}
                              >
                                {item.icon}
                              </span>
                              <Text style={{ color: "#4B463F", lineHeight: 1.7 }}>{item.body}</Text>
                            </div>
                          </div>
                        ))}
                      </Space>
                    </Card>
                  </Col>
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
                  Guest Sign-Up Form
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
                  Request your complimentary 15-day pass.
                </Title>
                <Paragraph
                  style={{
                    color: "#5A554D",
                    fontSize: 15,
                    lineHeight: 1.75,
                    marginBottom: 22,
                  }}
                >
                  Mosvold guests receive a complimentary Ahangama Pass valid for 15 days,
                  usually priced at USD 30, immediately after submitting these details.
                </Paragraph>

                <Space direction="vertical" size={14} style={{ width: "100%" }}>
                  <div>
                    <Text style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                      Full name
                    </Text>
                    <Input size="large" placeholder="Enter guest name" />
                  </div>

                  <div>
                    <Text style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                      Email address
                    </Text>
                    <Input size="large" placeholder="Enter guest email" />
                  </div>

                  <div>
                    <Text style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                      Phone number
                    </Text>
                    <Input size="large" placeholder="Enter guest number" />
                  </div>

                  <div>
                    <Text style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                      Room number or stay reference
                    </Text>
                    <Input size="large" placeholder="Optional stay reference" />
                  </div>

                  <Button type="primary" size="large" block style={{ marginTop: 6 }}>
                    Submit Guest Request
                  </Button>
                </Space>

                <Card
                  style={{
                    marginTop: 20,
                    borderRadius: 20,
                    border: "1px solid rgba(176,142,98,0.18)",
                    background: "linear-gradient(180deg, #fffaf1 0%, #f6ebd9 100%)",
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
                    Pass Delivery
                  </Text>
                  <Paragraph style={{ marginBottom: 0, color: "#5A554D", lineHeight: 1.7 }}>
                    The pass is issued immediately after submission. This area can later hold
                    the delivery confirmation, wallet links, or follow-up concierge details.
                  </Paragraph>
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
                </Card>
              </Card>
            </Col>
          </Row>

        </div>
      </div>
    </SiteLayout>
  );
}