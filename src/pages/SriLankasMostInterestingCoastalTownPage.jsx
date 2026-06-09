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

export const SRI_LANKAS_MOST_INTERESTING_COASTAL_TOWN_PATH =
  "/sri-lankas-most-interesting-coastal-town";

const HERO_IMAGE =
  "https://content.r9cdn.net/rimg/dimg/09/d4/c553223f-city-304822-172c638b4d6.jpg?crop=true&width=1366&height=768&xhint=1254&yhint=1207";
const FEATURE_IMAGE =
  "https://www.thechaosdiaries.com/wp-content/uploads/2026/02/DSCF9566-2-scaled.webp";
const PHOTO_ESSAY_GROUPS = [
  [
    "https://images.suitcasemag.com/wp-content/uploads/2025/05/01113502/1-AhanagamaGuide-SriLanka.jpeg",
    "https://images.suitcasemag.com/wp-content/uploads/2025/05/01113505/2-AhanagamaGuide-SriLanka.jpeg",
  ],
  [
    "https://images.suitcasemag.com/wp-content/uploads/2025/05/01113508/3-AhanagamaGuide-SriLanka.jpeg",
    "https://images.suitcasemag.com/wp-content/uploads/2025/05/01113511/4-AhanagamaGuide-SriLanka.jpeg",
    "https://images.suitcasemag.com/wp-content/uploads/2025/05/01113514/5-AhanagamaGuide-SriLanka.jpeg",
  ],
  [
    "https://images.suitcasemag.com/wp-content/uploads/2025/05/01113517/6-AhanagamaGuide-SriLanka.jpeg",
    "https://images.suitcasemag.com/wp-content/uploads/2025/05/01113520/7-AhanagamaGuide-SriLanka.jpeg",
    "https://images.suitcasemag.com/wp-content/uploads/2025/05/01113523/8-AhanagamaGuide-SriLanka.jpeg",
  ],
  [
    "https://i0.wp.com/images.suitcasemag.com/wp-content/uploads/2025/05/01113527/9-AhanagamaGuide-SriLanka.jpeg?fit=1024%2C683&ssl=1",
    "https://images.suitcasemag.com/wp-content/uploads/2025/05/01113530/10-AhanagamaGuide-SriLanka.jpeg",
    "https://images.suitcasemag.com/wp-content/uploads/2025/05/01113533/11-AhanagamaGuide-SriLanka.jpeg",
  ],
  [
    "https://images.suitcasemag.com/wp-content/uploads/2025/05/01113536/12-AhanagamaGuide-SriLanka.jpeg",
    "https://images.suitcasemag.com/wp-content/uploads/2025/05/01113539/13-AhanagamaGuide-SriLanka.jpeg",
    "https://images.suitcasemag.com/wp-content/uploads/2025/05/01113542/14-AhanagamaGuide-SriLanka.jpeg",
    "https://images.suitcasemag.com/wp-content/uploads/2025/05/01113546/15-AhanagamaGuide-SriLanka.jpeg",
  ],
];
const NEXT_ARTICLE = {
  href: "/why-surfing-changed-everything-in-ahangama",
  kicker: "Discover More",
  title: "Why Surfing Changed Everything in Ahangama",
  image: "https://images.pexels.com/photos/19065606/pexels-photo-19065606.jpeg",
};

const articleIntroduction = [
  "Follow Sri Lanka's southern coastal road and, somewhere between the larger tourism hubs of Weligama and Galle, you'll arrive in Ahangama.",
  "At first glance, it may not appear particularly remarkable. The town stretches loosely along the coastline, a ribbon of cafes, guesthouses, surf shops and homes stitched together by the A2 highway. Buses thunder through the centre. Tuk-tuks weave between scooters. Local fishermen sort their nets in the shade.",
  "Yet spend a few days here and a different picture begins to emerge.",
  "Ahangama has quietly become one of the most interesting destinations in Sri Lanka. What was once primarily known among surfers for its reef breaks is now attracting a broader community of travellers, entrepreneurs, creatives, wellness practitioners and hospitality operators who have chosen not simply to visit, but to stay.",
  "The result is a place that feels different from many other coastal destinations across Asia.",
  "There are no sprawling beach clubs dominating the shoreline. No luxury hotel compounds separating visitors from local life. No master-planned tourism district attempting to manufacture culture.",
  "Instead, Ahangama feels organic.",
];

const articleSections = [
  {
    title: "Growth Happened Gradually",
    body: [
      "Growth has happened gradually, shaped by individuals rather than corporations, and by small businesses rather than large developments. New cafes sit beside family-run grocery stores. Boutique hotels occupy restored villas hidden among coconut groves. Surf schools share the coastline with fishing communities whose connection to the ocean stretches back generations.",
      "The town's appeal lies not in any single attraction, but in the way all these elements come together.",
    ],
  },
  {
    title: "A Place Built Around the Ocean",
    body: [
      "Modern Ahangama owes much of its identity to the sea.",
      "Long before the arrival of boutique hotels and wellness retreats, surfers were discovering the breaks scattered along this section of coastline. Waves such as Kabalana, Marshmallow, Sticks, The Rock and Insight became known internationally among those willing to travel beyond the better-known destinations.",
      "Word spread slowly.",
      "Travellers arrived searching for waves and found something else: a community forming around them.",
      "Many of today's business owners first came as visitors. Some arrived for a week and stayed for months. Others planned a season and ended up building lives here. Surfing became the catalyst for a wider ecosystem that now includes cafes, restaurants, co-working spaces, yoga studios, villas, creative agencies and wellness brands.",
      "Even for visitors who never touch a surfboard, the influence of surf culture remains visible everywhere.",
      "It shapes the rhythm of the town.",
      "Mornings begin early as surfers head into the water before the wind arrives. Cafes fill with people discussing forecasts and tides over coffee. Afternoons slow beneath the tropical heat. Evenings revolve around sunsets, shared meals and conversations that stretch late into the night.",
      "The ocean remains the town's common denominator.",
    ],
  },
  {
    title: "Slow Travel at Its Best",
    body: [
      "Ahangama is not a destination that rewards rushing.",
      "Unlike larger resort towns where attractions are neatly packaged into itineraries, much of Ahangama's appeal lies in simple observation.",
      "Walk away from the main road and you'll discover narrow lanes winding through paddy fields and village communities. Cinnamon bark dries outside family homes. Fruit sellers stack rambutan, mangosteen and jackfruit beside the road. Monkeys leap across telephone wires overhead. Small shrines appear unexpectedly beneath banyan trees.",
      "Life unfolds at a slower pace.",
      "The most memorable moments are often the least planned: discovering a hidden swimming spot, stopping for a king coconut beneath the shade of a palm tree, or finding yourself in conversation with someone whose story led them from London, Melbourne or Berlin to a small town on Sri Lanka's southern coast.",
      "There is a growing appreciation among visitors that Ahangama is best experienced on foot, by bicycle or on a scooter.",
      "The destination encourages exploration rather than consumption.",
    ],
  },
  {
    title: "A Different Approach to Development",
    body: [
      "Perhaps the most interesting aspect of Ahangama's evolution is the way many local businesses are attempting to grow responsibly.",
      "Across much of the world, successful coastal destinations face similar challenges. Rising popularity often brings rising property prices, overdevelopment and the gradual erosion of the characteristics that made a place attractive in the first place.",
      "Many business owners in Ahangama are acutely aware of this risk.",
      "Conversations about sustainability, local employment, education and community impact are common. Hotels invest in training local staff. Restaurants prioritise regional produce. Entrepreneurs collaborate rather than compete.",
      "While no destination is immune to growing pains, there is a genuine effort among many operators to ensure tourism contributes positively to the wider community.",
      "The result is an atmosphere that feels notably different from more heavily commercialised beach destinations.",
      "Visitors are not simply passing through.",
      "Increasingly, they are becoming part of the story.",
    ],
  },
  {
    title: "A New Generation of Hospitality",
    body: [
      "Ahangama's accommodation scene reflects this broader character.",
      "Rather than international hotel chains, the town is defined by independent properties with strong personalities.",
      "Some occupy restored colonial buildings. Others sit hidden among jungle or beside lakes. Many are owner-operated, with founders often present and actively involved in daily life.",
      "The focus is less on luxury in the traditional sense and more on thoughtful design, genuine hospitality and a connection to place.",
      "Guests are just as likely to leave with recommendations for a local surf break, family-run restaurant or community project as they are with memories of a beautifully designed room.",
      "This approach has helped establish Ahangama as one of Sri Lanka's most desirable destinations for travellers seeking authenticity without sacrificing comfort.",
    ],
  },
  {
    title: "Food Beyond Expectations",
    body: [
      "A decade ago, visitors came to Ahangama largely for surfing.",
      "Today, many come for the food.",
      "The dining scene has expanded dramatically while maintaining a strong sense of individuality. Independent cafes and restaurants dominate the landscape, each bringing a distinct perspective.",
      "Excellent coffee is now taken for granted. Freshly baked pastries, creative brunch menus and speciality coffee have become part of daily life.",
      "Meanwhile, a new generation of chefs is drawing inspiration from both Sri Lankan ingredients and international influences.",
      "You'll find Mediterranean-inspired beach clubs, contemporary taco bars, Middle Eastern cafes and elegant interpretations of traditional Sri Lankan cuisine.",
      "Yet despite this diversity, local food remains central to the experience.",
      "Rice and curry lunches, roadside hoppers, fresh seafood and village-style cooking continue to define the area's culinary identity.",
      "The best meals often combine both worlds: global influences grounded in local ingredients and traditions.",
    ],
  },
  {
    title: "Wellness in Nature",
    body: [
      "The growth of Ahangama's wellness scene feels like a natural extension of its environment.",
      "Unlike urban wellness culture, which can often feel performative, wellness here is closely tied to landscape and lifestyle.",
      "Yoga takes place overlooking jungle canopies or beside lakes. Ice baths sit beneath palm trees. Ayurvedic treatments are delivered in open-air pavilions surrounded by birdsong.",
      "The focus is less on optimisation and more on restoration.",
      "Visitors come to slow down, reconnect with nature and create space for reflection.",
      "This combination of surf, wellness, community and hospitality has proven particularly attractive to longer-term travellers seeking balance between work, leisure and personal wellbeing.",
    ],
  },
  {
    title: "Beyond the Beach",
    body: [
      "Although the coastline naturally attracts most attention, some of Ahangama's greatest pleasures lie beyond the ocean.",
      "The surrounding countryside offers rice paddies, cinnamon estates, small villages and freshwater lakes waiting to be explored.",
      "Nearby Koggala Lake remains one of southern Sri Lanka's most beautiful landscapes. Inland roads reveal a quieter side of the region rarely experienced by visitors who remain focused on the beach.",
      "There is also a growing creative community.",
      "Jewellery designers, photographers, artists, architects and makers have established studios throughout the area, contributing to a cultural scene that continues to evolve.",
      "Their influence can be seen everywhere, from architecture and interiors to retail spaces and community events.",
    ],
  },
  {
    title: "Why Ahangama Matters",
    body: [
      "Many destinations become popular because they offer beautiful scenery.",
      "Ahangama offers something more valuable.",
      "It provides a glimpse into what thoughtful tourism can look like.",
      "The town demonstrates that growth and community do not need to exist in opposition. That hospitality can remain personal. That development can retain a sense of place.",
      "Of course, Ahangama is not perfect. It faces many of the same challenges confronting emerging destinations around the world.",
      "Yet what makes it compelling is the collective effort to preserve what matters most.",
      "The ocean remains central. Local communities remain visible. Independent businesses continue to shape the destination's identity.",
      "For travellers, the appeal is simple.",
      "Ahangama still feels real.",
      "You arrive expecting a surf town.",
      "You leave understanding that it has become something much more interesting: a coastal community where creativity, hospitality, nature and local culture have combined to create one of the most distinctive destinations in Sri Lanka.",
      "And, like many before you, you may find yourself extending your stay.",
    ],
  },
];

const MENTIONED_PLACE_LINKS = [
  { label: "Ahangama", href: "https://www.google.com/search?q=Ahangama" },
  { label: "Weligama", href: "https://www.google.com/search?q=Weligama" },
  { label: "Galle", href: "https://www.google.com/search?q=Galle" },
  {
    label: "Kabalana",
    href: "https://www.google.com/search?q=Kabalana+Beach+Ahangama",
  },
  {
    label: "Marshmallow",
    href: "https://www.google.com/search?q=Marshmallow+Ahangama",
  },
  { label: "Sticks", href: "https://www.google.com/search?q=Sticks+Ahangama" },
  {
    label: "The Rock",
    href: "https://www.google.com/search?q=The+Rock+Ahangama",
  },
  {
    label: "Insight",
    href: "https://www.google.com/search?q=Insight+Ahangama",
  },
  {
    label: "Koggala Lake",
    href: "https://www.google.com/search?q=Koggala+Lake",
  },
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
  const columnCount = images.length === 2 ? 2 : images.length === 4 ? 2 : 3;

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
            alt={`Ahangama editorial photograph ${index + 1}`}
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              minHeight: images.length === 4 ? 260 : 320,
              objectFit: "cover",
              objectPosition: "center center",
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default function SriLankasMostInterestingCoastalTownPage() {
  const canonical = absUrl(SRI_LANKAS_MOST_INTERESTING_COASTAL_TOWN_PATH);
  const passCtaUrl = buildPassCtaUrl();

  return (
    <SiteLayout>
      <Seo
        title="Sri Lanka's Most Interesting Coastal Town"
        description="An editorial on why Ahangama has become one of Sri Lanka's most distinctive coastal destinations, shaped by surf, hospitality, food, wellness, and community."
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
            alt="Coastline in Ahangama"
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
            <div style={{ maxWidth: 840 }}>
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
                Sri Lanka&apos;s Most Interesting Coastal Town
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
                src={FEATURE_IMAGE}
                alt="Street and coastal life in Ahangama"
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

          <EditorialPhotoBlock images={PHOTO_ESSAY_GROUPS[0]} />

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

                {index === 1 ? (
                  <EditorialPhotoBlock images={PHOTO_ESSAY_GROUPS[1]} />
                ) : null}
                {index === 3 ? (
                  <EditorialPhotoBlock images={PHOTO_ESSAY_GROUPS[2]} />
                ) : null}
                {index === 5 ? (
                  <EditorialPhotoBlock images={PHOTO_ESSAY_GROUPS[3]} />
                ) : null}
                {index === 8 ? (
                  <EditorialPhotoBlock images={PHOTO_ESSAY_GROUPS[4]} />
                ) : null}
              </React.Fragment>
            ))}
          </div>

          <Text
            style={{
              display: "block",
              marginTop: 8,
              marginBottom: 28,
              color: "#6B5A4E",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1.2,
              textTransform: "uppercase",
            }}
          >
            Photographs by Issy Croker
          </Text>

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
                      An editorial look at why Ahangama has evolved into one of
                      Sri Lanka&apos;s most distinctive coastal destinations.
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
                      Savings across the cafes, stays, wellness spaces, and
                      local experiences that define a longer stay in town.
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
