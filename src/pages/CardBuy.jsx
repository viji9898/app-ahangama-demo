import React, { useState } from "react";
import { Card, Typography, Input, Button, Space, Alert } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { issueCard } from "../app/cardStore";
import { CARD_PRODUCT } from "../data/cardConfig";

const { Title, Paragraph, Text } = Typography;

export default function CardBuy() {
  const [name, setName] = useState("Guest");
  const [created, setCreated] = useState(null);

  const onBuy = () => {
    const card = issueCard({ purchaserName: name || "Guest" });
    setCreated(card);
  };

  return (
    <SiteLayout>
      <Seo
        title="Buy Ahangama Card"
        description="Dummy checkout for MVP"
        canonical={absUrl("/card/buy")}
      />

      <Card
        style={{ borderRadius: 16, border: "1px solid #eee" }}
        bodyStyle={{ padding: 20 }}
      >
        <Title level={2} style={{ marginTop: 0 }}>
          Buy (Dummy Checkout)
        </Title>
        <Paragraph type="secondary">
          This creates a card in <code>localStorage</code>. Later we’ll replace
          with Stripe + backend issuance.
        </Paragraph>

        <Space
          direction="vertical"
          size={10}
          style={{ width: "100%", maxWidth: 420 }}
        >
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name on card"
          />
          <Button type="primary" size="large" onClick={onBuy}>
            Pay USD {CARD_PRODUCT.priceUsd} (Dummy)
          </Button>
        </Space>

        {created && (
          <div style={{ marginTop: 14 }}>
            <Alert
              type="success"
              showIcon
              message="Card created"
              description={
                <div>
                  <Text>
                    <strong>Card ID:</strong> {created.cardId}
                  </Text>
                  <br />
                  <Text>
                    <strong>Valid until:</strong>{" "}
                    {new Date(created.validTo).toLocaleString()}
                  </Text>
                  <br />
                  <Button
                    style={{ marginTop: 10 }}
                    type="primary"
                    href="/card/my"
                  >
                    Go to My Card (QR)
                  </Button>
                </div>
              }
            />
          </div>
        )}
      </Card>
    </SiteLayout>
  );
}
