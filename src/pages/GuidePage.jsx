import React from "react";
import { Typography } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import AnimalsWebImage from "../assets/animals4x scale copy.webp";
import TrebathaWebImage from "../assets/Trebatha 4x scale copy.webp";

const { Paragraph, Text, Title } = Typography;

const GUIDE_HERO_IMAGE =
  "https://content.r9cdn.net/rimg/dimg/09/d4/c553223f-city-304822-172c638b4d6.jpg?crop=true&width=1366&height=768&xhint=1254&yhint=1207";

const GUIDE_CONTENT_IMAGE =
  "https://stokedsurfadventures.com/wp-content/uploads/2024/05/Gota-Dagua-sri-lanka-surf-camp-ahangama-learn-to-surf-coaching-kabalana-stoked-surf-adventures-14-copy.jpg";

const GUIDE_OVERVIEW_IMAGE =
  "https://bookinglayer-cdn.ams3.cdn.digitaloceanspaces.com/uploads/businesses/944/images/1440_6e0-1635949941.webp";

const GUIDE_BEST_STAYS_INTRO_IMAGE =
  "https://res.cloudinary.com/xmybcqyi/image/upload/v1783675102/Screenshot_2026-07-10_at_14.48.09_btwioa.png";

const GUIDE_BEST_STAYS_IMAGE = TrebathaWebImage;
const GUIDE_ANIMALS_IMAGE = AnimalsWebImage;
const GUIDE_KO_LAKE_VILLA_IMAGE = "https://res.cloudinary.com/dp7in4ulw/image/upload/v1783921928/Ko_Lake_Villa_nqxg16.webp"
const GUIDE_SOLA_HOTEL_IMAGE = "https://res.cloudinary.com/dp7in4ulw/image/upload/v1783921928/Sola_Hotel_t86nt4.webp"
const GUIDE_Kelly_IMAGE = "https://res.cloudinary.com/dp7in4ulw/image/upload/v1783921928/Kelly_Ahangama_ydgnq0.webp"

const GUIDE_EXTRA_STAYS = [
];

const GUIDE_CONTENT_LINKS = [
  "Ahangama Overview",
  "Area Map",
  "Where to Stay ?",
  "Eat & Drink",
  "Experiences & Surf Breaks",
  "Wellness & Healing",
  "Nightlife",
  "Retail & Concept Stores",
  "Wildlife & Nature",
  "Local Culture & Etiquette",
  "Essential Travel Info",
  "Suggested Itineraries",
  "Insider Tips (Things Nobody Tells You)",
  "Connect With Us",
];

function InstagramLabel({ text, justify = "flex-end" }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: justify,
        gap: 8,
      }}
    >
      <svg
        aria-hidden="true"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          stroke="#FFFFFF"
          strokeWidth="1.8"
        />
        <circle cx="12" cy="12" r="4.2" stroke="#FFFFFF" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.8" r="1.2" fill="#FFFFFF" />
      </svg>
      <span>{text}</span>
    </span>
  );
}

function DirectionLabel({ text = "Direction", justify = "flex-end" }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: justify,
        gap: 8,
      }}
    >
      <svg
        aria-hidden="true"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 21s6-5.55 6-10a6 6 0 1 0-12 0c0 4.45 6 10 6 10Z"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="11" r="2.2" fill="#FFFFFF" />
      </svg>
      <span>{text}</span>
    </span>
  );
}

function FullBleedSection({ children }) {
  return (
    <div className="dm-canvas" style={{ marginTop: 0, paddingTop: 0 }}>
      <div className="dm-wrap">
        <section
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
          {children}
        </section>
      </div>
    </div>
  );
}

export default function GuidePage() {
  const canonical = absUrl("/guide");

  return (
    <SiteLayout navOverlayHero showFooter={false} showNav={false}>
      <Seo
        title="Ahangama 2026/2027 Season Guide"
        description="Ahangama 2026/2027 Season Guide."
        canonical={canonical}
        ogImage={GUIDE_HERO_IMAGE}
      />

      <FullBleedSection>
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
                  "linear-gradient(90deg, rgba(10,14,18,0.82) 0%, rgba(10,14,18,0.66) 28%, rgba(10,14,18,0.34) 58%, rgba(10,14,18,0.08) 100%)",
                pointerEvents: "none",
                zIndex: 2,
              }}
            />
            <img
              className="home-hero-image"
              src={GUIDE_HERO_IMAGE}
              alt="Ahangama coastline"
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

          <div style={{ position: "relative", zIndex: 3, width: "100%", maxWidth: "none", margin: 0 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                minHeight: "100svh",
                maxWidth: 780,
                padding: "clamp(44px, 5vw, 68px) clamp(32px, 4.8vw, 72px) 44px",
              }}
            >
              <Title
                className="home-hero-title"
                style={{
                  margin: 0,
                  transform: "translateY(-50px)",
                  color: "#FFFFFF",
                  fontWeight: 500,
                  fontFamily: '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                }}
              >
                <span className="home-hero-titleLine" style={{ color: "#FFFFFF" }}>
                  Ahangama
                </span>
                <span className="home-hero-titleLine" style={{ color: "#FFFFFF", whiteSpace: "nowrap" }}>
                  2026/2027
                </span>
                <span className="home-hero-titleLine" style={{ color: "#FFFFFF" }}>
                  Season Guide
                </span>
              </Title>
            </div>
          </div>
        </div>
      </FullBleedSection>

      <FullBleedSection>
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
                  "linear-gradient(90deg, rgba(10,14,18,0.86) 0%, rgba(10,14,18,0.76) 28%, rgba(10,14,18,0.46) 58%, rgba(10,14,18,0.12) 100%)",
                pointerEvents: "none",
                zIndex: 2,
              }}
            />
            <img
              className="home-hero-image"
              src={GUIDE_CONTENT_IMAGE}
              alt="Surf lesson in Ahangama"
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

          <div style={{ position: "relative", zIndex: 3, width: "100%", maxWidth: "none", margin: 0 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                minHeight: "100svh",
                maxWidth: 920,
                padding: "clamp(44px, 5vw, 68px) clamp(32px, 4.8vw, 72px) 44px",
              }}
            >
              <Text
                style={{
                  display: "block",
                  marginBottom: 18,
                  color: "#FFFFFF",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.6,
                  textTransform: "uppercase",
                }}
              >
                Content
              </Text>

              <Title
                className="home-hero-title"
                style={{
                  margin: "0 0 56px",
                  color: "#FFFFFF",
                  fontWeight: 500,
                  fontFamily: '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                }}
              >
                <span className="home-hero-titleLine" style={{ color: "#FFFFFF" }}>
                  Guide
                </span>
                <span className="home-hero-titleLine" style={{ color: "#FFFFFF", whiteSpace: "normal" }}>
                  Contents
                </span>
              </Title>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 12,
                  marginTop: 26,
                  maxWidth: 880,
                }}
              >
                {GUIDE_CONTENT_LINKS.map((item, index) => (
                  <a
                    key={item}
                    href={`#guide-section-${index + 1}`}
                    style={{
                      display: "block",
                      padding: "0 0 12px",
                      borderBottom: "1px solid rgba(32,30,27,0.72)",
                      color: "#FFFFFF",
                      textDecoration: "none",
                      fontSize: "clamp(16px, 1.45vw, 19px)",
                      lineHeight: 1.72,
                      background: "transparent",
                    }}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FullBleedSection>

      <FullBleedSection>
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
                  "linear-gradient(90deg, rgba(10,14,18,0.86) 0%, rgba(10,14,18,0.72) 30%, rgba(10,14,18,0.4) 62%, rgba(10,14,18,0.12) 100%)",
                pointerEvents: "none",
                zIndex: 2,
              }}
            />
            <img
              className="home-hero-image"
              src={GUIDE_OVERVIEW_IMAGE}
              alt="Ahangama coastal landscape"
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

          <div style={{ position: "relative", zIndex: 3, width: "100%", maxWidth: "none", margin: 0 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                minHeight: "100svh",
                maxWidth: 780,
                padding: "clamp(44px, 5vw, 68px) clamp(32px, 4.8vw, 72px) 44px",
              }}
            >
              <Text
                style={{
                  display: "block",
                  marginBottom: 18,
                  color: "#FFFFFF",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.6,
                  textTransform: "uppercase",
                }}
              >
                Overview
              </Text>

              <Title
                className="home-hero-title"
                style={{
                  margin: 0,
                  color: "#FFFFFF",
                  fontWeight: 500,
                  fontFamily: '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                }}
              >
                <span className="home-hero-titleLine" style={{ color: "#FFFFFF" }}>
                  Ahangama
                </span>
                <span className="home-hero-titleLine" style={{ color: "#FFFFFF" }}>
                  Overview
                </span>
              </Title>

              <Paragraph
                style={{
                  marginTop: 24,
                  marginBottom: 0,
                  maxWidth: 640,
                  color: "#FFFFFF",
                  fontSize: "clamp(16px, 1.45vw, 19px)",
                  lineHeight: 1.72,
                }}
              >
                Once a sleepy stretch of local fishing shacks, Ahangama has quietly evolved into the South Coast&apos;s coolest, most curated coastal hub. It has successfully dodged the overdeveloped chaos of other global surf towns, maintaining a delicate balance between slow island living and a thriving, modern aesthetic. If you are looking for barefoot luxury, world-class waves, and jungle-fringed cafes, you have found your spot.
              </Paragraph>
            </div>
          </div>
        </div>
      </FullBleedSection>

      <FullBleedSection>
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
                  "linear-gradient(90deg, rgba(10,14,18,0.84) 0%, rgba(10,14,18,0.72) 26%, rgba(10,14,18,0.44) 56%, rgba(10,14,18,0.1) 100%)",
                pointerEvents: "none",
                zIndex: 2,
              }}
            />
            <img
              className="home-hero-image"
              src={GUIDE_BEST_STAYS_INTRO_IMAGE}
              alt="Best stays in guide"
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

          <div style={{ position: "relative", zIndex: 3, width: "100%", maxWidth: "none", margin: 0 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                minHeight: "100svh",
                maxWidth: 760,
                padding: "clamp(44px, 5vw, 68px) clamp(32px, 4.8vw, 72px) 44px",
              }}
            >
              <Text
                style={{
                  display: "block",
                  marginBottom: 18,
                  color: "#FFFFFF",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.6,
                  textTransform: "uppercase",
                }}
              >
                Stays
              </Text>

              <Title
                className="home-hero-title"
                style={{
                  margin: 0,
                  color: "#FFFFFF",
                  fontWeight: 500,
                  fontFamily: '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                }}
              >
                <span className="home-hero-titleLine" style={{ color: "#FFFFFF" }}>
                  Best Stays
                </span>
              </Title>

              <Paragraph
                style={{
                  marginTop: 24,
                  marginBottom: 0,
                  maxWidth: 640,
                  color: "#FFFFFF",
                  fontSize: "clamp(16px, 1.45vw, 19px)",
                  lineHeight: 1.72,
                }}
              >
                A handpicked list of standout stays in and around Ahangama, from design-led villas to coastal hideaways.
              </Paragraph>
            </div>
          </div>
        </div>
      </FullBleedSection>

      <FullBleedSection>
        <div
          style={{
            background: "#e7e7e7",
            padding: "clamp(28px, 4vw, 48px)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "clamp(20px, 2.5vw, 34px)",
              maxWidth: 1240,
              margin: "0 auto",
            }}
          >
            <article>
              <img
                src={GUIDE_BEST_STAYS_IMAGE}
                alt="Trebartha East the Round House"
                style={{
                  display: "block",
                  width: "100%",
                  aspectRatio: "16 / 11",
                  objectFit: "cover",
                  borderRadius: "36px",
                }}
              />
              <div style={{ padding: "12px 2px 0" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <Title
                    level={2}
                    style={{
                      margin: 0,
                      color: "#072434",
                      fontWeight: 700,
                      fontSize: "clamp(30px, 3.2vw, 56px)",
                      lineHeight: 1.02,
                      fontFamily: '"Manrope", "Avenir Next", "Segoe UI", sans-serif',
                    }}
                  >
                    Trebartha East
                  </Title>
                  <Text
                    style={{
                      color: "#072434",
                      fontSize: "clamp(24px, 2.2vw, 34px)",
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    4.8 ★
                  </Text>
                </div>
                <Paragraph
                  style={{
                    margin: "12px 0 0",
                    color: "#0d2532",
                    fontSize: "clamp(18px, 1.5vw, 30px)",
                    lineHeight: 1.42,
                    maxWidth: "95%",
                  }}
                >
                  Trebartha East: A spectacular, design-led oasis nestled high in the Ahangama jungle.
                </Paragraph>
              </div>
            </article>

            <article>
              <img
                src={GUIDE_ANIMALS_IMAGE}
                alt="Animals hotel pool and courtyard"
                style={{
                  display: "block",
                  width: "100%",
                  aspectRatio: "16 / 11",
                  objectFit: "cover",
                  borderRadius: "36px",
                }}
              />
              <div style={{ padding: "12px 2px 0" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <Title
                    level={2}
                    style={{
                      margin: 0,
                      color: "#072434",
                      fontWeight: 700,
                      fontSize: "clamp(30px, 3.2vw, 56px)",
                      lineHeight: 1.02,
                      fontFamily: '"Manrope", "Avenir Next", "Segoe UI", sans-serif',
                    }}
                  >
                    Non Animals
                  </Title>
                  <Text
                    style={{
                      color: "#072434",
                      fontSize: "clamp(24px, 2.2vw, 34px)",
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    4.8 ★
                  </Text>
                </div>
                <Paragraph
                  style={{
                    margin: "12px 0 0",
                    color: "#0d2532",
                    fontSize: "clamp(18px, 1.5vw, 30px)",
                    lineHeight: 1.42,
                    maxWidth: "95%",
                  }}
                >
                  A chic, minimalist oasis just a short walk from Kabalana Beach.
                </Paragraph>
                
              </div>
            </article>   

            <article>
              <img
                src={GUIDE_KO_LAKE_VILLA_IMAGE}
                alt="Ko Lake Villa"
                style={{
                  display: "block",
                  width: "100%",
                  aspectRatio: "16 / 11",
                  objectFit: "cover",
                  borderRadius: "36px",
                }}
              />
              <div style={{ padding: "12px 2px 0" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <Title
                    level={2}
                    style={{
                      margin: 0,
                      color: "#072434",
                      fontWeight: 700,
                      fontSize: "clamp(30px, 3.2vw, 56px)",
                      lineHeight: 1.02,
                      fontFamily: '"Manrope", "Avenir Next", "Segoe UI", sans-serif',
                    }}
                  >
                    Ko Lake Villa
                  </Title>
                  <Text
                    style={{
                      color: "#072434",
                      fontSize: "clamp(24px, 2.2vw, 34px)",
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    4.8 ★
                  </Text>
                </div>
                <Paragraph
                  style={{
                    margin: "12px 0 0",
                    color: "#0d2532",
                    fontSize: "clamp(18px, 1.5vw, 30px)",
                    lineHeight: 1.42,
                    maxWidth: "95%",
                  }}
                >
                  A chic, minimalist oasis just a short walk from Kabalana Beach.
                </Paragraph>
                
              </div>
            </article>

            <article>
              <img
                src={GUIDE_SOLA_HOTEL_IMAGE}
                alt="Sola Hotel"
                style={{
                  display: "block",
                  width: "100%",
                  aspectRatio: "16 / 11",
                  objectFit: "cover",
                  borderRadius: "36px",
                }}
              />
              <div style={{ padding: "12px 2px 0" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <Title
                    level={2}
                    style={{
                      margin: 0,
                      color: "#072434",
                      fontWeight: 700,
                      fontSize: "clamp(30px, 3.2vw, 56px)",
                      lineHeight: 1.02,
                      fontFamily: '"Manrope", "Avenir Next", "Segoe UI", sans-serif',
                    }}
                  >
                    Solar Hotel
                  </Title>
                  <Text
                    style={{
                      color: "#072434",
                      fontSize: "clamp(24px, 2.2vw, 34px)",
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    4.8 ★
                  </Text>
                </div>
                <Paragraph
                  style={{
                    margin: "12px 0 0",
                    color: "#0d2532",
                    fontSize: "clamp(18px, 1.5vw, 30px)",
                    lineHeight: 1.42,
                    maxWidth: "95%",
                  }}
                >
                  A chic, minimalist oasis just a short walk from Kabalana Beach.
                </Paragraph>
                
              </div>
            </article>

            <article>
              <img
                src={GUIDE_Kelly_IMAGE}
                alt="Kelly Ahangama"
                style={{
                  display: "block",
                  width: "100%",
                  aspectRatio: "16 / 11",
                  objectFit: "cover",
                  borderRadius: "36px",
                }}
              />
              <div style={{ padding: "12px 2px 0" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <Title
                    level={2}
                    style={{
                      margin: 0,
                      color: "#072434",
                      fontWeight: 700,
                      fontSize: "clamp(30px, 3.2vw, 56px)",
                      lineHeight: 1.02,
                      fontFamily: '"Manrope", "Avenir Next", "Segoe UI", sans-serif',
                    }}
                  >
                    Kelly
                  </Title>
                  <Text
                    style={{
                      color: "#072434",
                      fontSize: "clamp(24px, 2.2vw, 34px)",
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    4.8 ★
                  </Text>
                </div>
                <Paragraph
                  style={{
                    margin: "12px 0 0",
                    color: "#0d2532",
                    fontSize: "clamp(18px, 1.5vw, 30px)",
                    lineHeight: 1.42,
                    maxWidth: "95%",
                  }}
                >
                  A sleek, contemporary getaway featuring a vibrant evening ambience and a beautifully illuminated pool.
                </Paragraph>
                
              </div>
            </article>

            <article>
              <img
                src={GUIDE_ANIMALS_IMAGE}
                alt="Animals hotel pool and courtyard"
                style={{
                  display: "block",
                  width: "100%",
                  aspectRatio: "16 / 11",
                  objectFit: "cover",
                  borderRadius: "36px",
                }}
              />
              <div style={{ padding: "12px 2px 0" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <Title
                    level={2}
                    style={{
                      margin: 0,
                      color: "#072434",
                      fontWeight: 700,
                      fontSize: "clamp(30px, 3.2vw, 56px)",
                      lineHeight: 1.02,
                      fontFamily: '"Manrope", "Avenir Next", "Segoe UI", sans-serif',
                    }}
                  >
                    Animals
                  </Title>
                  <Text
                    style={{
                      color: "#072434",
                      fontSize: "clamp(24px, 2.2vw, 34px)",
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    4.8 ★
                  </Text>
                </div>
                <Paragraph
                  style={{
                    margin: "12px 0 0",
                    color: "#0d2532",
                    fontSize: "clamp(18px, 1.5vw, 30px)",
                    lineHeight: 1.42,
                    maxWidth: "95%",
                  }}
                >
                  A chic, minimalist oasis just a short walk from Kabalana Beach.
                </Paragraph>
                
              </div>
            </article>

            <article>
              <img
                src={GUIDE_ANIMALS_IMAGE}
                alt="Animals hotel pool and courtyard"
                style={{
                  display: "block",
                  width: "100%",
                  aspectRatio: "16 / 11",
                  objectFit: "cover",
                  borderRadius: "36px",
                }}
              />
              <div style={{ padding: "12px 2px 0" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <Title
                    level={2}
                    style={{
                      margin: 0,
                      color: "#072434",
                      fontWeight: 700,
                      fontSize: "clamp(30px, 3.2vw, 56px)",
                      lineHeight: 1.02,
                      fontFamily: '"Manrope", "Avenir Next", "Segoe UI", sans-serif',
                    }}
                  >
                    Animals
                  </Title>
                  <Text
                    style={{
                      color: "#072434",
                      fontSize: "clamp(24px, 2.2vw, 34px)",
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    4.8 ★
                  </Text>
                </div>
                <Paragraph
                  style={{
                    margin: "12px 0 0",
                    color: "#0d2532",
                    fontSize: "clamp(18px, 1.5vw, 30px)",
                    lineHeight: 1.42,
                    maxWidth: "95%",
                  }}
                >
                  A chic, minimalist oasis just a short walk from Kabalana Beach.
                </Paragraph>
                
              </div>
            </article>

            <article>
              <img
                src={GUIDE_ANIMALS_IMAGE}
                alt="Animals hotel pool and courtyard"
                style={{
                  display: "block",
                  width: "100%",
                  aspectRatio: "16 / 11",
                  objectFit: "cover",
                  borderRadius: "36px",
                }}
              />
              <div style={{ padding: "12px 2px 0" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <Title
                    level={2}
                    style={{
                      margin: 0,
                      color: "#072434",
                      fontWeight: 700,
                      fontSize: "clamp(30px, 3.2vw, 56px)",
                      lineHeight: 1.02,
                      fontFamily: '"Manrope", "Avenir Next", "Segoe UI", sans-serif',
                    }}
                  >
                    Animals
                  </Title>
                  <Text
                    style={{
                      color: "#072434",
                      fontSize: "clamp(24px, 2.2vw, 34px)",
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    4.8 ★
                  </Text>
                </div>
                <Paragraph
                  style={{
                    margin: "12px 0 0",
                    color: "#0d2532",
                    fontSize: "clamp(18px, 1.5vw, 30px)",
                    lineHeight: 1.42,
                    maxWidth: "95%",
                  }}
                >
                  A chic, minimalist oasis just a short walk from Kabalana Beach.
                </Paragraph>
                
              </div>
            </article>

            <article>
              <img
                src={GUIDE_ANIMALS_IMAGE}
                alt="Animals hotel pool and courtyard"
                style={{
                  display: "block",
                  width: "100%",
                  aspectRatio: "16 / 11",
                  objectFit: "cover",
                  borderRadius: "36px",
                }}
              />
              <div style={{ padding: "12px 2px 0" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <Title
                    level={2}
                    style={{
                      margin: 0,
                      color: "#072434",
                      fontWeight: 700,
                      fontSize: "clamp(30px, 3.2vw, 56px)",
                      lineHeight: 1.02,
                      fontFamily: '"Manrope", "Avenir Next", "Segoe UI", sans-serif',
                    }}
                  >
                    Animals
                  </Title>
                  <Text
                    style={{
                      color: "#072434",
                      fontSize: "clamp(24px, 2.2vw, 34px)",
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    4.8 ★
                  </Text>
                </div>
                <Paragraph
                  style={{
                    margin: "12px 0 0",
                    color: "#0d2532",
                    fontSize: "clamp(18px, 1.5vw, 30px)",
                    lineHeight: 1.42,
                    maxWidth: "95%",
                  }}
                >
                  A chic, minimalist oasis just a short walk from Kabalana Beach.
                </Paragraph>
                
              </div>
            </article> 
            
          </div>


        </div>
      </FullBleedSection>

      {GUIDE_EXTRA_STAYS.map((stay) => (
        <FullBleedSection key={stay.title}>
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
                    "linear-gradient(90deg, rgba(10,14,18,0.8) 0%, rgba(10,14,18,0.66) 24%, rgba(10,14,18,0.34) 56%, rgba(10,14,18,0.08) 100%)",
                  pointerEvents: "none",
                  zIndex: 2,
                }}
              />
              <img
                className="home-hero-image"
                src={stay.image || GUIDE_OVERVIEW_IMAGE}
                alt={stay.title}
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

            <div style={{ position: "relative", zIndex: 3, width: "100%", maxWidth: "none", margin: 0 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  minHeight: "100svh",
                  maxWidth: 760,
                  padding: "clamp(44px, 5vw, 68px) clamp(32px, 4.8vw, 72px) 44px",
                }}
              >
                <Title
                  className="home-hero-title"
                  style={{
                    margin: 0,
                    color: "#FFFFFF",
                    fontWeight: 500,
                    fontFamily: '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                  }}
                >
                  <span className="home-hero-titleLine" style={{ color: "#FFFFFF", whiteSpace: "normal" }}>
                    {stay.title}
                  </span>
                </Title>

                <Paragraph
                  style={{
                    marginTop: 24,
                    marginBottom: 0,
                    maxWidth: 640,
                    color: "#FFFFFF",
                    fontSize: "clamp(16px, 1.45vw, 19px)",
                    lineHeight: 1.72,
                  }}
                >
                  {stay.description}
                </Paragraph>
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                right: "clamp(32px, 4.8vw, 72px)",
                bottom: "clamp(28px, 4vw, 48px)",
                zIndex: 4,
                display: "inline-flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <a
                href="#"
                style={{
                  color: "#FFFFFF",
                  textDecoration: "none",
                  fontSize: "clamp(16px, 1.45vw, 19px)",
                  lineHeight: 1.72,
                  borderBottom: "1px solid rgba(255,255,255,0.65)",
                  paddingBottom: 6,
                }}
              >
                <InstagramLabel text={stay.instagramLabel} justify="flex-end" />
              </a>
              <a
                href="#"
                style={{
                  color: "#FFFFFF",
                  textDecoration: "none",
                  fontSize: "clamp(16px, 1.45vw, 19px)",
                  lineHeight: 1.72,
                  borderBottom: "1px solid rgba(255,255,255,0.65)",
                  paddingBottom: 6,
                }}
              >
                <DirectionLabel text="Direction" justify="flex-end" />
              </a>
            </div>
          </div>
        </FullBleedSection>
      ))}
    </SiteLayout>
  );
}
