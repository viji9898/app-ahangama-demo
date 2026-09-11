import React, { useRef } from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { trackArticleEvent } from "../analytics";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import SiteLayout from "../components/layout/SiteLayout";
import EditorialNextArticle from "../components/ui/EditorialNextArticle";
import useArticleEngagement from "../hooks/useArticleEngagement";
import useTrackedImpression from "../hooks/useTrackedImpression";

const { Paragraph, Text, Title } = Typography;

export const THE_ACCIDENTAL_STORY_OF_RIBS_PATH =
  "/the-accidental-story-of-ribs";

const BASE_IMAGE_URL =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/the-accidental-story-of-ribs";
const HERO_IMAGE = `${BASE_IMAGE_URL}/Hero+Image+-+bbq_is_served.webp`;
const OG_IMAGE = `${BASE_IMAGE_URL}/OG+Image+-+bbq_pork_ribs_are_served.webp`;
const FEATURE_IMAGE = `${BASE_IMAGE_URL}/dinner_table_at_ribs.webp`;
const WIDE_FEATURE_IMAGE = `${BASE_IMAGE_URL}/Wide+feature+-+bbq_beef_ribs_on_the_grill.webp`;
const FOOD_IMAGE = `${BASE_IMAGE_URL}/Portrait+-+kithul_glazed_prok_ribs.webp`;
const SMOKER_IMAGE = `${BASE_IMAGE_URL}/Portrait+-+smoker_setup_at_ribs_edited.webp`;
const PORTRAIT_IMAGES = [
  FOOD_IMAGE,
  `${BASE_IMAGE_URL}/Portrait+-+cecile_setting_up_ribs_table.webp`,
];
const COMEBACK_PORTRAIT_IMAGES = [
  SMOKER_IMAGE,
  `${BASE_IMAGE_URL}/Portrait+-+noel_at_the_bbq_at_ribs.webp`,
];
const CLOSING_PORTRAIT_IMAGES = [
  `${BASE_IMAGE_URL}/Portrait+-+customer_enjoying_ribs.webp`,
  `${BASE_IMAGE_URL}/Portrait+-+noel_working_the_grill.webp`,
];
const CLOSING_IMAGE = `${BASE_IMAGE_URL}/Portrait+Closing+Image+-+guest_vibes_at_ribs_ahangama.webp`;

const publishDate = "2026-09-10T09:00:00.000Z";
const CONTENT_ID = "the-accidental-story-of-ribs";
const CONTENT_TITLE = "The Accidental Story of RIBS";
const ARTICLE_CATEGORY = "food_story";
const AUTHOR_NAME = "Cecile Rodrigo";
const DESCRIPTION =
  "It started with a birthday, a missing cook and a BBQ nobody planned for. Five years later, RIBS is back in Kabalana with more smoke, a bigger team and the same slightly accidental spirit.";

const articleIntroduction = [
  "Some restaurants begin with a business plan. RIBS began because the cook didn't turn up.",
  "It was April 2021, during Covid, and Noel was celebrating his birthday with his wife Cecile and a few friends. A BBQ had been planned, guests were arriving, and someone was supposed to handle the cooking.",
  "When that person never appeared, Noel stepped behind the grill.",
  "It wasn't exactly unfamiliar territory. He had been quietly obsessed with BBQ for close to 40 years. What nobody around the table knew was that this particular birthday dinner would eventually become a restaurant.",
];

const articleSections = [
  {
    id: "from-a-home-kitchen-to-kabalana",
    title: "From a Home Kitchen to Kabalana",
    body: [
      "Another lockdown arrived shortly afterwards. Restaurants closed, people stayed home and Noel and Cecile started wondering whether BBQ could come to them instead.",
      "The first version of RIBS was deliberately simple: pork ribs cooked at home and delivered across the South Coast. No sprawling menu, no restaurant and no large team.",
      "Those early ribs eventually became the Kithul Glazed Pork Ribs served today, refined over years of testing, smoking and adjusting.",
      "Delivering them was sometimes more complicated. With Google Maps sending Noel and Cecile into unexpected corners of the South, finding customers could become almost as memorable as cooking for them.",
      "The response was enough to encourage another experiment.",
      "RIBS moved into Café Ceylon in Kabalana, taking over the space for dinner five nights a week while the cafe operated during the day.",
      "The team was tiny. Noel handled the fire and meat while Cecile took care of much of the preparation, sides and desserts. Her background made the partnership slightly unexpected: Cecile had trained as a vegan chef and previously ran a health-food business.",
      "Together, they turned RIBS into a relaxed Kabalana dinner spot built around smoky food, cold drinks and evenings around the table.",
    ],
    quote: "Somehow, the ribs kept finding their way to the customers.",
  },
  {
    id: "a-pause-then-a-comeback",
    title: "A Pause, Then a Comeback",
    body: [
      "After two high seasons, RIBS closed during the 2023 off-season. Noel and Cecile were preparing for the arrival of their son while focusing on their other project, Leopard Safaris, their sustainable luxury safari camp in Yala.",
      "The intention was to reopen the following season.",
      "They didn't.",
      "One season became another, and for a while RIBS looked like a chapter that had quietly ended.",
    ],
    quote: "For a while, it looked like that might be the end of the story.",
  },
  {
    id: "the-comeback",
    title: "The Comeback",
    body: [
      "In 2026, another opportunity appeared close to where the original RIBS had operated. A friend and former customer had taken over Samaraana Hotel in Kabalana, around 300 metres from the original location.",
      "In April, RIBS returned.",
      "This version has a dedicated setup, professional BBQ and smoking equipment, a larger trained team and a menu shaped by several years of experimentation.",
      "The focus has moved even further towards smoke and slow-developed flavour, but the Kithul Glazed Pork Ribs remain.",
      "Some things, after all, are better left alone.",
      "Today, Noel still looks after the fire, smoke and meat. Cecile still develops the recipes, sides and desserts that bring the menu together.",
      "Their backgrounds remain different, which may be exactly why the partnership works.",
      "RIBS has survived lockdowns, unpredictable deliveries, two intense seasons, a baby, a safari camp and a three-year break.",
      "And somehow, it has found its way back to Kabalana.",
      "Because sometimes a restaurant starts with a carefully considered concept.",
      "And sometimes somebody simply has to take over the BBQ.",
    ],
    quote: "Same crazy idea. Better set up.",
  },
];

const PLACE_LINKS = [
  {
    label: "RIBS",
    href: "https://www.instagram.com/ribs.ahangama/",
  },
  {
    label: "Café Ceylon",
    href: "https://www.instagram.com/cafe_ceylon/",
  },
  {
    label: "Samaraana Hotel",
    href: "https://www.instagram.com/samaraana_ahangama/",
  },
];

const FEATURED_VENUES = [
  {
    ...PLACE_LINKS[0],
    note: "Smoke-led BBQ, cold drinks and Kithul Glazed Pork Ribs in Kabalana.",
  },
  {
    ...PLACE_LINKS[1],
    note: "The Kabalana cafe where the first restaurant version of RIBS served dinner five nights a week.",
  },
  {
    ...PLACE_LINKS[2],
    note: "The Kabalana hotel that became home to the 2026 return of RIBS.",
  },
];

const NEXT_ARTICLE = {
  href: "/villa-alba-a-boutique-hotel-with-a-commitment-to-those-who-built-it",
  kicker: "Read Next",
  title: "Villa Alba: A Boutique Hotel with a Commitment to Those Who Built It",
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
    link_type: link.href.includes("instagram.com") ? "instagram" : "external",
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
          borderBottom: "1px solid rgba(184, 91, 52, 0.72)",
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

function ArticleParagraph({ articleSection, children, lead = false }) {
  return (
    <Paragraph
      style={{
        maxWidth: lead ? 920 : 1120,
        marginBottom: 18,
        color: lead ? "#2f2a24" : "#55514B",
        fontSize: lead ? 20 : 16,
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
      className={
        portrait ? "ribs-portrait-image" : "ribs-landscape-image"
      }
      style={{
        width: portrait ? "min(100%, 680px)" : "100%",
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
        }}
      />
    </div>
  );
}

function PortraitPair({
  images = PORTRAIT_IMAGES,
  altText = ["Noel at RIBS in Kabalana", "Cecile at RIBS in Kabalana"],
}) {
  return (
    <div
      className="ribs-portrait-pair"
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
          key={`${src}-${index}`}
          src={src}
          alt={altText[index]}
          loading="lazy"
          decoding="async"
          style={{
            display: "block",
            width: "100%",
            aspectRatio: "4 / 5",
            objectFit: "cover",
            boxShadow: "0 16px 40px rgba(18,24,22,0.12)",
          }}
        />
      ))}
    </div>
  );
}

function PullQuote({ children }) {
  return (
    <blockquote
      style={{
        margin: "10px 0 28px",
        padding: "22px 26px",
        borderLeft: "3px solid #b85b34",
        background: "#f6f1ea",
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
      <Title level={2} style={{ marginTop: 0, marginBottom: 18 }}>
        {section.title}
      </Title>
      {section.body.map((paragraph, index) => (
        <React.Fragment key={paragraph}>
          <ArticleParagraph articleSection={section.id}>
            {paragraph}
          </ArticleParagraph>
          {section.id === "from-a-home-kitchen-to-kabalana" && index === 3 ? (
            <>
              <PullQuote>{section.quote}</PullQuote>
              <PortraitPair
                altText={[
                  "Kithul Glazed Pork Ribs at RIBS in Kabalana",
                  "Cecile setting a table at RIBS in Kabalana",
                ]}
              />
            </>
          ) : null}
          {section.id === "the-comeback" && index === 4 ? (
            <>
              <PullQuote>{section.quote}</PullQuote>
              <PortraitPair
                images={COMEBACK_PORTRAIT_IMAGES}
                altText={[
                  "The smoker and BBQ setup at RIBS in Kabalana",
                  "Noel at the BBQ at RIBS in Kabalana",
                ]}
              />
            </>
          ) : null}
          {section.id === "the-comeback" && index === 1 ? (
            <EditorialImage
              src={WIDE_FEATURE_IMAGE}
              alt="Beef ribs cooking on the grill at RIBS in Kabalana"
            />
          ) : null}
        </React.Fragment>
      ))}
      {section.id === "a-pause-then-a-comeback" ? (
        <>
          <PullQuote>{section.quote}</PullQuote>
          <PortraitPair
            images={CLOSING_PORTRAIT_IMAGES}
            altText={[
              "A relaxed evening of food, drinks and BBQ at RIBS",
              "Noel working the grill at RIBS in Kabalana",
            ]}
          />
        </>
      ) : null}
    </section>
  );
}

function PlacesMentioned({ impressedSectionIds }) {
  const sectionRef = useTrackedImpression({
    itemId: "places-mentioned",
    impressedItemIds: impressedSectionIds,
    onImpression: () =>
      trackArticleEvent("article_section_view", {
        content_id: CONTENT_ID,
        content_title: CONTENT_TITLE,
        article_category: ARTICLE_CATEGORY,
        author_name: AUTHOR_NAME,
        article_section: "places-mentioned",
        component_location: "article_body",
      }),
  });

  return (
    <section
      id="places-mentioned"
      ref={sectionRef}
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
          color: "#7b4a35",
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
                color: "#7b4a35",
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
  );
}

export default function TheAccidentalStoryOfRibsPage() {
  const canonical = absUrl(THE_ACCIDENTAL_STORY_OF_RIBS_PATH);
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
              background: "#1b1714",
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
                      "linear-gradient(90deg, rgba(20,13,10,0.9) 0%, rgba(20,13,10,0.68) 38%, rgba(20,13,10,0.18) 78%)",
                    pointerEvents: "none",
                  }}
                />
                <img
                  className="home-hero-image"
                  src={HERO_IMAGE}
                  alt="RIBS restaurant in Kabalana"
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
                    Food Story · Kabalana
                  </Text>
                  <Title
                    className="home-hero-title"
                    style={{
                      margin: "18px 0 0",
                      color: "#ffffff",
                      fontWeight: 500,
                      fontFamily:
                        '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                    }}
                  >
                    {["The Accidental", "Story of RIBS"].map((line) => (
                      <span
                        key={line}
                        className="home-hero-titleLine"
                        style={{ color: "#ffffff" }}
                      >
                        {line}
                      </span>
                    ))}
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
                    By Cecile Rodrigo
                  </Text>
                  <Paragraph
                    style={{
                      maxWidth: 680,
                      marginTop: 24,
                      marginBottom: 22,
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

        <div
          className="dm-wrap"
          ref={articleBodyRef}
          style={{ paddingTop: 28 }}
        >
          {articleIntroduction.map((paragraph, index) => (
            <ArticleParagraph
              articleSection="introduction"
              key={paragraph}
              lead={index === 0}
            >
              {paragraph}
            </ArticleParagraph>
          ))}

          <EditorialImage
            src={FEATURE_IMAGE}
            alt="The early RIBS BBQ story in Kabalana"
          />

          {articleSections.map((section, index) => (
            <ArticleSection
              section={section}
              first={index === 0}
              impressedSectionIds={impressedSectionIds}
              key={section.id}
            />
          ))}

          <EditorialImage
            src={CLOSING_IMAGE}
            alt="Guests enjoying an evening at RIBS in Kabalana"
            portrait
          />

          <PlacesMentioned impressedSectionIds={impressedSectionIds} />
        </div>

        <div className="dm-wrap">
          <EditorialNextArticle
            {...NEXT_ARTICLE}
            onClick={() =>
              trackArticleEvent("article_next_select", {
                content_id: CONTENT_ID,
                content_title: CONTENT_TITLE,
                article_category: ARTICLE_CATEGORY,
                author_name: AUTHOR_NAME,
                component_location: "article_footer",
                target_content_id:
                  "villa-alba-a-boutique-hotel-with-a-commitment-to-those-who-built-it",
              })
            }
          />
        </div>
      </div>
    </SiteLayout>
  );
}
