import React, { useState } from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Grid, Input, Typography } from "antd";

const { Text, Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const SERIF_FONT = '"Cormorant Garamond", "Libre Baskerville", Georgia, serif';

const editorialStories = [
  {
    label: "FASHION",
    title: "Mukti Studio and the New Face of Ahangama",
    excerpt:
      "A thoughtful look at one of Ahangama's most community-driven creative businesses and the people shaping its next chapter.",
    href: "/blogs/mukti-studio-and-the-new-face-of-ahangama",
  },
  {
    label: "Wellness Guide",
    title: "Ultimate Wellness Guide",
    excerpt:
      "The yoga studios, recovery rituals, ice baths, gyms, and quiet reset spots worth building a stay around.",
    href: "/the-ultimate-wellness-guide-to-ahangama-yoga-gyms-pilates-ice-baths-spas",
  },
  {
    label: "Field Notes",
    title: "12 Must Do Things in Ahangama",
    excerpt:
      "A long-form editorial guide to the places, small rituals, and signature experiences that define a stay here.",
    href: "/12-things",
  },
  {
    label: "Practical Guide",
    title: "Getting Around Ahangama",
    excerpt:
      "Scooters, tuk tuks, airport transfers, and the practical transport advice visitors usually need on day one.",
    href: "/getting-around-ahangama-scooters-tuk-tuks-airport-transfers",
  },
];

const weeklyNotes = [
  {
    label: "New Opening",
    title: "A new coffee and bakery concept has opened near Kabalana.",
    detail:
      "One for early starts, pastry runs, and the people who plan mornings around coffee rather than schedules.",
  },
  {
    label: "Local Tip",
    title: "Sunsets have been particularly good at Marshmellow this week.",
    detail:
      "Go a little earlier than usual, order slowly, and expect the beach to be at its best just before dusk.",
  },
  {
    label: "Event",
    title:
      "Live music every Friday evening at one of the town's favourite hangouts.",
    detail:
      "A good choice if you want something social without committing to a full late night out.",
  },
  {
    label: "Seasonal Note",
    title:
      "Morning surf and late-afternoon swims are the sweet spots right now.",
    detail:
      "The current rhythm favours early movement, a long lunch, and slower plans once the heat softens.",
  },
];

const discoveryLinks = [
  { label: "Guides", href: "/blogs" },
  { label: "Places", href: "/search" },
  { label: "Map", href: "/map" },
  { label: "Experiences", href: "/12-things" },
  {
    label: "Wellness",
    href: "/the-ultimate-wellness-guide-to-ahangama-yoga-gyms-pilates-ice-baths-spas",
  },
  { label: "Surf", href: "/12-things" },
  { label: "Food", href: "/eat" },
  { label: "Stays", href: "/stays" },
  {
    label: "Transport",
    href: "/getting-around-ahangama-scooters-tuk-tuks-airport-transfers",
  },
  { label: "Ahangama Pass", href: "/what-is-ahangama-pass" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/ahangama.pass",
    external: true,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/94777908790?text=Hi%20Ahangama%20-%20I%20would%20love%20some%20local%20recommendations.",
    external: true,
  },
  {
    label: "Email",
    href: "mailto:hello@ahangama.com?subject=Ahangama%20Enquiry",
    external: true,
  },
];

const secondaryLinks = [
  { label: "Privacy", href: "/about" },
  { label: "Terms", href: "/card/terms" },
];

function subscribeHref(email) {
  const trimmedEmail = email.trim();

  return `mailto:hello@ahangama.com?subject=${encodeURIComponent(
    "Ahangama Dispatch Subscription",
  )}&body=${encodeURIComponent(`Please subscribe ${trimmedEmail} to The Ahangama Dispatch.`)}`;
}

export default function FooterBar() {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [email, setEmail] = useState("");

  function handleDispatchSubmit(event) {
    event.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    window.location.href = subscribeHref(trimmedEmail);
  }

  return (
    <footer
      style={{
        background: "transparent",
        padding: isMobile ? "72px 16px 24px" : "96px 16px 28px",
        marginTop: 72,
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: isMobile ? 28 : 36,
            padding: isMobile ? 24 : 40,
            border: "1px solid rgba(32, 30, 27, 0.08)",
            boxShadow: "0 18px 44px rgba(32, 30, 27, 0.05)",
          }}
        >
          <section>
            <Text
              style={{
                display: "block",
                marginBottom: 10,
                color: "#B08E62",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.6,
                textTransform: "uppercase",
              }}
            >
              Editorial Selection
            </Text>
            <Title
              level={2}
              style={{
                margin: 0,
                color: "#1F1D1A",
                fontFamily: SERIF_FONT,
                fontSize: isMobile ? 36 : 54,
                lineHeight: isMobile ? 1.02 : 0.98,
                letterSpacing: "-0.02em",
              }}
            >
              Continue Exploring Ahangama
            </Title>
            <Paragraph
              style={{
                maxWidth: 720,
                marginTop: 14,
                marginBottom: 0,
                color: "#6D655C",
                fontSize: isMobile ? 15 : 18,
                lineHeight: 1.75,
              }}
            >
              Discover more guides, stories, recommendations and local insights
              from our team.
            </Paragraph>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(4, minmax(0, 1fr))",
                gap: 16,
                marginTop: isMobile ? 24 : 30,
              }}
            >
              {editorialStories.map((story) => (
                <a
                  key={story.title}
                  href={story.href}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: isMobile ? 212 : 232,
                    padding: isMobile ? 18 : 22,
                    borderRadius: 22,
                    textDecoration: "none",
                    background: "rgba(255,255,255,0.45)",
                    border: "1px solid rgba(32, 30, 27, 0.08)",
                    color: "inherit",
                  }}
                >
                  <div>
                    <Text
                      style={{
                        color: "#8B7B63",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: 1.4,
                        textTransform: "uppercase",
                      }}
                    >
                      {story.label}
                    </Text>
                    <Title
                      level={4}
                      style={{
                        marginTop: 12,
                        marginBottom: 12,
                        color: "#1F1D1A",
                        fontFamily: SERIF_FONT,
                        fontSize: isMobile ? 25 : 28,
                        lineHeight: 1.1,
                      }}
                    >
                      {story.title}
                    </Title>
                    <Paragraph
                      style={{
                        marginBottom: 0,
                        color: "#5F584F",
                        fontSize: 14,
                        lineHeight: 1.8,
                      }}
                    >
                      {story.excerpt}
                    </Paragraph>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: 24,
                      paddingTop: 16,
                      borderTop: "1px solid rgba(32, 30, 27, 0.08)",
                    }}
                  >
                    <Text
                      style={{
                        color: "#2F3E3A",
                        fontSize: 13,
                        fontWeight: 600,
                        letterSpacing: 0.2,
                      }}
                    >
                      Read story
                    </Text>
                    <ArrowRightOutlined
                      style={{ color: "#2F3E3A", fontSize: 14 }}
                    />
                  </div>
                </a>
              ))}
            </div>
          </section>

          <section
            style={{
              marginTop: isMobile ? 36 : 44,
              paddingTop: isMobile ? 28 : 34,
              borderTop: "1px solid rgba(32, 30, 27, 0.08)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "minmax(0, 1.35fr) minmax(320px, 0.9fr)",
                gap: isMobile ? 28 : 34,
                alignItems: "start",
              }}
            >
              <div>
                <Text
                  style={{
                    display: "block",
                    marginBottom: 10,
                    color: "#B08E62",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1.6,
                    textTransform: "uppercase",
                  }}
                >
                  Local Bulletin
                </Text>
                <Title
                  level={3}
                  style={{
                    margin: 0,
                    color: "#1F1D1A",
                    fontFamily: SERIF_FONT,
                    fontSize: isMobile ? 30 : 40,
                    lineHeight: 1.06,
                  }}
                >
                  Ahangama This Week
                </Title>
                <Paragraph
                  style={{
                    maxWidth: 620,
                    marginTop: 12,
                    marginBottom: 0,
                    color: "#6D655C",
                    fontSize: 15,
                    lineHeight: 1.75,
                  }}
                >
                  A small local paper feeling: what is opening, what is worth
                  catching, and the kind of context visitors usually only get
                  once they are already here.
                </Paragraph>

                <div style={{ marginTop: 22 }}>
                  {weeklyNotes.map((item, index) => (
                    <div
                      key={item.label}
                      style={{
                        display: "grid",
                        gridTemplateColumns: isMobile
                          ? "1fr"
                          : "140px minmax(0, 1fr)",
                        gap: isMobile ? 8 : 20,
                        padding: isMobile ? "16px 0" : "18px 0",
                        borderTop:
                          index === 0
                            ? "1px solid rgba(32, 30, 27, 0.08)"
                            : "1px solid rgba(32, 30, 27, 0.06)",
                      }}
                    >
                      <Text
                        style={{
                          color: "#8B7B63",
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: 1.5,
                          textTransform: "uppercase",
                        }}
                      >
                        {item.label}
                      </Text>
                      <div>
                        <Paragraph
                          style={{
                            marginBottom: 6,
                            color: "#1F1D1A",
                            fontSize: isMobile ? 17 : 18,
                            lineHeight: 1.55,
                          }}
                        >
                          {item.title}
                        </Paragraph>
                        <Text
                          style={{
                            color: "#6D655C",
                            fontSize: 14,
                            lineHeight: 1.75,
                          }}
                        >
                          {item.detail}
                        </Text>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  padding: isMobile ? 20 : 24,
                  borderRadius: 24,
                  background: "rgba(255,255,255,0.42)",
                  border: "1px solid rgba(32, 30, 27, 0.08)",
                }}
              >
                <Text
                  style={{
                    display: "block",
                    marginBottom: 10,
                    color: "#B08E62",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1.6,
                    textTransform: "uppercase",
                  }}
                >
                  Monthly Letter
                </Text>
                <Title
                  level={3}
                  style={{
                    margin: 0,
                    color: "#1F1D1A",
                    fontFamily: SERIF_FONT,
                    fontSize: isMobile ? 28 : 34,
                    lineHeight: 1.08,
                  }}
                >
                  The Ahangama Dispatch
                </Title>
                <Paragraph
                  style={{
                    marginTop: 12,
                    marginBottom: 0,
                    color: "#6D655C",
                    fontSize: 15,
                    lineHeight: 1.78,
                  }}
                >
                  A monthly collection of local recommendations, new openings,
                  guides and stories from Ahangama.
                </Paragraph>

                <form onSubmit={handleDispatchSubmit} style={{ marginTop: 22 }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      gap: 10,
                    }}
                  >
                    <Input
                      size="large"
                      type="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Email Address"
                      style={{
                        flex: 1,
                        height: 48,
                        borderRadius: 999,
                        borderColor: "rgba(32, 30, 27, 0.12)",
                        background: "rgba(255,255,255,0.72)",
                        color: "#1F1D1A",
                        paddingInline: 18,
                      }}
                    />
                    <Button
                      htmlType="submit"
                      type="primary"
                      size="large"
                      style={{
                        height: 48,
                        borderRadius: 999,
                        paddingInline: 24,
                        background: "#2F3E3A",
                        borderColor: "#2F3E3A",
                        boxShadow: "none",
                        width: isMobile ? "100%" : "auto",
                      }}
                    >
                      Subscribe
                    </Button>
                  </div>
                </form>

                <Text
                  style={{
                    display: "block",
                    marginTop: 12,
                    color: "#8B7B63",
                    fontSize: 12,
                    lineHeight: 1.6,
                  }}
                >
                  Subscription currently opens your email client so the team can
                  add you manually.
                </Text>
              </div>
            </div>
          </section>

          <section
            style={{
              marginTop: isMobile ? 36 : 44,
              paddingTop: isMobile ? 28 : 34,
              borderTop: "1px solid rgba(32, 30, 27, 0.08)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "minmax(0, 1fr) minmax(0, 0.9fr)",
                gap: isMobile ? 28 : 36,
                alignItems: "start",
              }}
            >
              <div>
                <Text
                  style={{
                    display: "block",
                    marginBottom: 10,
                    color: "#B08E62",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1.6,
                    textTransform: "uppercase",
                  }}
                >
                  Discover More
                </Text>
                <Title
                  level={3}
                  style={{
                    margin: 0,
                    color: "#1F1D1A",
                    fontFamily: SERIF_FONT,
                    fontSize: isMobile ? 30 : 38,
                    lineHeight: 1.08,
                  }}
                >
                  Explore
                </Title>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile
                      ? "repeat(2, minmax(0, 1fr))"
                      : "repeat(5, minmax(0, max-content))",
                    gap: isMobile ? "14px 18px" : "16px 22px",
                    marginTop: 18,
                  }}
                >
                  {discoveryLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      style={{
                        color: "#2F3E3A",
                        textDecoration: "none",
                        fontSize: isMobile ? 16 : 17,
                        lineHeight: 1.5,
                      }}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <Text
                  style={{
                    display: "block",
                    marginBottom: 10,
                    color: "#B08E62",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1.6,
                    textTransform: "uppercase",
                  }}
                >
                  Local Credibility
                </Text>
                <Title
                  level={3}
                  style={{
                    margin: 0,
                    color: "#1F1D1A",
                    fontFamily: SERIF_FONT,
                    fontSize: isMobile ? 30 : 38,
                    lineHeight: 1.08,
                  }}
                >
                  Built in Ahangama
                </Title>
                <Paragraph
                  style={{
                    marginTop: 14,
                    marginBottom: 0,
                    color: "#6D655C",
                    fontSize: 15,
                    lineHeight: 1.8,
                  }}
                >
                  Created by a local team passionate about showcasing the very
                  best of Ahangama.
                </Paragraph>
                <Paragraph
                  style={{
                    marginTop: 10,
                    marginBottom: 0,
                    color: "#6D655C",
                    fontSize: 15,
                    lineHeight: 1.8,
                  }}
                >
                  Covering cafes, wellness, surf, stays, experiences and the
                  people that make this place special.
                </Paragraph>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 18,
                    marginTop: 20,
                  }}
                >
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      style={{
                        color: "#2F3E3A",
                        textDecoration: "none",
                        fontSize: 14,
                        letterSpacing: 0.2,
                      }}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "center",
              justifyContent: "space-between",
              gap: isMobile ? 10 : 16,
              marginTop: isMobile ? 34 : 42,
              paddingTop: isMobile ? 22 : 24,
              borderTop: "1px solid rgba(32, 30, 27, 0.08)",
            }}
          >
            <Text
              style={{ color: "#8B7B63", fontSize: 12, letterSpacing: 0.3 }}
            >
              © 2026 Ahangama.com
            </Text>
            <Text
              style={{ color: "#6D655C", fontSize: 12, letterSpacing: 0.5 }}
            >
              Your Guide to Ahangama
            </Text>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {secondaryLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  style={{
                    color: "#8B7B63",
                    textDecoration: "none",
                    fontSize: 12,
                    letterSpacing: 0.3,
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
