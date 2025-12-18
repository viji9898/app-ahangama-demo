import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Typography,
  Input,
  Button,
  Space,
  Select,
  Divider,
  Tag,
} from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { VENDORS } from "../data/vendors";
import { getCard, isCardValidNow, canRedeem, redeem } from "../app/cardStore";
import VerifyStatusPanel from "../components/ui/VerifyStatusPanel";

const { Title, Paragraph, Text } = Typography;

export default function CardVerify() {
  const params = useParams();
  const prefill = params.cardId ? decodeURIComponent(params.cardId) : "";

  const [venueId, setVenueId] = useState(VENDORS[0]?.id);
  const [pin, setPin] = useState("");
  const [cardId, setCardId] = useState(prefill);

  // result state
  const [status, setStatus] = useState({
    state: "idle", // idle | success | warning | error
    headline: null,
    message: null,
    canRedeem: false,
  });

  const venue = useMemo(
    () => VENDORS.find((v) => v.id === venueId) || null,
    [venueId]
  );

  const canonical = absUrl(
    params.cardId
      ? `/card/verify/${encodeURIComponent(prefill)}`
      : "/card/verify"
  );

  const isAuthed = useMemo(() => {
    if (!venue) return false;
    return pin === venue.pin;
  }, [pin, venue]);

  const doCheck = () => {
    setStatus({
      state: "idle",
      headline: null,
      message: null,
      canRedeem: false,
    });

    if (!venue) {
      setStatus({
        state: "error",
        headline: "VENUE MISSING",
        message: "Select a venue.",
        canRedeem: false,
      });
      return;
    }

    if (!isAuthed) {
      setStatus({
        state: "warning",
        headline: "PIN REQUIRED",
        message: "Enter the venue PIN to verify cards.",
        canRedeem: false,
      });
      return;
    }

    if (!cardId) {
      setStatus({
        state: "error",
        headline: "NO CARD ID",
        message: "Scan QR or enter Card ID.",
        canRedeem: false,
      });
      return;
    }

    const card = getCard(cardId);
    const validity = isCardValidNow(card);
    if (!validity.ok) {
      setStatus({
        state: "error",
        headline: "NOT VALID",
        message: validity.reason,
        canRedeem: false,
      });
      return;
    }

    // Per-venue rule: once per day per venue
    if (venue.oncePerDayPerVenue) {
      const r = canRedeem({ cardId, venueId: venue.id });
      if (!r.ok) {
        setStatus({
          state: "warning",
          headline: "ALREADY USED TODAY",
          message: `This card was already redeemed here today (${r.dateKey}).`,
          canRedeem: false,
        });
        return;
      }
    }

    setStatus({
      state: "success",
      headline: "VALID",
      message: `Perk: ${venue.perk}`,
      canRedeem: true,
    });
  };

  const doRedeem = () => {
    if (!venue || !isAuthed || !cardId) return;

    const card = getCard(cardId);
    const validity = isCardValidNow(card);
    if (!validity.ok) {
      setStatus({
        state: "error",
        headline: "NOT VALID",
        message: validity.reason,
        canRedeem: false,
      });
      return;
    }

    if (venue.oncePerDayPerVenue) {
      const r = canRedeem({ cardId, venueId: venue.id });
      if (!r.ok) {
        setStatus({
          state: "warning",
          headline: "ALREADY USED TODAY",
          message: `This card was already redeemed here today (${r.dateKey}).`,
          canRedeem: false,
        });
        return;
      }
    }

    redeem({ cardId, venueId: venue.id });
    setStatus({
      state: "success",
      headline: "REDEEMED",
      message: `Recorded for ${venue.name} today.`,
      canRedeem: false,
    });
  };

  // Auto-check when arriving via QR deep link and PIN already entered
  useEffect(() => {
    if (prefill) setCardId(prefill);
  }, [prefill]);

  // Optional auto-check: if we have cardId + authed + venue, run check
  useEffect(() => {
    if (cardId && isAuthed && venue) doCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venueId, isAuthed]);

  return (
    <SiteLayout>
      <Seo
        title="Vendor Verify — Ahangama Card"
        description="Check card validity and redeem"
        canonical={canonical}
      />

      <Card
        style={{ borderRadius: 16, border: "1px solid #eee" }}
        bodyStyle={{ padding: 18 }}
      >
        <Title level={2} style={{ marginTop: 0, marginBottom: 4 }}>
          Vendor Verify
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          Select venue → enter PIN → scan QR → verify → redeem.
        </Paragraph>
      </Card>

      <div style={{ marginTop: 14 }}>
        <VerifyStatusPanel
          state={status.state}
          headline={status.headline}
          message={status.message}
          venue={venue}
          cardId={cardId}
          canRedeem={status.canRedeem}
          onRedeem={doRedeem}
        />
      </div>

      <Card
        style={{ marginTop: 14, borderRadius: 16, border: "1px solid #eee" }}
        bodyStyle={{ padding: 16 }}
      >
        <Space direction="vertical" size={10} style={{ width: "100%" }}>
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
            {venue && (
              <div style={{ marginTop: 8 }}>
                <Space wrap>
                  <Tag color="green">{venue.perk}</Tag>
                  <Tag>
                    {venue.oncePerDayPerVenue
                      ? "Once/day/venue"
                      : "Multiple/day allowed"}
                  </Tag>
                </Space>
              </div>
            )}
          </div>

          <div>
            <Text strong>Venue PIN</Text>
            <Input.Password
              style={{ marginTop: 6 }}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter venue PIN"
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Demo pins: 1111 / 2222 / 3333
            </Text>
          </div>

          <Divider style={{ margin: "10px 0" }} />

          <div>
            <Text strong>Card ID</Text>
            <Input
              style={{ marginTop: 6 }}
              value={cardId}
              onChange={(e) => setCardId(e.target.value)}
              placeholder="Scan QR or paste Card ID"
              allowClear
            />
          </div>

          <Space wrap>
            <Button type="primary" size="large" onClick={doCheck}>
              Check Now
            </Button>
            <Button
              onClick={() =>
                setStatus({
                  state: "idle",
                  headline: null,
                  message: null,
                  canRedeem: false,
                })
              }
            >
              Reset
            </Button>
            <Button href="/card/my">Open My Card</Button>
          </Space>
        </Space>
      </Card>
    </SiteLayout>
  );
}
