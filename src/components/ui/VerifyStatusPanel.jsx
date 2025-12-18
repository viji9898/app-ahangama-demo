import React from "react";
import { Card, Typography, Space, Button, Tag } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const STYLES = {
  success: {
    border: "1px solid #b7eb8f",
    bg: "#f6ffed",
    icon: <CheckCircleOutlined style={{ fontSize: 30 }} />,
    title: "VALID",
  },
  error: {
    border: "1px solid #ffa39e",
    bg: "#fff1f0",
    icon: <CloseCircleOutlined style={{ fontSize: 30 }} />,
    title: "NOT VALID",
  },
  warning: {
    border: "1px solid #ffe58f",
    bg: "#fffbe6",
    icon: <ExclamationCircleOutlined style={{ fontSize: 30 }} />,
    title: "CHECK",
  },
  idle: {
    border: "1px solid #eee",
    bg: "#fff",
    icon: <QrcodeOutlined style={{ fontSize: 30 }} />,
    title: "SCAN CARD",
  },
};

export default function VerifyStatusPanel({
  state = "idle", // idle | success | warning | error
  headline,
  message,
  venue,
  cardId,
  canRedeem,
  onRedeem,
}) {
  const s = STYLES[state] || STYLES.idle;

  return (
    <Card
      style={{ borderRadius: 16, border: s.border, background: s.bg }}
      bodyStyle={{ padding: 18 }}
    >
      <Space align="center" size={12}>
        {s.icon}
        <div style={{ minWidth: 0 }}>
          <Title level={3} style={{ margin: 0, letterSpacing: 0.5 }}>
            {headline || s.title}
          </Title>
          {message && <Text type="secondary">{message}</Text>}
        </div>
      </Space>

      <div style={{ marginTop: 12 }}>
        <Space wrap>
          {venue?.name && <Tag>Venue: {venue.name}</Tag>}
          {venue?.id && <Tag>Venue ID: {venue.id}</Tag>}
          {cardId && <Tag>Card: {cardId}</Tag>}
          {venue?.perk && <Tag color="green">Perk: {venue.perk}</Tag>}
        </Space>
      </div>

      {canRedeem && (
        <Button
          type="primary"
          size="large"
          block
          style={{ marginTop: 14, height: 48, fontSize: 16 }}
          onClick={onRedeem}
        >
          Redeem Now
        </Button>
      )}
    </Card>
  );
}
