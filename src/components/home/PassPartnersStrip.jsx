import React, { useMemo } from "react";
import { Grid, Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { usePlaces } from "../../app/placesContext";
import { FULL_LIST_PATH, getPassPlaces } from "../../lib/passPartners";

const { Paragraph, Text, Title } = Typography;
const { useBreakpoint } = Grid;

const MAX_MOSAIC_LOGOS = 36;

const FEATURED_PERKS = [
  "Food & Drink",
  "Wellness",
  "Stays",
  "Surf",
  "Retail",
  "Experiences",
  "Accommodation Perks",
  "Free Extras",
];

const editorialCtaStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  color: "#2F3E3A",
  textDecoration: "none",
  fontSize: 15,
  fontWeight: 600,
  letterSpacing: "0.01em",
  whiteSpace: "nowrap",
};

function MosaicTile({ partner }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        minHeight: 44,
      }}
    >
      <img
        src={partner.logo}
        alt={`${partner.name} logo`}
        style={{
          width: 42,
          height: 42,
          objectFit: "contain",
          filter: "grayscale(1) contrast(0.9) opacity(0.82)",
        }}
      />
    </div>
  );
}

export default function PassPartnersStrip({ destinationSlug = "ahangama" }) {
  const { places: allPlaces } = usePlaces();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const passPlaces = useMemo(
    () => getPassPlaces(allPlaces, destinationSlug),
    [allPlaces, destinationSlug],
  );

  const mosaicPartners = useMemo(() => {
    return passPlaces.filter((place) => place.logo).slice(0, MAX_MOSAIC_LOGOS);
  }, [passPlaces]);

  if (!passPlaces.length) return null;

  return (
    <section
      style={{
        borderRadius: 30,
        border: "1px solid rgba(32,30,27,0.08)",
        background: "#FFFFFF",
        boxShadow: "0 10px 28px rgba(32,30,27,0.035)",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: isMobile ? 22 : 30 }}>
        <div
          style={{
            display: "flex",
            alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "space-between",
            gap: 18,
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <div style={{ maxWidth: 760 }}>
            <Text
              style={{
                display: "block",
                color: "#8F7753",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.8,
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Pass Partners
            </Text>
            <Title
              level={2}
              style={{
                margin: 0,
                color: "#1F1D1A",
                fontSize: isMobile ? 32 : 42,
                lineHeight: isMobile ? 1.08 : 1.04,
                fontFamily:
                  '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                letterSpacing: "-0.02em",
              }}
            >
              Ahangama Pass Partner Network
            </Title>
            <Paragraph
              style={{
                margin: "12px 0 0",
                color: "#645E57",
                fontSize: isMobile ? 14 : 16,
                lineHeight: 1.7,
                maxWidth: 680,
              }}
            >
              Enjoy perks across cafes, wellness spaces, stays, surf, retail and
              local experiences.
            </Paragraph>
            <Text
              style={{
                display: "block",
                marginTop: 12,
                color: "#7A6F63",
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              Trusted by 100+ local businesses across Ahangama.
            </Text>
          </div>

          <a href={FULL_LIST_PATH} style={editorialCtaStyle}>
            View all partners <ArrowRightOutlined />
          </a>
        </div>
      </div>

      <div style={{ padding: isMobile ? "0 20px 20px" : "0 30px 26px" }}>
        {mosaicPartners.length ? (
          <div
            style={{
              marginTop: 2,
              marginBottom: isMobile ? 18 : 18,
              padding: isMobile ? "2px 0 0" : "6px 0 0",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "repeat(6, minmax(0, 1fr))"
                  : "repeat(18, minmax(0, 1fr))",
                columnGap: isMobile ? 6 : 8,
                rowGap: isMobile ? 10 : 12,
                alignItems: "center",
              }}
            >
              {mosaicPartners.map((partner) => (
                <MosaicTile
                  key={partner.id || partner.slug || partner.name}
                  partner={partner}
                />
              ))}
            </div>
          </div>
        ) : null}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginTop: 8,
          }}
        >
          {FEATURED_PERKS.map((perk) => (
            <span
              key={perk}
              style={{
                display: "inline-flex",
                alignItems: "center",
                minHeight: 34,
                padding: "8px 16px",
                borderRadius: 999,
                border: "1px solid rgba(32,30,27,0.06)",
                background: "rgba(255,255,255,0.72)",
                color: "#5E584F",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.01em",
              }}
            >
              {perk}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
