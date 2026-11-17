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
  BAPPA_SURF_SCHOOL_HERO_IMAGE,
  ALIIKAI_HERO_IMAGE,
  resolveHeroImage,
} from "../data/articleHeroImages";
import "../styles/aliikai.css";

const { Paragraph, Text, Title } = Typography;

export const ALIIKAI_PATH =
  "/beyond-the-bali-blueprint-building-a-little-piece-of-sri-lanka-at-aliikai";

/*
 * IMAGE LINKS — PASTE HERE
 * ------------------------
 * Every photo on the page is wired to a slot below. To add an image, paste
 * its hosted link between the quotes of that slot's `src` field, for example:
 *
 *   wideFeature: {
 *     src: "https://your-image-host.com/alikai-oceanfront-cafe-ahangama.webp",
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
 * Filenames and labels follow the brief in "Alikai article.docx". The page
 * uses exactly the seven images named in the document:
 *
 *   HERO IMAGE ............... hero-image-aliikai-oceanfront-cafe-ahangama.webp
 *   WIDE FEATURE IMAGE ....... Tharu-alika-cafe-ahangama.webp
 *   PORTRAIT PAIR — FOOD ..... aliikai-sweet-toast-ahangama.webp (left)
 *                              aliikai-panipol-pancakes-ahangama.webp (right)
 *   PORTRAIT IMAGE — EXPERIENCE aliikai-guest-experience-ahangama.webp
 *   CLOSING IMAGE ............ aliikai-cafe-garden-seating-ahangama.jpg
 *   OG / SOCIAL-SHARING IMAGE  og-aliikai-oceanfront-ahangama.webp
 *
 * Each placeholder tagline shows the document's label for that slot.
 * The illustrated-menu alt line in the brief has no filename, so it has
 * no image slot — ask before adding one.
 */
const IMAGE_BASE_URL = "";

const IMAGE_SLOTS = {
  // HERO — paste the link into ALIIKAI_HERO_IMAGE.src in
  // src/data/articleHeroImages.js
  hero: {
    ...ALIIKAI_HERO_IMAGE,
    docLabel: "Hero Image",
  },

  // WIDE FEATURE — Tharu at ALIIKAI, or a wide view of the café in use
  wideFeature: {
    slotKey: "wideFeature",
    docLabel: "Wide Feature Image",
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-portrait-tharu-alika-ocean-view-ahangama-4a74302e.webp", // ← paste wide feature image link here
    filename: "Tharu-alika-cafe-ahangama.webp",
    alt: "Tharu at ALIIKAI café in Ahangama.",
  },

  // PORTRAIT PAIR — FOOD (left: Kade paan sweet toast)
  sweetToast: {
    slotKey: "sweetToast",
    docLabel: "Portrait Pair — Left Image",
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-portrait-aliikai-sweet-toast-ahangama-85d09dc8.webp", // ← paste Kade paan sweet toast image link here
    filename: "aliikai-sweet-toast-ahangama.webp",
    alt: "Kad pan sweet toast served at ALIIKAI in Ahangama.",
  },
  // PORTRAIT PAIR — FOOD (right: Panipol pancakes)
  panipolPancakes: {
    slotKey: "panipolPancakes",
    docLabel: "Portrait Pair — Right Image",
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-portrait-aliikai-panipol-pancakes-ahangama-d99dd067.webp", // ← paste panipol pancakes image link here
    filename: "aliikai-panipol-pancakes-ahangama.webp",
    alt: "Panipol pancakes served at ALIIKAI in Ahangama.",
  },

  // PORTRAIT IMAGE — EXPERIENCE (ice bath)
  guestExperience: {
    slotKey: "guestExperience",
    docLabel: "Portrait Image — Experience",
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-portrait-aliikai-guest-experience-ahangama-f5088faf.webp", // ← paste ice bath / guest experience image link here
    filename: "aliikai-guest-experience-ahangama.webp",
    alt: "A guest taking part in an experience at ALIIKAI in Ahangama.",
  },

  // CLOSING IMAGE — single image
  closingImage: {
    slotKey: "closingImage",
    docLabel: "Closing Image",
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-closing-image-aliikai-cafe-garden-seating-ahangama-82e56ff2.webp", // ← paste closing image link here
    filename: "aliikai-cafe-garden-seating-ahangama.jpg",
    alt: "Garden seating at ALIIKAI café in Ahangama.",
  },

  // OG / SOCIAL SHARE — optional; falls back to the hero image
  og: {
    slotKey: "og",
    docLabel: "OG / Social-Sharing Image",
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-hero-image-and-og-image-97f6182f.webp", // ← paste social share image link here
    filename: "og-aliikai-oceanfront-ahangama.webp",
    alt: "Oceanfront setting at ALIIKAI in Ahangama.",
  },
};

function resolveImage(slot) {
  if (!slot) return null;
  if (slot.src) return slot.src;
  if (IMAGE_BASE_URL) return `${IMAGE_BASE_URL}/${slot.filename}`;
  return null;
}

const publishDate = "2026-11-17T09:00:00.000Z";
const CONTENT_ID =
  "beyond-the-bali-blueprint-building-a-little-piece-of-sri-lanka-at-aliikai";
const CONTENT_TITLE =
  "Beyond the Bali Blueprint: Building a Little Piece of Sri Lanka at ALIIKAI";
const ARTICLE_CATEGORY = "cafe_story";
const AUTHOR_NAME = "Tharu";
const DESCRIPTION =
  "From working nights for a Canadian company to a beach café rooted in Sri Lankan coastal culture, ALIIKAI goes beyond good food and an ocean view.";

const articleIntroduction = [
  "There is no shortage of cafés along Sri Lanka’s southern coast. Many promise good coffee, beautiful interiors and a place to settle in after a morning surf. But when I created ALIIKAI, I wanted it to feel like more than another café by the ocean.",
  "The ocean is part of the setting, but the bigger idea is what happens around it. Food, coffee, matcha, creative activities and a distinctly Sri Lankan sense of place all come together to create somewhere people can spend more time than they originally planned.",
  "Before opening ALIIKAI, I worked as a software project manager for a Canadian company. With a 10.5-hour time difference, much of my work happened at night, leaving my days free to explore Sri Lanka’s south coast.",
  "I spent that time discovering everything from yoga and Pilates to sound healing, ice baths and surf camps. Along the way, I started paying closer attention to the tourism industry, how businesses operated and what kind of contribution I wanted to make.",
];

const biggerReasonBehindIt = [
  "At 25, I decided to take the leap and build my own business.",
  "One of the things that influenced that decision was what I had observed within Sri Lanka’s tourism industry. I had seen foreign-owned businesses operating illegally and failing to meet their tax responsibilities, while local communities were often left feeling the effects.",
  "It made me think differently about what starting a business here could mean.",
  "For me, ALIIKAI became an opportunity to create something that could positively contribute to local lives while still welcoming travellers from around the world.",
  "That thinking also shaped the identity of the café. I didn’t want to create another Bali-inspired space. I wanted ALIIKAI to feel distinctly Sri Lankan and connected to the place it belongs to.",
];

const reworkingFlavours = [
  "That idea continues through the menu.",
  "I worked with a menu consultant over several months to create a concise menu that brings familiar Sri Lankan ingredients and flavours into a contemporary café setting.",
  "Sweet toast uses Sri Lankan bolto sauce. Pancakes are served with panipol, hummus comes with coconut roti, and beef ambul tiyal adds another connection to local food traditions.",
  "Even the coffee follows the same approach. We use 100% Sri Lankan coffee beans and fresh milk wherever possible.",
];

const moreThanSomewhereToEat = [
  "I also wanted ALIIKAI to offer people reasons to stay beyond coffee or lunch.",
  "During our first year, I spent a lot of time at the café, helping maintain the concept and being part of the day-to-day experience. Guests often asked about the story behind the place, the menu and how the business came to be.",
  "Ice baths, painting sessions and other creative experiences became another way to offer something beyond the usual café visit.",
  "This season, I also introduced line-art illustrations and colour pencils to the menus, giving people something to play with while they wait.",
];

const theFeelingIWantPeopleToRemember = [
  "When I think about the future of ALIIKAI, I always come back to one central idea.",
  "I want it to be recognised for representing an authentic Sri Lankan coastal experience — through the food, hospitality, atmosphere and the activities we offer.",
  "I don’t want to replicate what has already been done elsewhere. For me, the opportunity is to celebrate what Sri Lanka already has.",
  "A café with an ocean view is easy to understand. But I want ALIIKAI to offer something more: an experience that feels connected to Sri Lanka, so that when people think back on their time here, they remember more than the view.",
];

const VENUES = [
  {
    name: "ALIIKAI",
    note: "A beach café in Ahangama, Sri Lanka — food, coffee, matcha, Sri Lankan-inspired plates and creative experiences by the ocean.",
    links: [
      {
        label: "Website",
        href: "https://aliikai.lk",
        linkType: "website",
      },
      {
        label: "Instagram",
        href: "https://www.instagram.com/aliikai_srilanka/",
        linkType: "instagram",
      },
    ],
  },
];

const PLACE_LINKS = [
  {
    label: "ALIIKAI",
    href: "https://www.instagram.com/aliikai_srilanka/",
    linkType: "instagram",
  },
  {
    label: "aliikai.lk",
    href: "https://aliikai.lk",
    linkType: "website",
  },
];

const PLACES_MENTIONED = [
  {
    label: "ALIIKAI Ahangama",
    href: "https://www.instagram.com/aliikai_srilanka/",
    linkType: "instagram",
    note: "The beach café in Ahangama — Sri Lankan-inspired food, coffee, matcha, creative experiences and an ocean view.",
  },
  {
    label: "Weligama Bay",
    note: "The wide surf bay next to Ahangama on Sri Lanka’s south coast.",
  },
];

const NEXT_ARTICLE = {
  href: "/bappa-surf-school-a-local-life-shaped-by-surfing",
  kicker: "Read Next",
  title: "Bappa Surf School: A Local Life Shaped by Surfing",
  image:
    resolveHeroImage(BAPPA_SURF_SCHOOL_HERO_IMAGE) ||
    "/bappa-surf-school/placeholder.svg",
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
        className="aliikai-landscape-image"
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
            hint={slot.docLabel}
          />
        )}
      </div>
      <Caption>{slot.caption}</Caption>
    </figure>
  );
}

function PortraitImage({ slot }) {
  const src = resolveImage(slot);

  return (
    <figure style={{ margin: 0 }}>
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
            hint={slot.docLabel}
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
      className="aliikai-portrait-pair"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: "clamp(12px, 2vw, 24px)",
        width: "100%",
        maxWidth: 1224,
        margin: "8px auto 28px",
      }}
    >
      {images.map((slot) => (
        <PortraitImage key={slot.filename} slot={slot} />
      ))}
    </div>
  );
}

function SinglePortrait({ slot }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 480,
        margin: "8px auto 28px",
      }}
    >
      <PortraitImage slot={slot} />
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

export default function AliikaiPage() {
  const canonical = absUrl(ALIIKAI_PATH);
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
                    hint="Hero Image"
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
                    Cafe Story · Ahangama
                  </Text>
                  <Title
                    className="home-hero-title aliikai-hero-title"
                    style={{
                      margin: "18px 0 0",
                      color: "#ffffff",
                      fontWeight: 500,
                      fontFamily: '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                    }}
                  >
                    {["Beyond the Bali", "Blueprint: A Little", "Piece of Sri Lanka", "at ALIIKAI"].map((line) => (
                      <span key={line} className="home-hero-titleLine" style={{ color: "#ffffff" }}>
                        {line}
                      </span>
                    ))}
                  </Title>
                  <Text style={{ display: "block", marginTop: 14, color: "#ffffff", fontSize: 11, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase" }}>
                    Written by Tharu
                  </Text>
                  <Paragraph style={{ maxWidth: 670, margin: "24px 0 22px", color: "#ffffff", fontSize: "clamp(16px, 1.45vw, 19px)", lineHeight: 1.72 }}>
                    From working nights for a Canadian company to creating a beach café rooted in Sri Lankan coastal culture, I’m building something that goes beyond good food and an ocean view.
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

          <section style={{ padding: "8px 0 28px" }}>
            <SectionTitle>A Business With a Bigger Reason Behind It</SectionTitle>
            <BodyParagraphs
              paragraphs={biggerReasonBehindIt}
              articleSection="a-business-with-a-bigger-reason"
            />
          </section>

          <section
            style={{
              padding: "8px 0 8px",
              borderTop: "1px solid rgba(47,62,58,0.12)",
              paddingTop: 36,
            }}
          >
            <SectionTitle>Reworking Familiar Sri Lankan Flavours</SectionTitle>
            <BodyParagraphs
              paragraphs={reworkingFlavours}
              articleSection="reworking-familiar-sri-lankan-flavours"
            />
          </section>

          <PortraitPair
            images={[IMAGE_SLOTS.sweetToast, IMAGE_SLOTS.panipolPancakes]}
          />

          <section
            style={{
              padding: "36px 0 8px",
              borderTop: "1px solid rgba(47,62,58,0.12)",
            }}
          >
            <SectionTitle>More Than Somewhere to Eat</SectionTitle>
            <BodyParagraphs
              paragraphs={moreThanSomewhereToEat}
              articleSection="more-than-somewhere-to-eat"
            />
          </section>

          <SinglePortrait slot={IMAGE_SLOTS.guestExperience} />

          <section
            style={{
              padding: "36px 0",
              borderTop: "1px solid rgba(47,62,58,0.12)",
            }}
          >
            <SectionTitle>The Feeling I Want People to Remember</SectionTitle>
            <BodyParagraphs
              paragraphs={theFeelingIWantPeopleToRemember}
              articleSection="the-feeling-i-want-people-to-remember"
            />
          </section>

          <SinglePortrait slot={IMAGE_SLOTS.closingImage} />

          <section
            style={{
              padding: "8px 0 36px",
              borderTop: "1px solid rgba(47,62,58,0.12)",
              paddingTop: 36,
            }}
          >
            <SectionTitle>Discover ALIIKAI</SectionTitle>
            <Paragraph
              style={{
                maxWidth: 1120,
                marginBottom: 22,
                color: "#55514B",
                fontSize: 16,
                lineHeight: 1.8,
              }}
            >
              {renderLinkedText(
                "Whether you’re stopping by for coffee, exploring our Sri Lankan-inspired menu or trying one of our experiences, ALIIKAI offers another way to enjoy the Ahangama coastline.",
                "discover-aliikai",
              )}
            </Paragraph>
            <div
              className="aliikai-venue-grid"
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
                            "discover-aliikai",
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
