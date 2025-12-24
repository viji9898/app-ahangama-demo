import React, { useState } from "react";
import { Card, Typography, Button, Row, Col, Tag, Space } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { CARD_PRODUCTS } from "../data/cardConfig";
import PaymentModal from "../components/ui/PaymentModal";

const { Title, Paragraph, Text } = Typography;

export default function CardLanding() {
  const [paymentModal, setPaymentModal] = useState({
    visible: false,
    product: null,
  });

  const handlePurchase = (product) => {
    setPaymentModal({
      visible: true,
      product,
    });
  };

  const closePaymentModal = () => {
    setPaymentModal({
      visible: false,
      product: null,
    });
  };
  return (
    <SiteLayout>
      <Seo
        title="Ahangama Card"
        description="Choose from multiple pass options designed for different travel styles in Ahangama."
        canonical={absUrl("/card")}
      />

      <div style={{ marginBottom: 24 }}>
        <Title level={1} style={{ marginBottom: 8 }}>
          Ahangama Pass Options
        </Title>
        <Paragraph style={{ fontSize: 16, maxWidth: 760, marginBottom: 0 }}>
          Choose the pass that fits your travel style. All passes include
          curated discounts at selected venues.
        </Paragraph>
      </div>

      <Row gutter={[16, 24]}>
        {Object.values(CARD_PRODUCTS).map((product) => (
          <Col xs={24} md={12} lg={8} key={product.id}>
            <Card
              style={{
                borderRadius: 16,
                border: product.isPremium
                  ? "2px solid #FFD700"
                  : "1px solid #eee",
                height: "100%",
              }}
              bodyStyle={{ padding: 20 }}
            >
              {product.isPremium && (
                <Tag
                  color="gold"
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    fontWeight: "600",
                  }}
                >
                  PREMIUM
                </Tag>
              )}

              <Title
                level={3}
                style={{
                  marginTop: product.isPremium ? 16 : 0,
                  marginBottom: 8,
                }}
              >
                {product.name}
              </Title>

              <div style={{ marginBottom: 12 }}>
                <Text
                  style={{ fontSize: 24, fontWeight: "600", color: "#1890ff" }}
                >
                  ${product.priceUsd}
                </Text>
              </div>

              <Paragraph style={{ fontSize: 14, color: "#666", minHeight: 40 }}>
                {product.description}
              </Paragraph>

              <Space wrap style={{ marginBottom: 16 }}>
                <Tag>{product.validityDays} days</Tag>
                <Tag>
                  {product.maxPeople}{" "}
                  {product.maxPeople === 1 ? "person" : "people"}
                </Tag>
                {product.isLimited && <Tag color="orange">Limited venues</Tag>}
              </Space>

              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ fontSize: 12, color: "#666" }}>
                  Best for: {product.bestFor}
                </Text>
              </div>

              <Button
                type={product.isPremium ? "primary" : "default"}
                size="large"
                block
                onClick={() => handlePurchase(product)}
                style={
                  product.isPremium
                    ? {
                        background: "linear-gradient(135deg, #FFD700, #FFA500)",
                        border: "none",
                        color: "#fff",
                      }
                    : {}
                }
              >
                Get {product.name.replace("Ahangama ", "")}
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      <Card
        style={{ borderRadius: 16, border: "1px solid #eee", marginTop: 24 }}
        bodyStyle={{ padding: 22 }}
      >
        <Title level={4}>Already have a pass?</Title>
        <Space>
          <Button size="large" href="/card/my">
            View my card
          </Button>
          <Button size="large" href="/card/verify">
            Vendor verify
          </Button>
        </Space>
        <Text
          type="secondary"
          style={{ display: "block", marginTop: 12, fontSize: 12 }}
        >
          Secure payments powered by Stripe. QR codes delivered instantly.
        </Text>
      </Card>

      <PaymentModal
        visible={paymentModal.visible}
        onCancel={closePaymentModal}
        product={paymentModal.product}
      />
    </SiteLayout>
  );
}
