import React from "react";
import { Typography } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import EditorialNextArticle from "../components/ui/EditorialNextArticle";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";

const { Paragraph, Text, Title } = Typography;

export const WHERE_AHANGAMA_GATHERS_FOR_SUNSET_PATH =
  "/where-ahangama-gathers-for-sunset-stairway-rooftop-bar-at-lighthouse-hotel";

const HERO_IMAGE =
  "/Light%20House%20Webpage%20images/light-house-front-facing-view-portrait.webp";
const VIEW_FROM_BAR_IMAGE =
  "/Light%20House%20Webpage%20images/light-house-beach-view-hero.webp";
const ROOFTOP_GUEST_IMAGE =
  "/Light%20House%20Webpage%20images/people-enjoying-cocktails-in-the-rooftop-portrait.webp";
const BARTENDER_COCKTAILS_IMAGE =
  "/Light%20House%20Webpage%20images/light-house-staff-2-making-cocktails-portrait.webp";
const PURPLE_OASIS_IMAGE =
  "/Light%20House%20Webpage%20images/cocktail-3-portrait.webp";
const GOLDEN_SOUR_IMAGE =
  "/Light%20House%20Webpage%20images/light-house-staff-making-cocktails-portrait.webp";
const CUCUMBER_MULE_IMAGE =
  "/Light%20House%20Webpage%20images/light-house-cocktail-making-section-in-detail-portrait.webp";
const CEYLON_SPRITZ_IMAGE =
  "/Light%20House%20Webpage%20images/cocktail-4-wide-feature.webp";

const NEXT_ARTICLE = {
  href: "/lighthouse",
  kicker: "Explore More",
  title: "Lighthouse Guest Pass",
  image: "/Light%20House%20Webpage%20images/light-house-beach-view-og.webp",
};

const articleIntroduction = [
  "There is a certain point in the afternoon when Ahangama begins to shift gears. Surfboards are rinsed and stacked away, laptops close after a day of remote work, and the coastline settles into the anticipation of sunset.",
  "Above the ocean at Lighthouse Hotel, Stairway Rooftop Bar has become one of those places where people naturally gravitate as the day draws to a close.",
];

const articleSections = [
  {
    title: "A Rooftop Built Around Golden Hour",
    body: [
      "The rooftop overlooks a stretch of coastline where the Indian Ocean seems to fill every corner of the view. During golden hour, the sea catches the changing light, shifting from bright blue to shades of amber, pink and violet.",
      "A steady breeze moves through the open-air space, carrying the sound of waves below and creating the kind of atmosphere that encourages people to linger long after sunset has disappeared.",
    ],
  },
  {
    title: "A Destination and a Neighbourhood Gathering Place",
    body: [
      "What makes Stairway feel distinctive is its balance. It manages to be both a destination and a neighbourhood gathering place.",
      "Travellers discovering Ahangama for the first time share the space with local residents, surfers comparing the day's conditions, and remote workers unwinding after hours spent behind screens.",
      "Conversations drift easily between tables, creating an atmosphere that feels social without ever becoming overwhelming.",
    ],
    quote: "Social without ever becoming overwhelming.",
  },
  {
    title: "Cocktails That Follow the Sunset",
    body: [
      "The cocktail menu plays a central role in the experience, though never in a way that overshadows the setting itself.",
      "As the sun begins its descent, a Ceylon Spritz feels perfectly suited to the moment, light and refreshing against the warm evening air. Nearby, a Golden Sour arrives glowing in the final sunlight, its smooth finish matching the easy pace of the rooftop.",
      "As daylight softens and the horizon turns purple, drinks such as the Purple Oasis seem almost designed to mirror the colours unfolding across the ocean.",
      "Later, when the coastline becomes a silhouette and the sound of the surf grows more prominent, the Devil's Wave often becomes a favourite among guests, its bold character fitting the mood of the evening.",
    ],
  },
  {
    title: "More Than a Rooftop View",
    body: [
      "The experience extends beyond cocktails. The kitchen has developed a loyal following of its own, with guests regularly praising everything from sunset snacks and perfectly cooked fries to generous burgers enjoyed against the backdrop of the ocean.",
      "During the day, the rooftop takes on a different personality altogether. Morning coffees, fresh fruit bowls and long, unhurried lunches are accompanied by uninterrupted sea views and the calm rhythm of coastal life below.",
    ],
  },
  {
    title: "The Feeling Guests Remember",
    body: [
      "Reading through recent visitor reviews, a common theme emerges. Guests speak about the warmth of the staff, the quality of the food and drinks, and the sense that Stairway offers something more than just a rooftop view.",
      "It is the combination of hospitality, setting and atmosphere that leaves an impression.",
      "One visitor described it as a place they returned to repeatedly during their stay, praising the cocktails, atmosphere and sunset views. Others highlighted the welcoming service, memorable meals and the feeling of discovering a hidden corner of Ahangama that captures the essence of the town.",
      "In a town known for beautiful sunsets, Stairway Rooftop Bar has quietly established itself as one of the places where people choose to slow down and watch the day unfold, whether over a morning coffee, an evening cocktail, or simply the ever-changing view of the ocean beyond.",
    ],
  },
];

function ArticleImage({ src, alt, aspectRatio = "4 / 5", objectPosition = "center center" }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        display: "block",
        width: "100%",
        aspectRatio,
        objectFit: "cover",
        objectPosition,
        boxShadow: "0 16px 36px rgba(18,24,22,0.10)",
      }}
    />
  );
}

export default function WhereAhangamaGathersForSunsetPage() {
  const canonical = absUrl(WHERE_AHANGAMA_GATHERS_FOR_SUNSET_PATH);
  const publishDate = "2026-06-21T09:00:00.000Z";

  return (
    <SiteLayout navOverlayHero>
      <Seo
        title="Where Ahangama Gathers for Sunset - Stairway Rooftop Bar"
        description="A sunset story from Stairway Rooftop Bar at Lighthouse Hotel, where cocktails, ocean views and Ahangama's evening rhythm meet."
        canonical={canonical}
        ogImage={HERO_IMAGE}
        ogType="article"
        author="viji.com"
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
                        "linear-gradient(90deg, rgba(10,14,18,0.82) 0%, rgba(10,14,18,0.72) 22%, rgba(10,14,18,0.48) 42%, rgba(10,14,18,0.18) 64%, rgba(10,14,18,0) 100%)",
                      pointerEvents: "none",
                      zIndex: 2,
                    }}
                  />
                  <img
                    className="home-hero-image"
                    src={HERO_IMAGE}
                    alt="Sunset view from Stairway Rooftop Bar at Lighthouse Hotel"
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
                      maxWidth: 700,
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
                      {["Rooftop Bar", "Ahangama Editorial"].map((item) => (
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
                      className="home-hero-title stairway-hero-title"
                      style={{
                        margin: 0,
                        color: "#FFFFFF",
                        fontWeight: 500,
                        fontFamily:
                          '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                      }}
                    >
                      <span
                        className="home-hero-titleLine stairway-hero-titleLine"
                        style={{ color: "#FFFFFF" }}
                      >
                        Where Ahangama
                      </span>
                      <span
                        className="home-hero-titleLine stairway-hero-titleLine"
                        style={{ color: "#FFFFFF" }}
                      >
                        Gathers for Sunset
                      </span>
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
                      Stairway Rooftop Bar at Lighthouse Hotel
                    </Text>

                    <Paragraph
                      style={{
                        marginTop: 24,
                        marginBottom: 22,
                        maxWidth: 560,
                        color: "#FFFFFF",
                        fontSize: "clamp(16px, 1.45vw, 19px)",
                        lineHeight: 1.72,
                      }}
                    >
                      A sunset story from Stairway Rooftop Bar at Lighthouse
                      Hotel, where cocktails, ocean views and Ahangama's evening
                      rhythm meet.
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
                  color: index === 0 ? "#2f2a24" : "#55514B",
                  marginBottom: 18,
                }}
              >
                {paragraph}
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
                src={CEYLON_SPRITZ_IMAGE}
                alt="Ceylon Spritz cocktail at Stairway Rooftop Bar"
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
                    <ArticleImage
                      src={VIEW_FROM_BAR_IMAGE}
                      alt="View from Stairway Rooftop Bar over the ocean"
                    />
                    <ArticleImage
                      src={ROOFTOP_GUEST_IMAGE}
                      alt="Guest on the rooftop with the ocean in the background"
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
                    <ArticleImage
                      src={GOLDEN_SOUR_IMAGE}
                      alt="Golden Sour cocktail being served at Stairway"
                    />
                    <ArticleImage
                      src={BARTENDER_COCKTAILS_IMAGE}
                      alt="Bartender presenting four cocktails at Stairway"
                    />
                  </div>
                ) : null}

                {index === 2 ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      margin: "0 auto 28px",
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
                        src={PURPLE_OASIS_IMAGE}
                        alt="Purple Oasis cocktail with the ocean in the background"
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
                ) : null}

                {index === 3 ? (
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
                    <ArticleImage
                      src={CUCUMBER_MULE_IMAGE}
                      alt="Cucumber Mule cocktail with a Lighthouse coaster"
                    />
                    <ArticleImage
                      src="/Light%20House%20Webpage%20images/people-enjoying-the-beach-view-wide-feature.webp"
                      alt="Sunset crowd at Stairway Rooftop Bar"
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