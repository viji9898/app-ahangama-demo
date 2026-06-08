import React from "react";
import { Button, Card, Col, Row, Space, Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { buildPassCtaUrl } from "../lib/passAttribution";

const { Paragraph, Text, Title } = Typography;

export const WHY_SURFING_CHANGED_PATH =
  "/why-surfing-changed-everything-in-ahangama";

const HERO_IMAGE =
  "https://images.pexels.com/photos/19065606/pexels-photo-19065606.jpeg";
const SIDE_IMAGE_ONE =
  "https://images.pexels.com/photos/33757643/pexels-photo-33757643.jpeg";
const SIDE_IMAGE_TWO =
  "https://images.pexels.com/photos/7952964/pexels-photo-7952964.jpeg";
const KABALANA_IMAGE =
  "https://images.pexels.com/photos/11617733/pexels-photo-11617733.jpeg";

const introParagraphs = [
  "Modern Ahangama owes much of its identity to the ocean. We are not talking just about its renowned reputation as a traditional stilt fisherman.",
  "The reefs around Marshmallow, The Rock, and Kabalana have attracted surfers from around the world for years, as long as they have been keen enough to research.",
  "Their experiences began trickling into travel blogs and social media, attracting more over the years.",
];

const bodyParagraphs = [
  "As the surf community grew post-COVID, cafes, guesthouses, surf camps, and creative businesses followed. Today, many of the spaces that define modern Ahangama were built by people who first arrived chasing a swell forecast and ended up staying much longer than planned.",
  "Take Kabalana Beach, one of our staff favourites. Between January and April, low tide reveals a broad 400 to 500 metre stretch of golden sand fringed by coconut palm trees. Early mornings belong to surfers waxing boards and checking conditions. By late afternoon, the beach often fills with football games, volleyball matches, and groups gathering to watch the sunset.",
  "For newcomers, surfing here is surprisingly accessible. Board rentals can cost as little as USD 2 to 3 per day, while private lessons are often available for around USD 10 to 15. Those looking to fully immerse themselves in the lifestyle will find more surf camps in Ahangama than almost anywhere else in Sri Lanka.",
  "On the Ahangama Pass, you'll save even more.",
  'Sofie, a university lecturer from the Netherlands, booked a Level 0 (The Basic) lesson at Dreamsea Surf Camp on her second day.',
  '"I spent more time falling off than standing up," she laughed. "But by the end of the week, I understood why people keep coming back."',
  "Even if you never step onto a board, you're still experiencing a town shaped by surfing. The businesses you visit, the people you meet, and the rhythm of daily life all carry their influence.",
];

export default function WhySurfingChangedEverythingInAhangamaPage() {
  const canonical = absUrl(WHY_SURFING_CHANGED_PATH);
  const passCtaUrl = buildPassCtaUrl();

  return (
    <SiteLayout>
      <Seo
        title="Why Surfing Changed Everything in Ahangama"
        description="A short editorial on how surf culture reshaped modern Ahangama, from Kabalana mornings to the cafes, camps, and creative businesses that followed."
        canonical={canonical}
        ogImage={HERO_IMAGE}
      />

      <div className="dm-heroCut" />
      <div className="dm-canvas">
        <div className="dm-wrap">
          <div
            style={{
              minHeight: "clamp(460px, 72vh, 720px)",
              borderRadius: 30,
              overflow: "hidden",
              position: "relative",
              backgroundImage: `linear-gradient(180deg, rgba(8,13,16,0.08) 0%, rgba(8,13,16,0.52) 72%, rgba(8,13,16,0.72) 100%), url(${HERO_IMAGE})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              marginBottom: 28,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "flex-end",
                padding: "clamp(28px, 4vw, 44px)",
              }}
            >
              <div style={{ maxWidth: 760 }}>
                <Text
                  style={{
                    display: "block",
                    color: "rgba(255,255,255,0.86)",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: 2.2,
                    textTransform: "uppercase",
                    marginBottom: 12,
                  }}
                >
                  Editorial
                </Text>
                <div
                  role="heading"
                  aria-level={1}
                  style={{
                    margin: 0,
                    color: "#FFFFFF",
                    fontFamily:
                      '"Cormorant Garamond", "Libre Baskerville", Georgia, serif',
                    fontSize: "clamp(38px, 5.6vw, 72px)",
                    fontWeight: 500,
                    lineHeight: 0.96,
                    letterSpacing: "-0.025em",
                  }}
                >
                  Why Surfing Changed Everything in Ahangama
                </div>
              </div>
            </div>
          </div>

          <Text
            style={{
              display: "block",
              marginBottom: 24,
              color: "#6B655D",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 0.4,
            }}
          >
            Words By Jessica Fernando
          </Text>

          <Row gutter={[24, 24]}>
            <Col xs={24} xl={16}>
              <Card
                style={{
                  borderRadius: 24,
                  border: "1px solid rgba(47,62,58,0.08)",
                  background: "linear-gradient(180deg, #fffdf9 0%, #faf4eb 100%)",
                  marginBottom: 24,
                }}
                bodyStyle={{ padding: "clamp(22px, 3vw, 34px)" }}
              >
                {introParagraphs.map((paragraph) => (
                  <Paragraph
                    key={paragraph}
                    style={{
                      color: "#433d37",
                      fontSize: 18,
                      lineHeight: 1.9,
                      marginBottom: 20,
                    }}
                  >
                    {paragraph}
                  </Paragraph>
                ))}

                <Row gutter={[16, 16]} style={{ marginTop: 6, marginBottom: 6 }}>
                  {[SIDE_IMAGE_ONE, SIDE_IMAGE_TWO].map((imageUrl) => (
                    <Col xs={24} md={12} key={imageUrl}>
                      <div
                        style={{
                          aspectRatio: "1 / 1.08",
                          borderRadius: 20,
                          overflow: "hidden",
                          backgroundImage: `url(${imageUrl})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                    </Col>
                  ))}
                </Row>

                {bodyParagraphs.slice(0, 2).map((paragraph) => (
                  <Paragraph
                    key={paragraph}
                    style={{
                      color: "#433d37",
                      fontSize: 18,
                      lineHeight: 1.9,
                      marginTop: 24,
                      marginBottom: 0,
                    }}
                  >
                    {paragraph}
                  </Paragraph>
                ))}

                <div
                  style={{
                    marginTop: 28,
                    borderRadius: 22,
                    overflow: "hidden",
                    border: "1px solid rgba(47,62,58,0.08)",
                  }}
                >
                  <img
                    src={KABALANA_IMAGE}
                    alt="Kabalana Beach on the Ahangama coast"
                    style={{ display: "block", width: "100%", height: "auto" }}
                  />
                </div>

                <Text
                  style={{
                    display: "block",
                    marginTop: 10,
                    color: "#8B5A3C",
                    fontSize: 12,
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                  }}
                >
                  Royalty-free photo option
                </Text>

                {bodyParagraphs.slice(2).map((paragraph, index) => {
                  const isQuote = paragraph.startsWith('"');
                  const isPassLine = paragraph === "On the Ahangama Pass, you'll save even more.";

                  if (isQuote) {
                    return (
                      <blockquote
                        key={paragraph}
                        style={{
                          margin: "22px 0 0",
                          padding: "18px 22px",
                          borderLeft: "3px solid rgba(139,90,60,0.5)",
                          background: "rgba(255,255,255,0.7)",
                          color: "#433d37",
                          fontSize: 18,
                          lineHeight: 1.8,
                        }}
                      >
                        {paragraph}
                      </blockquote>
                    );
                  }

                  return (
                    <Paragraph
                      key={`${paragraph}-${index}`}
                      style={{
                        color: isPassLine ? "#2F3E3A" : "#433d37",
                        fontSize: 18,
                        lineHeight: 1.9,
                        marginTop: 24,
                        marginBottom: 0,
                        fontWeight: isPassLine ? 700 : 400,
                      }}
                    >
                      {paragraph}
                    </Paragraph>
                  );
                })}
              </Card>
            </Col>

            <Col xs={24} xl={8}>
              <Card
                style={{
                  borderRadius: 24,
                  border: "1px solid rgba(47,62,58,0.08)",
                  background: "#FFFFFF",
                  marginBottom: 24,
                }}
                bodyStyle={{ padding: 24 }}
              >
                <Text
                  style={{
                    display: "block",
                    color: "#8B5A3C",
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 1.2,
                    marginBottom: 10,
                  }}
                >
                  Why it matters
                </Text>
                <Title level={3} style={{ marginTop: 0, marginBottom: 12 }}>
                  Surfing changed the town beyond the beach
                </Title>
                <Paragraph style={{ color: "#5C5953", lineHeight: 1.8 }}>
                  Surf culture did not just bring boards and lessons. It helped
                  shape the guesthouses, cafes, workspaces, and creative
                  businesses that now define contemporary Ahangama.
                </Paragraph>
                <Paragraph style={{ color: "#5C5953", lineHeight: 1.8, marginBottom: 0 }}>
                  Even if you never paddle out, you are still moving through a
                  town whose daily rhythm has been built around the swell.
                </Paragraph>
              </Card>

              <Card
                style={{
                  borderRadius: 24,
                  border: "1px solid rgba(47,62,58,0.08)",
                  background: "linear-gradient(180deg, #fffdf9 0%, #faf4eb 100%)",
                }}
                bodyStyle={{ padding: 24 }}
              >
                <Text
                  style={{
                    display: "block",
                    color: "#8B5A3C",
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 1.2,
                    marginBottom: 10,
                  }}
                >
                  Ahangama Pass
                </Text>
                <Title level={3} style={{ marginTop: 0, marginBottom: 12 }}>
                  Save more once you are here
                </Title>
                <Paragraph style={{ color: "#5C5953", lineHeight: 1.8 }}>
                  If surfing is what brings you south, the pass helps with the
                  rest: cafes, stays, wellness stops, and local experiences that
                  quickly become part of the same routine.
                </Paragraph>
                <Space wrap>
                  <Button
                    type="primary"
                    href={passCtaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      borderRadius: 999,
                      background: "#2F3E3A",
                      borderColor: "#2F3E3A",
                    }}
                  >
                    Get the Ahangama Pass
                  </Button>
                  <Button href="/offers" icon={<ArrowRightOutlined />} style={{ borderRadius: 999 }}>
                    Browse offers
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </SiteLayout>
  );
}