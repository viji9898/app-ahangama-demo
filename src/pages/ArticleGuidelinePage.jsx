import React from "react";
import { Typography } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";

const { Paragraph, Text, Title } = Typography;

export const ARTICLE_GUIDELINE_PATH = "/article-guideline";

const HERO_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/the-living-room-concept-store/hero-the-living-room-concept-store.jpeg";
const OG_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/admin/wireframing-elements-web-design.webp";
const EXAMPLE_SECONDARY_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/dulasiri-uncle/Dulasiri-on-the-beach-holding-a-turtle.jpg";

const pageSections = [
  {
    kicker: "01",
    title: "Start With The Template",
    body: [
      "Use The Living Room Concept Store page as the canonical standalone article template. New editorial pages should keep the same overall shape: full-bleed hero, short intro, large image moment, sectioned body, image or video inserts, places mentioned, next article, route meta, and sitemap entry.",
      "The article should feel like a designed story, not a blog dump. Keep the layout spacious, image-led, and restrained.",
    ],
  },
  {
    kicker: "02",
    title: "Writing Structure",
    body: [
      "Use a clear editorial title, a short descriptive subtitle, and an author line. If the article is a personal essay, keep the byline visible in the hero and in SEO metadata.",
      "Lead with 2 to 4 introductory paragraphs before the first major image. These should establish place, person, mood, or usefulness quickly.",
      "Break the body into named sections. Section titles should be human and specific, not generic labels such as Overview or Details.",
    ],
  },
  {
    kicker: "03",
    title: "Sample Article Wireframe",
    body: [],
    showWireframe: true,
  },
  {
    kicker: "04",
    title: "Image Sizes",
    body: [
      "Hero image: upload at 2400 x 1600 px minimum, landscape, JPG or WebP. Keep the subject away from the far left if text overlays the hero. The page crops the hero to full viewport height, so the image must still work at wide desktop and tall mobile crops.",
      "Open graph image: use 1200 x 630 px, JPG or WebP, under 1 MB where possible. This is the image used by WhatsApp, iMessage, Facebook, LinkedIn, and other link previews.",
      "Feature image: use 1800 x 1200 px for the wide image after the intro. This maps well to a 3:2 crop.",
      "Portrait/gallery images: use 1200 x 1500 px or larger for 4:5 image slots. Keep faces and products centered vertically.",
      "Video poster image: use 1200 x 1500 px for 4:5 video blocks. The poster should read clearly before the video is played.",
    ],
  },
  {
    kicker: "05",
    title: "File Naming And Alt Text",
    body: [
      "Name files in lowercase kebab-case. Prefer descriptive filenames over camera exports. Good: dulasiri-on-the-beach-holding-a-turtle.jpg. Avoid: IMG_3847.jpg.",
      "Filename labels should describe the visible subject and setting. This helps editors pick the right image and makes the asset library searchable.",
      "Alt text should describe what is visible in the image, not repeat the article title. Good: Dulasiri on the beach holding a turtle. Avoid: Dulasiri Uncle article image.",
      "For people, name them when known. For places, include the place name when it is relevant. For decorative atmosphere images, still describe the scene plainly.",
    ],
  },
  {
    kicker: "06",
    title: "SEO And Route Metadata For Developers",
    body: [
      "Every standalone article needs runtime SEO in the page component and static route metadata in scripts/generate-route-meta-html.mjs. The route should also be listed in scripts/generate-seo.mjs so it appears in the sitemap.",
      "SEO title should be short and literal. Description should summarize the article in one sentence, ideally under 160 characters. Author and publishDate should be present for article pages.",
      "Use the same OG image in the page Seo component and in routeMeta unless there is a deliberate reason to separate the page hero from the preview image.",
    ],
  },
  {
    kicker: "07",
    title: "Places And Keywords For Developers",
    body: [
      "Add a Places Mentioned section near the bottom when the article references local venues, beaches, towns, or landmarks. Keep the list useful, not exhaustive.",
      "In the article body, highlight important place names with the subtle gold underline link treatment used across guide pages. Use this sparingly so the text still feels calm.",
      "Keywords should be natural: article title, author, Ahangama, Sri Lanka, venue names, topic category, and nearby place names. Do not stuff hidden keyword lists into the page.",
    ],
  },
];

const imageSpecs = [
  ["Hero", "2400 x 1600 px", "Landscape JPG/WebP", "Full-viewport article hero"],
  ["OG Image", "1200 x 630 px", "Landscape JPG/WebP", "Social and messaging previews"],
  ["Wide Feature", "1800 x 1200 px", "3:2 landscape", "Large image after intro"],
  ["Portrait Gallery", "1200 x 1500 px", "4:5 portrait", "Two-column and gallery blocks"],
  ["Video Poster", "1200 x 1500 px", "4:5 portrait", "Poster before video playback"],
];

const filenameExamples = [
  ["Good", "dulasiri-on-the-beach-holding-a-turtle.jpg"],
  ["Good", "living-room-concept-store-showroom-floor.jpeg"],
  ["Good", "marshmallow-cafe-ahangama-front-table.webp"],
  ["Avoid", "IMG_3847.jpg"],
  ["Avoid", "hero-final-new-new.jpg"],
];

function SpecRow({ label, value, detail, use }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 14,
        padding: "14px 0",
        borderTop: "1px solid rgba(47,62,58,0.12)",
      }}
    >
      <Text strong style={{ color: "#2f2a24" }}>
        {label}
      </Text>
      <Text style={{ color: "#55514B" }}>{value}</Text>
      <Text style={{ color: "#55514B" }}>{detail}</Text>
      <Text style={{ color: "#55514B" }}>{use}</Text>
    </div>
  );
}

function SampleArticleWireframe() {
  const blockStyle = {
    border: "1px solid rgba(47,62,58,0.14)",
    background: "#fffdf9",
  };
  const labelStyle = {
    display: "block",
    color: "#8A6F45",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  };
  const textLineStyle = {
    height: 10,
    background: "rgba(85,81,75,0.18)",
  };

  return (
    <div
      style={{
        marginTop: 28,
        padding: 22,
        border: "1px solid rgba(47,62,58,0.14)",
        background: "#F7F2EA",
        maxWidth: 1180,
      }}
    >
      <Text
        style={{
          display: "block",
          marginBottom: 16,
          color: "#6B5A4E",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 1.4,
          textTransform: "uppercase",
        }}
      >
        Sample Article Wireframe
      </Text>

      <div
        style={{
          ...blockStyle,
          overflow: "hidden",
          background: "#FFFFFF",
        }}
      >
        <div
          style={{
            minHeight: 460,
            padding: 24,
            position: "relative",
            overflow: "hidden",
            background:
              "linear-gradient(135deg, rgba(119,112,95,0.55), rgba(232,225,211,0.95))",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 24,
              border: "1px dashed rgba(255,255,255,0.75)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(47,42,36,0.18))",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 24,
              background:
                "linear-gradient(90deg, rgba(10,14,18,0.8) 0%, rgba(10,14,18,0.58) 42%, rgba(10,14,18,0.08) 100%)",
            }}
          />
          <div
            style={{
              position: "relative",
              zIndex: 2,
              minHeight: 412,
              maxWidth: 460,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <Text style={{ ...labelStyle, marginBottom: 12, color: "#FFFFFF" }}>
              Hero area: background image + overlay
            </Text>
            <div
              style={{
                width: "32%",
                height: 8,
                marginBottom: 14,
                background: "rgba(255,255,255,0.62)",
              }}
            />
            <div
              style={{
                width: "86%",
                height: 28,
                marginBottom: 8,
                background: "rgba(255,255,255,0.92)",
              }}
            />
            <div
              style={{
                width: "64%",
                height: 28,
                marginBottom: 16,
                background: "rgba(255,255,255,0.92)",
              }}
            />
            <div
              style={{
                width: "42%",
                height: 8,
                marginBottom: 18,
                background: "rgba(255,255,255,0.56)",
              }}
            />
            {["74%", "58%"].map((width) => (
              <div
                key={width}
                style={{
                  width,
                  height: 9,
                  marginBottom: 7,
                  background: "rgba(255,255,255,0.42)",
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ padding: "28px 24px 10px" }}>
          <Text style={{ ...labelStyle, marginBottom: 14 }}>
            Intro text block
          </Text>
          <div style={{ maxWidth: 760 }}>
            {["92%", "84%", "74%", "88%"].map((width) => (
              <div
                key={width}
                style={{
                  ...textLineStyle,
                  width,
                  marginBottom: 10,
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ padding: "18px 24px" }}>
          <div
            style={{
              minHeight: 180,
              display: "grid",
              placeItems: "center",
              border: "1px dashed rgba(107,90,78,0.4)",
              background: "#F2EEE6",
              color: "#8A6F45",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1.2,
              textTransform: "uppercase",
            }}
          >
            Wide feature image
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 22,
            padding: "18px 24px",
          }}
        >
          <div>
            <Text style={{ ...labelStyle, marginBottom: 14 }}>
              Body section
            </Text>
            {["84%", "96%", "78%", "90%", "66%"].map((width) => (
              <div
                key={width}
                style={{
                  ...textLineStyle,
                  width,
                  marginBottom: 10,
                }}
              />
            ))}
          </div>
          <div
            style={{
              minHeight: 220,
              display: "grid",
              placeItems: "center",
              border: "1px dashed rgba(107,90,78,0.4)",
              background: "#F8F5EF",
              color: "#8A6F45",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1.2,
              textTransform: "uppercase",
            }}
          >
            Portrait image or video
          </div>
        </div>

        <div style={{ padding: "18px 24px" }}>
          <div
            style={{
              padding: 24,
              borderLeft: "3px solid rgba(214,178,102,0.9)",
              background: "#fffdf9",
            }}
          >
            <Text style={{ ...labelStyle, marginBottom: 14 }}>
              Pull quote or emphasis moment
            </Text>
            <div style={{ ...textLineStyle, width: "76%", height: 14 }} />
          </div>
        </div>

        <div style={{ padding: "18px 24px" }}>
          <Text style={{ ...labelStyle, marginBottom: 14 }}>
            Body section
          </Text>
          <div style={{ maxWidth: 820 }}>
            {["88%", "96%", "82%", "90%", "72%"].map((width) => (
              <div
                key={width}
                style={{
                  ...textLineStyle,
                  width,
                  marginBottom: 10,
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ padding: "18px 24px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 14,
            }}
          >
            {["Image left", "Image right"].map((label) => (
              <div
                key={label}
                style={{
                  minHeight: 220,
                  display: "grid",
                  placeItems: "center",
                  border: "1px dashed rgba(107,90,78,0.4)",
                  background: "#F2EEE6",
                  color: "#8A6F45",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                  textAlign: "center",
                  padding: 12,
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "18px 24px 28px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div
              style={{
                minHeight: 118,
                display: "grid",
                placeItems: "center",
                border: "1px dashed rgba(107,90,78,0.35)",
                background: "#F7F2EA",
                color: "#8A6F45",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                textAlign: "center",
                padding: 12,
              }}
            >
              Places mentioned
            </div>
            <div
              style={{
                minHeight: 118,
                width: "100%",
                display: "grid",
                placeItems: "center",
                border: "1px dashed rgba(107,90,78,0.35)",
                background: "#F7F2EA",
                color: "#8A6F45",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                textAlign: "center",
                padding: 12,
              }}
            >
              Next article
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GuidelineSection({ section }) {
  const isDeveloperSection = section.title.includes("For Developers");
  const content = (
    <>
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
      {section.showWireframe ? <SampleArticleWireframe /> : null}
    </>
  );

  return (
    <section
      style={{
        padding: "36px 0",
        borderTop: "1px solid rgba(47,62,58,0.12)",
      }}
    >
      <div style={{ maxWidth: 1180 }}>
        {isDeveloperSection ? (
          <details>
            <summary
              style={{
                cursor: "pointer",
                listStyle: "none",
              }}
            >
              <Text
                style={{
                  display: "block",
                  marginBottom: 8,
                  color: "#6B5A4E",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.4,
                  textTransform: "uppercase",
                }}
              >
                {section.kicker}
              </Text>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <Title level={2} style={{ marginTop: 0, marginBottom: 18 }}>
                  {section.title}
                </Title>
                <Text
                  aria-hidden="true"
                  style={{
                    color: "#8A6F45",
                    fontSize: 22,
                    lineHeight: 1,
                    marginBottom: 18,
                  }}
                >
                  +
                </Text>
              </div>
            </summary>
            <div style={{ paddingTop: 4 }}>{content}</div>
          </details>
        ) : (
          <>
            <Text
              style={{
                display: "block",
                marginBottom: 8,
                color: "#6B5A4E",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.4,
                textTransform: "uppercase",
              }}
            >
              {section.kicker}
            </Text>
            <Title level={2} style={{ marginTop: 0, marginBottom: 18 }}>
              {section.title}
            </Title>
            {content}
          </>
        )}
      </div>
    </section>
  );
}

export default function ArticleGuidelinePage() {
  const canonical = absUrl(ARTICLE_GUIDELINE_PATH);
  const publishDate = "2026-06-14T09:00:00.000Z";

  return (
    <SiteLayout navOverlayHero>
      <Seo
        title="Article Guideline"
        description="Editorial guidelines for writing, laying out, naming images, sizing media, and preparing SEO for Ahangama article pages."
        canonical={canonical}
        ogImage={OG_IMAGE}
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
                        "linear-gradient(90deg, rgba(10,14,18,0.84) 0%, rgba(10,14,18,0.76) 20%, rgba(10,14,18,0.54) 40%, rgba(10,14,18,0.24) 62%, rgba(10,14,18,0.04) 100%)",
                      pointerEvents: "none",
                      zIndex: 2,
                    }}
                  />
                  <img
                    className="home-hero-image"
                    src={HERO_IMAGE}
                    alt="Editorial article template hero example"
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
                      maxWidth: 720,
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
                      {["Editorial System", "Article Template"].map((item) => (
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
                      <span
                        className="home-hero-titleLine"
                        style={{ color: "#FFFFFF" }}
                      >
                        Article
                      </span>
                      <span
                        className="home-hero-titleLine"
                        style={{ color: "#FFFFFF" }}
                      >
                        Guideline
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
                      Internal Editorial Reference
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
                      How to write, structure, size images, name files, write
                      alt text, and prepare SEO for standalone Ahangama article
                      pages.
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
            <Paragraph
              style={{
                fontSize: 22,
                lineHeight: 1.7,
                color: "#2f2a24",
                marginBottom: 18,
              }}
            >
              This page is the working standard for Ahangama standalone
              editorial articles. It keeps new pages consistent, easier to
              publish, easier to share, and easier to maintain.
            </Paragraph>
            <Paragraph
              style={{
                fontSize: 18,
                lineHeight: 1.85,
                color: "#55514B",
                marginBottom: 18,
              }}
            >
              When in doubt, follow the Living Room Concept Store page. It is
              the template: full-bleed hero, concise intro, large visual rhythm,
              thoughtful sections, useful links, route metadata, and sitemap
              coverage.
            </Paragraph>
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
                src={EXAMPLE_SECONDARY_IMAGE}
                alt="Example article image for sizing and alt text guidance"
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

          <section
            style={{
              padding: "28px 0 36px",
              borderTop: "1px solid rgba(47,62,58,0.12)",
            }}
          >
            <Title level={2} style={{ marginTop: 0, marginBottom: 18 }}>
              Image Specification
            </Title>
            <div style={{ maxWidth: 1180 }}>
              {imageSpecs.map(([label, value, detail, use]) => (
                <SpecRow
                  key={label}
                  label={label}
                  value={value}
                  detail={detail}
                  use={use}
                />
              ))}
            </div>
          </section>

          <section
            style={{
              padding: "36px 0",
              borderTop: "1px solid rgba(47,62,58,0.12)",
            }}
          >
            <Title level={2} style={{ marginTop: 0, marginBottom: 18 }}>
              File Naming Examples
            </Title>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 18,
                maxWidth: 980,
              }}
            >
              {filenameExamples.map(([status, filename]) => (
                <div
                  key={filename}
                  style={{
                    padding: 18,
                    border: "1px solid rgba(47,62,58,0.12)",
                    background: "#fffdf9",
                  }}
                >
                  <Text
                    style={{
                      display: "block",
                      marginBottom: 8,
                      color: status === "Good" ? "#6B5A4E" : "#8A4A3A",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 1.4,
                      textTransform: "uppercase",
                    }}
                  >
                    {status}
                  </Text>
                  <Text style={{ color: "#2f2a24", wordBreak: "break-word" }}>
                    {filename}
                  </Text>
                </div>
              ))}
            </div>
          </section>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {pageSections.map((section) => (
              <GuidelineSection key={section.title} section={section} />
            ))}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
