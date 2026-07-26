import React from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import EditorialNextArticle from "../components/ui/EditorialNextArticle";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";

const { Paragraph, Text, Title } = Typography;

export const INSIDE_AHANGAMA_CIRCLE_LAUNCH_PATH =
  "/inside-the-launch-of-ahangama-circle";

const BASE_IMAGE_URL =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/inside-the-launch-of-ahangama-circle";

const HERO_IMAGE = `${BASE_IMAGE_URL}/hero+-+Guests+networking+at+Surf+Club+Midigama+during+sunset+-+Option+01+.jpeg`;
const SUNSET_IMAGE = `${BASE_IMAGE_URL}/Sunset+at+Surf+Club+with+guests+mingling.jpg.jpg`;
const WELCOME_DRINKS_IMAGE = `${BASE_IMAGE_URL}/Guests+enjoying+welcome+drinks.jpg.jpg`;
const BUSINESS_OWNERS_IMAGE = `${BASE_IMAGE_URL}/Business+Owners+Chatting+.jpeg`;
const NETWORKING_IMAGE = `${BASE_IMAGE_URL}/Small+groups+networking+around+tables++standing+with+drinks.jpg.jpg`;
const AUDIENCE_IMAGE = `${BASE_IMAGE_URL}/Audience+Listening+.jpeg`;
const TEAM_IMAGE = `${BASE_IMAGE_URL}/Ahangama+team+introducing+ahangama+circle+.jpeg`;
const WELCOME_ADDRESS_IMAGE = `${BASE_IMAGE_URL}/Welcome+address+audience+watching+the+presentation+.jpeg`;
const GROUP_IMAGE = `${BASE_IMAGE_URL}/Last-image-wide-Official+group+photo+of+all+attendees.jpg`;

const publishDate = "2026-07-26T09:00:00.000Z";

const NEXT_ARTICLE = {
  href: "/community-market-in-ahangama",
  kicker: "Read Next",
  title: "Community Markets in Ahangama",
  image: NETWORKING_IMAGE,
};

const LINKED_TERMS = [
  {
    label: "launch of Ahangama Circle",
    href: "http://circle.ahangama.com/join",
  },
  {
    label: "Ahangama Circle",
    href: "https://circle.ahangama.com/",
  },
  {
    label: "The Ahangama Pass",
    href: "https://pass.ahangama.com/",
  },
  { label: "Ahangama.com", href: "http://ahangama.com" },
  { label: "Mana Villa", href: "https://mana-ahangama.com/" },
  {
    label: "Surf Club",
    href: "https://www.instagram.com/surfclubmidigama/",
  },
  { label: "Midigama", href: "https://share.google/jGw9gzxE7yEeVLH6E" },
  { label: "Ahangama", href: "https://en.wikipedia.org/wiki/Ahangama" },
];

const FEATURED_VENUES = [
  {
    label: "Surf Club Midigama",
    href: "https://www.instagram.com/surfclubmidigama/",
    note: "The sunset setting for Ahangama Circle's first gathering.",
  },
  {
    label: "Ahangama Circle",
    href: "https://circle.ahangama.com/",
    note: "A private network connecting the south's business community.",
  },
  {
    label: "Ahangama Pass",
    href: "https://pass.ahangama.com/",
    note: "Local discovery, experiences and offers for visitors to Ahangama.",
  },
  {
    label: "Mana Villa",
    href: "https://mana-ahangama.com/",
    note: "One of the local partners introduced during the launch presentation.",
  },
];

const articleSections = [
  {
    title: "Ahangama Circle Launches to Unite the South's Business Community",
    body: [
      "As the sun began to set over Midigama, Surf Club slowly filled with familiar faces and new introductions. Hotel owners, cafe founders, wellness operators, creatives, and local entrepreneurs gathered for the launch of Ahangama Circle, a new network created to bring the south's business community closer together.",
      "The evening wasn't about formal networking or business pitches. It was about creating a space where local businesses could meet, exchange ideas, and discover ways to support one another.",
      "For many, it was the first time meeting businesses they'd often heard about but never had the chance to connect with in person.",
    ],
  },
  {
    title: "Why Ahangama Circle?",
    body: [
      "Over the past few years, Ahangama has become one of Sri Lanka's most exciting destinations. New hotels continue to open, cafes are thriving, wellness experiences are expanding, and creative businesses are helping shape the area's unique character.",
      "While the destination has grown quickly, opportunities for local businesses to connect haven't always kept pace.",
      "Ahangama Circle was created to help change that.",
      "The idea is simple: bring together the people behind local businesses, encourage genuine connections, and create opportunities to collaborate instead of working in isolation.",
      "Whether it's recommending another business, planning a joint promotion, or simply knowing who to call when you need something, stronger local relationships benefit everyone.",
    ],
  },
  {
    title: "An Evening of Connection",
    body: [
      "After guests arrived and settled in with welcome drinks, the Ahangama Pass team introduced the vision behind Ahangama Circle and how it fits within the wider Ahangama.com platform.",
      "Rather than focusing only on membership, the presentation explored the bigger picture: how a connected business community can create better experiences for visitors while helping local businesses grow together.",
    ],
  },
];

const questions = [
  {
    title: "What is the difference between Ahangama Circle and the Ahangama Pass?",
    body: [
      "While the two are closely connected, they serve different purposes.",
      "Ahangama Circle is a private community that brings together business owners, entrepreneurs, creatives, and residents through networking events, partnerships, exclusive member benefits, and opportunities to collaborate.",
      "The Ahangama Pass, on the other hand, is part of the wider Ahangama.com platform. It helps visitors discover local businesses, events, experiences, and exclusive offers while encouraging them to explore more of the destination.",
    ],
  },
  {
    title: "Who can become a member of Ahangama Circle?",
    body: [
      "Ahangama Circle is open to local business owners, entrepreneurs, creatives, hospitality operators, and anyone who wants to play an active role in building a stronger local business community.",
      "The aim is to create a diverse network where members can share knowledge, support one another, and create meaningful partnerships.",
    ],
  },
  {
    title: "How much does membership cost?",
    body: [
      "Although Ahangama Circle membership is normally valued at US$250 per year, everyone who attended the launch was invited to join free of charge for one year.",
      "It was the team's way of thanking the businesses that supported the launch and recognising those who are helping shape the community from the very beginning.",
    ],
  },
  {
    title: "What benefits do members receive?",
    body: [
      "Members gain access to a growing range of exclusive partner offers, invitations to networking events, curated local recommendations, concierge support, early access to new partner launches, and unique experiences across Ahangama.",
      "As the community continues to grow, so will the range of benefits available to members.",
    ],
  },
  {
    title: "What kind of partner offers can members expect?",
    body: [
      "During the presentation, several examples were shared to demonstrate the value of membership.",
      "These included wellness offers at Mana Villa, discounts at cafes and yoga studios, complimentary surf sessions with partner schools, and 2-for-1 dining offers at selected restaurants.",
      "The idea is simple: members enjoy exclusive benefits while supporting local businesses within the community.",
    ],
  },
  {
    title: "How do you become a member?",
    body: [
      "Joining Ahangama Circle is straightforward.",
      "Members simply register online, receive their digital membership pass, and can immediately begin enjoying exclusive benefits at participating partner venues while becoming part of the growing Ahangama Circle community.",
    ],
  },
  {
    title: "What's next for Ahangama Circle?",
    body: [
      "The conversation concluded by looking ahead.",
      "Attendees shared ideas for future networking events, collaborative promotions, educational workshops, and community initiatives that would continue bringing local businesses together.",
      "It was a fitting end to the evening and a reminder that Ahangama Circle is intended to be an ongoing community, not just a one-off event.",
    ],
  },
];

const closingSections = [
  {
    title: "More Than a Networking Event",
    body: [
      "As the presentations came to an end, the conversations carried on.",
      "With the sun setting over Midigama, guests gathered outside with cocktails, continuing discussions that had started earlier in the evening.",
      "Some were exchanging contact details. Others were already talking about future collaborations.",
      "Small clusters formed around the terrace as the evening wound down, each one deep in conversation about ideas that had come up over the course of the launch.",
      "It was a reminder that some of the most valuable business connections happen not on a stage, but in the moments in between.",
      "New introductions quickly turned into genuine business conversations, and the relaxed atmosphere made those connections feel natural rather than forced.",
      "By the time the last drinks were poured, it was clear the evening had done exactly what it set out to do: bring people together and let the connections form on their own.",
    ],
    quote:
      "There was a real appetite for a space where local businesses could meet regularly, learn from one another, and build lasting relationships.",
    afterQuote:
      "By the end of the evening, it was clear there was a real appetite for a space where local businesses could meet regularly, learn from one another, and build lasting relationships.",
  },
  {
    title: "Looking Ahead",
    body: [
      "The launch marks the beginning of what Ahangama Circle hopes will become a growing network of local businesses across Sri Lanka's south.",
      "Future plans include regular networking events, collaborative promotions, and opportunities for businesses to connect throughout the year.",
      "By bringing together hospitality operators, retailers, wellness providers, creatives, tour operators, and entrepreneurs, Ahangama Circle aims to strengthen the local business community while helping the destination continue to grow in a sustainable way.",
      "To everyone who joined us for the launch at Surf Club Midigama, thank you for being part of the very first gathering.",
      "We're looking forward to seeing where these new conversations, and new partnerships, lead.",
    ],
  },
];

function renderLinkedText(text) {
  const matches = [];

  [...LINKED_TERMS]
    .sort((left, right) => right.label.length - left.label.length)
    .forEach((link) => {
      let searchIndex = 0;

      while (searchIndex < text.length) {
        const foundIndex = text.indexOf(link.label, searchIndex);
        if (foundIndex === -1) break;

        const overlaps = matches.some(
          (match) =>
            foundIndex < match.end &&
            foundIndex + link.label.length > match.start,
        );

        if (!overlaps) {
          matches.push({
            ...link,
            start: foundIndex,
            end: foundIndex + link.label.length,
          });
        }

        searchIndex = foundIndex + link.label.length;
      }
    });

  if (!matches.length) return text;

  matches.sort((left, right) => left.start - right.start);
  const segments = [];
  let cursor = 0;

  matches.forEach((match) => {
    if (cursor < match.start) segments.push(text.slice(cursor, match.start));

    segments.push(
      <a
        key={`${match.label}-${match.start}`}
        href={match.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "#2f2a24",
          textDecoration: "none",
          borderBottom: "1px solid rgba(214, 178, 102, 0.9)",
          paddingBottom: 1,
        }}
      >
        {match.label}
      </a>,
    );
    cursor = match.end;
  });

  if (cursor < text.length) segments.push(text.slice(cursor));
  return segments;
}

function ArticleParagraph({ children }) {
  return (
    <Paragraph
      style={{
        maxWidth: 1200,
        fontSize: 16,
        lineHeight: 1.8,
        color: "#55514B",
        marginBottom: 18,
      }}
    >
      {renderLinkedText(children)}
    </Paragraph>
  );
}

function ArticleSection({ section, first = false }) {
  return (
    <section
      style={{
        padding: first ? "20px 0 36px" : "36px 0",
        borderTop: first ? "none" : "1px solid rgba(47,62,58,0.12)",
      }}
    >
      <div style={{ maxWidth: 1180 }}>
        <Title level={2} style={{ marginTop: 0, marginBottom: 18 }}>
          {section.title}
        </Title>
        {section.body.map((paragraph) => (
          <ArticleParagraph key={paragraph}>{paragraph}</ArticleParagraph>
        ))}
        {section.quote ? (
          <blockquote
            style={{
              margin: "8px 0 22px",
              padding: "18px 22px",
              borderLeft: "3px solid rgba(107,90,78,0.4)",
              background: "rgba(255,255,255,0.72)",
              color: "#55514B",
              fontSize: 18,
              lineHeight: 1.8,
            }}
          >
            {section.quote}
          </blockquote>
        ) : null}
        {section.afterQuote ? (
          <ArticleParagraph>{section.afterQuote}</ArticleParagraph>
        ) : null}
      </div>
    </section>
  );
}

function WideImage({ src, alt, objectPosition = "center center" }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 1400,
        margin: "8px auto 28px",
        aspectRatio: "3 / 2",
        overflow: "hidden",
        boxShadow: "0 16px 40px rgba(18,24,22,0.12)",
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition,
        }}
      />
    </div>
  );
}

function ImagePair({ images }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
        gap: 24,
        margin: "0 auto 28px",
        width: "100%",
        maxWidth: 1224,
      }}
    >
      {images.map((image) => (
        <img
          key={image.src}
          src={image.src}
          alt={image.alt}
          style={{
            display: "block",
            width: "100%",
            aspectRatio: "4 / 5",
            objectFit: "cover",
            objectPosition: image.objectPosition || "center center",
            boxShadow: "0 16px 36px rgba(18,24,22,0.10)",
          }}
        />
      ))}
    </div>
  );
}

export default function InsideTheLaunchOfAhangamaCirclePage() {
  const canonical = absUrl(INSIDE_AHANGAMA_CIRCLE_LAUNCH_PATH);

  return (
    <SiteLayout navOverlayHero>
      <Seo
        title="Inside the Launch of Ahangama Circle"
        description="Inside the first Ahangama Circle gathering, where the south's business owners, creatives and hospitality community came together at Surf Club Midigama."
        canonical={canonical}
        ogImage={HERO_IMAGE}
        ogType="article"
        author="Ahangama Guide Editorial Team"
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
                      "linear-gradient(90deg, rgba(10,14,18,0.82) 0%, rgba(10,14,18,0.7) 23%, rgba(10,14,18,0.42) 45%, rgba(10,14,18,0.12) 68%, rgba(10,14,18,0) 100%)",
                    pointerEvents: "none",
                    zIndex: 2,
                  }}
                />
                <img
                  className="home-hero-image"
                  src={HERO_IMAGE}
                  alt="Guests networking at Surf Club Midigama during sunset"
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
                    maxWidth: 740,
                    padding:
                      "clamp(44px, 5vw, 68px) clamp(32px, 4.8vw, 72px) 36px",
                  }}
                >
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
                    {["Community", "Ahangama Editorial"].map((item) => (
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
                    <span className="home-hero-titleLine" style={{ color: "#FFFFFF" }}>
                      Inside the
                    </span>
                    <span className="home-hero-titleLine" style={{ color: "#FFFFFF" }}>
                      Launch of
                    </span>
                    <span className="home-hero-titleLine" style={{ color: "#FFFFFF" }}>
                      Ahangama
                    </span>
                    <span className="home-hero-titleLine" style={{ color: "#FFFFFF" }}>
                      Circle
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
                    From the Editor
                  </Text>

                  <Paragraph
                    style={{
                      marginTop: 24,
                      marginBottom: 22,
                      maxWidth: 600,
                      color: "#FFFFFF",
                      fontSize: "clamp(16px, 1.45vw, 19px)",
                      lineHeight: 1.72,
                    }}
                  >
                    A first look at the gathering created to bring the south's
                    business community closer together.
                  </Paragraph>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dm-wrap" style={{ paddingTop: 28 }}>
          <ArticleSection section={articleSections[0]} first />
          <ArticleSection section={articleSections[1]} />

          <WideImage
            src={WELCOME_ADDRESS_IMAGE}
            alt="Audience watching the welcome address at the Ahangama Circle launch"
          />

          <ArticleSection section={articleSections[2]} />

          <ImagePair
            images={[
              {
                src: TEAM_IMAGE,
                alt: "Ahangama team introducing Ahangama Circle",
              },
              {
                src: AUDIENCE_IMAGE,
                alt: "Audience listening during the Ahangama Circle presentation",
              },
            ]}
          />

          <section style={{ padding: "36px 0", borderTop: "1px solid rgba(47,62,58,0.12)" }}>
            <div style={{ maxWidth: 1180 }}>
              <Title level={2} style={{ marginTop: 0, marginBottom: 18 }}>
                Conversations That Matter
              </Title>
              <ArticleParagraph>
                One of the most engaging parts of the evening was the open Q&amp;A
                session, where attendees had the opportunity to ask questions,
                share ideas, and learn more about Ahangama Circle. The discussion
                covered everything from membership and partner benefits to the
                long-term vision for the community.
              </ArticleParagraph>

              {questions.map((question) => (
                <div key={question.title} style={{ marginTop: 30 }}>
                  <Title level={3} style={{ marginBottom: 14, fontSize: 22 }}>
                    {question.title}
                  </Title>
                  {question.body.map((paragraph) => (
                    <ArticleParagraph key={paragraph}>{paragraph}</ArticleParagraph>
                  ))}
                </div>
              ))}
            </div>
          </section>

          <WideImage
            src={NETWORKING_IMAGE}
            alt="Small groups networking around tables with drinks"
          />

          <ImagePair
            images={[
              {
                src: BUSINESS_OWNERS_IMAGE,
                alt: "Business owners chatting at the Ahangama Circle launch",
              },
              {
                src: WELCOME_DRINKS_IMAGE,
                alt: "Guests enjoying welcome drinks at Surf Club Midigama",
              },
            ]}
          />

          <ArticleSection section={closingSections[0]} />

          <WideImage
            src={SUNSET_IMAGE}
            alt="Sunset at Surf Club Midigama with guests mingling"
          />

          <ArticleSection section={closingSections[1]} />

          <WideImage
            src={GROUP_IMAGE}
            alt="The founding members of Ahangama Circle in an official group photo"
          />

          <section
            style={{
              margin: "22px 0 34px",
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

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "14px 22px",
              }}
            >
              {FEATURED_VENUES.map((venue) => (
                <div
                  key={venue.label}
                  style={{
                    paddingTop: 10,
                    borderTop: "1px solid rgba(47,62,58,0.08)",
                  }}
                >
                  <a
                    href={venue.href}
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
                    {venue.label}
                    <ArrowRightOutlined style={{ fontSize: 11 }} />
                  </a>
                  <Text
                    style={{
                      display: "block",
                      marginTop: 7,
                      color: "#55514B",
                      fontSize: 13,
                      lineHeight: 1.55,
                    }}
                  >
                    {venue.note}
                  </Text>
                </div>
              ))}
            </div>
          </section>

          <EditorialNextArticle
            href={NEXT_ARTICLE.href}
            kicker={NEXT_ARTICLE.kicker}
            title={NEXT_ARTICLE.title}
            image={NEXT_ARTICLE.image}
          />
        </div>
      </div>
    </SiteLayout>
  );
}