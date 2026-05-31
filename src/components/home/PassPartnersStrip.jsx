import React, { useMemo, useRef } from "react";
import { Button, Card, Space, Typography } from "antd";
import {
  ArrowRightOutlined,
  LeftOutlined,
  QrcodeOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { usePlaces } from "../../app/placesContext";
import { trackPassCtaClick } from "../../analytics";
import { buildPassCtaUrl } from "../../lib/passAttribution";
import {
  FULL_LIST_PATH,
  getPassPlaces,
  MAX_HOME_PASS_VENUES,
} from "../../lib/passPartners";

const { Paragraph, Text, Title } = Typography;

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

function PassVenueCard({ place }) {
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
          border: "1px solid rgba(47,62,58,0.08)",
          background: "#fffdf9",
          boxShadow: "0 12px 26px rgba(47,62,58,0.08)",
        }}
      >
        <div
          style={{
            height: 190,
            backgroundImage: place.image
              ? `linear-gradient(180deg, rgba(18,25,24,0.04) 0%, rgba(18,25,24,0.35) 100%), url(${place.image})`
              : "linear-gradient(135deg, #e9ddc8 0%, #cbb89b 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div style={{ padding: 18 }}>
          {place.logo ? (
            <div
              style={{
                width: 50,
                height: 50,
                marginBottom: 12,
                borderRadius: 14,
                background: "rgba(255,255,255,0.92)",
                border: "1px solid rgba(47,62,58,0.08)",
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
            style={{ marginTop: 8, marginBottom: 8, color: "#2F3E3A" }}
          >
            {place.name}
          </Title>
          <Paragraph
            style={{ color: "#5C5953", marginBottom: 0, minHeight: 66 }}
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
        border: "1px solid rgba(47,62,58,0.08)",
        background: "linear-gradient(180deg, #fffdf9 0%, #f7f1e7 100%)",
        boxShadow: "0 18px 40px rgba(47,62,58,0.05)",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: 26 }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 18,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 6,
              }}
            >
              <span style={{ fontSize: 20 }}>🎁</span>
              <Title level={2} style={{ margin: 0, color: "#8B4513" }}>
                Ahangama Pass Holders
              </Title>
            </div>
            <Text style={{ color: "#6D655C", fontSize: 14 }}>
              Enjoy perks with these partners.
            </Text>
          </div>

          <Space size={10} wrap>
            <Button
              aria-label="Scroll pass partners left"
              icon={<LeftOutlined />}
              onClick={() => scrollRail(-1)}
              style={{ borderRadius: 999 }}
            />
            <Button
              aria-label="Scroll pass partners right"
              icon={<RightOutlined />}
              onClick={() => scrollRail(1)}
              style={{ borderRadius: 999 }}
            />
            <Button
              href={FULL_LIST_PATH}
              icon={<ArrowRightOutlined />}
              style={{ borderRadius: 999, height: 44, paddingInline: 18 }}
            >
              Full list
            </Button>
            <Button
              type="primary"
              href={passCtaUrl}
              target="_blank"
              rel="noopener noreferrer"
              icon={<QrcodeOutlined />}
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
                background: "linear-gradient(135deg, #FFD700, #FFA500)",
                border: "none",
                boxShadow: "none",
              }}
            >
              Get your Pass
            </Button>
          </Space>
        </div>
      </div>

      <div style={{ padding: "0 26px 26px" }}>
        <div
          ref={railRef}
          style={{
            display: "flex",
            gap: 18,
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
                flex: "0 0 clamp(220px, calc((100% - 54px) / 3.5), 320px)",
                scrollSnapAlign: "start",
              }}
            >
              <PassVenueCard place={place} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
