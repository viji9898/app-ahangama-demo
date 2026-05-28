import React from "react";
import { Card, Col, Divider, List, Row, Space, Tag, Typography, Button, Alert } from "antd";
import {
  DollarOutlined,
  MessageOutlined,
  RocketOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import ProductsWorkspaceLayout from "../components/products/ProductsWorkspaceLayout";
import { PRODUCTS_CATALOG } from "../data/productsCatalog";

const { Paragraph, Text, Title } = Typography;

const sections = [
  { id: "overview", label: "Overview", hint: "What this pass is" },
  { id: "who", label: "Who it’s for", hint: "Best-fit travelers" },
  { id: "how", label: "How it works", hint: "Intended flow" },
  { id: "pricing", label: "Pricing", hint: "$5 concept" },
  { id: "cta", label: "Get updates", hint: "Contact + alternatives" },
];

const whoFor = [
  "Travelers who want a lightweight paid option",
  "Visitors who want small perks without a full pass",
  "People who want to support the project and unlock basic benefits",
];

const howSteps = [
  "Buy a low-cost pass (when released).",
  "Use it to unlock basic perks and discovery prompts.",
  "Upgrade to a full pass if you want broader partner discounts.",
];

const whatsappSupportUrl =
  "https://wa.me/94777908790?text=Hi%20Ahangama%20-%20please%20notify%20me%20when%20the%20%245%20Ahangama%20Pass%20is%20available";

export default function Product5UsdAhangamaPassPage() {
  return (
    <>
      <Seo
        title="$5 Ahangama Pass"
        description="A low-cost pass concept for lightweight perks and a simple upgrade path."
        canonical={absUrl("/product/5usd-ahangama-pass")}
      />

      <ProductsWorkspaceLayout
        products={PRODUCTS_CATALOG}
        sections={sections}
        status="Planned"
        lastUpdated="May 2026"
      >
        <section id="overview" className="concept-section">
          <Card className="concept-card concept-heroCard" bordered={false}>
            <div className="concept-heroGrid">
              <div>
                <Text className="concept-heroEyebrow">$5 Ahangama Pass</Text>
                <Title className="concept-heroTitle">
                  A lightweight paid option.
                </Title>
                <Paragraph className="concept-bodyCopy concept-heroParagraph">
                  This product page outlines the planned $5 pass concept. It is
                  not purchasable on the site yet.
                </Paragraph>
                <Space wrap>
                  <Tag className="concept-pill">Planned</Tag>
                  <Tag className="concept-pill">Upgrade path</Tag>
                  <Tag className="concept-pill">Low friction</Tag>
                </Space>
              </div>

              <div className="concept-focusPanel">
                <Text className="concept-focusLabel">Positioning</Text>
                <Title level={4} className="concept-focusTitle">
                  Simple, paid, then upsell
                </Title>
                <div className="concept-focusList">
                  <div className="concept-focusItem">
                    <DollarOutlined />
                    <span>Low-cost entry</span>
                  </div>
                  <div className="concept-focusItem">
                    <StarOutlined />
                    <span>Basic perks</span>
                  </div>
                  <div className="concept-focusItem">
                    <RocketOutlined />
                    <span>Upgrade to full pass</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section id="who" className="concept-section">
          <Card className="concept-card concept-cardSection" bordered={false}>
            <Text className="concept-sectionEyebrow">Who it’s for</Text>
            <Title level={2} className="concept-sectionTitle">
              Best fit
            </Title>
            <List
              dataSource={whoFor}
              renderItem={(item) => <List.Item>{item}</List.Item>}
              className="concept-strategyList"
            />
          </Card>
        </section>

        <section id="how" className="concept-section">
          <Card className="concept-card concept-cardSection" bordered={false}>
            <Text className="concept-sectionEyebrow">How it works</Text>
            <Title level={2} className="concept-sectionTitle">
              Intended flow
            </Title>
            <Row gutter={[16, 16]}>
              {howSteps.map((step) => (
                <Col xs={24} md={8} key={step}>
                  <div className="concept-strategyChannel">
                    <RocketOutlined />
                    <span>{step}</span>
                  </div>
                </Col>
              ))}
            </Row>
            <Divider />
            <Alert
              type="info"
              showIcon
              message="Not available yet"
              description="This pass is planned. The checkout flow is not wired for a $5 product yet."
            />
          </Card>
        </section>

        <section id="pricing" className="concept-section">
          <Card className="concept-card concept-cardSection" bordered={false}>
            <Text className="concept-sectionEyebrow">Pricing</Text>
            <Title level={2} className="concept-sectionTitle">
              $5 (planned)
            </Title>
            <Paragraph className="concept-bodyCopy">
              For now, the paid options available on the site are the main
              Ahangama Pass products.
            </Paragraph>
            <Link to="/card" style={{ textDecoration: "none" }}>
              <Button>View Paid Pass Options</Button>
            </Link>
          </Card>
        </section>

        <section id="cta" className="concept-section">
          <Card className="concept-card concept-cardSection" bordered={false}>
            <Text className="concept-sectionEyebrow">Get updates</Text>
            <Title level={2} className="concept-sectionTitle">
              Contact + alternatives
            </Title>
            <Space wrap>
              <Button
                type="primary"
                icon={<MessageOutlined />}
                href={whatsappSupportUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Notify me on WhatsApp
              </Button>
              <Link to="/product/free-ahangama-pass" style={{ textDecoration: "none" }}>
                <Button>Use Free Pass</Button>
              </Link>
              <Link to="/products" style={{ textDecoration: "none" }}>
                <Button>All Products</Button>
              </Link>
            </Space>
          </Card>
        </section>
      </ProductsWorkspaceLayout>
    </>
  );
}
