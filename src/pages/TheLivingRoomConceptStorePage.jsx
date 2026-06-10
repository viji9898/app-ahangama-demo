import React from "react";
import { Typography } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import EditorialNextArticle from "../components/ui/EditorialNextArticle";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";

const { Paragraph, Text, Title } = Typography;

const HERO_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/the-living-room-concept-store/hero-the-living-room-concept-store.jpeg";

const SIGNAGE_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/the-living-room-concept-store/shop-road-signage.jpeg";
const FLOOR_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/the-living-room-concept-store/showroom-floor.jpeg";
const SHELF_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/the-living-room-concept-store/showroom-shelf-display.jpeg";
const CUSTOMER_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/the-living-room-concept-store/customer-clothing.jpeg";
const RACK_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/the-living-room-concept-store/clothes-rack.jpeg";
const COFFEE_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/the-living-room-concept-store/filtered-coffee-brew.jpeg";
const JOURNALING_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/the-living-room-concept-store/journaling.jpeg";
const MAGAZINE_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/the-living-room-concept-store/magazine-collection.jpeg";
const SERVING_COFFEE_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/the-living-room-concept-store/serving-coffee.jpeg";
const ICED_TEA_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/the-living-room-concept-store/iced-tea.jpeg";
const LIVING_ROOM_INSTAGRAM_URL =
  "https://www.instagram.com/itsyour.livingroom/";

const NEXT_ARTICLE = {
  href: "/shops",
  kicker: "Discover More",
  title: "Ahangama's Independent Shops",
  image:
    "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/the-living-room-concept-store/showroom-shelf-display.jpeg",
};

const articleIntroduction = [
  "The Living Room Concept Store was inspired by the essence of traditional Sri Lankan architecture, where different spaces of a home open into a shared central area.",
  "While often called a living room, this space is much more than a room. It is where people gather, connect, pause, and feel at home.",
  "We wanted to bring this idea into a retail environment by creating a space that feels welcoming, thoughtful, and human.",
];

const articleSections = [
  {
    title: "A Retail Space Modelled on Home",
    body: [
      "Living Room is a carefully curated concept store where every detail has been intentionally designed. From custom-made furniture to soft shapes and the absence of sharp edges, the space encourages visitors to slow down and experience their surroundings mindfully.",
    ],
  },
  {
    title: "A Room for Brands and Makers",
    body: [
      "More than a store, Living Room is a room for brands and makers. We believe in conscious consumption and invite people to discover products with curiosity, care, and intention.",
      "Rather than rushing through a shopping experience, we encourage visitors to connect with the stories, craftsmanship, and values behind each item.",
    ],
    quote: "A place to gather, discover, and belong.",
  },
  {
    title: "About the Menu",
    body: [
      "At the heart of the space is our coffee and homemade bakery bar, bringing warmth, comfort, and a sense of familiarity. Whether you’re stopping by for a coffee, exploring independent brands, or simply taking a moment to relax, Living Room is designed to make everyone feel as though they are sitting in their own living room.",
      "Our menu is built around freshness, comfort, and simplicity. We focus on fresh ingredients, homemade goods, and carefully prepared food and drinks that feel nourishing and familiar.",
      "From our homemade bakery selection to specialty coffee, cold-pressed juices, and smoothies, everything is made with quality ingredients and attention to detail. Inspired by the feeling of being at home, our menu is designed to offer wholesome flavors that can be enjoyed at any time of the day.",
      "Whether you’re stopping by for a morning coffee, a fresh juice after the beach, or an afternoon treat, we hope Living Room feels both grounding and generous.",
    ],
  },
];

function renderLivingRoomLinkedText(text, styleOverride = {}) {
  const label = "Living Room Concept Store";
  const foundIndex = text.indexOf(label);

  if (foundIndex === -1) return text;

  const before = text.slice(0, foundIndex);
  const after = text.slice(foundIndex + label.length);

  return [
    before,
    <a
      key={`${label}-${foundIndex}`}
      href={LIVING_ROOM_INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: "#2f2a24",
        textDecoration: "none",
        borderBottom: "1px solid rgba(214, 178, 102, 0.9)",
        paddingBottom: 1,
        ...styleOverride,
      }}
    >
      {label}
    </a>,
    after,
  ];
}

export default function TheLivingRoomConceptStorePage() {
  const canonical = absUrl("/the-living-room-concept-store");

  return (
    <SiteLayout navOverlayHero>
      <Seo
        title="The Living Room Concept Store"
        description="An editorial page about The Living Room Concept Store in Ahangama."
        canonical={canonical}
        ogImage={HERO_IMAGE}
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
          <div>
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
                  style={{
                    position: "absolute",
                    inset: 0,
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="home-hero-overlay"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(90deg, rgba(10,14,18,0.82) 0%, rgba(10,14,18,0.74) 20%, rgba(10,14,18,0.5) 38%, rgba(10,14,18,0.2) 56%, rgba(10,14,18,0.04) 74%, rgba(10,14,18,0) 100%)",
                      pointerEvents: "none",
                      zIndex: 2,
                    }}
                  />
                  <img
                    className="home-hero-image"
                    src={HERO_IMAGE}
                    alt="The Living Room Concept Store showroom"
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
                      maxWidth: 620,
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
                      <a
                        href={LIVING_ROOM_INSTAGRAM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#FFFFFF",
                          textDecoration: "none",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.78)",
                          paddingBottom: 1,
                        }}
                      >
                        <span
                          className="home-hero-titleLine"
                          style={{ color: "#FFFFFF" }}
                        >
                          Living Room
                        </span>
                        <span
                          className="home-hero-titleLine"
                          style={{ color: "#FFFFFF" }}
                        >
                          Concept
                        </span>
                        <span
                          className="home-hero-titleLine"
                          style={{ color: "#FFFFFF" }}
                        >
                          Store
                        </span>
                      </a>
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
                      From the Editor
                    </Text>

                    <Paragraph
                      style={{
                        marginTop: 24,
                        marginBottom: 22,
                        maxWidth: 520,
                        color: "#FFFFFF",
                        fontSize: "clamp(16px, 1.45vw, 19px)",
                        lineHeight: 1.72,
                      }}
                    >
                      A design-led retail and coffee space in Ahangama, shaped
                      around the feeling of home, slow discovery and a more
                      thoughtful way to spend time in town.
                    </Paragraph>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dm-wrap" style={{ paddingTop: 28 }}>
          <div
            style={{
              maxWidth: 920,
              paddingBottom: 12,
            }}
          >
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
                {renderLivingRoomLinkedText(paragraph)}
              </Paragraph>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "8px 0 28px",
              width: "100%",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 1400,
                aspectRatio: "3 / 2",
                overflow: "hidden",
                boxShadow: "0 16px 40px rgba(18,24,22,0.12)",
              }}
            >
              <img
                src={SIGNAGE_IMAGE}
                alt="The Living Room Concept Store roadside signage"
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center center",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {articleSections.map((section, index) => (
              <React.Fragment key={section.title}>
                {index === 0 ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: 24,
                      margin: "0 auto 28px",
                      width: "100%",
                      maxWidth: 1224,
                    }}
                  >
                    <img
                      src={FLOOR_IMAGE}
                      alt="The Living Room Concept Store showroom floor"
                      style={{
                        display: "block",
                        width: "100%",
                        maxWidth: 600,
                        aspectRatio: "4 / 5",
                        objectFit: "cover",
                        boxShadow: "0 16px 36px rgba(18,24,22,0.10)",
                      }}
                    />
                    <img
                      src={SHELF_IMAGE}
                      alt="The Living Room shelf display"
                      style={{
                        display: "block",
                        width: "100%",
                        maxWidth: 600,
                        aspectRatio: "4 / 5",
                        objectFit: "cover",
                        boxShadow: "0 16px 36px rgba(18,24,22,0.10)",
                      }}
                    />
                  </div>
                ) : null}

                <section
                  style={{
                    padding: index === 0 ? "20px 0 36px" : "36px 0",
                    borderTop:
                      index === 0 ? "none" : "1px solid rgba(47,62,58,0.12)",
                  }}
                >
                  <div style={{ maxWidth: 1180 }}>
                    <Title level={2} style={{ marginTop: 0, marginBottom: 18 }}>
                      {section.title}
                    </Title>

                    {section.body.map((paragraph) => (
                      <Paragraph
                        key={paragraph}
                        style={{
                          maxWidth: 1200,
                          fontSize: 16,
                          lineHeight: 1.8,
                          color: "#55514B",
                          marginBottom: 18,
                        }}
                      >
                        {paragraph}
                      </Paragraph>
                    ))}

                    {section.quote ? (
                      <blockquote
                        style={{
                          margin: "0 0 18px",
                          padding: "18px 22px",
                          borderLeft: "3px solid rgba(107,90,78,0.4)",
                          background: "rgba(255,255,255,0.72)",
                          color: "#55514B",
                          fontSize: 18,
                          lineHeight: 1.8,
                        }}
                      >
                        {section.quote}
                      </blockquote>
                    ) : null}
                  </div>
                </section>

                {index === 1 ? (
                  <>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                        gap: 24,
                        margin: "0 auto 28px",
                        width: "100%",
                        maxWidth: 1224,
                      }}
                    >
                      <img
                        src={CUSTOMER_IMAGE}
                        alt="Customer browsing clothing at The Living Room"
                        style={{
                          display: "block",
                          width: "100%",
                          aspectRatio: "4 / 5",
                          objectFit: "cover",
                          boxShadow: "0 16px 36px rgba(18,24,22,0.10)",
                        }}
                      />
                      <img
                        src={RACK_IMAGE}
                        alt="Clothes rack at The Living Room"
                        style={{
                          display: "block",
                          width: "100%",
                          aspectRatio: "4 / 5",
                          objectFit: "cover",
                          boxShadow: "0 16px 36px rgba(18,24,22,0.10)",
                        }}
                      />
                      <img
                        src={MAGAZINE_IMAGE}
                        alt="Magazine collection at The Living Room"
                        style={{
                          display: "block",
                          width: "100%",
                          aspectRatio: "4 / 5",
                          objectFit: "cover",
                          boxShadow: "0 16px 36px rgba(18,24,22,0.10)",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                        gap: 24,
                        margin: "0 auto 28px",
                        width: "100%",
                        maxWidth: 1224,
                      }}
                    >
                      <img
                        src={COFFEE_IMAGE}
                        alt="Filtered coffee brewing at The Living Room"
                        style={{
                          display: "block",
                          width: "100%",
                          aspectRatio: "4 / 5",
                          objectFit: "cover",
                          boxShadow: "0 16px 36px rgba(18,24,22,0.10)",
                        }}
                      />
                      <img
                        src={JOURNALING_IMAGE}
                        alt="Journaling at The Living Room"
                        style={{
                          display: "block",
                          width: "100%",
                          aspectRatio: "4 / 5",
                          objectFit: "cover",
                          boxShadow: "0 16px 36px rgba(18,24,22,0.10)",
                        }}
                      />
                    </div>
                  </>
                ) : null}

                {index === 2 ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: 24,
                      margin: "0 auto 28px",
                      width: "100%",
                      maxWidth: 1224,
                    }}
                  >
                    <img
                      src={SERVING_COFFEE_IMAGE}
                      alt="Serving coffee at The Living Room"
                      style={{
                        display: "block",
                        width: "100%",
                        maxWidth: 600,
                        aspectRatio: "4 / 5",
                        objectFit: "cover",
                        boxShadow: "0 16px 36px rgba(18,24,22,0.10)",
                      }}
                    />
                    <img
                      src={ICED_TEA_IMAGE}
                      alt="Iced tea at The Living Room"
                      style={{
                        display: "block",
                        width: "100%",
                        maxWidth: 600,
                        aspectRatio: "4 / 5",
                        objectFit: "cover",
                        boxShadow: "0 16px 36px rgba(18,24,22,0.10)",
                      }}
                    />
                  </div>
                ) : null}
              </React.Fragment>
            ))}
          </div>

          <EditorialNextArticle
            href={NEXT_ARTICLE.href}
            kicker={NEXT_ARTICLE.kicker}
            title={NEXT_ARTICLE.title}
            image={NEXT_ARTICLE.image}
          />
        </div>
      </div>
    </SiteLayout>
  );
}
