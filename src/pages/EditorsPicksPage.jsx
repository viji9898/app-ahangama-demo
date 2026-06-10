import React from "react";
import { Col, Row, Tag, Typography } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";

const { Paragraph, Title } = Typography;

const HERO_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/the-living-room-concept-store/hero-the-living-room-concept-store.jpeg";

const ARTICLES = [
  {
    category: "Shop Guide",
    title: "The Living Room Concept Store",
    href: "/the-living-room-concept-store",
    description:
      "A long-form look inside one of Ahangama's most considered retail and coffee spaces.",
    image: HERO_IMAGE,
  },
  {
    category: "Editorial",
    title: "Why Surfing Changed Everything in Ahangama",
    href: "/why-surfing-changed-everything-in-ahangama",
    description:
      "How the surf economy reshaped the rhythm, businesses and identity of the town.",
    image:
      "https://images.pexels.com/photos/19065606/pexels-photo-19065606.jpeg",
  },
  {
    category: "Editorial",
    title: "Sri Lanka's Most Interesting Coastal Town",
    href: "/sri-lankas-most-interesting-coastal-town",
    description:
      "An editorial portrait of why Ahangama has become one of the most magnetic stops on the south coast.",
    image:
      "https://content.r9cdn.net/rimg/dimg/09/d4/c553223f-city-304822-172c638b4d6.jpg?crop=true&width=1366&height=768&xhint=1254&yhint=1207",
  },
  {
    category: "Stay Guide",
    title: "Where to Stay on Sri Lanka's Southern Coast",
    href: "/where-to-stay-on-sri-lankas-southern-coast",
    description:
      "A guide to the boutique hotels, villas and design-forward stays worth knowing.",
    image:
      "https://images.suitcasemag.com/wp-content/uploads/2025/03/05163113/HERO2-TheFind-SouthCoastSriLanka.jpeg",
  },
  {
    category: "Transport Guide",
    title: "Getting Around Ahangama",
    href: "/getting-around-ahangama-scooters-tuk-tuks-airport-transfers",
    description:
      "Practical notes on scooters, tuk-tuks, airport transfers and moving through the south coast easily.",
    image:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/93/b1/58/caption.jpg?w=500&h=500&s=1",
  },
  {
    category: "Personal Story",
    title: "3 Days in Ahangama",
    href: "/3-days-in-ahangama",
    description:
      "A first-person short-stay edit built around wellness, coworking and the town's daily rhythm.",
    image:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/57/9b/6a/caption.jpg?w=1100&h=1100&s=1",
  },
  {
    category: "Guide",
    title: "12 Things to Do",
    href: "/12-things",
    description:
      "A core Ahangama edit covering the experiences, rituals and places that explain the destination best.",
    image:
      "https://hips.hearstapps.com/hmg-prod/images/exploring-ahangama-the-surfing-sweet-spot-on-sri-lanka-s-southern-coast-66475f779dc88.jpg?crop=0.6672958942897593xw:1xh;center,top&resize=640:*",
  },
  {
    category: "Food Guide",
    title: "Eat",
    href: "/eat",
    description:
      "An editorial guide to breakfasts, long lunches and dinner addresses across Ahangama.",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/Asset+27maria-bonita.webp",
  },
  {
    category: "Shop Guide",
    title: "Shops",
    href: "/shops",
    description:
      "A retail edit covering the stores, essentials and design-led addresses worth visiting.",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/mukti.jpg",
  },
];

export default function EditorsPicksPage() {
  const canonical = absUrl("/editors-picks");

  return (
    <SiteLayout>
      <Seo
        title="Editor's Picks"
        description="Ahangama editorial stories, guides and long-form articles collected in one place."
        canonical={canonical}
        ogImage={HERO_IMAGE}
      />

      <div className="dm-heroCut" style={{ background: "#ffffff" }} />
      <div className="dm-canvas" style={{ background: "#ffffff" }}>
        <div
          style={{
            position: "relative",
            minHeight: "calc(78vh - 88px)",
            overflow: "hidden",
            marginBottom: 32,
            background: "#ffffff",
          }}
        >
          <img
            src={HERO_IMAGE}
            alt="Editor's Picks hero"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center center",
            }}
          />

          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(17,16,14,0.12) 0%, rgba(17,16,14,0.18) 34%, rgba(17,16,14,0.58) 100%)",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              minHeight: "calc(78vh - 88px)",
              maxWidth: 1180,
              margin: "0 auto",
              display: "flex",
              alignItems: "flex-end",
              padding:
                "clamp(28px, 4vw, 44px) clamp(20px, 4vw, 36px) clamp(32px, 6vw, 56px)",
              boxSizing: "border-box",
            }}
          >
            <div style={{ maxWidth: 760 }}>
              <Tag
                style={{
                  borderRadius: 999,
                  padding: "6px 12px",
                  marginBottom: 14,
                  color: "#ffffff",
                  borderColor: "rgba(255,255,255,0.32)",
                  background: "rgba(255,255,255,0.14)",
                }}
              >
                Editorial Index
              </Tag>

              <Title
                level={1}
                style={{
                  marginTop: 0,
                  marginBottom: 14,
                  color: "#ffffff",
                  fontSize: "clamp(42px, 6vw, 82px)",
                  lineHeight: 0.97,
                  letterSpacing: -1.8,
                  fontFamily:
                    '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                }}
              >
                Editor's Picks
              </Title>

              <Paragraph
                style={{
                  marginBottom: 0,
                  maxWidth: 560,
                  color: "rgba(255,255,255,0.88)",
                  fontSize: "clamp(16px, 1.45vw, 19px)",
                  lineHeight: 1.72,
                }}
              >
                A running list of Ahangama editorials, guides and long-form
                stories collected in one place.
              </Paragraph>
            </div>
          </div>
        </div>

        <div className="dm-wrap" style={{ paddingBottom: 72 }}>
          <Row gutter={[24, 28]}>
            {ARTICLES.map((article) => (
              <Col xs={24} md={12} xl={8} key={article.href}>
                <a
                  href={article.href}
                  style={{
                    display: "block",
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      borderRadius: 28,
                      overflow: "hidden",
                      background: "#ffffff",
                      border: "1px solid rgba(32,30,27,0.08)",
                    }}
                  >
                    <div
                      style={{
                        aspectRatio: "16 / 10",
                        overflow: "hidden",
                        background: "#efe8dd",
                      }}
                    >
                      <img
                        src={article.image}
                        alt={article.title}
                        style={{
                          display: "block",
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>

                    <div style={{ padding: 22 }}>
                      <Tag
                        style={{
                          marginBottom: 12,
                          borderRadius: 999,
                          padding: "4px 10px",
                          color: "#8B7B63",
                          borderColor: "rgba(32,30,27,0.08)",
                          background: "rgba(239,232,221,0.58)",
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: 1.2,
                          textTransform: "uppercase",
                        }}
                      >
                        {article.category}
                      </Tag>

                      <Title
                        level={3}
                        style={{
                          marginTop: 0,
                          marginBottom: 12,
                          color: "#1F1D1A",
                          lineHeight: 1.04,
                          letterSpacing: -0.8,
                          fontFamily:
                            '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                        }}
                      >
                        {article.title}
                      </Title>

                      <Paragraph
                        style={{
                          marginBottom: 0,
                          color: "#5F574E",
                          fontSize: 15,
                          lineHeight: 1.75,
                        }}
                      >
                        {article.description}
                      </Paragraph>
                    </div>
                  </div>
                </a>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </SiteLayout>
  );
}