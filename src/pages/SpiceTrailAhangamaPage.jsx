import React, { useRef } from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { trackArticleEvent } from "../analytics";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import SiteLayout from "../components/layout/SiteLayout";
import EditorialNextArticle from "../components/ui/EditorialNextArticle";
import useArticleEngagement from "../hooks/useArticleEngagement";
import "../styles/spice-trail-ahangama.css";

const { Paragraph, Text, Title } = Typography;

export const SPICE_TRAIL_AHANGAMA_PATH =
  "/the-spice-trail-your-south-coast-boutique-base";

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
 * Suggested filenames follow the brief in "Spice trails article .docx".
 * Reference folder: https://drive.google.com/drive/folders/10kts5elP3APOuC1VBQnNa1CcA1T41zjJ
 */
const IMAGE_BASE_URL = "";

const IMAGE_SLOTS = {
  hero: {
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-hero-image-the-spice-trail-villa-pool-ahangama-36cd3204.webp",
    filename: "hero-image-the-spice-trail-villa-pool-ahangama.webp",
    alt: "The Spice Trail villa and swimming pool in Ahangama.",
  },
  wideFeature: {
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-wide-feature-image-the-spice-trail-guest-bedroom-ahangama-39897181.webp",
    filename: "the-spice-trail-guest-bedroom-ahangama.webp",
    alt: "Guest bedroom showing the bed and interiors at The Spice Trail in Ahangama.",
  },
  ramen: {
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-portrait-right-little-bang-kitchen-ramen-ahangama-9f09a12f.webp",
    filename: "little-bang-kitchen-ramen-ahangama.webp",
    alt: "Ramen served at Little Bang Kitchen in Ahangama.",
  },
  cheeseburger: {
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-portrait-left-lbk-cheeseburger-ahangama-d3f07741.webp",
    filename: "lbk-cheeseburger-ahangama.jpg",
    alt: "A hand holding a cheeseburger with melted cheese and pickles against a background of palm leaves.",
  },
  footMassage: {
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-portrait-right-spa-therapy-foot-massage-ahangama-6a0e6689.webp",
    filename: "spa-therapy-foot-massage-ahangama.jpg",
    alt: "Hands massaging a person's foot at The Spice Trail spa in Ahangama.",
  },
  backMassage: {
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-portrait-left-spa-therapy-back-massage-ahangama-018f67c4.webp",
    filename: "spa-therapy-back-massage-ahangama.jpg",
    alt: "A therapist giving a back massage at The Spice Trail spa in Ahangama.",
  },
  coffeeCake: {
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-portrait-right-kaffi-coffee-cake-ahangama-cf423e11.webp",
    filename: "kaffi-coffee-cake-ahangama.png",
    alt: "A cup of coffee beside a slice of cake at Kāffi in Ahangama.",
  },
  latteArt: {
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-portrait-left-kaffi-coffee-latte-art-ahangama-b97456ce.webp",
    filename: "kaffi-coffee-latte-art-ahangama.jpg",
    alt: "A steaming cup of coffee with latte art at Kāffi in Ahangama.",
  },
  poolsideDrink: {
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-portrait-right-the-spice-trail-poolside-drink-ahangama-fb3fb124.webp",
    filename: "the-spice-trail-poolside-drink-ahangama.jpg",
    alt: "A drink with a dried citrus garnish beside the pool at The Spice Trail in Ahangama.",
  },
  riceBowl: {
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-portrait-left-the-spice-trail-avocado-egg-rice-bowl-ahangama-d69380e8.webp",
    filename: "the-spice-trail-avocado-egg-rice-bowl-ahangama.jpg",
    alt: "A rice bowl topped with avocado, a fried egg, seaweed and sesame seeds at The Spice Trail in Ahangama.",
  },
};

function resolveImage(slot) {
  if (!slot) return null;
  if (slot.src) return slot.src;
  if (IMAGE_BASE_URL) return `${IMAGE_BASE_URL}/${slot.filename}`;
  return null;
}

const publishDate = "2026-10-30T10:00:00.000Z";
const CONTENT_ID = "the-spice-trail-your-south-coast-boutique-base";
const CONTENT_TITLE = "The Spice Trail: Your South Coast Boutique Base";
const ARTICLE_CATEGORY = "stay_story";
const AUTHOR_NAME = "The Spice Trail";
const DESCRIPTION =
  "A Basecamp to Tap into Ahangama Rhythm with Surf, Damn Good Food, Spa Therapy and the Coast's Best Coffee";

const articleIntroduction = [];

const articleSections = [
  {
    title: "No Compromises on Sleep, Food, or Downtime Quality",
    body: [
      "There's this unspoken hospitality myth that it's okay for travellers to put up with subpar standards presented as a low-key island life, or 'shape', as we say it in Lankan lingo to mean 'good enough'. But that was never a benchmark for the Spice Trail Boutique Hotel and Spa. Their offer is affordable luxury that respects both the place and the people who travel through it, making sure guests eat well, recover, and feel genuinely taken care of.",
    ],
    landscapeImage: IMAGE_SLOTS.wideFeature,
  },
  {
    title: "The Basecamp of Comfort",
    body: [
      "Premium beds (that keep coming up in their reviews). Large bathrooms with showers that pour instead of dribbling. Fast AC. Family rooms for travels with kids, or the entire villa for group holidays. A large pool, an on-site spa, special meal orders, and a restaurant and café that delivers deliciousness to your door. And of course, Ahangama beaches, the bars and clubs, the cultural sites, all close by.",
    ],
  },
  {
    title: "The LBK: Ahangama's Iconic Ramen and Sushi",
    body: [
      "Spice Trail's resident restaurant is the Little Bang Kitchen, fondly dubbed 'The LBK'. Known for its post-surf nom-noms and sunset ramen, everything here is made from fresh ingredients that give you actual nourishment, not just Instagrammable fluff. The LBK does a special one for Spice Trail guests: pre-orders for early breakfasts and delivery right to the villa to enjoy poolside.",
    ],
    images: [IMAGE_SLOTS.ramen, IMAGE_SLOTS.cheeseburger],
  },
  {
    title: "Spa Therapy: The Real Reset",
    body: [
      "Spice Trail's Spa Therapy treatments are offered by certified therapists considering what matters when holidaying in the South, from sleep restoration and post-surf recovery to after-sun skin rehydration. Being on the same property makes it a bit too convenient to roll out of your room, into the spa, and straight back into bed or onto a pool lounger.",
    ],
    images: [IMAGE_SLOTS.footMassage, IMAGE_SLOTS.backMassage],
  },
  {
    title: "Kāffi: Spice Trail's Coffeehouse Sister",
    body: [
      "While everyone from Ahangama queues up at Kāffi for the best coffee on the coast, Spice Trail guests get to order without having to leave their lounge and have it delivered, whether it's the wake-up joe or post-lunch cake and caffeine top-up. Easy.",
    ],
    images: [IMAGE_SLOTS.coffeeCake, IMAGE_SLOTS.latteArt],
  },
  {
    title: "Set to Cruise",
    body: [
      "One villa, everything considered, zero logistics; that's the advantage of the Spice Trail ecosystem. It's not a holiday if you're chasing coffee, organizing taxis after a massage at a spa across town, or wondering where dinner is. So get here, and just cruise into the best of Ahangama rhythm. That's the Spice Trail good life.",
    ],
    images: [IMAGE_SLOTS.poolsideDrink, IMAGE_SLOTS.riceBowl],
  },
];

const PLACE_LINKS = [
  {
    label: "The Spice Trail",
    href: "https://www.instagram.com/thespicetrail.ahangama/",
    linkType: "instagram",
    linkInBody: false,
  },
  {
    label: "Little Bang Kitchen",
    href: "https://www.instagram.com/lbk.ahangama/",
    linkType: "instagram",
  },
  {
    label: "Kāffi",
    href: "https://www.instagram.com/kaffi.ahangama/",
    linkType: "instagram",
  },
];

const FEATURED_VENUES = [
  {
    ...PLACE_LINKS[0],
    label: "The Spice Trail Boutique Hotel and Spa",
    note: "Affordable luxury, a large pool, an on-site spa and everything you need for an easy Ahangama base.",
  },
  {
    ...PLACE_LINKS[1],
    label: "Little Bang Kitchen (The LBK)",
    note: "Spice Trail's resident restaurant, known for post-surf ramen, sushi and poolside delivery.",
  },
  {
    ...PLACE_LINKS[2],
    label: "Kāffi — Ahangama",
    note: "The coast's favourite coffeehouse, with orders delivered straight to your lounger.",
  },
];

const NEXT_ARTICLE = {
  href: "/the-well-a-home-away-from-home-in-ahangama",
  kicker: "Read Next",
  title: "The Well: A Home Away from Home in Ahangama",
  image: "/the-well-ahangama/placeholder.svg",
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
    </div>
  );
}

function EditorialImage({ slot }) {
  const src = resolveImage(slot);

  return (
    <div
      className="spice-trail-landscape-image"
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
      className="spice-trail-portrait-pair"
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

export default function SpiceTrailAhangamaPage() {
  const canonical = absUrl(SPICE_TRAIL_AHANGAMA_PATH);
  const articleBodyRef = useRef(null);
  const heroSrc = resolveImage(IMAGE_SLOTS.hero);
  const ogImage = resolveImage(IMAGE_SLOTS.hero);

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
                    className="home-hero-title spice-trail-hero-title"
                    style={{
                      margin: "18px 0 0",
                      color: "#ffffff",
                      fontWeight: 500,
                      fontFamily: '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                    }}
                  >
                    {["The Spice Trail:", "Your South Coast", "Boutique Base"].map((line) => (
                      <span key={line} className="home-hero-titleLine" style={{ color: "#ffffff" }}>
                        {line}
                      </span>
                    ))}
                  </Title>
                  <Text style={{ display: "block", marginTop: 14, color: "#ffffff", fontSize: 11, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase" }}>
                    By The Spice Trail
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
          {articleIntroduction.length ? (
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
          ) : null}

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

              {section.landscapeImage ? (
                <EditorialImage slot={section.landscapeImage} />
              ) : null}

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
