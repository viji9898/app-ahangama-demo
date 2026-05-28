import React from "react";
import { Card, Col, Divider, List, Row, Space, Tag, Typography, Button } from "antd";
import {
  GiftOutlined,
  MessageOutlined,
  QrcodeOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import ProductsWorkspaceLayout from "../components/products/ProductsWorkspaceLayout";
import { PRODUCTS_CATALOG } from "../data/productsCatalog";

const { Paragraph, Text, Title } = Typography;

const sections = [
  { id: "overview", label: "Overview", hint: "What the free pass is" },
  { id: "who", label: "Who it’s for", hint: "Best-fit travelers" },
  { id: "how", label: "How it works", hint: "From scan to onboarding" },
  { id: "pricing", label: "Pricing", hint: "Free" },
  { id: "cta", label: "Get started", hint: "Primary actions" },
];

const whoFor = [
  "Travelers who want quick recommendations",
  "Visitors who want reminders + an easy way back to places",
  "Anyone who prefers a simple onboarding path into Ahangama discovery",
];

const howSteps = [
  "Scan a QR code or open the product page.",
  "Get the free guide via WhatsApp and start exploring.",
  "Use the recommendations to plan and return to venues.",
];

const whatsappGuideUrl =
  "https://wa.me/94777908790?text=please%20send%20me%20the%20Ahangama%20Guide";

export default function ProductFreeAhangamaPassPage() {
  return (
    <>
      <Seo
        title="Free Ahangama Pass"
        description="A free onboarding layer: guide-first discovery, communication, and a path into premium experiences."
        canonical={absUrl("/product/free-ahangama-pass")}
      />

      <ProductsWorkspaceLayout
        products={PRODUCTS_CATALOG}
        sections={sections}
        status="Free access"
        lastUpdated="May 2026"
      >
        <section id="overview" className="concept-section">
          <Card className="concept-card concept-heroCard" bordered={false}>
            <div className="concept-heroGrid">
              <div>
                <Text className="concept-heroEyebrow">Free Ahangama Pass</Text>
                <Title className="concept-heroTitle">Start exploring for $0.</Title>
                <Paragraph className="concept-bodyCopy concept-heroParagraph">
                  The Free Ahangama Pass is designed to make discovery simple:
                  guide-first recommendations, frictionless onboarding, and a
                  clear path into premium products.
                </Paragraph>
                <Space wrap>
                  <Tag className="concept-pill">Free</Tag>
                  <Tag className="concept-pill">Discovery</Tag>
                  <Tag className="concept-pill">Onboarding</Tag>
                </Space>
              </div>

              <div className="concept-focusPanel">
                <Text className="concept-focusLabel">What it unlocks</Text>
                <Title level={4} className="concept-focusTitle">
                  A simple funnel
                </Title>
                <div className="concept-focusList">
                  <div className="concept-focusItem">
                    <GiftOutlined />
                    <span>Free guide access</span>
                  </div>
                  <div className="concept-focusItem">
                    <MessageOutlined />
                    <span>WhatsApp onboarding</span>
                  </div>
                  <div className="concept-focusItem">
                    <WalletOutlined />
                    <span>Wallet-style recall</span>
                  </div>
                  <div className="concept-focusItem">
                    <QrcodeOutlined />
                    <span>QR touchpoints</span>
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
              3 steps
            </Title>
            <Row gutter={[16, 16]}>
              {howSteps.map((step) => (
                <Col xs={24} md={8} key={step}>
                  <div className="concept-strategyChannel">
                    <QrcodeOutlined />
                    <span>{step}</span>
                  </div>
                </Col>
              ))}
            </Row>
            <Divider />
            <Paragraph className="concept-bodyCopy">
              If you want a paid pass with partner perks and discounts, you can
              view the current paid options.
            </Paragraph>
            <Link to="/card" style={{ textDecoration: "none" }}>
              <Button>Paid Pass Options</Button>
            </Link>
          </Card>
        </section>

        <section id="pricing" className="concept-section">
          <Card className="concept-card concept-cardSection" bordered={false}>
            <Text className="concept-sectionEyebrow">Pricing</Text>
            <Title level={2} className="concept-sectionTitle">
              $0
            </Title>
            <Paragraph className="concept-bodyCopy">
              The free pass is an onboarding product. It’s meant to help you
              discover the best experiences and stay connected.
            </Paragraph>
          </Card>
        </section>

        <section id="cta" className="concept-section">
          <Card className="concept-card concept-cardSection" bordered={false}>
            <Text className="concept-sectionEyebrow">Get started</Text>
            <Title level={2} className="concept-sectionTitle">
              Choose an action
            </Title>
            <Space wrap>
              <Button
                type="primary"
                href={whatsappGuideUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Guide via WhatsApp
              </Button>
              <Link to="/master-index" style={{ textDecoration: "none" }}>
                <Button>Master Index</Button>
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
