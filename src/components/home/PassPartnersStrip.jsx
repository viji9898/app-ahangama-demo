import React, { useMemo, useRef } from "react";
import { Button, Card, Grid, Typography } from "antd";
import {
  ArrowRightOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { usePlaces } from "../../app/placesContext";
import { trackPassCtaClick } from "../../analytics";
import { buildPassCtaUrl } from "../../lib/passAttribution";
import ahangamaPassLogo from "../../assets/ahangama-pass-logo.png";
import {
  FULL_LIST_PATH,
  getPassPlaces,
  MAX_HOME_PASS_VENUES,
} from "../../lib/passPartners";

const { Paragraph, Text, Title } = Typography;
const { useBreakpoint } = Grid;

function OfferPills({ place }) {
  const offerTags = Array.isArray(place.offers)
    ? place.offers.filter(Boolean).slice(0, 2)
    : [];

  if (!offerTags.length && !place.offer) return null;

  const fallbackTag =
    typeof place.offer === "string" && place.offer.trim()
      ? place.offer.trim()
      : null;

  const tags = offerTags.length ? offerTags : [fallbackTag];

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
      {tags.filter(Boolean).map((tag) => (
        <span
          key={tag}
          style={{
            background: "#f3ecd9",
            color: "#6F5A33",
            borderRadius: 999,
            padding: "6px 10px",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function PassVenueCard({ place, isMobile }) {
  return (
    <a
      href={place.slug ? `/${place.category}/${place.slug}` : FULL_LIST_PATH}
      style={{
        display: "block",
        color: "inherit",
        textDecoration: "none",
        height: "100%",
      }}
    >
      <Card
        hoverable
        bodyStyle={{ padding: 0 }}
        style={{
          height: "100%",
          borderRadius: 20,
          overflow: "hidden",
          border: "1px solid rgba(32,30,27,0.08)",
          background: "rgba(251,248,242,0.92)",
          boxShadow: "0 12px 28px rgba(32,30,27,0.06)",
        }}
      >
        <div
          style={{
            height: isMobile ? 176 : 190,
            backgroundImage: place.image
              ? `linear-gradient(180deg, rgba(18,25,24,0.04) 0%, rgba(18,25,24,0.35) 100%), url(${place.image})`
              : "linear-gradient(135deg, #e9ddc8 0%, #cbb89b 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div style={{ padding: isMobile ? 16 : 18 }}>
          {place.logo ? (
            <div
              style={{
                width: 50,
                height: 50,
                marginBottom: 12,
                borderRadius: 14,
                background: "rgba(255,255,255,0.92)",
                border: "1px solid rgba(32,30,27,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <img
                src={place.logo}
                alt={`${place.name} logo`}
                style={{
                  maxWidth: 50,
                  maxHeight: 50,
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </div>
          ) : null}
          <Text
            style={{
              color: "#8B7B63",
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1.1,
            }}
          >
            {place.area || "Ahangama"}
          </Text>
          <Title
            level={4}
            style={{
              marginTop: 8,
              marginBottom: 8,
              color: "#1F1D1A",
              fontSize: isMobile ? 20 : undefined,
            }}
          >
            {place.name}
          </Title>
          <Paragraph
            style={{
              color: "#5C5953",
              marginBottom: 0,
              minHeight: isMobile ? 0 : 66,
              lineHeight: 1.72,
            }}
          >
            {place.excerpt ||
              place.description ||
              place.cardPerk ||
              "Pass partner"}
          </Paragraph>
          <OfferPills place={place} />
        </div>
      </Card>
    </a>
  );
}

export default function PassPartnersStrip({ destinationSlug = "ahangama" }) {
  const { places: allPlaces } = usePlaces();
  const passCtaUrl = buildPassCtaUrl();
  const railRef = useRef(null);
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const visiblePlaces = useMemo(
    () =>
      getPassPlaces(allPlaces, destinationSlug).slice(0, MAX_HOME_PASS_VENUES),
    [allPlaces, destinationSlug],
  );

  function scrollRail(direction) {
    if (!railRef.current) return;
    railRef.current.scrollBy({ left: direction * 320, behavior: "smooth" });
  }

  if (!visiblePlaces.length) return null;

  return (
    <div
      style={{
        borderRadius: 28,
        border: "1px solid rgba(32,30,27,0.08)",
        background:
          "linear-gradient(180deg, rgba(251,248,242,0.98) 0%, rgba(246,240,231,0.98) 100%)",
        boxShadow: "0 18px 40px rgba(32,30,27,0.05)",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: isMobile ? 20 : 26 }}>
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "stretch" : "center",
            justifyContent: "space-between",
            gap: isMobile ? 16 : 18,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  color: "#B08E62",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.4,
                  textTransform: "uppercase",
                }}
              >
                Pass Partners
              </Text>
            </div>
            <Title
              level={2}
              style={{
                margin: 0,
                color: "#1F1D1A",
                fontSize: isMobile ? 32 : undefined,
                lineHeight: isMobile ? 1.08 : undefined,
              }}
            >
              Ahangama Pass Holders
            </Title>
            <Text
              style={{
                color: "#6D655C",
                fontSize: isMobile ? 13 : 14,
                lineHeight: isMobile ? 1.6 : undefined,
              }}
            >
              Enjoy perks with these partners.
            </Text>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 10,
              width: isMobile ? "100%" : "auto",
              alignItems: isMobile ? "stretch" : "center",
            }}
          >
            {!isMobile ? (
              <div style={{ display: "flex", gap: 10 }}>
                <Button
                  aria-label="Scroll pass partners left"
                  icon={<LeftOutlined />}
                  onClick={() => scrollRail(-1)}
                  style={{ borderRadius: 999, width: 44, height: 44 }}
                />
                <Button
                  aria-label="Scroll pass partners right"
                  icon={<RightOutlined />}
                  onClick={() => scrollRail(1)}
                  style={{ borderRadius: 999, width: 44, height: 44 }}
                />
              </div>
            ) : null}
            <Button
              href={FULL_LIST_PATH}
              icon={<ArrowRightOutlined />}
              style={{
                borderRadius: 999,
                height: 44,
                paddingInline: 18,
                width: isMobile ? "100%" : "auto",
              }}
            >
              Full list
            </Button>
            <a
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
                width: isMobile ? "100%" : "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={ahangamaPassLogo}
                alt="Ahangama Pass"
                style={{
                  display: "block",
                  height: 44,
                  width: "auto",
                }}
              />
            </a>
          </div>
        </div>
      </div>

      <div style={{ padding: isMobile ? "0 20px 20px" : "0 26px 26px" }}>
        <div
          ref={railRef}
          style={{
            display: "flex",
            gap: isMobile ? 14 : 18,
            overflowX: "auto",
            paddingBottom: 8,
            scrollSnapType: "x proximity",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "thin",
          }}
        >
          {visiblePlaces.map((place) => (
            <div
              key={place.id || place.slug || place.name}
              style={{
                flex: isMobile
                  ? "0 0 82vw"
                  : "0 0 clamp(220px, calc((100% - 54px) / 3.5), 320px)",
                maxWidth: isMobile ? 320 : undefined,
                scrollSnapAlign: "start",
              }}
            >
              <PassVenueCard place={place} isMobile={isMobile} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
