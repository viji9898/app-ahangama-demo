import React from "react";
import { EnvironmentOutlined, InstagramOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import SiteLayout from "../components/layout/SiteLayout";
import { NEWSLETTER_DATA } from "../data/newsletterData";

const { Paragraph, Text, Title } = Typography;

const NEWSLETTER_DATA_PATH = "/newsletter-data";

const SERIF_FONT = '"Cormorant Garamond", "Libre Baskerville", Georgia, serif';

function buildInstagramUrl(handle) {
  if (!handle) return null;

  return `https://www.instagram.com/${String(handle).replace(/^@/, "")}/`;
}

function Coordinates({ latitude, longitude }) {
  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return <span>Coordinates pending</span>;
  }

  return (
    <span>
      {latitude.toFixed(6)}, {longitude.toFixed(6)}
    </span>
  );
}

function NewsletterDataCard({ item, index }) {
  const instagramUrl = buildInstagramUrl(item.instagram);

  return (
    <article
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 18,
        minHeight: 310,
        padding: 22,
        border: "1px solid rgba(31,29,26,0.1)",
        borderRadius: 8,
        background: "#fffdf9",
        boxShadow: "0 18px 36px rgba(31,29,26,0.06)",
      }}
    >
      <div>
        <Text
          style={{
            display: "block",
            marginBottom: 12,
            color: "#9d7f57",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1.6,
            textTransform: "uppercase",
          }}
        >
          {String(index + 1).padStart(2, "0")} / {item.category}
        </Text>
        <Title
          level={2}
          style={{
            margin: 0,
            color: "#1f1d1a",
            fontFamily: SERIF_FONT,
            fontSize: "clamp(30px, 3.4vw, 48px)",
            fontWeight: 500,
            lineHeight: 0.98,
          }}
        >
          {item.vendor}
        </Title>
        <Paragraph
          style={{
            margin: "12px 0 0",
            color: "#55514b",
            fontSize: 16,
            lineHeight: 1.6,
          }}
        >
          {item.tagline}
        </Paragraph>
      </div>

      <div
        style={{
          display: "grid",
          gap: 10,
          marginTop: "auto",
          color: "#4d4740",
          fontSize: 14,
          lineHeight: 1.45,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <InstagramOutlined />
          {instagramUrl ? (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1f1d1a", textDecoration: "none" }}
            >
              @{item.instagram}
            </a>
          ) : (
            <span>Instagram pending</span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <EnvironmentOutlined />
          <Coordinates latitude={item.latitude} longitude={item.longitude} />
        </div>
      </div>

      {item.venues?.length ? (
        <div
          style={{
            display: "grid",
            gap: 8,
            paddingTop: 14,
            borderTop: "1px solid rgba(31,29,26,0.1)",
          }}
        >
          {item.venues.map((venue) => {
            const venueInstagramUrl = buildInstagramUrl(venue.instagram);

            return (
              <div
                key={venue.vendor}
                style={{
                  display: "grid",
                  gap: 4,
                  color: "#5f574e",
                  fontSize: 13,
                }}
              >
                <strong style={{ color: "#1f1d1a" }}>{venue.vendor}</strong>
                {venueInstagramUrl ? (
                  <a
                    href={venueInstagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#1f1d1a", textDecoration: "none" }}
                  >
                    @{venue.instagram}
                  </a>
                ) : (
                  <span>Instagram pending</span>
                )}
                <Coordinates
                  latitude={venue.latitude}
                  longitude={venue.longitude}
                />
              </div>
            );
          })}
        </div>
      ) : null}

      <a
        href={item.googleUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 42,
          padding: "10px 14px",
          border: "1px solid rgba(31,29,26,0.16)",
          borderRadius: 999,
          color: "#1f1d1a",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 1.2,
          textDecoration: "none",
          textTransform: "uppercase",
        }}
      >
        Open Google Maps
      </a>
    </article>
  );
}

export default function NewsletterDataPage() {
  const canonical = absUrl(NEWSLETTER_DATA_PATH);
  const categories = [...new Set(NEWSLETTER_DATA.map((item) => item.category))];
  const completeCount = NEWSLETTER_DATA.filter(
    (item) => item.instagram && item.latitude && item.longitude,
  ).length;

  return (
    <SiteLayout>
      <Seo
        title="Newsletter Data | Ahangama"
        description="Newsletter vendor data for Ahangama recommendations, including taglines, categories, Instagram handles, coordinates and Google Maps links."
        canonical={canonical}
      />

      <main
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "clamp(32px, 5vw, 72px) 20px 96px",
        }}
      >
        <header
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.1fr) minmax(260px, 0.5fr)",
            gap: 28,
            alignItems: "end",
            marginBottom: 34,
            paddingBottom: 24,
            borderBottom: "2px solid #1f1d1a",
          }}
        >
          <div>
            <Text
              style={{
                display: "block",
                marginBottom: 14,
                color: "#9d7f57",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Newsletter Dataset
            </Text>
            <Title
              level={1}
              style={{
                margin: 0,
                color: "#1f1d1a",
                fontFamily: SERIF_FONT,
                fontSize: "clamp(48px, 8vw, 112px)",
                fontWeight: 500,
                lineHeight: 0.88,
              }}
            >
              Ahangama newsletter picks
            </Title>
          </div>
          <div
            style={{
              display: "grid",
              gap: 10,
              color: "#5f574e",
              fontSize: 15,
              lineHeight: 1.6,
            }}
          >
            <Paragraph style={{ margin: 0, color: "#5f574e" }}>
              {NEWSLETTER_DATA.length} vendor rows prepared for newsletter
              modules, editorial recommendations and map-backed local picks.
            </Paragraph>
            <Text style={{ color: "#1f1d1a", fontWeight: 700 }}>
              {completeCount} rows have Instagram and coordinates.
            </Text>
          </div>
        </header>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 28,
          }}
        >
          {categories.map((category) => (
            <span
              key={category}
              style={{
                padding: "8px 11px",
                border: "1px solid rgba(31,29,26,0.12)",
                borderRadius: 999,
                background: "#fffdf9",
                color: "#5f574e",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.2,
                textTransform: "uppercase",
              }}
            >
              {category}
            </span>
          ))}
        </div>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: 18,
          }}
        >
          {NEWSLETTER_DATA.map((item, index) => (
            <NewsletterDataCard
              key={`${item.vendor}-${item.category}`}
              item={item}
              index={index}
            />
          ))}
        </section>
      </main>
    </SiteLayout>
  );
}

export { NEWSLETTER_DATA_PATH };
