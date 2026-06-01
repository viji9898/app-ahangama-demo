import React, { useMemo } from "react";
import { Button, Grid, Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { usePlaces } from "../../app/placesContext";
import { trackPassCtaClick } from "../../analytics";
import { buildPassCtaUrl } from "../../lib/passAttribution";
import { FULL_LIST_PATH, getPassPlaces } from "../../lib/passPartners";

const { Paragraph, Text, Title } = Typography;
const { useBreakpoint } = Grid;

const FEATURED_PERKS = [
  "Food & Drink Savings",
  "Wellness Benefits",
  "Retail Offers",
  "Free Extras",
  "Accommodation Perks",
];

const CATEGORY_LINE = "Cafes · Wellness · Stays · Surf · Retail · Experiences";

export default function PassPartnersStrip({ destinationSlug = "ahangama" }) {
  const { places: allPlaces } = usePlaces();
  const passCtaUrl = buildPassCtaUrl();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const passPlaces = useMemo(
    () => getPassPlaces(allPlaces, destinationSlug),
    [allPlaces, destinationSlug],
  );

  if (!passPlaces.length) return null;

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
            <Text
              style={{
                display: "block",
                marginTop: 14,
                color: "#7A6F63",
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              Trusted by 100+ local businesses across Ahangama.
            </Text>
          </div>

          <div
            style={{
              paddingTop: isMobile ? 4 : 0,
            }}
          >
            <Text
              style={{
                color: "#8A7A68",
                fontSize: 12,
                lineHeight: 1.55,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              {CATEGORY_LINE}
            </Text>
          </div>
        </div>
      </div>

      <div style={{ padding: isMobile ? "0 20px 20px" : "0 30px 26px" }}>
        <div
          style={{
            display: "grid",
            gap: 18,
            marginTop: 8,
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
                alignItems: isMobile ? "stretch" : "center",
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

            <Text
              style={{
                color: "#71695F",
                fontSize: 13,
                lineHeight: 1.6,
                maxWidth: 360,
              }}
            >
              See all participating venues, perks and how to claim them.
            </Text>
          </div>
        </div>
      </div>
    </section>
  );
}
