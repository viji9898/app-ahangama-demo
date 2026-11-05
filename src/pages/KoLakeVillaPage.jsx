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
  KO_LAKE_VILLA_HERO_IMAGE,
  SPICE_TRAIL_HERO_IMAGE,
  resolveHeroImage,
} from "../data/articleHeroImages";
import "../styles/ko-lake-villa.css";

const { Paragraph, Text, Title } = Typography;

export const KO_LAKE_VILLA_PATH =
  "/ko-lake-villa-a-house-shaped-by-koggala-lake";

/*
 * IMAGE LINKS — PASTE HERE
 * ------------------------
 * Every photo on the page is wired to a slot below. To add an image, paste
 * its hosted link between the quotes of that slot's `src` field, for example:
 *
 *   wideFeature: {
 *     src: "https://your-image-host.com/ko-lake-villa-veranda-dining-pool.webp",
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
 * Filenames follow the brief in "Ko lake villa article .docx".
 */
const IMAGE_BASE_URL = "";

const IMAGE_SLOTS = {
  // HERO — paste the link into KO_LAKE_VILLA_HERO_IMAGE.src in
  // src/data/articleHeroImages.js
  hero: KO_LAKE_VILLA_HERO_IMAGE,
  // WIDE FEATURE — veranda dining area and swimming pool
  wideFeature: {
    slotKey: "wideFeature",
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-wide-feature-ko-lake-villa-veranda-dining-pool-5dddb539.webp", // ← paste wide feature image link here
    filename: "ko-lake-villa-veranda-dining-pool.webp",
    alt: "Ko Lake Villa's veranda dining area and swimming pool.",
  },

  // PORTRAIT — illustrated portrait of Rajiv
  portrait: {
    slotKey: "portrait",
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-portrait-rajiv-abeysinghe-ko-lake-villa-cf485471.webp", // ← paste portrait image link here
    filename: "rajiv-abeysinghe-ko-lake-villa-portrait.webp",
    alt: "Illustrated portrait of Rajiv Abeysinghe at Ko Lake Villa.",
  },

  // TEAM — barbecue with the Ko Lake Villa team
  team: {
    slotKey: "team",
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-portrait-ko-lake-villa-team-4d155043.webp", // ← paste team image link here
    filename: "ko-lake-villa-team-barbecue.webp",
    alt: "Ko Lake Villa team gathered around the barbecue.",
    caption:
      "At the barbecue with the Ko Lake Villa team. Faces blurred for privacy. Photo: Ko Lake Villa.",
  },

  // FOOD — Sri Lankan rice and curries
  food: {
    slotKey: "food",
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-portrait-sri-lankan-rice-curries-ko-lake-villa-ff856a6d.webp", // ← paste food image link here
    filename: "sri-lankan-rice-curries-ko-lake-villa.webp",
    alt: "Sri Lankan rice and curries served on banana leaves at Ko Lake Villa.",
    caption:
      "Rice and curries on banana leaves. Image: Ko Lake Villa website.",
  },

  // OG / SOCIAL SHARE — optional; falls back to the hero image
  og: {
    slotKey: "og",
    src: "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/ahangama-online-guide/general-og-image-4bd8366c.webp", // ← paste social share image link here
    filename: "og-ko-lake-villa-koggala-lake.webp",
    alt: "Ko Lake Villa beside Koggala Lake.",
  },
};

function resolveImage(slot) {
  if (!slot) return null;
  if (slot.src) return slot.src;
  if (IMAGE_BASE_URL) return `${IMAGE_BASE_URL}/${slot.filename}`;
  return null;
}

const publishDate = "2026-11-05T09:00:00.000Z";
const CONTENT_ID = "ko-lake-villa-a-house-shaped-by-koggala-lake";
const CONTENT_TITLE = "Ko Lake Villa: A House Shaped by Koggala Lake";
const ARTICLE_CATEGORY = "stay_story";
const AUTHOR_NAME = "Rajiv Abeysinghe";
const DESCRIPTION =
  "A villa raised ten feet above the ground, shaped by a working lake, a difficult build and the people who make it a home.";

const articleIntroduction = [
  "Koggala Lake was working long before Ko Lake Villa arrived. By day, fishermen and sea eagles move across the water, with ancestral homes standing alongside newer villas. At night, prawn fishers work the sandbank outside the villa. Their nets swirl beneath white lights. The beach goes quiet, but the lake does not.",
  "It was the lake, not another beach house, that drew me in. My family knew this coast. They had villas by the beach and one by Koggala Lake. A neighbour brought the land to our attention and remains a friend of the villa. The lake already had a working life. I wanted the villa to belong beside it.",
  "The weather has a say in everything here. Rain comes sideways. Leave something open and monkeys investigate it; close the building too much and the breeze disappears. Raising the main living area and pool deck opened up the views and caught the lake breeze. There were fewer mosquitoes, too. None of this is obvious from a photograph of the finished villa.",
];

const articleBridge = [
  "Ahangama works beyond any one property. Its restaurants, guides, wellness practitioners and surf teachers give visitors reasons to go out and explore. A group can spend a day apart and return to the same house. That was the kind of stay I looked for on my travels. Building one would be another matter.",
];

const articleSections = [
  {
    title: "How I Came to Build Here",
    body: [
      "Colombo's outskirts were home. After going to school by the sea in Mount Lavinia, I moved to London and finished my studies in Portsmouth. Work took me abroad. I often booked houses for longer stays, sometimes at my own expense.",
      "The best places were not necessarily the most expensive. They gave a group room to be together, without everyone having to do the same thing. That became my idea for Ko Lake Villa.",
      "I love cricket, diving, cars and architecture. Some buildings here impress me; others don't. Tri Lanka, on Koggala Lake, is incredible to my eye. So is Shigeru Ban's Villa Vista in Weligama. Building my own place would test that enthusiasm much more than staying in anyone else's.",
    ],
  },
  {
    title: "Building on Wet Ground",
    body: [
      "The land was a bargain. The original idea was a lower building, the villa is on the lakeshore. I wanted to build higher, which meant deeper foundations. We found groundwater and put the foundations in at ten feet.",
      "Rain also demanded proper drainage. I had led large technology programmes and thought I understood difficult projects. Koggala disagreed.",
      "Covid arrived shortly after we started, followed by the economic crisis. Supplies disappeared, and prices could change by 15 per cent in a week. Finding labour and professional help became harder.",
      "I tried to manage much of the build from afar, despite having family in construction. It was a strain. One architect had a vision that did not fit mine. Another understood what I wanted. A quantity surveyor we trusted helped us through the project, then became seriously ill near the end.",
      "Building a house is one thing. Building it in Sri Lanka during that period, while trying to coordinate everything remotely, was another.",
    ],
    portrait: IMAGE_SLOTS.portrait,
  },
  {
    title: "What Would I Do Differently?",
    leadQuote:
      "A video call shows you a wall. It does not tell you how rain hits it.",
    body: [
      "Watching every episode of Grand Designs doesn't do the job either.",
      "Now I allow for trades starting late and overrunning. Supplies may not turn up. Even clear drawings do not replace someone I trust checking the work every day. Without that person, people can drift into their own version of the job.",
      "I would not start another project without having that person in place. I would also hold back a completion payment until the work was finished properly.",
      "The experience taught me that planning and drawings can only take you so far. You need someone on the ground who understands the vision, pays attention to the details and can make decisions when things do not go to plan.",
    ],
  },
  {
    title: "The House After the Build",
    body: [
      "Now that the villa is finished, guests sometimes talk about the house being raised ten feet off the ground. The layout keeps a group together, but there are places to retreat, too: the pool deck, roof garden and lakefront.",
      "We have sometimes rented individual rooms, although the house works best when one group takes it for themselves. That is when the layout really comes into its own.",
      "Surf camps have used the pool to practise swimming, even with scuba gear. We have seated twenty people under canvas on the roof garden. For one guest's birthday in January, we arranged fireworks and lanterns by the lake.",
      "These are the moments I could not have imagined from a drawing. You can plan a building, but you cannot plan every memory people will make in it.",
    ],
  },
  {
    title: "The People Do the Hard Part",
    body: [
      "A villa can look wonderful in photographs and still fail its guests. At Ko Lake Villa, the team cooks for guests and looks after the house. Their work makes the experience what it is.",
      "Two good people left for opportunities overseas. I missed them, but I was happy for them, too. Keeping good people means listening to what they want for their lives. Sometimes that means accepting that their next opportunity will be somewhere else.",
      "We pay a decent basic salary. The monthly service charge is usually shared equally, and a quarterly merit bonus can reach the value of a monthly service charge for outstanding work. Tips go entirely to the staff; the house takes none.",
      "Day staff get a generous meal, and anyone staying overnight gets three. Training takes patience, as does giving people room to grow. A hospitality business depends on its people, and looking after them should be part of the job.",
      "With partnerships, I have learned to slow down. Act in haste, repent at leisure. Check references and learn from other people's experiences before deciding. Slowly slowly is better.",
    ],
    images: [IMAGE_SLOTS.team, IMAGE_SLOTS.food],
  },
  {
    title: "Places I Keep Going Back To",
    body: [
      "At Hotel De Uncles, I go for hopper night, karaoke and the atmosphere. Pickled Pelican has charming hosts and a good burger. Echo Beach has good food and an easygoing atmosphere.",
      "Others will have their own favourites. That is part of what makes this stretch of coast interesting. No one venue is the whole story, and the area works because there are different places for different people and moods.",
    ],
  },
  {
    title: "A House Beside a Living Lake",
    body: [
      "Guests can watch the fishers on the lake at night, their nets moving beneath white lights. It is a reminder that Koggala Lake is more than a view from the villa. It is part of the lives of the people who live and work here.",
      "I am grateful to Ahangama and Koggala Lake, and to the fellow hospitality people who make this area worth visiting. Vishmi and the Ahangama.com team have helped without pushing. They bring visitors and the community together.",
      "I am glad to be one of the people building something here.",
    ],
  },
];

const PLACE_LINKS = [
  {
    label: "Ko Lake Villa",
    href: "https://www.instagram.com/kolakevilla.ahangama/",
    linkType: "instagram",
    linkInBody: false,
  },
  {
    label: "Hotel De Uncles",
    href: "https://www.instagram.com/hoteldeuncles/",
    linkType: "instagram",
  },
  {
    label: "Pickled Pelican",
    href: "https://www.instagram.com/pickledpelican/",
    linkType: "instagram",
  },
  {
    label: "Echo Beach",
    href: "https://www.instagram.com/echobeachlounge/",
    linkType: "instagram",
  },
];

const FEATURED_VENUES = [
  {
    ...PLACE_LINKS[0],
    label: "Ko Lake Villa",
    note: "A house raised above Koggala Lake, built for groups who want to be together with room to retreat.",
  },
  {
    ...PLACE_LINKS[1],
    label: "Hotel De Uncles",
    note: "Hopper night, karaoke and the atmosphere.",
  },
  {
    ...PLACE_LINKS[2],
    label: "Pickled Pelican",
    note: "Charming hosts and a good burger.",
  },
  {
    ...PLACE_LINKS[3],
    label: "Echo Beach",
    note: "Good food and an easygoing atmosphere.",
  },
];

const NEXT_ARTICLE = {
  href: "/the-spice-trail-your-south-coast-boutique-base",
  kicker: "Read Next",
  title: "The Spice Trail: Your South Coast Boutique Base",
  image:
    resolveHeroImage(SPICE_TRAIL_HERO_IMAGE) ||
    "/the-spice-trail/placeholder.svg",
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
        className="ko-lake-villa-landscape-image"
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

function PortraitImage({ slot }) {
  const src = resolveImage(slot);

  return (
    <figure
      className="ko-lake-villa-portrait"
      style={{ margin: "8px auto 28px", maxWidth: 520 }}
    >
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
}

function PortraitPair({ images }) {
  return (
    <div
      className="ko-lake-villa-portrait-pair"
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

function Quote({ children }) {
  return (
    <blockquote
      style={{
        margin: "10px 0 24px",
        padding: "22px 26px",
        borderLeft: "3px solid #8b623d",
        background: "#f6f1e8",
        color: "#2f2a24",
        fontFamily: '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
        fontSize: 26,
        lineHeight: 1.45,
      }}
    >
      {children}
    </blockquote>
  );
}

export default function KoLakeVillaPage() {
  const canonical = absUrl(KO_LAKE_VILLA_PATH);
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
                    className="home-hero-title ko-lake-villa-hero-title"
                    style={{
                      margin: "18px 0 0",
                      color: "#ffffff",
                      fontWeight: 500,
                      fontFamily: '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                    }}
                  >
                    {["Ko Lake Villa:", "A House Shaped by", "Koggala Lake"].map((line) => (
                      <span key={line} className="home-hero-titleLine" style={{ color: "#ffffff" }}>
                        {line}
                      </span>
                    ))}
                  </Title>
                  <Text style={{ display: "block", marginTop: 14, color: "#ffffff", fontSize: 11, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase" }}>
                    By Rajiv Abeysinghe, founder of Ko Lake Villa
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

          {articleBridge.map((paragraph) => (
            <Paragraph
              key={paragraph}
              style={{
                maxWidth: 920,
                marginBottom: 28,
                color: "#55514B",
                fontSize: 18,
                lineHeight: 1.85,
              }}
            >
              {renderLinkedText(paragraph, "introduction")}
            </Paragraph>
          ))}

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
                {section.leadQuote ? <Quote>{section.leadQuote}</Quote> : null}
                {section.body.map((paragraph) => (
                  <Paragraph key={paragraph} style={{ maxWidth: 1120, marginBottom: 18, color: "#55514B", fontSize: 16, lineHeight: 1.8 }}>
                    {renderLinkedText(paragraph, section.title.toLowerCase().replaceAll(" ", "-"))}
                  </Paragraph>
                ))}
                {section.quote ? <Quote>{section.quote}</Quote> : null}
              </section>

              {section.portrait ? (
                <PortraitImage slot={section.portrait} />
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
