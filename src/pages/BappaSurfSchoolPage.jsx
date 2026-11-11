import React, { useRef } from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { trackArticleEvent } from "../analytics";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import SiteLayout from "../components/layout/SiteLayout";
import EditorialNextArticle from "../components/ui/EditorialNextArticle";
import useArticleEngagement from "../hooks/useArticleEngagement";
import {
  ABODE_HERO_IMAGE,
  BAPPA_SURF_SCHOOL_HERO_IMAGE,
  resolveHeroImage,
} from "../data/articleHeroImages";
import "../styles/bappa-surf-school.css";

const { Paragraph, Text, Title } = Typography;

export const BAPPA_SURF_SCHOOL_PATH =
  "/bappa-surf-school-a-local-life-shaped-by-surfing";

/*
 * IMAGE LINKS — PASTE HERE
 * ------------------------
 * Every photo on the page is wired to a slot below. To add an image, paste
 * its hosted link between the quotes of that slot's `src` field, for example:
 *
 *   image01WideFeature: {
 *     src: "https://your-image-host.com/image-01-wide-feature-bappa-paddling.webp",
 *     ...
 *   },
 *
 * Leave a `src` empty ("") to keep the labelled placeholder on the page.
 * Each placeholder on the page names the slot it belongs to, so you can
 * find the right field quickly.
 *
 * The hero image lives in src/data/articleHeroImages.js so the homepage
 * card, /articles index and social preview all use the same file.
 *
 * Filenames follow the brief in
 * "Bappa Surf School_ A Local Life Shaped by Surfing.docx".
 */
const IMAGE_BASE_URL = "";

const IMAGE_SLOTS = {
  // HERO — paste the link into BAPPA_SURF_SCHOOL_HERO_IMAGE.src in
  // src/data/articleHeroImages.js
  hero: BAPPA_SURF_SCHOOL_HERO_IMAGE,

  // IMAGE 01 — WIDE FEATURE
  // Brief: Bappa paddling in the water with his surfboard, showing his
  // connection to surfing and the southern coastline.
  image01WideFeature: {
    slotKey: "image01WideFeature",
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-image-01-wide-feature-7de8ca64.webp", // ← paste Image 01 wide feature link here
    filename: "image-01-wide-feature-bappa-paddling.webp",
    alt: "Bappa paddling on his surfboard in the water near Ahangama.",
  },

  // IMAGE 02 — WIDE FEATURE
  // Brief: Bappa with a group of surfers and their surfboards on the beach
  // before or after a surf session.
  image02WideFeature: {
    slotKey: "image02WideFeature",
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-image-02-wide-feature-8d3c9af8.webp", // ← paste Image 02 wide feature link here
    filename: "image-02-wide-feature-bappa-group-beach.webp",
    alt: "Bappa with a group of surfers and their surfboards on the beach near Ahangama.",
  },

  // IMAGE 03 — WIDE FEATURE
  // Brief: Bappa standing with surfers and a surfboard beside the coastline.
  image03WideFeature: {
    slotKey: "image03WideFeature",
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-image-03-wide-feature-3766ceae.webp", // ← paste Image 03 wide feature link here
    filename: "image-03-wide-feature-bappa-surfers-coast.webp",
    alt: "Bappa standing with surfers and a surfboard beside the coast near Ahangama.",
  },

  // IMAGE 04 — WIDE FEATURE
  // Brief: A quieter water-level image of Bappa paddling on his surfboard,
  // with the ocean surrounding him.
  image04WideFeature: {
    slotKey: "image04WideFeature",
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-image-04-wide-feature-3118445c.webp", // ← paste Image 04 wide feature link here
    filename: "image-04-wide-feature-bappa-ocean-paddle.webp",
    alt: "Bappa paddling on a surfboard in the water near Ahangama.",
  },

  // OG / SOCIAL SHARE — not in the content brief; added for social previews.
  // Falls back to the hero image when left empty.
  og: {
    slotKey: "og",
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-hero-image-bappa-surf-school-feb68f60.webp", // ← paste social share image link here
    filename: "og-bappa-surf-school-ahangama.webp",
    alt: "Bappa Surf School on Sri Lanka's southern coast near Ahangama.",
  },
};

function resolveImage(slot) {
  if (!slot) return null;
  if (slot.src) return slot.src;
  if (IMAGE_BASE_URL) return `${IMAGE_BASE_URL}/${slot.filename}`;
  return null;
}

const publishDate = "2026-11-11T09:00:00.000Z";
const CONTENT_ID = "bappa-surf-school-a-local-life-shaped-by-surfing";
const CONTENT_TITLE =
  "Bappa Surf School: A Local Life Shaped by Surfing";
const ARTICLE_CATEGORY = "surf_culture";
const AUTHOR_NAME = "Tharusha Shanaka";
const DESCRIPTION =
  "From nearly two decades in the water to building his own surf school, G.H. Roshan Pradeep Kumara has made surfing part of everyday life along Sri Lanka's southern coast.";

const articleIntroduction = [
  "Along Sri Lanka's southern coast, surfing is more than simply a sport. For many who spend their lives around the water, it becomes part of a daily rhythm shaped by the ocean, the local community and changing waves.",
  "For G.H. Roshan Pradeep Kumara, that relationship with surfing has developed over nearly 20 years. Known locally by his nickname, \u201cBappa,\u201d Roshan eventually carried the name into the surf school he founded four years ago: Bappa Surf School.",
];

const articleSections = [
  {
    title: "From Experience to a Surf School",
    image: IMAGE_SLOTS.image01WideFeature,
    body: [
      "Roshan spent close to two decades working as a professional surf instructor before establishing his own school. Over the course of his career, he has worked as a surf instructor and lecturer with surf-related organisations including Global Surf Camp, Lapoint Surf and Marshmallow.",
      "Those experiences brought him into contact with surfers from different backgrounds while allowing him to continue developing his own approach to teaching and sharing what he has learned from years in the ocean.",
      "Today, Bappa Surf School is based at its official surf point at Kabalana Beach, one of the well-known surfing areas around Ahangama.",
    ],
  },
  {
    title: "Learning Around Ahangama",
    image: IMAGE_SLOTS.image02WideFeature,
    body: [
      "Lessons also take place at Ahangama Beach and Kathaluwa Beach, depending on the conditions and the experience of the surfer.",
      "Different stretches of coastline can offer different conditions, making the choice of location an important part of a lesson. Roshan's familiarity with the area helps shape where each session takes place.",
      "For someone stepping onto a surfboard for the first time, the process is not only about catching a wave. It also involves becoming comfortable in the water, understanding the ocean and gradually developing confidence.",
    ],
  },
  {
    title: "Knowledge Built in the Water",
    image: IMAGE_SLOTS.image03WideFeature,
    body: [
      "Years spent surfing the southern coastline have given Roshan first-hand familiarity with its beaches, waves and changing conditions.",
      "That local knowledge sits at the centre of Bappa Surf School. Whether someone is experiencing surfing for the first time or already has time in the water, the school reflects Roshan's long-standing connection with the ocean and his approach to sharing what he knows.",
    ],
  },
  {
    title: "One Wave at a Time",
    image: IMAGE_SLOTS.image04WideFeature,
    body: [
      "Ahangama and the surrounding coastline have become closely connected with surfing, with people coming to the area to spend time in the water and experience life along Sri Lanka's southern coast.",
      "After almost 20 years in the surfing world and four years of running Bappa Surf School, Roshan continues to share that experience from Kabalana to Ahangama and Kathaluwa.",
      "At its heart, Bappa Surf School remains a local story built around time in the ocean, knowledge gained through experience and a lasting connection to surfing.",
    ],
  },
];

const BODY_LINKS = [
  {
    label: "Bappa Surf School",
    href: "https://www.facebook.com/p/Bappa-surf-school-61585790611373",
    linkType: "facebook",
  },
  {
    label: "Global Surf Camp",
    href: "https://www.google.com/search?q=Global+Surf+Camp+Ahangama",
    linkType: "search",
  },
  {
    label: "Lapoint Surf",
    href: "https://www.google.com/search?q=Lapoint+Surf+Ahangama",
    linkType: "search",
  },
  {
    label: "Marshmallow",
    href: "https://www.google.com/search?q=Marshmallow+Ahangama",
    linkType: "search",
  },
  {
    label: "Kabalana Beach",
    href: "https://www.google.com/search?q=Kabalana+Beach+Ahangama",
    linkType: "search",
  },
  {
    label: "Ahangama Beach",
    href: "https://www.google.com/search?q=Ahangama+Beach",
    linkType: "search",
  },
  {
    label: "Kathaluwa Beach",
    href: "https://www.google.com/search?q=Kathaluwa+Beach",
    linkType: "search",
  },
].sort((left, right) => right.label.length - left.label.length);

const PLACE_GROUPS = [
  {
    label: "Places Mentioned",
    places: [
      {
        label: "Bappa Surf School",
        href: "https://www.facebook.com/p/Bappa-surf-school-61585790611373",
        linkType: "facebook",
        note: "G.H. Roshan Pradeep Kumara's surf school at Kabalana Beach, Ahangama.",
      },
      {
        label: "Kabalana Beach",
        href: "https://www.google.com/search?q=Kabalana+Beach+Ahangama",
        linkType: "search",
        note: "The school's official surf point and one of Ahangama's best-known breaks.",
      },
      {
        label: "Ahangama",
        href: "/ahangama-sri-lanka",
        linkType: "internal",
        note: "The south-coast town at the centre of this story.",
      },
      {
        label: "Ahangama Beach",
        href: "https://www.google.com/search?q=Ahangama+Beach",
        linkType: "search",
        note: "Another lesson location, chosen depending on the conditions.",
      },
      {
        label: "Kathaluwa Beach",
        href: "https://www.google.com/search?q=Kathaluwa+Beach",
        linkType: "search",
        note: "A nearby beach also used for lessons.",
      },
      {
        label: "Sri Lanka's southern coast",
        note: "The coastline where Roshan has spent nearly two decades in the water.",
      },
    ],
  },
  {
    label: "Surf Organisations Mentioned",
    places: [
      {
        label: "Global Surf Camp",
        href: "https://www.google.com/search?q=Global+Surf+Camp+Ahangama",
        linkType: "search",
        note: "One of the surf organisations where Roshan worked as an instructor and lecturer.",
      },
      {
        label: "Lapoint Surf",
        href: "https://www.google.com/search?q=Lapoint+Surf+Ahangama",
        linkType: "search",
        note: "A surf camp where Roshan taught and continued developing his approach.",
      },
      {
        label: "Marshmallow",
        href: "https://www.google.com/search?q=Marshmallow+Ahangama",
        linkType: "search",
        note: "An Ahangama surf spot and organisation where Roshan also worked.",
      },
    ],
  },
];

const NEXT_ARTICLE = {
  href: "/two-sides-of-ahangama-discover-abode-boutique-hotels",
  kicker: "Read Next",
  title: "Two Sides of Ahangama: Discover Abode Boutique Hotels",
  image:
    resolveHeroImage(ABODE_HERO_IMAGE) ||
    "/abode-boutique-hotels/placeholder.svg",
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

  BODY_LINKS.forEach((link) => {
    let searchIndex = 0;

    while (searchIndex < text.length) {
      const start = text.indexOf(link.label, searchIndex);

      if (start === -1) break;

      const overlaps = matches.some(
        (match) =>
          start < match.end && start + link.label.length > match.start,
      );

      if (!overlaps) {
        matches.push({
          ...link,
          start,
          end: start + link.label.length,
        });
      }

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

function ImagePlaceholder({ filename, alt, hint, align = "center", style }) {
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
          ? "rgba(24,20,16,0.92)"
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
      {hint ? (
        <span
          style={{
            marginTop: 4,
            padding: "4px 10px",
            borderRadius: 999,
            background: isTopRight
              ? "rgba(255,255,255,0.12)"
              : "rgba(139,98,61,0.1)",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 11,
            lineHeight: 1.4,
            color: isTopRight ? "rgba(255,255,255,0.8)" : "#8b623d",
          }}
        >
          {hint}
        </span>
      ) : null}
    </div>
  );
}

function Caption({ children }) {
  if (!children) return null;

  return (
    <figcaption
      style={{
        marginTop: 10,
        color: "#6c6358",
        fontSize: 12,
        lineHeight: 1.55,
      }}
    >
      {children}
    </figcaption>
  );
}

function EditorialImage({ slot }) {
  const src = resolveImage(slot);

  return (
    <figure style={{ margin: "8px auto 28px" }}>
      <div
        className="bappa-landscape-image"
        style={{
          width: "100%",
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
          <ImagePlaceholder
            filename={slot.filename}
            alt={slot.alt}
            hint={
              slot.slotKey
                ? `Add link in IMAGE_SLOTS.${slot.slotKey}.src`
                : undefined
            }
          />
        )}
      </div>
      <Caption>{slot.caption}</Caption>
    </figure>
  );
}

function BodyParagraphs({ paragraphs, articleSection }) {
  return paragraphs.map((paragraph) => (
    <Paragraph
      key={paragraph}
      style={{
        maxWidth: 1120,
        marginBottom: 18,
        color: "#55514B",
        fontSize: 16,
        lineHeight: 1.8,
      }}
    >
      {renderLinkedText(paragraph, articleSection)}
    </Paragraph>
  ));
}

function PlaceGroup({ group }) {
  return (
    <div style={{ marginTop: group.label === "Places Mentioned" ? 0 : 28 }}>
      <Text
        style={{
          display: "block",
          marginBottom: 10,
          color: "#8b623d",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 1.4,
          textTransform: "uppercase",
        }}
      >
        {group.label}
      </Text>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "14px 22px",
        }}
      >
        {group.places.map((place) => (
          <div
            key={place.label}
            style={{
              paddingTop: 10,
              borderTop: "1px solid rgba(47,62,58,0.08)",
            }}
          >
            {place.href ? (
              <a
                href={place.href}
                onClick={
                  place.linkType === "internal"
                    ? undefined
                    : () =>
                        trackOutboundClick(
                          place,
                          "places-mentioned",
                          "places_mentioned",
                        )
                }
                target={place.linkType === "internal" ? undefined : "_blank"}
                rel={
                  place.linkType === "internal"
                    ? undefined
                    : "noopener noreferrer"
                }
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  color: "#8b623d",
                  fontSize: 13,
                  textDecoration: "none",
                }}
              >
                {place.label}
                <ArrowRightOutlined style={{ fontSize: 11 }} />
              </a>
            ) : (
              <Text
                style={{
                  display: "inline-block",
                  color: "#2f2a24",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {place.label}
              </Text>
            )}
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
    </div>
  );
}

export default function BappaSurfSchoolPage() {
  const canonical = absUrl(BAPPA_SURF_SCHOOL_PATH);
  const articleBodyRef = useRef(null);
  const heroSrc = resolveImage(IMAGE_SLOTS.hero);
  const ogImage = resolveImage(IMAGE_SLOTS.og) || heroSrc;

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
                    hint="Add link in BAPPA_SURF_SCHOOL_HERO_IMAGE.src (src/data/articleHeroImages.js)"
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
                    Surf Culture · Ahangama
                  </Text>
                  <Title
                    className="home-hero-title bappa-hero-title"
                    style={{
                      margin: "18px 0 0",
                      color: "#ffffff",
                      fontWeight: 500,
                      fontFamily: '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                    }}
                  >
                    {["Bappa Surf School:", "A Local Life Shaped", "by Surfing"].map((line) => (
                      <span key={line} className="home-hero-titleLine" style={{ color: "#ffffff" }}>
                        {line}
                      </span>
                    ))}
                  </Title>
                  <Text style={{ display: "block", marginTop: 14, color: "#ffffff", fontSize: 11, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase" }}>
                    By Tharusha Shanaka
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

          {articleSections.map((section, index) => (
            <section
              key={section.title}
              style={{
                padding: index === 0 ? "20px 0 36px" : "36px 0",
                borderTop:
                  index === 0 ? "none" : "1px solid rgba(47,62,58,0.12)",
              }}
            >
              <Title level={2} style={{ marginTop: 0, marginBottom: 18 }}>
                {section.title}
              </Title>
              <EditorialImage slot={section.image} />
              <BodyParagraphs
                paragraphs={section.body}
                articleSection={section.title.toLowerCase().replaceAll(" ", "-")}
              />
            </section>
          ))}

          <section style={{ margin: "22px 0 34px", paddingTop: 16 }}>
            {PLACE_GROUPS.map((group) => (
              <PlaceGroup key={group.label} group={group} />
            ))}
          </section>

          <EditorialNextArticle {...NEXT_ARTICLE} />
        </div>
      </div>
    </SiteLayout>
  );
}
