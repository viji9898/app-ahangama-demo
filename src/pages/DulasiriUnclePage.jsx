import React from "react";
import { Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";
import EditorialNextArticle from "../components/ui/EditorialNextArticle";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";

const { Paragraph, Text, Title } = Typography;

export const DULASIRI_UNCLE_PATH = "/dulasiri-uncle";

const HERO_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/dulasiri-uncle/Dulasiri-on-the-beach-holding-a-turtle.jpg";
const CLOSE_UP_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/dulasiri-uncle/dulasiri-federica-group-photo.jpg";
const BEACH_TURTLE_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/dulasiri-uncle/close-up-dulasiri-holding-two-turtles.jpg";
const T_SHIRT_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/dulasiri-uncle/dulasiri-showing-t-shirt.jpg";
const VIDEO_URL =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/dulasiri-uncle/dulasiri-video-with-feberica.mp4";
const VIDEO_POSTER_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/dulasiri-uncle/dulasiri-federica-flowers.jpg";
const TEAM_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/dulasiri-uncle/dulasiri-with-ahangama-com-team.jpg";

const NEXT_ARTICLE = {
  href: "/sri-lankas-most-interesting-coastal-town",
  kicker: "Read Next",
  title: "Sri Lanka's Most Interesting Coastal Town",
  image:
    "https://content.r9cdn.net/rimg/dimg/09/d4/c553223f-city-304822-172c638b4d6.jpg?crop=true&width=1366&height=768&xhint=1254&yhint=1207",
};

const MENTIONED_PLACE_LINKS = [
  {
    label: "Marshmallow Cafe",
    matchLabels: ["Marshmallow Cafe"],
    href: "https://www.google.com/search?q=Marshmallow+Cafe+Ahangama",
  },
  {
    label: "Ahangama Town",
    matchLabels: ["Ahangama town", "Ahangama Town"],
    href: "https://www.google.com/search?q=Ahangama+Town",
  },
  {
    label: "Sri Lanka",
    matchLabels: ["Sri Lanka", "Sri Lankan"],
    href: "https://www.google.com/search?q=Sri+Lanka",
  },
];

const articleIntroduction = [
  "I don't remember exactly when I met Dulasiri for the first time. I think I was at Marshmallow Cafe, and I immediately felt something very genuine about him, an authenticity that doesn't happen so often, something you can sense and that just feels true.",
  "Our friendship grew slowly, little by little, until one day I found myself invited to his place for his birthday.",
  "The moment I arrived, I felt that warmth I love so much in Sri Lankan families, one of those moments where words aren't needed, where you just exist in a still presence, a blend of spice, perfume, food, and laughter.",
];

const articleSections = [
  {
    title: "That Simple, Genuine Laughter",
    body: [
      "That simple, genuine laughter. Something I think I had never quite experienced within a family before.",
      "But what moved me most was seeing how happy Dulasiri was in his place. I loved walking through the garden around his house, seeing flowers and leaves I had never seen in my life, and he loves to take you around, quietly passing on the simple love he has for where he comes from.",
    ],
  },
  {
    title: "The Tuk-Tuk Ride Back",
    body: [
      "When it was time to leave, I asked if he needed a lift into Ahangama town, and in the tuk-tuk, he gently rested his head on my shoulder.",
      "I watched the cinnamon fields pass by, feeling surrounded by friendship, by something warm and real, by a deep affection for him and for this country.",
    ],
    quote:
      "I love Sri Lanka for so many reasons, and being close to his world, both inside and out, only makes me understand more deeply how much this place has to give.",
  },
  {
    title: "A Quiet Confirmation",
    body: [
      "Now, writing this and sitting with that memory, it becomes a feeling of gratitude and peace that settles through my whole body, a quiet confirmation of why I chose Sri Lanka as my home.",
    ],
  },
];

function renderMentionedKeywordText(text) {
  const matches = [];

  MENTIONED_PLACE_LINKS.forEach((link) => {
    const labels = link.matchLabels || [link.label];

    labels.forEach((label) => {
      let searchIndex = 0;
      const normalizedText = text.toLowerCase();
      const normalizedLabel = label.toLowerCase();

      while (searchIndex < text.length) {
        const foundIndex = normalizedText.indexOf(normalizedLabel, searchIndex);

        if (foundIndex === -1) break;

        const endIndex = foundIndex + label.length;
        const overlaps = matches.some(
          (match) => foundIndex < match.end && endIndex > match.start,
        );

        if (!overlaps) {
          matches.push({
            ...link,
            start: foundIndex,
            end: endIndex,
          });
        }

        searchIndex = endIndex;
      }
    });
  });

  if (!matches.length) return text;

  matches.sort((left, right) => left.start - right.start);

  const segments = [];
  let cursor = 0;

  matches.forEach((match) => {
    if (cursor < match.start) {
      segments.push(text.slice(cursor, match.start));
    }

    const matchedText = text.slice(match.start, match.end);

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
        {matchedText}
      </a>,
    );

    cursor = match.end;
  });

  if (cursor < text.length) {
    segments.push(text.slice(cursor));
  }

  return segments;
}

export default function DulasiriUnclePage() {
  const canonical = absUrl(DULASIRI_UNCLE_PATH);
  const publishDate = "2026-06-13T09:00:00.000Z";

  return (
    <SiteLayout navOverlayHero>
      <Seo
        title="Dulasiri Uncle"
        description="Words by Federica Lazza. A quiet personal story about friendship, family warmth, and gratitude in Ahangama."
        canonical={canonical}
        ogImage={HERO_IMAGE}
        ogType="article"
        author="Federica Lazza"
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
                        "linear-gradient(90deg, rgba(10,14,18,0.82) 0%, rgba(10,14,18,0.74) 20%, rgba(10,14,18,0.5) 38%, rgba(10,14,18,0.2) 56%, rgba(10,14,18,0.04) 74%, rgba(10,14,18,0) 100%)",
                      pointerEvents: "none",
                      zIndex: 2,
                    }}
                  />
                  <img
                    className="home-hero-image"
                    src={HERO_IMAGE}
                    alt="Dulasiri Uncle with Federica and friends"
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
                      maxWidth: 620,
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
                      {["Personal Essay", "Ahangama Editorial"].map((item) => (
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
                        Dulasiri
                      </span>
                      <span
                        className="home-hero-titleLine"
                        style={{ color: "#FFFFFF" }}
                      >
                        Uncle
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
                      Words by Federica Lazza
                    </Text>

                    <Paragraph
                      style={{
                        marginTop: 24,
                        marginBottom: 22,
                        maxWidth: 520,
                        color: "#FFFFFF",
                        fontSize: "clamp(16px, 1.45vw, 19px)",
                        lineHeight: 1.72,
                      }}
                    >
                      A quiet personal story about friendship, family warmth,
                      and the feeling of choosing Sri Lanka as home.
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
                {renderMentionedKeywordText(paragraph)}
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
                src={CLOSE_UP_IMAGE}
                alt="Dulasiri holding two turtles"
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
                {index === 0 ? (
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
                      src={BEACH_TURTLE_IMAGE}
                      alt="Dulasiri on the beach holding a turtle"
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
                      src={T_SHIRT_IMAGE}
                      alt="Dulasiri showing a t-shirt"
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
                          color: "#55514B",
                          marginBottom: 18,
                        }}
                      >
                        {renderMentionedKeywordText(paragraph)}
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
                        {renderMentionedKeywordText(section.quote)}
                      </blockquote>
                    ) : null}
                  </div>
                </section>

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
                      src={TEAM_IMAGE}
                      alt="Dulasiri with the ahangama.com team"
                      style={{
                        display: "block",
                        width: "100%",
                        maxWidth: 600,
                        aspectRatio: "4 / 5",
                        objectFit: "cover",
                        boxShadow: "0 16px 36px rgba(18,24,22,0.10)",
                      }}
                    />
                    <video
                      controls
                      playsInline
                      preload="metadata"
                      poster={VIDEO_POSTER_IMAGE}
                      style={{
                        display: "block",
                        width: "100%",
                        maxWidth: 600,
                        aspectRatio: "4 / 5",
                        objectFit: "cover",
                        background: "#1f1d1a",
                        boxShadow: "0 16px 36px rgba(18,24,22,0.10)",
                      }}
                    >
                      <source src={VIDEO_URL} type="video/mp4" />
                    </video>
                  </div>
                ) : null}
              </React.Fragment>
            ))}
          </div>

          <div
            style={{
              marginTop: 18,
              marginBottom: 28,
              paddingTop: 18,
              paddingBottom: 18,
              borderTop: "1px solid rgba(47,62,58,0.08)",
              borderBottom: "1px solid rgba(47,62,58,0.08)",
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
                display: "flex",
                flexWrap: "wrap",
                gap: "8px 12px",
              }}
            >
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
            </div>
          </div>

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
