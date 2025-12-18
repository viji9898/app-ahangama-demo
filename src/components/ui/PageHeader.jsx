import React from "react";
import { Card, Typography } from "antd";

const { Title, Paragraph } = Typography;

export default function PageHeader({ title, description }) {
  return (
    <Card
      style={{ borderRadius: 16, border: "1px solid #eee" }}
      bodyStyle={{ padding: 20 }}
    >
      <Title level={1} style={{ marginTop: 0 }}>
        {title}
      </Title>
      {description && (
        <Paragraph style={{ maxWidth: 820, marginBottom: 0 }}>
          {description}
        </Paragraph>
      )}
    </Card>
  );
}
