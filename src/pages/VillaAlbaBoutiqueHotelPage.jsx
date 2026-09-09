import React, { useRef } from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import SiteLayout from "../components/layout/SiteLayout";
import EditorialNextArticle from "../components/ui/EditorialNextArticle";
import { trackArticleEvent } from "../analytics";
import useArticleEngagement from "../hooks/useArticleEngagement";
import useTrackedImpression from "../hooks/useTrackedImpression";

const { Paragraph, Text, Title } = Typography;

export const VILLA_ALBA_BOUTIQUE_HOTEL_PATH =
  "/villa-alba-a-boutique-hotel-with-a-commitment-to-those-who-built-it";

const BASE_IMAGE_URL =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/villa-alba-a-boutique-hotel-with-a-commitment-to-those-who-built-it";

const HERO_IMAGE = `${BASE_IMAGE_URL}/Hero+-+Villa+Alba+aerial+with+surrounding+paddy+fields.webp`;
const OWNERS_IMAGE = `${BASE_IMAGE_URL}/Portrait+-Chris+and+Euan+owners+together.webp`;
const FEATURE_IMAGE = `${BASE_IMAGE_URL}/Wide+feature+-+Villa+Alba+interiors+living+room+and+entrance.webp`;
const SHUTTERS_IMAGE = `${BASE_IMAGE_URL}/Portrait+-+Architectural+design+focus+green+shutters.webp`;
const BREAKFAST_IMAGE = `${BASE_IMAGE_URL}/Portrait+-+Sri+Lankan+breakfast+with+egg+hoppers+coconut+roti+and+curries.webp`;
const PEACOCK_IMAGE = `${BASE_IMAGE_URL}/Portrait+-+Percy+the+peacock+at+Villa+Alba.webp`;
const VIDEO_URL = `${BASE_IMAGE_URL}/video/optimized_villa_alba_-_video.mp4`;
const VIDEO_POSTER_IMAGE = `${BASE_IMAGE_URL}/video/villa-alba-thumbnail.webp`;
const STAFF_IMAGE = `${BASE_IMAGE_URL}/Portrait+-Villa+Alba+staff+holding+eggs+during+Avurudu+sports.webp`;
const GARDENER_IMAGE = `${BASE_IMAGE_URL}/Portrait+-+Thilake+tending+to+the+Villa+Alba+gardens.webp`;
const POOL_VIEW_IMAGE = `${BASE_IMAGE_URL}/Landscape+-+Villa+Alba+pool+view.webp`;
const CLOSING_IMAGE = `${BASE_IMAGE_URL}/Landscape+Image+-+Villa+Alba+pool+deck+with+sun+loungers.webp`;
const OG_IMAGE = `${BASE_IMAGE_URL}/OG+image+-+Villa+Alba+living+room+view+over+the+pool+deck.webp`;

const publishDate = "2026-09-09T09:00:00.000Z";
const CONTENT_ID =
  "villa-alba-a-boutique-hotel-with-a-commitment-to-those-who-built-it";
const CONTENT_TITLE =
  "Villa Alba: A Boutique Hotel with a Commitment to Those Who Built It";
const ARTICLE_CATEGORY = "stay_story";
const AUTHOR_NAME = "Chris & Euan";
const DESCRIPTION =
  "A contemporary villa shaped by local architects, builders and designers, and by the landscape of inland Ahangama itself.";

const articleIntroduction = [
  "Villa Alba began as a quiet idea and quickly became a shared vision. A boutique hotel shaped by local hands, local materials, and a community's pride. Owners Chris and Euan first fell for the Sri Lankan south coast on holiday in 2015 and returned soon after determined to build a home that would sit lightly on the paddy peninsula outside Ahangama. The brief was simple: contemporary lines, generous light, and a deep respect for place.",
  "Turning that brief into reality required more than drawings. It required a team rooted in the region, architects who listened, builders who adapted, and designers who sourced locally. Over three and a half years, and through the uncertainty of a global pandemic, that team turned an idea into a reality that feels both modern and unmistakably of this place.",
];

const articleSections = [
  {
    id: "where-the-idea-found-a-home",
    title: "Where the Idea Found a Home",
    body: [
      "The villa's quiet confidence comes from decisions made in dialogue with the people who know Ahangama best: architects, builders, and designers working together rather than in isolation. Just 10 minutes inland from Ahangama town, the green, rice-fringed peninsula where Villa Alba now stands set the tone for every decision. Early conversations with Gayan and Anjalee of Tectonic Architects shaped the villa's orientation, its relationship to light and wind, and the simple geometry that frames views across the paddies. Tectonic led design and project management, and Crystal Construction translated drawings into durable structure and refined finishes that give Villa Alba its calm, tactile quality. Elaine from Positive Partnership curated interiors and sourced custom Sri Lankan furniture that complements the villa's material palette.",
      "The design aimed to be contemporary without imposing on the landscape: open living spaces, shaded spaces, and careful sightlines that make the surrounding fields part of the experience.",
    ],
    quote:
      "The villa's quiet confidence comes from decisions made in dialogue with the people who know Ahangama best.",
  },
  {
    id: "what-guests-actually-experience",
    title: "What Guests Actually Experience",
    body: [
      "Villa Alba's architecture sets the stage, but it's the experience that stays with guests long after they leave. Days begin with birdsong drifting across the paddies and the soft shuffle of our team preparing breakfast.",
      "Guests wander through the gardens, swim in the quiet pool deck, enjoy a massage in their room or simply watch the light shift across the fields. We always know when it's time for a sundowner when our resident peacock, we call him Percy, struts across the lawn, announces himself and occasionally pauses long enough for guests to take the perfect photo.",
      "Percy is a reminder that Villa Alba isn't just surrounded by nature; it's part of it.",
    ],
    quote: "Villa Alba isn't just surrounded by nature; it's part of it.",
  },
  {
    id: "villa-albas-people",
    title: "Villa Alba's People",
    body: [
      "The team at Villa Alba are what turns a good hotel stay in beautiful peaceful surroundings into a full curated guest experience. Our dedicated team of guest services, housekeepers, and gardeners are all from the village and have been with us from the very start. They tend the gardens that feed the kitchen, maintain the shared spaces and pool deck, and welcome guests with a warmth that makes our guests feel instantly at home.",
      "Chef Krishan lives just around the corner and has built a menu around ingredients grown in the villa gardens and sourced from nearby farms. His brother Indika owns the neighbouring rice paddy and supplies heirloom varieties of rice that feature in our dishes.",
    ],
    quote:
      "The team at Villa Alba are what turns a good hotel stay in beautiful peaceful surroundings into a full curated guest experience.",
  },
  {
    id: "what-made-you-choose-to-build-here",
    title: "What Made You Choose to Build Here?",
    body: [
      "A question owners Chris and Euan have been asked numerous times over the past few years. The answer is a simple one. Villa Alba is more than a luxury boutique hotel, it's a commitment to the community who built it. Beyond the finished villa, the project itself has left a ripple of benefits: months of work for local trades, commissions for designers and architects, and a demonstration of how contemporary design can be realised through robust local know-how. By choosing to source locally, from timber and stone to textiles and ingredients, Villa Alba supported small businesses and helped keep traditions alive. Villa Alba stands as an example of what is possible when architects, builders, designers, owners, and the wider village commit to collaboration and sustainability.",
    ],
  },
];

const PLACE_LINKS = [
  {
    label: "Villa Alba",
    href: "https://www.instagram.com/villaalba_srilanka/",
  },
  {
    label: "Tectonic Architects",
    href: "https://www.instagram.com/tectonicarchitects/",
  },
  {
    label: "Crystal Construction",
    href: "https://www.instagram.com/construction_crystal/",
  },
];

const FEATURED_VENUES = [
  {
    ...PLACE_LINKS[0],
    note: "A contemporary boutique hotel set on a quiet paddy peninsula inland from Ahangama.",
  },
  {
    ...PLACE_LINKS[1],
    note: "The local architecture practice behind Villa Alba's orientation, geometry and relationship to the landscape.",
  },
  {
    ...PLACE_LINKS[2],
    note: "The regional construction team that translated the design into the villa's structure and finishes.",
  },
];

const NEXT_ARTICLE = {
  href: "/the-mugatiya-a-heritage-villa-made-for-slower-days-in-ahangama",
  kicker: "Read Next",
  title: "The Mugatiya: A Heritage Villa Made for Slower Days in Ahangama",
  image:
    "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/the-mugatiya-a-heritage-villa-made-for-slower-days-in-ahangama/hero-image-the-mugatiya-infinity-pool-paddy-view-ahangama.jpg.jpg",
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

function ArticleParagraph({ articleSection, children, lead = false }) {
  return (
    <Paragraph
      style={{
        maxWidth: lead ? 920 : 1200,
        marginBottom: 18,
        color: lead ? "#2f2a24" : "#55514B",
        fontSize: lead ? 20 : 16,
        lineHeight: lead ? 1.8 : 1.8,
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
          objectPosition: "center center",
        }}
      />
    </div>
  );
}

function PortraitGrid({ images }) {
  return (
    <div
      className="villa-alba-portrait-grid"
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

function PullQuote({ children }) {
  return (
    <blockquote
      style={{
        margin: "8px 0 22px",
        padding: "20px 24px",
        borderLeft: "3px solid rgba(107,90,78,0.4)",
        background: "rgba(247,244,238,0.72)",
        color: "#2f2a24",
        fontFamily:
          '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
        fontSize: 24,
        lineHeight: 1.5,
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
      <div style={{ maxWidth: 1180 }}>
        <Title level={2} style={{ marginTop: 0, marginBottom: 18 }}>
          {section.title}
        </Title>
        <ArticleParagraph articleSection={section.id}>
          {section.body[0]}
        </ArticleParagraph>

        {section.id === "where-the-idea-found-a-home" ? (
          <EditorialImage
            src={SHUTTERS_IMAGE}
            alt="Green shutters and contemporary architectural details at Villa Alba"
            portrait
          />
        ) : null}
        {section.id === "what-guests-actually-experience" ? (
          <EditorialImage
            src={BREAKFAST_IMAGE}
            alt="Sri Lankan breakfast with egg hoppers, coconut roti and curries at Villa Alba"
            portrait
          />
        ) : null}
        {section.id === "villa-albas-people" ? (
          <PortraitGrid
            images={[
              {
                src: STAFF_IMAGE,
                alt: "Villa Alba staff holding eggs during Avurudu sports",
              },
              {
                src: GARDENER_IMAGE,
                alt: "Thilake tending to the gardens at Villa Alba",
              },
            ]}
          />
        ) : null}

        {section.body.slice(1).map((paragraph, index) => (
          <React.Fragment key={paragraph}>
            <ArticleParagraph articleSection={section.id}>
              {paragraph}
            </ArticleParagraph>
            {section.id === "what-guests-actually-experience" && index === 0 ? (
              <EditorialImage
                src={PEACOCK_IMAGE}
                alt="Percy the resident peacock walking through the grounds at Villa Alba"
                portrait
              />
            ) : null}
          </React.Fragment>
        ))}

        {section.quote ? <PullQuote>{section.quote}</PullQuote> : null}
      </div>
    </section>
  );
}

export default function VillaAlbaBoutiqueHotelPage() {
  const canonical = absUrl(VILLA_ALBA_BOUTIQUE_HOTEL_PATH);
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
                      "linear-gradient(90deg, rgba(12,18,14,0.88) 0%, rgba(12,18,14,0.7) 28%, rgba(12,18,14,0.36) 55%, rgba(12,18,14,0.04) 82%)",
                    pointerEvents: "none",
                  }}
                />
                <img
                  className="home-hero-image"
                  src={HERO_IMAGE}
                  alt="Aerial view of Villa Alba surrounded by green paddy fields near Ahangama"
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
                    maxWidth: 900,
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
                    {["Stay Story", "Inland Ahangama"].map((item) => (
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
                    className="home-hero-title villa-alba-hero-title"
                    style={{
                      margin: 0,
                      color: "#FFFFFF",
                      fontWeight: 500,
                      fontFamily:
                        '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                    }}
                  >
                    {[
                      "Villa Alba:",
                      "A Boutique Hotel",
                      "with a Commitment",
                      "to Those Who Built It",
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
                    By Chris &amp; Euan
                  </Text>

                  <Paragraph
                    style={{
                      maxWidth: 680,
                      marginTop: 24,
                      marginBottom: 22,
                      color: "#FFFFFF",
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
          <ArticleParagraph articleSection="introduction" lead>
            {articleIntroduction[0]}
          </ArticleParagraph>
          <EditorialImage
            src={OWNERS_IMAGE}
            alt="Villa Alba owners Chris and Euan together"
            portrait
          />
          <ArticleParagraph articleSection="introduction" lead>
            {articleIntroduction[1]}
          </ArticleParagraph>

          <EditorialImage
            src={FEATURE_IMAGE}
            alt="Villa Alba living room, entrance and locally designed interiors"
          />

          <ArticleSection
            section={articleSections[0]}
            first
            impressedSectionIds={impressedSectionIds}
          />
          <ArticleSection
            section={articleSections[1]}
            impressedSectionIds={impressedSectionIds}
          />

          <div
            style={{
              width: "min(100%, 680px, 76vh)",
              margin: "8px auto 28px",
            }}
          >
            <video
              controls
              playsInline
              preload="metadata"
              poster={VIDEO_POSTER_IMAGE}
              aria-label="A portrait video of daily life at Villa Alba"
              style={{
                display: "block",
                width: "100%",
                aspectRatio: "4 / 5",
                maxHeight: "95vh",
                objectFit: "cover",
                background: "#1f1d1a",
                boxShadow: "0 16px 36px rgba(18,24,22,0.10)",
              }}
            >
              <source src={VIDEO_URL} type="video/mp4" />
            </video>
          </div>

          <ArticleSection
            section={articleSections[2]}
            impressedSectionIds={impressedSectionIds}
          />
          <EditorialImage
            src={POOL_VIEW_IMAGE}
            alt="Pool at Villa Alba overlooking the surrounding paddy landscape"
          />
          <ArticleSection
            section={articleSections[3]}
            impressedSectionIds={impressedSectionIds}
          />
          <EditorialImage
            src={CLOSING_IMAGE}
            alt="Villa Alba pool deck with fire pit and sun loungers"
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
                target_content_id:
                  "the-mugatiya-a-heritage-villa-made-for-slower-days-in-ahangama",
              })
            }
          />
        </div>
      </div>
    </SiteLayout>
  );
}