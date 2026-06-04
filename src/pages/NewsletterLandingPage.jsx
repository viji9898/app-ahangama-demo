import React from "react";
import { Grid, Typography } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import NewsletterSignup from "../components/newsletter/NewsletterSignup";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import denitsaPortrait from "../assets/temp/denitsa.jpg";
import kaffiImage from "../assets/temp/kaffi_image.jpg";
import muktiStudioImage from "../assets/temp/mukit_studio.jpg";
import sistersImage from "../assets/temp/sisters_image.jpg";
import photoOfWeekImage from "../assets/temp/photo_of_week.jpeg";

const { Paragraph, Text, Title } = Typography;
const { useBreakpoint } = Grid;

const SERIF_FONT = '"Cormorant Garamond", "Libre Baskerville", Georgia, serif';

const RECEIVE_ITEMS = [
  {
    label: "New Openings",
    title: "Openings worth paying attention to",
    body: "Restaurants, cafes, shops, hotels and spaces opening around Ahangama.",
  },
  {
    label: "Local Recommendations",
    title: "Useful places, seasonal favourites and local discoveries",
    body: "Interesting places that feel timely, relevant and actually worth bookmarking.",
  },
  {
    label: "Events",
    title: "A concise view of what is happening around town",
    body: "Workshops, markets, music, wellness and community gatherings.",
  },
  {
    label: "Guides",
    title: "Practical guides for daily life and short stays",
    body: "Food, surf, wellness, transport and local life, edited into useful reads.",
  },
  {
    label: "Stories",
    title: "Features on the people and places shaping Ahangama",
    body: "Longer reads on businesses, creative communities and shifts around the south coast.",
  },
  {
    label: "Ahangama Pass",
    title: "Member offers, partner updates and useful additions",
    body: "A clear monthly digest of new member offers and partner news.",
  },
];

const FEATURED_STORIES = [
  {
    title: "Why Everyone Is Moving South",
    summary:
      "A reported look at the people, rhythms and practical realities behind the south coast's steady pull.",
    readingTime: "6 min read",
    href: "/blogs",
    image: photoOfWeekImage,
  },
  {
    title: "The New Wellness Movement",
    summary:
      "Studios, recovery spaces and slower rituals are reshaping the way people spend time in Ahangama.",
    readingTime: "7 min read",
    href: "/blogs/the-ultimate-wellness-guide-to-ahangama-yoga-gyms-pilates-ice-baths-spas",
    image: kaffiImage,
  },
  {
    title: "Inside Ahangama's Creative Community",
    summary:
      "A quieter portrait of the makers, founders and studios giving the town a more distinct creative identity.",
    readingTime: "5 min read",
    href: "/concept",
    image: sistersImage,
  },
  {
    title: "A Guide To The Season Ahead",
    summary:
      "What to watch, where to go and the practical details that make the coming months easier to navigate.",
    readingTime: "8 min read",
    href: "/3-days-in-ahangama",
    image: muktiStudioImage,
  },
];

const INTELLIGENCE_ITEMS = [
  {
    label: "Surf",
    detail: "3-4ft at Marshmallow",
  },
  {
    label: "Weather",
    detail: "Mostly sunny this week",
  },
  {
    label: "Opening",
    detail: "Studio Mukti",
  },
  {
    label: "Event",
    detail: "Community Market this Saturday",
  },
  {
    label: "Discussion",
    detail: "Coconut Court Pickleball",
  },
];

const AUDIENCE_CARDS = [
  {
    title: "Residents",
    body: "Stay informed about openings, events, local recommendations and the quieter shifts around town.",
  },
  {
    title: "Regular Visitors",
    body: "A way to stay connected between trips and return with a better sense of what has changed.",
  },
  {
    title: "Future Visitors",
    body: "A useful introduction for travellers who want a more considered sense of Ahangama before arriving.",
  },
  {
    title: "Business Owners",
    body: "A measured read on hospitality openings, local movement and destination-level change.",
  },
];

function SectionLabel({ children }) {
  return (
    <Text
      style={{
        display: "block",
        marginBottom: 14,
        color: "#0F5C6B",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 2.2,
        textTransform: "uppercase",
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {children}
    </Text>
  );
}

export default function NewsletterLandingPage() {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  return (
    <SiteLayout>
      <Seo
        title="The Ahangama Dispatch"
        description="A monthly editorial letter covering local recommendations, openings, events, guides and stories from Ahangama."
        canonical={absUrl("/newsletter")}
      />

      <div>
        <main
          style={{
            maxWidth: 720,
            margin: "0 auto",
            padding: isMobile ? "32px 20px 80px" : "56px 24px 120px",
            fontFamily:
              'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          }}
        >
          <section
            style={{
              padding: isMobile ? "12px 0 56px" : "18px 0 72px",
            }}
          >
            <div>
              <SectionLabel>Monthly Letter</SectionLabel>
              <Title
                level={1}
                style={{
                  margin: 0,
                  color: "#111111",
                  fontFamily: SERIF_FONT,
                  fontSize: isMobile ? 48 : 86,
                  lineHeight: isMobile ? 1 : 0.94,
                  letterSpacing: "-0.03em",
                }}
              >
                The Ahangama Dispatch
              </Title>
              <Paragraph
                style={{
                  marginTop: 22,
                  marginBottom: 0,
                  color: "#303030",
                  fontSize: isMobile ? 19 : 22,
                  lineHeight: 1.72,
                  fontFamily:
                    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                }}
              >
                A monthly collection of local recommendations, new openings,
                notable events, guides and stories from Ahangama.
              </Paragraph>
              <Paragraph
                style={{
                  marginTop: 18,
                  marginBottom: 0,
                  color: "#4A4A4A",
                  fontSize: isMobile ? 15 : 16,
                  lineHeight: 1.9,
                  fontFamily:
                    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                }}
              >
                Currently read by residents, business owners, frequent visitors
                and travellers planning their next stay in Ahangama.
              </Paragraph>
            </div>

            <div style={{ marginTop: 28 }}>
              <NewsletterSignup
                variant="compact"
                source="newsletter_page"
                label=""
                title=""
                description=""
              />
            </div>
          </section>

          <section
            style={{
              padding: isMobile ? "0 0 56px" : "0 0 72px",
              borderTop: "1px solid rgba(17, 17, 17, 0.12)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1.2fr) 180px",
                gap: isMobile ? 24 : 28,
                alignItems: "start",
                paddingTop: isMobile ? 28 : 36,
              }}
            >
              <div>
                <SectionLabel>Editor&apos;s Letter</SectionLabel>
                <Text
                  style={{
                    display: "block",
                    marginBottom: 8,
                    color: "#207886",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 2.2,
                    textTransform: "uppercase",
                    fontFamily:
                      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  }}
                >
                  From Ahangama
                </Text>
                <Title
                  level={2}
                  style={{
                    margin: 0,
                    color: "#111111",
                    fontFamily: SERIF_FONT,
                    fontSize: isMobile ? 38 : 56,
                    lineHeight: 1,
                  }}
                >
                  A calmer way to keep up with Ahangama.
                </Title>
                <Paragraph
                  style={{
                    marginTop: 22,
                    marginBottom: 0,
                    color: "#303030",
                    fontSize: isMobile ? 17 : 18,
                    lineHeight: 1.92,
                    fontFamily:
                      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  }}
                >
                  Ahangama changes quickly.
                </Paragraph>
                <Paragraph
                  style={{
                    marginTop: 18,
                    marginBottom: 0,
                    color: "#303030",
                    fontSize: isMobile ? 16 : 18,
                    lineHeight: 1.92,
                    fontFamily:
                      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  }}
                >
                  New cafes open, communities grow, visitors arrive, businesses
                  evolve and useful local knowledge is often scattered across
                  WhatsApp groups, Instagram posts and conversations.
                </Paragraph>
                <Paragraph
                  style={{
                    marginTop: 18,
                    marginBottom: 0,
                    color: "#303030",
                    fontSize: isMobile ? 16 : 18,
                    lineHeight: 1.92,
                    fontFamily:
                      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  }}
                >
                  The Ahangama Dispatch was created to bring together the most
                  useful updates from around town into a single monthly letter.
                </Paragraph>
                <Paragraph
                  style={{
                    marginTop: 18,
                    marginBottom: 0,
                    color: "#111111",
                    fontSize: isMobile ? 16 : 18,
                    lineHeight: 1.92,
                    fontFamily:
                      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  }}
                >
                  No noise.
                </Paragraph>
                <Paragraph
                  style={{
                    marginTop: 8,
                    marginBottom: 0,
                    color: "#111111",
                    fontSize: isMobile ? 16 : 18,
                    lineHeight: 1.92,
                    fontFamily:
                      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  }}
                >
                  No daily emails.
                </Paragraph>
                <Paragraph
                  style={{
                    marginTop: 8,
                    marginBottom: 0,
                    color: "#111111",
                    fontSize: isMobile ? 16 : 18,
                    lineHeight: 1.92,
                    fontFamily:
                      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  }}
                >
                  Just one thoughtful update from Ahangama.
                </Paragraph>
              </div>

              <figure style={{ margin: 0 }}>
                <img
                  src={denitsaPortrait}
                  alt="Portrait from Ahangama"
                  style={{
                    display: "block",
                    width: "100%",
                    aspectRatio: "4 / 5",
                    objectFit: "cover",
                    borderRadius: 18,
                    filter: "grayscale(100%)",
                  }}
                />
              </figure>
            </div>
          </section>

          <section
            style={{
              padding: isMobile ? "0 0 56px" : "0 0 72px",
              borderTop: "1px solid rgba(17, 17, 17, 0.12)",
            }}
          >
            <div style={{ paddingTop: isMobile ? 28 : 36 }}>
              <SectionLabel>What You&apos;ll Receive</SectionLabel>
              <Title
                level={2}
                style={{
                  margin: 0,
                  color: "#111111",
                  fontFamily: SERIF_FONT,
                  fontSize: isMobile ? 38 : 56,
                  lineHeight: 1,
                }}
              >
                The monthly shape of the letter.
              </Title>
            </div>

            <div
              style={{
                display: "grid",
                gap: 18,
                marginTop: 28,
              }}
            >
              {RECEIVE_ITEMS.map((item) => (
                <article
                  key={item.label}
                  style={{
                    paddingBottom: 18,
                    borderBottom: "1px solid rgba(17, 17, 17, 0.12)",
                  }}
                >
                  <Text
                    style={{
                      display: "block",
                      marginBottom: 12,
                      color: "#207886",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: 2.2,
                      textTransform: "uppercase",
                      fontFamily:
                        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    }}
                  >
                    {item.label}
                  </Text>
                  <Title
                    level={3}
                    style={{
                      margin: 0,
                      color: "#111111",
                      fontFamily: SERIF_FONT,
                      fontSize: isMobile ? 30 : 38,
                      lineHeight: 1.02,
                    }}
                  >
                    {item.title}
                  </Title>
                  <Paragraph
                    style={{
                      marginTop: 14,
                      marginBottom: 0,
                      color: "#3E3E3E",
                      fontSize: isMobile ? 15 : 16,
                      lineHeight: 1.88,
                      fontFamily:
                        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    }}
                  >
                    {item.body}
                  </Paragraph>
                </article>
              ))}
            </div>
          </section>

          <section
            style={{
              padding: isMobile ? "0 0 56px" : "0 0 72px",
              borderTop: "1px solid rgba(17, 17, 17, 0.12)",
            }}
          >
            <div style={{ paddingTop: isMobile ? 28 : 36 }}>
              <SectionLabel>Recent Stories</SectionLabel>
              <Title
                level={2}
                style={{
                  margin: 0,
                  color: "#111111",
                  fontFamily: SERIF_FONT,
                  fontSize: isMobile ? 38 : 56,
                  lineHeight: 1,
                }}
              >
                Recent stories from around town.
              </Title>
            </div>

            <div
              style={{
                display: "grid",
                gap: 28,
                marginTop: 28,
              }}
            >
              {FEATURED_STORIES.map((story) => (
                <a
                  key={story.title}
                  href={story.href}
                  style={{
                    display: "block",
                    color: "inherit",
                    textDecoration: "none",
                    paddingBottom: 28,
                    borderBottom: "1px solid rgba(17, 17, 17, 0.12)",
                  }}
                >
                  <img
                    src={story.image}
                    alt={story.title}
                    style={{
                      display: "block",
                      width: "100%",
                      aspectRatio: "16 / 9",
                      objectFit: "cover",
                      marginBottom: 18,
                      borderRadius: 14,
                    }}
                  />
                  <Title
                    level={3}
                    style={{
                      margin: 0,
                      color: "#111111",
                      fontFamily: SERIF_FONT,
                      fontSize: isMobile ? 32 : 42,
                      lineHeight: 1.02,
                    }}
                  >
                    {story.title}
                  </Title>
                  <Paragraph
                    style={{
                      marginTop: 14,
                      marginBottom: 0,
                      color: "#3E3E3E",
                      fontSize: isMobile ? 15 : 16,
                      lineHeight: 1.86,
                      fontFamily:
                        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    }}
                  >
                    {story.summary}
                  </Paragraph>
                  <Text
                    style={{
                      display: "block",
                      marginTop: 12,
                      color: "#5C5C5C",
                      fontSize: 12,
                      letterSpacing: 0.2,
                      fontFamily:
                        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    }}
                  >
                    {story.readingTime}
                  </Text>
                </a>
              ))}
            </div>
          </section>

          <section
            style={{
              padding: isMobile ? "0 0 56px" : "0 0 72px",
              borderTop: "1px solid rgba(17, 17, 17, 0.12)",
            }}
          >
            <div style={{ paddingTop: isMobile ? 28 : 36 }}>
              <SectionLabel>Local Intelligence</SectionLabel>
              <Title
                level={2}
                style={{
                  margin: 0,
                  color: "#111111",
                  fontFamily: SERIF_FONT,
                  fontSize: isMobile ? 38 : 56,
                  lineHeight: 1,
                }}
              >
                A short briefing from around town.
              </Title>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(2, minmax(0, 1fr))",
                gap: 14,
                marginTop: 28,
              }}
            >
              {INTELLIGENCE_ITEMS.map((item) => (
                <article
                  key={item.label}
                  style={{
                    minHeight: 108,
                    padding: isMobile ? 16 : 18,
                    border: "1px solid rgba(17, 17, 17, 0.12)",
                    borderRadius: 14,
                  }}
                >
                  <Text
                    style={{
                      display: "block",
                      color: "#207886",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: 2.2,
                      textTransform: "uppercase",
                      fontFamily:
                        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    }}
                  >
                    {item.label}
                  </Text>
                  <Title
                    level={4}
                    style={{
                      marginTop: 12,
                      marginBottom: 0,
                      color: "#111111",
                      fontFamily: SERIF_FONT,
                      fontSize: isMobile ? 24 : 28,
                      lineHeight: 1.08,
                    }}
                  >
                    {item.detail}
                  </Title>
                </article>
              ))}
            </div>
          </section>

          <section
            style={{
              padding: isMobile ? "0 0 56px" : "0 0 72px",
              borderTop: "1px solid rgba(17, 17, 17, 0.12)",
            }}
          >
            <div style={{ paddingTop: isMobile ? 28 : 36 }}>
              <SectionLabel>Who Reads The Dispatch</SectionLabel>
              <Title
                level={2}
                style={{
                  margin: 0,
                  color: "#111111",
                  fontFamily: SERIF_FONT,
                  fontSize: isMobile ? 38 : 56,
                  lineHeight: 1,
                }}
              >
                Read by people with a real stake in Ahangama.
              </Title>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(2, minmax(0, 1fr))",
                gap: 14,
                marginTop: 28,
              }}
            >
              {AUDIENCE_CARDS.map((card) => (
                <article
                  key={card.title}
                  style={{
                    padding: isMobile ? 18 : 20,
                    border: "1px solid rgba(17, 17, 17, 0.12)",
                    borderRadius: 14,
                  }}
                >
                  <Title
                    level={3}
                    style={{
                      margin: 0,
                      color: "#111111",
                      fontFamily: SERIF_FONT,
                      fontSize: isMobile ? 28 : 32,
                      lineHeight: 1.04,
                    }}
                  >
                    {card.title}
                  </Title>
                  <Paragraph
                    style={{
                      marginTop: 12,
                      marginBottom: 0,
                      color: "#3E3E3E",
                      fontSize: 15,
                      lineHeight: 1.84,
                      fontFamily:
                        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    }}
                  >
                    {card.body}
                  </Paragraph>
                </article>
              ))}
            </div>
          </section>

          <section
            style={{
              padding: isMobile ? "0 0 56px" : "0 0 72px",
              borderTop: "1px solid rgba(17, 17, 17, 0.12)",
            }}
          >
            <div
              style={{
                paddingTop: isMobile ? 28 : 36,
              }}
            >
              <SectionLabel>Sample Issue</SectionLabel>
              <Title
                level={2}
                style={{
                  margin: 0,
                  color: "#111111",
                  fontFamily: SERIF_FONT,
                  fontSize: isMobile ? 38 : 56,
                  lineHeight: 1,
                }}
              >
                A typical issue, at a glance.
              </Title>

              <div
                style={{
                  marginTop: 28,
                  border: "1px solid rgba(17, 17, 17, 0.12)",
                  borderRadius: 18,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile
                      ? "1fr"
                      : "minmax(220px, 240px) minmax(0, 1fr)",
                  }}
                >
                  <div
                    style={{
                      padding: isMobile ? 18 : 24,
                      borderBottom: isMobile
                        ? "1px solid rgba(17, 17, 17, 0.12)"
                        : "none",
                      borderRight: isMobile
                        ? "none"
                        : "1px solid rgba(17, 17, 17, 0.12)",
                    }}
                  >
                    <Text
                      style={{
                        display: "block",
                        color: "#207886",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 2.2,
                        textTransform: "uppercase",
                        fontFamily:
                          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                      }}
                    >
                      Issue Contents
                    </Text>
                    <Title
                      level={3}
                      style={{
                        marginTop: 10,
                        marginBottom: 0,
                        color: "#111111",
                        fontFamily: SERIF_FONT,
                        fontSize: isMobile ? 28 : 30,
                        lineHeight: 0.96,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      June
                      <br />
                      Edition
                    </Title>
                  </div>

                  <div style={{ padding: isMobile ? 18 : 24 }}>
                    {[
                      "Editor's Letter",
                      "5 New Openings",
                      "4 Events Worth Knowing",
                      "Story of the Month",
                      "Local Intelligence",
                      "Restaurant Recommendation",
                      "Wellness Recommendation",
                      "Ahangama Pass Updates",
                      "Closing Notes",
                    ].map((item, index) => (
                      <div
                        key={item}
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          justifyContent: "space-between",
                          gap: 16,
                          padding: index === 0 ? "0 0 12px" : "12px 0",
                          borderTop:
                            index === 0
                              ? "none"
                              : "1px solid rgba(17, 17, 17, 0.08)",
                        }}
                      >
                        <Text
                          style={{
                            color: "#111111",
                            fontSize: 15,
                            lineHeight: 1.7,
                            fontFamily:
                              'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                          }}
                        >
                          {item}
                        </Text>
                        <Text
                          style={{
                            color: "#7A7A7A",
                            fontSize: 12,
                            fontFamily:
                              'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                          }}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </Text>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            style={{
              paddingTop: isMobile ? 28 : 36,
              borderTop: "1px solid rgba(17, 17, 17, 0.12)",
            }}
          >
            <SectionLabel>Join The Ahangama Dispatch</SectionLabel>
            <div style={{ marginBottom: 20 }}>
                <Title
                  level={2}
                  style={{
                    margin: 0,
                    color: "#111111",
                    fontFamily: SERIF_FONT,
                    fontSize: isMobile ? 38 : 56,
                    lineHeight: 1,
                  }}
                >
                  Join The Ahangama Dispatch
                </Title>
                <Paragraph
                  style={{
                    marginTop: 16,
                    marginBottom: 0,
                    color: "#3E3E3E",
                    fontSize: isMobile ? 16 : 18,
                    lineHeight: 1.88,
                    fontFamily:
                      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  }}
                >
                  One thoughtful monthly email covering the people, places,
                  openings and stories worth knowing.
                </Paragraph>
              </div>

              <NewsletterSignup
                variant="default"
                source="newsletter_page_footer"
                label=""
                title=""
                description=""
              />
          </section>
        </main>
      </div>
    </SiteLayout>
  );
}