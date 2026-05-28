import React from "react";
import { Card, Col, Row, Space, Typography, Button } from "antd";
import { Link } from "react-router-dom";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import ProductsWorkspaceLayout from "../components/products/ProductsWorkspaceLayout";
import { PRODUCTS_CATALOG } from "../data/productsCatalog";

const { Paragraph, Text, Title } = Typography;

const sections = [
  { id: "overview", label: "Overview", hint: "What this page is" },
  { id: "products", label: "Products", hint: "Open each product" },
];

export default function ProductsIndexPage() {
  return (
    <>
      <Seo
        title="Ahangama Products"
        description="Explore Ahangama products including the 12 Must Do Things shortlist and pass concepts."
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
                <Text className="concept-heroEyebrow">Products</Text>
                <Title className="concept-heroTitle">Choose what to explore.</Title>
                <Paragraph className="concept-bodyCopy concept-heroParagraph">
                  This is the public products hub. Use the left navigation to
                  jump into each product and browse the sections inside.
                </Paragraph>
              </div>

              <div className="concept-focusPanel">
                <Text className="concept-focusLabel">Quick links</Text>
                <Title level={4} className="concept-focusTitle">
                  Start here
                </Title>
                <Space direction="vertical" size={10} style={{ width: "100%" }}>
                  <Button type="primary" href="/master-index" block>
                    Open Master Index
                  </Button>
                  <Button href="/card" block>
                    View Paid Pass Options
                  </Button>
                </Space>
              </div>
            </div>
          </Card>
        </section>

        <section id="products" className="concept-section">
          <Card className="concept-card concept-cardSection" bordered={false}>
            <Text className="concept-sectionEyebrow">Product list</Text>
            <Title level={2} className="concept-sectionTitle">
              Open a product
            </Title>

            <Row gutter={[16, 16]}>
              {PRODUCTS_CATALOG.map((product) => (
                <Col xs={24} md={12} xl={8} key={product.key}>
                  <Card className="concept-card" bordered={false}>
                    <Text className="concept-sectionEyebrow">{product.title}</Text>
                    <Title level={4} className="concept-sectionTitle">
                      {product.navLabel}
                    </Title>
                    <Paragraph className="concept-bodyCopy">
                      {product.description}
                    </Paragraph>
                    <Space>
                      <Link to={product.href} style={{ textDecoration: "none" }}>
                        <Button type="primary">Open</Button>
                      </Link>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </section>
      </ProductsWorkspaceLayout>
    </>
  );
}
