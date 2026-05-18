import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, Result, Skeleton, Space, Typography } from "antd";
import {
  ArrowRightOutlined,
  CheckCircleFilled,
  LockFilled,
  MenuOutlined,
  TagFilled,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { trackQrEvent } from "../analytics";
import { getPrPromotion } from "../data/prPromotions";
import { calculatePromoReceipt, formatCurrency } from "../lib/promoReceipt";
import coffeeIcon from "../assets/receipt_icons/coffee.svg";
import pastryIcon from "../assets/receipt_icons/pastry.svg";
import postcardsIcon from "../assets/receipt_icons/postcards.svg";
import passIcon from "../assets/receipt_icons/pass.svg";
import giftIcon from "../assets/receipt_icons/gift-icon.svg";
import palmTreeIcon from "../assets/receipt_icons/palm-tree-icon.svg";
import yogaMatIcon from "../assets/receipt_icons/yoga-mat.svg";
import pilatesPoseIcon from "../assets/receipt_icons/pilates-pose.svg";

const RECEIPT_ICON_MAP = {
  coffee: coffeeIcon,
  pastry: pastryIcon,
  postcards: postcardsIcon,
  pass: passIcon,
  "yoga-mat": yogaMatIcon,
  "pilates-class": pilatesPoseIcon,
};

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

function ReceiptSection({ promotion, purchaseUrl, onPassClick, venueName }) {
  const { conversion, receipt, trustPoints } = promotion;
  const summary = calculatePromoReceipt(receipt.items, receipt.promoPrice);
  const brandTitle = normalizeText(venueName)
    ? `${normalizeText(venueName).toUpperCase()} X AHANGAMA PASS`
    : "AHANGAMA PASS";

  return (
    <section className="qr-receiptCard" aria-label="Promo receipt">
      <div className="qr-receiptPaper">
        <div className="qr-receiptBrandBlock">
          <img
            src={palmTreeIcon}
            alt=""
            className="qr-receiptBrandIcon"
            aria-hidden="true"
          />
          <div className="qr-receiptBrandTitle">{brandTitle}</div>
          <div className="qr-receiptBrandTagline">UNLOCK LOCAL PERKS</div>
        </div>

        <div className="qr-receiptDivider qr-receiptDivider--brand" />
        <div className="qr-receiptEyebrow">{receipt.title}</div>

        {summary.items.map((item) => {
          const iconSrc = RECEIPT_ICON_MAP[item.icon] || giftIcon;

          return (
            <React.Fragment key={item.label}>
              {item.showDividerBefore ? (
                <div className="qr-receiptSectionDivider" />
              ) : null}
              <div className="qr-receiptRow">
                <div className="qr-receiptItemLead">
                  <div className="qr-receiptIconWrap">
                    {iconSrc ? (
                      <img
                        src={iconSrc}
                        alt=""
                        className="qr-receiptIcon"
                        aria-hidden="true"
                      />
                    ) : null}
                  </div>
                  <div
                    className={`qr-receiptCell qr-receiptCell--main${
                      item.icon === "pass" ? " qr-receiptCell--pass" : ""
                    }`}
                  >
                    <div className="qr-receiptItemName">{item.label}</div>
                    {item.subtitle ? (
                      <div className="qr-receiptItemSubtitle">
                        {item.subtitle}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="qr-receiptQty">x {item.quantity}</div>
              </div>
            </React.Fragment>
          );
        })}

        <div className="qr-receiptDivider" />

        <div className="qr-receiptSummaryRow">
          <span>TOTAL PRICE</span>
          <strong>
            {formatCurrency(summary.totalRetailValue, receipt.currency)}
          </strong>
        </div>
        <div className="qr-receiptDivider qr-receiptDivider--total" />
        <div className="qr-receiptSummaryRow qr-receiptSummaryRow--highlight">
          <span>FINAL VALUE</span>
          <strong>
            {formatCurrency(summary.finalPrice, receipt.currency)}
          </strong>
        </div>
        <div className="qr-receiptSavingsChip">
          <span className="qr-receiptSavingsChipLabel">
            <TagFilled />
            <span>YOU SAVE </span>
          </span>
          <strong>
            {formatCurrency(summary.savings, receipt.currency)} (
            {summary.savingsPercent}%)
          </strong>
        </div>

        <div className="qr-receiptDivider qr-receiptDivider--summary" />

        <div className="qr-receiptPromoNote">
          <div className="qr-receiptPromoIconWrap">
            <img
              src={giftIcon}
              alt=""
              className="qr-receiptPromoIcon"
              aria-hidden="true"
            />
          </div>
          <div className="qr-receiptPromoCopy">
            <div className="qr-receiptPromoTitle">
              Huge savings across 100+ local spots
            </div>
            <div className="qr-receiptPromoMeta">
              Cafes • Surf • Wellness • More
            </div>
          </div>
        </div>
        <Button
          className="qr-receiptButton"
          size="large"
          block
          href={purchaseUrl}
          onClick={() => onPassClick("conversion")}
        >
          <span>{conversion.buttonText}</span>
          <ArrowRightOutlined />
        </Button>

        <div className="qr-receiptTrustList">
          {trustPoints.map((item) => (
            <div className="qr-receiptTrustItem" key={item}>
              <CheckCircleFilled />
              <span>{item}</span>
            </div>
          ))}
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

          <ReceiptSection
            promotion={promotion}
            purchaseUrl={purchaseUrl}
            onPassClick={handlePassClick}
            venueName={venue.name}
          />

          <div style={{ height: 12 }} />
        </div>
      </div>
    </>
  );
}
