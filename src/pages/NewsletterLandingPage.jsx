import React from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Grid, Typography } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import NewsletterSignup from "../components/newsletter/NewsletterSignup";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";

const { Paragraph, Text, Title } = Typography;
const { useBreakpoint } = Grid;

const SERIF_FONT = '"Cormorant Garamond", "Libre Baskerville", Georgia, serif';

const AUDIENCE_CARDS = [
  {
    title: "Residents",
    body: "Stay informed about new openings, community events, local recommendations and developments around town.",
  },
  {
    title: "Regular Visitors",
    body: "For those who return to Ahangama throughout the year and want to stay connected between visits.",
  },
  {
    title: "Future Visitors",
    body: "A useful introduction to the town before arriving, helping travellers discover places worth knowing.",
  },
  {
    title: "Business Owners",
    body: "Follow local trends, hospitality openings, events and developments shaping the destination.",
  },
];

const RECEIVE_ITEMS = [
  {
    title: "New Openings",
    body: "Restaurants, cafes, shops, hotels and spaces opening around Ahangama.",
  },
  {
    title: "Local Recommendations",
    body: "Interesting places, seasonal favourites and local discoveries.",
  },
  {
    title: "Events",
    body: "Workshops, markets, wellness gatherings, music and community events.",
  },
  {
    title: "Guides",
    body: "Curated guides covering food, surf, wellness, transport and local life.",
  },
  {
    title: "Stories",
    body: "Editorial features on people, businesses and places shaping Ahangama.",
  },
  {
    title: "Ahangama Pass Updates",
    body: "New partner venues, member offers and experiences.",
  },
];

const ISSUE_CARDS = [
  {
    issue: "Issue 01",
    title: "Why Everyone Is Moving South",
    summary:
      "A look at the people, businesses and daily rhythms drawing more long-stay life toward Ahangama.",
    href: "/blogs",
  },
  {
    issue: "Issue 02",
    title: "The New Wellness Movement",
    summary:
      "Inside the studios, recovery spaces and slower rituals shaping the next chapter of the south coast.",
    href: "/blogs/the-ultimate-wellness-guide-to-ahangama-yoga-gyms-pilates-ice-baths-spas",
  },
  {
    issue: "Issue 03",
    title: "A Guide To The Season Ahead",
    summary:
      "What to bookmark before the next stretch of surf, events, openings and longer weekends in town.",
    href: "/3-days-in-ahangama",
  },
];

function SectionLabel({ children }) {
  return (
    <Text
      style={{
        display: "block",
        marginBottom: 12,
        color: "#207886",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 1.8,
        textTransform: "uppercase",
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
            maxWidth: 1180,
            margin: "0 auto",
            padding: isMobile ? "28px 16px 72px" : "44px 24px 96px",
          }}
        >
          <section
            style={{
              padding: isMobile ? "24px 0 42px" : "38px 0 56px",
            }}
          >
            <div style={{ maxWidth: 860 }}>
              <SectionLabel>Monthly Letter</SectionLabel>
              <Title
                level={1}
                style={{
                  margin: 0,
                  color: "#142225",
                  fontFamily: SERIF_FONT,
                  fontSize: isMobile ? 46 : 84,
                  lineHeight: isMobile ? 0.98 : 0.92,
                  letterSpacing: "-0.03em",
                }}
              >
                The Ahangama Dispatch
              </Title>
              <Paragraph
                style={{
                  maxWidth: 760,
                  marginTop: 22,
                  marginBottom: 0,
                  color: "#405457",
                  fontSize: isMobile ? 17 : 20,
                  lineHeight: 1.85,
                }}
              >
                A monthly collection of local recommendations, new openings,
                notable events, guides and stories from Ahangama.
              </Paragraph>
              <Paragraph
                style={{
                  maxWidth: 760,
                  marginTop: 16,
                  marginBottom: 0,
                  color: "#405457",
                  fontSize: isMobile ? 16 : 18,
                  lineHeight: 1.9,
                }}
              >
                Whether you live here, visit often, own a property, run a
                business, or are simply interested in the south coast, The
                Dispatch helps you stay connected to what is happening in and
                around town.
              </Paragraph>
              <Paragraph
                style={{
                  maxWidth: 760,
                  marginTop: 18,
                  marginBottom: 0,
                  color: "#0F5C6B",
                  fontSize: isMobile ? 15 : 16,
                  fontWeight: 600,
                  lineHeight: 1.8,
                }}
              >
                Currently read by residents, business owners, frequent visitors
                and travellers planning their next stay in Ahangama.
              </Paragraph>
            </div>

          </section>

          <section
            style={{
              padding: isMobile ? "26px 0 20px" : "40px 0 24px",
            }}
          >
            <SectionLabel>Who Reads The Dispatch</SectionLabel>
            <Title
              level={2}
              style={{
                maxWidth: 760,
                margin: 0,
                color: "#142225",
                fontFamily: SERIF_FONT,
                fontSize: isMobile ? 34 : 54,
                lineHeight: 1,
              }}
            >
              A monthly letter for people with a real connection to Ahangama.
            </Title>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(2, minmax(0, 1fr))",
                gap: 16,
                marginTop: 26,
              }}
            >
              {AUDIENCE_CARDS.map((card) => (
                <article
                  key={card.title}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid rgba(15, 92, 107, 0.08)",
                    borderRadius: 28,
                    padding: isMobile ? 20 : 26,
                    boxShadow: "0 12px 30px rgba(18, 31, 34, 0.04)",
                  }}
                >
                  <Text
                    style={{
                      display: "block",
                      marginBottom: 10,
                      color: "#88AEB5",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 1.6,
                      textTransform: "uppercase",
                    }}
                  >
                    Reader
                  </Text>
                  <Title
                    level={3}
                    style={{
                      margin: 0,
                      color: "#162225",
                      fontFamily: SERIF_FONT,
                      fontSize: isMobile ? 28 : 34,
                      lineHeight: 1.04,
                    }}
                  >
                    {card.title}
                  </Title>
                  <Paragraph
                    style={{
                      marginTop: 14,
                      marginBottom: 0,
                      color: "#506366",
                      fontSize: 15,
                      lineHeight: 1.82,
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
              marginTop: isMobile ? 28 : 44,
              padding: isMobile ? "24px 18px" : "34px 28px",
              borderRadius: 32,
              border: "1px solid rgba(15, 92, 107, 0.08)",
            }}
          >
            <SectionLabel>What You&apos;ll Receive</SectionLabel>
            <Title
              level={2}
              style={{
                maxWidth: 820,
                margin: 0,
                color: "#142225",
                fontFamily: SERIF_FONT,
                fontSize: isMobile ? 34 : 54,
                lineHeight: 1,
              }}
            >
              Thoughtful local reporting, useful signals and the places worth
              paying attention to.
            </Title>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(3, minmax(0, 1fr))",
                gap: 16,
                marginTop: 26,
              }}
            >
              {RECEIVE_ITEMS.map((item) => (
                <article
                  key={item.title}
                  style={{
                    minHeight: 196,
                    border: "1px solid rgba(15, 92, 107, 0.08)",
                    borderRadius: 24,
                    padding: isMobile ? 18 : 22,
                  }}
                >
                  <Text
                    style={{
                      display: "block",
                      marginBottom: 10,
                      color: "#207886",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 1.6,
                      textTransform: "uppercase",
                    }}
                  >
                    Editorial Section
                  </Text>
                  <Title
                    level={3}
                    style={{
                      margin: 0,
                      color: "#162225",
                      fontFamily: SERIF_FONT,
                      fontSize: isMobile ? 26 : 30,
                      lineHeight: 1.06,
                    }}
                  >
                    {item.title}
                  </Title>
                  <Paragraph
                    style={{
                      marginTop: 14,
                      marginBottom: 0,
                      color: "#4E6063",
                      fontSize: 15,
                      lineHeight: 1.82,
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
              padding: isMobile ? "42px 0 18px" : "62px 0 28px",
            }}
          >
            <SectionLabel>Recent Editions</SectionLabel>
            <Title
              level={2}
              style={{
                maxWidth: 760,
                margin: 0,
                color: "#142225",
                fontFamily: SERIF_FONT,
                fontSize: isMobile ? 34 : 54,
                lineHeight: 1,
              }}
            >
              Three examples of the kind of letter subscribers receive.
            </Title>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(3, minmax(0, 1fr))",
                gap: 16,
                marginTop: 26,
              }}
            >
              {ISSUE_CARDS.map((issue) => (
                <article
                  key={issue.issue}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 280,
                    background: "#FFFFFF",
                    border: "1px solid rgba(15, 92, 107, 0.08)",
                    borderRadius: 28,
                    padding: isMobile ? 20 : 24,
                    boxShadow: "0 12px 28px rgba(18, 31, 34, 0.04)",
                  }}
                >
                  <Text
                    style={{
                      display: "block",
                      color: "#207886",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 1.8,
                      textTransform: "uppercase",
                    }}
                  >
                    {issue.issue}
                  </Text>
                  <Title
                    level={3}
                    style={{
                      marginTop: 12,
                      marginBottom: 0,
                      color: "#162225",
                      fontFamily: SERIF_FONT,
                      fontSize: isMobile ? 28 : 34,
                      lineHeight: 1.08,
                    }}
                  >
                    {issue.title}
                  </Title>
                  <Paragraph
                    style={{
                      marginTop: 14,
                      marginBottom: 0,
                      color: "#506366",
                      fontSize: 15,
                      lineHeight: 1.82,
                    }}
                  >
                    {issue.summary}
                  </Paragraph>
                  <a
                    href={issue.href}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      marginTop: "auto",
                      paddingTop: 24,
                      color: "#0F5C6B",
                      fontSize: 14,
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    Read issue
                    <ArrowRightOutlined />
                  </a>
                </article>
              ))}
            </div>
          </section>

          <section
            style={{
              marginTop: isMobile ? 28 : 46,
              padding: isMobile ? "28px 18px" : "38px 32px",
              borderRadius: 32,
              border: "1px solid rgba(15, 92, 107, 0.08)",
            }}
          >
            <SectionLabel>Why We Created It</SectionLabel>
            <Title
              level={2}
              style={{
                maxWidth: 700,
                margin: 0,
                color: "#142225",
                fontFamily: SERIF_FONT,
                fontSize: isMobile ? 34 : 54,
                lineHeight: 1,
              }}
            >
              A calmer way to keep up with Ahangama.
            </Title>
            <Paragraph
              style={{
                maxWidth: 780,
                marginTop: 18,
                marginBottom: 0,
                color: "#44585B",
                fontSize: isMobile ? 16 : 18,
                lineHeight: 1.92,
              }}
            >
              Ahangama changes quickly. New cafes open, events appear,
              communities evolve and useful local knowledge often remains
              scattered across WhatsApp groups, Instagram posts and
              conversations.
            </Paragraph>
            <Paragraph
              style={{
                maxWidth: 780,
                marginTop: 16,
                marginBottom: 0,
                color: "#44585B",
                fontSize: isMobile ? 16 : 18,
                lineHeight: 1.92,
              }}
            >
              The Dispatch brings together the most useful updates each month
              into a single curated letter.
            </Paragraph>
            <Paragraph
              style={{
                maxWidth: 780,
                marginTop: 16,
                marginBottom: 0,
                color: "#0F5C6B",
                fontSize: isMobile ? 15 : 16,
                fontWeight: 600,
                lineHeight: 1.9,
              }}
            >
              No noise. No daily emails. Just one thoughtful update from
              Ahangama.
            </Paragraph>
          </section>

          <section
            style={{
              padding: isMobile ? "42px 0 0" : "60px 0 0",
            }}
          >
            <div
              style={{
                border: "1px solid rgba(15, 92, 107, 0.08)",
                borderRadius: 34,
                padding: isMobile ? 18 : 26,
              }}
            >
              <div style={{ maxWidth: 780, marginBottom: 20 }}>
                <SectionLabel>Join The Letter</SectionLabel>
                <Title
                  level={2}
                  style={{
                    margin: 0,
                    color: "#142225",
                    fontFamily: SERIF_FONT,
                    fontSize: isMobile ? 34 : 50,
                    lineHeight: 1,
                  }}
                >
                  Join The Ahangama Dispatch
                </Title>
                <Paragraph
                  style={{
                    marginTop: 16,
                    marginBottom: 0,
                    color: "#44585B",
                    fontSize: isMobile ? 16 : 18,
                    lineHeight: 1.88,
                  }}
                >
                  One monthly email covering the people, places, openings and
                  stories worth knowing.
                </Paragraph>
              </div>

              <NewsletterSignup
                variant="compact"
                source="newsletter_page_footer"
              />
            </div>
          </section>
        </main>
      </div>
    </SiteLayout>
  );
}