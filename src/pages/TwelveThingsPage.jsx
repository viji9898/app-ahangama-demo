import React from "react";
import { Card, Col, Row, Space, Tag, Typography } from "antd";
import { ArrowRightOutlined, CheckOutlined } from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { buildPassCtaUrl } from "../lib/passAttribution";
import ahangamaPassLogo from "../assets/ahangama-pass-logo.png";
import kaffiImage from "../assets/temp/kaffi_image.jpg";
import sistersImage from "../assets/temp/sisters_image.jpg";

const { Paragraph, Text, Title } = Typography;

function slugifyInstagramPath(label) {
  return label
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

const articleIntroduction = [
  "There are places you visit and places you settle into.",
  "Ahangama belongs firmly in the latter category.",
  "At first glance it appears to be another surf town stretched along Sri Lanka's southern coastline. Spend a little longer here, however, and a more nuanced picture emerges. Between the railway tracks and the Indian Ocean is a community of surfers, founders, artists, designers, wellness practitioners and local families who have collectively shaped one of the island's most interesting destinations.",
  "The best way to understand Ahangama isn't through a checklist of attractions. It's through the rituals that define daily life.",
];

const experiences = [
  {
    title: "Start the Day Before Everyone Else",
    body: [
      "The town reveals itself early.",
      "By sunrise, surfers are already paddling out at Marshmallow and Kabalana while fishermen prepare their boats along the shoreline. The train rattles through town, dogs wander the beach and the first coffees are being poured.",
      "Many residents begin the morning at Kaffi, Sisters or Makai, where conversations drift between wave forecasts, new restaurant openings and plans for the day ahead.",
      "Arrive before 7am and you'll experience a quieter Ahangama that many visitors never see.",
    ],
  },
  {
    title: "Understand Why Surfing Changed Everything",
    body: [
      "Modern Ahangama owes much of its identity to the ocean.",
      "The reefs around Marshmallow, The Rock and Kabalana have attracted surfers from around the world for years. Yet the waves themselves only tell part of the story.",
      "The surf community helped establish many of the cafes, guesthouses and creative businesses that now define the town. What began as a surf destination gradually evolved into a place where people chose to build lives.",
      "Even those who never enter the water are, in many ways, experiencing a town shaped by surfing.",
    ],
  },
  {
    title: "Spend a Morning Moving Between Cafes",
    body: [
      "Ahangama's cafe culture has become part of its identity.",
      "What makes the scene interesting is its diversity. Some venues function as informal co-working spaces, others as neighbourhood meeting points.",
      "You might find remote workers settled into Focus Hub before breakfast, friends gathering at Follow The White Rabbit, or long conversations unfolding beneath the trees at Veda Cafe.",
      "At Sisters and Makai, tables fill with a mix of travellers and residents, while Kaffi has become something of a community living room.",
      "The best approach is not to choose one.",
      "Spend a morning moving between several.",
    ],
  },
  {
    title: "Follow the Wellness Trail",
    body: [
      "Wellness here feels less performative than in many destinations.",
      "Pilates classes at Pura Pilates, recovery sessions at Frosty's, treatments at White Lotus and quiet afternoons at The Nuga House have become part of everyday life for many residents.",
      "What is striking is how integrated wellness has become into the rhythm of the town. Surfers finish sessions in the water and head directly to an ice bath. Entrepreneurs schedule meetings around Pilates classes. Long-term residents build entire routines around movement and recovery.",
      "The result is a culture that feels sustainable rather than indulgent.",
    ],
  },
  {
    title: "Meet the Creative Community",
    body: [
      "Ahangama attracts an unusual concentration of creative people.",
      "Designers, photographers, filmmakers and founders have increasingly chosen the south coast over larger cities.",
      "This influence can be seen throughout the town. Studio Mukti produces clothing inspired by slow living and ethical production. Living Room Concept Store showcases a curated collection of objects, furniture and design pieces. Small creative projects appear regularly in converted villas, cafes and retail spaces.",
      "Many visitors arrive expecting a surf town and discover something closer to a creative village.",
    ],
  },
  {
    title: "Discover the Shops Shaping Modern Ahangama",
    body: [
      "Independent retail has become one of Ahangama's quiet strengths.",
      "Stores such as Studio Mukti, Living Room Concept Store and Coconut Republik offer an alternative to the souvenir shops found elsewhere along the coast.",
      "Many products are designed, produced or curated by people who live locally. As a result, shopping here often feels more like a conversation than a transaction.",
      "Spend enough time browsing and you'll inevitably learn something about the people behind the town.",
    ],
  },
  {
    title: "Join a Game at Coconut Court",
    body: [
      "Every community has a gathering place.",
      "In Ahangama, Coconut Court has become one of them.",
      "What began as a sporting venue has evolved into something much larger. On any given evening the courts bring together locals, long-term residents, visiting surfers, entrepreneurs and curious first-time players.",
      "The popularity of pickleball says something about Ahangama itself. People come for the activity but stay for the community.",
    ],
  },
  {
    title: "Eat Beyond the Instagram Posts",
    body: [
      "The most photographed restaurants rarely tell the whole story.",
      "While venues such as Maria Bonita, Le Cafe French Bistro, Hakuna Matata and Tahini & Friends have become favourites among visitors, some of the town's most memorable meals happen elsewhere.",
      "Ask residents where they eat regularly and you'll discover a constantly evolving list that includes everything from roadside rice-and-curry shops to small family-run kitchens hidden behind the main road.",
      "The best meals often arrive with no online reservation system and very little publicity.",
    ],
  },
  {
    title: "Explore Inland",
    body: [
      "Most visitors spend their time between the railway tracks and the ocean.",
      "The inland roads reveal a different side of Ahangama.",
      "Within minutes the landscape shifts to paddy fields, cinnamon estates and village temples. Scooters weave through narrow roads lined with tropical vegetation while daily life unfolds largely unchanged from generations before.",
      "This contrast is one of the town's greatest strengths.",
      "The contemporary and traditional sit side by side.",
    ],
  },
  {
    title: "Follow the Afternoon Rhythm",
    body: [
      "By late afternoon the pace changes.",
      "People drift between meetings, surf sessions and coffee stops. Friends gather at Veda Cafe, Follow The White Rabbit or Makai. Others settle into a quiet corner of Focus Hub to finish work before sunset.",
      "Unlike many resort destinations, Ahangama feels lived in throughout the day.",
      "There is no clear separation between visitor and resident life.",
    ],
  },
  {
    title: "Stay for Sunset",
    body: [
      "The sunset remains one of Ahangama's great democratic experiences.",
      "There are no ticket booths or designated viewing platforms.",
      "Some people watch from the beach. Others from a cafe terrace or a wall beside the railway tracks.",
      "The location matters less than the ritual itself.",
      "Almost everyone seems to pause.",
    ],
  },
  {
    title: "Stay Long Enough to Understand the Place",
    body: [
      "The most common mistake visitors make is leaving too quickly.",
      "Ahangama reveals itself in layers.",
      "The first few days are spent discovering beaches and cafes. A week later you begin recognising faces. After two weeks, familiar routines emerge. By the end of a month, the owner of your local cafe knows your order, the surf instructor waves as he cycles past and conversations become easier.",
      "It is this sense of familiarity that keeps people returning.",
      "Not a single venue, wave or attraction.",
      "The feeling that, for a short while at least, Ahangama starts to feel like home.",
    ],
  },
];

const MENTIONED_PLACE_LINKS = [
  "Kaffi",
  "Sisters",
  "Makai",
  "Focus Hub",
  "Follow The White Rabbit",
  "Veda Cafe",
  "Pura Pilates",
  "Frosty's",
  "White Lotus",
  "The Nuga House",
  "Studio Mukti",
  "Living Room Concept Store",
  "Coconut Republik",
  "Maria Bonita",
  "Le Cafe French Bistro",
  "Hakuna Matata",
  "Tahini & Friends",
  "Coconut Court",
  "Marshmallow",
  "Kabalana",
  "The Rock",
].map((label) => ({
  label,
  href: `https://instagram.com/${slugifyInstagramPath(label)}`,
}));

function renderVenueLinkedText(text) {
  const sortedLinks = [...MENTIONED_PLACE_LINKS].sort(
    (left, right) => right.label.length - left.label.length,
  );
  const matches = [];

  sortedLinks.forEach((link) => {
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
    if (cursor < match.start) {
      segments.push(text.slice(cursor, match.start));
    }

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

  if (cursor < text.length) {
    segments.push(text.slice(cursor));
  }

  return segments;
}

export default function TwelveThingsPage() {
  const canonical = absUrl("/12-things");
  const passCtaUrl = buildPassCtaUrl();
  const heroImage =
    "https://sunshinestories.com/wp-content/uploads/2016/08/Sunshinestories-surf-travel-blog-IMG_8420.jpg";

  return (
    <SiteLayout>
      <Seo
        title="12 Ways to Experience Ahangama"
        description="An editorial guide to Ahangama through surf, cafes, wellness, creative community, inland rituals and the routines that define daily life."
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

              <Text
                style={{
                  display: "block",
                  marginTop: 14,
                  color: "rgba(255,255,255,0.82)",
                  fontSize: 12,
                  letterSpacing: 0.2,
                }}
              >
                Photo credits: Petter & Linn By{" "}
                <a
                  href="https://www.instagram.com/sodalime_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#ffffff",
                    textDecoration: "none",
                    borderBottom: "1px solid rgba(255,255,255,0.45)",
                  }}
                >
                  Sodalime
                </a>
                .
              </Text>
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
                src="https://lapoint.b-cdn.net/image/6y1MM4z6vMOdvGqJIY3lmr/9f21893c37bc0fbfd8f62baa1c953727/The-ultimate-surf-guide-to-Sri-Lanka-Ahangama.jpg?fm=jpg&fl=progressive&w=1920&q=75"
                alt="Surf scene in Ahangama"
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

          <div style={{ display: "flex", flexDirection: "column" }}>
            {experiences.map((item, index) => (
              <React.Fragment key={item.title}>
                {index === 1 ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: 24,
                      margin: "0 auto 28px",
                      width: "100%",
                      maxWidth: 1224,
                    }}
                  >
                    <img
                      src={kaffiImage}
                      alt="Kaffi in Ahangama"
                      style={{
                        display: "block",
                        width: "100%",
                        maxWidth: 600,
                        aspectRatio: "4 / 5",
                        objectFit: "cover",
                        boxShadow: "0 16px 36px rgba(18,24,22,0.10)",
                      }}
                    />
                    <img
                      src={sistersImage}
                      alt="Sisters in Ahangama"
                      style={{
                        display: "block",
                        width: "100%",
                        maxWidth: 600,
                        aspectRatio: "4 / 5",
                        objectFit: "cover",
                        boxShadow: "0 16px 36px rgba(18,24,22,0.10)",
                      }}
                    />
                  </div>
                ) : null}

                <section
                  style={{
                    padding: index === 0 ? "20px 0 36px" : "36px 0",
                    borderTop:
                      index === 0 ? "none" : "1px solid rgba(47,62,58,0.12)",
                  }}
                >
                  <div style={{ maxWidth: 1180 }}>
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
                        {renderVenueLinkedText(paragraph)}
                      </Paragraph>
                    ))}
                  </div>
                </section>
              </React.Fragment>
            ))}
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
