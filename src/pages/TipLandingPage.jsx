import React from "react";
import { Button, Card, Typography } from "antd";
import {
  ArrowRightOutlined,
  CheckOutlined,
  MailOutlined,
  MessageOutlined,
  CompassOutlined,
} from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";

const { Paragraph, Text, Title } = Typography;

export const TIP_LANDING_PATH = "/tip";

const TIP_PAGE_CONTENT = {
  seo: {
    title: "Tourism Intelligence Platform | Ahangama.com",
    description:
      "Ahangama.com helps local businesses reach visitors through personalised recommendations, curated guides, and monthly visitor intelligence.",
  },
  hero: {
    headline: "Tourism Intelligence Platform",
    tagline:
      "We directly connect with over 5,000 visitors a month in Ahangama.",
    subtext:
      "Ahangama.com helps local businesses reach visitors through personalised email and WhatsApp recommendations, curated guides, and monthly visitor intelligence.",
    primaryCta: "Become a Founding Partner",
    secondaryCta: "Test the Experience",
  },
  recommendations: {
    headline: "We recommend you directly to visitors",
    copy:
      "Your business can be featured in personalised recommendations sent to travellers by email and WhatsApp during their stay.",
    cards: [
      {
        title: "Email recommendations",
        copy: "Featured in arrival, stay, and interest-led visitor emails.",
        Icon: MailOutlined,
      },
      {
        title: "WhatsApp recommendations",
        copy: "Suggested at the moment visitors are choosing where to go.",
        Icon: MessageOutlined,
      },
      {
        title: "Guide & map visibility",
        copy: "Placed inside curated Ahangama guides and visitor maps.",
        Icon: CompassOutlined,
      },
    ],
  },
  test: {
    headline: "Test the experience",
    copy: "See how your business could appear in a guest recommendation.",
    samples: [
      {
        label: "Sample email recommendation",
        title: "A considered place for tomorrow morning",
        copy: "Based on your interest in quiet cafes and coastal mornings, we think this is worth saving before your next surf check.",
        cta: "Send me a sample email",
      },
      {
        label: "Sample WhatsApp message",
        title: "A quick local suggestion",
        copy: "You are close by. This spot is a strong choice for lunch, coffee, or a late-afternoon stop today.",
        cta: "Send me a sample WhatsApp",
      },
    ],
  },
  pricing: {
    headline: "Founding Partner Programme",
    name: "Founding Partner",
    price: "USD $150 / month",
    term: "12-month partnership",
    scarcity: "Limited to first 50 businesses",
    standardPrice: "Standard price: USD $300 / month",
    benefits: [
      "Featured business profile",
      "Inclusion in Ahangama Guide 2026/27",
      "Email recommendations",
      "WhatsApp recommendations",
      "Priority placement",
      "Monthly visitor intelligence report",
      "Editorial and event promotion",
    ],
    cta: "Apply to become a Founding Partner",
  },
  finalCta: {
    headline: "Become one of Ahangama's first founding partners.",
    copy: "Join the businesses shaping the future of visitor discovery in Ahangama.",
    cta: "Contact Ahangama.com",
  },
};

function scrollToSection(id) {
  const element = document.getElementById(id);

  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function Section({ id, children, style }) {
  return (
    <section
      id={id}
      style={{
        padding: "clamp(56px, 11vw, 128px) 0",
        ...style,
      }}
    >
      {children}
    </section>
  );
}

function SectionHeader({ headline, copy, align = "left" }) {
  return (
    <div
      style={{
        maxWidth: 680,
        margin: align === "center" ? "0 auto 34px" : "0 0 34px",
        textAlign: align,
      }}
    >
      <Title
        level={2}
        style={{
          margin: 0,
          color: "#111111",
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "clamp(32px, 7vw, 68px)",
          lineHeight: 0.98,
          fontWeight: 500,
          letterSpacing: 0,
        }}
      >
        {headline}
      </Title>
      {copy ? (
        <Paragraph
          style={{
            margin: "18px 0 0",
            color: "#55524d",
            fontSize: "clamp(16px, 2vw, 19px)",
            lineHeight: 1.7,
          }}
        >
          {copy}
        </Paragraph>
      ) : null}
    </div>
  );
}

function PrimaryButton({ children, onClick }) {
  return (
    <Button
      type="primary"
      size="large"
      icon={<ArrowRightOutlined />}
      iconPosition="end"
      onClick={onClick}
      style={{
        minHeight: 48,
        borderRadius: 999,
        paddingInline: 24,
        background: "#111111",
        borderColor: "#111111",
        fontWeight: 700,
      }}
    >
      {children}
    </Button>
  );
}

function SecondaryButton({ children, onClick }) {
  return (
    <Button
      size="large"
      onClick={onClick}
      style={{
        minHeight: 48,
        borderRadius: 999,
        paddingInline: 24,
        borderColor: "#d9d4cc",
        color: "#111111",
        fontWeight: 700,
      }}
    >
      {children}
    </Button>
  );
}

function RecommendationCard({ card }) {
  const Icon = card.Icon;

  return (
    <Card
      bordered={false}
      style={{
        height: "100%",
        borderRadius: 8,
        background: "#faf9f6",
        border: "1px solid #ece7df",
        boxShadow: "none",
      }}
      styles={{ body: { padding: 24 } }}
    >
      <Icon style={{ color: "#111111", fontSize: 22, marginBottom: 34 }} />
      <Title level={3} style={{ margin: 0, fontSize: 22, lineHeight: 1.15 }}>
        {card.title}
      </Title>
      <Paragraph style={{ margin: "12px 0 0", color: "#5f5a52", lineHeight: 1.65 }}>
        {card.copy}
      </Paragraph>
    </Card>
  );
}

function SampleCard({ sample }) {
  return (
    <Card
      bordered={false}
      style={{
        height: "100%",
        borderRadius: 8,
        background: "#ffffff",
        border: "1px solid #ebe6de",
        boxShadow: "0 18px 44px rgba(35, 32, 28, 0.06)",
      }}
      styles={{ body: { padding: 26 } }}
    >
      <Text
        style={{
          display: "block",
          marginBottom: 18,
          color: "#8b8277",
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: 1.4,
          textTransform: "uppercase",
        }}
      >
        {sample.label}
      </Text>
      <Title level={3} style={{ margin: 0, fontSize: 24, lineHeight: 1.12 }}>
        {sample.title}
      </Title>
      <Paragraph style={{ margin: "16px 0 24px", color: "#55524d", lineHeight: 1.7 }}>
        {sample.copy}
      </Paragraph>
      <SecondaryButton>{sample.cta}</SecondaryButton>
    </Card>
  );
}

export default function TipLandingPage() {
  const content = TIP_PAGE_CONTENT;

  return (
    <SiteLayout>
      <Seo
        title={content.seo.title}
        description={content.seo.description}
        canonical={absUrl(TIP_LANDING_PATH)}
      />

      <main style={{ background: "#ffffff", color: "#111111" }}>
        <div
          style={{
            width: "min(100% - 32px, 1120px)",
            margin: "0 auto",
          }}
        >
          <Section
            style={{
              minHeight: "min(780px, calc(100vh - 96px))",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div style={{ maxWidth: 900 }}>
              <Text
                style={{
                  display: "block",
                  marginBottom: 28,
                  color: "#8b8277",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: 1.8,
                  textTransform: "uppercase",
                }}
              >
                Ahangama.com for Business
              </Text>
              <Title
                style={{
                  margin: 0,
                  color: "#111111",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "clamp(52px, 13vw, 118px)",
                  lineHeight: 0.9,
                  fontWeight: 500,
                  letterSpacing: 0,
                  maxWidth: 980,
                }}
              >
                {content.hero.headline}
              </Title>
              <Paragraph
                style={{
                  margin: "28px 0 0",
                  maxWidth: 720,
                  color: "#111111",
                  fontSize: "clamp(22px, 4.6vw, 38px)",
                  lineHeight: 1.12,
                  fontWeight: 500,
                }}
              >
                {content.hero.tagline}
              </Paragraph>
              <Paragraph
                style={{
                  margin: "24px 0 0",
                  maxWidth: 690,
                  color: "#5f5a52",
                  fontSize: "clamp(16px, 2vw, 20px)",
                  lineHeight: 1.7,
                }}
              >
                {content.hero.subtext}
              </Paragraph>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 34 }}>
                <PrimaryButton onClick={() => scrollToSection("pricing")}>
                  {content.hero.primaryCta}
                </PrimaryButton>
                <SecondaryButton onClick={() => scrollToSection("test")}> 
                  {content.hero.secondaryCta}
                </SecondaryButton>
              </div>
            </div>
          </Section>

          <Section>
            <SectionHeader
              headline={content.recommendations.headline}
              copy={content.recommendations.copy}
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 14,
              }}
            >
              {content.recommendations.cards.map((card) => (
                <RecommendationCard key={card.title} card={card} />
              ))}
            </div>
          </Section>

          <Section id="test">
            <SectionHeader
              headline={content.test.headline}
              copy={content.test.copy}
              align="center"
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 16,
              }}
            >
              {content.test.samples.map((sample) => (
                <SampleCard key={sample.label} sample={sample} />
              ))}
            </div>
          </Section>

          <Section id="pricing">
            <SectionHeader headline={content.pricing.headline} align="center" />
            <Card
              bordered={false}
              style={{
                maxWidth: 680,
                margin: "0 auto",
                borderRadius: 8,
                background: "#111111",
                color: "#ffffff",
                boxShadow: "0 26px 70px rgba(17, 17, 17, 0.16)",
              }}
              styles={{ body: { padding: "clamp(28px, 6vw, 54px)" } }}
            >
              <Text style={{ color: "#cfc8bd", fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase" }}>
                {content.pricing.name}
              </Text>
              <Title
                level={3}
                style={{
                  margin: "18px 0 6px",
                  color: "#ffffff",
                  fontSize: "clamp(36px, 8vw, 62px)",
                  lineHeight: 1,
                }}
              >
                {content.pricing.price}
              </Title>
              <Paragraph style={{ margin: 0, color: "#cfc8bd", fontSize: 17 }}>
                {content.pricing.term}
              </Paragraph>
              <Paragraph style={{ margin: "8px 0 0", color: "#ffffff", fontSize: 17 }}>
                {content.pricing.scarcity}
              </Paragraph>
              <Paragraph
                style={{
                  margin: "20px 0 0",
                  color: "#b8afa3",
                  fontSize: 16,
                  textDecoration: "line-through",
                }}
              >
                {content.pricing.standardPrice}
              </Paragraph>
              <div style={{ display: "grid", gap: 12, marginTop: 34 }}>
                {content.pricing.benefits.map((benefit) => (
                  <div key={benefit} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <CheckOutlined style={{ color: "#ffffff", marginTop: 4 }} />
                    <Text style={{ color: "#ffffff", fontSize: 16 }}>{benefit}</Text>
                  </div>
                ))}
              </div>
              <Button
                size="large"
                icon={<ArrowRightOutlined />}
                iconPosition="end"
                style={{
                  minHeight: 50,
                  borderRadius: 999,
                  paddingInline: 24,
                  marginTop: 38,
                  background: "#ffffff",
                  color: "#111111",
                  borderColor: "#ffffff",
                  fontWeight: 800,
                }}
              >
                {content.pricing.cta}
              </Button>
            </Card>
          </Section>

          <Section style={{ textAlign: "center", paddingBottom: "clamp(72px, 12vw, 150px)" }}>
            <SectionHeader
              headline={content.finalCta.headline}
              copy={content.finalCta.copy}
              align="center"
            />
            <PrimaryButton>{content.finalCta.cta}</PrimaryButton>
          </Section>
        </div>
      </main>
    </SiteLayout>
  );
}