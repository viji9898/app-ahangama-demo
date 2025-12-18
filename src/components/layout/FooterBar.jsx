import React from "react";
import { Row, Col, Typography, Space, Button, Divider } from "antd";

const { Text } = Typography;

export default function FooterBar() {
  return (
    <div
      style={{ background: "#fff", borderTop: "1px solid #eee", padding: 16 }}
    >
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={10}>
            <Space direction="vertical" size={6}>
              <Text strong>ahangama.com</Text>
              <Text type="secondary">
                Curated destination guides + local privileges for independent
                travellers.
              </Text>
            </Space>
          </Col>

          <Col xs={24} md={8}>
            <Space direction="vertical" size={6}>
              <a href="/about">About</a>
              <a href="/partner">Partner with us</a>
              <a href="/card/terms">Card terms</a>
              <a href="/contact">Contact</a>
            </Space>
          </Col>

          <Col xs={24} md={6}>
            <Space direction="vertical" style={{ width: "100%" }} size={8}>
              <Button block href="/instagram">
                Instagram
              </Button>
              <Button block type="primary" href="/card">
                Get the Card
              </Button>
            </Space>
          </Col>
        </Row>

        <Divider style={{ margin: "14px 0" }} />
        <Text type="secondary" style={{ fontSize: 12 }}>
          © {new Date().getFullYear()} ahangama.com
        </Text>
      </div>
    </div>
  );
}
