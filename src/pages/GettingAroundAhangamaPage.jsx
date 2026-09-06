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

export const GETTING_AROUND_AHANGAMA_PATH =
  "/getting-around-ahangama-scooters-tuk-tuks-airport-transfers";

const HERO_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/ahangama-person-on-bike-surfboard-transport-landscape.webp";
const NEXT_ARTICLE = {
  href: "/where-to-stay-on-sri-lankas-southern-coast",
  kicker: "Discover More",
  title: "Where to Stay on Sri Lanka's Southern Coast",
  image:
    "https://images.suitcasemag.com/wp-content/uploads/2025/03/05163113/HERO2-TheFind-SouthCoastSriLanka.jpeg",
};

const articleIntroduction = [
  "A practical guide to scooters, tuk-tuks, airport transfers and exploring Sri Lanka's southern coast.",
  "One of the reasons Ahangama feels different from many beach destinations is that it isn't really a town in the traditional sense.",
  "There is no central square. No walkable historic district. No single beachfront promenade where everything happens.",
  "Instead, Ahangama stretches along several kilometres of coastline. Surf breaks, cafes, villas, restaurants and beaches are scattered between coconut groves, side roads and small village lanes. The places you'll want to visit are often only a few minutes apart, but too far to comfortably walk in the tropical heat.",
  "As a result, transport becomes part of the Ahangama experience.",
  "Fortunately, getting around is straightforward.",
  "Whether you're staying for a weekend or settling in for a month, the key is choosing the right form of transport for the way you intend to travel.",
  "For most visitors, that decision comes down to three options: scooters, tuk-tuks and private drivers.",
  "Each serves a different purpose.",
];

const articleSections = [
  {
    title: "The Scooter Economy",
    body: [
      "If Ahangama has an unofficial vehicle, it is the scooter.",
      "Spend an hour sitting outside a cafe in Kabalana and you'll quickly notice a pattern. Surfers arrive on scooters with boards strapped to the side. Remote workers park outside coffee shops before opening their laptops. Hotel guests use them to move between beaches, restaurants and wellness studios.",
      "The scooter has become the default mode of transport because it fits the rhythm of life here.",
      "A typical day in Ahangama rarely involves staying in one place.",
      "You might begin with coffee in Kabalana, spend the morning surfing at Marshmallow, stop for lunch inland among the rice paddies, visit a spa in the afternoon and finish with dinner elsewhere along the coast.",
      "A scooter makes those movements effortless.",
      "More importantly, it allows visitors to discover parts of the area they would otherwise miss.",
      "Some of Ahangama's best experiences sit beyond the coastal road. Hidden cafes, quiet beaches, cinnamon estates and small village lanes often reveal themselves only when travellers have the freedom to explore independently.",
      "Rental prices remain relatively affordable compared with many international destinations, particularly for visitors staying several weeks.",
      "Most operators also offer longer-term rates, making scooters especially popular among digital nomads, surfers and slow travellers.",
      "That said, scooters are not for everyone.",
      "Road conditions vary, tropical rainstorms arrive suddenly and traffic can feel chaotic for inexperienced riders. Visitors without confidence on two wheels may find other options more comfortable.",
    ],
  },
  {
    title: "Tuk-Tuks: The Local Solution",
    body: [
      "For those who prefer not to drive, tuk-tuks remain one of the easiest ways to navigate Ahangama.",
      "The three-wheeled vehicles are as much a part of Sri Lankan life as tea and cricket. They function simultaneously as taxis, delivery vehicles, school transport and social spaces.",
      "Visitors quickly become familiar with them.",
      "A short ride to dinner.",
      "A transfer home after sunset.",
      "A trip to the train station.",
      "A run to a neighbouring beach.",
      "These are the journeys where tuk-tuks excel.",
      "What makes them particularly useful is their flexibility. Unlike larger vehicles, they navigate narrow lanes and village roads with ease, often reaching places inaccessible to cars.",
      "Many visitors eventually develop relationships with one or two local drivers who become informal guides throughout their stay.",
      "Ask for a recommendation and they will suggest a restaurant.",
      "Need coconuts, laundry or a hidden beach? They probably know someone.",
      "This informal local knowledge is often as valuable as the transport itself.",
      "For short journeys around Ahangama, Kabalana, Kathaluwa and Midigama, tuk-tuks are usually the most practical solution.",
    ],
  },
  {
    title: "Why Airport Transfers Matter",
    body: [
      "The first transport decision most visitors make happens before they even arrive.",
      "Bandaranaike International Airport sits near Colombo, more than two hours from Ahangama on a good day and considerably longer when traffic builds around the capital.",
      "After an overnight flight, luggage collection and immigration queues, few travellers want to negotiate transport on arrival.",
      "Pre-booked airport transfers have therefore become one of the most popular services on the south coast.",
      "The reasons are simple.",
      "Drivers know the route.",
      "Pricing is agreed in advance.",
      "Surfboards, luggage and family travel become significantly easier.",
      "Most importantly, visitors can step out of the airport and begin their journey without additional logistics.",
      "The drive itself offers an introduction to modern Sri Lanka.",
      "Urban Colombo gradually gives way to coconut plantations, roadside fruit sellers, small towns and glimpses of the Indian Ocean. By the time you reach Ahangama, the landscape has already begun telling the story of the region.",
      "For many visitors, that first drive south marks the beginning of the holiday.",
    ],
  },
  {
    title: "Exploring Beyond Ahangama",
    body: [
      "While Ahangama has enough restaurants, beaches and experiences to occupy several days, most visitors eventually begin exploring further afield.",
      "Fortunately, southern Sri Lanka is remarkably compact.",
      "Within an hour, travellers can access historic cities, wildlife reserves, remote beaches and entirely different atmospheres.",
      "The most common excursion is Galle.",
      "Roughly thirty minutes west, the fortified colonial city remains one of Sri Lanka's most celebrated destinations. Visitors spend afternoons wandering narrow streets lined with galleries, boutiques and cafes before returning to Ahangama in time for sunset.",
      "To the east, Weligama offers beginner-friendly surf, whale-watching departures and a more urban coastal atmosphere.",
      "Further beyond lies Hiriketiya.",
      "Once a secret surf bay known only to a handful of travellers, it has evolved into one of the island's most fashionable beach destinations. The journey from Ahangama takes around an hour, making it an easy day trip for swimming, surfing or dinner by the water.",
      "Many visitors also head inland.",
      "Tea plantations, temples, local markets and village communities provide a very different perspective on southern Sri Lanka, reminding travellers that the region's identity extends far beyond the coastline.",
      "For these longer journeys, private drivers and rental cars often become the preferred option.",
      "Comfort matters more when travelling greater distances, particularly during hotter months or rainy periods.",
    ],
  },
  {
    title: "The Rise of Slow Exploration",
    body: [
      "Perhaps the most important thing to understand about transport in Ahangama is that movement itself becomes part of the experience.",
      "This is not a destination where travellers move rapidly between attractions.",
      "The best discoveries often happen unexpectedly.",
      "A roadside fruit stand selling perfectly ripe mangoes.",
      "A quiet stretch of beach without another person in sight.",
      "A cinnamon estate hidden behind a village road.",
      "A small cafe you hadn't planned to visit.",
      "The freedom to stop, explore and change direction is one of the reasons so many visitors become attached to Ahangama.",
      "Unlike destinations where transport simply serves a functional purpose, here it often becomes a pathway to discovery.",
      "A scooter ride to breakfast turns into an afternoon exploring the coastline.",
      "A tuk-tuk journey becomes a conversation with a local driver about life in the village.",
      "An airport transfer evolves into an impromptu lesson on Sri Lankan culture, cricket and politics.",
      "These moments are difficult to plan, but they often become the stories people remember.",
    ],
  },
  {
    title: "A Practical Perspective",
    body: [
      "For most visitors, the ideal transport strategy is surprisingly simple.",
      "Rent a scooter if you're staying more than a few days and feel comfortable riding.",
      "Use tuk-tuks for evenings, short journeys and occasions when convenience matters more than independence.",
      "Pre-book airport transfers to avoid unnecessary stress.",
      "Consider a private driver or car for longer coastal adventures and day trips beyond Ahangama.",
      "Most importantly, leave room for spontaneity.",
      "The best version of Ahangama isn't found by following a strict itinerary. It's found by allowing the town, its people and its coastline to reveal themselves gradually.",
      "Getting around is simply part of that process.",
      "And like many things in Ahangama, it works best when you slow down.",
    ],
  },
];

const directorySections = [
  {
    title: "Scooter Rentals",
    providers: ["GIK Bike Rentals", "Scooty Rental & Taxi Service"],
    pricing: [
      "Standard scooter: LKR 2,500-4,500 per day",
      "Weekly rental: Often discounted",
      "Monthly rental: Usually negotiable and significantly cheaper than daily rates",
    ],
    goodFor: [
      "Surf trips",
      "Cafe hopping",
      "Beach exploration",
      "Longer stays",
    ],
  },
  {
    title: "Tuk-Tuks & Local Rides",
    providers: ["Happy Tours", "Local independent drivers"],
    pricing: [
      "Short in-town journey: LKR 500-1,000",
      "Cross-town journey: LKR 1,000-1,500",
      "Multi-stop trips: Agree a fixed price before departure",
    ],
    goodFor: [
      "Dinner transfers",
      "Station pickups",
      "Rainy days",
      "Visitors who prefer not to self-drive",
    ],
  },
  {
    title: "Airport Transfers",
    providers: ["Taxi and Transport Tours"],
    pricing: [
      "Standard car: LKR 18,000-25,000",
      "Larger vehicle or van: LKR 25,000-35,000+",
      "Surfboards or oversized luggage may incur additional charges",
    ],
    goodFor: ["First arrivals", "Families", "Groups", "Surf travellers"],
  },
  {
    title: "Car Hire & Private Drivers",
    providers: ["Nova Rent a Car", "Taxi and Transport Tours"],
    pricing: [
      "Private south-coast transfer: LKR 8,000-15,000",
      "Full-day private driver: LKR 12,000-20,000+",
      "Multi-day hire: Available on request",
    ],
    goodFor: [
      "Ahangama to Galle",
      "Ahangama to Hiriketiya",
      "Ahangama to Yala",
      "Ahangama to Ella",
    ],
  },
];

const passBenefits = [
  "Up to 20% off scooter rentals",
  "Selected providers offering up to 25% off rental rates",
  "Seasonal promotions on transfers and local transport services",
];

const MENTIONED_PLACE_LINKS = [
  { label: "Ahangama", href: "https://www.google.com/search?q=Ahangama" },
  {
    label: "Kabalana",
    href: "https://www.google.com/search?q=Kabalana+Beach+Ahangama",
  },
  {
    label: "Marshmallow",
    href: "https://www.google.com/search?q=Marshmallow+Ahangama",
  },
  { label: "Kathaluwa", href: "https://www.google.com/search?q=Kathaluwa" },
  { label: "Midigama", href: "https://www.google.com/search?q=Midigama" },
  {
    label: "Bandaranaike International Airport",
    href: "https://www.google.com/search?q=Bandaranaike+International+Airport",
  },
  { label: "Colombo", href: "https://www.google.com/search?q=Colombo" },
  { label: "Galle", href: "https://www.google.com/search?q=Galle" },
  { label: "Weligama", href: "https://www.google.com/search?q=Weligama" },
  { label: "Hiriketiya", href: "https://www.google.com/search?q=Hiriketiya" },
  { label: "Sri Lanka", href: "https://www.google.com/search?q=Sri+Lanka" },
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

export default function GettingAroundAhangamaPage() {
  const canonical = absUrl(GETTING_AROUND_AHANGAMA_PATH);
  const passCtaUrl = buildPassCtaUrl();

  return (
    <SiteLayout>
      <Seo
        title="Getting Around Ahangama"
        description="A practical guide to scooters, tuk-tuks, airport transfers and exploring Sri Lanka's southern coast."
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
            alt="Getting around Ahangama on Sri Lanka's south coast"
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
                  Practical Guide
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
                Getting Around Ahangama
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

          <div style={{ display: "flex", flexDirection: "column" }}>
            {articleSections.map((section, index) => (
              <section
                key={section.title}
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
            ))}
          </div>

          <section
            style={{
              padding: "36px 0",
              borderTop: "1px solid rgba(47,62,58,0.12)",
            }}
          >
            <div style={{ maxWidth: 1180 }}>
              <Title level={2} style={{ marginTop: 0, marginBottom: 18 }}>
                Transport Directory & Typical Pricing
              </Title>
              <Paragraph
                style={{
                  maxWidth: 1200,
                  fontSize: 16,
                  lineHeight: 1.8,
                  color: "#55514B",
                  marginBottom: 24,
                }}
              >
                While Ahangama rewards spontaneous exploration, having a rough
                understanding of transport costs can make planning easier.
                Prices vary by season, vehicle availability, fuel costs and time
                of day, but the ranges below provide a realistic starting point
                for most visitors.
              </Paragraph>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: 20,
                }}
              >
                {directorySections.map((section) => (
                  <Card
                    key={section.title}
                    style={{
                      borderRadius: 24,
                      border: "1px solid rgba(47,62,58,0.08)",
                      background:
                        "linear-gradient(180deg, #fffdf9 0%, #faf4eb 100%)",
                      height: "100%",
                    }}
                    bodyStyle={{ padding: 22 }}
                  >
                    <Text
                      style={{
                        display: "block",
                        color: "#8B5A3C",
                        fontSize: 12,
                        fontWeight: 700,
                        marginBottom: 10,
                        textTransform: "uppercase",
                        letterSpacing: 1.2,
                      }}
                    >
                      {section.title}
                    </Text>
                    <Text
                      style={{
                        display: "block",
                        color: "#2F3E3A",
                        fontSize: 13,
                        fontWeight: 700,
                        marginBottom: 10,
                      }}
                    >
                      Recommended Providers
                    </Text>
                    {section.providers.map((item) => (
                      <Paragraph
                        key={item}
                        style={{ marginBottom: 8, color: "#55514B" }}
                      >
                        {item}
                      </Paragraph>
                    ))}
                    <Text
                      style={{
                        display: "block",
                        color: "#2F3E3A",
                        fontSize: 13,
                        fontWeight: 700,
                        marginTop: 14,
                        marginBottom: 10,
                      }}
                    >
                      Typical Pricing
                    </Text>
                    {section.pricing.map((item) => (
                      <Paragraph
                        key={item}
                        style={{ marginBottom: 8, color: "#55514B" }}
                      >
                        {item}
                      </Paragraph>
                    ))}
                    <Text
                      style={{
                        display: "block",
                        color: "#2F3E3A",
                        fontSize: 13,
                        fontWeight: 700,
                        marginTop: 14,
                        marginBottom: 10,
                      }}
                    >
                      Good For
                    </Text>
                    {section.goodFor.map((item) => (
                      <Paragraph
                        key={item}
                        style={{ marginBottom: 8, color: "#55514B" }}
                      >
                        {item}
                      </Paragraph>
                    ))}
                  </Card>
                ))}
              </div>

              <Card
                style={{
                  borderRadius: 24,
                  border: "1px solid rgba(47,62,58,0.08)",
                  background: "#ffffff",
                  marginTop: 24,
                }}
                bodyStyle={{ padding: 24 }}
              >
                <Title level={3} style={{ marginTop: 0, marginBottom: 12 }}>
                  Ahangama Pass Benefits
                </Title>
                {passBenefits.map((item) => (
                  <Paragraph
                    key={item}
                    style={{ marginBottom: 10, color: "#55514B" }}
                  >
                    {item}
                  </Paragraph>
                ))}
                <Paragraph style={{ marginBottom: 0, color: "#55514B" }}>
                  Visit the Ahangama Pass section for current partner offers and
                  redemption details.
                </Paragraph>
              </Card>

              <Card
                style={{
                  borderRadius: 24,
                  border: "1px solid rgba(47,62,58,0.08)",
                  background: "#ffffff",
                  marginTop: 20,
                }}
                bodyStyle={{ padding: 24 }}
              >
                <Title level={3} style={{ marginTop: 0, marginBottom: 12 }}>
                  Editorial Recommendation
                </Title>
                <Paragraph style={{ marginBottom: 12, color: "#55514B" }}>
                  If you're visiting for less than three days, rely on tuk-tuks
                  and pre-booked transfers.
                </Paragraph>
                <Paragraph style={{ marginBottom: 12, color: "#55514B" }}>
                  If you're staying for a week or longer, rent a scooter.
                </Paragraph>
                <Paragraph style={{ marginBottom: 0, color: "#55514B" }}>
                  And if you're planning to explore beyond Ahangama, consider
                  booking a private driver for at least one day. It's often the
                  easiest way to discover the wider southern coast.
                </Paragraph>
              </Card>
            </div>
          </section>

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
                      A practical guide to scooters, tuk-tuks, airport
                      transfers, and slow exploration along Sri Lanka&apos;s
                      southern coast.
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
                      Selected transport partners offer discounts on scooter
                      rentals and local transfers through the Ahangama Pass.
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
