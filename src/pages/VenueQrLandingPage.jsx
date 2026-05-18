import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, Result, Skeleton, Space, Typography } from "antd";
import {
  ArrowRightOutlined,
  CheckCircleFilled,
  LockFilled,
  MenuOutlined,
} from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { trackQrEvent } from "../analytics";
import { getPrPromotion } from "../data/prPromotions";

const { Text } = Typography;

const CTA_CHECKLIST = ["Instant access", "100+ perks", "Valid across Ahangama"];

function getBundleItems(promotion) {
  if (
    Array.isArray(promotion?.bundleItems) &&
    promotion.bundleItems.length > 0
  ) {
    return promotion.bundleItems.filter(Boolean);
  }

  return ["Ahangama Pass"];
}

function normalizeText(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function getVenueField(venue, ...keys) {
  for (const key of keys) {
    const value = venue?.[key];
    if (value !== null && value !== undefined && value !== "") {
      return value;
    }
  }

  return null;
}

function normalizeOffers(venue) {
  const rawOffers = getVenueField(venue, "offers", "offer");
  const toOfferText = (value) => {
    if (value === null || value === undefined) return null;
    if (typeof value === "string") return value.trim() || null;
    if (Array.isArray(value)) {
      return (
        value
          .map((entry) => toOfferText(entry))
          .filter(Boolean)
          .join(" ")
          .trim() || null
      );
    }
    if (typeof value === "object") {
      return (
        Object.values(value)
          .map((entry) => toOfferText(entry))
          .filter(Boolean)
          .join(" ")
          .trim() || null
      );
    }

    return String(value).trim() || null;
  };

  let offers = [];

  if (Array.isArray(rawOffers)) {
    offers = rawOffers.map((entry) => toOfferText(entry)).filter(Boolean);
  } else if (rawOffers && typeof rawOffers === "object") {
    offers = Object.values(rawOffers)
      .map((entry) => toOfferText(entry))
      .filter(Boolean);
  } else {
    const single = toOfferText(rawOffers);
    offers = single ? [single] : [];
  }

  const uniqueOffers = Array.from(new Set(offers));
  const cardPerk = normalizeText(getVenueField(venue, "cardPerk", "card_perk"));

  if (cardPerk && !uniqueOffers.includes(cardPerk)) {
    uniqueOffers.unshift(cardPerk);
  }

  return uniqueOffers;
}

function buildPurchaseUrl(slug, promoCode) {
  const params = new URLSearchParams({
    utm_source: "qr",
    utm_medium: "offline",
    utm_campaign: "qr_venue_conversion",
    utm_content: slug,
    promo: promoCode,
  });

  return `https://pass.ahangama.com?${params.toString()}`;
}

function LoadingState() {
  return (
    <div className="qr-page">
      <div className="qr-shell">
        <Card className="qr-skeletonCard" bodyStyle={{ padding: 18 }}>
          <Space direction="vertical" size={18} style={{ width: "100%" }}>
            <Skeleton.Button active block style={{ height: 24 }} />
            <Skeleton.Image active style={{ width: "100%", height: 280 }} />
            <Skeleton active paragraph={{ rows: 3 }} />
            <Skeleton.Button active block style={{ height: 48 }} />
            <Skeleton active paragraph={{ rows: 5 }} />
          </Space>
        </Card>
      </div>
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div className="qr-page">
      <div className="qr-shell">
        <Card className="qr-empty" bodyStyle={{ padding: 18 }}>
          <Result
            status="warning"
            title="We could not load this venue page"
            subTitle="Please check your connection and try again."
            extra={
              <Space direction="vertical" style={{ width: "100%" }}>
                <Button type="primary" size="large" block onClick={onRetry}>
                  Try again
                </Button>
                <Button size="large" block href="/">
                  Back to Ahangama
                </Button>
              </Space>
            }
          />
        </Card>
      </div>
    </div>
  );
}

function EmptyState({ slug }) {
  return (
    <div className="qr-page">
      <div className="qr-shell">
        <Card className="qr-empty" bodyStyle={{ padding: 18 }}>
          <Result
            status="404"
            title="Venue not found"
            subTitle={`We could not find a venue for ${slug}.`}
            extra={
              <Space direction="vertical" style={{ width: "100%" }}>
                <Button type="primary" size="large" block href="/">
                  Explore all perks
                </Button>
                <Button size="large" block href="https://pass.ahangama.com">
                  Go to Ahangama Pass
                </Button>
              </Space>
            }
          />
        </Card>
      </div>
    </div>
  );
}

function OfferBundleSection({ bundleItems }) {
  return (
    <section className="qr-bundleCard" aria-label="Included in this promo">
      <div className="qr-bundleKicker">Included in this promo</div>
      <div className="qr-bundleList">
        {bundleItems.map((item, index) => (
          <React.Fragment key={item}>
            {index > 0 ? <div className="qr-bundlePlus">+</div> : null}
            <div className="qr-bundleItem">{item}</div>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

function ConversionSection({ purchaseUrl, onPassClick, conversion }) {
  return (
    <section
      className="qr-offerCta qr-simpleOffer"
      aria-label="Get the Ahangama Pass"
    >
      <div className="qr-offerCardInner">
        <h2 className="qr-offerTitle">{conversion.header}</h2>
        <div className="qr-offerSubline">
          <span className="qr-offerOldPrice">{conversion.originalPrice}</span>
          <span className="qr-offerArrow">→</span>
          <span className="qr-offerNewPrice">{conversion.discountedPrice}</span>
        </div>
        <div className="qr-offerCodeLabel">{conversion.codeLabel}</div>
        <div className="qr-offerCodeValue">{conversion.codeValue}</div>

        <div className="qr-offerChecklist">
          {CTA_CHECKLIST.map((item) => (
            <div className="qr-offerChecklistItem" key={item}>
              <CheckCircleFilled />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <Button
          className="qr-offerCtaButton"
          size="large"
          block
          href={purchaseUrl}
          onClick={() => onPassClick("conversion")}
        >
          <span>{conversion.buttonText}</span>
          <ArrowRightOutlined />
        </Button>

        <div className="qr-offerCtaMeta qr-offerCtaMeta--simple">
          <LockFilled />
          <span>Secure checkout</span>
        </div>

        <div
          className="qr-offerPaymentRow"
          aria-label="Accepted payment methods"
        >
          <span className="qr-offerPaymentPill">Visa</span>
          <span className="qr-offerPaymentPill">Mastercard</span>
          <span className="qr-offerPaymentPill">Apple Pay</span>
          <span className="qr-offerPaymentPill">G Pay</span>
        </div>
      </div>
    </section>
  );
}

export default function VenueQrLandingPage() {
  const { slug = "" } = useParams();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryToken, setRetryToken] = useState(0);
  const trackedViewRef = useRef(false);

  useEffect(() => {
    let active = true;

    fetch("/api/venues")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to load venues: ${response.status}`);
        }

        const payload = await response.json();
        if (!payload.ok) {
          throw new Error(payload.error || "Failed to load venues");
        }

        return Array.isArray(payload.venues) ? payload.venues : [];
      })
      .then((items) => {
        if (!active) return;
        setVenues(items);
        setLoading(false);
      })
      .catch((nextError) => {
        if (!active) return;
        setError(nextError);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [retryToken]);

  const venue = useMemo(
    () => venues.find((v) => v.slug === slug),
    [venues, slug],
  );

  const offerItems = useMemo(
    () => (venue ? normalizeOffers(venue) : []),
    [venue],
  );
  const mainOffer = useMemo(() => {
    if (!venue) return "";
    return (
      normalizeText(getVenueField(venue, "cardPerk", "card_perk")) ||
      offerItems[0] ||
      normalizeText(getVenueField(venue, "excerpt"))
    );
  }, [offerItems, venue]);

  const excerpt = normalizeText(getVenueField(venue, "excerpt"));
  const promotion = useMemo(
    () => getPrPromotion(venue?.slug || slug),
    [slug, venue],
  );
  const bundleItems = useMemo(() => getBundleItems(promotion), [promotion]);
  const purchaseUrl = buildPurchaseUrl(slug, promotion.conversion.codeValue);

  const analyticsPayload = useMemo(
    () => ({
      qr_venue: venue?.slug,
      venue_name: venue?.name,
      qr_goal: "pass_purchase",
      qr_landing_page: venue ? `/qr/${venue.slug}` : `/qr/${slug}`,
      promo_type: promotion.conversion.codeValue,
      pass_type: "15_day",
    }),
    [promotion.conversion.codeValue, slug, venue],
  );

  useEffect(() => {
    if (!venue || trackedViewRef.current) {
      return;
    }

    trackedViewRef.current = true;
    trackQrEvent("qr_venue_page_view", analyticsPayload);
  }, [analyticsPayload, venue]);

  useEffect(() => {
    trackedViewRef.current = false;
  }, [slug]);

  const handlePassClick = (location) => {
    if (!venue) return;

    trackQrEvent("qr_pass_cta_click", {
      ...analyticsPayload,
      cta_location: location,
      destination_url: purchaseUrl,
    });
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setRetryToken((current) => current + 1);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState onRetry={handleRetry} />;
  }

  if (!venue) {
    return <EmptyState slug={slug} />;
  }

  return (
    <>
      <Seo
        title={`${venue.name} Perk — Ahangama Pass`}
        description={
          mainOffer ||
          excerpt ||
          `Exclusive Ahangama Pass perks at ${venue.name}.`
        }
        canonical={absUrl(`/qr/${venue.slug}`)}
        ogImage={
          normalizeText(promotion.heroImageUrl) ||
          normalizeText(getVenueField(venue, "image", "ogImage", "logo")) ||
          undefined
        }
      />
      <div className="qr-page">
        <div className="qr-shell">
          <div className="qr-topbar">
            <div className="qr-brand">
              <span className="qr-brandKicker">Scan to unlock</span>
              <span className="qr-brandTitle">Ahangama Pass</span>
            </div>
            <Button
              type="text"
              shape="circle"
              size="large"
              href="/"
              icon={<MenuOutlined style={{ color: "#1f2a24", fontSize: 20 }} />}
            />
          </div>

          <OfferBundleSection bundleItems={bundleItems} />

          <ConversionSection
            purchaseUrl={purchaseUrl}
            onPassClick={handlePassClick}
            conversion={promotion.conversion}
          />

          <div style={{ height: 12 }} />
          <Text
            style={{
              display: "block",
              color: "rgba(31, 42, 36, 0.54)",
              textAlign: "center",
            }}
          >
            Prefer browsing first?{" "}
            <Link to="/">See the full Ahangama guide.</Link>
          </Text>
        </div>
      </div>
    </>
  );
}
