import React from "react";
import { Card, Col, Divider, List, Row, Space, Tag, Typography, Button } from "antd";
import { CompassOutlined, ReadOutlined, StarOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import ProductsWorkspaceLayout from "../components/products/ProductsWorkspaceLayout";
import { PRODUCTS_CATALOG } from "../data/productsCatalog";

const { Paragraph, Text, Title } = Typography;

const sections = [
  { id: "overview", label: "Overview", hint: "What this product is" },
  { id: "who", label: "Who it’s for", hint: "Best-fit travelers" },
  { id: "how", label: "How it works", hint: "Use the shortlist" },
  { id: "pricing", label: "Pricing", hint: "$49–79 USD" },
  { id: "cta", label: "Next steps", hint: "Open experiences" },
];

const whoFor = [
  "First-time visitors who want a clear plan",
  "Short stays where you need the best picks fast",
  "Anyone who prefers curated experiences over endless scrolling",
];

const howSteps = [
  "Start at the Master Index to browse recommended experiences.",
  "Pick 2–4 experiences per day (mix food + wellness + activity).",
  "Use the map or category pages to find what’s nearby.",
];

export default function ProductTwelveMustDoThingsPage() {
  return (
    <>
      <Seo
        title="12 Must Do Things in Ahangama"
        description="A curated shortlist that anchors the Ahangama discovery experience."
        canonical={absUrl("/product/12-must-do-things")}
      />

      <ProductsWorkspaceLayout
        products={PRODUCTS_CATALOG}
        sections={sections}
        status="Experience bundle"
        lastUpdated="May 2026"
      >
        <section id="overview" className="concept-section">
          <Card className="concept-card concept-heroCard" bordered={false}>
            <div className="concept-heroGrid">
              <div>
                <Text className="concept-heroEyebrow">12 Must Do Things</Text>
                <Title className="concept-heroTitle">
                  The curated Ahangama experience bundle.
                </Title>
                <Paragraph className="concept-bodyCopy concept-heroParagraph">
                  A premium experience product inspired by city attraction
                  passes — bundling the best activities, wellness, food,
                  movement, and local culture into one curated package.
                </Paragraph>
                <Space wrap>
                  <Tag className="concept-pill">Curated</Tag>
                  <Tag className="concept-pill">Bundle</Tag>
                  <Tag className="concept-pill">Best of Ahangama</Tag>
                </Space>
              </div>

              <div className="concept-focusPanel">
                <Text className="concept-focusLabel">Primary outcome</Text>
                <Title level={4} className="concept-focusTitle">
                  Know what to do next
                </Title>
                <div className="concept-focusList">
                  <div className="concept-focusItem">
                    <StarOutlined />
                    <span>Less research, better picks</span>
                  </div>
                  <div className="concept-focusItem">
                    <CompassOutlined />
                    <span>See what’s nearby</span>
                  </div>
                  <div className="concept-focusItem">
                    <ReadOutlined />
                    <span>Use categories + map</span>
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
              A simple flow
            </Title>
            <Row gutter={[16, 16]}>
              {howSteps.map((step) => (
                <Col xs={24} md={8} key={step}>
                  <div className="concept-strategyChannel">
                    <CompassOutlined />
                    <span>{step}</span>
                  </div>
                </Col>
              ))}
            </Row>
            <Divider />
            <Paragraph className="concept-bodyCopy">
              If you want discounts and partner perks, you can also explore the
              paid pass options.
            </Paragraph>
            <Space wrap>
              <Link to="/card" style={{ textDecoration: "none" }}>
                <Button type="default">Paid Pass Options</Button>
              </Link>
              <Link to="/map" style={{ textDecoration: "none" }}>
                <Button type="default">Open Map</Button>
              </Link>
            </Space>
          </Card>
        </section>

        <section id="pricing" className="concept-section">
          <Card className="concept-card concept-cardSection" bordered={false}>
            <Text className="concept-sectionEyebrow">Pricing</Text>
            <Title level={2} className="concept-sectionTitle">
              $49–79 USD
            </Title>
            <Paragraph className="concept-bodyCopy">
              The bundle is designed as a curated package with exclusive
              pricing across multiple partner venues.
            </Paragraph>
          </Card>
        </section>

        <section id="cta" className="concept-section">
          <Card className="concept-card concept-cardSection" bordered={false}>
            <Text className="concept-sectionEyebrow">Next steps</Text>
            <Title level={2} className="concept-sectionTitle">
              Open the experiences
            </Title>
            <Space wrap>
              <Link to="/master-index" style={{ textDecoration: "none" }}>
                <Button type="primary">Master Index</Button>
              </Link>
              <Link to="/eat" style={{ textDecoration: "none" }}>
                <Button>Eat & Drink</Button>
              </Link>
              <Link to="/wellness" style={{ textDecoration: "none" }}>
                <Button>Wellness</Button>
              </Link>
            </Space>
          </Card>
        </section>
      </ProductsWorkspaceLayout>
    </>
  );
}
