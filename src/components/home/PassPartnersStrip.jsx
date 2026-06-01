import React, { useMemo, useState } from "react";
import { Button, Grid, Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { usePlaces } from "../../app/placesContext";
import { trackPassCtaClick } from "../../analytics";
import { buildPassCtaUrl } from "../../lib/passAttribution";
import { FULL_LIST_PATH, getPassPlaces } from "../../lib/passPartners";

const { Paragraph, Text, Title } = Typography;
const { useBreakpoint } = Grid;

const SUGGESTED_PARTNER_ORDER = [
  "Abrazo Ahangama",
  "Citra",
  "Lighthouse Ahangama",
  "Hakuna Matata",
  "Pura Pilates",
  "Frosty's",
  "Kaffi",
  "Samba",
  "Senses",
  "Coconut Court",
  "GIK Bike Rentals",
  "Rollingpin Bakery",
];

const FEATURED_PERKS = [
  "10% off food & drinks",
  "Free dessert",
  "Free drink",
  "Scooter rental perks",
  "Wellness discounts",
];

const TRUST_METADATA = [
  "100+ Local Perks",
  "Cafes · Wellness · Stays · Surf · Retail",
  "Updated Monthly",
];

function normalizeName(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function LogoTile({ partner, isMobile }) {
  return (
    <div
      style={{
        flex: "0 0 auto",
        minWidth: isMobile ? 112 : 132,
        height: isMobile ? 76 : 84,
        padding: isMobile ? "14px 16px" : "16px 20px",
        borderRadius: 18,
        border: "1px solid rgba(47,62,58,0.08)",
        background: "rgba(255,252,246,0.92)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {partner.logo ? (
        <img
          src={partner.logo}
          alt={`${partner.name} logo`}
          style={{
            maxWidth: "100%",
            maxHeight: isMobile ? 34 : 40,
            width: "auto",
            height: "auto",
            objectFit: "contain",
            filter: "grayscale(1) contrast(0.92) opacity(0.8)",
          }}
        />
      ) : (
        <Text
          style={{
            color: "#556057",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.1,
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          {partner.name}
        </Text>
      )}
    </div>
  );
}

export default function PassPartnersStrip({ destinationSlug = "ahangama" }) {
  const { places: allPlaces } = usePlaces();
  const passCtaUrl = buildPassCtaUrl();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [isPaused, setIsPaused] = useState(false);

  const passPlaces = useMemo(
    () => getPassPlaces(allPlaces, destinationSlug),
    [allPlaces, destinationSlug],
  );

  const marqueePartners = useMemo(() => {
    const byName = new Map(
      passPlaces.map((place) => [normalizeName(place.name), place]),
    );

    const selected = SUGGESTED_PARTNER_ORDER.map((name) =>
      byName.get(normalizeName(name)),
    ).filter(Boolean);

    const fallbacks = passPlaces.filter(
      (place) =>
        place.logo &&
        !selected.some(
          (selectedPlace) =>
            normalizeName(selectedPlace.name) === normalizeName(place.name),
        ),
    );

    return [...selected, ...fallbacks].filter((place) => place.logo).slice(0, 12);
  }, [passPlaces]);

  const marqueeLoop = useMemo(
    () => [...marqueePartners, ...marqueePartners],
    [marqueePartners],
  );

  if (!marqueePartners.length) return null;

  return (
    <section
      style={{
        borderRadius: 28,
        border: "1px solid rgba(32,30,27,0.08)",
        background:
          "linear-gradient(180deg, rgba(252,249,244,0.98) 0%, rgba(247,242,235,0.98) 100%)",
        boxShadow: "0 18px 40px rgba(32,30,27,0.04)",
        overflow: "hidden",
      }}
    >
      <style>
        {`
          @keyframes passPartnersMarquee {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-50%, 0, 0); }
          }
        `}
      </style>

      <div style={{ padding: isMobile ? 22 : 30 }}>
        <div
          style={{
            display: "grid",
            gap: isMobile ? 18 : 20,
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
              Enjoy perks across cafes, wellness spaces, stays, surf, retail
              and local experiences.
            </Paragraph>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "minmax(0, 1fr)"
                : "repeat(3, minmax(0, 1fr))",
              gap: "10px 18px",
              paddingTop: isMobile ? 6 : 2,
            }}
          >
            {TRUST_METADATA.map((item) => (
              <Text
                key={item}
                style={{
                  color: "#756D63",
                  fontSize: 12,
                  lineHeight: 1.55,
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                }}
              >
                {item}
              </Text>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: isMobile ? "0 20px 20px" : "0 30px 26px" }}>
        <div
          style={{
            borderRadius: 24,
            border: "1px solid rgba(32,30,27,0.08)",
            background: "rgba(255,252,246,0.88)",
            overflow: "hidden",
            padding: isMobile ? "14px 0" : "16px 0",
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 12 : 14,
              width: "max-content",
              animation: "passPartnersMarquee 30s linear infinite",
              animationPlayState: isPaused ? "paused" : "running",
              paddingLeft: isMobile ? 12 : 16,
            }}
          >
            {marqueeLoop.map((place, index) => (
              <LogoTile
                key={`${place.id || place.slug || place.name}-${index}`}
                partner={place}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: 18,
            marginTop: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            {FEATURED_PERKS.map((perk) => (
              <span
                key={perk}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  minHeight: 36,
                  padding: "8px 14px",
                  borderRadius: 999,
                  border: "1px solid rgba(32,30,27,0.08)",
                  background: "rgba(255,252,246,0.9)",
                  color: "#5E584F",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                }}
              >
                {perk}
              </span>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "stretch" : "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: 10,
              }}
            >
                <Button
                  type="primary"
                  href={FULL_LIST_PATH}
                  icon={<ArrowRightOutlined />}
                  style={{
                    borderRadius: 999,
                    height: 44,
                    paddingInline: 18,
                    background: "#2F3E3A",
                    borderColor: "#2F3E3A",
                    color: "#FFFFFF",
                    boxShadow: "none",
                    width: isMobile ? "100%" : "auto",
                  }}
                >
                  View Full Partner List
                </Button>

                <Button
                  href={passCtaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackPassCtaClick({
                      ctaLocation: "pass_partners_strip",
                      destinationUrl: passCtaUrl,
                    });
                  }}
                  style={{
                    borderRadius: 999,
                    height: 44,
                    paddingInline: 18,
                    borderColor: "rgba(47,62,58,0.14)",
                    background: "rgba(255,255,255,0.76)",
                    color: "#2F3E3A",
                    boxShadow: "none",
                    width: isMobile ? "100%" : "auto",
                    fontWeight: 600,
                  }}
                >
                  Get The Ahangama Pass <ArrowRightOutlined />
                </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
