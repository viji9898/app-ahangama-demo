import React from "react";
import { Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";
import EditorialNextArticle from "../components/ui/EditorialNextArticle";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";

const { Paragraph, Text, Title } = Typography;

export const BEST_SUNSETS_IN_AHANGAMA_PATH = "/best-sunsets-in-ahangama";

const BASE_IMAGE_URL =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/best-sunsets";

const HERO_IMAGE = `${BASE_IMAGE_URL}/Hero+Image+-+2400+x+1600+px.webp`;
const BODY_IMAGE = `${BASE_IMAGE_URL}/Body+Section+-+1200+x+1500+px.webp`;
const AHANGAMA_BEACH_IMAGE = `${BASE_IMAGE_URL}/Image+Left+-+A+horizontal+or+square+image+of+Ahangama+Beach+with+people+walking+by+the+water+at+sunset.+-+.webp`;
const STILT_FISHERMEN_IMAGE = `${BASE_IMAGE_URL}/Image+Right+-+A+horizontal+or+square+image+of+stilt+fishermen+poles+near+Ahangama+during+golden+hour.webp`;
const WIDE_FEATURE_IMAGE = `${BASE_IMAGE_URL}/Wide+Feature+Image+1800+x+1200+px+-+.webp`;

const publishDate = "2026-06-30T09:00:00.000Z";

const NEXT_ARTICLE = {
  href: "/where-ahangama-gathers-for-sunset-stairway-rooftop-bar-at-lighthouse-hotel",
  kicker: "Read Next",
  title: "Where Ahangama Gathers for Sunset",
  image:
    "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/where-ahangama-gathers-for-sunset+/hero-view-from-the-bar.jpg",
};

const articleIntroduction = [
  "Sunset in Ahangama is one of the easiest ways to feel the south coast at its best. As the afternoon heat softens, surfboards come out of the water, cafes begin to glow, and the beach slowly fills with people waiting for the sky to change.",
  "This week, sunset is around 6:25 pm to 6:26 pm, so the best time to arrive at the beach is around 5:45 pm. Come early enough to enjoy the golden hour, and stay a little longer for the colours that often appear after the sun has dropped below the horizon.",
  "A cloudy evening is not a bad thing here. In Ahangama, clouds can turn an ordinary sunset into something dramatic, especially when the sun breaks through for a few minutes over the ocean.",
];

const articleSections = [
  {
    title: "Best Sunset Spot This Week: Kabalana Beach",
    body: [
      "For the best all-round sunset experience this week, head to Kabalana Beach.",
      "Kabalana has a wide stretch of sand, open ocean views, and the kind of relaxed evening atmosphere that makes Ahangama special. It is also one of the area's best-known surf spots, so the sunset often comes with surfers catching their last waves of the day.",
      "Arrive by 5:45 pm, find a place facing the water, and give yourself time. If the sky looks cloudy at first, do not leave too early. The best colours often appear after sunset, when the clouds begin to turn orange, pink, and purple.",
    ],
    quote:
      "Some of the best sunsets in Ahangama happen on cloudy evenings, when the sky opens just before the sun disappears.",
  },
  {
    title: "Other Sunset Spots Around Ahangama",
    body: [
      "Kabalana is the top pick this week, but there are a few other places worth considering depending on the kind of evening you want.",
      "Ahangama Beach is the easiest choice if you want a relaxed walk before dinner. It is central, simple, and peaceful in the evening.",
      "Midigama Beach is a good option if you prefer a surf-town atmosphere. The coastline has a casual energy, with waves, beach cafes, and plenty of golden-hour movement.",
      "The stilt fishermen coast is one of the most recognisable sunset scenes near Ahangama. The fishing poles, ocean, and evening sky create a strong local image, especially when the light is soft.",
    ],
  },
  {
    title: "Plan Your Evening",
    body: [
      "Many people leave as soon as the sun goes down, but in Ahangama the sky can become even more beautiful after sunset. Stay a little longer, especially if there are clouds above the ocean.",
    ],
  },
];

const SUNSET_TIMELINE = [
  "5:30 pm - Start heading toward the beach",
  "5:45 pm - Arrive and choose your spot",
  "6:10 pm - Enjoy the golden-hour light",
  "6:25 pm to 6:26 pm - Watch the sunset",
  "6:30 pm to 6:45 pm - Stay for the afterglow",
];

const MENTIONED_PLACE_LINKS = [
  {
    label: "Kabalana Beach",
    href: "https://maps.app.goo.gl/8wQyi4QsjHA2X7TP9",
  },
  {
    label: "Ahangama Beach",
    href: "https://maps.app.goo.gl/gPWSk7a1pLP3aqAi6",
  },
  {
    label: "Midigama Beach",
    href: "https://maps.app.goo.gl/Rx1G7A7vUNfJ82H26",
  },
  {
    label: "Midigama",
    href: "https://maps.app.goo.gl/Rx1G7A7vUNfJ82H26",
  },
];

const FEATURED_PLACES = [
  {
    label: "Kabalana Beach",
    href: "https://maps.app.goo.gl/8wQyi4QsjHA2X7TP9",
    note: "Best overall sunset spot this week, especially for ocean views, surf atmosphere, and golden-hour photos.",
  },
  {
    label: "Ahangama Beach",
    href: "https://maps.app.goo.gl/gPWSk7a1pLP3aqAi6",
    note: "Best for a simple evening walk, relaxed beach time, and easy access from central Ahangama.",
  },
  {
    label: "Midigama",
    href: "https://maps.app.goo.gl/Rx1G7A7vUNfJ82H26",
    note: "Best for surf-town energy, casual cafes, and watching the coastline change colour at sunset.",
  },
  {
    label: "Stilt Fishermen Coast",
    href: "https://www.google.com/maps/search/stilt+fishermen+ahangama",
    note: "Best for photography and one of the most iconic coastal views near Ahangama.",
  },
];

function renderPlaceLinkedText(text, styleOverride = {}) {
  const sortedLinks = [...MENTIONED_PLACE_LINKS].sort(
    (left, right) => right.label.length - left.label.length,
  );
  const matches = [];

  sortedLinks.forEach((link) => {
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
          ...styleOverride,
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

function EditorialImage({ src, alt, aspectRatio = "4 / 5" }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        display: "block",
        width: "100%",
        aspectRatio,
        objectFit: "cover",
        boxShadow: "0 16px 36px rgba(18,24,22,0.10)",
      }}
    />
  );
}

function ImageGrid({ children }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 24,
        margin: "0 auto 28px",
        width: "100%",
        maxWidth: 1224,
      }}
    >
      {children}
    </div>
  );
}

export default function BestSunsetsInAhangamaPage() {
  const canonical = absUrl(BEST_SUNSETS_IN_AHANGAMA_PATH);

  return (
    <SiteLayout navOverlayHero>
      <Seo
        title="Best Sunsets in Ahangama"
        description="The best sunset spot in Ahangama this week, when to arrive, where to stand, and the nearby beaches worth considering for golden hour."
        canonical={canonical}
        ogImage={HERO_IMAGE}
        ogType="article"
        author="Ahangama Guide Editorial Team"
        publishDate={publishDate}
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
          <div>
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
                  style={{
                    position: "absolute",
                    inset: 0,
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="home-hero-overlay"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(90deg, rgba(10,14,18,0.82) 0%, rgba(10,14,18,0.66) 24%, rgba(10,14,18,0.38) 48%, rgba(10,14,18,0.12) 72%, rgba(10,14,18,0) 100%)",
                      pointerEvents: "none",
                      zIndex: 2,
                    }}
                  />
                  <img
                    className="home-hero-image"
                    src={HERO_IMAGE}
                    alt="Sunset over the Ahangama coastline"
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
                      maxWidth: 720,
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
                      {["Best Sunset", "Ahangama Editorial"].map((item) => (
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
                      <span
                        className="home-hero-titleLine"
                        style={{ color: "#FFFFFF" }}
                      >
                        Best Sunsets
                      </span>
                      <span
                        className="home-hero-titleLine"
                        style={{ color: "#FFFFFF" }}
                      >
                        in Ahangama
                      </span>
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
                      Best time this week: 5:45 pm arrival
                    </Text>

                    <Paragraph
                      style={{
                        marginTop: 24,
                        marginBottom: 22,
                        maxWidth: 560,
                        color: "#FFFFFF",
                        fontSize: "clamp(16px, 1.45vw, 19px)",
                        lineHeight: 1.72,
                      }}
                    >
                      Kabalana Beach, cloudy skies, afterglow, and the relaxed
                      evening rhythm that makes the south coast feel at its
                      best.
                    </Paragraph>
                  </div>
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
                {renderPlaceLinkedText(paragraph)}
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
                src={WIDE_FEATURE_IMAGE}
                alt="Wide sunset view on the Ahangama coast"
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
                          color: "#55514B",
                          marginBottom: 18,
                        }}
                      >
                        {renderPlaceLinkedText(paragraph)}
                      </Paragraph>
                    ))}

                    {section.quote ? (
                      <blockquote
                        style={{
                          margin: "4px 0 18px",
                          padding: "20px 24px",
                          borderLeft: "3px solid rgba(107,90,78,0.4)",
                          background: "rgba(255,255,255,0.72)",
                          color: "#2f2a24",
                          fontSize: 22,
                          lineHeight: 1.55,
                          fontFamily:
                            '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                        }}
                      >
                        {renderPlaceLinkedText(section.quote)}
                      </blockquote>
                    ) : null}

                    {index === 2 ? (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(180px, 1fr))",
                          gap: 12,
                          marginTop: 20,
                          maxWidth: 960,
                        }}
                      >
                        {SUNSET_TIMELINE.map((item) => (
                          <div
                            key={item}
                            style={{
                              padding: "14px 16px",
                              borderTop: "1px solid rgba(47,62,58,0.16)",
                              background: "rgba(247,244,238,0.56)",
                            }}
                          >
                            <Text
                              style={{
                                color: "#55514B",
                                fontSize: 13,
                                lineHeight: 1.55,
                              }}
                            >
                              {item}
                            </Text>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </section>

                {index === 0 ? (
                  <ImageGrid>
                    <EditorialImage
                      src={BODY_IMAGE}
                      alt="Golden sunset light on the beach in Ahangama"
                    />
                    <EditorialImage
                      src={AHANGAMA_BEACH_IMAGE}
                      alt="People walking along Ahangama Beach at sunset"
                      aspectRatio="1 / 1"
                    />
                  </ImageGrid>
                ) : null}

                {index === 1 ? (
                  <ImageGrid>
                    <EditorialImage
                      src={STILT_FISHERMEN_IMAGE}
                      alt="Stilt fishermen poles near Ahangama during golden hour"
                      aspectRatio="1 / 1"
                    />
                    <EditorialImage
                      src={WIDE_FEATURE_IMAGE}
                      alt="Ocean and beach light after sunset in Ahangama"
                      aspectRatio="1 / 1"
                    />
                  </ImageGrid>
                ) : null}
              </React.Fragment>
            ))}
          </div>

          <section
            style={{
              margin: "22px 0 34px",
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

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "14px 22px",
              }}
            >
              {FEATURED_PLACES.map((place) => (
                <div
                  key={place.label}
                  style={{
                    paddingTop: 10,
                    borderTop: "1px solid rgba(47,62,58,0.08)",
                  }}
                >
                  <a
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
                  <Text
                    style={{
                      display: "block",
                      marginTop: 7,
                      color: "#55514B",
                      fontSize: 13,
                      lineHeight: 1.55,
                    }}
                  >
                    {place.note}
                  </Text>
                </div>
              ))}
            </div>
          </section>

          <EditorialNextArticle
            href={NEXT_ARTICLE.href}
            kicker={NEXT_ARTICLE.kicker}
            title={NEXT_ARTICLE.title}
            image={NEXT_ARTICLE.image}
          />
        </div>
      </div>
    </SiteLayout>
  );
}
