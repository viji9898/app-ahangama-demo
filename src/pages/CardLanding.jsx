import React, { useState } from "react";
import {
  Card,
  Typography,
  Button,
  Row,
  Col,
  Tag,
  Space,
  List,
  Divider,
} from "antd";
import {
  CheckOutlined,
  CrownOutlined,
  ClockCircleOutlined,
  UserOutlined,
  StarOutlined,
} from "@ant-design/icons";
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

      <div className="dm-heroCut" />
      <div className="dm-canvas">
        <div className="dm-wrap">
          <div style={{ marginBottom: 32 }}>
            <Title
              level={1}
              style={{
                marginBottom: 12,
                fontSize: "clamp(28px, 6vw, 42px)",
                fontWeight: 700,
                color: "var(--ink-primary, #1f2a24)",
                lineHeight: 1.1,
              }}
            >
              Ahangama Pass Options
            </Title>
            <Paragraph
              style={{
                fontSize: "clamp(16px, 3vw, 18px)",
                maxWidth: 680,
                marginBottom: 0,
                color: "var(--ink-muted, #6b6f6a)",
                lineHeight: 1.6,
              }}
            >
              Choose the pass that fits your travel style. All passes include
              curated discounts at selected venues.
            </Paragraph>
          </div>

          <Card
            style={{
              borderRadius: "var(--radius-lg, 22px)",
              border: "1px solid rgba(31, 42, 36, 0.08)",
              background: "var(--bg-card, #faf8f4)",
              marginBottom: 32,
              boxShadow:
                "var(--shadow-soft, 0 12px 32px rgba(31, 42, 36, 0.08))",
            }}
            bodyStyle={{ padding: "clamp(16px, 4vw, 32px)" }}
          >
            <List
              dataSource={Object.values(CARD_PRODUCTS)}
              renderItem={(product) => (
                <List.Item
                  key={product.id}
                  style={{
                    padding: "clamp(16px, 3vw, 24px) 0",
                    border: "none",
                    borderBottom: "1px solid rgba(31, 42, 36, 0.06)",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "16px",
                    alignItems: "flex-start",
                  }}
                  actions={[
                    <Button
                      key="purchase"
                      type={product.isPopular ? "primary" : "default"}
                      size="large"
                      onClick={() => handlePurchase(product)}
                      style={
                        product.isPopular
                          ? {
                              background: "var(--ocean-blue, #4f6f86)",
                              border: "none",
                              color: "#fff",
                              minWidth: "160px",
                              height: 48,
                              borderRadius: "var(--radius-md, 16px)",
                              fontSize: "16px",
                              fontWeight: 600,
                              boxShadow: "0 4px 12px rgba(79, 111, 134, 0.25)",
                              transition: "all 0.3s ease",
                              flexShrink: 0,
                            }
                          : {
                              minWidth: "160px",
                              height: 48,
                              borderRadius: "var(--radius-md, 16px)",
                              fontSize: "16px",
                              border: "1px solid rgba(31, 42, 36, 0.12)",
                              color: "var(--ink-muted, #6b6f6a)",
                              transition: "all 0.3s ease",
                              flexShrink: 0,
                            }
                      }
                      onMouseEnter={
                        product.isPopular
                          ? (e) => {
                              e.target.style.background =
                                "var(--ocean-blue-hover, #435f73)";
                              e.target.style.transform = "translateY(-1px)";
                              e.target.style.boxShadow =
                                "0 6px 20px rgba(79, 111, 134, 0.35)";
                            }
                          : (e) => {
                              e.target.style.borderColor =
                                "var(--ocean-blue, #4f6f86)";
                              e.target.style.color =
                                "var(--ocean-blue, #4f6f86)";
                              e.target.style.transform = "translateY(-1px)";
                            }
                      }
                      onMouseLeave={
                        product.isPopular
                          ? (e) => {
                              e.target.style.background =
                                "var(--ocean-blue, #4f6f86)";
                              e.target.style.transform = "translateY(0)";
                              e.target.style.boxShadow =
                                "0 4px 12px rgba(79, 111, 134, 0.25)";
                            }
                          : (e) => {
                              e.target.style.borderColor =
                                "rgba(31, 42, 36, 0.12)";
                              e.target.style.color =
                                "var(--ink-muted, #6b6f6a)";
                              e.target.style.transform = "translateY(0)";
                            }
                      }
                    >
                      Get ${product.priceUsd}
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      product.isPopular ? (
                        <div
                          style={{
                            width: "clamp(44px, 8vw, 52px)",
                            height: "clamp(44px, 8vw, 52px)",
                            borderRadius: "50%",
                            background: "var(--ocean-blue, #4f6f86)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 12px rgba(79, 111, 134, 0.25)",
                            flexShrink: 0,
                          }}
                        >
                          <StarOutlined
                            style={{ color: "#fff", fontSize: 22 }}
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            width: "clamp(44px, 8vw, 52px)",
                            height: "clamp(44px, 8vw, 52px)",
                            borderRadius: "50%",
                            background: "rgba(31, 42, 36, 0.06)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <CheckOutlined
                            style={{
                              color: "var(--ocean-blue, #4f6f86)",
                              fontSize: 22,
                            }}
                          />
                        </div>
                      )
                    }
                    title={
                      <div>
                        <Space>
                          <Text
                            strong
                            style={{
                              fontSize: "clamp(18px, 4vw, 20px)",
                              color: "var(--ink-primary, #1f2a24)",
                              fontWeight: 700,
                            }}
                          >
                            {product.name}
                          </Text>
                          {product.isPopular && (
                            <Tag
                              style={{
                                fontWeight: "600",
                                background: "var(--ocean-blue, #4f6f86)",
                                color: "white",
                                border: "none",
                                borderRadius: "999px",
                              }}
                            >
                              MOST POPULAR
                            </Tag>
                          )}
                        </Space>
                      </div>
                    }
                    description={
                      <div>
                        <Paragraph
                          style={{
                            margin: "10px 0 16px 0",
                            fontSize: "clamp(15px, 3vw, 16px)",
                            color: "var(--ink-muted, #6b6f6a)",
                            lineHeight: 1.6,
                          }}
                        >
                          {product.description}
                        </Paragraph>

                        <Space
                          wrap
                          style={{
                            marginBottom: 16,
                            gap: "clamp(4px, 2vw, 8px)",
                          }}
                        >
                          <Tag
                            icon={<ClockCircleOutlined />}
                            style={{
                              background: "rgba(31, 42, 36, 0.06)",
                              color: "var(--ink-muted, #6b6f6a)",
                              border: "none",
                              borderRadius: "999px",
                              padding: "4px 12px",
                            }}
                          >
                            {product.validityDays} days
                          </Tag>
                          <Tag
                            icon={<UserOutlined />}
                            style={{
                              background: "rgba(31, 42, 36, 0.06)",
                              color: "var(--ink-muted, #6b6f6a)",
                              border: "none",
                              borderRadius: "999px",
                              padding: "4px 12px",
                            }}
                          >
                            {product.maxPeople}{" "}
                            {product.maxPeople === 1 ? "person" : "people"}
                          </Tag>
                        </Space>

                        <div style={{ marginBottom: 12 }}>
                          <Text
                            strong
                            style={{
                              fontSize: "clamp(12px, 2.5vw, 13px)",
                              color: "var(--ink-primary, #1f2a24)",
                              display: "block",
                              fontWeight: 600,
                            }}
                          >
                            Best for: {product.bestFor}
                          </Text>
                        </div>

                        <div>
                          <Text
                            style={{
                              fontSize: "clamp(12px, 2.5vw, 13px)",
                              color: "var(--ink-primary, #1f2a24)",
                              fontWeight: 600,
                              marginBottom: 8,
                              display: "block",
                            }}
                          >
                            Features:
                          </Text>
                          <Space
                            wrap
                            size={[
                              "clamp(4px, 1vw, 6px)",
                              "clamp(4px, 1vw, 6px)",
                            ]}
                          >
                            {product.features.map((feature, index) => (
                              <Text
                                key={index}
                                style={{
                                  fontSize: "clamp(11px, 2vw, 12px)",
                                  color: "var(--ink-muted, #6b6f6a)",
                                  background: "rgba(31, 42, 36, 0.04)",
                                  padding:
                                    "clamp(3px, 1vw, 4px) clamp(8px, 2vw, 10px)",
                                  borderRadius: "8px",
                                  border: "1px solid rgba(31, 42, 36, 0.08)",
                                }}
                              >
                                {feature}
                              </Text>
                            ))}
                          </Space>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </div>

      <PaymentModal
        visible={paymentModal.visible}
        onCancel={closePaymentModal}
        product={paymentModal.product}
      />
    </SiteLayout>
  );
}
