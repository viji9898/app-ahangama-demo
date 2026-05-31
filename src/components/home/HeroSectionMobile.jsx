import React from "react";
import { Typography, Spin } from "antd";
import { usePlaces } from "../../app/placesContext";
import { trackPassCtaClick } from "../../analytics";
import ahangamaPassLogo from "../../assets/ahangama-pass-logo.png";

const { Title, Paragraph, Text } = Typography;

export default function HeroSectionMobile({ heroImage }) {
  const { places, loading } = usePlaces();

  return (
    <div className="ahg-hero" style={{ marginBottom: 0 }}>
      {/* Hero Image */}
      {heroImage && (
        <div
          style={{
            marginBottom: "20px",
            borderRadius: "22px",
            overflow: "hidden",
            boxShadow: "0 16px 32px rgba(32, 30, 27, 0.08)",
          }}
        >
          <img
            src={heroImage}
            alt="Ahangama"
            style={{
              width: "100%",
              height: "240px",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      )}

      <div className="ahg-heroInner" style={{ padding: "0 4px" }}>
        <Text
          style={{
            display: "block",
            marginBottom: 16,
            color: "#B08E62",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          The Ahangama Guide
        </Text>

        <Title
          className="ahg-h1"
          style={{
            fontSize: "40px",
            lineHeight: 0.95,
            marginBottom: "16px",
            textAlign: "center",
            color: "#201E1B",
            fontWeight: 500,
            letterSpacing: -1.2,
            fontFamily:
              '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
          }}
        >
          <span style={{ whiteSpace: "nowrap" }}>Your guide to</span>
          <br />
          <span style={{ whiteSpace: "nowrap" }}>Ahangama</span>
        </Title>

        <Paragraph
          className="ahg-sub"
          style={{
            fontSize: "16px",
            lineHeight: 1.6,
            marginBottom: "20px",
            textAlign: "center",
            color: "#49443D",
          }}
        >
          Local recommendations, hidden gems and editorial picks to help you
          eat well, stay well, surf more and experience the best of Ahangama.
        </Paragraph>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <a
            href="https://pass.ahangama.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackPassCtaClick({
                ctaLocation: "hero_logo_mobile",
                destinationUrl: "https://pass.ahangama.com",
              });
            }}
            style={{ display: "inline-flex", alignItems: "center" }}
          >
            <img
              src={ahangamaPassLogo}
              alt="Ahangama Pass"
              style={{
                display: "block",
                height: "48px",
                width: "auto",
              }}
            />
          </a>
        </div>

        <div
          className="ahg-metrics"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            marginTop: "12px",
            marginBottom: "8px",
            flexWrap: "wrap",
          }}
        >
          <div className="ahg-metric" style={{ textAlign: "center" }}>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Partners{" "}
            </Text>
            <div
              className="ahg-metricVal"
              style={{ fontSize: "20px", fontWeight: "700" }}
            >
              {loading ? (
                <Spin size="small" />
              ) : (
                places.filter((p) => p.destinationSlug === "ahangama").length
              )}
            </div>
          </div>
          <div className="ahg-metric" style={{ textAlign: "center" }}>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Card
            </Text>
            <div
              className="ahg-metricVal"
              style={{ fontSize: "20px", fontWeight: "700" }}
            >
              From $30
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
