import React, { useRef } from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { trackArticleEvent } from "../analytics";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import SiteLayout from "../components/layout/SiteLayout";
import EditorialNextArticle from "../components/ui/EditorialNextArticle";
import useArticleEngagement from "../hooks/useArticleEngagement";

const { Paragraph, Text, Title } = Typography;

export const CROSSFIT_CEYLON_PALM_PATH =
  "/crossfit-ceylon-palm-training-in-the-jungle";

const BASE_IMAGE_URL =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/crossfit-ceylon-palm-training-in-the-jungle";
const HERO_IMAGE = `${BASE_IMAGE_URL}/Outside-view-of-crossfit-gym.webp`;
const WIDE_FEATURE_IMAGE = `${BASE_IMAGE_URL}/Wide+feature+image+-Interior-of-crossfit-gym.webp`;
const ATHLETE_IMAGES = [
  `${BASE_IMAGE_URL}/Portrait-athletes-training-knee-raise.webp`,
  `${BASE_IMAGE_URL}/Portrait-athletes-training-on-dumbells.webp`,
];
const COACHING_IMAGES = [
  `${BASE_IMAGE_URL}/Portrait-crossfit-ceylon-coach-training-athlete-dumbbells.webp`,
  `${BASE_IMAGE_URL}/Potrait-crossfit-ceylon-coach-group-warmup.webp`,
];
const CLOSING_IMAGE = `${BASE_IMAGE_URL}/Closing+image+landscape-rossfit-ceylon-team-group-photo.webp`;
const OG_IMAGE = `${BASE_IMAGE_URL}/crossfit-ceylon-heavy-dumbbell-workout.webp`;

const publishDate = "2026-09-17T09:00:00.000Z";
const CONTENT_ID = "crossfit-ceylon-palm-training-in-the-jungle";
const CONTENT_TITLE = "CrossFit Ceylon Palm: Training in the Jungle";
const ARTICLE_CATEGORY = "fitness_story";
const AUTHOR_NAME = "Ahangama";
const DESCRIPTION =
  "Daily classes, open gym hours, expert coaching and serious strength training come together in an industrial space wrapped by jungle.";

const articleIntroduction = [
  "CrossFit Ceylon Palm is built for people who want to train properly without losing the easy rhythm of the South Coast.",
  "Set in a jungle-wrapped industrial space, the gym brings together daily classes, open gym hours, expert coaching and structured programming for anyone looking to move better, build strength or stay consistent while in Ahangama.",
  "Whether you're a seasoned CrossFit athlete or just getting started, the Jungle Gym is open to all fitness levels.",
];

const articleSections = [
  {
    title: "Built for strength and conditioning",
    body: [
      "The setup is straightforward and well equipped.",
      "There's a wall of squat racks and pull-up rigs, along with barbells, weight plates, kettlebells, medicine balls, skipping ropes, hex dumbbells, plyo boxes and more.",
      "It's the kind of space designed for serious training, whether that means strength work, conditioning, weightlifting or simply getting through a solid session.",
    ],
  },
  {
    title: "Full days, full spectrum",
    body: [
      "The class schedule covers more than standard CrossFit sessions.",
      "CrossFit, endurance, strength, weightlifting, Muay Thai, partner WODs and other programmed sessions run throughout the week, with coaching designed to work across different experience levels.",
      "You can come to train hard, learn something new or simply move your body.",
    ],
    quote: "Your training, on island time.",
  },
  {
    title: "Gym access",
    body: [
      "CrossFit Ceylon Palm offers options ranging from single-use day passes to monthly memberships, with access to open gym hours and daily classes depending on the option selected.",
      "The gym is located within Palm Hotel Sri Lanka, with the hotel's wider jungle setting carrying naturally into the training space. Check the location on Google Maps before heading over.",
    ],
  },
];

const PLACE_LINKS = [
  {
    label: "CrossFit Ceylon Palm",
    href: "https://www.instagram.com/crossfitceylonpalm/?hl=en",
    linkType: "instagram",
  },
  {
    label: "Palm Hotel Sri Lanka",
    href: "https://www.palmhotelsrilanka.com/",
    linkType: "website",
  },
  {
    label: "Google Maps",
    href: "https://maps.app.goo.gl/BPjpGo8vhaQ8GoGk7",
    linkType: "map",
  },
];

const FEATURED_VENUES = [
  {
    ...PLACE_LINKS[0],
    note: "Daily coached sessions, open gym access and strength training in a jungle-wrapped industrial space.",
  },
  {
    ...PLACE_LINKS[1],
    note: "The jungle hotel where CrossFit Ceylon Palm is located.",
    secondaryLinks: [
      {
        label: "Instagram",
        href: "https://www.instagram.com/palmhotelsrilanka/?hl=en",
        linkType: "instagram",
      },
      PLACE_LINKS[2],
    ],
  },
];

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
        onClick={() =>
          trackOutboundClick(match, articleSection, "article_body")
        }
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "#2f2a24",
          textDecoration: "none",
          borderBottom: "1px solid rgba(82,122,85,0.8)",
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

const NEXT_ARTICLE = {
  href: "/the-accidental-story-of-ribs",
  kicker: "Read Next",
  title: "The Accidental Story of RIBS",
  image:
    "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/the-accidental-story-of-ribs/Hero+Image+-+bbq_is_served.webp",
};

function EditorialImage({ src, alt }) {
  return (
    <div
      className="crossfit-landscape-image"
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

function PortraitPair({ images, altText }) {
  return (
    <div
      className="crossfit-portrait-pair"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: "clamp(12px, 2vw, 24px)",
        width: "100%",
        maxWidth: 1224,
        margin: "8px auto 28px",
      }}
    >
      {images.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={altText[index]}
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

export default function CrossFitCeylonPalmPage() {
  const canonical = absUrl(CROSSFIT_CEYLON_PALM_PATH);
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
              background: "#172019",
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
                      "linear-gradient(90deg, rgba(10,20,13,0.88) 0%, rgba(10,20,13,0.65) 38%, rgba(10,20,13,0.12) 78%)",
                    pointerEvents: "none",
                  }}
                />
                <img
                  className="home-hero-image"
                  src={HERO_IMAGE}
                  alt="CrossFit Ceylon Palm gym surrounded by jungle"
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
                    maxWidth: 900,
                    padding:
                      "clamp(44px, 5vw, 68px) clamp(32px, 4.8vw, 72px) 36px",
                  }}
                >
                  <Text
                    style={{
                      color: "#ffffff",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 1.6,
                      textTransform: "uppercase",
                    }}
                  >
                    Fitness Story · Ahangama
                  </Text>
                  <Title
                    className="home-hero-title crossfit-hero-title"
                    style={{
                      margin: "18px 0 0",
                      color: "#ffffff",
                      fontWeight: 500,
                      fontFamily:
                        '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                    }}
                  >
                    {["CrossFit Ceylon Palm:", "Training in the Jungle"].map(
                      (line) => (
                        <span
                          key={line}
                          className="home-hero-titleLine"
                          style={{ color: "#ffffff" }}
                        >
                          {line}
                        </span>
                      ),
                    )}
                  </Title>
                  <Text
                    style={{
                      display: "block",
                      marginTop: 14,
                      color: "#ffffff",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 1.6,
                      textTransform: "uppercase",
                    }}
                  >
                    By Ahangama
                  </Text>
                  <Paragraph
                    style={{
                      maxWidth: 610,
                      margin: "24px 0 22px",
                      color: "#ffffff",
                      fontSize: "clamp(16px, 1.45vw, 19px)",
                      lineHeight: 1.72,
                    }}
                  >
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
            alt="Squat racks, pull-up rigs and training floor at CrossFit Ceylon Palm"
          />

          {articleSections.map((section, index) => (
            <React.Fragment key={section.title}>
              <section
                style={{
                  padding: index === 0 ? "20px 0 36px" : "36px 0",
                  borderTop:
                    index === 0 ? "none" : "1px solid rgba(47,62,58,0.12)",
                }}
              >
                <Title level={2} style={{ marginTop: 0, marginBottom: 18 }}>
                  {section.title}
                </Title>
                {section.body.map((paragraph) => (
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
                    {renderLinkedText(
                      paragraph,
                      section.title.toLowerCase().replaceAll(" ", "-"),
                    )}
                  </Paragraph>
                ))}
                {section.quote ? (
                  <blockquote
                    style={{
                      margin: "10px 0 0",
                      padding: "22px 26px",
                      borderLeft: "3px solid #527a55",
                      background: "#eef2ea",
                      color: "#2f2a24",
                      fontFamily:
                        '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                      fontSize: 26,
                      lineHeight: 1.45,
                    }}
                  >
                    {section.quote}
                  </blockquote>
                ) : null}
              </section>

              {index === 0 ? (
                <PortraitPair
                  images={ATHLETE_IMAGES}
                  altText={[
                    "Athlete performing a knee raise at CrossFit Ceylon Palm",
                    "Athlete training with dumbbells at CrossFit Ceylon Palm",
                  ]}
                />
              ) : null}

              {index === 1 ? (
                <PortraitPair
                  images={COACHING_IMAGES}
                  altText={[
                    "CrossFit Ceylon Palm coach guiding a dumbbell workout",
                    "Coach leading a group warm-up at CrossFit Ceylon Palm",
                  ]}
                />
              ) : null}
            </React.Fragment>
          ))}

          <EditorialImage
            src={CLOSING_IMAGE}
            alt="CrossFit Ceylon Palm team together at the jungle gym"
          />

          <section
            style={{
              margin: "22px 0 34px",
              paddingTop: 16,
              borderTop: "1px solid rgba(47,62,58,0.12)",
            }}
          >
            <Text
              style={{
                display: "block",
                marginBottom: 10,
                color: "#4f704f",
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
                      color: "#4f704f",
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
                  {venue.secondaryLinks?.length ? (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 14,
                        marginTop: 8,
                      }}
                    >
                      {venue.secondaryLinks.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          onClick={() =>
                            trackOutboundClick(
                              link,
                              "places-mentioned",
                              "places_mentioned",
                            )
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#4f704f",
                            fontSize: 12,
                            textDecoration: "none",
                            borderBottom: "1px solid rgba(82,122,85,0.35)",
                          }}
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