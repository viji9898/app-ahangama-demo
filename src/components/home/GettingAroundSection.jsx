import React from "react";
import { Grid, Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

const { Paragraph, Text, Title } = Typography;
const { useBreakpoint } = Grid;

const GUIDE_PATH =
  "/blogs/getting-around-ahangama-scooters-tuk-tuks-airport-transfers";

const transportBlocks = [
  {
    title: "Scooter Rental",
    cost: "LKR 2,500-4,500/day",
    summary: "Most popular option.",
  },
  {
    title: "Tuk Tuks",
    cost: "LKR 500-1,500/ride",
    summary: "Best for short stays.",
  },
  {
    title: "Airport Transfer",
    cost: "LKR 15,000-20,000",
    summary: "Around 2.5-3 hours from Colombo Airport.",
  },
  {
    title: "Car Rental",
    cost: "LKR 12,000-20,000/day",
    summary: "Best for families and longer journeys.",
  },
];

const transportStats = [
  "2.5-3 Hours From Airport",
  "Most Popular: Scooter",
  "Typical Tuk Tuk Ride: LKR 500-1,500",
  "Updated Monthly",
];

export default function GettingAroundSection() {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  return (
    <section
      style={{
        borderRadius: 28,
        border: "1px solid rgba(47,62,58,0.06)",
        background:
          "linear-gradient(180deg, rgba(255,253,249,0.97) 0%, rgba(246,239,229,0.92) 100%)",
        boxShadow: "0 18px 36px rgba(47,62,58,0.04)",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: isMobile ? 22 : 34 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "minmax(0, 1fr)"
              : "minmax(0, 0.9fr) minmax(320px, 1.1fr)",
            gap: isMobile ? 20 : 36,
            alignItems: "start",
            paddingBottom: isMobile ? 22 : 26,
            borderBottom: "1px solid rgba(47,62,58,0.1)",
          }}
        >
          <div>
            <Text
              style={{
                display: "block",
                marginBottom: 12,
                color: "#8B5A3C",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.8,
                textTransform: "uppercase",
              }}
            >
              Getting Around / Guide Preview
            </Text>
            <Title
              level={2}
              style={{
                margin: 0,
                color: "#2F3E3A",
                fontSize: isMobile ? 32 : 44,
                lineHeight: isMobile ? 1.08 : 1.04,
                fontFamily:
                  '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                letterSpacing: "-0.02em",
                maxWidth: 520,
              }}
            >
              Getting Around Ahangama
            </Title>
            <Paragraph
              style={{
                margin: "14px 0 0",
                color: "#5B564E",
                fontSize: isMobile ? 14 : 16,
                lineHeight: 1.68,
                maxWidth: 420,
              }}
            >
              A practical guide to transport, pricing and local travel.
            </Paragraph>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "minmax(0, 1fr)"
                  : "repeat(2, minmax(0, 1fr))",
                gap: "10px 18px",
                marginTop: 22,
                maxWidth: 520,
              }}
            >
              {transportStats.map((item) => (
                <Text
                  key={item}
                  style={{
                    color: "#5B564E",
                    fontSize: 12,
                    lineHeight: 1.45,
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                  }}
                >
                  {item}
                </Text>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "minmax(0, 1fr)"
                : "repeat(2, minmax(0, 1fr))",
              gap: 0,
              borderTop: isMobile ? "1px solid rgba(47,62,58,0.1)" : "none",
            }}
          >
            {transportBlocks.map((item, index) => (
              <article
                key={item.title}
                style={{
                  padding: isMobile ? "16px 0" : "16px 0 18px",
                  borderTop:
                    !isMobile && index < 2
                      ? "1px solid rgba(47,62,58,0.1)"
                      : undefined,
                  borderBottom: "1px solid rgba(47,62,58,0.1)",
                  paddingRight: !isMobile && index % 2 === 0 ? 20 : 0,
                  paddingLeft: !isMobile && index % 2 === 1 ? 20 : 0,
                }}
              >
                <Text
                  style={{
                    display: "block",
                    marginBottom: 6,
                    color: "#8B5A3C",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1.6,
                    textTransform: "uppercase",
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    display: "block",
                    color: "#2F3E3A",
                    fontSize: isMobile ? 28 : 34,
                    lineHeight: 0.98,
                    fontWeight: 600,
                    fontFamily:
                      '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                    letterSpacing: "-0.02em",
                  }}
                >
                  {item.cost}
                </Text>
                <Text
                  style={{
                    display: "block",
                    marginTop: 8,
                    color: "#5B564E",
                    fontSize: 14,
                    lineHeight: 1.55,
                    maxWidth: 280,
                  }}
                >
                  {item.summary}
                </Text>
              </article>
            ))}
          </div>
        </div>

        <div
          style={{
            paddingTop: isMobile ? 22 : 26,
          }}
        >
          <Text
            style={{
              display: "block",
              marginBottom: 12,
              color: "#8B5A3C",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1.8,
              textTransform: "uppercase",
            }}
          >
            Local Insight
          </Text>
          <Paragraph
            style={{
              margin: 0,
              color: "#2F3E3A",
              fontSize: isMobile ? 22 : 31,
              lineHeight: isMobile ? 1.18 : 1.12,
              fontFamily:
                '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
              letterSpacing: "-0.018em",
              maxWidth: 880,
            }}
          >
            "Most visitors staying longer than three days rent scooters. If
            you're only here for a day or two, tuk tuks are usually enough."
          </Paragraph>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "minmax(0, 1fr)"
                : "minmax(0, 1fr) auto auto",
              gap: isMobile ? 14 : 20,
              alignItems: "end",
              marginTop: 22,
              paddingTop: 18,
              borderTop: "1px solid rgba(47,62,58,0.1)",
            }}
          >
            <Text
              style={{
                color: "#5B564E",
                fontSize: 14,
                lineHeight: 1.6,
                maxWidth: 540,
              }}
            >
              Transport providers, airport transfers, local tips, scooter
              rentals and practical travel advice.
            </Text>
            <a
              href="https://wa.me/94777908790?text=Hi%2C%20I%20need%20help%20booking%20transport%20in%20Ahangama."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                color: "#5B564E",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.01em",
                textTransform: "uppercase",
                whiteSpace: isMobile ? "normal" : "nowrap",
              }}
            >
              Book via WhatsApp <ArrowRightOutlined />
            </a>
            <a
              href={GUIDE_PATH}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                color: "#2F3E3A",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.01em",
                textTransform: "uppercase",
                whiteSpace: isMobile ? "normal" : "nowrap",
              }}
            >
              View Full Guide <ArrowRightOutlined />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
