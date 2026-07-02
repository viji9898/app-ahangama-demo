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

const GUIDE_BEST_STAYS_IMAGE = TrebathaWebImage;

const GUIDE_ANIMALS_IMAGE = AnimalsWebImage;

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
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="#FFFFFF" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4.2" stroke="#FFFFFF" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.8" r="1.2" fill="#FFFFFF" />
      </svg>
      <span>{text}</span>
    </span>
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

      <div
        className="dm-canvas"
        style={{
          marginTop: 0,
          paddingTop: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
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

              <div
                style={{
                  position: "relative",
                  zIndex: 3,
                  width: "100%",
                  maxWidth: "none",
                  margin: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    minHeight: "100svh",
                    maxWidth: 780,
                    padding:
                      "clamp(44px, 5vw, 68px) clamp(32px, 4.8vw, 72px) 44px",
                  }}
                >
                  <Title
                    className="home-hero-title"
                    style={{
                      margin: 0,
                      transform: "translateY(-50px)",
                      color: "#FFFFFF",
                      fontWeight: 500,
                      fontFamily:
                        '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                    }}
                  >
                    <span
                      className="home-hero-titleLine"
                      style={{ color: "#FFFFFF" }}
                    >
                      Ahangama
                    </span>
                    <span
                      className="home-hero-titleLine"
                      style={{ color: "#FFFFFF", whiteSpace: "nowrap" }}
                    >
                      2026/2027
                    </span>
                    <span
                      className="home-hero-titleLine"
                      style={{ color: "#FFFFFF" }}
                    >
                      Season Guide
                    </span>
                  </Title>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dm-canvas" style={{ marginTop: 0, paddingTop: 0 }}>
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

              <div
                style={{
                  position: "relative",
                  zIndex: 3,
                  width: "100%",
                  maxWidth: "none",
                  margin: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    minHeight: "100svh",
                    maxWidth: 920,
                    padding:
                      "clamp(44px, 5vw, 68px) clamp(32px, 4.8vw, 72px) 44px",
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
                      fontFamily:
                        '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                    }}
                  >
                    <span
                      className="home-hero-titleLine"
                      style={{ color: "#FFFFFF" }}
                    >
                      Guide
                    </span>
                    <span
                      className="home-hero-titleLine"
                      style={{ color: "#FFFFFF", whiteSpace: "normal" }}
                    >
                      Contents
                    </span>
                  </Title>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(220px, 1fr))",
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
          </div>
        </div>
      </div>

      <div className="dm-canvas" style={{ marginTop: 0, paddingTop: 0 }}>
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
                      "linear-gradient(90deg, rgba(10,14,18,0.84) 0%, rgba(10,14,18,0.72) 26%, rgba(10,14,18,0.44) 56%, rgba(10,14,18,0.1) 100%)",
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

              <div
                style={{
                  position: "relative",
                  zIndex: 3,
                  width: "100%",
                  maxWidth: "none",
                  margin: 0,
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
                      "clamp(44px, 5vw, 68px) clamp(32px, 4.8vw, 72px) 44px",
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
                      fontFamily:
                        '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                    }}
                  >
                    <span
                      className="home-hero-titleLine"
                      style={{ color: "#FFFFFF" }}
                    >
                      Ahangama
                    </span>
                    <span
                      className="home-hero-titleLine"
                      style={{ color: "#FFFFFF" }}
                    >
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
                    Once a sleepy stretch of local fishing shacks, Ahangama has
                    quietly evolved into the South Coast's coolest, most curated
                    coastal hub. It has successfully dodged the overdeveloped
                    chaos of other global surf towns, maintaining a delicate
                    balance between slow island living and a thriving, modern
                    aesthetic. If you are looking for barefoot luxury,
                    world-class waves, and jungle-fringed cafes, you have found
                    your spot.
                  </Paragraph>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dm-canvas" style={{ marginTop: 0, paddingTop: 0 }}>
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
                      "linear-gradient(90deg, rgba(10,14,18,0.78) 0%, rgba(10,14,18,0.62) 24%, rgba(10,14,18,0.28) 54%, rgba(10,14,18,0.08) 100%)",
                    pointerEvents: "none",
                    zIndex: 2,
                  }}
                />
                <img
                  className="home-hero-image"
                  src={GUIDE_BEST_STAYS_IMAGE}
                  alt="Trebartha East the Round House"
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
                  maxWidth: "none",
                  margin: 0,
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
                      "clamp(44px, 5vw, 68px) clamp(32px, 4.8vw, 72px) 44px",
                  }}
                >
                  <Title
                    className="home-hero-title"
                    style={{
                      margin: 0,
                      transform: "translateY(-50px)",
                      color: "#FFFFFF",
                      fontWeight: 500,
                      fontFamily:
                        '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                    }}
                  >
                    <span
                      className="home-hero-titleLine"
                      style={{ color: "#FFFFFF", whiteSpace: "normal" }}
                    >
                      Trebartha East
                    </span>
                  </Title>
                  <Paragraph
                    style={{
                      margin: "18px 0 0",
                      maxWidth: 640,
                      color: "rgba(255,255,255,0.95)",
                      fontSize: "clamp(16px, 1.45vw, 19px)",
                      lineHeight: 1.72,
                    }}
                  >
                    Trebartha East: A spectacular, design-led oasis nestled
                    high in the Ahangama jungle. Known for its 360-degree
                    estate views, striking circular architecture, and a
                    luxurious sweeping pool, it&apos;s the perfect spot to escape
                    the coastal buzz and experience elevated tropical living.
                  </Paragraph>
                </div>
              </div>

              <a
                href="https://www.instagram.com/trebarthaeast"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  position: "absolute",
                  right: "clamp(32px, 4.8vw, 72px)",
                  bottom: "clamp(28px, 4vw, 48px)",
                  zIndex: 4,
                  color: "#FFFFFF",
                  textDecoration: "none",
                  textAlign: "right",
                  fontSize: "clamp(16px, 1.45vw, 19px)",
                  lineHeight: 1.72,
                  borderBottom: "1px solid rgba(255,255,255,0.65)",
                  paddingBottom: 6,
                }}
              >
                <InstagramLabel text="Trebartha East" justify="flex-end" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="dm-canvas" style={{ marginTop: 0, paddingTop: 0 }}>
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
                      "linear-gradient(90deg, rgba(10,14,18,0.8) 0%, rgba(10,14,18,0.66) 24%, rgba(10,14,18,0.34) 56%, rgba(10,14,18,0.08) 100%)",
                    pointerEvents: "none",
                    zIndex: 2,
                  }}
                />
                <img
                  className="home-hero-image"
                  src={GUIDE_ANIMALS_IMAGE}
                  alt="Animals hotel pool and courtyard"
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
                  maxWidth: "none",
                  margin: 0,
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
                      "clamp(44px, 5vw, 68px) clamp(32px, 4.8vw, 72px) 44px",
                  }}
                >
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
                    <span
                      className="home-hero-titleLine"
                      style={{ color: "#FF4FA3", whiteSpace: "normal" }}
                    >
                      Animals
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
                    Animals: A chic, minimalist oasis just a short walk from
                    Kabalana Beach. Known for its aesthetic cooked-to-order
                    breakfasts, specialty coffee, and a quiet jungle-fringed
                    pool, it's the perfect spot to escape the midday heat and
                    recharge.
                  </Paragraph>
                </div>
              </div>

              <a
                href="https://www.instagram.com/animalsahangama/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  position: "absolute",
                  right: "clamp(32px, 4.8vw, 72px)",
                  bottom: "clamp(28px, 4vw, 48px)",
                  zIndex: 4,
                  color: "#FFFFFF",
                  textDecoration: "none",
                  fontSize: "clamp(16px, 1.45vw, 19px)",
                  lineHeight: 1.72,
                  borderBottom: "1px solid rgba(255,255,255,0.65)",
                  paddingBottom: 6,
                }}
              >
                <InstagramLabel text="Animals" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
