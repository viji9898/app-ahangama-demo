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
  KO_LAKE_VILLA_HERO_IMAGE,
  resolveHeroImage,
} from "../data/articleHeroImages";
import "../styles/abode-boutique-hotels.css";

const { Paragraph, Text, Title } = Typography;

export const ABODE_BOUTIQUE_HOTELS_PATH =
  "/two-sides-of-ahangama-discover-abode-boutique-hotels";

/*
 * IMAGE LINKS — PASTE HERE
 * ------------------------
 * Every photo on the page is wired to a slot below. To add an image, paste
 * its hosted link between the quotes of that slot's `src` field, for example:
 *
 *   wideFeature: {
 *     src: "https://your-image-host.com/abode-ahangama-pool-tropical-gardens.webp",
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
 * Filenames follow the brief in "Abode article.docx".
 */
const IMAGE_BASE_URL = "";

const IMAGE_SLOTS = {
  // HERO — paste the link into ABODE_HERO_IMAGE.src in
  // src/data/articleHeroImages.js
  hero: ABODE_HERO_IMAGE,

  // WIDE FEATURE — pool and tropical gardens at Abode Ahangama
  wideFeature: {
    slotKey: "wideFeature",
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-wide-feature-abode-ahangama-pool-tropical-gardens-a7871b8a.webp", // ← paste wide feature image link here
    filename: "abode-ahangama-pool-tropical-gardens.webp",
    alt: "Swimming pool surrounded by tropical gardens at Abode Ahangama.",
  },

  // PORTRAIT PAIR — Abode Ahangama
  abodeAhangamaBedroomBreakfast: {
    slotKey: "abodeAhangamaBedroomBreakfast",
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-portrait-abode-by-the-beach-bedroom-breakfast-59e6a1f8.webp", // ← paste bedroom / breakfast in bed image link here
    filename: "abode-ahangama-bedroom-breakfast.webp",
    alt: "Breakfast served in a guest room at Abode Ahangama.",
  },
  abodeAhangamaBedroom: {
    slotKey: "abodeAhangamaBedroom",
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-portrait-abode-ahangama-bedroom-92a9f6a9.webp", // ← paste bedroom image link here
    filename: "abode-ahangama-bedroom.webp",
    alt: "Guest bedroom at Abode Ahangama.",
  },

  // PORTRAIT PAIR — Abode by the Beach
  abodeByTheBeachBreakfastCafe: {
    slotKey: "abodeByTheBeachBreakfastCafe",
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-portrait-abode-ahangama-bedroom-breakfast-b44198eb.webp", // ← paste beachfront café breakfast image link here
    filename: "abode-by-the-beach-breakfast-cafe.webp",
    alt: "Breakfast served at the beachfront café at Abode by the Beach.",
  },
  abodeByTheBeachOceanViewRoom: {
    slotKey: "abodeByTheBeachOceanViewRoom",
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-portrait-abode-by-the-beach-ocean-view-room-b24fb232.webp", // ← paste ocean view room image link here
    filename: "abode-by-the-beach-ocean-view-room.webp",
    alt: "Guest room overlooking the ocean at Abode by the Beach.",
  },

  // CLOSING — relaxed poolside or beachfront lifestyle image
  closing: {
    slotKey: "closing",
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-closing-image-fdc457d8.webp", // ← paste closing image link here
    filename: "abode-boutique-hotels-slow-coastal-living.webp",
    alt: "Guests enjoying a relaxed stay at Abode Boutique Hotels in Ahangama.",
  },

  // OG / SOCIAL SHARE — optional; falls back to the hero image
  og: {
    slotKey: "og",
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-og-image-dfff825d.webp", // ← paste social share image link here
    filename: "og-abode-boutique-hotels-ahangama.webp",
    alt: "Abode Boutique Hotels on Sri Lanka's south coast.",
  },
};

function resolveImage(slot) {
  if (!slot) return null;
  if (slot.src) return slot.src;
  if (IMAGE_BASE_URL) return `${IMAGE_BASE_URL}/${slot.filename}`;
  return null;
}

const publishDate = "2026-11-10T09:00:00.000Z";
const CONTENT_ID = "two-sides-of-ahangama-discover-abode-boutique-hotels";
const CONTENT_TITLE = "Two Sides of Ahangama: Discover Abode Boutique Hotels";
const ARTICLE_CATEGORY = "stay_story";
const AUTHOR_NAME = "Abode Boutique Hotels";
const DESCRIPTION =
  "From tropical gardens and slow mornings by the pool to beachfront breakfasts overlooking the surf, discover two distinctive boutique stays on Sri Lanka's south coast.";

const articleIntroduction = [
  "Ahangama has quickly become one of Sri Lanka's most loved coastal destinations. With its surf breaks, vibrant café scene, beautiful beaches and laid-back atmosphere, it's easy to see why travellers often stay longer than planned.",
  "But beyond the busy cafés and surf-filled mornings, there's another side to Ahangama. One where mornings start slowly, days are spent by the pool or ocean, and there is no real reason to rush anywhere.",
  "Abode Boutique Hotels brings together two distinctive properties, each offering a different way to experience the south coast. Whether you're looking for a peaceful tropical hideaway or an intimate beachfront escape, both offer thoughtful design, personalised comfort and a little everyday luxury.",
];

const abodeAhangamaIntro = [
  "Tucked away among lush tropical gardens, Abode Ahangama is a four-bedroom boutique villa offering a peaceful escape while remaining close to Ahangama's beaches, restaurants and surf scene.",
  "At the heart of the property is a swimming pool surrounded by greenery, creating an easy setting for long afternoons in the Sri Lankan sunshine.",
];

const abodeAhangamaRest = [
  "For guests who enjoy staying active while travelling, there is an on-site gym. Those looking to slow down can book in-house massages, making it just as easy to spend the day relaxing at the villa as it is to head out exploring.",
  "Breakfast is included with every stay, while room service means guests can choose breakfast in bed when they want an even slower start.",
];

const abodeByTheBeach = [
  "For those who prefer waking up beside the Indian Ocean, Abode by the Beach offers a different experience.",
  "Set directly along Ahangama's coastline, the intimate boutique property combines minimalist design, ocean views and the relaxed rhythm of life by the sea.",
  "Breakfast is included, with room service available for mornings when staying in feels more appealing than getting up.",
  "One of the highlights is the beachfront café, open daily to both staying guests and outside visitors. Overlooking Devil's Rock and the surf at Sion, it offers a beautiful coastal viewpoint for coffee, breakfast or simply watching the surfers.",
];

const twoUniqueStays = [
  "Although the surroundings are different, both properties share the same approach to hospitality: thoughtful spaces, comfortable details and an atmosphere that encourages guests to slow down.",
  "At Abode Ahangama, the experience is about tropical gardens, poolside afternoons, wellness and privacy. At Abode by the Beach, it is about ocean views, surf and coastal living.",
  "Both offer a welcoming base for discovering Ahangama in a more relaxed way.",
];

const VENUES = [
  {
    name: "Abode Ahangama",
    note: "A tropical four-bedroom boutique villa with a swimming pool, gym, in-house massages and breakfast included.",
    links: [
      {
        label: "Instagram",
        href: "https://www.instagram.com/abode.ahangama",
        linkType: "instagram",
      },
    ],
  },
  {
    name: "Abode by the Beach",
    note: "An intimate oceanfront boutique stay with breakfast included, room service and a beachfront café overlooking Devil's Rock and Sion surf.",
    links: [
      {
        label: "Instagram",
        href: "https://www.instagram.com/abode.bythebeach",
        linkType: "instagram",
      },
      {
        label: "Website",
        href: "https://abodeboutiquehotels.com",
        linkType: "website",
      },
    ],
  },
];

const PLACE_LINKS = [
  {
    label: "Abode Boutique Hotels",
    href: "https://abodeboutiquehotels.com",
    linkType: "website",
  },
  {
    label: "Abode Ahangama",
    href: "https://www.instagram.com/abode.ahangama",
    linkType: "instagram",
  },
  {
    label: "Abode by the Beach",
    href: "https://www.instagram.com/abode.bythebeach",
    linkType: "instagram",
  },
];

const PLACES_MENTIONED = [
  {
    label: "Abode Ahangama",
    href: "https://www.instagram.com/abode.ahangama",
    linkType: "instagram",
    note: "Tropical four-bedroom boutique villa with a pool, gym, in-house massages and breakfast included.",
  },
  {
    label: "Abode by the Beach",
    href: "https://www.instagram.com/abode.bythebeach",
    linkType: "instagram",
    note: "Intimate oceanfront stay with breakfast, room service and a beachfront café.",
  },
  {
    label: "Devil's Rock",
    note: "The headland visible from the beachfront café.",
  },
  {
    label: "Sion surf",
    note: "The surf break in front of Abode by the Beach.",
  },
  {
    label: "Ahangama",
    note: "The south-coast town both properties call home.",
  },
];

const NEXT_ARTICLE = {
  href: "/ko-lake-villa-a-house-shaped-by-koggala-lake",
  kicker: "Read Next",
  title: "Ko Lake Villa: A House Shaped by Koggala Lake",
  image:
    resolveHeroImage(KO_LAKE_VILLA_HERO_IMAGE) ||
    "/ko-lake-villa/placeholder.svg",
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

  PLACE_LINKS.forEach((link) => {
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
        className="abode-landscape-image"
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

function PortraitPair({ images }) {
  return (
    <div
      className="abode-portrait-pair"
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
          <figure key={slot.filename} style={{ margin: 0 }}>
            <div
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
      })}
    </div>
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

function SectionTitle({ children }) {
  return (
    <Title level={2} style={{ marginTop: 0, marginBottom: 18 }}>
      {children}
    </Title>
  );
}

export default function AbodeBoutiqueHotelsPage() {
  const canonical = absUrl(ABODE_BOUTIQUE_HOTELS_PATH);
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
                    hint="Add link in ABODE_HERO_IMAGE.src (src/data/articleHeroImages.js)"
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
                    className="home-hero-title abode-hero-title"
                    style={{
                      margin: "18px 0 0",
                      color: "#ffffff",
                      fontWeight: 500,
                      fontFamily: '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                    }}
                  >
                    {["Two Sides of Ahangama:", "Discover Abode", "Boutique Hotels"].map((line) => (
                      <span key={line} className="home-hero-titleLine" style={{ color: "#ffffff" }}>
                        {line}
                      </span>
                    ))}
                  </Title>
                  <Text style={{ display: "block", marginTop: 14, color: "#ffffff", fontSize: 11, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase" }}>
                    By Abode Boutique Hotels
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

          <section style={{ padding: "20px 0 28px" }}>
            <SectionTitle>Abode Ahangama: Your Tropical Hideaway</SectionTitle>
            <BodyParagraphs
              paragraphs={abodeAhangamaIntro}
              articleSection="abode-ahangama"
            />
          </section>

          <EditorialImage slot={IMAGE_SLOTS.wideFeature} />

          <section style={{ padding: "0 0 8px" }}>
            <BodyParagraphs
              paragraphs={abodeAhangamaRest}
              articleSection="abode-ahangama"
            />
          </section>

          <PortraitPair
            images={[
              IMAGE_SLOTS.abodeAhangamaBedroomBreakfast,
              IMAGE_SLOTS.abodeAhangamaBedroom,
            ]}
          />

          <section
            style={{
              padding: "36px 0 8px",
              borderTop: "1px solid rgba(47,62,58,0.12)",
            }}
          >
            <SectionTitle>Abode by the Beach: Wake Up to the Ocean</SectionTitle>
            <BodyParagraphs
              paragraphs={abodeByTheBeach}
              articleSection="abode-by-the-beach"
            />
          </section>

          <PortraitPair
            images={[
              IMAGE_SLOTS.abodeByTheBeachBreakfastCafe,
              IMAGE_SLOTS.abodeByTheBeachOceanViewRoom,
            ]}
          />

          <section
            style={{
              padding: "36px 0",
              borderTop: "1px solid rgba(47,62,58,0.12)",
            }}
          >
            <SectionTitle>Two Unique Stays, One Abode Experience</SectionTitle>
            <BodyParagraphs
              paragraphs={twoUniqueStays}
              articleSection="two-unique-stays"
            />
          </section>

          <EditorialImage slot={IMAGE_SLOTS.closing} />

          <section
            style={{
              padding: "8px 0 36px",
              borderTop: "1px solid rgba(47,62,58,0.12)",
            }}
          >
            <SectionTitle>Discover Abode Boutique Hotels</SectionTitle>
            <div
              className="abode-venue-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "18px 24px",
              }}
            >
              {VENUES.map((venue) => (
                <div
                  key={venue.name}
                  style={{
                    padding: "18px 20px",
                    border: "1px solid rgba(47,62,58,0.1)",
                    background: "#faf8f4",
                  }}
                >
                  <Text
                    style={{
                      display: "block",
                      marginBottom: 8,
                      color: "#2f2a24",
                      fontFamily:
                        '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                      fontSize: 22,
                      lineHeight: 1.3,
                    }}
                  >
                    {venue.name}
                  </Text>
                  <Text
                    style={{
                      display: "block",
                      color: "#55514B",
                      fontSize: 14,
                      lineHeight: 1.65,
                    }}
                  >
                    {venue.note}
                  </Text>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 16,
                      marginTop: 12,
                    }}
                  >
                    {venue.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={() =>
                          trackOutboundClick(
                            link,
                            "discover-abode",
                            "venue_card",
                          )
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          color: "#8b623d",
                          fontSize: 13,
                          textDecoration: "none",
                        }}
                      >
                        {link.label}
                        <ArrowRightOutlined style={{ fontSize: 11 }} />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ margin: "22px 0 34px", paddingTop: 16 }}>
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
              Places Mentioned
            </Text>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "14px 22px",
              }}
            >
              {PLACES_MENTIONED.map((place) => (
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
                      onClick={() =>
                        trackOutboundClick(
                          place,
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
          </section>

          <EditorialNextArticle {...NEXT_ARTICLE} />
        </div>
      </div>
    </SiteLayout>
  );
}
