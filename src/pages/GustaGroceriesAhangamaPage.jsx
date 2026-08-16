import React from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import EditorialNextArticle from "../components/ui/EditorialNextArticle";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";

const { Paragraph, Text, Title } = Typography;

export const GUSTA_GROCERIES_AHANGAMA_PATH =
  "/gusta-groceries-good-food-and-more-in-ahangama";

const BASE_IMAGE_URL =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/gusta-groceries-good-food-and-more-in-ahangama";

const HERO_IMAGE = `${BASE_IMAGE_URL}/Hero+Image+-+Outside-ahangama-gusta-outlet.webp`;
const FEATURE_IMAGE = `${BASE_IMAGE_URL}/Wide+Feature+Image+-+gusta-Staff-standing-outside.webp`;
const MILKY_SIGN_IMAGE = `${BASE_IMAGE_URL}/Portrait+-+gusta-milky-by-gusta-sign-ahangama.webp`;
const ICE_CREAM_IMAGE = `${BASE_IMAGE_URL}/Portrait+-+gusta-ahangama-staff-holding-ice-cream.webp`;
const LIFESTYLE_PRODUCTS_IMAGE = `${BASE_IMAGE_URL}/Portrait+-+gusta-ahangama-lifestyle-products-inside-fridge.webp`;
const CIAO_PRODUCTS_IMAGE = `${BASE_IMAGE_URL}/Portrait+-+ciao-dairy-products-at-gusta-ahangama.webp`;
const POSTCARDS_IMAGE = `${BASE_IMAGE_URL}/Portait+-+gusta-ahangama-postcards-concept-products.webp`;

const publishDate = "2026-08-16T09:00:00.000Z";

const PLACE_LINKS = [
  { label: "Gusta", href: "http://gusta.sl" },
  {
    label: "Café Ceylon",
    href: "https://www.instagram.com/cafe_ceylon/",
  },
];

const FEATURED_VENUES = [
  {
    ...PLACE_LINKS[0],
    label: "Gusta Ahangama",
    note: "Groceries, specialty foods and locally made lifestyle finds in Kabalana.",
  },
  {
    ...PLACE_LINKS[1],
    note: "The Kabalana grounds where Gusta's Ahangama store is located.",
  },
];

const articleIntroduction = [
  "There’s the grocery run you have to do, and then there’s the kind where you end up browsing a little longer than planned. Gusta sits somewhere between the two.",
  "Located in Kabalana, Gusta brings everyday groceries together with specialty foods, Sri Lankan producers, international favourites and lifestyle products. It’s useful when you need to stock the fridge, but equally good for discovering something you didn’t know you were looking for.",
  "Born as an online specialty-food platform during the pandemic, Gusta has grown into a wider retail concept with stores in Sri Lanka and more than 1,000 products available online.",
];

const articleSections = [
  {
    title: "More Than the Weekly Shop",
    body: [
      "You can cover the basics at Gusta: cheeses, meat, bakery goods, organic foods, supplements and holistic self-care products. The dairy selection stretches from ricotta, burrata, cottage cheese and Greek yoghurt to ryazhenka, smoked cheese, Adyghe cheese and cow’s milk feta.",
      "Then there’s everything around them.",
      "The shelves mix Sri Lankan producers with selected international brands, making Gusta as much about discovering good products as ticking things off a shopping list. The concept-store side adds another layer, with lifestyle, personal-care and locally made products to browse beyond food.",
    ],
  },
  {
    title: "Don’t Miss the CIAO Fridge",
    body: [
      "CIAO is one of the names worth looking for in the chilled section. Gusta carries CIAO dairy favourites including Greek yoghurt, mozzarella and smoked mozzarella, alongside a wider selection of cheeses and chilled products.",
      "Cheese has been part of Gusta’s identity since its early days, and the dairy section remains a good reason to linger.",
    ],
  },
  {
    title: "From Ahangama and Beyond",
    body: [
      "Gusta has expanded beyond its original online platform with physical stores including Nugegoda, Ahangama and Mirissa, while its online store brings the wider range directly to customers.",
      "In Ahangama, its location on the Café Ceylon grounds in Kabalana makes it an easy stop whether you’re living here, staying for a season or stocking a villa for the week.",
      "Gusta works because it doesn’t ask you to choose between practical and interesting. Go in for the groceries, and there’s a good chance you’ll leave having discovered something else.",
    ],
  },
];

const NEXT_ARTICLE = {
  href: "/inside-the-launch-of-ahangama-circle",
  kicker: "Read Next",
  title: "Inside the Launch of Ahangama Circle",
  image:
    "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/inside-the-launch-of-ahangama-circle/hero+-+Guests+networking+at+Surf+Club+Midigama+during+sunset+-+Option+01+.jpeg",
};

function renderLinkedText(text) {
  const sortedLinks = [...PLACE_LINKS].sort(
    (left, right) => right.label.length - left.label.length,
  );
  const matches = [];

  sortedLinks.forEach((link) => {
    let searchIndex = 0;
    while (searchIndex < text.length) {
      const foundIndex = text.indexOf(link.label, searchIndex);
      if (foundIndex === -1) break;

      const overlaps = matches.some(
        (match) =>
          foundIndex < match.end && foundIndex + link.label.length > match.start,
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

export default function GustaGroceriesAhangamaPage() {
  const canonical = absUrl(GUSTA_GROCERIES_AHANGAMA_PATH);

  return (
    <SiteLayout navOverlayHero>
      <Seo
        title="Gusta: Groceries, Good Food and More in Ahangama"
        description="From everyday essentials and CIAO favourites to local brands and lifestyle finds, Gusta brings a different kind of grocery shopping to the South Coast."
        canonical={canonical}
        ogImage={HERO_IMAGE}
        ogType="article"
        author="Ahangama Guide Editorial Team"
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
                    background:
                      "linear-gradient(90deg, rgba(10,14,18,0.82) 0%, rgba(10,14,18,0.7) 23%, rgba(10,14,18,0.42) 45%, rgba(10,14,18,0.12) 68%, rgba(10,14,18,0) 100%)",
                    pointerEvents: "none",
                    zIndex: 2,
                  }}
                />
                <img
                  className="home-hero-image"
                  src={HERO_IMAGE}
                  alt="The exterior of Gusta Ahangama in Kabalana"
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
                    maxWidth: 760,
                    padding:
                      "clamp(44px, 5vw, 68px) clamp(32px, 4.8vw, 72px) 36px",
                  }}
                >
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
                    {["Shop Guide", "Ahangama Editorial"].map((item) => (
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
                    {["Gusta:", "Groceries,", "Good Food", "and More"].map((line) => (
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
                    From the Editor Ahangama
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
                    From everyday essentials and CIAO favourites to local brands
                    and lifestyle finds, Gusta brings a different kind of grocery
                    shopping to the South Coast.
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
            alt="Gusta Ahangama staff standing outside the Kabalana store"
          />

          <ArticleSection section={articleSections[0]} first />

          <ArticleSection section={articleSections[1]} />
          <PortraitGrid
            images={[
              {
                src: CIAO_PRODUCTS_IMAGE,
                alt: "CIAO dairy products in the chilled section at Gusta Ahangama",
              },
              {
                src: MILKY_SIGN_IMAGE,
                alt: "Milky by Gusta sign at the Ahangama store",
              },
            ]}
          />

          <ArticleSection section={articleSections[2]} />
          <PortraitGrid
            images={[
              {
                src: ICE_CREAM_IMAGE,
                alt: "Gusta Ahangama team member holding an ice cream",
              },
              {
                src: LIFESTYLE_PRODUCTS_IMAGE,
                alt: "Lifestyle products displayed inside Gusta Ahangama",
              },
              {
                src: POSTCARDS_IMAGE,
                alt: "Postcards and concept-store products at Gusta Ahangama",
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