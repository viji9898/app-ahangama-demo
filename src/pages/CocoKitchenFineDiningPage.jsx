import React, { useRef } from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { trackArticleEvent } from "../analytics";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import SiteLayout from "../components/layout/SiteLayout";
import EditorialNextArticle from "../components/ui/EditorialNextArticle";
import useArticleEngagement from "../hooks/useArticleEngagement";
import "../styles/coco-kitchen-fine-dining.css";

const { Paragraph, Text, Title } = Typography;

export const COCO_KITCHEN_FINE_DINING_PATH =
  "/coco-kitchen-the-pursuit-of-coastal-fine-dining-in-ahangama";

const BASE_IMAGE_URL =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/coco-kitchen-the-pursuit-of-coastal-fine-dining-in-ahangama";
const HERO_IMAGE = `${BASE_IMAGE_URL}/coco-kitchen-hero-image-ahangama.webp`;
const OG_IMAGE = `${BASE_IMAGE_URL}/+coco-kitchen-exterior-ahangama-og-image.webp`;
const WIDE_FEATURE_IMAGE = `${BASE_IMAGE_URL}/coco-kitchen-wide-feature-exterior-ahangama.webp`;
const SEAFOOD_IMAGES = [
  `${BASE_IMAGE_URL}/coco-kitchen-plated-dish-ahangama.webp`,
  `${BASE_IMAGE_URL}/coco-kitchen-plated-seafood-dish-ahangama.webp`,
];
const HERITAGE_IMAGES = [
  `${BASE_IMAGE_URL}/coco-kitchen-small-plates-ahangama.webp`,
  `${BASE_IMAGE_URL}/coco-kitchen-evening-dining-guests-ahangama.webp`,
];
const DRINKS_IMAGES = [
  `${BASE_IMAGE_URL}/coco-kitchen-signature-cocktails-ahangama.webp`,
  `${BASE_IMAGE_URL}/coco-kitchen-cocktail-ahangama.webp`,
];

const publishDate = "2026-09-30T09:00:00.000Z";
const CONTENT_ID =
  "coco-kitchen-the-pursuit-of-coastal-fine-dining-in-ahangama";
const CONTENT_TITLE =
  "COCO Kitchen: The Pursuit of Coastal Fine Dining in Ahangama";
const ARTICLE_CATEGORY = "food_story";
const AUTHOR_NAME = "Founder, COCO Kitchen";
const DESCRIPTION =
  "One and a half years into redefining southern Sri Lanka's culinary landscape, one kitchen pairs daily reef catches with elevated island heritage.";

const articleIntroduction = [
  "Ahangama wakes to the steady rumble of diesel-engine fishing skiffs cutting through the morning mist. For years, this stretch of Galle Road was known primarily to wave chasers paddling out towards Marshmallow break.",
  "One and a half years ago, I stood on the pavement opposite that very reef with a clear conviction: this vibrant surf town deserved world-class fine dining without losing its effortless coastal soul.",
  "COCO Kitchen was built on that premise. Tropical fine dining can easily slide into stiff formality or detach entirely from its environment. My goal was to invert that model, creating an intentional, open space where saltwater ease meets polished technique, cold vintage Champagne and uncompromised local ingredients.",
  "Today, that ambition is an everyday reality. We have built more than a restaurant; we have carved out a space that honours southern Sri Lanka's maritime culture through thoughtful culinary craft.",
];

const articleSections = [
  {
    title: "From Morning Tides to the Evening Plate",
    body: [
      "Freshness here is an uncompromising operational standard. Every sunrise, we meet local fishermen along the shoreline to select line-caught yellowfin tuna, sweet rock lobster and reef fish, hours before dinner service begins.",
      "Rather than burying these ingredients beneath heavy reductions, our kitchen relies on precision cooking to let the pure salinity and clean texture of the Indian Ocean lead each dish.",
    ],
  },
  {
    title: "Slow Clay Pots and Island Heritage",
    body: [
      "Refined dining should never detach from place.",
      "Alongside our contemporary seafood menu sits our Authentic Sri Lankan Heritage selection, an intentional ode to traditional recipes. Stone-ground spices, house-pressed coconut cream and slow-simmered curries are prepared using classic southern methods.",
      "It is an elevated celebration of island culinary roots, presented with modern balance and care.",
    ],
  },
  {
    title: "Golden Hour Pours and Coastal Ease",
    body: [
      "As the afternoon glare fades over Marshmallow, the room shifts into an intimate evening retreat.",
      "Our beverage programme mirrors the kitchen's focus, pairing artisanal signature cocktails and local botanical infusions with a curated list of international wines, Prosecco and Champagne.",
      "Whether hosting private milestone dinners or pouring aperitifs after a late surf, the atmosphere remains polished yet thoroughly relaxed.",
    ],
  },
];

const PLACE_LINKS = [
  {
    label: "COCO Kitchen",
    href: "https://www.instagram.com/cocokitchen.ahangama/",
    linkType: "instagram",
  },
  {
    label: "Marshmallow",
    href: "https://share.google/Z3Kk9bXWLDV51KDwk",
    linkType: "map",
  },
];

const FEATURED_VENUES = [
  {
    ...PLACE_LINKS[0],
    note: "Coastal fine dining at No. 59, Galle Road, Piyadigama, Ahangama.",
  },
  {
    ...PLACE_LINKS[1],
    label: "Marshmallow Surf Spot",
    note: "The reef break located directly opposite COCO Kitchen in Ahangama.",
  },
];

const NEXT_ARTICLE = {
  href: "/crossfit-ceylon-palm-training-in-the-jungle",
  kicker: "Read Next",
  title: "CrossFit Ceylon Palm: Training in the Jungle",
  image:
    "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/crossfit-ceylon-palm-training-in-the-jungle/Outside-view-of-crossfit-gym.webp",
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

function EditorialImage({ src, alt }) {
  return (
    <div
      className="coco-kitchen-landscape-image"
      style={{
        width: "100%",
        margin: "8px auto 28px",
        aspectRatio: "3 / 2",
        overflow: "hidden",
        boxShadow: "0 16px 40px rgba(18,24,22,0.12)",
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
}

function PortraitPair({ images }) {
  return (
    <div
      className="coco-kitchen-portrait-pair"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: "clamp(12px, 2vw, 24px)",
        width: "100%",
        maxWidth: 1224,
        margin: "8px auto 28px",
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
            boxShadow: "0 16px 36px rgba(18,24,22,0.1)",
          }}
        />
      ))}
    </div>
  );
}

export default function CocoKitchenFineDiningPage() {
  const canonical = absUrl(COCO_KITCHEN_FINE_DINING_PATH);
  const articleBodyRef = useRef(null);

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
        ogImage={OG_IMAGE}
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
                <img
                  className="home-hero-image"
                  src={HERO_IMAGE}
                  alt="Interior view of COCO Kitchen in Ahangama, featuring natural timber architecture, bar seating and a relaxed tropical dining atmosphere"
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
                    Food Story · Ahangama
                  </Text>
                  <Title
                    className="home-hero-title coco-kitchen-hero-title"
                    style={{
                      margin: "18px 0 0",
                      color: "#ffffff",
                      fontWeight: 500,
                      fontFamily: '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                    }}
                  >
                    {["COCO Kitchen:", "The Pursuit of Coastal", "Fine Dining in Ahangama"].map((line) => (
                      <span key={line} className="home-hero-titleLine" style={{ color: "#ffffff" }}>
                        {line}
                      </span>
                    ))}
                  </Title>
                  <Text style={{ display: "block", marginTop: 14, color: "#ffffff", fontSize: 11, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase" }}>
                    By Founder, COCO Kitchen
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

          <EditorialImage
            src={WIDE_FEATURE_IMAGE}
            alt="Evening exterior view of COCO Kitchen in Ahangama"
          />

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
              </section>

              {index === 0 ? (
                <PortraitPair
                  images={[
                    {
                      src: SEAFOOD_IMAGES[0],
                      alt: "Fresh seafood spread at COCO Kitchen in Ahangama, featuring crab, grilled seafood, rice and sides",
                    },
                    {
                      src: SEAFOOD_IMAGES[1],
                      alt: "Plated seafood dish with fresh greens and pomegranate at COCO Kitchen in Ahangama",
                    },
                  ]}
                />
              ) : null}

              {index === 1 ? (
                <PortraitPair
                  images={[
                    {
                      src: HERITAGE_IMAGES[0],
                      alt: "Small plated bites served at COCO Kitchen in Ahangama",
                    },
                    {
                      src: HERITAGE_IMAGES[1],
                      alt: "Guests enjoying dinner at COCO Kitchen in Ahangama during the evening",
                    },
                  ]}
                />
              ) : null}

              {index === 2 ? (
                <PortraitPair
                  images={[
                    {
                      src: DRINKS_IMAGES[0],
                      alt: "Signature cocktails and evening drinks at COCO Kitchen in Ahangama",
                    },
                    {
                      src: DRINKS_IMAGES[1],
                      alt: "Cocktail served during evening service at COCO Kitchen in Ahangama",
                    },
                  ]}
                />
              ) : null}
            </React.Fragment>
          ))}

          <section
            style={{
              margin: "22px 0 34px",
              padding: "24px 0",
              borderTop: "1px solid rgba(47,62,58,0.12)",
              borderBottom: "1px solid rgba(47,62,58,0.12)",
            }}
          >
            <Text style={{ display: "block", marginBottom: 12, color: "#8b623d", fontSize: 11, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase" }}>
              Table Reservations & Location
            </Text>
            <Title level={3} style={{ marginTop: 0 }}>COCO Kitchen</Title>
            <Paragraph style={{ marginBottom: 8, color: "#55514B", lineHeight: 1.7 }}>
              No. 59, Galle Road, Piyadigama, Ahangama<br />
              Directly opposite Marshmallow surf spot
            </Paragraph>
            <Paragraph style={{ marginBottom: 8, color: "#55514B", lineHeight: 1.7 }}>
              Direct reservations: <a href="tel:+94773471167">+94 77 347 1167</a> / <a href="tel:+94773101167">+94 77 310 1167</a>
            </Paragraph>
            <Paragraph style={{ marginBottom: 0, color: "#55514B" }}>
              Inquiries: <a href="mailto:info@cocokitchenahangama.com">info@cocokitchenahangama.com</a>
            </Paragraph>
          </section>

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
