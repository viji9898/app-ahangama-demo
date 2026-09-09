import React, { useRef } from "react";
import { ArrowRightOutlined, WhatsAppOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import SiteLayout from "../components/layout/SiteLayout";
import EditorialNextArticle from "../components/ui/EditorialNextArticle";
import { trackArticleEvent } from "../analytics";
import useArticleEngagement from "../hooks/useArticleEngagement";
import useTrackedImpression from "../hooks/useTrackedImpression";

const { Paragraph, Text, Title } = Typography;

export const THE_MUGATIYA_HERITAGE_VILLA_PATH =
  "/the-mugatiya-a-heritage-villa-made-for-slower-days-in-ahangama";

const BASE_IMAGE_URL =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/the-mugatiya-a-heritage-villa-made-for-slower-days-in-ahangama";

const HERO_IMAGE = `${BASE_IMAGE_URL}/hero-image-the-mugatiya-infinity-pool-paddy-view-ahangama.jpg.jpg`;
const FEATURE_IMAGE = `${BASE_IMAGE_URL}/wide-feature-the-mugatiya-heritage-villa-courtyard-garden-ahangama.webp`;
const POOL_PAVILION_IMAGE = `${BASE_IMAGE_URL}/the-mugatiya-pool-pavilion-tropical-garden-ahangama.jpg`;
const INTERIOR_IMAGE = `${BASE_IMAGE_URL}/the-mugatiya-heritage-villa-interior-ahangama.webp`;
const BREAKFAST_IMAGE = `${BASE_IMAGE_URL}/the-mugatiya-breakfast-verandah-garden-view-ahangama.jpg`;
const VILLA_VIEW_IMAGE = `${BASE_IMAGE_URL}/view-from-inside-the-villa-looking-out-across-a-table-and-two-chairs.webp`;
const POOLSIDE_IMAGE = `${BASE_IMAGE_URL}/the-mugatiya-poolside-relaxing-ahangama.jpg`;

const publishDate = "2026-09-08T09:00:00.000Z";
const CONTENT_ID =
  "the-mugatiya-a-heritage-villa-made-for-slower-days-in-ahangama";
const CONTENT_TITLE =
  "The Mugatiya: A Heritage Villa Made for Slower Days in Ahangama";
const ARTICLE_CATEGORY = "stay_story";
const AUTHOR_NAME = "Freda";
const OWNER_WHATSAPP_LINK = "https://wa.me/6590056445";

const articleIntroduction = [
  "There are villas that perform luxury, and there are houses that remember.",
  "In Ahangama, on Sri Lanka's south coast, one such house sits on more than an acre of garden, fruit trees and paddy light. The Mugatiya is an Arachchi Gedara brought back to life, with jackwood doors and windows saved from the original building, and timber and stone meeting traditional concrete. Its verandahs open to the garden, fireflies arrive at dusk, and at night, the stars do the rest.",
  "The Mugatiya feels less like a conventional villa and more like a love letter to Ceylon that guests are invited to inhabit for a while.",
];

const articleSections = [
  {
    id: "the-house-that-kept-its-bones",
    title: "The House That Kept Its Bones",
    body: [
      "Guest rooms sit apart from the old heart of the estate, allowing the original house to remain a place for dining, gathering and lingering. Four en-suite rooms look across the property, with rain showers, ceiling fans and space for two families, a group of friends, or simply a week without a schedule.",
      "The infinity pool may be the postcard, but the surroundings are the real gift. Mature coconut and mango trees offer shade and fruit, while emerald paddies change colour through the day. A pool pavilion, breakfast kitchen and long verandahs create spaces where guests can be together or disappear for a while.",
      "Mornings begin with birds, and sometimes monkeys. Evenings end with the kind of darkness that cities have forgotten.",
    ],
  },
  {
    id: "south-of-the-postcard-north-of-the-crowd",
    title: "South of the Postcard, North of the Crowd",
    body: [
      "Ahangama is not the loudest stretch of Sri Lanka's south coast, and that is part of its appeal. Surf points including Midigama, Kabalana and quieter coves are only minutes away. Galle Fort is a short drive away, with Dutch walls, its lighthouse, old streets and sunsets over stone and sea.",
      "You can spend a day in the waves and an afternoon walking the ramparts. Or you can stay. The garden is large enough that staying there does not feel like missing anything.",
    ],
  },
  {
    id: "what-people-take-home",
    title: "What People Take Home",
    body: [
      "Guests talk less about amenities than about Sampath, who cooks and looks after the house as if it were his own. They remember breakfast, children disappearing into the garden, and nights when the pool holds the last of the heat and the paddy holds the last of the light.",
      "Heritage without costume. Service without performance. A private pool looking towards fields rather than traffic.",
      "The Mugatiya is for families and friends who want a whole house rather than a corridor of rooms. For people who would rather share a verandah than a lobby, and for travellers who came to Sri Lanka for air, water and the feeling that the island has not been entirely rewritten.",
    ],
  },
  {
    id: "the-invitation",
    title: "The Invitation",
    body: [
      "Drink this water. Breathe this air. Live this life.",
      "More awaits beyond the estate - Galle's walls, the south coast's surf breaks, temples in the green and fruit falling in the garden - but the house itself is the destination.",
      "Come for the pool if you must. Stay for the dark, the food and the sense that someone has been keeping this place ready for you.",
    ],
  },
];

const PLACE_LINKS = [
  {
    label: "The Mugatiya",
    href: "https://www.instagram.com/villamugatiya/",
  },
  {
    label: "Midigama",
    href: "https://www.google.com/maps/search/?api=1&query=Midigama%2C%20Sri%20Lanka",
  },
  {
    label: "Kabalana",
    href: "https://www.google.com/maps/search/?api=1&query=Kabalana%20Beach%2C%20Sri%20Lanka",
  },
  {
    label: "Galle Fort",
    href: "https://www.google.com/maps/search/?api=1&query=Galle%20Fort%2C%20Sri%20Lanka",
  },
];

const FEATURED_VENUES = [
  {
    ...PLACE_LINKS[0],
    label: "The Mugatiya Villa",
    note: "A restored Arachchi Gedara set among gardens, fruit trees and paddy fields in Ahangama.",
  },
  {
    ...PLACE_LINKS[1],
    note: "A nearby south-coast surf village with breaks for different levels and conditions.",
  },
  {
    ...PLACE_LINKS[2],
    note: "A broad beach and celebrated surf point a short drive from the villa.",
  },
  {
    ...PLACE_LINKS[3],
    note: "The historic fortified city for old streets, sea walls and sunset walks.",
  },
];

const NEXT_ARTICLE = {
  href: "/petals-ahangama-a-dream-rooted-in-legacy",
  kicker: "Read Next",
  title: "Petals Ahangama: A Dream Rooted in Legacy",
  image:
    "https://res.cloudinary.com/dp7in4ulw/image/upload/w_1200,h_630,c_fill,q_auto,f_auto/v1787205024/Hero_Image_-_Petals-entrance-with-sign_ismfmq.jpg",
};

function trackOutboundClick(link, articleSection, componentLocation) {
  const linkType = link.href.includes("wa.me")
    ? "whatsapp"
    : link.href.includes("instagram.com")
      ? "instagram"
      : link.href.includes("google.com/maps")
        ? "map"
        : "external";

  trackArticleEvent("article_outbound_click", {
    content_id: CONTENT_ID,
    content_title: CONTENT_TITLE,
    article_category: ARTICLE_CATEGORY,
    author_name: AUTHOR_NAME,
    article_section: articleSection,
    component_location: componentLocation,
    destination_url: link.href,
    link_type: linkType,
  });
}

function renderLinkedText(text, articleSection) {
  const matches = [];

  [...PLACE_LINKS]
    .sort((left, right) => right.label.length - left.label.length)
    .forEach((link) => {
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
    if (cursor < match.start) segments.push(text.slice(cursor, match.start));
    segments.push(
      <a
        key={`${match.label}-${match.start}`}
        href={match.href}
        onClick={() =>
          trackOutboundClick(match, articleSection, "article_body")
        }
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

  if (cursor < text.length) segments.push(text.slice(cursor));
  return segments;
}

function ArticleParagraph({ articleSection, children }) {
  return (
    <Paragraph
      style={{
        maxWidth: 1200,
        marginBottom: 18,
        color: "#55514B",
        fontSize: 16,
        lineHeight: 1.8,
      }}
    >
      {renderLinkedText(children, articleSection)}
    </Paragraph>
  );
}

function EditorialImage({ src, alt, portrait = false }) {
  return (
    <div
      style={{
        width: portrait ? "min(100%, 760px)" : "100%",
        margin: "8px auto 28px",
        aspectRatio: portrait ? "4 / 5" : "3 / 2",
        overflow: "hidden",
        boxShadow: "0 16px 40px rgba(18,24,22,0.12)",
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center center",
        }}
      />
    </div>
  );
}

function EditorialPortraitPair({ images }) {
  return (
    <div
      className="mugatiya-portrait-pair"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 24,
        margin: "8px auto 28px",
        width: "100%",
        maxWidth: 1224,
      }}
    >
      {images.map((image) => (
        <img
          key={image.src}
          src={image.src}
          alt={image.alt}
          loading="lazy"
          decoding="async"
          style={{
            display: "block",
            width: "100%",
            aspectRatio: "4 / 5",
            objectFit: "cover",
            objectPosition: "center center",
            boxShadow: "0 16px 36px rgba(18,24,22,0.10)",
          }}
        />
      ))}
    </div>
  );
}

function ArticleSection({ section, first = false, impressedSectionIds }) {
  const sectionRef = useTrackedImpression({
    itemId: section.id,
    impressedItemIds: impressedSectionIds,
    onImpression: () =>
      trackArticleEvent("article_section_view", {
        content_id: CONTENT_ID,
        content_title: CONTENT_TITLE,
        article_category: ARTICLE_CATEGORY,
        author_name: AUTHOR_NAME,
        article_section: section.id,
        component_location: "article_body",
      }),
  });

  return (
    <section
      id={section.id}
      ref={sectionRef}
      style={{
        padding: first ? "20px 0 36px" : "36px 0",
        borderTop: first ? "none" : "1px solid rgba(47,62,58,0.12)",
      }}
    >
      <div style={{ maxWidth: 1180 }}>
        <Title level={2} style={{ marginTop: 0, marginBottom: 18 }}>
          {section.title}
        </Title>
        {section.body.map((paragraph) => (
          <ArticleParagraph articleSection={section.id} key={paragraph}>
            {paragraph}
          </ArticleParagraph>
        ))}
        {section.id === "the-invitation" ? (
          <a
            href={OWNER_WHATSAPP_LINK}
            onClick={() =>
              trackOutboundClick(
                { href: OWNER_WHATSAPP_LINK },
                section.id,
                "article_body_cta",
              )
            }
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              marginTop: 8,
              padding: "12px 18px",
              border: "1px solid #2f2a24",
              color: "#2f2a24",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <WhatsAppOutlined style={{ fontSize: 17 }} />
            Book directly with the owners · +65 9005 6445
          </a>
        ) : null}
      </div>
    </section>
  );
}

export default function TheMugatiyaHeritageVillaPage() {
  const canonical = absUrl(THE_MUGATIYA_HERITAGE_VILLA_PATH);
  const articleBodyRef = useRef(null);
  const impressedSectionIds = useRef(new Set());

  useArticleEngagement({
    articleRef: articleBodyRef,
    contentId: CONTENT_ID,
    contentTitle: CONTENT_TITLE,
    articleCategory: ARTICLE_CATEGORY,
    authorName: AUTHOR_NAME,
  });

  return (
    <SiteLayout navOverlayHero>
      <Seo
        title="The Mugatiya: A Heritage Villa Made for Slower Days in Ahangama"
        description="A restored Arachchi Gedara in Ahangama, where old timber, open gardens, paddy fields and quiet days come together."
        canonical={canonical}
        ogImage={HERO_IMAGE}
        ogType="article"
        author="Freda"
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
                    zIndex: 2,
                    background:
                      "linear-gradient(90deg, rgba(12,18,14,0.86) 0%, rgba(12,18,14,0.72) 25%, rgba(12,18,14,0.4) 48%, rgba(12,18,14,0.08) 74%, rgba(12,18,14,0) 100%)",
                    pointerEvents: "none",
                  }}
                />
                <img
                  className="home-hero-image"
                  src={HERO_IMAGE}
                  alt="Infinity pool at The Mugatiya overlooking tropical gardens, palm trees and paddy fields in Ahangama"
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
                    maxWidth: 850,
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
                    {["Stay Story", "Ahangama"].map((item) => (
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
                    className="home-hero-title mugatiya-hero-title"
                    style={{
                      margin: 0,
                      color: "#FFFFFF",
                      fontWeight: 500,
                      fontFamily:
                        '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                    }}
                  >
                    {[
                      "The Mugatiya:",
                      "A Heritage Villa",
                      "Made for Slower Days",
                      "in Ahangama",
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
                    Words by Freda
                  </Text>

                  <Paragraph
                    style={{
                      maxWidth: 650,
                      marginTop: 24,
                      marginBottom: 22,
                      color: "#FFFFFF",
                      fontSize: "clamp(16px, 1.45vw, 19px)",
                      lineHeight: 1.72,
                    }}
                  >
                    A restored Arachchi Gedara in Ahangama, where old timber,
                    open gardens, paddy fields and quiet days come together.
                  </Paragraph>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="dm-wrap"
          ref={articleBodyRef}
          style={{ paddingTop: 28 }}
        >
          <div style={{ maxWidth: 920, paddingBottom: 12 }}>
            {articleIntroduction.map((paragraph, index) => (
              <Paragraph
                key={paragraph}
                style={{
                  marginBottom: 18,
                  color: index < 2 ? "#2f2a24" : "#55514B",
                  fontSize: index === 0 ? 22 : 18,
                  lineHeight: index === 0 ? 1.7 : 1.85,
                }}
              >
                {renderLinkedText(paragraph, "introduction")}
              </Paragraph>
            ))}
          </div>

          <EditorialImage
            src={FEATURE_IMAGE}
            alt="Heritage villa buildings and landscaped courtyard garden at The Mugatiya in Ahangama, surrounded by mature tropical trees"
          />
          <ArticleSection
            section={articleSections[0]}
            first
            impressedSectionIds={impressedSectionIds}
          />

          <EditorialPortraitPair
            images={[
              {
                src: POOL_PAVILION_IMAGE,
                alt: "Pool and garden view at The Mugatiya in Ahangama, with a tiled pavilion and tropical greenery",
              },
              {
                src: INTERIOR_IMAGE,
                alt: "Heritage villa interior at The Mugatiya in Ahangama",
              },
            ]}
          />
          <ArticleSection
            section={articleSections[1]}
            impressedSectionIds={impressedSectionIds}
          />

          <EditorialPortraitPair
            images={[
              {
                src: BREAKFAST_IMAGE,
                alt: "Breakfast served on the verandah at The Mugatiya, overlooking tropical gardens, palm trees and paddy fields in Ahangama",
              },
              {
                src: VILLA_VIEW_IMAGE,
                alt: "View from inside The Mugatiya villa across a table and two chairs toward the tropical garden",
              },
            ]}
          />
          <ArticleSection
            section={articleSections[2]}
            impressedSectionIds={impressedSectionIds}
          />

          <EditorialImage
            src={POOLSIDE_IMAGE}
            alt="Guests relaxing with a guitar beside the pool at The Mugatiya, surrounded by tropical gardens and heritage-style villa buildings in Ahangama"
          />
          <ArticleSection
            section={articleSections[3]}
            impressedSectionIds={impressedSectionIds}
          />

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
                marginBottom: 10,
                color: "#6B5A4E",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.4,
                textTransform: "uppercase",
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
              {FEATURED_VENUES.map((venue) => (
                <div
                  key={venue.label}
                  style={{
                    paddingTop: 10,
                    borderTop: "1px solid rgba(47,62,58,0.08)",
                  }}
                >
                  <a
                    href={venue.href}
                    onClick={() =>
                      trackOutboundClick(
                        venue,
                        "places-mentioned",
                        "places_mentioned",
                      )
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      paddingBottom: 1,
                      borderBottom: "1px solid rgba(107,90,78,0.24)",
                      color: "#6B5A4E",
                      fontSize: 13,
                      textDecoration: "none",
                    }}
                  >
                    {venue.label}
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
                    {venue.note}
                  </Text>
                </div>
              ))}
            </div>
          </section>

          <EditorialNextArticle
            {...NEXT_ARTICLE}
            onClick={() =>
              trackArticleEvent("article_next_select", {
                content_id: CONTENT_ID,
                content_title: CONTENT_TITLE,
                article_category: ARTICLE_CATEGORY,
                author_name: AUTHOR_NAME,
                component_location: "article_footer",
                target_content_id: "petals-ahangama-a-dream-rooted-in-legacy",
              })
            }
          />
        </div>
      </div>
    </SiteLayout>
  );
}
