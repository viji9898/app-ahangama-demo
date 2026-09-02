import React from "react";
import { Card, Col, Row, Space, Tag, Typography } from "antd";
import { ArrowRightOutlined, CheckOutlined } from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";
import EditorialNextArticle from "../components/ui/EditorialNextArticle";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { buildPassCtaUrl } from "../lib/passAttribution";
import ahangamaPassLogo from "../assets/ahangama-pass-logo.png";

const { Paragraph, Text, Title } = Typography;

export const WHY_SURFING_CHANGED_PATH =
  "/why-surfing-changed-everything-in-ahangama";

const HERO_IMAGE =
  "https://images.pexels.com/photos/19065606/pexels-photo-19065606.jpeg";
const FEATURE_IMAGE =
  "https://images.pexels.com/photos/11617733/pexels-photo-11617733.jpeg";
const SIDE_IMAGE_ONE =
  "https://images.pexels.com/photos/33757643/pexels-photo-33757643.jpeg";
const SIDE_IMAGE_TWO =
  "https://images.pexels.com/photos/7952964/pexels-photo-7952964.jpeg";
const NEXT_ARTICLE = {
  href: "/12-things",
  kicker: "Discover More",
  title: "12 Ways to Experience Ahangama",
  image:
    "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/ahangama-train-station-sri-Lanka.webp",
};

const articleIntroduction = [
  "Modern Ahangama owes much of its identity to the ocean.",
  "We are not talking just about its renowned reputation as a traditional stilt fisherman.",
  "The reefs around Marshmallow, The Rock, and Kabalana have attracted surfers from around the world for years, as long as they have been keen enough to research.",
  "Their experiences began trickling into travel blogs and social media, attracting more over the years.",
];

const articleSections = [
  {
    title: "The Ocean Was the Catalyst",
    body: [
      "As the surf community grew post-COVID, cafes, guesthouses, surf camps, and creative businesses followed. Today, many of the spaces that define modern Ahangama were built by people who first arrived chasing a swell forecast and ended up staying much longer than planned.",
    ],
  },
  {
    title: "Kabalana Shows the Change Best",
    body: [
      "Take Kabalana Beach, one of our staff favourites. Between January and April, low tide reveals a broad 400 to 500 metre stretch of golden sand fringed by coconut palm trees. Early mornings belong to surfers waxing boards and checking conditions. By late afternoon, the beach often fills with football games, volleyball matches, and groups gathering to watch the sunset.",
    ],
  },
  {
    title: "Ahangama Makes Surfing Accessible",
    body: [
      "For newcomers, surfing here is surprisingly accessible. Board rentals can cost as little as USD 2 to 3 per day, while private lessons are often available for around USD 10 to 15. Those looking to fully immerse themselves in the lifestyle will find more surf camps in Ahangama than almost anywhere else in Sri Lanka.",
      "On the Ahangama Pass, you'll save even more.",
      "Sofie, a university lecturer from the Netherlands, booked a Level 0 (The Basic) lesson at Dreamsea Surf Camp on her second day.",
    ],
    quote:
      '"I spent more time falling off than standing up," she laughed. "But by the end of the week, I understood why people keep coming back."',
  },
  {
    title: "Even Non-Surfers Feel the Influence",
    body: [
      "Even if you never step onto a board, you're still experiencing a town shaped by surfing. The businesses you visit, the people you meet, and the rhythm of daily life all carry their influence.",
    ],
  },
];

const MENTIONED_PLACE_LINKS = [
  {
    label: "Marshmallow",
    href: "https://www.google.com/search?q=Marshmallow+Ahangama",
  },
  {
    label: "The Rock",
    href: "https://www.google.com/search?q=The+Rock+Ahangama",
  },
  {
    label: "Kabalana",
    href: "https://www.google.com/search?q=Kabalana+Beach+Ahangama",
  },
  {
    label: "Dreamsea Surf Camp",
    href: "https://www.google.com/search?q=Dreamsea+Surf+Camp+Ahangama",
  },
].sort((left, right) => right.label.length - left.label.length);

function renderVenueLinkedText(text) {
  const matches = [];

  MENTIONED_PLACE_LINKS.forEach((link) => {
    let searchIndex = 0;

    while (searchIndex < text.length) {
      const foundIndex = text.indexOf(link.label, searchIndex);

      if (foundIndex === -1) break;

      const overlaps = matches.some(
        (match) =>
          foundIndex < match.end &&
          foundIndex + link.label.length > match.start,
      );

      if (!overlaps) {
        matches.push({
          ...link,
          start: foundIndex,
          end: foundIndex + link.label.length,
        });
      }

      searchIndex = foundIndex + link.label.length;
    }
  });

  if (!matches.length) return text;

  matches.sort((left, right) => left.start - right.start);

  const segments = [];
  let cursor = 0;

  matches.forEach((match) => {
    if (cursor < match.start) {
      segments.push(text.slice(cursor, match.start));
    }

    segments.push(
      <a
        key={`${match.label}-${match.start}`}
        href={match.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "#2f2a24",
          textDecoration: "none",
          borderBottom: "1px solid rgba(214, 178, 102, 0.9)",
          paddingBottom: 1,
        }}
      >
        {match.label}
      </a>,
    );

    cursor = match.end;
  });

  if (cursor < text.length) {
    segments.push(text.slice(cursor));
  }

  return segments;
}

export default function WhySurfingChangedEverythingInAhangamaPage() {
  const canonical = absUrl(WHY_SURFING_CHANGED_PATH);
  const passCtaUrl = buildPassCtaUrl();

  return (
    <SiteLayout navOverlayHero>
      <Seo
        title="Why Surfing Changed Everything in Ahangama"
        description="A short editorial on how surf culture reshaped modern Ahangama, from Kabalana mornings to the cafes, camps, and creative businesses that followed."
        canonical={canonical}
        ogImage={HERO_IMAGE}
      />

      <div
        className="dm-canvas"
        style={{
          marginTop: 0,
          paddingTop: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          background: "#ffffff",
        }}
      >
        <div className="dm-wrap">
          <div
            className="ahg-hero"
            style={{
              width: "100vw",
              marginLeft: "calc(50% - 50vw)",
              marginRight: "calc(50% - 50vw)",
              borderRadius: 0,
              background: "#FFFFFF",
              boxShadow: "none",
            }}
          >
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                minHeight: "100svh",
              }}
            >
              <div
                aria-hidden="true"
                className="home-hero-media-layer"
                style={{ position: "absolute", inset: 0, overflow: "hidden" }}
              >
                <div
                  className="home-hero-overlay"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(90deg, rgba(10,14,18,0.82) 0%, rgba(10,14,18,0.7) 23%, rgba(10,14,18,0.42) 45%, rgba(10,14,18,0.12) 68%, rgba(10,14,18,0) 100%)",
                    pointerEvents: "none",
                    zIndex: 2,
                  }}
                />
                <img
                  className="home-hero-image"
                  src={HERO_IMAGE}
                  alt="Surfer sitting on a board at the shoreline"
                  width="2400"
                  height="1597"
                  fetchPriority="high"
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 1,
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center center",
                  }}
                />
              </div>

              <div
                style={{
                  position: "relative",
                  zIndex: 3,
                  width: "100%",
                  maxWidth: 1100,
                  margin: "0 auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    minHeight: "100svh",
                    maxWidth: 760,
                    padding:
                      "clamp(44px, 5vw, 68px) clamp(32px, 4.8vw, 72px) 36px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 12,
                      marginBottom: 18,
                    }}
                  >
                    {["Surf", "Ahangama Editorial"].map((item) => (
                      <Text
                        key={item}
                        style={{
                          color: "#FFFFFF",
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: 1.6,
                          textTransform: "uppercase",
                        }}
                      >
                        {item}
                      </Text>
                    ))}
                  </div>

                  <Title
                    className="home-hero-title"
                    style={{
                      margin: 0,
                      color: "#FFFFFF",
                      fontWeight: 500,
                      fontFamily:
                        '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                    }}
                  >
                    {[
                      "Why Surfing",
                      "Changed",
                      "Everything in",
                      "Ahangama",
                    ].map((line) => (
                      <span
                        key={line}
                        className="home-hero-titleLine"
                        style={{ color: "#FFFFFF" }}
                      >
                        {line}
                      </span>
                    ))}
                  </Title>

                  <Text
                    style={{
                      display: "block",
                      marginTop: 14,
                      color: "#FFFFFF",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 1.6,
                      textTransform: "uppercase",
                    }}
                  >
                    Words by Jessica Fernando
                  </Text>

                  <Paragraph
                    style={{
                      marginTop: 24,
                      marginBottom: 22,
                      maxWidth: 650,
                      color: "#FFFFFF",
                      fontSize: "clamp(16px, 1.45vw, 19px)",
                      lineHeight: 1.72,
                    }}
                  >
                    How surf culture reshaped modern Ahangama, from Kabalana
                    mornings to the cafes, camps and creative businesses that
                    followed.
                  </Paragraph>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dm-wrap" style={{ paddingTop: 28 }}>
          <div
            style={{
              maxWidth: 920,
              paddingBottom: 12,
            }}
          >
            {articleIntroduction.map((paragraph, index) => (
              <Paragraph
                key={paragraph}
                style={{
                  fontSize: index === 0 ? 22 : 18,
                  lineHeight: index === 0 ? 1.7 : 1.85,
                  color: index < 2 ? "#2f2a24" : "#55514B",
                  marginBottom: 18,
                }}
              >
                {renderVenueLinkedText(paragraph)}
              </Paragraph>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "8px 0 28px",
              width: "100%",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 1400,
                aspectRatio: "3 / 2",
                overflow: "hidden",
                boxShadow: "0 16px 40px rgba(18,24,22,0.12)",
              }}
            >
              <img
                src={FEATURE_IMAGE}
                alt="Beach scene along the Ahangama coast"
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center center",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {articleSections.map((section, index) => (
              <React.Fragment key={section.title}>
                {index === 1 ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: 24,
                      margin: "0 auto 28px",
                      width: "100%",
                      maxWidth: 1224,
                    }}
                  >
                    <img
                      src={SIDE_IMAGE_ONE}
                      alt="Surfer at the Ahangama shoreline"
                      style={{
                        display: "block",
                        width: "100%",
                        maxWidth: 600,
                        aspectRatio: "4 / 5",
                        objectFit: "cover",
                        boxShadow: "0 16px 36px rgba(18,24,22,0.10)",
                      }}
                    />
                    <img
                      src={SIDE_IMAGE_TWO}
                      alt="Surf culture in Ahangama"
                      style={{
                        display: "block",
                        width: "100%",
                        maxWidth: 600,
                        aspectRatio: "4 / 5",
                        objectFit: "cover",
                        boxShadow: "0 16px 36px rgba(18,24,22,0.10)",
                      }}
                    />
                  </div>
                ) : null}

                <section
                  style={{
                    padding: index === 0 ? "20px 0 36px" : "36px 0",
                    borderTop:
                      index === 0 ? "none" : "1px solid rgba(47,62,58,0.12)",
                  }}
                >
                  <div style={{ maxWidth: 1180 }}>
                    <Title level={2} style={{ marginTop: 0, marginBottom: 18 }}>
                      {section.title}
                    </Title>

                    {section.body.map((paragraph) => (
                      <Paragraph
                        key={paragraph}
                        style={{
                          maxWidth: 1200,
                          fontSize: 16,
                          lineHeight: 1.8,
                          color:
                            paragraph ===
                            "On the Ahangama Pass, you'll save even more."
                              ? "#2F3E3A"
                              : "#55514B",
                          fontWeight:
                            paragraph ===
                            "On the Ahangama Pass, you'll save even more."
                              ? 700
                              : 400,
                          marginBottom: 18,
                        }}
                      >
                        {renderVenueLinkedText(paragraph)}
                      </Paragraph>
                    ))}

                    {section.quote ? (
                      <blockquote
                        style={{
                          margin: "0 0 18px",
                          padding: "18px 22px",
                          borderLeft: "3px solid rgba(107,90,78,0.4)",
                          background: "rgba(255,255,255,0.72)",
                          color: "#55514B",
                          fontSize: 18,
                          lineHeight: 1.8,
                        }}
                      >
                        {section.quote}
                      </blockquote>
                    ) : null}
                  </div>
                </section>
              </React.Fragment>
            ))}
          </div>

          <EditorialNextArticle
            href={NEXT_ARTICLE.href}
            kicker={NEXT_ARTICLE.kicker}
            title={NEXT_ARTICLE.title}
            image={NEXT_ARTICLE.image}
          />

          <div id="guide-note" style={{ marginTop: 32, marginBottom: 36 }}>
            <Card
              style={{
                borderRadius: 28,
                border: "1px solid rgba(47,62,58,0.08)",
                background: "#ffffff",
              }}
              bodyStyle={{ padding: 28 }}
            >
              <Row gutter={[24, 24]} align="middle">
                <Col xs={24} lg={16}>
                  <div
                    style={{
                      borderRadius: 24,
                      padding: 20,
                      background: "#ffffff",
                      border: "1px solid rgba(47,62,58,0.08)",
                      boxShadow: "0 10px 24px rgba(18,24,22,0.12)",
                    }}
                  >
                    <Text
                      style={{
                        display: "block",
                        color: "#6B5A4E",
                        textTransform: "uppercase",
                        letterSpacing: 1.5,
                        fontSize: 12,
                        marginBottom: 10,
                      }}
                    >
                      A Note From Your Guide
                    </Text>
                    <Title
                      level={2}
                      style={{
                        color: "#2F3E3A",
                        marginTop: 0,
                        marginBottom: 12,
                      }}
                    >
                      Written by Jessica Fernando
                    </Title>
                    <Paragraph
                      style={{
                        color: "#2F3E3A",
                        fontSize: 16,
                        lineHeight: 1.8,
                        marginBottom: 0,
                      }}
                    >
                      An editorial look at how the surf economy and beach ritual
                      reshaped modern Ahangama.
                    </Paragraph>
                  </div>
                </Col>

                <Col xs={24} lg={8}>
                  <Card
                    style={{
                      borderRadius: 22,
                      background: "#ffffff",
                      border: "1px solid rgba(47,62,58,0.08)",
                      boxShadow: "0 10px 24px rgba(18,24,22,0.12)",
                    }}
                    bodyStyle={{ padding: 20 }}
                  >
                    <Text
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        color: "#2F3E3A",
                        fontWeight: 700,
                        marginBottom: 12,
                      }}
                    >
                      <CheckOutlined
                        style={{ color: "#2F3E3A", fontSize: 14 }}
                      />
                      Ahangama Pass Perks
                    </Text>
                    <Paragraph
                      style={{
                        color: "#2F3E3A",
                        marginBottom: 18,
                      }}
                    >
                      Surf-friendly savings across cafes, wellness, stays, and
                      the daily places that shape a week in town.
                    </Paragraph>
                    <a
                      href={passCtaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={ahangamaPassLogo}
                        alt="Ahangama Pass"
                        style={{ display: "block", height: 52, width: "auto" }}
                      />
                    </a>
                  </Card>
                </Col>
              </Row>

              <div
                style={{
                  marginTop: 18,
                  paddingTop: 16,
                  borderTop: "1px solid rgba(47,62,58,0.08)",
                }}
              >
                <Text
                  style={{
                    display: "block",
                    color: "#6B5A4E",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1.4,
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  Places Mentioned
                </Text>

                <Space wrap size={[12, 8]}>
                  {MENTIONED_PLACE_LINKS.map((place) => (
                    <a
                      key={place.label}
                      href={place.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        color: "#6B5A4E",
                        fontSize: 13,
                        textDecoration: "none",
                        borderBottom: "1px solid rgba(107,90,78,0.24)",
                        paddingBottom: 1,
                      }}
                    >
                      {place.label}
                      <ArrowRightOutlined style={{ fontSize: 11 }} />
                    </a>
                  ))}
                </Space>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
