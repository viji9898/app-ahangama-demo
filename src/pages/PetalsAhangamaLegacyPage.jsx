import React from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import EditorialNextArticle from "../components/ui/EditorialNextArticle";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";

const { Paragraph, Text, Title } = Typography;

export const PETALS_AHANGAMA_LEGACY_PATH =
  "/petals-ahangama-a-dream-rooted-in-legacy";

const BASE_IMAGE_URL =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/petals-ahangama-a-dream-rooted-in-legacy";

const HERO_IMAGE = `${BASE_IMAGE_URL}/Hero+Image+-+Petals-entrance-with-sign+(1).jpg`;
const FEATURE_IMAGE = `${BASE_IMAGE_URL}/Wide+Feature+Image+-+Petals-staff-johan-ranidu.jpg`;
const JOHAN_IMAGE = `${BASE_IMAGE_URL}/Potrait+-Petals-staff-johan.webp`;
const SAWAN_IMAGE = `${BASE_IMAGE_URL}/Potrait+-+Petals-owner-sawan.webp`;
const INTERIOR_IMAGE = `${BASE_IMAGE_URL}/Potrait+-+Petals-interior-new.jpg`;
const EXTERIOR_IMAGE = `${BASE_IMAGE_URL}/Potrait+-+Petals-exterior-new.jpg`;
const CUSTOMERS_IMAGE = `${BASE_IMAGE_URL}/Potrait+-+Petals-customers-outdoor.jpg`;
const AVOCADO_TOAST_IMAGE = `${BASE_IMAGE_URL}/Potrait+-+Petals-classic-avocado-toast.jpg`;
const BRUNCH_MENU_IMAGE = `${BASE_IMAGE_URL}/Potrait+-+Petals-brunch-menu-old.jpg`;
const OMELETTE_IMAGE = `${BASE_IMAGE_URL}/Potrait+-+Petals-brunch-food-omelette.jpg`;

const publishDate = "2026-08-18T09:00:00.000Z";

const PLACE_LINKS = [
  {
    label: "Petals Ahangama",
    href: "https://www.instagram.com/petals.ahangama/",
  },
  {
    label: "Kabalana",
    href: "https://www.google.com/search?q=Kabalana+Sri+Lanka",
  },
];

const FEATURED_VENUES = [
  {
    ...PLACE_LINKS[0],
    note: "A welcoming breakfast and brunch cafe near the shores of Kabalana.",
  },
  {
    ...PLACE_LINKS[1],
    note: "The south-coast neighbourhood where the Petals story is taking root.",
  },
];

const articleIntroduction = [
  "Every great dish has a story behind it. For me, the story of Petals Ahangama began long before we opened our doors.",
  "Growing up, I watched my father dedicate more than 35 years of his life to hospitality. I saw the late nights and hard work, but I also saw how much joy came from bringing people together through good food and warm service.",
  "That stayed with me.",
  "At just 22, I decided to follow that path. Starting from scratch with an empty space and a vision, I began building something of my own - a place that could honour what my father taught me while creating a story for the next generation.",
  "That place became Petals.",
];

const articleSections = [
  {
    title: "Creating a Cosy Corner in Kabalana",
    body: [
      "From the beginning, I wanted Petals to feel like more than somewhere you stop for coffee or breakfast.",
      "Being close to the shores of Kabalana, I wanted to create a space with the warmth and easygoing character that makes this part of Sri Lanka special - somewhere anyone could walk in, feel welcome and enjoy good food without it needing to feel exclusive.",
      "Our menu reflects that idea too. We focus on hearty portions and generous breakfast and brunch combinations made for long, slow mornings, while keeping our prices approachable.",
      "For me, Petals has always been about comfort: in the food, the space and the way people are welcomed.",
    ],
  },
  {
    title: "The Family Behind the Counter",
    body: [
      "I could never have built Petals alone.",
      "Johan, my best friend, has been beside me since day one. His passion and dedication have played a huge part in helping Petals become what it is today.",
      "Ranidu is the newest addition to our little cafe family, stepping into the everyday chaos and learning and growing alongside us.",
      "We began with just two staff members. Since then, we've learned, adapted, made mistakes and kept moving forward together.",
      "Petals was my dream, but it has never been mine alone.",
    ],
  },
  {
    title: "More Than a Cafe",
    body: [
      "Ultimately, my dream for Petals goes beyond serving good breakfasts.",
      "I want it to become part of a community where our team, friends, neighbours and customers can support one another and grow together.",
      "Every person who has walked through our doors, shared a meal, spoken with our team or returned for another visit has helped us build this from the ground up.",
      "For that, I'm incredibly grateful.",
      "Petals began with my father's legacy, an empty space and a 22-year-old with a dream. What we're building now belongs to everyone who has become part of the journey.",
      "And we're only getting started.",
    ],
  },
];

const NEXT_ARTICLE = {
  href: "/gusta-groceries-good-food-and-more-in-ahangama",
  kicker: "Read Next",
  title: "Gusta: Groceries, Good Food and More",
  image:
    "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/gusta-groceries-good-food-and-more-in-ahangama/Hero+Image+-+Outside-ahangama-gusta-outlet.webp",
};

function renderLinkedText(text) {
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

function ArticleParagraph({ children }) {
  return (
    <Paragraph
      style={{
        maxWidth: 1200,
        fontSize: 16,
        lineHeight: 1.8,
        color: "#55514B",
        marginBottom: 18,
      }}
    >
      {renderLinkedText(children)}
    </Paragraph>
  );
}

function WideImage({ src, alt }) {
  return (
    <div
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
        width="1920"
        height="1081"
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
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
        gap: 24,
        margin: "0 auto 28px",
        width: "100%",
      }}
    >
      {images.map((image) => (
        <img
          key={image.src}
          src={image.src}
          alt={image.alt}
          width={image.width || 540}
          height={image.height || 720}
          loading="lazy"
          decoding="async"
          style={{
            display: "block",
            width: "100%",
            aspectRatio: "4 / 5",
            objectFit: "cover",
            objectPosition: image.objectPosition || "center center",
            boxShadow: "0 16px 36px rgba(18,24,22,0.10)",
          }}
        />
      ))}
    </div>
  );
}

function ArticleSection({ section, first = false }) {
  return (
    <section
      style={{
        padding: first ? "20px 0 36px" : "36px 0",
        borderTop: first ? "none" : "1px solid rgba(47,62,58,0.12)",
      }}
    >
      <div style={{ maxWidth: 1180 }}>
        <Title level={2} style={{ marginTop: 0, marginBottom: 18 }}>
          {section.title}
        </Title>
        {section.body.map((paragraph) => (
          <ArticleParagraph key={paragraph}>{paragraph}</ArticleParagraph>
        ))}
      </div>
    </section>
  );
}

export default function PetalsAhangamaLegacyPage() {
  const canonical = absUrl(PETALS_AHANGAMA_LEGACY_PATH);

  return (
    <SiteLayout navOverlayHero>
      <Seo
        title="Petals Ahangama: A Dream Rooted in Legacy"
        description="How a 35-year family legacy in hospitality inspired Sawan Chamika Walgamage to create a welcoming cafe of his own in Kabalana."
        canonical={canonical}
        ogImage={HERO_IMAGE}
        ogType="article"
        author="Sawan Chamika Walgamage"
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
                    background:
                      "linear-gradient(90deg, rgba(16,18,15,0.84) 0%, rgba(16,18,15,0.7) 24%, rgba(16,18,15,0.4) 48%, rgba(16,18,15,0.08) 72%, rgba(16,18,15,0) 100%)",
                    pointerEvents: "none",
                    zIndex: 2,
                  }}
                />
                <img
                  className="home-hero-image"
                  src={HERO_IMAGE}
                  alt="The entrance and sign at Petals Ahangama in Kabalana"
                  width="1920"
                  height="1081"
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
                    maxWidth: 790,
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
                    {["Cafe Story", "Kabalana"].map((item) => (
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
                    className="home-hero-title"
                    style={{
                      margin: 0,
                      color: "#FFFFFF",
                      fontWeight: 500,
                      fontFamily:
                        '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                    }}
                  >
                    {["Petals", "Ahangama:", "A Dream Rooted", "in Legacy"].map(
                      (line) => (
                        <span
                          key={line}
                          className="home-hero-titleLine"
                          style={{ color: "#FFFFFF" }}
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
                      color: "#FFFFFF",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 1.6,
                      textTransform: "uppercase",
                    }}
                  >
                    Words by Sawan Chamika Walgamage
                  </Text>

                  <Paragraph
                    style={{
                      marginTop: 24,
                      marginBottom: 22,
                      maxWidth: 650,
                      color: "#FFFFFF",
                      fontSize: "clamp(16px, 1.45vw, 19px)",
                      lineHeight: 1.72,
                    }}
                  >
                    How a 35-year family legacy in hospitality inspired me to
                    create a cafe of my own in Kabalana.
                  </Paragraph>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dm-wrap" style={{ paddingTop: 28 }}>
          <div style={{ maxWidth: 920, paddingBottom: 12 }}>
            {articleIntroduction.map((paragraph, index) => (
              <Paragraph
                key={paragraph}
                style={{
                  fontSize: index === 0 ? 22 : 18,
                  lineHeight: index === 0 ? 1.7 : 1.85,
                  color: index < 2 ? "#2f2a24" : "#55514B",
                  marginBottom: 18,
                }}
              >
                {renderLinkedText(paragraph)}
              </Paragraph>
            ))}
          </div>

          <WideImage
            src={FEATURE_IMAGE}
            alt="Johan and Ranidu from the Petals Ahangama team"
          />

          <ArticleSection section={articleSections[0]} first />

          <ArticleSection section={articleSections[1]} />
          <PortraitGrid
            images={[
              { src: JOHAN_IMAGE, alt: "Johan from the Petals Ahangama team" },
              { src: SAWAN_IMAGE, alt: "Sawan, founder of Petals Ahangama" },
              {
                src: INTERIOR_IMAGE,
                alt: "The interior of Petals Ahangama",
                width: 540,
                height: 405,
              },
              { src: EXTERIOR_IMAGE, alt: "The exterior of Petals Ahangama" },
              {
                src: AVOCADO_TOAST_IMAGE,
                alt: "Classic avocado toast at Petals Ahangama",
              },
              {
                src: OMELETTE_IMAGE,
                alt: "A brunch omelette served at Petals Ahangama",
              },
            ]}
          />

          <ArticleSection section={articleSections[2]} />
          <PortraitGrid
            images={[
              {
                src: BRUNCH_MENU_IMAGE,
                alt: "A Petals Ahangama breakfast and brunch spread",
              },
              {
                src: CUSTOMERS_IMAGE,
                alt: "Petals Ahangama customers sharing a moment outdoors",
              },
            ]}
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
                color: "#6B5A4E",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.4,
                textTransform: "uppercase",
                marginBottom: 10,
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
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      color: "#6B5A4E",
                      fontSize: 13,
                      textDecoration: "none",
                      borderBottom: "1px solid rgba(107,90,78,0.24)",
                      paddingBottom: 1,
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

          <EditorialNextArticle {...NEXT_ARTICLE} />
        </div>
      </div>
    </SiteLayout>
  );
}