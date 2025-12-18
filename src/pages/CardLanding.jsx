import React from "react";
import { Card, Typography, Button, Row, Col, Tag, Space } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { CARD_PRODUCT } from "../data/cardConfig";

const { Title, Paragraph, Text } = Typography;

export default function CardLanding() {
  return (
    <SiteLayout>
      <Seo
        title="Ahangama Card"
        description="A $35 card that unlocks local privileges across selected venues in Ahangama."
        canonical={absUrl("/card")}
      />

      <Card
        style={{ borderRadius: 16, border: "1px solid #eee" }}
        bodyStyle={{ padding: 22 }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={16}>
            <Title level={1} style={{ marginTop: 0 }}>
              Ahangama Card
            </Title>
            <Paragraph style={{ fontSize: 16, maxWidth: 760 }}>
              A curated discount card designed for independent travellers
              staying more than a few days. Use it at selected venues for better
              value.
            </Paragraph>
            <Space wrap>
              <Tag>USD {CARD_PRODUCT.priceUsd}</Tag>
              <Tag>{CARD_PRODUCT.validityDays} days validity</Tag>
              {CARD_PRODUCT.validForOnePerson && (
                <Tag>Valid for one person</Tag>
              )}
              {CARD_PRODUCT.oncePerDayPerVenue && (
                <Tag>Once per day per venue</Tag>
              )}
            </Space>
          </Col>
          <Col xs={24} md={8}>
            <Button type="primary" size="large" block href="/card/buy">
              Buy (Dummy)
            </Button>
            <Button
              style={{ marginTop: 10 }}
              size="large"
              block
              href="/card/my"
            >
              View my card
            </Button>
            <Button style={{ marginTop: 10 }} block href="/card/verify">
              Vendor verify
            </Button>
            <Text
              type="secondary"
              style={{ display: "block", marginTop: 8, fontSize: 12 }}
            >
              MVP: purchase + verify + redemption tracking is local-only.
            </Text>
          </Col>
        </Row>
      </Card>
    </SiteLayout>
  );
}
