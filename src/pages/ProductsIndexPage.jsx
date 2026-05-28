import React from "react";
import { Card, Col, Divider, List, Row, Space, Tag, Typography, Button } from "antd";
import { Link } from "react-router-dom";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import ProductsWorkspaceLayout from "../components/products/ProductsWorkspaceLayout";
import { PRODUCTS_CATALOG } from "../data/productsCatalog";

const { Paragraph, Text, Title } = Typography;

const sections = [
  { id: "overview", label: "Overview", hint: "What the ecosystem is" },
  { id: "layers", label: "Layers", hint: "Free → paid → premium" },
  { id: "strategy", label: "Strategy", hint: "How the layers fit" },
  { id: "channels", label: "Channels", hint: "How it scales" },
];

const ecosystemIntro =
  "A curated access layer for experiencing Ahangama through perks, experiences, local discovery, and premium travel support.";

const distributionChannels = [
  "Hotels & villas",
  "Airbnb hosts",
  "Cafés & wellness venues",
  "QR code touchpoints",
  "Instagram & social media",
  "Travel creators",
  "Tourism partners",
  "OTA integrations",
];

const strategyLayers = [
  { layer: "Free Pass", objective: "Acquire users" },
  { layer: "Pass+", objective: "Monetize access" },
  { layer: "Experience Bundles", objective: "Increase spend" },
  { layer: "Concierge", objective: "Premium upsell" },
];

const layerCards = [
  {
    key: "free-ahangama-pass",
    eyebrow: "01 — Free Ahangama Pass",
    title: "Your entry into Ahangama",
    description:
      "Free access to the Ahangama ecosystem. Designed to help travelers discover the best cafés, wellness spaces, surf spots, experiences, and local recommendations across town.",
    includes: [
      "Local recommendations",
      "Partner venue perks",
      "Curated Ahangama map",
      "WhatsApp updates",
      "Event and experience discovery",
      "Access to future offers and drops",
    ],
    purpose: "Lead capture + ecosystem entry.",
    price: "FREE",
    ctaLabel: "Get Your Free Pass",
    href: "/product/free-ahangama-pass",
  },
  {
    key: "pass-plus",
    eyebrow: "02 — Ahangama Pass+",
    title: "Unlock local perks across Ahangama",
    description:
      "A lightweight paid membership designed for travelers who want insider pricing, curated access, and benefits across Ahangama’s best venues.",
    includes: [
      "Member pricing at partner venues",
      "Discounts on cafés, wellness, surf & lifestyle",
      "Curated venue access",
      "Local-only recommendations",
      "Apple Wallet & Google Wallet pass",
      "Priority access to selected experiences",
    ],
    bestFor: "Travelers staying 3–14 days.",
    purpose: "Perks + discounts + curated access.",
    price: "$7 USD",
    ctaLabel: "Upgrade to Pass+",
    href: "/product/pass-plus",
  },
  {
    key: "12-must-do-things",
    eyebrow: "03 — 12 Must Do Things in Ahangama",
    title: "The curated Ahangama experience bundle",
    description:
      "A premium experience product inspired by city attraction passes — bringing together the best activities, wellness, food, movement, and local culture into one curated package.",
    examples: [
      "Surf lesson",
      "Pilates or yoga session",
      "Ice bath & sauna",
      "Specialty coffee experience",
      "Tuk tuk adventure",
      "Coworking day pass",
      "Massage & spa treatment",
      "Sunset cocktails",
      "Local food experiences",
    ],
    includes: [
      "Exclusive bundled pricing",
      "Curated itinerary",
      "Flexible redemption",
      "Multiple partner venues",
      "Editorial travel guide",
    ],
    bestFor: "Visitors wanting to fully experience Ahangama.",
    purpose: "Bundled experiences.",
    price: "$49–79 USD",
    ctaLabel: "Explore Experiences",
    href: "/product/12-must-do-things",
  },
  {
    key: "concierge",
    eyebrow: "04 — Premium / Concierge",
    title: "Personalized travel & lifestyle support",
    description:
      "A high-touch concierge layer for travelers, founders, creatives, digital nomads, and premium visitors seeking deeper access and seamless coordination.",
    includes: [
      "Restaurant reservations",
      "Wellness bookings",
      "Villa recommendations",
      "Airport transfers",
      "Private drivers",
      "Curated itineraries",
      "Last-minute assistance",
      "Experiences & introductions",
    ],
    bestFor: "Long-stay travelers and premium visitors.",
    purpose: "High-end traveler services.",
    price: "Starting from $150 USD",
    ctaLabel: "Speak to Concierge",
    href: "/product/concierge",
  },
];

export default function ProductsIndexPage() {
  return (
    <>
      <Seo
        title="Ahangama Pass Ecosystem"
        description="A curated access layer for experiencing Ahangama through perks, experiences, local discovery, and premium travel support."
        canonical={absUrl("/products")}
      />

      <ProductsWorkspaceLayout
        products={PRODUCTS_CATALOG}
        sections={sections}
        status="Product index"
        lastUpdated="May 2026"
      >
        <section id="overview" className="concept-section">
          <Card className="concept-card concept-heroCard" bordered={false}>
            <div className="concept-heroGrid">
              <div>
                <Text className="concept-heroEyebrow">Ahangama Pass Ecosystem</Text>
                <Title className="concept-heroTitle">Experience Ahangama better.</Title>
                <Paragraph className="concept-bodyCopy concept-heroParagraph">
                  {ecosystemIntro}
                </Paragraph>
              </div>

              <div className="concept-focusPanel">
                <Text className="concept-focusLabel">Quick links</Text>
                <Title level={4} className="concept-focusTitle">
                  Start here
                </Title>
                <Space direction="vertical" size={10} style={{ width: "100%" }}>
                  <Button type="primary" href="/product/free-ahangama-pass" block>
                    Get Your Free Pass
                  </Button>
                  <Button href="/product/12-must-do-things" block>
                    Explore Experiences
                  </Button>
                </Space>
              </div>
            </div>
          </Card>
        </section>

        <section id="layers" className="concept-section">
          <Card className="concept-card concept-cardSection" bordered={false}>
            <Text className="concept-sectionEyebrow">Layers</Text>
            <Title level={2} className="concept-sectionTitle">
              Four layers. One ecosystem.
            </Title>

            <Row gutter={[16, 16]}>
              {layerCards.map((layer) => (
                <Col xs={24} lg={12} key={layer.key}>
                  <Card className="concept-card" bordered={false}>
                    <Text className="concept-sectionEyebrow">{layer.eyebrow}</Text>
                    <Title level={3} className="concept-sectionTitle">
                      {layer.title}
                    </Title>
                    <Paragraph className="concept-bodyCopy">{layer.description}</Paragraph>

                    <Divider />

                    {Array.isArray(layer.examples) && layer.examples.length ? (
                      <>
                        <Text className="concept-sectionEyebrow">Example experiences</Text>
                        <List
                          dataSource={layer.examples}
                          renderItem={(item) => <List.Item>{item}</List.Item>}
                          className="concept-strategyList"
                        />
                        <Divider />
                      </>
                    ) : null}

                    <Text className="concept-sectionEyebrow">Includes</Text>
                    <List
                      dataSource={layer.includes}
                      renderItem={(item) => <List.Item>{item}</List.Item>}
                      className="concept-strategyList"
                    />

                    <Divider />

                    <Space wrap>
                      <Tag className="concept-pill">Purpose: {layer.purpose}</Tag>
                      {layer.bestFor ? (
                        <Tag className="concept-pill">Best for: {layer.bestFor}</Tag>
                      ) : null}
                      <Tag className="concept-pill">Price: {layer.price}</Tag>
                    </Space>

                    <Divider />

                    <Space wrap>
                      <Link to={layer.href} style={{ textDecoration: "none" }}>
                        <Button type="primary">{layer.ctaLabel}</Button>
                      </Link>
                      <Link to="/card" style={{ textDecoration: "none" }}>
                        <Button>Paid Pass Options</Button>
                      </Link>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </section>

        <section id="strategy" className="concept-section">
          <Card className="concept-card concept-cardSection" bordered={false}>
            <Text className="concept-sectionEyebrow">Ecosystem Strategy</Text>
            <Title level={2} className="concept-sectionTitle">
              Layered travel platform
            </Title>
            <Paragraph className="concept-bodyCopy">
              The Ahangama Pass ecosystem is designed as a layered travel platform.
            </Paragraph>

            <Row gutter={[16, 16]}>
              {strategyLayers.map((row) => (
                <Col xs={24} md={12} key={row.layer}>
                  <div className="concept-strategyChannel">
                    <span>
                      <strong>{row.layer}</strong> — {row.objective}
                    </span>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </section>

        <section id="channels" className="concept-section">
          <Card className="concept-card concept-cardSection" bordered={false}>
            <Text className="concept-sectionEyebrow">Distribution Channels</Text>
            <Title level={2} className="concept-sectionTitle">
              How this scales
            </Title>
            <List
              dataSource={distributionChannels}
              renderItem={(item) => <List.Item>{item}</List.Item>}
              className="concept-strategyList"
            />
          </Card>
        </section>

      </ProductsWorkspaceLayout>
    </>
  );
}
