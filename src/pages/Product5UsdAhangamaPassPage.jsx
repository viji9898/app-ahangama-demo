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
  { id: "pricing", label: "Pricing", hint: "$7 USD" },
  { id: "cta", label: "Get updates", hint: "Contact + alternatives" },
];

const whoFor = [
  "Travelers staying 3–14 days who want easy savings",
  "Visitors who want curated access to great venues",
  "Anyone who wants perks without planning from scratch",
];

const howSteps = [
  "Get Pass+ (when available).",
  "Use it at partner venues for member pricing and perks.",
  "Discover experiences faster with curated recommendations.",
];

const whatsappSupportUrl =
  "https://wa.me/94777422274?text=Hi%20Ahangama%20-%20please%20notify%20me%20when%20Pass%2B%20is%20available";

export default function Product5UsdAhangamaPassPage() {
  return (
    <>
      <Seo
        title="Ahangama Pass+"
        description="A lightweight paid membership designed for travelers who want curated perks across Ahangama."
        canonical={absUrl("/product/pass-plus")}
      />

      <ProductsWorkspaceLayout
        products={PRODUCTS_CATALOG}
        sections={sections}
        status="Pass+"
        lastUpdated="May 2026"
      >
        <section id="overview" className="concept-section">
          <Card className="concept-card concept-heroCard" bordered={false}>
            <div className="concept-heroGrid">
              <div>
                <Text className="concept-heroEyebrow">Ahangama Pass+</Text>
                <Title className="concept-heroTitle">
                  Unlock local perks across Ahangama.
                </Title>
                <Paragraph className="concept-bodyCopy concept-heroParagraph">
                  A lightweight paid membership designed for travelers who want
                  insider pricing, curated access, and benefits across
                  Ahangama’s best venues.
                </Paragraph>
                <Space wrap>
                  <Tag className="concept-pill">Member pricing</Tag>
                  <Tag className="concept-pill">Curated access</Tag>
                  <Tag className="concept-pill">Wallet pass</Tag>
                </Space>
              </div>

              <div className="concept-focusPanel">
                <Text className="concept-focusLabel">Positioning</Text>
                <Title level={4} className="concept-focusTitle">
                  Perks + access
                </Title>
                <div className="concept-focusList">
                  <div className="concept-focusItem">
                    <DollarOutlined />
                    <span>Member pricing</span>
                  </div>
                  <div className="concept-focusItem">
                    <StarOutlined />
                    <span>Partner perks</span>
                  </div>
                  <div className="concept-focusItem">
                    <RocketOutlined />
                    <span>Curated recommendations</span>
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
              description="This pass is planned. The checkout flow is not wired for Pass+ yet."
            />
          </Card>
        </section>

        <section id="pricing" className="concept-section">
          <Card className="concept-card concept-cardSection" bordered={false}>
            <Text className="concept-sectionEyebrow">Pricing</Text>
            <Title level={2} className="concept-sectionTitle">
              $7 USD
            </Title>
            <Paragraph className="concept-bodyCopy">
              Pass+ is positioned as a lightweight paid membership. If you want
              the full list of available paid pass options, open the pass
              section.
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
                Notify me about Pass+
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
