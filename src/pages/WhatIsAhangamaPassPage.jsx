import React from "react";
import { Button, Card, Col, Divider, Row, Space, Typography } from "antd";
import { ArrowRightOutlined, CheckCircleOutlined } from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { trackPassCtaClick } from "../analytics";
import { buildPassCtaUrl } from "../lib/passAttribution";
import ahangamaPassLogo from "../assets/ahangama-pass-logo.png";
import addToAppleWalletLogo from "../assets/add_to_apple_wallet.png";
import addToGoogleWalletLogo from "../assets/add_to_google_wallet.png";
import heroPassAppleWallet from "../assets/hero_pass_apple_wallet.png";

const { Paragraph, Text, Title } = Typography;

const waysToUseIt = [
  "Show the pass at partner cafes, stays, wellness spaces, and experience venues for member pricing and perks.",
  "Keep it in Apple Wallet or Google Wallet so it is always ready at check-in, on the road, or when walking into a venue.",
  "Use it as a curated shortcut into Ahangama instead of researching every coffee stop, surf lesson, or wellness session from scratch.",
];

const exampleMoments = [
  {
    title: "A three-day stay",
    body: "Arrive, save on partner venues, and stack in welcome gifts like five postcards and two tea tins on selected stay-led offers.",
  },
  {
    title: "A work-and-wellness week",
    body: "Use the pass for coffee meetings, recovery sessions, wellness bookings, and a curated shortlist of places that are actually worth your time.",
  },
  {
    title: "A first trip to Ahangama",
    body: "Skip generic tourist searching and use the pass as your access layer for trusted recommendations, discounts, and local discovery.",
  },
];

const savingsExamples = [
  "Partner discounts across cafes, stays, wellness, surf, and local experiences.",
  "Curated perks that can make the pass pay for itself within a few uses.",
  "On selected offers, five postcards at LKR 700 each plus two tea tins at LKR 4,000 each adds LKR 11,500 in extras alone.",
];

export default function WhatIsAhangamaPassPage() {
  const canonical = absUrl("/what-is-ahangama-pass");
  const passCtaUrl = buildPassCtaUrl();

  return (
    <SiteLayout>
      <Seo
        title="What Is The Ahangama Pass?"
        description="Learn what the Ahangama Pass is, how to use it, where Apple Wallet and Google Wallet fit in, and how the savings and extra perks add up."
        canonical={canonical}
        ogImage={heroPassAppleWallet}
      />

      <div className="dm-heroCut" />
      <div className="dm-canvas">
        <div className="dm-wrap" style={{ paddingBottom: 48 }}>
          <section
            style={{
              borderRadius: 30,
              overflow: "hidden",
              background:
                "linear-gradient(180deg, rgba(250,246,240,0.98) 0%, rgba(245,238,228,0.98) 100%)",
              boxShadow: "0 24px 60px rgba(47,62,58,0.08)",
              border: "1px solid rgba(32,30,27,0.08)",
            }}
          >
            <Row gutter={0} align="stretch">
              <Col xs={24} lg={11}>
                <div
                  style={{
                    height: "100%",
                    minHeight: 420,
                    background:
                      "radial-gradient(circle at top, rgba(255,255,255,0.78) 0%, rgba(239,231,218,0.96) 42%, rgba(227,216,201,0.98) 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "clamp(24px, 4vw, 40px)",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "min(100%, 280px)",
                      aspectRatio: "390 / 844",
                      borderRadius: 42,
                      padding: 10,
                      background:
                        "linear-gradient(180deg, #2b2a28 0%, #111 45%, #2f2d2a 100%)",
                      boxShadow:
                        "0 30px 60px rgba(32,30,27,0.18), inset 0 1px 0 rgba(255,255,255,0.14)",
                    }}
                  >
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        top: 18,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "36%",
                        height: 24,
                        borderRadius: 999,
                        background: "#0d0d0d",
                        zIndex: 2,
                      }}
                    />
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 34,
                        overflow: "hidden",
                        background:
                          "linear-gradient(180deg, rgba(251,248,242,1) 0%, rgba(242,236,227,1) 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "18px 12px 14px",
                      }}
                    >
                      <img
                        src={heroPassAppleWallet}
                        alt="Ahangama Pass shown inside an iPhone frame with Apple Wallet and Google Wallet branding"
                        style={{
                          display: "block",
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          objectPosition: "center center",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={24} lg={13}>
                <div
                  style={{
                    padding: "clamp(28px, 4vw, 52px)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      display: "block",
                      marginBottom: 16,
                      color: "#B08E62",
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                    }}
                  >
                    The Ahangama Pass
                  </Text>
                  <Title
                    style={{
                      marginTop: 0,
                      marginBottom: 18,
                      color: "#201E1B",
                      fontFamily:
                        '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                      fontSize: "clamp(42px, 5vw, 64px)",
                      lineHeight: 0.96,
                      fontWeight: 500,
                    }}
                  >
                    What it is, how it works, and why it saves more than it
                    costs.
                  </Title>
                  <Paragraph
                    style={{
                      maxWidth: 560,
                      color: "#49443D",
                      fontSize: 18,
                      lineHeight: 1.7,
                      marginBottom: 22,
                    }}
                  >
                    The Ahangama Pass is a wallet-ready local access pass for
                    travelers who want a better version of Ahangama: verified
                    perks, easier venue access, trusted recommendations, and
                    selected extras that make a stay feel more curated from day
                    one.
                  </Paragraph>

                  <Space wrap size={12} style={{ marginBottom: 22 }}>
                    <img
                      src={ahangamaPassLogo}
                      alt="Ahangama Pass"
                      style={{ display: "block", height: 52, width: "auto" }}
                    />
                    <img
                      src={addToAppleWalletLogo}
                      alt="Add to Apple Wallet"
                      style={{ display: "block", height: 40, width: "auto" }}
                    />
                    <img
                      src={addToGoogleWalletLogo}
                      alt="Add to Google Wallet"
                      style={{ display: "block", height: 40, width: "auto" }}
                    />
                  </Space>

                  <Space wrap size={12}>
                    <Button
                      type="primary"
                      size="large"
                      href={passCtaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        trackPassCtaClick({
                          ctaLocation: "what_is_ahangama_pass_hero",
                          destinationUrl: passCtaUrl,
                        });
                      }}
                    >
                      Get The Pass
                    </Button>
                    <Button
                      size="large"
                      href="/offers"
                      icon={<ArrowRightOutlined />}
                    >
                      See Partner Offers
                    </Button>
                  </Space>
                </div>
              </Col>
            </Row>
          </section>

          <section style={{ marginTop: 28 }}>
            <Row gutter={[20, 20]}>
              <Col xs={24} lg={15}>
                <Card
                  style={{
                    borderRadius: 24,
                    border: "1px solid rgba(32,30,27,0.08)",
                    background: "rgba(251,248,242,0.96)",
                  }}
                  bodyStyle={{ padding: 28 }}
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
                    What is it for?
                  </Text>
                  <Title level={2} style={{ marginTop: 0, color: "#201E1B" }}>
                    A simple way to unlock Ahangama properly.
                  </Title>
                  <Paragraph
                    style={{ color: "#49443D", fontSize: 17, lineHeight: 1.75 }}
                  >
                    Instead of saving screenshots, forwarding links, and trying
                    to remember where the good places are, the pass gives you
                    one practical system: keep the pass on your phone, show it
                    when needed, and use it as a shortcut to the cafes, stays,
                    wellness venues, and experiences that are already curated
                    into the Ahangama ecosystem.
                  </Paragraph>
                  <Paragraph
                    style={{
                      color: "#49443D",
                      fontSize: 17,
                      lineHeight: 1.75,
                      marginBottom: 0,
                    }}
                  >
                    It works especially well for people staying more than a few
                    days, remote workers doing a week or two, couples building
                    an itinerary, and first-time visitors who want the local
                    version of Ahangama rather than the generic tourist version.
                  </Paragraph>

                  <Divider />

                  <Space
                    direction="vertical"
                    size={16}
                    style={{ width: "100%" }}
                  >
                    {waysToUseIt.map((item) => (
                      <div
                        key={item}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 12,
                        }}
                      >
                        <CheckCircleOutlined
                          style={{
                            color: "#B08E62",
                            fontSize: 18,
                            marginTop: 3,
                          }}
                        />
                        <Text
                          style={{
                            color: "#3F3A34",
                            fontSize: 16,
                            lineHeight: 1.7,
                          }}
                        >
                          {item}
                        </Text>
                      </div>
                    ))}
                  </Space>
                </Card>
              </Col>

              <Col xs={24} lg={9}>
                <Card
                  style={{
                    borderRadius: 24,
                    border: "1px solid rgba(32,30,27,0.08)",
                    background:
                      "linear-gradient(180deg, rgba(245,239,230,0.98) 0%, rgba(239,232,220,0.98) 100%)",
                    height: "100%",
                  }}
                  bodyStyle={{ padding: 28 }}
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
                    Wallet ready
                  </Text>
                  <Title level={3} style={{ marginTop: 0, color: "#201E1B" }}>
                    Keep it where you already keep tickets and boarding passes.
                  </Title>
                  <Paragraph
                    style={{ color: "#49443D", fontSize: 16, lineHeight: 1.7 }}
                  >
                    The pass is designed to live in Apple Wallet or Google
                    Wallet so it is fast to open, easy to show, and hard to lose
                    in a crowded inbox or a long WhatsApp thread.
                  </Paragraph>
                  <Space
                    direction="vertical"
                    size={12}
                    style={{ width: "100%" }}
                  >
                    <img
                      src={addToAppleWalletLogo}
                      alt="Add to Apple Wallet"
                      style={{ display: "block", height: 42, width: "auto" }}
                    />
                    <img
                      src={addToGoogleWalletLogo}
                      alt="Add to Google Wallet"
                      style={{ display: "block", height: 42, width: "auto" }}
                    />
                  </Space>
                </Card>
              </Col>
            </Row>
          </section>

          <section style={{ marginTop: 28 }}>
            <Card
              style={{
                borderRadius: 24,
                border: "1px solid rgba(32,30,27,0.08)",
                background: "rgba(251,248,242,0.96)",
              }}
              bodyStyle={{ padding: 28 }}
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
                Example uses
              </Text>
              <Title level={2} style={{ marginTop: 0, color: "#201E1B" }}>
                Three ways the pass becomes useful very quickly.
              </Title>

              <Row gutter={[18, 18]}>
                {exampleMoments.map((item) => (
                  <Col xs={24} md={8} key={item.title}>
                    <Card
                      style={{
                        height: "100%",
                        borderRadius: 20,
                        border: "1px solid rgba(32,30,27,0.08)",
                        background: "#fffdf9",
                      }}
                      bodyStyle={{ padding: 22 }}
                    >
                      <Title
                        level={4}
                        style={{ marginTop: 0, color: "#201E1B" }}
                      >
                        {item.title}
                      </Title>
                      <Paragraph
                        style={{
                          marginBottom: 0,
                          color: "#514A43",
                          lineHeight: 1.7,
                        }}
                      >
                        {item.body}
                      </Paragraph>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          </section>

          <section style={{ marginTop: 28 }}>
            <Row gutter={[20, 20]}>
              <Col xs={24} lg={10}>
                <Card
                  style={{
                    borderRadius: 24,
                    border: "1px solid rgba(32,30,27,0.08)",
                    background:
                      "linear-gradient(180deg, rgba(238,230,219,0.98) 0%, rgba(248,244,236,0.98) 100%)",
                    height: "100%",
                  }}
                  bodyStyle={{ padding: 28 }}
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
                    Savings & extras
                  </Text>
                  <Title level={2} style={{ marginTop: 0, color: "#201E1B" }}>
                    The value is not just the discount line.
                  </Title>
                  <Title
                    style={{
                      marginTop: 10,
                      marginBottom: 6,
                      color: "#201E1B",
                      fontSize: 42,
                      lineHeight: 1,
                      fontFamily:
                        '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                    }}
                  >
                    LKR 11,500
                  </Title>
                  <Paragraph
                    style={{
                      color: "#5B544C",
                      marginBottom: 0,
                      lineHeight: 1.7,
                    }}
                  >
                    In one selected stay example, the free extras alone add up
                    to LKR 11,500: five postcards valued at LKR 700 each and two
                    tea tins valued at LKR 4,000 each.
                  </Paragraph>
                </Card>
              </Col>
              <Col xs={24} lg={14}>
                <Card
                  style={{
                    borderRadius: 24,
                    border: "1px solid rgba(32,30,27,0.08)",
                    background: "rgba(251,248,242,0.96)",
                    height: "100%",
                  }}
                  bodyStyle={{ padding: 28 }}
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
                    What that can look like
                  </Text>
                  <Space
                    direction="vertical"
                    size={16}
                    style={{ width: "100%" }}
                  >
                    {savingsExamples.map((item) => (
                      <div
                        key={item}
                        style={{
                          padding: "14px 16px",
                          borderRadius: 18,
                          border: "1px solid rgba(32,30,27,0.08)",
                          background: "#fffdf9",
                        }}
                      >
                        <Text
                          style={{
                            color: "#3F3A34",
                            fontSize: 16,
                            lineHeight: 1.65,
                          }}
                        >
                          {item}
                        </Text>
                      </div>
                    ))}
                  </Space>
                </Card>
              </Col>
            </Row>
          </section>
        </div>
      </div>
    </SiteLayout>
  );
}
