import React from "react";
import { Alert, Button, Card, Col, List, Row, Space, Tag, Typography } from "antd";
import {
  CarOutlined,
  ClockCircleOutlined,
  CoffeeOutlined,
  HomeOutlined,
  MessageOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import ProductsWorkspaceLayout from "../components/products/ProductsWorkspaceLayout";
import { PRODUCTS_CATALOG } from "../data/productsCatalog";

const { Paragraph, Text, Title } = Typography;

const sections = [
  { id: "overview", label: "Overview", hint: "What concierge is" },
  { id: "services", label: "Services", hint: "What we can help with" },
  { id: "bestfor", label: "Best for", hint: "Who this is for" },
  { id: "pricing", label: "Pricing", hint: "Starting price" },
  { id: "cta", label: "Contact", hint: "Speak to concierge" },
];

const services = [
  "Restaurant reservations",
  "Wellness bookings",
  "Villa recommendations",
  "Airport transfers",
  "Private drivers",
  "Curated itineraries",
  "Last-minute assistance",
  "Experiences & introductions",
];

const bestFor = [
  "Long-stay travelers",
  "Premium visitors",
  "Founders, creatives, and digital nomads",
  "Anyone who wants coordination handled end-to-end",
];

const whatsappConciergeUrl =
  "https://wa.me/94777422274?text=Hi%20Ahangama%20-%20I%27d%20like%20to%20speak%20to%20concierge";

export default function ProductConciergePage() {
  return (
    <>
      <Seo
        title="Premium Concierge — Ahangama"
        description="Personalized travel and lifestyle support in Ahangama: bookings, transfers, itineraries, and introductions."
        canonical={absUrl("/product/concierge")}
      />

      <ProductsWorkspaceLayout
        products={PRODUCTS_CATALOG}
        sections={sections}
        status="Premium support"
        lastUpdated="May 2026"
      >
        <section id="overview" className="concept-section">
          <Card className="concept-card concept-heroCard" bordered={false}>
            <div className="concept-heroGrid">
              <div>
                <Text className="concept-heroEyebrow">Premium / Concierge</Text>
                <Title className="concept-heroTitle">
                  Personalized travel & lifestyle support.
                </Title>
                <Paragraph className="concept-bodyCopy concept-heroParagraph">
                  A high-touch layer for travelers who want deeper access and
                  seamless coordination while in Ahangama.
                </Paragraph>
                <Space wrap>
                  <Tag className="concept-pill">High touch</Tag>
                  <Tag className="concept-pill">Coordination</Tag>
                  <Tag className="concept-pill">Premium upsell</Tag>
                </Space>
              </div>

              <div className="concept-focusPanel">
                <Text className="concept-focusLabel">Examples</Text>
                <Title level={4} className="concept-focusTitle">
                  What we do
                </Title>
                <div className="concept-focusList">
                  <div className="concept-focusItem">
                    <CoffeeOutlined />
                    <span>Reservations</span>
                  </div>
                  <div className="concept-focusItem">
                    <HomeOutlined />
                    <span>Villas</span>
                  </div>
                  <div className="concept-focusItem">
                    <CarOutlined />
                    <span>Transfers</span>
                  </div>
                  <div className="concept-focusItem">
                    <ClockCircleOutlined />
                    <span>Last-minute help</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section id="services" className="concept-section">
          <Card className="concept-card concept-cardSection" bordered={false}>
            <Text className="concept-sectionEyebrow">Services</Text>
            <Title level={2} className="concept-sectionTitle">
              What concierge can handle
            </Title>
            <List
              dataSource={services}
              renderItem={(item) => <List.Item>{item}</List.Item>}
              className="concept-strategyList"
            />
          </Card>
        </section>

        <section id="bestfor" className="concept-section">
          <Card className="concept-card concept-cardSection" bordered={false}>
            <Text className="concept-sectionEyebrow">Best for</Text>
            <Title level={2} className="concept-sectionTitle">
              Who it’s for
            </Title>
            <Row gutter={[16, 16]}>
              {bestFor.map((item) => (
                <Col xs={24} md={12} key={item}>
                  <div className="concept-strategyChannel">
                    <RocketOutlined />
                    <span>{item}</span>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </section>

        <section id="pricing" className="concept-section">
          <Card className="concept-card concept-cardSection" bordered={false}>
            <Text className="concept-sectionEyebrow">Pricing</Text>
            <Title level={2} className="concept-sectionTitle">
              Starting from $150 USD
            </Title>
            <Alert
              type="info"
              showIcon
              message="Pricing depends on scope"
              description="Share dates + what you need help with, and we’ll suggest the right setup."
            />
          </Card>
        </section>

        <section id="cta" className="concept-section">
          <Card className="concept-card concept-cardSection" bordered={false}>
            <Text className="concept-sectionEyebrow">Contact</Text>
            <Title level={2} className="concept-sectionTitle">
              Speak to concierge
            </Title>
            <Space wrap>
              <Button
                type="primary"
                icon={<MessageOutlined />}
                href={whatsappConciergeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Speak to Concierge
              </Button>
            </Space>
          </Card>
        </section>
      </ProductsWorkspaceLayout>
    </>
  );
}
