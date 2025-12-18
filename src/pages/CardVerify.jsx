import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Typography,
  Input,
  Button,
  Space,
  Alert,
  Select,
  Tag,
} from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { VENDORS } from "../data/vendors";
import { CARD_PRODUCT } from "../data/cardConfig";
import { getCard, isCardValidNow, canRedeem, redeem } from "../app/cardStore";

const { Title, Paragraph, Text } = Typography;

export default function CardVerify() {
  const params = useParams();
  const prefill = params.cardId ? decodeURIComponent(params.cardId) : "";

  const [cardId, setCardId] = useState(prefill);
  const [venueId, setVenueId] = useState(VENDORS[0]?.id);
  const [result, setResult] = useState(null);

  const venue = useMemo(
    () => VENDORS.find((v) => v.id === venueId) || null,
    [venueId]
  );

  const onCheck = () => {
    setResult(null);

    if (!cardId) {
      setResult({
        type: "error",
        title: "Missing Card ID",
        msg: "Enter or scan a Card ID.",
      });
      return;
    }

    const card = getCard(cardId);
    const validity = isCardValidNow(card);
    if (!validity.ok) {
      setResult({ type: "error", title: "Invalid card", msg: validity.reason });
      return;
    }

    if (CARD_PRODUCT.oncePerDayPerVenue) {
      const r = canRedeem({ cardId, venueId });
      if (!r.ok) {
        setResult({
          type: "warning",
          title: "Already redeemed today",
          msg: `This card has already been used at this venue today (${r.dateKey}).`,
        });
        return;
      }
    }

    setResult({
      type: "success",
      title: "Card valid",
      msg: `Valid card. ${venue ? `Perk: ${venue.perk}` : ""}`,
      canRedeem: true,
    });
  };

  const onRedeem = () => {
    const card = getCard(cardId);
    const validity = isCardValidNow(card);
    if (!validity.ok) {
      setResult({ type: "error", title: "Invalid card", msg: validity.reason });
      return;
    }

    if (CARD_PRODUCT.oncePerDayPerVenue) {
      const r = canRedeem({ cardId, venueId });
      if (!r.ok) {
        setResult({
          type: "warning",
          title: "Already redeemed today",
          msg: `This card has already been used at this venue today (${r.dateKey}).`,
        });
        return;
      }
    }

    const done = redeem({ cardId, venueId });
    setResult({
      type: "success",
      title: "Redeemed",
      msg: `Redemption recorded for ${venue?.name || venueId} today.`,
      redeemed: true,
    });
  };

  return (
    <SiteLayout>
      <Seo
        title="Vendor Verify — Ahangama Card"
        description="Check card validity and redeem"
        canonical={absUrl(
          params.cardId
            ? `/card/verify/${encodeURIComponent(prefill)}`
            : "/card/verify"
        )}
      />

      <Card
        style={{ borderRadius: 16, border: "1px solid #eee" }}
        bodyStyle={{ padding: 20 }}
      >
        <Title level={2} style={{ marginTop: 0 }}>
          Vendor Verify
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 10 }}>
          Vendor checks: <strong>validity date</strong> + optional{" "}
          <strong>Card ID</strong>. Rules:{" "}
          {CARD_PRODUCT.validForOnePerson ? "Valid for one person. " : ""}
          {CARD_PRODUCT.oncePerDayPerVenue
            ? "Valid once per day per venue."
            : ""}
        </Paragraph>

        <Space
          direction="vertical"
          size={10}
          style={{ width: "100%", maxWidth: 520 }}
        >
          <div>
            <Text strong>Venue</Text>
            <Select
              style={{ width: "100%", marginTop: 6 }}
              value={venueId}
              onChange={setVenueId}
              options={VENDORS.map((v) => ({
                value: v.id,
                label: `${v.name} (${v.id})`,
              }))}
            />
          </div>

          <div>
            <Text strong>Card ID</Text>
            <Input
              style={{ marginTop: 6 }}
              value={cardId}
              onChange={(e) => setCardId(e.target.value)}
              placeholder="e.g. AHG-AB12-345678"
              allowClear
            />
          </div>

          <Space wrap>
            <Button type="primary" onClick={onCheck}>
              Check
            </Button>
            <Button onClick={() => setCardId("")}>Clear</Button>
            <Button href="/card/my">Open My Card</Button>
          </Space>

          {venue && (
            <Space wrap>
              <Tag>Venue ID: {venue.id}</Tag>
              <Tag>Perk: {venue.perk}</Tag>
            </Space>
          )}
        </Space>

        {result && (
          <div style={{ marginTop: 14 }}>
            <Alert
              type={result.type}
              showIcon
              message={result.title}
              description={
                <div>
                  <div>{result.msg}</div>
                  {result.canRedeem && (
                    <Button
                      style={{ marginTop: 10 }}
                      type="primary"
                      onClick={onRedeem}
                    >
                      Redeem now
                    </Button>
                  )}
                </div>
              }
            />
          </div>
        )}
      </Card>
    </SiteLayout>
  );
}
