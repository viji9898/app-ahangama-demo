import React from "react";
import { Typography } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import EditorialNextArticle from "../components/ui/EditorialNextArticle";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";

const { Paragraph, Text, Title } = Typography;

export const COMMUNITY_MARKET_IN_AHANGAMA_PATH =
  "/community-market-in-ahangama";

const HERO_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/community-markets-in-ahangama/Hero+image+_+community-markets-ahangama-crowd-stalls.webp";
const WIDE_FEATURE_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/community-markets-in-ahangama/wide+feature+image+_+community-markets-crowd-stalls.webp.webp";
const LIVE_MUSIC_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/community-markets-in-ahangama/portrait+_+ahangama-evening-market-live-music.webp";
const LIVE_MUSIC_ALT_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/community-markets-in-ahangama/+portrait+_ahangama-evening-market-live-music.webp";
const JEWELLERY_WORKSHOP_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/community-markets-in-ahangama/+Potrait_+ahangama-market-workshop-jewellery-.jpg.webp";
const JEWELLERY_STONES_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/community-markets-in-ahangama/+Potrait_+ahangama-market-workshop-jewellery-making-stones..webp.webp";
const JEWELLERY_MAKING_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/community-markets-in-ahangama/+Potrait_+ahangama-market-workshop-jewellery-making..webp.webp";
const HANDMADE_PRODUCTS_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/community-markets-in-ahangama/Potrait+_++ahangama-market-handmade-products..webp";
const HANDMADE_PRODUCTS_ALT_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/community-markets-in-ahangama/Potrait+_++ahangama-market-handmade-products.(1).webp";

const NEXT_ARTICLE = {
  href: "/the-living-room-concept-store",
  kicker: "Read Next",
  title: "The Living Room Concept Store",
  image:
    "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/the-living-room-concept-store/showroom-shelf-display.jpeg",
};

const articleIntroduction = [
  "Community markets in Ahangama are not fixed events. They appear throughout the week and month as pop-ups, weekend gatherings, and creative takeovers inside cafes, boutique spaces, and community venues.",
  "Each one feels slightly different, shaped by the people who show up and the space it happens in.",
  "What connects them is simple: people come together to share, create, and experience something in real time. Locals, travellers, artists, and small businesses meet in the same space, making these markets feel more like gatherings than formal events.",
  "As Ahangama continues to evolve, these community-led moments have become an important part of its creative identity.",
];

const articleSections = [
  {
    title: "A Platform for Local Makers",
    body: [
      "At the centre of these markets are independent creators. Handmade jewellery, small fashion labels, ceramics, natural skincare, artwork, and food-based products are commonly found across stalls.",
      "Most of these brands are built locally or by people connected to Ahangama's creative and surf community. Markets give them direct access to visitors, allowing conversations to happen between maker and customer without distance or formality.",
      "Venues such as Cafe Ceylon and other creative spaces across Ahangama often host or support these gatherings, turning their spaces into temporary platforms for local work.",
    ],
  },
  {
    title: "More Than Shopping",
    body: [
      "Community markets in Ahangama go beyond stalls. Visitors often find workshops such as jewellery making, craft sessions, or cooking demonstrations happening alongside vendors.",
      "The experience is interactive and slow. People move between conversations, food, and open spaces without a fixed path to follow.",
      "It is less about what to buy and more about how to spend time.",
    ],
    quote: "Less about what to buy and more about how to spend time.",
  },
  {
    title: "When the Day Turns Into Evening",
    body: [
      "As the day moves into evening, many markets shift in energy. Music begins, food becomes central, and the space becomes more social.",
      "Live performances, DJ sets, and informal gatherings often extend the experience into the night.",
      "Community markets reflect how Ahangama is changing. The town is no longer defined only by places, but by shared experiences where creativity and community overlap.",
      "These markets quietly connect locals and travellers, shaping a culture that continues to evolve.",
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

export default function CommunityMarketInAhangamaPage() {
  const canonical = absUrl(COMMUNITY_MARKET_IN_AHANGAMA_PATH);
  const publishDate = "2026-06-25T09:00:00.000Z";

  return (
    <SiteLayout navOverlayHero>
      <Seo
        title="Community Markets in Ahangama"
        description="Where local creativity, makers, and travellers come together through Ahangama's pop-up markets, workshops, music, and community gatherings."
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
                    alt="Crowd and stalls at a community market in Ahangama"
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
                      maxWidth: 680,
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
                      {["Community Guide", "Ahangama Editorial"].map((item) => (
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
                        Community Markets
                      </span>
                      <span
                        className="home-hero-titleLine stairway-hero-titleLine"
                        style={{ color: "#FFFFFF" }}
                      >
                        in Ahangama
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
                      By Ahangama Guide Editorial Team
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
                      Where local creativity, makers, and travellers come
                      together through Ahangama's community-led markets.
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
                src={WIDE_FEATURE_IMAGE}
                alt="Community market crowd and stalls in Ahangama"
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
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
                      gap: 24,
                      margin: "0 auto 28px",
                      width: "100%",
                      maxWidth: 1224,
                    }}
                  >
                    <ArticleImage
                      src={HANDMADE_PRODUCTS_IMAGE}
                      alt="Handmade products at an Ahangama community market"
                    />
                    <ArticleImage
                      src={HANDMADE_PRODUCTS_ALT_IMAGE}
                      alt="Market stall with handmade products in Ahangama"
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
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
                        gap: 24,
                        margin: "0 auto 28px",
                        width: "100%",
                        maxWidth: 1224,
                      }}
                    >
                      <ArticleImage
                        src={JEWELLERY_WORKSHOP_IMAGE}
                        alt="Jewellery workshop at an Ahangama market"
                      />
                      <ArticleImage
                        src={JEWELLERY_STONES_IMAGE}
                        alt="Stones used in a jewellery making workshop"
                      />
                      <ArticleImage
                        src={JEWELLERY_MAKING_IMAGE}
                        alt="Jewellery making session at an Ahangama market"
                      />
                    </div>
                  </>
                ) : null}

                {index === 2 ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
                      gap: 24,
                      margin: "0 auto 28px",
                      width: "100%",
                      maxWidth: 1224,
                    }}
                  >
                    <ArticleImage
                      src={LIVE_MUSIC_IMAGE}
                      alt="Live music at an evening community market in Ahangama"
                    />
                    <ArticleImage
                      src={LIVE_MUSIC_ALT_IMAGE}
                      alt="Evening market gathering with live music in Ahangama"
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