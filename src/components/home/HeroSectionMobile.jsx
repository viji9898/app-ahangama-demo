import React from "react";
import { Typography } from "antd";
import { trackPassCtaClick } from "../../analytics";
import { ArrowRightOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

export default function HeroSectionMobile() {
  return (
    <div
      className="ahg-hero"
      style={{
        marginBottom: 0,
        padding: "24px 0 4px",
      }}
    >
      <div className="ahg-heroInner" style={{ padding: "0 4px" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 16,
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
                letterSpacing: 1.4,
                textTransform: "uppercase",
              }}
            >
              {item}
            </Text>
          ))}
        </div>

        <Text
          style={{
            display: "block",
            marginBottom: 12,
            color: "#B08E62",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1.6,
            textTransform: "uppercase",
          }}
        >
          Cover Story
        </Text>

        <Title
          className="ahg-h1"
          style={{
            fontSize: "42px",
            lineHeight: 0.96,
            marginBottom: "16px",
            color: "#201E1B",
            fontWeight: 500,
            letterSpacing: -1,
            fontFamily:
              '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
          }}
        >
          The Ahangama Guide
        </Title>

        <Paragraph
          className="ahg-sub"
          style={{
            fontSize: "16px",
            lineHeight: 1.7,
            marginBottom: "18px",
            color: "#49443D",
          }}
        >
          A curated guide to cafes, stays, wellness, surf, food and local
          experiences across Ahangama. Written and updated by a local team who
          live here.
        </Paragraph>

        <div
          style={{
            marginBottom: 22,
            paddingTop: 16,
            borderTop: "1px solid rgba(32,30,27,0.08)",
          }}
        >
          <Text
            style={{
              display: "block",
              marginBottom: 10,
              color: "#B08E62",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1.6,
              textTransform: "uppercase",
            }}
          >
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
            Ahangama has transformed from a quiet surf town into one of Sri
            Lanka&apos;s most interesting destinations. This guide exists to
            help visitors discover the places, people and experiences that make
            it special.
          </Paragraph>
        </div>

        <div style={{ display: "grid", gap: 18 }}>
          <div>
            <Text
              style={{
                display: "block",
                marginBottom: 10,
                color: "#B08E62",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.6,
                textTransform: "uppercase",
              }}
            >
              Member Benefits
            </Text>
            <a
              href="https://pass.ahangama.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackPassCtaClick({
                  ctaLocation: "hero_text_link_mobile",
                  destinationUrl: "https://pass.ahangama.com",
                });
              }}
              style={{
                color: "#8B7B63",
                textDecoration: "none",
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              Get the Ahangama Pass <ArrowRightOutlined />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
