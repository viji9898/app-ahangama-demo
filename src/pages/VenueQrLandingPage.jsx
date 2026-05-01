import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  Result,
  Row,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";
import {
  ArrowRightOutlined,
  CheckCircleFilled,
  CompassOutlined,
  EnvironmentOutlined,
  GiftOutlined,
  MenuOutlined,
  MessageOutlined,
  SafetyCertificateOutlined,
  ShopOutlined,
  StarFilled,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { trackQrEvent } from "../analytics";

const { Paragraph, Text, Title } = Typography;

const PASS_BENEFITS = [
  {
    icon: <GiftOutlined style={{ color: "#204133", fontSize: 18 }} />,
    title: "100+ venues",
    text: "One pass, a growing list of perks across Ahangama.",
  },
  {
    icon: <ShopOutlined style={{ color: "#204133", fontSize: 18 }} />,
    title: "Cafes & restaurants",
    text: "Daily savings at the spots people actually go back to.",
  },
  {
    icon: <CompassOutlined style={{ color: "#204133", fontSize: 18 }} />,
    title: "Surf & experiences",
    text: "Lessons, boards, and local experiences with better value.",
  },
  {
    icon: <SafetyCertificateOutlined style={{ color: "#204133", fontSize: 18 }} />,
    title: "Wellness & beauty",
    text: "Treatments, recovery, and self-care perks in one place.",
  },
  {
    icon: <EnvironmentOutlined style={{ color: "#204133", fontSize: 18 }} />,
    title: "Shops & services",
    text: "Useful discounts beyond food and travel.",
  },
  {
    icon: <ThunderboltOutlined style={{ color: "#204133", fontSize: 18 }} />,
    title: "Exclusive perks",
    text: "Members-only offers designed to pay back fast.",
  },
];

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
      return value
        .map((entry) => toOfferText(entry))
        .filter(Boolean)
        .join(" ")
        .trim() || null;
    }
    if (typeof value === "object") {
      return Object.values(value)
        .map((entry) => toOfferText(entry))
        .filter(Boolean)
        .join(" ")
        .trim() || null;
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

function buildPurchaseUrl(slug) {
  const params = new URLSearchParams({
    utm_source: "qr",
    utm_medium: "offline",
    utm_campaign: "qr_venue_conversion",
    utm_content: slug,
    promo: "HELLO50",
  });

  return `https://pass.ahangama.com?${params.toString()}`;
}

function buildWhatsAppUrl(venueName) {
  const message = `Hi, I scanned the QR at ${venueName} and want the Ahangama Pass with HELLO50.`;
  return `https://wa.me/94777908790?text=${encodeURIComponent(message)}`;
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

function HeroSection({ venue, purchaseUrl, mainOffer, onPrimaryClick, areaLabel, categoryLabel }) {
  const heroImage =
    normalizeText(getVenueField(venue, "image", "ogImage", "logo")) ||
    "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/hero-2.jpg";
  const stars = getVenueField(venue, "stars");
  const reviews = getVenueField(venue, "reviews");

  return (
    <section className="qr-hero">
      <div
        className="qr-heroImage"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="qr-heroOverlay" />
      <div className="qr-heroBody">
        <Space wrap>
          <Tag className="qr-heroTag">Ahangama Pass</Tag>
          {categoryLabel ? <Tag className="qr-heroTag">{categoryLabel}</Tag> : null}
          {areaLabel ? <Tag className="qr-heroTag">{areaLabel}</Tag> : null}
        </Space>
        <Title level={1} className="qr-heroTitle">
          Your perk at {venue.name}
        </Title>
        <Paragraph style={{ color: "rgba(255,255,255,0.82)", marginBottom: 0 }}>
          Unlock this venue perk right now, then keep using the pass across Ahangama.
        </Paragraph>
        {mainOffer ? (
          <div className="qr-heroPerk">
            <GiftOutlined />
            <span>{mainOffer}</span>
          </div>
        ) : null}
        {stars ? (
          <div className="qr-rating">
            <StarFilled style={{ color: "#ffd76a" }} />
            <span>
              {stars}
              {reviews ? ` (${reviews} reviews)` : ""}
            </span>
          </div>
        ) : null}
        <Button
          type="primary"
          size="large"
          href={purchaseUrl}
          block
          onClick={() => onPrimaryClick("hero")}
          style={{
            marginTop: 18,
            height: 52,
            borderRadius: 16,
            fontWeight: 700,
            background: "#f6d87a",
            borderColor: "#f6d87a",
            color: "#163025",
            boxShadow: "0 12px 24px rgba(10, 20, 16, 0.24)",
          }}
        >
          Get the Pass — 50% Off Today
        </Button>
      </div>
    </section>
  );
}

function OfferBreakdownCard({ venue, offers, howToClaim, restrictions }) {
  return (
    <Card className="qr-card" bodyStyle={{ padding: 18 }} style={{ marginBottom: 16 }}>
      <Title level={3} className="qr-sectionTitle">
        At {venue.name}
      </Title>
      <Paragraph className="qr-sectionText" style={{ marginBottom: 10 }}>
        Short, clear, and ready to use the moment you get your pass.
      </Paragraph>
      <Space direction="vertical" size={0} style={{ width: "100%" }}>
        {offers.map((offer) => (
          <div className="qr-offerItem" key={offer}>
            <CheckCircleFilled style={{ color: "#204133", marginTop: 4 }} />
            <Text style={{ color: "#1f2a24", fontSize: 15 }}>{offer}</Text>
          </div>
        ))}
        {howToClaim ? (
          <div className="qr-offerItem">
            <ThunderboltOutlined style={{ color: "#204133", marginTop: 4 }} />
            <div>
              <Text strong style={{ display: "block", color: "#1f2a24" }}>
                How to claim
              </Text>
              <Text className="qr-sectionText">{howToClaim}</Text>
            </div>
          </div>
        ) : null}
        {restrictions ? (
          <div className="qr-offerItem" style={{ paddingBottom: 0 }}>
            <SafetyCertificateOutlined style={{ color: "#7a6a4c", marginTop: 4 }} />
            <div>
              <Text strong style={{ display: "block", color: "#1f2a24" }}>
                Good to know
              </Text>
              <Text style={{ color: "rgba(31, 42, 36, 0.64)", fontSize: 13 }}>
                {restrictions}
              </Text>
            </div>
          </div>
        ) : null}
      </Space>
    </Card>
  );
}

function PassValueSection() {
  return (
    <Card className="qr-card" bodyStyle={{ padding: 18 }} style={{ marginBottom: 16 }}>
      <Title level={3} className="qr-sectionTitle">
        This is just your first perk
      </Title>
      <Paragraph className="qr-sectionText" style={{ marginBottom: 14 }}>
        The Ahangama Pass is built to pay for itself fast, then keep saving you money all trip long.
      </Paragraph>
      <Row gutter={[12, 12]}>
        {PASS_BENEFITS.map((benefit) => (
          <Col span={12} key={benefit.title}>
            <div className="qr-benefitTile">
              <div style={{ marginBottom: 10 }}>{benefit.icon}</div>
              <Text strong style={{ display: "block", color: "#1f2a24", marginBottom: 4 }}>
                {benefit.title}
              </Text>
              <Text style={{ color: "rgba(31, 42, 36, 0.68)", fontSize: 13 }}>
                {benefit.text}
              </Text>
            </div>
          </Col>
        ))}
      </Row>
    </Card>
  );
}

function EditorialSection({ venue, excerpt, description, mediaItems }) {
  return (
    <Card className="qr-card" bodyStyle={{ padding: 18 }} style={{ marginBottom: 16 }}>
      <Title level={3} className="qr-sectionTitle">
        Why we love {venue.name}
      </Title>
      {excerpt ? <Paragraph className="qr-sectionText">{excerpt}</Paragraph> : null}
      {description && description !== excerpt ? (
        <Paragraph className="qr-sectionText" style={{ marginBottom: mediaItems.length ? 14 : 0 }}>
          {description}
        </Paragraph>
      ) : null}
      {mediaItems.length ? (
        <div className="qr-mediaGrid">
          {mediaItems.map((item) => (
            <div className="qr-mediaBlock" key={item.key}>
              <img src={item.src} alt={item.alt} />
            </div>
          ))}
        </div>
      ) : null}
    </Card>
  );
}

function ConversionSection({ purchaseUrl, onPassClick }) {
  return (
    <Card className="qr-card" bodyStyle={{ padding: 18 }} style={{ marginBottom: 16 }}>
      <Tag
        style={{
          borderRadius: 999,
          padding: "6px 10px",
          marginBottom: 12,
          background: "rgba(32, 65, 51, 0.08)",
          color: "#204133",
          border: "1px solid rgba(32, 65, 51, 0.1)",
        }}
      >
        Limited QR offer
      </Tag>
      <Title level={3} className="qr-sectionTitle">
        Get the pass while you are here
      </Title>
      <Paragraph className="qr-sectionText" style={{ marginBottom: 14 }}>
        Start with this venue perk today, then unlock the rest of the network for the rest of your stay.
      </Paragraph>
      <div className="qr-priceRow">
        <Text delete style={{ color: "rgba(31, 42, 36, 0.45)", fontSize: 18 }}>
          30 USD
        </Text>
        <Title level={2} style={{ margin: 0, color: "#204133" }}>
          15 USD
        </Title>
      </div>
      <div className="qr-codePill">
        <ThunderboltOutlined />
        Code: HELLO50
      </div>
      <Button
        type="primary"
        size="large"
        block
        href={purchaseUrl}
        onClick={() => onPassClick("conversion")}
        icon={<ArrowRightOutlined />}
        style={{ height: 52, borderRadius: 16, marginTop: 16, fontWeight: 700 }}
      >
        Get my pass now
      </Button>
    </Card>
  );
}

function SecondaryActions({ mapUrl, whatsAppUrl, onMapClick, onWhatsAppClick }) {
  return (
    <Card className="qr-card" bodyStyle={{ padding: 18 }}>
      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        {mapUrl ? (
          <Button
            size="large"
            block
            href={mapUrl}
            target="_blank"
            rel="noreferrer"
            icon={<EnvironmentOutlined />}
            onClick={onMapClick}
            style={{ height: 48, borderRadius: 14 }}
          >
            Open in Google Maps
          </Button>
        ) : null}
        <Button
          size="large"
          block
          href="/"
          icon={<CompassOutlined />}
          style={{ height: 48, borderRadius: 14 }}
        >
          View all perks
        </Button>
        <Button
          size="large"
          block
          href={whatsAppUrl}
          target="_blank"
          rel="noreferrer"
          icon={<MessageOutlined />}
          onClick={onWhatsAppClick}
          style={{ height: 48, borderRadius: 14 }}
        >
          Ask on WhatsApp
        </Button>
      </Space>
    </Card>
  );
}

function StickyCta({ purchaseUrl, onPassClick }) {
  return (
    <div className="qr-stickyBar">
      <div className="qr-stickyInner">
        <div>
          <Text style={{ color: "rgba(255,255,255,0.72)", fontSize: 12, display: "block" }}>
            HELLO50 active
          </Text>
          <Text strong style={{ color: "#fff", fontSize: 15 }}>
            50% off today — Get Pass
          </Text>
        </div>
        <Button
          type="primary"
          href={purchaseUrl}
          onClick={() => onPassClick("sticky")}
          style={{
            height: 44,
            borderRadius: 14,
            fontWeight: 700,
            background: "#f6d87a",
            borderColor: "#f6d87a",
            color: "#163025",
            flexShrink: 0,
          }}
        >
          Get Pass
        </Button>
      </div>
    </div>
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

    setLoading(true);
    setError(null);

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

  const venue = useMemo(() => venues.find((v) => v.slug === slug), [venues, slug]);

  const offerItems = useMemo(() => (venue ? normalizeOffers(venue) : []), [venue]);
  const mainOffer = useMemo(() => {
    if (!venue) return "";
    return (
      normalizeText(getVenueField(venue, "cardPerk", "card_perk")) ||
      offerItems[0] ||
      normalizeText(getVenueField(venue, "excerpt"))
    );
  }, [offerItems, venue]);

  const excerpt = normalizeText(getVenueField(venue, "excerpt"));
  const description = normalizeText(getVenueField(venue, "description"));
  const howToClaim = normalizeText(getVenueField(venue, "howToClaim", "how_to_claim"));
  const restrictions = normalizeText(getVenueField(venue, "restrictions"));
  const mapUrl = normalizeText(getVenueField(venue, "mapUrl", "map_url"));
  const logo = normalizeText(getVenueField(venue, "logo"));
  const areaLabel = normalizeText(getVenueField(venue, "area"));
  const categoryLabel = useMemo(() => {
    const categories = getVenueField(venue, "categories", "category");
    if (Array.isArray(categories)) {
      return categories.filter(Boolean).map((item) => normalizeText(item)).join(" • ");
    }

    return normalizeText(categories);
  }, [venue]);
  const purchaseUrl = buildPurchaseUrl(slug);
  const whatsAppUrl = buildWhatsAppUrl(venue?.name || "this venue");
  const mediaItems = useMemo(() => {
    if (!venue) return [];

    const image = normalizeText(getVenueField(venue, "image", "ogImage"));
    const items = [];

    if (image) {
      items.push({ key: "image", src: image, alt: `${venue.name} feature` });
    }
    if (logo && logo !== image) {
      items.push({ key: "logo", src: logo, alt: `${venue.name} logo` });
    }

    return items.slice(0, 3);
  }, [logo, venue]);

  const analyticsPayload = useMemo(
    () => ({
      qr_venue: venue?.slug,
      venue_name: venue?.name,
      qr_goal: "pass_purchase",
      qr_landing_page: venue ? `/qr/${venue.slug}` : `/qr/${slug}`,
      promo_type: "HELLO50",
      pass_type: "15_day",
    }),
    [slug, venue],
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

  const handleMapClick = () => {
    if (!venue) return;

    trackQrEvent("qr_map_click", {
      ...analyticsPayload,
      destination_url: mapUrl,
    });
  };

  const handleWhatsAppClick = () => {
    if (!venue) return;

    trackQrEvent("qr_whatsapp_click", {
      ...analyticsPayload,
      destination_url: whatsAppUrl,
    });
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState onRetry={() => setRetryToken((current) => current + 1)} />;
  }

  if (!venue) {
    return <EmptyState slug={slug} />;
  }

  return (
    <>
      <Seo
        title={`${venue.name} Perk — Ahangama Pass`}
        description={mainOffer || excerpt || `Exclusive Ahangama Pass perks at ${venue.name}.`}
        canonical={absUrl(`/qr/${venue.slug}`)}
        ogImage={normalizeText(getVenueField(venue, "image", "ogImage", "logo")) || undefined}
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

          <HeroSection
            venue={venue}
            purchaseUrl={purchaseUrl}
            mainOffer={mainOffer}
            onPrimaryClick={handlePassClick}
            areaLabel={areaLabel}
            categoryLabel={categoryLabel}
          />

          <Card className="qr-card" bodyStyle={{ padding: 18 }} style={{ marginBottom: 16 }}>
            <Row gutter={12} align="middle" wrap={false}>
              <Col flex="56px">
                <Avatar
                  src={logo || normalizeText(getVenueField(venue, "image")) || undefined}
                  shape="square"
                  size={56}
                  style={{ borderRadius: 18, backgroundColor: "rgba(32, 65, 51, 0.08)" }}
                >
                  {venue.name?.slice(0, 1)}
                </Avatar>
              </Col>
              <Col flex="auto">
                <Text style={{ color: "rgba(31, 42, 36, 0.58)", fontSize: 12 }}>
                  Featured partner venue
                </Text>
                <Title level={4} style={{ margin: "2px 0 0", color: "#1f2a24" }}>
                  {venue.name}
                </Title>
                {(areaLabel || categoryLabel) && (
                  <Text style={{ color: "rgba(31, 42, 36, 0.68)" }}>
                    {[areaLabel, categoryLabel].filter(Boolean).join(" • ")}
                  </Text>
                )}
              </Col>
            </Row>
          </Card>

          <OfferBreakdownCard
            venue={venue}
            offers={offerItems.length ? offerItems : [mainOffer || "Perk details available after purchase"]}
            howToClaim={howToClaim}
            restrictions={restrictions}
          />
          <PassValueSection />
          <EditorialSection
            venue={venue}
            excerpt={excerpt}
            description={description}
            mediaItems={mediaItems}
          />
          <ConversionSection purchaseUrl={purchaseUrl} onPassClick={handlePassClick} />
          <SecondaryActions
            mapUrl={mapUrl}
            whatsAppUrl={whatsAppUrl}
            onMapClick={handleMapClick}
            onWhatsAppClick={handleWhatsAppClick}
          />
          <div style={{ height: 12 }} />
          <Text style={{ display: "block", color: "rgba(31, 42, 36, 0.54)", textAlign: "center" }}>
            Prefer browsing first? <Link to="/">See the full Ahangama guide.</Link>
          </Text>
        </div>
        <StickyCta purchaseUrl={purchaseUrl} onPassClick={handlePassClick} />
      </div>
    </>
  );
}