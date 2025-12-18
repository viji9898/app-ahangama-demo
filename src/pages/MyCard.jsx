import React from "react";
import { Card, Typography, Tag, Space, Button, Alert } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { getLatestCard } from "../app/cardStore";
import { CARD_PRODUCT } from "../data/cardConfig";
import { QRCodeSVG } from "qrcode.react";

const { Title, Paragraph, Text } = Typography;

export default function MyCard() {
  const card = getLatestCard();
  const verifyUrl = card
    ? absUrl(`/card/verify/${encodeURIComponent(card.cardId)}`)
    : null;

  return (
    <SiteLayout>
      <Seo
        title="My Ahangama Card"
        description="Your card and QR code"
        canonical={absUrl("/card/my")}
      />

      <Card
        style={{ borderRadius: 16, border: "1px solid #eee" }}
        bodyStyle={{ padding: 20 }}
      >
        <Title level={2} style={{ marginTop: 0 }}>
          My Card
        </Title>

        {!card ? (
          <Alert
            type="warning"
            showIcon
            message="No card found"
            description={
              <Button type="primary" href="/card/buy">
                Buy a card (dummy)
              </Button>
            }
          />
        ) : (
          <>
            <Paragraph type="secondary" style={{ marginBottom: 10 }}>
              Show this QR to the vendor. Vendor checks validity + optional
              once/day rule.
            </Paragraph>

            <Space wrap>
              <Tag>Card ID: {card.cardId}</Tag>
              <Tag>
                {CARD_PRODUCT.validForOnePerson
                  ? "Valid for one person"
                  : "Multi-person"}
              </Tag>
              {CARD_PRODUCT.oncePerDayPerVenue && (
                <Tag>Once per day per venue</Tag>
              )}
            </Space>

            <div style={{ marginTop: 14 }}>
              <Text strong>QR contains:</Text>
              <div style={{ marginTop: 6 }}>
                <Text type="secondary">{verifyUrl}</Text>
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <QRCodeSVG value={verifyUrl} size={220} includeMargin />
            </div>

            <div style={{ marginTop: 14 }}>
              <Button type="primary" href={verifyUrl}>
                Open vendor verify link
              </Button>
              <Button style={{ marginLeft: 10 }} href="/card">
                Back
              </Button>
            </div>
          </>
        )}
      </Card>
    </SiteLayout>
  );
}
