import React from "react";
import { Card, Typography, Tag, Space, Button } from "antd";

const { Title, Paragraph, Text } = Typography;

export default function PlaceCard({ place, basePath = "/eat" }) {
  return (
    <Card
      hoverable
      style={{ borderRadius: 16, border: "1px solid #eee" }}
      bodyStyle={{ padding: 16 }}
    >
      <div
        style={{
          height: 150,
          borderRadius: 14,
          background: `url(${place.image}) center/cover no-repeat`,
          border: "1px solid rgba(0,0,0,0.06)",
          marginBottom: 12,
        }}
      />
      <Title level={4} style={{ marginBottom: 6 }}>
        {place.name}
      </Title>
      <Paragraph type="secondary" style={{ marginBottom: 10 }}>
        {place.excerpt}
      </Paragraph>

      <Space wrap size={[6, 6]} style={{ marginBottom: 10 }}>
        {(place.bestFor || []).slice(0, 4).map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </Space>

      {place.cardPerk && <Tag color="green">{place.cardPerk}</Tag>}

      <div style={{ marginTop: 10 }}>
        <Button type="primary" href={`${basePath}/${place.slug}`}>
          View
        </Button>
      </div>

      <Text
        type="secondary"
        style={{ fontSize: 12, display: "block", marginTop: 8 }}
      >
        {place.area} · {place.price}
      </Text>
    </Card>
  );
}
