import React, { useMemo } from "react";
import {
  ArrowRightOutlined,
  EnvironmentOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Grid, Row, Space, Tag, Typography } from "antd";
import { usePlaces } from "../app/placesContext";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import SiteLayout from "../components/layout/SiteLayout";
import { trackPassCtaClick } from "../analytics";
import { buildPassCtaUrl } from "../lib/passAttribution";
import {
  buildBestForGroups,
  FULL_LIST_PATH,
  getPassPlaces,
} from "../lib/passPartners";

const { Paragraph, Text, Title } = Typography;
const { useBreakpoint } = Grid;

const SHARED_GOOGLE_MAP_URL = "https://maps.app.goo.gl/zvo1rFQegTtS87ZT8";

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

function PlaceLinks({ places }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {places.map((place) => (
        <a
          key={place.id || place.slug || place.name}
          href={
            place.slug ? `/${place.category}/${place.slug}` : FULL_LIST_PATH
          }
          style={{
            display: "block",
            padding: "14px 16px",
            borderRadius: 16,
            border: "1px solid rgba(47,62,58,0.08)",
            background: "rgba(255,255,255,0.72)",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            {place.logo ? (
              <div
                style={{
                  width: 50,
                  height: 50,
                  flex: "0 0 50px",
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
            <div style={{ minWidth: 0, flex: 1 }}>
              <Text
                style={{
                  display: "block",
                  color: "#2F3E3A",
                  fontSize: 16,
                  fontWeight: 700,
                  marginBottom: 4,
                }}
              >
                {place.name}
              </Text>
              <Text style={{ color: "#6C665E", fontSize: 13 }}>
                {place.area || "Ahangama"}
                {place.bestFor?.length
                  ? ` • ${place.bestFor.slice(0, 2).join(" • ")}`
                  : ""}
              </Text>
              <OfferPills place={place} />
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

export default function FullListPage() {
  const { places: allPlaces } = usePlaces();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const passCtaUrl = buildPassCtaUrl();
  const canonical = absUrl(FULL_LIST_PATH);

  const passPlaces = useMemo(() => getPassPlaces(allPlaces), [allPlaces]);
  const { topBestFors, groups, otherPlaces } = useMemo(
    () => buildBestForGroups(passPlaces),
    [passPlaces],
  );

  return (
    <SiteLayout>
      <Seo
        title="Ahangama Pass Full List"
        description="Browse the full list of Ahangama Pass partners, organized by the top best-for categories from the live venue data."
        canonical={canonical}
      />

      <div className="dm-heroCut" />
      <div className="dm-canvas">
        <div className="dm-wrap">
          <Card
            style={{
              borderRadius: 30,
              border: "1px solid rgba(47,62,58,0.08)",
              background:
                "linear-gradient(135deg, rgba(245,236,225,0.94) 0%, rgba(255,251,245,0.98) 100%)",
              overflow: "hidden",
              marginBottom: 28,
            }}
            bodyStyle={{ padding: 30 }}
          >
            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} xl={16}>
                <Space wrap size={[8, 8]} style={{ marginBottom: 12 }}>
                  <Tag style={{ borderRadius: 999, padding: "6px 12px" }}>
                    Full List
                  </Tag>
                  <Tag style={{ borderRadius: 999, padding: "6px 12px" }}>
                    Top 10 best-for groups
                  </Tag>
                </Space>

                <Title
                  level={1}
                  style={{
                    marginTop: 0,
                    marginBottom: 12,
                    fontSize: 42,
                    lineHeight: 1.03,
                  }}
                >
                  Ahangama Pass Holders Full List
                </Title>

                <Paragraph
                  style={{
                    fontSize: 18,
                    lineHeight: 1.8,
                    color: "#5C5953",
                    marginBottom: 18,
                  }}
                >
                  The full pass-partner list, organized by the top ten
                  `best_for` themes with the highest occurrence in the live
                  Ahangama data. Each venue is assigned to its strongest
                  matching theme so the list stays readable instead of
                  duplicating cards across every tag.
                </Paragraph>

                <Paragraph
                  style={{
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: "#6B655D",
                    marginBottom: 18,
                    maxWidth: 720,
                  }}
                >
                  Open the shared Google Map for all pass venues and save it to
                  your Google Maps before you head out.
                  {isMobile
                    ? " On mobile, it opens directly in the Google Maps app."
                    : ""}
                </Paragraph>

                <Space wrap size={12}>
                  <Button
                    href={SHARED_GOOGLE_MAP_URL}
                    target={isMobile ? undefined : "_blank"}
                    rel={isMobile ? undefined : "noopener noreferrer"}
                    icon={<EnvironmentOutlined />}
                    style={{ borderRadius: 999 }}
                  >
                    Open Shared Google Map
                  </Button>
                  <Button
                    href="/"
                    icon={<ArrowRightOutlined />}
                    style={{ borderRadius: 999 }}
                  >
                    Back home
                  </Button>
                  <Button
                    type="primary"
                    href={passCtaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    icon={<QrcodeOutlined />}
                    onClick={() => {
                      trackPassCtaClick({
                        ctaLocation: "full_list_page",
                        destinationUrl: passCtaUrl,
                      });
                    }}
                    style={{
                      borderRadius: 999,
                      background: "linear-gradient(135deg, #FFD700, #FFA500)",
                      border: "none",
                    }}
                  >
                    Get The Pass
                  </Button>
                </Space>
              </Col>

              <Col xs={24} xl={8}>
                <Card
                  style={{
                    borderRadius: 24,
                    border: "1px solid rgba(47,62,58,0.08)",
                    background: "rgba(255,255,255,0.7)",
                  }}
                  bodyStyle={{ padding: 22 }}
                >
                  <Text
                    style={{
                      display: "block",
                      color: "#8B5A3C",
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 1.2,
                      marginBottom: 10,
                    }}
                  >
                    Top best-for tags
                  </Text>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {topBestFors.map((item) => (
                      <a
                        key={item.key}
                        href={`#best-for-${item.key}`}
                        style={{ textDecoration: "none" }}
                      >
                        <span
                          style={{
                            borderRadius: 999,
                            padding: "10px 14px",
                            margin: 0,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "linear-gradient(180deg, #fffaf1 0%, #f3e4ca 100%)",
                            border: "1px solid rgba(139,90,60,0.18)",
                            color: "#6F5235",
                            fontSize: 13,
                            fontWeight: 700,
                            lineHeight: 1,
                            letterSpacing: 0.2,
                            boxShadow: "0 6px 14px rgba(111,82,53,0.08)",
                          }}
                        >
                          {item.label} ({item.count})
                        </span>
                      </a>
                    ))}
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {groups.map((group) => (
              <Card
                key={group.key}
                id={`best-for-${group.key}`}
                style={{
                  borderRadius: 24,
                  border: "1px solid rgba(47,62,58,0.08)",
                  background:
                    "linear-gradient(180deg, #fffdf9 0%, #faf4eb 100%)",
                }}
                bodyStyle={{ padding: 24 }}
              >
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={7}>
                    <Text
                      style={{
                        display: "block",
                        color: "#8B5A3C",
                        fontSize: 12,
                        fontWeight: 700,
                        marginBottom: 10,
                        textTransform: "uppercase",
                        letterSpacing: 1.4,
                      }}
                    >
                      Main best for
                    </Text>
                    <Title level={2} style={{ marginTop: 0, marginBottom: 12 }}>
                      {group.label}
                    </Title>
                    <Paragraph style={{ color: "#5C5953", marginBottom: 0 }}>
                      {group.count} venues include this as one of their best-for
                      tags.
                    </Paragraph>
                  </Col>
                  <Col xs={24} lg={17}>
                    <PlaceLinks places={group.places} />
                  </Col>
                </Row>
              </Card>
            ))}

            {otherPlaces.length ? (
              <Card
                style={{
                  borderRadius: 24,
                  border: "1px solid rgba(47,62,58,0.08)",
                  background:
                    "linear-gradient(180deg, #fffdf9 0%, #faf4eb 100%)",
                }}
                bodyStyle={{ padding: 24 }}
              >
                <Title level={3} style={{ marginTop: 0 }}>
                  More venues
                </Title>
                <Paragraph style={{ color: "#5C5953" }}>
                  These partners are in the pass list but do not map cleanly
                  into the current top ten best-for groups.
                </Paragraph>
                <PlaceLinks places={otherPlaces} />
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
