import React from "react";
import { Typography, Button, Space, Tag } from "antd";
import {
  QrcodeOutlined,
  ArrowRightOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { PLACES } from "../../data/places";

const { Title, Paragraph, Text } = Typography;

export default function HeroSectionMobile({ heroImage }) {
  return (
    <div className="ahg-hero" style={{ marginBottom: 0 }}>
      {/* Hero Image */}
      {heroImage && (
        <div
          style={{
            marginBottom: "16px",
            borderRadius: "0px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <img
            src={heroImage}
            alt="Ahangama"
            style={{
              width: "100%",
              height: "240px",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      )}

      <div className="ahg-heroInner" style={{ padding: "0 16px" }}>
        <div className="ahg-pillRow" style={{ marginBottom: "16px" }}>
          <Tag
            className="ahg-pill"
            icon={<ThunderboltOutlined />}
            style={{
              fontSize: "11px",
              padding: "4px 8px",
            }}
          >
            Curated
          </Tag>
          <Tag
            className="ahg-pill"
            style={{
              fontSize: "11px",
              padding: "4px 8px",
            }}
          >
            FIT-friendly
          </Tag>
          <Tag
            className="ahg-pill"
            icon={<QrcodeOutlined />}
            style={{
              fontSize: "11px",
              padding: "4px 8px",
            }}
          >
            Discount card
          </Tag>
        </div>

        {/* <Title
          className="ahg-h1"
          style={{
            fontSize: "28px",
            lineHeight: 1.2,
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          Ahangama,
          <br />
          but curated.
        </Title> */}

        <Paragraph
          className="ahg-sub"
          style={{
            fontSize: "16px",
            lineHeight: 1.5,
            marginBottom: "20px",
            textAlign: "center",
            color: "#5A6C7D",
          }}
        >
          A clean guide to stays, food, and experiences — plus a{" "}
          <strong>$18 card</strong> that unlocks local privileges.
        </Paragraph>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <Button
            type="primary"
            size="large"
            href="/eat"
            icon={<ArrowRightOutlined />}
            block
            style={{
              borderRadius: "10px",
              height: "48px",
              fontWeight: "600",
              fontSize: "16px",
            }}
          >
            Start exploring
          </Button>
          <Button
            size="large"
            href="/card"
            icon={<QrcodeOutlined />}
            block
            style={{
              borderRadius: "10px",
              height: "44px",
              fontWeight: "500",
            }}
          >
            Get the Card
          </Button>
        </div>

        <div
          className="ahg-metrics"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "24px",
            marginTop: "16px",
            marginBottom: "16px",
          }}
        >
          <div className="ahg-metric" style={{ textAlign: "center" }}>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Curated places
            </Text>
            <div
              className="ahg-metricVal"
              style={{ fontSize: "20px", fontWeight: "700" }}
            >
              {PLACES.filter((p) => p.destinationSlug === "ahangama").length}
            </div>
          </div>
          <div className="ahg-metric" style={{ textAlign: "center" }}>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Card
            </Text>
            <div
              className="ahg-metricVal"
              style={{ fontSize: "20px", fontWeight: "700" }}
            >
              $18
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
