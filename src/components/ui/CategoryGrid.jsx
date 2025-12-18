import React from "react";
import { Card, Row, Col, Typography, Space } from "antd";

const { Title, Paragraph, Text } = Typography;

export default function CategoryGrid({ categories }) {
  return (
    <Row gutter={[12, 12]}>
      {categories.map((c) => {
        const Icon = c.icon;
        return (
          <Col xs={24} md={8} key={c.key}>
            <a href={c.basePath} style={{ textDecoration: "none" }}>
              <Card
                hoverable
                style={{ borderRadius: 16, border: "1px solid #eee" }}
                bodyStyle={{ padding: 16 }}
              >
                <Space align="start" size={12} style={{ width: "100%" }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      display: "grid",
                      placeItems: "center",
                      border: "1px solid #eee",
                      background: "#fafafa",
                      flex: "0 0 auto",
                    }}
                  >
                    <Icon style={{ fontSize: 18 }} />
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <Title level={4} style={{ margin: 0 }}>
                      {c.title}
                    </Title>
                    <Paragraph
                      type="secondary"
                      style={{ marginTop: 6, marginBottom: 0 }}
                    >
                      {c.description}
                    </Paragraph>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Explore →
                    </Text>
                  </div>
                </Space>
              </Card>
            </a>
          </Col>
        );
      })}
    </Row>
  );
}
