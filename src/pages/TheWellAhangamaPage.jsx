import React, { useRef } from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { trackArticleEvent } from "../analytics";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import SiteLayout from "../components/layout/SiteLayout";
import EditorialNextArticle from "../components/ui/EditorialNextArticle";
import useArticleEngagement from "../hooks/useArticleEngagement";
import { THE_WELL_HERO_IMAGE } from "../data/articleHeroImages";
import "../styles/the-well-ahangama.css";

const { Paragraph, Text, Title } = Typography;

export const THE_WELL_AHANGAMA_PATH =
  "/the-well-a-home-away-from-home-in-ahangama";

/*
 * IMAGE PLACEHOLDERS
 * ------------------
 * The article is wired with labelled placeholders so the layout is ready
 * before the photography arrives. To swap them in, either:
 *
 *   1. Set IMAGE_BASE_URL to the uploaded image folder (for example the
 *      article's S3 folder), and every slot below resolves to
 *      `${IMAGE_BASE_URL}/${filename}` automatically, or
 *   2. Give an individual slot a `src` value to point at one file.
 *
 * Suggested filenames follow the brief in "The Well article.docx".
 * Reference folder: https://drive.google.com/drive/folders/1qrSWVCuL01u_0-X3ARH6xETqPNbtXEs3
 */
const IMAGE_BASE_URL = "";

const IMAGE_SLOTS = {
  hero: THE_WELL_HERO_IMAGE,
  wideFeature: {
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-wide-feature-image-the-well-ahangama-rooms-greenery-bbbfa491.webp",
    filename: "the-well-ahangama-rooms-greenery.webp",
    alt: "Glass doors and white curtains beneath hanging greenery outside the rooms at The Well in Ahangama.",
  },
  surfer: {
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-potrait-left-the-well-ahangama-surfer-with-board-0240b830.webp",
    filename: "the-well-ahangama-surfer-with-board.webp",
    alt: "Surfer holding a board in the tropical garden at The Well in Ahangama.",
  },
  yellowSurfboard: {
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-potrait-right-the-well-ahangama-yellow-surfboard-garden-3ed12711.webp",
    filename: "the-well-ahangama-yellow-surfboard-garden.webp",
    alt: "Yellow surfboard lying on the grass beneath banana plants at The Well in Ahangama.",
  },
  yoga: {
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-portrait-left-the-well-ahangama-yoga-session-40bdd097.webp",
    filename: "the-well-ahangama-yoga-session.webp",
    alt: "Yoga session at The Well in Ahangama.",
  },
  guests: {
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-portrait-right-the-well-ahangama-guests-community-6a51da54.webp",
    filename: "the-well-ahangama-guests-community.webp",
    alt: "Guests spending time together at The Well in Ahangama.",
  },
  og: {
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-og-image-the-well-ahangama-pool-f4484b76.webp",
    filename: "og-the-well-ahangama-pool.webp",
    alt: "Swimming pool beside a stone wall and tropical greenery at The Well in Ahangama.",
  },
};

function resolveImage(slot) {
  if (!slot) return null;
  if (slot.src) return slot.src;
  if (IMAGE_BASE_URL) return `${IMAGE_BASE_URL}/${slot.filename}`;
  return null;
}

const publishDate = "2026-10-30T09:00:00.000Z";
const CONTENT_ID = "the-well-a-home-away-from-home-in-ahangama";
const CONTENT_TITLE = "The Well: A Home Away from Home in Ahangama";
const ARTICLE_CATEGORY = "stay_story";
const AUTHOR_NAME = "The Well";
const DESCRIPTION =
  "A place shaped around well-being, surf, yoga and the connections that come with travelling.";

const articleIntroduction = [
  "The Well began with a simple vision: a home away from home for travellers from all over the world. We wanted a place to create memories centred on well-being, surfing, and yoga, and to share it with people who love the same things.",
  "We combined our passions into a space for relaxation and mindfulness, close to the ocean and its wonderful waves on Sri Lanka's south-west coast.",
];

const articleSections = [
  {
    title: "Steps from the beach and the waves",
    body: [
      "The beach is just 50 metres from our door, and the Marshmallow surf point is right here too. Wake up, grab your board, and be in the water within minutes. Beginners and experienced surfers alike can build their days around the ocean.",
    ],
    images: [IMAGE_SLOTS.surfer, IMAGE_SLOTS.yellowSurfboard],
  },
  {
    title: "Surf, yoga, and community",
    body: [
      "Start your morning on the mat, spend the day in the water, and end it with sunset and stories shared with fellow travellers. As a hostel, The Well is built for connection. Solo travellers arrive as strangers and often leave as friends.",
    ],
    quote: "Solo travellers arrive as strangers and often leave as friends.",
  },
  {
    title: "What makes The Well special",
    body: [
      "It's the balance. Ahangama has a laid-back energy and world-class surf, and The Well gives you both: active when you want it, calm when you need it. The atmosphere is warm and welcoming, closer to staying with friends than checking into a hostel.",
    ],
  },
  {
    title: "Come stay with us",
    body: [
      "If you want a base in Ahangama where you can surf, practise yoga, rest, and meet people from around the world, we'd love to welcome you to The Well.",
    ],
    images: [IMAGE_SLOTS.yoga, IMAGE_SLOTS.guests],
  },
];

const PLACE_LINKS = [
  {
    label: "The Well",
    href: "https://www.instagram.com/thewell_ahangama/",
    linkType: "instagram",
    linkInBody: false,
  },
  {
    label: "Marshmallow surf point",
    href: "https://share.google/3M1nDK7KFkYscN3eh",
    linkType: "map",
  },
];

const FEATURED_VENUES = [
  {
    ...PLACE_LINKS[0],
    note: "A home away from home for surfers, yogis and travellers, 50 metres from the beach in Ahangama.",
    secondaryLinks: [
      {
        label: "Website",
        href: "https://www.thewell-srilanka.com/",
        linkType: "website",
      },
    ],
  },
  {
    ...PLACE_LINKS[1],
    label: "Marshmallow Surf Point",
    note: "The surf point minutes from The Well's door.",
  },
];

const NEXT_ARTICLE = {
  href: "/villa-alba-a-boutique-hotel-with-a-commitment-to-those-who-built-it",
  kicker: "Read Next",
  title:
    "Villa Alba: A Boutique Hotel with a Commitment to Those Who Built It",
  image:
    "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/villa-alba-a-boutique-hotel-with-a-commitment-to-those-who-built-it/Hero+-+Villa+Alba+aerial+with+surrounding+paddy+fields.webp",
};

function trackOutboundClick(link, articleSection, componentLocation) {
  trackArticleEvent("article_outbound_click", {
    content_id: CONTENT_ID,
    content_title: CONTENT_TITLE,
    article_category: ARTICLE_CATEGORY,
    author_name: AUTHOR_NAME,
    article_section: articleSection,
    component_location: componentLocation,
    destination_url: link.href,
    link_type: link.linkType,
  });
}

function renderLinkedText(text, articleSection) {
  const matches = [];

  PLACE_LINKS.filter((link) => link.linkInBody !== false).forEach((link) => {
    let searchIndex = 0;
    while (searchIndex < text.length) {
      const start = text.indexOf(link.label, searchIndex);
      if (start === -1) break;
      matches.push({ ...link, start, end: start + link.label.length });
      searchIndex = start + link.label.length;
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
        key={`${articleSection}-${match.start}`}
        href={match.href}
        onClick={() => trackOutboundClick(match, articleSection, "article_body")}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "#2f2a24",
          textDecoration: "none",
          borderBottom: "1px solid rgba(163,119,70,0.75)",
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

function ImagePlaceholder({ filename, alt, align = "center", style }) {
  const isTopRight = align === "topRight";

  return (
    <div
      aria-label={`Image placeholder: ${alt}`}
      role="img"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isTopRight ? "flex-end" : "center",
        justifyContent: isTopRight ? "flex-start" : "center",
        gap: 8,
        width: "100%",
        height: "100%",
        padding: isTopRight ? "clamp(28px, 4vw, 56px)" : "clamp(20px, 3vw, 36px)",
        textAlign: isTopRight ? "right" : "center",
        background: isTopRight
          ? "rgba(20,28,24,0.92)"
          : "linear-gradient(135deg, #f2ede4 0%, #e7dfd2 100%)",
        border: isTopRight ? "none" : "1px dashed rgba(139,98,61,0.45)",
        boxSizing: "border-box",
        ...style,
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 1.6,
          textTransform: "uppercase",
          color: isTopRight ? "rgba(255,255,255,0.72)" : "#8b623d",
        }}
      >
        Image placeholder
      </span>
      <span
        style={{
          fontFamily: '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
          fontSize: isTopRight ? "clamp(15px, 1.6vw, 20px)" : "clamp(16px, 2vw, 22px)",
          lineHeight: 1.35,
          color: isTopRight ? "#ffffff" : "#3b352d",
          maxWidth: 560,
        }}
      >
        {filename}
      </span>
      <span
        style={{
          fontSize: 12,
          lineHeight: 1.5,
          maxWidth: 520,
          color: isTopRight ? "rgba(255,255,255,0.66)" : "#6c6358",
        }}
      >
        {alt}
      </span>
    </div>
  );
}

function EditorialImage({ slot }) {
  const src = resolveImage(slot);

  return (
    <div
      className="the-well-landscape-image"
      style={{
        width: "100%",
        margin: "8px auto 28px",
        aspectRatio: "3 / 2",
        overflow: "hidden",
        boxShadow: "0 16px 40px rgba(18,24,22,0.12)",
      }}
    >
      {src ? (
        <img
          src={src}
          alt={slot.alt}
          loading="lazy"
          decoding="async"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <ImagePlaceholder filename={slot.filename} alt={slot.alt} />
      )}
    </div>
  );
}

function PortraitPair({ images }) {
  return (
    <div
      className="the-well-portrait-pair"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: "clamp(12px, 2vw, 24px)",
        width: "100%",
        maxWidth: 1224,
        margin: "8px auto 28px",
      }}
    >
      {images.map((slot) => {
        const src = resolveImage(slot);

        return (
          <div
            key={slot.filename}
            style={{
              aspectRatio: "4 / 5",
              overflow: "hidden",
              boxShadow: "0 16px 36px rgba(18,24,22,0.1)",
            }}
          >
            {src ? (
              <img
                src={src}
                alt={slot.alt}
                loading="lazy"
                decoding="async"
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <ImagePlaceholder filename={slot.filename} alt={slot.alt} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function TheWellAhangamaPage() {
  const canonical = absUrl(THE_WELL_AHANGAMA_PATH);
  const articleBodyRef = useRef(null);
  const heroSrc = resolveImage(IMAGE_SLOTS.hero);
  const ogImage = resolveImage(IMAGE_SLOTS.og);

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
        title={CONTENT_TITLE}
        description={DESCRIPTION}
        canonical={canonical}
        ogImage={ogImage || undefined}
        ogType="article"
        author={AUTHOR_NAME}
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
              background: "#241b14",
              boxShadow: "none",
            }}
          >
            <div style={{ position: "relative", overflow: "hidden", minHeight: "100svh" }}>
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
                      "linear-gradient(90deg, rgba(25,17,11,0.9) 0%, rgba(25,17,11,0.66) 42%, rgba(25,17,11,0.12) 80%)",
                    pointerEvents: "none",
                  }}
                />
                {heroSrc ? (
                  <img
                    className="home-hero-image"
                    src={heroSrc}
                    alt={IMAGE_SLOTS.hero.alt}
                    fetchPriority="high"
                    style={{
                      position: "absolute",
                      inset: 0,
                      zIndex: 1,
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <ImagePlaceholder
                    filename={IMAGE_SLOTS.hero.filename}
                    alt={IMAGE_SLOTS.hero.alt}
                    align="topRight"
                    style={{ position: "absolute", inset: 0, zIndex: 1 }}
                  />
                )}
              </div>

              <div style={{ position: "relative", zIndex: 3, width: "100%", maxWidth: 1100, margin: "0 auto" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    minHeight: "100svh",
                    maxWidth: 920,
                    padding: "clamp(44px, 5vw, 68px) clamp(32px, 4.8vw, 72px) 36px",
                  }}
                >
                  <Text style={{ color: "#ffffff", fontSize: 11, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase" }}>
                    Stay Story · Ahangama
                  </Text>
                  <Title
                    className="home-hero-title the-well-hero-title"
                    style={{
                      margin: "18px 0 0",
                      color: "#ffffff",
                      fontWeight: 500,
                      fontFamily: '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                    }}
                  >
                    {["The Well:", "A Home Away from Home", "in Ahangama"].map((line) => (
                      <span key={line} className="home-hero-titleLine" style={{ color: "#ffffff" }}>
                        {line}
                      </span>
                    ))}
                  </Title>
                  <Text style={{ display: "block", marginTop: 14, color: "#ffffff", fontSize: 11, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase" }}>
                    By The Well
                  </Text>
                  <Paragraph style={{ maxWidth: 670, margin: "24px 0 22px", color: "#ffffff", fontSize: "clamp(16px, 1.45vw, 19px)", lineHeight: 1.72 }}>
                    {DESCRIPTION}
                  </Paragraph>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div ref={articleBodyRef} className="dm-wrap" style={{ paddingTop: 28 }}>
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

          <EditorialImage slot={IMAGE_SLOTS.wideFeature} />

          {articleSections.map((section, index) => (
            <React.Fragment key={section.title}>
              <section
                style={{
                  padding: index === 0 ? "20px 0 36px" : "36px 0",
                  borderTop: index === 0 ? "none" : "1px solid rgba(47,62,58,0.12)",
                }}
              >
                <Title level={2} style={{ marginTop: 0, marginBottom: 18 }}>
                  {section.title}
                </Title>
                {section.body.map((paragraph) => (
                  <Paragraph key={paragraph} style={{ maxWidth: 1120, marginBottom: 18, color: "#55514B", fontSize: 16, lineHeight: 1.8 }}>
                    {renderLinkedText(paragraph, section.title.toLowerCase().replaceAll(" ", "-"))}
                  </Paragraph>
                ))}
                {section.quote ? (
                  <blockquote
                    style={{
                      margin: "10px 0 0",
                      padding: "22px 26px",
                      borderLeft: "3px solid #8b623d",
                      background: "#f6f1e8",
                      color: "#2f2a24",
                      fontFamily: '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                      fontSize: 26,
                      lineHeight: 1.45,
                    }}
                  >
                    {section.quote}
                  </blockquote>
                ) : null}
              </section>

              {section.images ? <PortraitPair images={section.images} /> : null}
            </React.Fragment>
          ))}

          <section style={{ margin: "22px 0 34px", paddingTop: 16 }}>
            <Text style={{ display: "block", marginBottom: 10, color: "#8b623d", fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase" }}>
              Places Mentioned
            </Text>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px 22px" }}>
              {FEATURED_VENUES.map((venue) => (
                <div key={venue.label} style={{ paddingTop: 10, borderTop: "1px solid rgba(47,62,58,0.08)" }}>
                  <a
                    href={venue.href}
                    onClick={() => trackOutboundClick(venue, "places-mentioned", "places_mentioned")}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#8b623d", fontSize: 13, textDecoration: "none" }}
                  >
                    {venue.label}
                    <ArrowRightOutlined style={{ fontSize: 11 }} />
                  </a>
                  <Text style={{ display: "block", marginTop: 7, color: "#55514B", fontSize: 13, lineHeight: 1.55 }}>
                    {venue.note}
                  </Text>
                  {venue.secondaryLinks?.length ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 8 }}>
                      {venue.secondaryLinks.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          onClick={() => trackOutboundClick(link, "places-mentioned", "places_mentioned")}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#8b623d", fontSize: 12, textDecoration: "none", borderBottom: "1px solid rgba(163,119,70,0.35)" }}
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          <EditorialNextArticle {...NEXT_ARTICLE} />
        </div>
      </div>
    </SiteLayout>
  );
}
