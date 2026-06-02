import React from "react";
import { Card, Col, Row, Space, Tag, Typography } from "antd";
import { ArrowRightOutlined, CheckOutlined } from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { buildPassCtaUrl } from "../lib/passAttribution";
import ahangamaPassLogo from "../assets/ahangama-pass-logo.png";

const { Paragraph, Text, Title } = Typography;

const articleIntroduction = [
  "There are destinations built around landmarks and there are destinations built around atmosphere.",
  "Ahangama belongs firmly in the latter category.",
  "Stretching along Sri Lanka's southern coastline between Weligama and Midigama, the town has evolved from a quiet fishing settlement into one of the island's most compelling communities. Surfers share coffee shops with architects. Designers sit beside fishermen at breakfast. Remote workers arrive for a week and somehow find themselves staying for months.",
  "The best experiences here are rarely scheduled. They emerge slowly through conversations, routines and chance encounters.",
  "Here are twelve ways to understand the town.",
];

const experiences = [
  {
    title: "Watch the Coast Wake Up",
    body: [
      "The day begins early in Ahangama.",
      "Before breakfast service starts and before the roads become busy, the coastline belongs to fishermen, dog walkers and surfers paddling towards the reef.",
      "From Kabalana to Marshmallow, the shoreline reveals a quieter side of the south coast. Nets are repaired on the beach, trains roll past the ocean and the first cups of tea are poured.",
      "The town is at its most beautiful before 7am.",
    ],
  },
  {
    title: "Learn Why People Travel Across the World to Surf Here",
    body: [
      "Ahangama's reputation was built on waves.",
      "The coastline offers an unusual variety of breaks within a short distance of one another, making it possible for complete beginners and experienced surfers to find suitable conditions on the same day.",
      "Yet what keeps people returning isn't simply the surf itself. It's the lifestyle that surrounds it - mornings in the water, long breakfasts and afternoons that unfold without urgency.",
    ],
  },
  {
    title: "Spend a Morning in a Cafe and Stay Longer Than Planned",
    body: [
      "The cafes have become the unofficial town squares of Ahangama.",
      "Over the past decade a collection of independent venues has emerged along the main road and surrounding lanes, attracting everyone from software founders and photographers to local entrepreneurs and travelling creatives.",
      "What begins as a coffee often turns into a conversation.",
      "And occasionally into a new business, friendship or reason to stay.",
    ],
  },
  {
    title: "Follow the Wellness Trail",
    body: [
      "Ahangama's wellness culture developed organically.",
      "Long before it became fashionable, surfers were organising yoga classes and seeking out Ayurvedic treatments to recover between sessions in the water.",
      "Today the town offers everything from Pilates studios and ice baths to traditional healing practices, though it retains a notably relaxed atmosphere compared to more established wellness destinations elsewhere in Asia.",
    ],
  },
  {
    title: "Discover the Town's Creative Community",
    body: [
      "Spend enough time in Ahangama and a pattern emerges.",
      "Many of the people who have chosen to build lives here work in creative fields. Designers, photographers, filmmakers, architects, writers and founders have all found their way to this stretch of coastline.",
      "Their influence can be seen in the cafes, boutiques, guesthouses and events that increasingly define the character of the town.",
    ],
  },
  {
    title: "Visit the Independent Shops",
    body: [
      "Ahangama is developing its own retail identity.",
      "Small design stores, clothing labels and concept spaces now sit alongside family-run businesses that have served the town for generations.",
      "One afternoon spent browsing reveals far more about the area's evolution than any guidebook could.",
      "Many of the most interesting products have been created by people who live only a few streets away.",
    ],
  },
  {
    title: "Spend an Evening at Coconut Court",
    body: [
      "Every town has a place where people naturally gather.",
      "In Ahangama, that place is increasingly Coconut Court.",
      "What began as a sporting venue has become one of the most social corners of the south coast. On any evening you might find locals, long-term residents, visiting surfers and entrepreneurs sharing a court, a conversation or a post-game drink.",
      "Few places offer a better snapshot of modern Ahangama.",
    ],
  },
  {
    title: "Take the Road Inland",
    body: [
      "Most visitors rarely leave the coast.",
      "This is a mistake.",
      "Only a few minutes from the ocean lie cinnamon estates, rice fields, village temples and quiet residential roads where daily life unfolds at a slower pace.",
      "The contrast is immediate.",
      "The surf town disappears and a different Sri Lanka emerges.",
    ],
  },
  {
    title: "Seek Out Traditional Ayurveda",
    body: [
      "While contemporary wellness receives much of the attention, Ayurveda remains deeply woven into Sri Lankan life.",
      "Treatments continue to be passed between generations, combining herbal remedies, massage and preventative care in ways that predate modern wellness trends by centuries.",
      "Experiencing Ayurveda here offers a useful reminder that many of the ideas celebrated today have much older roots.",
    ],
  },
  {
    title: "Watch Sunset Without a Destination",
    body: [
      "One of Ahangama's great pleasures is that the sunset belongs to everyone.",
      "There are no gates, tickets or queues.",
      "Find a seawall. Sit on the beach. Order a king coconut. Walk along the railway line.",
      "The best evenings are often the least planned.",
    ],
  },
  {
    title: "Meet the People Behind the Town",
    body: [
      "Some destinations are shaped by developers.",
      "Ahangama has largely been shaped by individuals.",
      "Restaurant owners, surf instructors, artists, wellness practitioners, hotel operators and designers have all contributed to the culture that visitors experience today.",
      "The more conversations you have, the more the town begins to make sense.",
    ],
  },
  {
    title: "Stay Long Enough",
    body: [
      "This may be the most important recommendation.",
      "Ahangama reveals itself slowly.",
      "The first few days are spent finding beaches and cafes. The following week introduces familiar faces. By the second or third week the routines become visible.",
      "The fisherman who waves each morning.",
      "The cafe owner who remembers your order.",
      "The surfer who first arrived six years ago and never left.",
      "These are the details that transform Ahangama from a destination into a community.",
      "And they are ultimately what people remember most.",
    ],
  },
];

const MENTIONED_PLACE_LINKS = [
  { label: "Weligama", href: "https://example.com/places/weligama" },
  { label: "Midigama", href: "https://example.com/places/midigama" },
  { label: "Kabalana", href: "https://example.com/places/kabalana" },
  { label: "Marshmallow", href: "https://example.com/places/marshmallow" },
  {
    label: "Coconut Court",
    href: "https://example.com/places/coconut-court",
  },
];

export default function TwelveThingsPage() {
  const canonical = absUrl("/12-things");
  const passCtaUrl = buildPassCtaUrl();
  const heroImage =
    "https://travelrebels.com/wp-content/uploads/2024/04/ahangama-sri-lanka-tips-1.webp";

  return (
    <SiteLayout>
      <Seo
        title="12 Ways to Experience Ahangama"
        description="An editorial guide to Ahangama through atmosphere, surf, cafes, wellness, creative community, independent shops, inland roads and slow routines."
        canonical={canonical}
      />

      <div className="dm-heroCut" style={{ background: "#ffffff" }} />
      <div className="dm-canvas" style={{ background: "#ffffff" }}>
        <div
          style={{
            position: "relative",
            minHeight: "calc(100vh - 88px)",
            overflow: "hidden",
            marginBottom: 32,
            background: "#ffffff",
          }}
        >
          <img
            src={heroImage}
            alt="Clifftop coastal view near Ahangama"
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
                "linear-gradient(180deg, rgba(17,16,14,0.08) 0%, rgba(17,16,14,0.16) 34%, rgba(17,16,14,0.5) 100%)",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              minHeight: "calc(100vh - 88px)",
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
              <Space wrap size={[8, 8]} style={{ marginBottom: 14 }}>
                <Tag
                  style={{
                    borderRadius: 999,
                    padding: "6px 12px",
                    color: "#ffffff",
                    borderColor: "rgba(255,255,255,0.32)",
                    background: "rgba(255,255,255,0.14)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  Editorial Guide
                </Tag>
                <Tag
                  style={{
                    borderRadius: 999,
                    padding: "6px 12px",
                    color: "#ffffff",
                    borderColor: "rgba(255,255,255,0.32)",
                    background: "rgba(255,255,255,0.14)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  South Coast Notes
                </Tag>
              </Space>

              <Title
                level={1}
                className="twelve-things-heroTitle"
                style={{
                  marginTop: 0,
                  marginBottom: 0,
                  color: "#ffffff",
                  fontSize: "clamp(42px, 6vw, 82px)",
                  lineHeight: 0.97,
                  letterSpacing: -1.8,
                  fontFamily:
                    '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                }}
              >
                12 Ways to Experience Ahangama
              </Title>
            </div>
          </div>
        </div>

        <div className="dm-wrap">
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

          <div style={{ display: "flex", flexDirection: "column" }}>
            {experiences.map((item, index) => {
              return (
                <section
                  key={item.title}
                  style={{
                    padding: index === 0 ? "20px 0 36px" : "36px 0",
                    borderTop:
                      index === 0 ? "none" : "1px solid rgba(47,62,58,0.12)",
                  }}
                >
                  <div
                    style={{
                      maxWidth: 1180,
                    }}
                  >
                    <Title level={2} style={{ marginTop: 0, marginBottom: 18 }}>
                      {item.title}
                    </Title>

                    {item.body.map((paragraph) => (
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
                  </div>
                </section>
              );
            })}
          </div>

          <div id="guide-note" style={{ marginTop: 32, marginBottom: 36 }}>
            <Card
              style={{
                borderRadius: 28,
                border: "1px solid rgba(47,62,58,0.08)",
                background: "#ffffff",
              }}
              bodyStyle={{ padding: 28 }}
            >
              <Row gutter={[24, 24]} align="middle">
                <Col xs={24} lg={16}>
                  <div
                    style={{
                      borderRadius: 24,
                      padding: 20,
                      background: "#ffffff",
                      border: "1px solid rgba(47,62,58,0.08)",
                      boxShadow: "0 10px 24px rgba(18,24,22,0.12)",
                    }}
                  >
                    <Text
                      style={{
                        display: "block",
                        color: "#6B5A4E",
                        textTransform: "uppercase",
                        letterSpacing: 1.5,
                        fontSize: 12,
                        marginBottom: 10,
                      }}
                    >
                      A Note From Your Guide
                    </Text>
                    <Title
                      level={2}
                      style={{
                        color: "#2F3E3A",
                        marginTop: 0,
                        marginBottom: 12,
                      }}
                    >
                      Written by Urvashi
                    </Title>
                    <Paragraph
                      style={{
                        color: "#2F3E3A",
                        fontSize: 16,
                        lineHeight: 1.8,
                        marginBottom: 0,
                      }}
                    >
                      Sri Lankan local, proud South Coast migrant, and part of
                      the Ahangama Team.
                    </Paragraph>
                  </div>
                </Col>

                <Col xs={24} lg={8}>
                  <Card
                    style={{
                      borderRadius: 22,
                      background: "#ffffff",
                      border: "1px solid rgba(47,62,58,0.08)",
                      boxShadow: "0 10px 24px rgba(18,24,22,0.12)",
                    }}
                    bodyStyle={{ padding: 20 }}
                  >
                    <Text
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        color: "#2F3E3A",
                        fontWeight: 700,
                        marginBottom: 12,
                      }}
                    >
                      <CheckOutlined
                        style={{ color: "#2F3E3A", fontSize: 14 }}
                      />
                      Ahangama Pass Perks
                    </Text>
                    <Paragraph
                      style={{
                        color: "#2F3E3A",
                        marginBottom: 18,
                      }}
                    >
                      Freebies and collectibles across the experiences in this
                      guide.
                    </Paragraph>
                    <a
                      href={passCtaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={ahangamaPassLogo}
                        alt="Ahangama Pass"
                        style={{ display: "block", height: 52, width: "auto" }}
                      />
                    </a>
                  </Card>
                </Col>
              </Row>

              <div
                style={{
                  marginTop: 18,
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

                <Space wrap size={[12, 8]}>
                  {MENTIONED_PLACE_LINKS.map((place) => (
                    <a
                      key={place.label}
                      href={place.href}
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
                      {place.label}
                      <ArrowRightOutlined style={{ fontSize: 11 }} />
                    </a>
                  ))}
                </Space>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
