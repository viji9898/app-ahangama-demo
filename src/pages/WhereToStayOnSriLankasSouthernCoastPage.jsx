import React from "react";
import { Card, Col, Row, Space, Tag, Typography } from "antd";
import { ArrowRightOutlined, CheckOutlined } from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";
import EditorialNextArticle from "../components/ui/EditorialNextArticle";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { buildPassCtaUrl } from "../lib/passAttribution";
import ahangamaPassLogo from "../assets/ahangama-pass-logo.png";

const { Paragraph, Text, Title } = Typography;

export const WHERE_TO_STAY_ON_SRI_LANKAS_SOUTHERN_COAST_PATH =
  "/where-to-stay-on-sri-lankas-southern-coast";

const HERO_IMAGE =
  "https://images.suitcasemag.com/wp-content/uploads/2025/03/05163113/HERO2-TheFind-SouthCoastSriLanka.jpeg";
const NEXT_ARTICLE = {
  href: "/sri-lankas-most-interesting-coastal-town",
  kicker: "Discover More",
  title: "Sri Lanka's Most Interesting Coastal Town",
  image:
    "https://content.r9cdn.net/rimg/dimg/09/d4/c553223f-city-304822-172c638b4d6.jpg?crop=true&width=1366&height=768&xhint=1254&yhint=1207",
};
const PHOTO_GROUPS = [
  [
    "https://images.suitcasemag.com/wp-content/uploads/2025/03/12164550/Sola_425-copy.jpeg",
    "https://images.suitcasemag.com/wp-content/uploads/2025/03/12164547/Sola_045-copy.jpeg",
  ],
  [
    "https://i0.wp.com/images.suitcasemag.com/wp-content/uploads/2025/03/05162903/4-TheKip-SouthSriLankaHotels.jpeg?fit=1024%2C683&ssl=1",
  ],
  [
    "https://i0.wp.com/images.suitcasemag.com/wp-content/uploads/2025/03/05162919/8-Harding-SouthSriLankaHotels.jpeg?fit=1024%2C683&ssl=1",
  ],
  [
    "https://images.suitcasemag.com/wp-content/uploads/2025/03/05162855/2-TheFind-SouthSriLankaHotels.jpeg",
    "https://images.suitcasemag.com/wp-content/uploads/2025/03/05162858/3-TheFind-SouthSriLankaHotels.jpeg",
  ],
  [
    "https://i0.wp.com/images.suitcasemag.com/wp-content/uploads/2025/03/05162907/5-CasaTikiri-SouthSriLankaHotels.jpeg?fit=1024%2C683&ssl=1",
  ],
  [
    "https://images.suitcasemag.com/wp-content/uploads/2025/03/18160116/Trebartha-Daisy-Wingate-Saul-9234-copy.jpeg",
    "https://images.suitcasemag.com/wp-content/uploads/2025/03/18160112/Trebartha-stories-Daisy-Wingate-Saul-8685-copy.jpeg",
  ],
  [
    "https://images.suitcasemag.com/wp-content/uploads/2025/03/05162910/6-Palm-SouthSriLankaHotels.jpeg",
    "https://images.suitcasemag.com/wp-content/uploads/2025/03/05162914/7-Palm-SouthSriLankaHotels.jpeg",
  ],
  [
    "https://images.suitcasemag.com/wp-content/uploads/2025/03/05162923/9-Kurulu-SouthSriLankaHotels.jpeg",
    "https://images.suitcasemag.com/wp-content/uploads/2025/03/05162928/10-Kurulu-SouthSriLankaHotels.jpeg",
  ],
  [
    "https://i0.wp.com/images.suitcasemag.com/wp-content/uploads/2025/03/05162935/12-Mirhiri-SouthSriLankaHotels.jpeg?fit=1024%2C683&ssl=1",
  ],
  [
    "https://i0.wp.com/images.suitcasemag.com/wp-content/uploads/2025/03/05162932/11-Merchant-SouthSriLankaHotels.jpeg?fit=1024%2C683&ssl=1",
  ],
];

const articleIntroduction = [
  "A guide to the hotels, villas and retreats shaping a new chapter on Sri Lanka's south coast.",
  "A decade ago, travellers came to Sri Lanka's southern coast for surf, beaches and a handful of well-known hotels.",
  "Today, the region has evolved into one of Asia's most interesting hospitality destinations.",
  "Stretching from Galle to Ahangama and beyond, the coastline is now home to a new generation of independent hotels, villas and retreats that place design, community and a strong sense of place at the centre of the guest experience. Many are small. Most are owner-led. Almost all are deeply connected to the landscapes and communities that surround them.",
  "Unlike destinations shaped by international hotel groups, the south coast has largely been built by individuals.",
  "Architects, designers, surfers, chefs and entrepreneurs have restored colonial homes, transformed plantations and created entirely new concepts among coconut groves, paddy fields and jungle. The result is a hospitality scene that feels refreshingly personal.",
  "These are not simply places to sleep.",
  "They are places that help visitors understand the character of southern Sri Lanka.",
  "Whether you are looking for a lakeside retreat hidden among jungle, a design-led villa beside the surf, or a quiet guesthouse at the centre of Ahangama's creative community, the region offers a remarkable range of experiences.",
  "Here are some of the properties helping define the next chapter of Sri Lanka's southern coast.",
];

const articleSections = [
  {
    title: "The New Face of Southern Hospitality",
    body: [
      "What makes many of these hotels notable is not their scale but their perspective.",
      "Luxury here is increasingly understated.",
      "It is found in thoughtful architecture, natural materials, generous spaces and genuine hospitality rather than marble lobbies and grand entrances. Open-air bathrooms, hand-crafted furniture, local artwork and carefully sourced ingredients often matter more than thread counts and room service menus.",
      "Many properties have emerged from a similar philosophy.",
      "Build slowly.",
      "Work with local craftspeople.",
      "Respect the landscape.",
      "Create places that feel rooted rather than imported.",
      "That approach has become one of the defining characteristics of Ahangama and the wider southern coast.",
    ],
  },
  {
    title: "The Hotels Defining Ahangama",
    body: [
      "Among the most influential properties is The Kip.",
      "Opened in 2017, it arrived before Ahangama became the destination it is today. What began as a small guesthouse has evolved into something closer to a community hub. Guests arrive for beautifully designed rooms, excellent coffee and thoughtful hospitality, but often leave remembering the conversations, dinners, workshops and events that take place beneath the shade of the property's courtyard trees.",
      "The Kip helped establish a blueprint that many others have since followed: hospitality as community rather than simply accommodation.",
      "A few minutes away, Harding Boutique Hotel represents a different side of Ahangama's evolution.",
      "Rising above the surrounding palms, its clean architectural lines and polished concrete interiors marked a shift away from the bohemian aesthetic that once dominated the coast. Large windows frame uninterrupted views of the Indian Ocean while rooftop dining and carefully considered interiors position the hotel among the most design-conscious stays in town.",
      "At the southern end of Ahangama, The Find has quickly become one of the area's most recognisable properties.",
      "Its distinctive pink facade and playful interiors stand in contrast to the muted tones often associated with boutique hospitality. Yet beneath the visual confidence lies an intimate hotel carefully designed around comfort, personality and attention to detail. The property feels less like a conventional hotel and more like the home of an exceptionally creative host.",
      "For travellers seeking something quieter, Casa Tikiri offers a more secluded experience.",
      "Hidden behind tropical gardens and away from the coastal road, its seven rooms surround a relaxed pool area that encourages guests to slow down. Italian influences blend naturally with Sri Lankan hospitality, creating a property that feels both personal and deeply welcoming.",
      "Together, these hotels represent the diversity of Ahangama itself.",
      "No two are alike, yet each contributes to the town's evolving identity.",
    ],
  },
  {
    title: "Beyond the Coast Road",
    body: [
      "Some of the region's most memorable properties sit away from the ocean entirely.",
      "Inland from Ahangama, the landscape changes quickly.",
      "Rice paddies replace surf breaks. Cinnamon plantations stretch across rolling hills. Dense jungle creates a sense of seclusion only minutes from the coast.",
      "It is here that several of the region's most distinctive hotels can be found.",
      "Trebartha East occupies a hilltop surrounded by plantation land and forest.",
      "The circular architecture immediately sets it apart, but what makes the property remarkable is the relationship between building and landscape. Wide views extend across jungle and paddy fields while native timber, local artwork and natural materials create a sense of connection to the environment. It feels less like a hotel and more like a contemporary interpretation of a Sri Lankan estate.",
      "Palm Hotel follows a similarly thoughtful approach.",
      "Inspired by both industrial architecture and the tropical modernism associated with Geoffrey Bawa, the property combines dark metal structures with lush greenery. Black steel, concrete and glass create a striking visual identity, softened by palms, gardens and open spaces designed to blur the boundary between indoors and outdoors.",
      "The result feels contemporary without losing sight of its surroundings.",
    ],
  },
  {
    title: "Life Around the Lake",
    body: [
      "While much attention focuses on the coastline, Koggala Lake remains one of southern Sri Lanka's most beautiful landscapes.",
      "It is here that Kurulu Bay has established itself as one of the region's standout retreats.",
      "Spread across a substantial estate, the property embraces the wildness of its surroundings. Treehouses rise above the forest canopy. Villas and suites disappear into tropical vegetation. Monkeys move through the trees while birdlife fills the air from dawn until dusk.",
      "The atmosphere is entirely different from the beach.",
      "There are no surfboards leaning against walls or sunset crowds gathering for cocktails.",
      "Instead, guests find space, quiet and immersion in nature.",
      "The experience feels closer to a private estate than a traditional hotel.",
      "For travellers looking to disconnect from the energy of the coast while remaining within easy reach of Ahangama, it remains one of the strongest options available.",
    ],
  },
  {
    title: "A New Generation of Villas",
    body: [
      "Alongside boutique hotels, the southern coast has seen significant growth in private villas.",
      "Many have been designed specifically for travellers seeking longer stays, remote work flexibility or private group experiences.",
      "Among the most interesting recent additions is Mihira.",
      "Opened in 2025, the villa reflects a broader trend towards architecture that feels integrated with nature rather than imposed upon it.",
      "Bedrooms open directly onto tropical gardens. Outdoor bathrooms encourage a connection with the landscape. Soft, earthy interiors draw attention towards the surrounding greenery rather than competing with it.",
      "The property demonstrates how hospitality on the south coast continues to evolve.",
      "Visitors increasingly seek privacy, authenticity and a stronger connection to place.",
      "Properties like Mihira have emerged in response to that demand.",
    ],
  },
  {
    title: "The Appeal of Smaller Stays",
    body: [
      "Not every memorable hotel needs dramatic architecture or extensive facilities.",
      "Merchant House is proof of that.",
      "Set within a restored villa surrounded by mature gardens, the property offers something increasingly rare: simplicity.",
      "Rooms are elegant without being elaborate. Common spaces encourage conversation. Staff know guests by name.",
      "The experience feels closer to staying in a beautifully maintained private residence than checking into a hotel.",
      "For many travellers, that intimacy becomes one of the most memorable aspects of a visit.",
      "The property's enduring popularity reflects a wider truth about southern Sri Lanka.",
      "Character often matters more than scale.",
    ],
  },
  {
    title: "Why the South Coast Matters",
    body: [
      "The success of these hotels tells a larger story.",
      "Southern Sri Lanka is no longer simply a beach destination.",
      "It has become a place where architecture, design, food, wellness and hospitality intersect in increasingly sophisticated ways.",
      "Importantly, this evolution has happened without losing the qualities that made the region attractive in the first place.",
      "The surf remains world-class.",
      "The landscapes remain spectacular.",
      "The pace of life remains slow.",
      "What has changed is the quality and diversity of experiences available to visitors.",
      "Today, a traveller can spend the morning surfing at Kabalana, enjoy lunch at a chef-led restaurant, retreat to a jungle spa overlooking a lake, and finish the evening dining beneath the stars at a plantation estate.",
      "Few destinations offer such variety within such a compact area.",
      "That is what makes the southern coast special.",
      "And it is why Ahangama and its surrounding villages have become one of the most exciting places to stay not only in Sri Lanka, but anywhere in the Indian Ocean.",
      "The best hotels here do more than provide accommodation.",
      "They offer a window into a region that continues to evolve while remaining deeply connected to its landscape, culture and community.",
      "In a world increasingly filled with hotels that could exist almost anywhere, that sense of place is becoming the ultimate luxury.",
    ],
  },
];

const MENTIONED_PLACE_LINKS = [
  { label: "Ahangama", href: "https://www.google.com/search?q=Ahangama" },
  { label: "Galle", href: "https://www.google.com/search?q=Galle" },
  { label: "The Kip", href: "https://www.google.com/search?q=The+Kip+Ahangama" },
  { label: "Harding Boutique Hotel", href: "https://www.google.com/search?q=Harding+Boutique+Hotel+Ahangama" },
  { label: "The Find", href: "https://www.google.com/search?q=The+Find+Ahangama" },
  { label: "Casa Tikiri", href: "https://www.google.com/search?q=Casa+Tikiri+Ahangama" },
  { label: "Trebartha East", href: "https://www.google.com/search?q=Trebartha+East+Sri+Lanka" },
  { label: "Palm Hotel", href: "https://www.google.com/search?q=Palm+Hotel+Sri+Lanka" },
  { label: "Koggala Lake", href: "https://www.google.com/search?q=Koggala+Lake" },
  { label: "Kurulu Bay", href: "https://www.google.com/search?q=Kurulu+Bay+Sri+Lanka" },
  { label: "Mihira", href: "https://www.google.com/search?q=Mihira+villa+Sri+Lanka" },
  { label: "Merchant House", href: "https://www.google.com/search?q=Merchant+House+Sri+Lanka" },
  { label: "Kabalana", href: "https://www.google.com/search?q=Kabalana+Beach+Ahangama" },
].sort((left, right) => right.label.length - left.label.length);

function renderVenueLinkedText(text) {
  const matches = [];

  MENTIONED_PLACE_LINKS.forEach((link) => {
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

function EditorialPhotoBlock({ images, marginTop = 0 }) {
  const columnCount = images.length === 2 ? 2 : 1;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
        gap: 20,
        margin: `${marginTop}px 0 28px`,
      }}
    >
      {images.map((imageUrl, index) => (
        <div
          key={imageUrl}
          style={{
            overflow: "hidden",
            boxShadow: "0 16px 36px rgba(18,24,22,0.10)",
          }}
        >
          <img
            src={imageUrl}
            alt={`Southern coast stay guide photograph ${index + 1}`}
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              minHeight: images.length === 2 ? 320 : 420,
              objectFit: "cover",
              objectPosition: "center center",
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default function WhereToStayOnSriLankasSouthernCoastPage() {
  const canonical = absUrl(WHERE_TO_STAY_ON_SRI_LANKAS_SOUTHERN_COAST_PATH);
  const passCtaUrl = buildPassCtaUrl();

  return (
    <SiteLayout>
      <Seo
        title="Where to Stay on Sri Lanka's Southern Coast"
        description="A guide to the hotels, villas and retreats shaping a new chapter on Sri Lanka's south coast."
        canonical={canonical}
        ogImage={HERO_IMAGE}
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
            src={HERO_IMAGE}
            alt="Southern coast hotel scene in Sri Lanka"
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
            <div style={{ maxWidth: 860 }}>
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
                Where to Stay on Sri Lanka&apos;s Southern Coast
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
                Words by Julian.
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
                {renderVenueLinkedText(paragraph)}
              </Paragraph>
            ))}
          </div>

          <EditorialPhotoBlock images={PHOTO_GROUPS[0]} />

          <div style={{ display: "flex", flexDirection: "column" }}>
            {articleSections.map((section, index) => (
              <React.Fragment key={section.title}>
                <section
                  style={{
                    padding: index === 0 ? "20px 0 36px" : "36px 0",
                    borderTop:
                      index === 0 ? "none" : "1px solid rgba(47,62,58,0.12)",
                  }}
                >
                  <div style={{ maxWidth: 1180 }}>
                    <Title level={2} style={{ marginTop: 0, marginBottom: 18 }}>
                      {section.title}
                    </Title>

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
                        {renderVenueLinkedText(paragraph)}
                      </Paragraph>
                    ))}
                  </div>
                </section>

                {index === 0 ? <EditorialPhotoBlock images={PHOTO_GROUPS[1]} /> : null}
                {index === 1 ? <EditorialPhotoBlock images={PHOTO_GROUPS[2]} /> : null}
                {index === 1 ? <EditorialPhotoBlock images={PHOTO_GROUPS[3]} /> : null}
                {index === 1 ? <EditorialPhotoBlock images={PHOTO_GROUPS[4]} /> : null}
                {index === 2 ? <EditorialPhotoBlock images={PHOTO_GROUPS[5]} /> : null}
                {index === 2 ? <EditorialPhotoBlock images={PHOTO_GROUPS[6]} /> : null}
                {index === 3 ? <EditorialPhotoBlock images={PHOTO_GROUPS[7]} /> : null}
                {index === 4 ? <EditorialPhotoBlock images={PHOTO_GROUPS[8]} /> : null}
                {index === 5 ? <EditorialPhotoBlock images={PHOTO_GROUPS[9]} /> : null}
              </React.Fragment>
            ))}
          </div>

          <EditorialNextArticle
            href={NEXT_ARTICLE.href}
            kicker={NEXT_ARTICLE.kicker}
            title={NEXT_ARTICLE.title}
            image={NEXT_ARTICLE.image}
          />

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
                      Written by Julian
                    </Title>
                    <Paragraph
                      style={{
                        color: "#2F3E3A",
                        fontSize: 16,
                        lineHeight: 1.8,
                        marginBottom: 0,
                      }}
                    >
                      A guide to the hotels, villas, and retreats shaping a new
                      chapter on Sri Lanka&apos;s south coast.
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
                      Savings across stays, cafes, wellness spaces, and the daily
                      places that shape life on the south coast.
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