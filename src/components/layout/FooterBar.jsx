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
    href: "/blogs/the-ultimate-wellness-guide-to-ahangama-yoga-gyms-pilates-ice-baths-spas",
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
    href: "/blogs/getting-around-ahangama-scooters-tuk-tuks-airport-transfers",
  },
];

const discoveryLinks = [
  { label: "Guides", href: "/blogs" },
  { label: "Places", href: "/search" },
  { label: "Map", href: "/map" },
  { label: "Experiences", href: "/12-things" },
  {
    label: "Wellness",
    href: "/blogs/the-ultimate-wellness-guide-to-ahangama-yoga-gyms-pilates-ice-baths-spas",
  },
  { label: "Surf", href: "/12-things" },
  { label: "Food", href: "/eat" },
  { label: "Stays", href: "/stays" },
  {
    label: "Transport",
    href: "/blogs/getting-around-ahangama-scooters-tuk-tuks-airport-transfers",
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
        padding: isMobile ? "28px 16px 24px" : "36px 16px 28px",
        marginTop: 24,
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div
          aria-hidden="true"
          style={{
            height: 1,
            width: "100%",
            marginBottom: isMobile ? 20 : 24,
            background: "rgba(32, 30, 27, 0.08)",
          }}
        />
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

                <div
                  style={{
                    marginTop: 28,
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
