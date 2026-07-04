import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Button, Card, Input, Spin, Typography } from "antd";
import {
  ArrowRightOutlined,
  CheckOutlined,
  MailOutlined,
  MessageOutlined,
  CompassOutlined,
} from "@ant-design/icons";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { PLACES } from "../data/places";

const { Paragraph, Text, Title } = Typography;

export const TIP_LANDING_PATH = "/tip";

const EMAIL_PREVIEW_ENDPOINT =
  "/.netlify/functions/guest-welcome-email-preview";
const TIP_OG_IMAGE =
  "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/ogImage-tip.jpg";
const COMPACT_EMAIL_PREVIEW_WIDTH = 390;
const COMPACT_EMAIL_SCREEN_HEIGHT = 490;

const MAP_PREVIEW_CENTER = { lat: 5.9699, lng: 80.3666 };
const MAP_PREVIEW_CATEGORY_COLORS = {
  eat: "#c46a3a",
  stays: "#6b7c5a",
  wellness: "#7a6a86",
  culture: "#7a6a86",
  surf: "#3e5f73",
  experiences: "#3e5f73",
  "work-long-stays": "#6b7c5a",
  "getting-around": "#4f6f86",
  "shops-essentials": "#6b6f6a",
  community: "#4f6f86",
  "co-working": "#4f6f86",
};
const MAP_PREVIEW_PINS = PLACES.filter(
  (place) =>
    place.destinationSlug === "ahangama" &&
    typeof place.lat === "number" &&
    typeof place.lng === "number" &&
    !Number.isNaN(place.lat) &&
    !Number.isNaN(place.lng),
).map((place) => ({
  id: place.id || place.slug || place.name,
  name: place.name,
  lat: place.lat,
  lng: place.lng,
  color:
    MAP_PREVIEW_CATEGORY_COLORS[String(place.category || "").toLowerCase()] ||
    "#4f6f86",
}));

const TIP_PAGE_CONTENT = {
  seo: {
    title: "Tourism Intelligence Platform | Ahangama.com",
    description:
      "Ahangama.com helps local businesses reach visitors through personalised recommendations, curated guides, and monthly visitor intelligence.",
    ogImage: TIP_OG_IMAGE,
  },
  hero: {
    headline: "Tourism Intelligence Platform",
    tagline:
      "We directly connect with visitors in Ahangama",
    subtext:
      "Ahangama.com helps local businesses reach visitors through personalised email and WhatsApp recommendations, curated guides, and monthly visitor intelligence.",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/tahini-complimentry-pass.jpeg",
    imageAlt: "Ahangama complimentary pass guest recommendation preview",
    primaryCta: "Become a Founding Partner",
    secondaryCta: "Test the Experience",
  },
  recommendations: {
    headline: "We recommend you directly to visitors",
    copy: "Your business can be featured in personalised recommendations sent to travellers by email and WhatsApp during their stay.",
    cards: [
      {
        title: "Email recommendations",
        copy: "Featured in arrival, stay, and interest-led visitor emails.",
        Icon: MailOutlined,
        showEmailPreview: true,
      },
      {
        title: "WhatsApp recommendations",
        copy: "Suggested at the moment visitors are choosing where to go.",
        Icon: MessageOutlined,
        showWhatsAppPreview: true,
      },
      {
        title: "Guide visibility",
        copy: "Placed inside curated Ahangama guides visitors use to plan their stay.",
        Icon: CompassOutlined,
        showGuidePreview: true,
      },
      {
        title: "Map visibility",
        copy: "Shown on visitor maps when travellers are choosing where to go next.",
        Icon: CompassOutlined,
        showMapPreview: true,
      },
    ],
  },
  visitorIntelligence: {
    label: "Visitor Intelligence",
    headline: "Every visitor becomes a valuable insight.",
    copy: "Every guest who claims the complimentary Ahangama Pass chooses to share information that helps us personalise their experience. This allows us to recommend your business to visitors who are genuinely interested in what you offer, while giving you measurable insight into your audience.",
    cards: [
      {
        title: "Visitor Profile",
        twoColumns: true,
        items: [
          "Name",
          "Country",
          "Hotel",
          "Arrival Date",
          "Departure Date",
          "Length of Stay",
          "Email",
          "WhatsApp",
        ],
      },
      {
        title: "Interests",
        twoColumns: true,
        items: [
          "Surfing",
          "Cafés",
          "Restaurants",
          "Wellness",
          "Yoga",
          "Nature",
          "Shopping",
          "Nightlife",
          "Remote Working",
          "Adventure",
        ],
      },
      {
        title: "Visitor Behaviour",
        twoColumns: true,
        items: [
          "Emails opened",
          "WhatsApp engagement",
          "Recommendations clicked",
          "Articles viewed",
          "Businesses explored",
          "Map interactions",
          "Experiences viewed",
          "Pass redemptions",
        ],
      },
    ],
    highlight:
      "Rather than advertising to everyone, we introduce your business to visitors who are actively looking for experiences like yours during their stay in Ahangama.",
    stats: [
      { value: "742", label: "Visitors This Month" },
      { value: "18", label: "Countries" },
      { value: "5.6", label: "Average Stay (Nights)" },
      { value: "64%", label: "Email Open Rate" },
    ],
    statement:
      "Real visitors. Real interests. Real opportunities for local businesses.",
  },
  test: {
    headline: "Test the experience",
    copy: "See how your business could appear in a guest recommendation.",
    samples: [
      {
        label: "Sample email recommendation",
        title: "A considered place for tomorrow morning",
        copy: "Based on your interest in quiet cafes and coastal mornings, we think this is worth saving before your next surf check.",
        cta: "Send me a sample email",
      },
      {
        label: "Sample WhatsApp message",
        title: "A quick local suggestion",
        copy: "You are close by. This spot is a strong choice for lunch, coffee, or a late-afternoon stop today.",
        cta: "Send me a sample WhatsApp",
      },
    ],
  },
  pricing: {
    headline: "Founding Partner Programme",
    name: "Founding Partner",
    price: "USD $150 / month",
    term: "12-month partnership",
    scarcity: "Limited to first 50 businesses",
    standardPrice: "Standard price: USD $300 / month",
    benefits: [
      "Featured business profile",
      "Inclusion in Ahangama Guide 2026/27",
      "Email recommendations",
      "WhatsApp recommendations",
      "Priority placement",
      "Monthly visitor intelligence report",
      "Editorial and event promotion",
    ],
    cta: "Apply to become a Founding Partner",
  },
  finalCta: {
    headline: "Become one of Ahangama's first founding partners.",
    copy: "Join the businesses shaping the future of visitor discovery in Ahangama.",
    cta: "Contact Ahangama.com",
  },
};

function scrollToSection(id) {
  const element = document.getElementById(id);

  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function Section({ id, children, style }) {
  return (
    <section
      id={id}
      style={{
        padding: "clamp(56px, 11vw, 128px) 0",
        ...style,
      }}
    >
      {children}
    </section>
  );
}

function SectionHeader({ headline, copy, align = "left" }) {
  return (
    <div
      style={{
        maxWidth: 680,
        margin: align === "center" ? "0 auto 34px" : "0 0 34px",
        textAlign: align,
      }}
    >
      <Title
        level={2}
        style={{
          margin: 0,
          color: "#111111",
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "clamp(32px, 7vw, 68px)",
          lineHeight: 0.98,
          fontWeight: 500,
          letterSpacing: 0,
        }}
      >
        {headline}
      </Title>
      {copy ? (
        <Paragraph
          style={{
            margin: "18px 0 0",
            color: "#55524d",
            fontSize: "clamp(16px, 2vw, 19px)",
            lineHeight: 1.7,
          }}
        >
          {copy}
        </Paragraph>
      ) : null}
    </div>
  );
}

function PrimaryButton({ children, onClick }) {
  return (
    <Button
      type="primary"
      size="large"
      icon={<ArrowRightOutlined />}
      iconPosition="end"
      onClick={onClick}
      style={{
        minHeight: 48,
        borderRadius: 999,
        paddingInline: 24,
        background: "#111111",
        borderColor: "#111111",
        fontWeight: 700,
      }}
    >
      {children}
    </Button>
  );
}

function SecondaryButton({ children, disabled, onClick }) {
  return (
    <Button
      size="large"
      disabled={disabled}
      onClick={onClick}
      style={{
        minHeight: 48,
        borderRadius: 999,
        paddingInline: 24,
        borderColor: "#d9d4cc",
        color: "#111111",
        fontWeight: 700,
      }}
    >
      {children}
    </Button>
  );
}

function RecommendationCard({ card }) {
  const Icon = card.Icon;

  return (
    <Card
      bordered={false}
      style={{
        height: "100%",
        borderRadius: 8,
        background: "#faf9f6",
        border: "1px solid #ece7df",
        boxShadow: "none",
      }}
      styles={{ body: { padding: 24 } }}
    >
      <Icon style={{ color: "#111111", fontSize: 22, marginBottom: 34 }} />
      <Title
        level={3}
        style={{
          margin: 0,
          fontSize: card.title === "WhatsApp recommendations" ? 20 : 22,
          lineHeight: 1.15,
          whiteSpace: "nowrap",
        }}
      >
        {card.title}
      </Title>
      <Paragraph
        style={{ margin: "12px 0 0", color: "#5f5a52", lineHeight: 1.65 }}
      >
        {card.copy}
      </Paragraph>
      {card.showEmailPreview ? <CompactEmailPhone /> : null}
      {card.showWhatsAppPreview ? <CompactWhatsAppPhone /> : null}
      {card.showGuidePreview ? <CompactGuidePhone /> : null}
      {card.showMapPreview ? <CompactMapPhone /> : null}
    </Card>
  );
}

function ChecklistItem({ children }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 9,
        minWidth: 0,
      }}
    >
      <CheckOutlined
        aria-hidden="true"
        style={{ color: "#111111", fontSize: 11, flex: "0 0 auto" }}
      />
      <Text
        style={{
          color: "#38342e",
          fontSize: 14,
          lineHeight: 1.35,
          fontWeight: 650,
        }}
      >
        {children}
      </Text>
    </div>
  );
}

function VisitorIntelligenceCard({ card }) {
  return (
    <div
      className="tip-visitor-hover-card"
      style={{
        border: "1px solid #EAEAEA",
        borderRadius: 18,
        background: "#ffffff",
        padding: "clamp(20px, 2.4vw, 26px)",
        boxShadow: "0 14px 34px rgba(17, 17, 17, 0.035)",
      }}
    >
      <Title
        level={3}
        style={{
          margin: 0,
          color: "#111111",
          fontSize: 20,
          lineHeight: 1.2,
          fontWeight: 700,
        }}
      >
        {card.title}
      </Title>
      <div
        className={card.twoColumns ? "tip-visitor-checklist" : undefined}
        style={{
          display: "grid",
          gap: "11px 14px",
          marginTop: 18,
        }}
      >
        {card.items.map((item) => (
          <ChecklistItem key={item}>{item}</ChecklistItem>
        ))}
      </div>
    </div>
  );
}

function PhoneProfileShell({ title, children }) {
  return (
    <div style={{ marginTop: 16 }}>
      <Text
        style={{
          display: "block",
          margin: "0 0 7px 4px",
          color: "#8a837a",
          fontSize: 10,
          fontWeight: 900,
          letterSpacing: 1.2,
          textTransform: "uppercase",
        }}
      >
        {title}
      </Text>
      <div
        style={{
          overflow: "hidden",
          border: "1px solid rgba(17, 17, 17, 0.06)",
          borderRadius: 16,
          background: "#ffffff",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function PhoneProfileGroup({ title, rows, checked = false }) {
  return (
    <PhoneProfileShell title={title}>
      {rows.map(([label, value], index) => (
        <div
          key={label}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "12px 13px",
            borderTop: index ? "1px solid #eeeeec" : 0,
          }}
        >
          <Text style={{ color: "#706a62", fontSize: 13, fontWeight: 700 }}>
            {label}
          </Text>
          <Text
            style={{
              color: "#111111",
              fontSize: 13,
              fontWeight: 800,
              textAlign: "right",
            }}
          >
            {checked ? "✓ " : ""}
            {value}
          </Text>
        </div>
      ))}
    </PhoneProfileShell>
  );
}

function PhoneProfileTags({ title, items }) {
  return (
    <PhoneProfileShell title={title}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: 13 }}>
        {items.map((item) => (
          <span
            key={item}
            style={{
              border: "1px solid #e7e2da",
              borderRadius: 999,
              background: "#fbfaf7",
              padding: "7px 10px",
              color: "#111111",
              fontSize: 12,
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </PhoneProfileShell>
  );
}

function PhoneProfileActivity({ title, items }) {
  return (
    <PhoneProfileShell title={title}>
      {items.map((item, index) => (
        <div
          key={item}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 13px",
            borderTop: index ? "1px solid #eeeeec" : 0,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#111111",
              flex: "0 0 auto",
            }}
          />
          <Text style={{ color: "#25221f", fontSize: 13, fontWeight: 750 }}>
            {item}
          </Text>
        </div>
      ))}
    </PhoneProfileShell>
  );
}

function VisitorProfilePhone() {
  const interests = ["Wellness", "Surfing", "Coffee", "Local Food"];
  const activities = [
    "Opened Welcome Email",
    "Viewed Best Cafés",
    "Clicked Sunset Yoga",
    "Redeemed Complimentary Coffee",
  ];

  return (
    <div
      aria-label="Example visitor profile"
      style={{
        width: "min(100%, 318px)",
        margin: "0 auto",
        padding: 10,
        border: "1px solid #171717",
        borderRadius: 38,
        background: "#171717",
        boxShadow: "0 26px 72px rgba(17, 17, 17, 0.16)",
      }}
    >
      <div
        style={{
          height: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 76,
            height: 5,
            borderRadius: 99,
            background: "#2d2d2d",
          }}
        />
      </div>
      <div
        style={{
          minHeight: 610,
          borderRadius: 28,
          overflow: "hidden",
          background: "#f5f4f0",
          padding: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <div
            style={{
              display: "grid",
              placeItems: "center",
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "#111111",
              color: "#ffffff",
              fontSize: 18,
              fontWeight: 800,
            }}
          >
            AM
          </div>
          <div>
            <Text
              style={{
                display: "block",
                color: "#111111",
                fontSize: 18,
                lineHeight: 1.1,
                fontWeight: 800,
              }}
            >
              Anna Müller
            </Text>
            <Text style={{ color: "#77716a", fontSize: 13, fontWeight: 700 }}>
              Germany
            </Text>
          </div>
        </div>

        <PhoneProfileGroup
          title="Staying"
          rows={[
            ["Hotel", "The Sandhya Hotel"],
            ["Dates", "12-18 July"],
            ["Length", "6 Nights"],
          ]}
        />
        <PhoneProfileTags title="Interests" items={interests} />
        <PhoneProfileGroup
          title="Communication"
          rows={[
            ["Email", "Enabled"],
            ["WhatsApp", "Enabled"],
          ]}
          checked
        />
        <PhoneProfileActivity title="Recent Activity" items={activities} />
      </div>
    </div>
  );
}

function VisitorIntelligenceSection({ content }) {
  return (
    <Section
      style={{
        padding: "clamp(88px, 12vw, 148px) 0 clamp(78px, 11vw, 136px)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          borderTop: "1px solid #EAEAEA",
          borderBottom: "1px solid #EAEAEA",
          padding: "clamp(54px, 7vw, 84px) 0",
          background: "#fbfaf7",
        }}
      >
        <div
          className="tip-visitor-intelligence-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 3fr) minmax(280px, 2fr)",
            gap: "clamp(34px, 6vw, 76px)",
            alignItems: "start",
            padding: "0 clamp(18px, 4vw, 56px)",
          }}
        >
          <div>
            <Text
              style={{
                display: "block",
                marginBottom: 18,
                color: "#8b8277",
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              {content.label}
            </Text>
            <Title
              level={2}
              style={{
                maxWidth: 700,
                margin: 0,
                color: "#111111",
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "clamp(40px, 7vw, 78px)",
                lineHeight: 0.96,
                fontWeight: 500,
                letterSpacing: 0,
              }}
            >
              {content.headline}
            </Title>
            <Paragraph
              style={{
                maxWidth: 620,
                margin: "24px 0 0",
                color: "#55524d",
                fontSize: "clamp(16px, 1.8vw, 19px)",
                lineHeight: 1.75,
              }}
            >
              {content.copy}
            </Paragraph>
            <div style={{ display: "grid", gap: 14, marginTop: 34 }}>
              {content.cards.map((card) => (
                <VisitorIntelligenceCard key={card.title} card={card} />
              ))}
            </div>
            <div
              className="tip-visitor-hover-card"
              style={{
                marginTop: 16,
                border: "1px solid #EAEAEA",
                borderRadius: 20,
                background: "#f5efe4",
                padding: "clamp(22px, 3vw, 30px)",
                boxShadow: "0 14px 34px rgba(17, 17, 17, 0.03)",
              }}
            >
              <Paragraph
                style={{
                  margin: 0,
                  color: "#211f1c",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "clamp(21px, 2.5vw, 29px)",
                  lineHeight: 1.24,
                }}
              >
                {content.highlight}
              </Paragraph>
            </div>
          </div>
          <div className="tip-visitor-phone-column">
            <VisitorProfilePhone />
          </div>
        </div>

        <div
          className="tip-visitor-stats-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 14,
            marginTop: "clamp(38px, 6vw, 64px)",
            padding: "0 clamp(18px, 4vw, 56px)",
          }}
        >
          {content.stats.map((stat) => (
            <div
              key={stat.label}
              className="tip-visitor-hover-card"
              style={{
                minHeight: 132,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                border: "1px solid #EAEAEA",
                borderRadius: 18,
                background: "#ffffff",
                padding: "22px 18px",
                textAlign: "center",
                boxShadow: "0 12px 30px rgba(17, 17, 17, 0.03)",
              }}
            >
              <Text
                style={{
                  display: "block",
                  color: "#111111",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "clamp(38px, 4.5vw, 58px)",
                  lineHeight: 0.95,
                }}
              >
                {stat.value}
              </Text>
              <Text
                style={{
                  display: "block",
                  marginTop: 12,
                  color: "#7b746b",
                  fontSize: 11,
                  fontWeight: 900,
                  letterSpacing: 1.4,
                  textTransform: "uppercase",
                }}
              >
                {stat.label}
              </Text>
            </div>
          ))}
        </div>

        <Paragraph
          style={{
            maxWidth: 760,
            margin: "clamp(30px, 5vw, 46px) auto 0",
            padding: "0 18px",
            color: "#111111",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "clamp(26px, 3.8vw, 44px)",
            lineHeight: 1.14,
            textAlign: "center",
          }}
        >
          {content.statement}
        </Paragraph>
      </div>
    </Section>
  );
}

function CompactMapPhone() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const token = import.meta.env.VITE_MAPBOX_TOKEN;

    if (!token || !mapContainerRef.current || mapRef.current) {
      return undefined;
    }

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [MAP_PREVIEW_CENTER.lng, MAP_PREVIEW_CENTER.lat],
      zoom: 12.45,
      attributionControl: false,
      interactive: true,
    });

    mapRef.current = map;

    MAP_PREVIEW_PINS.forEach((pin) => {
      const markerElement = document.createElement("div");
      markerElement.style.width = "22px";
      markerElement.style.height = "22px";
      markerElement.style.borderRadius = "50% 50% 50% 5px";
      markerElement.style.background = pin.color;
      markerElement.style.border = "2px solid #ffffff";
      markerElement.style.boxShadow = "0 5px 14px rgba(0, 0, 0, 0.24)";
      markerElement.style.transform = "rotate(-45deg)";
      markerElement.style.cursor = "pointer";

      const markerDot = document.createElement("span");
      markerDot.style.position = "absolute";
      markerDot.style.inset = "6px";
      markerDot.style.borderRadius = "50%";
      markerDot.style.background = "#ffffff";
      markerElement.appendChild(markerDot);

      new mapboxgl.Marker({ element: markerElement, anchor: "bottom" })
        .setLngLat([pin.lng, pin.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 18 }).setHTML(
            `<strong>${pin.name}</strong><br><span>${pin.lat.toFixed(5)}, ${pin.lng.toFixed(5)}</span>`,
          ),
        )
        .addTo(map);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      aria-label="Ahangama map preview"
      style={{
        width: "min(100%, 240px)",
        margin: "24px auto 0",
        padding: 8,
        border: "1px solid #171717",
        borderRadius: 28,
        background: "#171717",
        boxShadow: "0 18px 42px rgba(40, 32, 20, 0.22)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "2px 0 7px",
        }}
      >
        <Text
          style={{
            color: "#f4f0e8",
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: 1.1,
            textTransform: "uppercase",
          }}
        >
          Map preview
        </Text>
      </div>
      <div
        style={{
          height: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 52,
            height: 4,
            borderRadius: 99,
            background: "#2e2e2e",
          }}
        />
      </div>
      <div
        style={{
          position: "relative",
          height: COMPACT_EMAIL_SCREEN_HEIGHT,
          overflow: "hidden",
          borderRadius: 20,
          background: "#ffffff",
        }}
      >
        <div
          ref={mapContainerRef}
          aria-label="Ahangama map with partner pins"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        />
        <a
          href="https://maps.app.goo.gl/YW3xW7Krn4UwrFAN7"
          target="_blank"
          rel="noreferrer"
          style={{
            position: "absolute",
            left: 14,
            right: 14,
            bottom: 14,
            zIndex: 2,
            minHeight: 38,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 999,
            background: "#111111",
            color: "#ffffff",
            fontSize: 11,
            fontWeight: 900,
            textDecoration: "none",
            boxShadow: "0 12px 28px rgba(0, 0, 0, 0.24)",
          }}
        >
          Open in Google Maps
        </a>
      </div>
    </div>
  );
}

function CompactGuidePhone() {
  const screenRef = useRef(null);
  const [screenWidth, setScreenWidth] = useState(224);

  useEffect(() => {
    if (!screenRef.current || typeof ResizeObserver === "undefined") {
      return undefined;
    }

    const observer = new ResizeObserver(([entry]) => {
      if (entry?.contentRect?.width) {
        setScreenWidth(entry.contentRect.width);
      }
    });

    observer.observe(screenRef.current);

    return () => observer.disconnect();
  }, []);

  const previewScale = Math.min(screenWidth / COMPACT_EMAIL_PREVIEW_WIDTH, 1);
  const iframeHeight = Math.ceil(COMPACT_EMAIL_SCREEN_HEIGHT / previewScale);

  return (
    <div
      aria-label="Ahangama guide preview"
      style={{
        width: "min(100%, 240px)",
        margin: "24px auto 0",
        padding: 8,
        border: "1px solid #171717",
        borderRadius: 28,
        background: "#171717",
        boxShadow: "0 18px 42px rgba(40, 32, 20, 0.22)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "2px 0 7px",
        }}
      >
        <Text
          style={{
            color: "#f4f0e8",
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: 1.1,
            textTransform: "uppercase",
          }}
        >
          Guide preview
        </Text>
      </div>
      <div
        style={{
          height: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 52,
            height: 4,
            borderRadius: 99,
            background: "#2e2e2e",
          }}
        />
      </div>
      <div
        ref={screenRef}
        style={{
          height: COMPACT_EMAIL_SCREEN_HEIGHT,
          overflow: "hidden",
          borderRadius: 20,
          background: "#ffffff",
        }}
      >
        <iframe
          title="Ahangama guide preview"
          src="/guide"
          scrolling="yes"
          style={{
            display: "block",
            width: COMPACT_EMAIL_PREVIEW_WIDTH,
            height: iframeHeight,
            border: 0,
            background: "#ffffff",
            transform: `scale(${previewScale})`,
            transformOrigin: "top left",
          }}
        />
      </div>
    </div>
  );
}

function CompactWhatsAppPhone() {
  const messages = [
    {
      from: "ahangama",
      text: "Hi Dinara! I'm Shoaib from ahangama.com.\n\nWelcome to Ahangama, and thanks for claiming your complimentary pass. I noticed you're interested in wellness, cafes, and nature, so I thought I'd share a couple of places you might love.\n\nPura Pilates is a beautiful spot for a wellness session, and you can enjoy an exclusive discount with your pass.\n\nKaffi is one of my favorite cafes for great coffee and a relaxed atmosphere. They also have a special offer available for pass holders.\n\nJust out of curiosity, how long are you staying in Ahangama?",
      time: "11:43",
    },
    {
      from: "guest",
      text: "Thank you\nI stay till autumn",
      time: "12:16",
    },
    {
      from: "ahangama",
      text: "That's perfect, you'll really get to experience Ahangama. Since you're here for a while, I can share some really nice spots and experiences with you along the way.",
      time: "12:51",
    },
    {
      from: "guest",
      text: "Thank you",
      time: "16:55",
    },
  ];

  return (
    <div
      aria-label="WhatsApp recommendation preview"
      style={{
        width: "min(100%, 240px)",
        margin: "24px auto 0",
        padding: 8,
        border: "1px solid #171717",
        borderRadius: 28,
        background: "#171717",
        boxShadow: "0 18px 42px rgba(40, 32, 20, 0.22)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "2px 0 7px",
        }}
      >
        <Text
          style={{
            color: "#f4f0e8",
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: 1.1,
            textTransform: "uppercase",
          }}
        >
          WhatsApp preview
        </Text>
      </div>
      <div
        style={{
          height: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 52,
            height: 4,
            borderRadius: 99,
            background: "#2e2e2e",
          }}
        />
      </div>
      <div
        style={{
          height: COMPACT_EMAIL_SCREEN_HEIGHT,
          overflow: "hidden",
          borderRadius: 20,
          background: "#0b141a",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            minHeight: 54,
            padding: "9px 11px",
            background: "#111b21",
            color: "#ffffff",
          }}
        >
          <div
            style={{
              display: "grid",
              width: 29,
              height: 29,
              placeItems: "center",
              borderRadius: "50%",
              background: "#d8c7ac",
              color: "#111b21",
              fontSize: 13,
              fontWeight: 800,
            }}
          >
            D
          </div>
          <div style={{ minWidth: 0 }}>
            <Text
              style={{
                display: "block",
                color: "#ffffff",
                fontSize: 12,
                fontWeight: 800,
                lineHeight: 1.1,
              }}
            >
              Dinara
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.68)", fontSize: 9 }}>
              last seen today at 16:59
            </Text>
          </div>
        </div>
        <div
          style={{
            height: COMPACT_EMAIL_SCREEN_HEIGHT - 54,
            overflowY: "auto",
            padding: "14px 10px 16px",
            background:
              "radial-gradient(circle at 18% 18%, rgba(255,255,255,0.08) 0 1px, transparent 1px), linear-gradient(135deg, #0b141a, #111b21)",
            backgroundSize: "18px 18px, auto",
          }}
        >
          <div
            style={{
              width: "fit-content",
              maxWidth: "78%",
              margin: "0 auto 14px",
              padding: "5px 10px",
              borderRadius: 7,
              background: "#1f2c33",
              color: "#ffd279",
              fontSize: 9,
              fontWeight: 700,
              lineHeight: 1.35,
              textAlign: "center",
            }}
          >
            Messages and calls are end-to-end encrypted.
          </div>
          {messages.map((message) => {
            const isGuest = message.from === "guest";

            return (
              <div
                key={`${message.time}-${message.text}`}
                style={{
                  display: "flex",
                  justifyContent: isGuest ? "flex-end" : "flex-start",
                  marginBottom: 9,
                }}
              >
                <div
                  style={{
                    maxWidth: isGuest ? "72%" : "88%",
                    padding: "8px 10px 6px",
                    borderRadius: isGuest
                      ? "12px 12px 12px 4px"
                      : "12px 12px 4px 12px",
                    background: isGuest ? "#202c33" : "#005c4b",
                    boxShadow: "0 2px 7px rgba(0, 0, 0, 0.16)",
                  }}
                >
                  <Text
                    style={{
                      display: "block",
                      color: "#f7f8f8",
                      fontSize: 10.5,
                      fontWeight: 700,
                      lineHeight: 1.38,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {message.text}
                  </Text>
                  <Text
                    style={{
                      display: "block",
                      marginTop: 4,
                      color: "rgba(255,255,255,0.58)",
                      fontSize: 8,
                      textAlign: "right",
                    }}
                  >
                    {message.time}
                  </Text>
                </div>
              </div>
            );
          })}
          <div
            style={{
              display: "flex",
              gap: 6,
              marginTop: 18,
            }}
          >
            <div
              style={{
                flex: 1,
                minHeight: 32,
                borderRadius: 999,
                background: "#202c33",
                color: "#8796a1",
                display: "flex",
                alignItems: "center",
                paddingInline: 12,
                fontSize: 10,
              }}
            >
              Message
            </div>
            <div
              style={{
                display: "grid",
                width: 32,
                height: 32,
                placeItems: "center",
                borderRadius: "50%",
                background: "#00a884",
                color: "#ffffff",
                fontSize: 13,
                fontWeight: 900,
              }}
            >
              &gt;
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompactEmailPhone() {
  const screenRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(true);
  const [previewError, setPreviewError] = useState(null);
  const [screenWidth, setScreenWidth] = useState(224);

  useEffect(() => {
    if (!screenRef.current || typeof ResizeObserver === "undefined") {
      return undefined;
    }

    const observer = new ResizeObserver(([entry]) => {
      if (entry?.contentRect?.width) {
        setScreenWidth(entry.contentRect.width);
      }
    });

    observer.observe(screenRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadPreview() {
      try {
        const response = await fetch(EMAIL_PREVIEW_ENDPOINT, {
          cache: "no-store",
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.error || "Unable to load email preview");
        }

        if (isMounted) {
          setPreview(data.guestWelcome || data);
        }
      } catch (error) {
        if (isMounted) {
          setPreviewError(error.message || "Preview unavailable");
        }
      } finally {
        if (isMounted) {
          setIsLoadingPreview(false);
        }
      }
    }

    loadPreview();

    return () => {
      isMounted = false;
    };
  }, []);

  const previewScale = Math.min(screenWidth / COMPACT_EMAIL_PREVIEW_WIDTH, 1);
  const iframeHeight = Math.ceil(COMPACT_EMAIL_SCREEN_HEIGHT / previewScale);

  return (
    <div
      aria-label="Guest welcome email preview"
      style={{
        width: "min(100%, 240px)",
        margin: "24px auto 0",
        padding: 8,
        border: "1px solid #171717",
        borderRadius: 28,
        background: "#171717",
        boxShadow: "0 18px 42px rgba(40, 32, 20, 0.22)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "2px 0 7px",
        }}
      >
        <Text
          style={{
            color: "#f4f0e8",
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: 1.1,
            textTransform: "uppercase",
          }}
        >
          Email preview
        </Text>
      </div>
      <div
        style={{
          height: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 52,
            height: 4,
            borderRadius: 99,
            background: "#2e2e2e",
          }}
        />
      </div>
      <div
        ref={screenRef}
        style={{
          height: COMPACT_EMAIL_SCREEN_HEIGHT,
          overflow: "hidden",
          borderRadius: 20,
          background: "#ffffff",
        }}
      >
        {isLoadingPreview ? (
          <div
            style={{
              display: "grid",
              minHeight: 330,
              placeItems: "center",
            }}
          >
            <Spin size="small" />
          </div>
        ) : preview?.html ? (
          <iframe
            title="Guest welcome email preview"
            srcDoc={preview.html}
            scrolling="yes"
            style={{
              display: "block",
              width: COMPACT_EMAIL_PREVIEW_WIDTH,
              height: iframeHeight,
              border: 0,
              background: "#ffffff",
              transform: `scale(${previewScale})`,
              transformOrigin: "top left",
            }}
          />
        ) : (
          <div
            style={{
              display: "grid",
              minHeight: 330,
              placeItems: "center",
              padding: 18,
              textAlign: "center",
            }}
          >
            <Text type="secondary" style={{ fontSize: 12 }}>
              {previewError || "Preview unavailable"}
            </Text>
          </div>
        )}
      </div>
    </div>
  );
}

function SampleCard({ sample }) {
  const isEmailSample = sample.cta === "Send me a sample email";
  const [sampleEmail, setSampleEmail] = useState("");
  const [isSendingSample, setIsSendingSample] = useState(false);
  const [sendSampleStatus, setSendSampleStatus] = useState(null);

  async function sendSampleEmail() {
    const email = sampleEmail.trim();

    if (!email) {
      setSendSampleStatus({ type: "error", message: "Enter an email address." });
      return;
    }

    setIsSendingSample(true);
    setSendSampleStatus(null);

    try {
      const response = await fetch(EMAIL_PREVIEW_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, emailType: "guest-welcome" }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Unable to send sample email");
      }

      setSendSampleStatus({
        type: "success",
        message: `Sent the welcome guest email to ${data.recipient || email}.`,
      });
    } catch (error) {
      setSendSampleStatus({
        type: "error",
        message: error.message || "Unable to send sample email.",
      });
    } finally {
      setIsSendingSample(false);
    }
  }

  return (
    <Card
      bordered={false}
      style={{
        height: "100%",
        borderRadius: 8,
        background: "#ffffff",
        border: "1px solid #ebe6de",
        boxShadow: "0 18px 44px rgba(35, 32, 28, 0.06)",
      }}
      styles={{ body: { padding: 26 } }}
    >
      <Text
        style={{
          display: "block",
          marginBottom: 18,
          color: "#8b8277",
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: 1.4,
          textTransform: "uppercase",
        }}
      >
        {sample.label}
      </Text>
      <Title level={3} style={{ margin: 0, fontSize: 24, lineHeight: 1.12 }}>
        {sample.title}
      </Title>
      <Paragraph
        style={{ margin: "16px 0 24px", color: "#55524d", lineHeight: 1.7 }}
      >
        {sample.copy}
      </Paragraph>
      {isEmailSample ? (
        <div style={{ display: "grid", gap: 12 }}>
          <Input
            type="email"
            size="large"
            value={sampleEmail}
            placeholder="Email address"
            autoComplete="email"
            onChange={(event) => {
              setSampleEmail(event.target.value);
              if (sendSampleStatus) {
                setSendSampleStatus(null);
              }
            }}
            onPressEnter={sendSampleEmail}
            style={{
              minHeight: 48,
              borderRadius: 999,
              paddingInline: 18,
              borderColor: "#d9d4cc",
            }}
          />
          <SecondaryButton disabled={isSendingSample} onClick={sendSampleEmail}>
            {isSendingSample ? "Sending..." : sample.cta}
          </SecondaryButton>
          {sendSampleStatus ? (
            <Text
              type={sendSampleStatus.type === "error" ? "danger" : "success"}
              style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.4 }}
            >
              {sendSampleStatus.message}
            </Text>
          ) : null}
        </div>
      ) : (
        <SecondaryButton>{sample.cta}</SecondaryButton>
      )}
    </Card>
  );
}

export default function TipLandingPage() {
  const content = TIP_PAGE_CONTENT;

  return (
    <SiteLayout navOverlayHero>
      <Seo
        title={content.seo.title}
        description={content.seo.description}
        canonical={absUrl(TIP_LANDING_PATH)}
        ogImage={content.seo.ogImage}
      />

      <main style={{ background: "#ffffff", color: "#111111" }}>
        <div
          style={{
            width: "min(100% - 32px, 1120px)",
            margin: "0 auto",
          }}
        >
          <div
            className="ahg-hero"
            style={{
              width: "100vw",
              marginLeft: "calc(50% - 50vw)",
              marginRight: "calc(50% - 50vw)",
              borderRadius: 0,
              background: "#FFFFFF",
              boxShadow: "none",
            }}
          >
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                minHeight: "100svh",
              }}
            >
              <div
                aria-hidden="true"
                className="home-hero-media-layer"
                style={{
                  position: "absolute",
                  inset: 0,
                  overflow: "hidden",
                }}
              >
                <div
                  className="home-hero-overlay"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(90deg, rgba(10,14,18,0.84) 0%, rgba(10,14,18,0.76) 22%, rgba(10,14,18,0.52) 42%, rgba(10,14,18,0.22) 62%, rgba(10,14,18,0.04) 82%, rgba(10,14,18,0) 100%)",
                    pointerEvents: "none",
                    zIndex: 2,
                  }}
                />
                <img
                  className="home-hero-image"
                  src={content.hero.image}
                  alt={content.hero.imageAlt}
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 1,
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "right center",
                  }}
                />
              </div>

              <div
                style={{
                  position: "relative",
                  zIndex: 3,
                  width: "100%",
                  maxWidth: 1100,
                  margin: "0 auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    minHeight: "100svh",
                    maxWidth: 680,
                    padding:
                      "clamp(44px, 5vw, 68px) clamp(32px, 4.8vw, 72px) 36px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 12,
                      marginBottom: 18,
                    }}
                  >
                    {["Ahangama.com for Business", "Founding Partners"].map(
                      (item) => (
                        <Text
                          key={item}
                          style={{
                            color: "#FFFFFF",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: 1.6,
                            textTransform: "uppercase",
                          }}
                        >
                          {item}
                        </Text>
                      ),
                    )}
                  </div>

                  <Title
                    className="home-hero-title"
                    style={{
                      margin: 0,
                      color: "#FFFFFF",
                      fontWeight: 500,
                      fontFamily:
                        '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
                    }}
                  >
                    <span
                      className="home-hero-titleLine"
                      style={{ color: "#FFFFFF" }}
                    >
                      Tourism
                    </span>
                    <span
                      className="home-hero-titleLine"
                      style={{ color: "#FFFFFF" }}
                    >
                      Intelligence
                    </span>
                    <span
                      className="home-hero-titleLine"
                      style={{ color: "#FFFFFF" }}
                    >
                      Platform
                    </span>
                  </Title>

                  <Paragraph
                    style={{
                      marginTop: 24,
                      marginBottom: 0,
                      maxWidth: 560,
                      color: "#FFFFFF",
                      fontSize: "clamp(18px, 2.1vw, 26px)",
                      lineHeight: 1.35,
                      fontWeight: 600,
                    }}
                  >
                    {content.hero.tagline}
                  </Paragraph>

                  <Paragraph
                    style={{
                      marginTop: 18,
                      marginBottom: 28,
                      maxWidth: 540,
                      color: "rgba(255,255,255,0.9)",
                      fontSize: "clamp(15px, 1.45vw, 18px)",
                      lineHeight: 1.72,
                    }}
                  >
                    {content.hero.subtext}
                  </Paragraph>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                    <Button
                      size="large"
                      icon={<ArrowRightOutlined />}
                      iconPosition="end"
                      onClick={() => scrollToSection("pricing")}
                      style={{
                        minHeight: 48,
                        borderRadius: 999,
                        paddingInline: 24,
                        background: "#FFFFFF",
                        borderColor: "#FFFFFF",
                        color: "#111111",
                        fontWeight: 800,
                      }}
                    >
                      {content.hero.primaryCta}
                    </Button>
                    <Button
                      size="large"
                      onClick={() => scrollToSection("test")}
                      style={{
                        minHeight: 48,
                        borderRadius: 999,
                        paddingInline: 24,
                        background: "rgba(255,255,255,0.08)",
                        borderColor: "rgba(255,255,255,0.72)",
                        color: "#FFFFFF",
                        fontWeight: 800,
                      }}
                    >
                      {content.hero.secondaryCta}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Section style={{ paddingBottom: "clamp(28px, 4vw, 48px)" }}>
            <SectionHeader
              headline={content.recommendations.headline}
              copy={content.recommendations.copy}
            />
            <div
              className="tip-recommendations-grid"
              style={{
                display: "grid",
                gap: 14,
              }}
            >
              {content.recommendations.cards.map((card) => (
                <RecommendationCard key={card.title} card={card} />
              ))}
            </div>
          </Section>

          <VisitorIntelligenceSection content={content.visitorIntelligence} />

          <Section id="test" style={{ paddingTop: "clamp(24px, 4vw, 44px)" }}>
            <SectionHeader
              headline={content.test.headline}
              copy={content.test.copy}
              align="center"
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 16,
              }}
            >
              {content.test.samples.map((sample) => (
                <SampleCard key={sample.label} sample={sample} />
              ))}
            </div>
          </Section>

          <Section id="pricing">
            <SectionHeader headline={content.pricing.headline} align="center" />
            <Card
              bordered={false}
              style={{
                maxWidth: 680,
                margin: "0 auto",
                borderRadius: 8,
                background: "#111111",
                color: "#ffffff",
                boxShadow: "0 26px 70px rgba(17, 17, 17, 0.16)",
              }}
              styles={{ body: { padding: "clamp(28px, 6vw, 54px)" } }}
            >
              <Text
                style={{
                  color: "#cfc8bd",
                  fontWeight: 800,
                  letterSpacing: 1.4,
                  textTransform: "uppercase",
                }}
              >
                {content.pricing.name}
              </Text>
              <Title
                level={3}
                style={{
                  margin: "18px 0 6px",
                  color: "#ffffff",
                  fontSize: "clamp(36px, 8vw, 62px)",
                  lineHeight: 1,
                }}
              >
                {content.pricing.price}
              </Title>
              <Paragraph style={{ margin: 0, color: "#cfc8bd", fontSize: 17 }}>
                {content.pricing.term}
              </Paragraph>
              <Paragraph
                style={{ margin: "8px 0 0", color: "#ffffff", fontSize: 17 }}
              >
                {content.pricing.scarcity}
              </Paragraph>
              <Paragraph
                style={{
                  margin: "20px 0 0",
                  color: "#b8afa3",
                  fontSize: 16,
                  textDecoration: "line-through",
                }}
              >
                {content.pricing.standardPrice}
              </Paragraph>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "10px 18px",
                  marginTop: 24,
                }}
              >
                {content.pricing.benefits.map((benefit) => (
                  <div
                    key={benefit}
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                    }}
                  >
                    <CheckOutlined style={{ color: "#ffffff", marginTop: 4 }} />
                    <Text style={{ color: "#ffffff", fontSize: 15 }}>
                      {benefit}
                    </Text>
                  </div>
                ))}
              </div>
              <Button
                size="large"
                icon={<ArrowRightOutlined />}
                iconPosition="end"
                style={{
                  minHeight: 50,
                  borderRadius: 999,
                  paddingInline: 24,
                  marginTop: 24,
                  background: "#ffffff",
                  color: "#111111",
                  borderColor: "#ffffff",
                  fontWeight: 800,
                }}
              >
                {content.pricing.cta}
              </Button>
            </Card>
          </Section>

          <Section
            style={{
              textAlign: "center",
              paddingBottom: "clamp(72px, 12vw, 150px)",
            }}
          >
            <SectionHeader
              headline={content.finalCta.headline}
              copy={content.finalCta.copy}
              align="center"
            />
            <PrimaryButton>{content.finalCta.cta}</PrimaryButton>
          </Section>
        </div>
      </main>
    </SiteLayout>
  );
}
