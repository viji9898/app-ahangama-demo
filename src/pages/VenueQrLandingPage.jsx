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
  CoffeeOutlined,
  EnvironmentOutlined,
  GiftOutlined,
  HeartFilled,
  LockFilled,
  MenuOutlined,
  MessageOutlined,
  PercentageOutlined,
  PictureOutlined,
  SafetyCertificateOutlined,
  ShopOutlined,
  StarFilled,
  ThunderboltOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { trackQrEvent } from "../analytics";
import kaffiPromoTemplate from "../assets/kaffi-promo-template.jpeg";

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
    icon: (
      <SafetyCertificateOutlined style={{ color: "#204133", fontSize: 18 }} />
    ),
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

const PASS_STRIP_ITEMS = [
  {
    icon: <EnvironmentOutlined style={{ color: "#173a2f", fontSize: 18 }} />,
    label: "100+ venues",
  },
  {
    icon: <ShopOutlined style={{ color: "#173a2f", fontSize: 18 }} />,
    label: "Cafes & restaurants",
  },
  {
    icon: <CompassOutlined style={{ color: "#173a2f", fontSize: 18 }} />,
    label: "Surf & experiences",
  },
  {
    icon: (
      <SafetyCertificateOutlined style={{ color: "#173a2f", fontSize: 18 }} />
    ),
    label: "Wellness & beauty",
  },
  {
    icon: <ShopOutlined style={{ color: "#173a2f", fontSize: 18 }} />,
    label: "Shops & services",
  },
  {
    icon: <GiftOutlined style={{ color: "#173a2f", fontSize: 18 }} />,
    label: "Exclusive perks",
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

function HeroSection({
  venue,
  purchaseUrl,
  mainOffer,
  onPrimaryClick,
  areaLabel,
  categoryLabel,
}) {
  const isKaffiPromo = venue?.slug === "kaffi-ahangama";
  const heroImage =
    (isKaffiPromo
      ? null
      : normalizeText(getVenueField(venue, "image", "ogImage", "logo"))) ||
    (!isKaffiPromo
      ? "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/hero-2.jpg"
      : null);
  const stars = getVenueField(venue, "stars");
  const reviews = getVenueField(venue, "reviews");
  const heroOverlayStyle = isKaffiPromo
    ? {
        backgroundImage: `url(${kaffiPromoTemplate})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
      }
    : undefined;

  return (
    <section className="qr-hero">
      <div
        className="qr-heroImage"
        style={heroImage ? { backgroundImage: `url(${heroImage})` } : undefined}
      />
      <div className="qr-heroOverlay" style={heroOverlayStyle} />
    </section>
  );
}

function PassBenefitsStrip() {
  return (
    <section className="qr-stripCard" aria-label="Pass categories">
      <div className="qr-stripGrid">
        {PASS_STRIP_ITEMS.map((item) => (
          <div className="qr-stripItem" key={item.label}>
            <div className="qr-stripIcon">{item.icon}</div>
            <span className="qr-stripLabel">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function PassExplainerSection({ venue }) {
  const venueName = normalizeText(venue?.name).toUpperCase() || "KAFFI";

  return (
    <section className="qr-explainerCard" aria-label="Venue and pass benefits">
      <div className="qr-explainerGrid">
        <div className="qr-explainerColumn qr-explainerColumn--left">
          <h3 className="qr-explainerTitle">AT {venueName}</h3>
          <div className="qr-explainerOfferList">
            <div className="qr-explainerOfferRow">
              <CoffeeOutlined className="qr-explainerOfferIcon" />
              <span>Any beverage</span>
            </div>
            <div className="qr-explainerPlus">+</div>
            <div className="qr-explainerOfferRow">
              <GiftOutlined className="qr-explainerOfferIcon" />
              <span>Any pastry</span>
            </div>
            <div className="qr-explainerPlus">+</div>
            <div className="qr-explainerOfferRow">
              <PictureOutlined className="qr-explainerOfferIcon" />
              <span>Two free postcards</span>
            </div>
          </div>
          <div className="qr-explainerBanner">ON US</div>
        </div>

        <div className="qr-explainerColumn qr-explainerColumn--right">
          <h3 className="qr-explainerTitle qr-explainerTitle--right">
            Perks & privileges across 100+ venues
          </h3>
          <div className="qr-explainerChecklist">
            {[
              "Special discounts",
              "Freebies & upgrades",
              "Local experiences",
              "Curated for Ahangama",
            ].map((item) => (
              <div className="qr-explainerCheckRow" key={item}>
                <CheckCircleFilled className="qr-explainerCheckIcon" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="qr-explainerTagline">
            <span>Experience Ahangama</span>
            <span>like a local!</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function OfferBreakdownCard({ venue, offers, howToClaim, restrictions }) {
  return (
    <Card
      className="qr-card"
      bodyStyle={{ padding: 18 }}
      style={{ marginBottom: 16 }}
    >
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
            <SafetyCertificateOutlined
              style={{ color: "#7a6a4c", marginTop: 4 }}
            />
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

function ConversionSection({ purchaseUrl, onPassClick }) {
  return (
    <section className="qr-offerCta" aria-label="Get the Ahangama Pass">
      <div className="qr-offerCtaPanel">
        <div className="qr-offerCtaHeader">
          <PercentageOutlined className="qr-offerCtaHeaderIcon" />
          <span>Get the pass (50% off today)</span>
        </div>

        <div className="qr-offerCtaPricing">
          <div className="qr-offerCtaPriceCell">
            <span className="qr-offerCtaLabel">Original price</span>
            <div className="qr-offerCtaPrice qr-offerCtaPrice--old">30 USD</div>
          </div>
          <div className="qr-offerCtaDivider" />
          <div className="qr-offerCtaPriceCell">
            <span className="qr-offerCtaLabel">After promo code</span>
            <div className="qr-offerCtaPrice qr-offerCtaPrice--new">15 USD</div>
          </div>
          <div className="qr-offerCtaCodeBox">
            <span className="qr-offerCtaCodeLabel">Use code:</span>
            <span className="qr-offerCtaCodeValue">HELLO50</span>
          </div>
        </div>

        <Button
          className="qr-offerCtaButton"
          size="large"
          block
          href={purchaseUrl}
          onClick={() => onPassClick("conversion")}
        >
          <span>Get my pass now</span>
          <ArrowRightOutlined />
        </Button>

        <div className="qr-offerCtaMeta">
          <LockFilled />
          <span>Instant access</span>
          <span className="qr-offerCtaMetaDot">•</span>
          <span>Secure payment</span>
          <span className="qr-offerCtaMetaDot">•</span>
          <span>Cancel anytime</span>
        </div>
      </div>

      <div className="qr-offerCtaBenefits">
        <div className="qr-offerCtaBenefit">
          <ThunderboltOutlined className="qr-offerCtaBenefitIcon" />
          <div>
            <div className="qr-offerCtaBenefitTitle">Instant access</div>
            <div className="qr-offerCtaBenefitText">Start using right away</div>
          </div>
        </div>
        <div className="qr-offerCtaBenefit">
          <WalletOutlined className="qr-offerCtaBenefitIcon" />
          <div>
            <div className="qr-offerCtaBenefitTitle">Show your pass</div>
            <div className="qr-offerCtaBenefitText">
              at any venue to unlock your perk
            </div>
          </div>
        </div>
        <div className="qr-offerCtaBenefit">
          <HeartFilled className="qr-offerCtaBenefitIcon" />
          <div>
            <div className="qr-offerCtaBenefitTitle">Support local</div>
            <div className="qr-offerCtaBenefitText">
              Independent businesses in Ahangama
            </div>
          </div>
        </div>
      </div>

      <div className="qr-offerCtaFooter">
        <div className="qr-offerCtaFooterLine">One pass. Endless perks.</div>
        <div className="qr-offerCtaFooterTagline">
          Make the most of Ahangama.
        </div>
      </div>
    </section>
  );
}

function SecondaryActions({
  mapUrl,
  whatsAppUrl,
  onMapClick,
  onWhatsAppClick,
}) {
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
          <Text
            style={{
              color: "rgba(255,255,255,0.72)",
              fontSize: 12,
              display: "block",
            }}
          >
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
  const description = normalizeText(getVenueField(venue, "description"));
  const howToClaim = normalizeText(
    getVenueField(venue, "howToClaim", "how_to_claim"),
  );
  const restrictions = normalizeText(getVenueField(venue, "restrictions"));
  const mapUrl = normalizeText(getVenueField(venue, "mapUrl", "map_url"));
  const logo = normalizeText(getVenueField(venue, "logo"));
  const areaLabel = normalizeText(getVenueField(venue, "area"));
  const categoryLabel = useMemo(() => {
    const categories = getVenueField(venue, "categories", "category");
    if (Array.isArray(categories)) {
      return categories
        .filter(Boolean)
        .map((item) => normalizeText(item))
        .join(" • ");
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
    return (
      <ErrorState onRetry={() => setRetryToken((current) => current + 1)} />
    );
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

          <HeroSection
            venue={venue}
            purchaseUrl={purchaseUrl}
            mainOffer={mainOffer}
            onPrimaryClick={handlePassClick}
            areaLabel={areaLabel}
            categoryLabel={categoryLabel}
          />

          <PassBenefitsStrip />

          <PassExplainerSection venue={venue} />

          <ConversionSection
            purchaseUrl={purchaseUrl}
            onPassClick={handlePassClick}
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
        <StickyCta purchaseUrl={purchaseUrl} onPassClick={handlePassClick} />
      </div>
    </>
  );
}
