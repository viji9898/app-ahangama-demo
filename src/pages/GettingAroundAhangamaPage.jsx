import React from "react";
import { Button, Card, Col, Divider, Row, Space, Tag, Typography } from "antd";
import { ArrowRightOutlined, CarOutlined, EnvironmentOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { buildPassCtaUrl } from "../lib/passAttribution";

const { Paragraph, Text, Title } = Typography;

const GUIDE_PATH = "/getting-around-ahangama-scooters-tuk-tuks-airport-transfers";

const transportSections = [
  {
    number: "01",
    title: "Scooters are still the default for everyday Ahangama movement",
    body: [
      "If you are staying in Ahangama for more than a day or two, a scooter is usually the simplest way to get around. It gives you quick access to surf breaks, cafes, supermarkets, and the neighboring beaches without having to negotiate every short ride.",
      "The live transport entries in the database point clearly in this direction: GIK Bike Rentals and Scooty Rental & Taxi Service are the strongest local rental-led options, both framed around flexibility, local exploring, and easy everyday movement.",
    ],
    pricing: [
      "Recommended: LKR 2,500-4,500 per day for a standard scooter in season.",
      "Good monthly-style long-stay discussions should generally come in below stacked daily pricing.",
    ],
  },
  {
    number: "02",
    title: "Tuk-tuks are better for quick local hops than all-day dependence",
    body: [
      "For travelers who do not want to self-drive, tuk-tuks and local taxi-style rides are the practical fallback. They are best used for station pickups, dinner runs, rainy-day movement, or short in-town hops.",
      "Happy Tours appears in the DB as a convenience-first transport option for local trips and travel support, while Taxi and Transport Tours is the stronger fit when the journey matters more than the hop itself.",
    ],
    pricing: [
      "Recommended: LKR 500-1,500 for short in-town or nearby hops, depending on time and distance.",
      "Once the journey becomes multi-stop or inter-town, fixed private pricing usually makes more sense than repeated short-ride logic.",
    ],
  },
  {
    number: "03",
    title: "Airport transfers should feel fixed, clear, and pre-agreed",
    body: [
      "The database gives one very clear airport-transfer specialist: Taxi and Transport Tours. Its live description explicitly covers airport pickups, local rides, private day tours, and long-distance travel across the island, and it is marked as available 24/7.",
      "For a blog guide, this is the cleanest operator to mention when talking about arriving late, traveling with boards or luggage, or avoiding the friction of arranging a ride after landing.",
    ],
    pricing: [
      "Recommended: LKR 18,000-30,000 for airport transfers depending on vehicle type, surfboards, and time of travel.",
      "Late-night, larger-vehicle, or luggage-heavy trips should sit toward the upper end of that window.",
    ],
  },
  {
    number: "04",
    title: "For Galle, Hiriketiya, and longer south-coast trips, cars win",
    body: [
      "The DB does not explicitly name Galle or Hiriketiya inside the transport descriptions, but the role split is still clear. Nova Rent a Car is the best long-distance self-drive option because it is framed around car rentals, road trips, and exploring beyond Ahangama.",
      "If the piece is advising readers on comfort, luggage, weather protection, or simply not wanting to ride a scooter for a longer coastal move, Nova and Taxi and Transport Tours are the strongest names to use.",
    ],
    pricing: [
      "Recommended: LKR 8,000-15,000 for a private one-way south-coast transfer depending on route and vehicle.",
      "Recommended: LKR 12,000-20,000+ per day for car hire or longer private vehicle use.",
    ],
  },
  {
    number: "05",
    title: "The strongest transport DB entries right now",
    body: [
      "GIK Bike Rentals: rental-led, strong for scooters and local freedom, with tags that also reference airport and tuk-tuk related movement.",
      "Scooty Rental & Taxi Service: highest review count in the set, very strong for scooter-led day-to-day mobility.",
      "Taxi and Transport Tours: strongest airport-transfer and private-trip entry, with 24/7 hours in the DB.",
      "Nova Rent a Car: best car-rental and road-trip positioning for travel beyond Ahangama.",
      "Happy Tours: best described as practical local travel support when convenience matters more than self-drive independence.",
    ],
    pricing: [
      "Card-linked offers in the DB range from 10% off transport options up to 20% off scooter rentals, with one rental record also carrying a 25% scooter offer field.",
    ],
  },
];

const quickReference = [
  {
    label: "Best for local freedom",
    value: "GIK Bike Rentals, Scooty Rental & Taxi Service",
  },
  {
    label: "Best for airport transfers",
    value: "Taxi and Transport Tours",
  },
  {
    label: "Best for Galle or Hiriketiya runs",
    value: "Nova Rent a Car or private transfer",
  },
  {
    label: "Typical entry pricing",
    value: "Scooters from LKR 2,500-4,500/day, airport transfers from LKR 18,000+",
  },
];

export default function GettingAroundAhangamaPage() {
  const canonical = absUrl(GUIDE_PATH);
  const passCtaUrl = buildPassCtaUrl();

  return (
    <SiteLayout>
      <Seo
        title="Getting Around Ahangama: Scooters, Tuk Tuks & Airport Transfers"
        description="A practical Ahangama transport guide covering scooters, tuk-tuks, airport transfers, Galle trips, Hiriketiya runs, and recommended pricing ranges."
        canonical={canonical}
      />

      <div className="dm-heroCut" />
      <div className="dm-canvas">
        <div className="dm-wrap">
          <Card
            style={{
              borderRadius: 30,
              border: "1px solid rgba(47,62,58,0.08)",
              background: "linear-gradient(135deg, rgba(245,236,225,0.94) 0%, rgba(255,251,245,0.98) 100%)",
              overflow: "hidden",
              marginBottom: 28,
            }}
            bodyStyle={{ padding: 30 }}
          >
            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} xl={14}>
                <Space wrap size={[8, 8]} style={{ marginBottom: 12 }}>
                  <Tag style={{ borderRadius: 999, padding: "6px 12px" }}>Transport Guide</Tag>
                  <Tag style={{ borderRadius: 999, padding: "6px 12px" }}>Ahangama Logistics</Tag>
                </Space>

                <Title
                  level={1}
                  style={{
                    marginTop: 0,
                    marginBottom: 12,
                    fontSize: 42,
                    lineHeight: 1.03,
                  }}
                >
                  Getting Around Ahangama: Scooters, Tuk Tuks & Airport Transfers
                </Title>

                <Paragraph style={{ fontSize: 18, lineHeight: 1.8, color: "#5C5953", marginBottom: 18 }}>
                  The practical version of the transport guide: when to rent a scooter,
                  when to book a tuk-tuk, when to take a car to Galle or Hiriketiya,
                  and what pricing ranges are still reasonable on the south coast.
                </Paragraph>

                <Space wrap size={12}>
                  <Button
                    type="primary"
                    size="large"
                    href={passCtaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    icon={<ArrowRightOutlined />}
                    style={{ borderRadius: 999, background: "#2F3E3A", borderColor: "#2F3E3A" }}
                  >
                    Get The Ahangama Pass
                  </Button>
                </Space>
              </Col>

              <Col xs={24} xl={10}>
                <div
                  style={{
                    minHeight: 360,
                    borderRadius: 24,
                    backgroundImage:
                      "linear-gradient(180deg, rgba(18,25,24,0.05) 0%, rgba(18,25,24,0.34) 100%), url(https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/scooty_rental_and_taxi.jpeg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </Col>
            </Row>
          </Card>

          <Card
            style={{ borderRadius: 24, border: "1px solid rgba(47,62,58,0.08)", marginBottom: 28 }}
            bodyStyle={{ padding: 24 }}
          >
            <Space align="start" size={12}>
              <SafetyCertificateOutlined style={{ fontSize: 20, color: "#8B5A3C", marginTop: 4 }} />
              <div>
                <Text style={{ display: "block", color: "#2F3E3A", fontWeight: 700, marginBottom: 6 }}>
                  Recommended pricing note
                </Text>
                <Paragraph style={{ margin: 0, color: "#5C5953" }}>
                  The pricing ranges on this page are editorial guide rails for blog readers,
                  not direct quotes from the venues table. The live DB mainly stores pricing as
                  budget or mid-range bands plus discount offers, so these numbers are best used
                  as realistic planning ranges rather than fixed tariffs.
                </Paragraph>
              </div>
            </Space>
          </Card>

          <Row gutter={[20, 20]} style={{ marginBottom: 28 }}>
            {quickReference.map((item) => (
              <Col xs={24} md={12} key={item.label}>
                <Card
                  style={{
                    height: "100%",
                    borderRadius: 22,
                    border: "1px solid rgba(47,62,58,0.08)",
                    background: "linear-gradient(180deg, #fffdf9 0%, #faf4eb 100%)",
                  }}
                  bodyStyle={{ padding: 22 }}
                >
                  <Text style={{ display: "block", color: "#8B5A3C", fontSize: 12, fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1.2 }}>
                    {item.label}
                  </Text>
                  <Paragraph style={{ margin: 0, color: "#2F3E3A", fontSize: 16, lineHeight: 1.6 }}>
                    {item.value}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {transportSections.map((section) => (
              <Card
                key={section.number}
                style={{
                  borderRadius: 24,
                  border: "1px solid rgba(47,62,58,0.08)",
                  background: "linear-gradient(180deg, #fffdf9 0%, #faf4eb 100%)",
                }}
                bodyStyle={{ padding: 24 }}
              >
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={16}>
                    <Text style={{ display: "block", color: "#8B5A3C", fontSize: 12, fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1.4 }}>
                      {section.number}
                    </Text>
                    <Title level={2} style={{ marginTop: 0, marginBottom: 14 }}>
                      {section.title}
                    </Title>
                    {section.body.map((paragraph) => (
                      <Paragraph key={paragraph} style={{ color: "#55514B", fontSize: 16, lineHeight: 1.8 }}>
                        {paragraph}
                      </Paragraph>
                    ))}
                  </Col>
                  <Col xs={24} lg={8}>
                    <Card
                      style={{ borderRadius: 20, background: "rgba(255,255,255,0.72)", border: "1px solid rgba(47,62,58,0.08)" }}
                      bodyStyle={{ padding: 18 }}
                    >
                      <Space align="center" size={8} style={{ marginBottom: 10 }}>
                        <CarOutlined style={{ color: "#8B5A3C" }} />
                        <Text style={{ color: "#8B5A3C", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2 }}>
                          Recommended pricing
                        </Text>
                      </Space>
                      {section.pricing.map((item) => (
                        <Paragraph key={item} style={{ marginBottom: 10, color: "#59534B" }}>
                          {item}
                        </Paragraph>
                      ))}
                    </Card>
                  </Col>
                </Row>
              </Card>
            ))}
          </div>

          <Divider style={{ margin: "32px 0" }} />

          <Card
            style={{
              borderRadius: 28,
              border: "1px solid rgba(47,62,58,0.08)",
              background: "linear-gradient(135deg, rgba(47,62,58,0.98) 0%, rgba(78,55,42,0.98) 100%)",
              marginBottom: 36,
            }}
            bodyStyle={{ padding: 28 }}
          >
            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} lg={16}>
                <Text style={{ display: "block", color: "rgba(255,247,240,0.72)", textTransform: "uppercase", letterSpacing: 1.5, fontSize: 12, marginBottom: 10 }}>
                  Final note
                </Text>
                <Title level={2} style={{ color: "#FFF8F0", marginTop: 0 }}>
                  What to recommend in one sentence
                </Title>
                <Paragraph style={{ color: "rgba(255,248,240,0.86)", fontSize: 16, lineHeight: 1.8, marginBottom: 0 }}>
                  For local freedom, rent a scooter. For airport pickups and luggage-heavy travel,
                  pre-book a private transfer. For longer south-coast runs to places like Galle or
                  Hiriketiya, a car or driver usually makes more sense than pretending a scooter is
                  still the easy option.
                </Paragraph>
              </Col>
              <Col xs={24} lg={8}>
                <Button
                  type="primary"
                  block
                  size="large"
                  href={passCtaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  icon={<ArrowRightOutlined />}
                  style={{ borderRadius: 999, background: "#FFF8F0", color: "#2F3E3A", borderColor: "#FFF8F0" }}
                >
                  Get The Pass
                </Button>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </SiteLayout>
  );
}