import React from "react";
import { Typography } from "antd";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import SiteLayout from "../components/layout/SiteLayout";
import {
  NEWSLETTER_DATA,
  NEWSLETTER_ESSENTIALS_NEARBY_HELP,
} from "../data/newsletterData";
import { THIS_WEEK_EVENTS } from "../data/eventsCalendar";

const { Paragraph, Text, Title } = Typography;

const NEWSLETTER_DATA_PATH = "/newsletter-data";

const SERIF_FONT = '"Cormorant Garamond", "Libre Baskerville", Georgia, serif';
const SANS_FONT =
  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const ACCENT = "#ff6f61";

function buildInstagramUrl(handle) {
  if (!handle) return null;

  return `https://www.instagram.com/${String(handle).replace(/^@/, "")}/`;
}

function Coordinates({ latitude, longitude }) {
  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return <span>Coordinates pending</span>;
  }

  return (
    <span>
      {latitude.toFixed(6)}, {longitude.toFixed(6)}
    </span>
  );
}

function MetaLink({ label, href }) {
  if (!href) return <span>{label}: Pending</span>;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: "#242424", textDecoration: "underline" }}
    >
      {label}
    </a>
  );
}

function EntryMeta({ item }) {
  const instagramUrl = buildInstagramUrl(item.instagram);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "4px 12px",
        marginTop: 18,
        color: "#555",
        fontFamily: SANS_FONT,
        fontSize: 13,
        lineHeight: 1.45,
      }}
    >
      <div>
        <strong style={{ color: "#242424" }}>Instagram: </strong>
        {instagramUrl ? (
          <MetaLink label={`@${item.instagram}`} href={instagramUrl} />
        ) : (
          <span>Pending</span>
        )}
      </div>
      <div>
        <strong style={{ color: "#242424" }}>Coordinates: </strong>
        <Coordinates latitude={item.latitude} longitude={item.longitude} />
      </div>
      <div>
        <strong style={{ color: "#242424" }}>Map: </strong>
        <MetaLink label="Open Google Maps" href={item.googleUrl} />
      </div>
    </div>
  );
}

function NewsletterEntry({ item, index }) {
  return (
    <article style={{ borderTop: "1px solid #242424" }}>
      <div
        style={{
          padding: "9px 8px 8px",
          borderBottom: "1px solid #777",
          background: "#f3f3f3",
          color: "#242424",
          fontFamily: SERIF_FONT,
          fontSize: 20,
          fontWeight: 700,
          lineHeight: 1,
          textTransform: "uppercase",
        }}
      >
        {String(index + 1).padStart(2, "0")} {" / "}
        <span style={{ color: ACCENT }}>{item.category}</span>
      </div>

      <div
        style={{
          padding: "28px 0 28px",
          borderBottom: "1px solid #242424",
        }}
      >
        <Title
          level={2}
          style={{
            margin: 0,
            color: "#242424",
            fontFamily: SERIF_FONT,
            fontSize: 42,
            fontWeight: 700,
            lineHeight: 0.98,
          }}
        >
          {item.vendor}
        </Title>
        <Paragraph
          style={{
            margin: "10px 0 0",
            color: "#242424",
            fontFamily: SERIF_FONT,
            fontSize: 26,
            fontStyle: "italic",
            fontWeight: 600,
            lineHeight: 1.18,
          }}
        >
          {item.tagline}
        </Paragraph>

        <EntryMeta item={item} />

        {item.venues?.length ? (
          <div
            style={{
              display: "grid",
              gap: 12,
              marginTop: 18,
              padding: "14px 0 0",
              borderTop: "1px solid #bdbdbd",
            }}
          >
            {item.venues.map((venue) => (
              <div key={venue.vendor}>
                <Text
                  style={{
                    display: "block",
                    marginBottom: 4,
                    color: ACCENT,
                    fontFamily: SERIF_FONT,
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                >
                  {venue.vendor}
                </Text>
                <EntryMeta item={venue} />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

function EssentialEntry({ item }) {
  return (
    <article style={{ padding: "22px 0", borderBottom: "1px solid #242424" }}>
      <Text
        style={{
          display: "block",
          marginBottom: 8,
          color: ACCENT,
          fontFamily: SERIF_FONT,
          fontSize: 20,
          fontWeight: 700,
          textTransform: "uppercase",
        }}
      >
        {item.type}
      </Text>
      <Title
        level={3}
        style={{
          margin: 0,
          color: "#242424",
          fontFamily: SERIF_FONT,
          fontSize: 34,
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {item.name}
      </Title>
      <EntryMeta item={item} />
    </article>
  );
}

function WhatsOnSection() {
  const events = THIS_WEEK_EVENTS.slice(0, 3);

  if (!events.length) return null;

  return (
    <section style={{ marginTop: 28, borderTop: "5px solid #242424" }}>
      <div
        style={{
          padding: "9px 8px 8px",
          borderBottom: "1px solid #777",
          background: "#f3f3f3",
          color: "#242424",
          fontFamily: SERIF_FONT,
          fontSize: 20,
          fontWeight: 700,
          lineHeight: 1,
          textTransform: "uppercase",
        }}
      >
        What's On: <span style={{ color: ACCENT }}>Next Three</span>
      </div>
      <div style={{ borderBottom: "1px solid #242424" }}>
        {events.map((event) => (
          <article
            key={`${event.date}-${event.title}-${event.venue}`}
            style={{
              padding: "22px 0",
              borderBottom: "1px solid #bdbdbd",
            }}
          >
            <Text
              style={{
                display: "block",
                marginBottom: 8,
                color: ACCENT,
                fontFamily: SERIF_FONT,
                fontSize: 20,
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              {event.date}
            </Text>
            <Title
              level={3}
              style={{
                margin: 0,
                color: "#242424",
                fontFamily: SERIF_FONT,
                fontSize: 34,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {event.title}
            </Title>
            <Paragraph
              style={{
                margin: "9px 0 0",
                color: "#242424",
                fontFamily: SANS_FONT,
                fontSize: 14,
                lineHeight: 1.45,
              }}
            >
              {event.venue} · {event.time}
            </Paragraph>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "4px 12px",
                marginTop: 12,
                color: "#555",
                fontFamily: SANS_FONT,
                fontSize: 13,
                lineHeight: 1.45,
              }}
            >
              <div>
                <strong style={{ color: "#242424" }}>Instagram: </strong>
                <MetaLink label="Open Instagram" href={event.instagramUrl} />
              </div>
              <div>
                <strong style={{ color: "#242424" }}>Map: </strong>
                <MetaLink label="Open Google Maps" href={event.directionsUrl} />
              </div>
            </div>
          </article>
        ))}
        <a
          href="/events"
          style={{
            display: "inline-block",
            margin: "18px 0 22px",
            color: "#242424",
            fontFamily: SERIF_FONT,
            fontSize: 22,
            fontWeight: 700,
            textDecoration: "underline",
            textTransform: "uppercase",
          }}
        >
          View full events
        </a>
      </div>
    </section>
  );
}

export default function NewsletterDataPage() {
  const canonical = absUrl(NEWSLETTER_DATA_PATH);
  const dateLabel = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "numeric",
    year: "2-digit",
  }).format(new Date());
  const categories = [...new Set(NEWSLETTER_DATA.map((item) => item.category))];
  const completeCount = NEWSLETTER_DATA.filter(
    (item) => item.instagram && item.latitude && item.longitude,
  ).length;
  const essentialsCompleteCount = NEWSLETTER_ESSENTIALS_NEARBY_HELP.filter(
    (item) => item.latitude && item.longitude,
  ).length;

  return (
    <SiteLayout>
      <Seo
        title="Newsletter Data | Ahangama"
        description="Newsletter vendor data for Ahangama recommendations, including taglines, categories, Instagram handles, coordinates and Google Maps links."
        canonical={canonical}
      />

      <main
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "8px 20px 72px",
          background: "#ffffff",
        }}
      >
        <header
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "space-between",
            padding: "18px 16px 18px",
            background: "#000000",
            color: "#ffffff",
          }}
        >
          <div>
            <Text
              style={{
                display: "block",
                marginBottom: 14,
                color: ACCENT,
                fontFamily: SERIF_FONT,
                fontSize: 17,
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              {dateLabel}
            </Text>
            <Title
              level={1}
              style={{
                margin: 0,
                color: "#ffffff",
                fontFamily: SERIF_FONT,
                fontSize: 52,
                fontWeight: 700,
                letterSpacing: 1,
                lineHeight: 0.78,
                textTransform: "uppercase",
              }}
            >
              <span style={{ color: "#ffffff" }}>The</span>
              <br />
              <span style={{ color: "#ffffff" }}>Ahangama</span>
              <br />
              <span style={{ color: "#ffffff" }}>Minute</span>
            </Title>
          </div>
          <div
            style={{
              display: "grid",
              alignContent: "start",
              flex: "1 1 180px",
              color: "#8f8f8f",
              fontFamily: SANS_FONT,
              fontSize: 17,
              lineHeight: 1.1,
            }}
          >
            {categories.slice(0, 7).map((category) => (
              <span
                key={category}
                style={{
                  display: "block",
                  padding: "2px 0 4px",
                  borderBottom: "1px solid #555",
                }}
              >
                {category}
              </span>
            ))}
          </div>
        </header>

        <section
          style={{
            marginTop: 14,
            padding: "10px 10px 8px",
            border: "1px solid #242424",
            fontFamily: SANS_FONT,
          }}
        >
          <Text style={{ display: "block", color: "#777", fontSize: 20 }}>
            Prepared for
          </Text>
          <Text style={{ display: "block", color: "#242424", fontSize: 23 }}>
            Ahangama Dispatch
          </Text>
        </section>

        <section
          style={{
            marginTop: 14,
            padding: "20px 20px 26px",
            border: "2px solid #242424",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              display: "grid",
              placeItems: "center",
              width: 54,
              height: 54,
              marginBottom: 24,
              border: "3px solid #000",
              borderRadius: "50%",
              color: "#000",
              fontFamily: SERIF_FONT,
              fontSize: 30,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            A
          </div>
          <Paragraph
            style={{
              margin: "0 0 26px",
              color: "#2a2a2a",
              fontFamily: SERIF_FONT,
              fontSize: 27,
              fontStyle: "italic",
              fontWeight: 600,
              lineHeight: 1.34,
            }}
          >
            Good morning from Ahangama. Here is the working newsletter dataset:
            local picks, practical services and map-backed notes for the next
            dispatch.
          </Paragraph>
          <div
            style={{
              display: "grid",
              gap: 8,
              color: "#242424",
              fontFamily: SERIF_FONT,
              fontSize: 24,
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            <div>
              <span style={{ color: ACCENT }}>THE LIST:</span>{" "}
              {NEWSLETTER_DATA.length} vendor recommendations
            </div>
            <div>
              <span style={{ color: ACCENT }}>MAP READY:</span> {completeCount}{" "}
              rows with Instagram and coordinates
            </div>
            <div>
              <span style={{ color: ACCENT }}>NEARBY HELP:</span>{" "}
              {NEWSLETTER_ESSENTIALS_NEARBY_HELP.length} essentials,{" "}
              {essentialsCompleteCount} with coordinates
            </div>
          </div>
        </section>

        <WhatsOnSection />

        <section style={{ marginTop: 28 }}>
          {NEWSLETTER_DATA.map((item, index) => (
            <NewsletterEntry
              key={`${item.vendor}-${item.category}`}
              item={item}
              index={index}
            />
          ))}
        </section>

        <section style={{ marginTop: 28 }}>
          <div
            style={{
              padding: "9px 8px 8px",
              borderTop: "5px solid #242424",
              borderBottom: "1px solid #777",
              background: "#f3f3f3",
              color: "#242424",
              fontFamily: SERIF_FONT,
              fontSize: 20,
              fontWeight: 700,
              lineHeight: 1,
              textTransform: "uppercase",
            }}
          >
            Essentials: <span style={{ color: ACCENT }}>Nearby Help</span>
          </div>
          {NEWSLETTER_ESSENTIALS_NEARBY_HELP.map((item) => (
            <EssentialEntry key={`${item.name}-${item.type}`} item={item} />
          ))}
        </section>
      </main>
    </SiteLayout>
  );
}

export { NEWSLETTER_DATA_PATH };