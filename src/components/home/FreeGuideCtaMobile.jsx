import React from "react";
import { Card, Typography, Button } from "antd";

const { Title, Text, Paragraph } = Typography;

export default function FreeGuideCtaMobile({ onGuideClick }) {
  return (
    <Card
      style={{
        borderRadius: 16,
        border: "1px solid rgba(0,0,0,0.06)",
        background:
          "linear-gradient(135deg, rgba(37,211,102,0.05) 0%, rgba(255,255,255,0.9) 100%)",
      }}
      bodyStyle={{ padding: 16 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #25D366, #128C7E)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            flexShrink: 0,
          }}
        >
          📄
        </div>
        <div style={{ flex: 1 }}>
          <Title
            level={4}
            style={{
              margin: 0,
              color: "#2F3349",
              fontSize: "18px",
            }}
          >
            Free Ahangama Guide
          </Title>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Comprehensive offline guide
          </Text>
        </div>
      </div>

      <Paragraph
        style={{
          marginBottom: 16,
          fontSize: "14px",
          color: "#5A6C7D",
          lineHeight: 1.5,
        }}
      >
        Get our complete PDF guide sent directly to WhatsApp. Perfect for
        offline reading and planning your itinerary.
      </Paragraph>

      <Button
        type="primary"
        size="large"
        onClick={onGuideClick}
        block
        style={{
          background: "linear-gradient(135deg, #25D366, #128C7E)",
          borderColor: "transparent",
          borderRadius: "10px",
          height: "44px",
          fontWeight: "600",
          boxShadow: "0 3px 8px rgba(37,211,102,0.25)",
          border: "none",
        }}
        icon={<span style={{ fontSize: "14px", marginRight: "4px" }}>💬</span>}
      >
        Get Guide via WhatsApp
      </Button>
    </Card>
  );
}
