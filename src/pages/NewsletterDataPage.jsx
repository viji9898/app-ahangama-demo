import React from "react";
import { Typography } from "antd";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import SiteLayout from "../components/layout/SiteLayout";
import {
  NEWSLETTER_COMP_PASS_SIGNUP_VENUES,
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
const CHARACTER_QUOTE_IMAGE = "/newsletter-character-quote.png";

const SUNSET_ARTICLE = {
  title: "Where Ahangama Gathers for Sunset",
  href: "/where-ahangama-gathers-for-sunset-stairway-rooftop-bar-at-lighthouse-hotel/?utm_source=newsletter&utm_medium=online&utm_campaign=newsletter_data&utm_content=sunset_article",
  image:
    "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/where-ahangama-gathers-for-sunset+/hero-view-from-the-bar.jpg",
};

const TWELVE_THINGS_ARTICLE = {
  title: "12 Things to Do in Ahangama",
  href: "/12-things/?utm_source=newsletter&utm_medium=online&utm_campaign=newsletter_data&utm_content=12_things_article",
  image:
    "https://hips.hearstapps.com/hmg-prod/images/exploring-ahangama-the-surfing-sweet-spot-on-sri-lanka-s-southern-coast-66475f779dc88.jpg?crop=0.6672958942897593xw:1xh;center,top&resize=640:*",
};

const TEXT_ARTICLES = [
  {
    label: "Town Guide",
    title: "Sri Lanka's Most Interesting Coastal Town",
    href: "/sri-lankas-most-interesting-coastal-town/?utm_source=newsletter&utm_medium=online&utm_campaign=newsletter_data&utm_content=text_coastal_town_article",
  },
  {
    label: "Transport",
    title: "Getting Around Ahangama",
    href: "/getting-around-ahangama-scooters-tuk-tuks-airport-transfers/?utm_source=newsletter&utm_medium=online&utm_campaign=newsletter_data&utm_content=text_getting_around_article",
  },
  {
    label: "Design",
    title: "The Living Room Concept Store",
    href: "/the-living-room-concept-store/?utm_source=newsletter&utm_medium=online&utm_campaign=newsletter_data&utm_content=text_living_room_article",
  },
];
const FEATURED_ARTICLE_COUNT = TEXT_ARTICLES.length + 2;

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

function EntryMeta({
  item,
  compact = false,
  showInstagram = true,
  showCoordinates = false,
}) {
  const instagramUrl = item.instagramUrl || buildInstagramUrl(item.instagram);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: compact ? "2px 8px" : "4px 12px",
        marginTop: compact ? 9 : 18,
        color: "#555",
        fontFamily: SANS_FONT,
        fontSize: compact ? 11 : 13,
        lineHeight: 1.45,
      }}
    >
      {showInstagram ? (
        <div>
          <strong style={{ color: "#242424" }}>Instagram: </strong>
          {instagramUrl ? (
            <MetaLink label={`@${item.instagram}`} href={instagramUrl} />
          ) : (
            <span>Pending</span>
          )}
        </div>
      ) : null}
      {showCoordinates ? (
        <div>
          <strong style={{ color: "#242424" }}>Coordinates: </strong>
          <Coordinates latitude={item.latitude} longitude={item.longitude} />
        </div>
      ) : null}
      <div>
        <strong style={{ color: "#242424" }}>Map: </strong>
        <MetaLink label="Open Google Maps" href={item.googleUrl} />
      </div>
    </div>
  );
}

function CompPassSignupVenueEntry({ item }) {
  return (
    <article style={{ padding: "16px 0", borderBottom: "1px solid #242424" }}>
      <Text
        style={{
          display: "block",
          marginBottom: 5,
          color: ACCENT,
          fontFamily: SERIF_FONT,
          fontSize: 10,
          fontWeight: 700,
          textTransform: "uppercase",
        }}
      >
        {item.type} / {item.slug}
      </Text>
      <Title
        level={3}
        style={{
          margin: 0,
          color: "#242424",
          fontFamily: SERIF_FONT,
          fontSize: 22,
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {item.name}
      </Title>
      <EntryMeta item={item} compact showCoordinates />
      <a
        href={item.signupUrl}
        style={{
          display: "inline-block",
          marginTop: 10,
          color: "#242424",
          fontFamily: SANS_FONT,
          fontSize: 12,
          fontWeight: 700,
          textDecoration: "underline",
          textTransform: "uppercase",
        }}
      >
        Open comp pass signup page
      </a>
    </article>
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
            fontSize: 32,
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
            fontSize: 20,
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

function NewsletterArticleInsert({ article }) {
  return (
    <article style={{ borderTop: "1px solid #242424" }}>
      <a
        href={article.href}
        style={{
          display: "block",
          padding: "28px 0",
          borderBottom: "1px solid #242424",
          color: "#ffffff",
          textDecoration: "none",
        }}
      >
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            aspectRatio: "4 / 3",
            background: "#111",
          }}
        >
          <img
            src={article.image}
            alt={article.title}
            loading="lazy"
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.08) 35%, rgba(0,0,0,0.72) 100%)",
            }}
          />
          <Title
            level={2}
            style={{
              position: "absolute",
              right: 16,
              bottom: 16,
              left: 16,
              margin: 0,
              color: "#ffffff",
              fontFamily: SERIF_FONT,
              fontSize: 32,
              fontWeight: 700,
              lineHeight: 0.98,
              textShadow: "0 2px 12px rgba(0,0,0,0.55)",
            }}
          >
            <span style={{ color: "#ffffff" }}>{article.title}</span>
          </Title>
        </div>
      </a>
    </article>
  );
}

function EssentialEntry({ item }) {
  return (
    <article style={{ padding: "11px 0", borderBottom: "1px solid #242424" }}>
      <Text
        style={{
          display: "block",
          marginBottom: 4,
          color: ACCENT,
          fontFamily: SERIF_FONT,
          fontSize: 10,
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
          fontSize: 17,
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {item.name}
      </Title>
      <EntryMeta
        item={item}
        compact
        showInstagram={false}
        showCoordinates={false}
      />
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
                fontSize: 15,
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
                fontSize: 26,
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
          href="/events?utm_source=newsletter&utm_medium=online&utm_campaign=newsletter_data&utm_content=view_full_events"
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

function TextArticlesSection() {
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
        Articles: <span style={{ color: ACCENT }}>Further Reading</span>
      </div>
      {TEXT_ARTICLES.map((article) => (
        <article
          key={article.href}
          style={{ padding: "18px 0", borderBottom: "1px solid #242424" }}
        >
          <Text
            style={{
              display: "block",
              marginBottom: 6,
              color: ACCENT,
              fontFamily: SERIF_FONT,
              fontSize: 15,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {article.label}
          </Text>
          <a href={article.href} style={{ color: "#242424" }}>
            <Title
              level={3}
              style={{
                margin: 0,
                color: "#242424",
                fontFamily: SERIF_FONT,
                fontSize: 26,
                fontWeight: 700,
                lineHeight: 1,
                textDecoration: "underline",
              }}
            >
              {article.title}
            </Title>
          </a>
        </article>
      ))}
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
  const compPassVenueCount = NEWSLETTER_COMP_PASS_SIGNUP_VENUES.length;

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
            overflow: "hidden",
            padding: "18px 16px 20px",
            background: "#000000",
            color: "#ffffff",
          }}
        >
          <div style={{ maxWidth: "100%" }}>
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
                fontSize: 46,
                fontWeight: 700,
                letterSpacing: 0,
                lineHeight: 0.9,
                maxWidth: "100%",
                textTransform: "uppercase",
              }}
            >
              <span style={{ color: "#ffffff", display: "block" }}>The</span>
              <span
                style={{
                  color: "#ffffff",
                  display: "block",
                  fontSize: 40,
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                Ahangama
              </span>
              <span style={{ color: "#ffffff", display: "block" }}>Minute</span>
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
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              marginBottom: 26,
              paddingBottom: 22,
              borderBottom: "1px solid #242424",
            }}
          >
            <img
              src={CHARACTER_QUOTE_IMAGE}
              alt="Ahangama character"
              loading="lazy"
              style={{
                display: "block",
                flex: "0 0 88px",
                width: 88,
                height: "auto",
              }}
            />
            <Paragraph
              style={{
                margin: 0,
                color: "#111",
                fontFamily: SERIF_FONT,
                fontSize: 24,
                fontStyle: "italic",
                fontWeight: 700,
                lineHeight: 1.28,
              }}
            >
              Physically I&apos;m here. Mentally I&apos;m in a pool in Ahangama
              ordering my third arrack cocktail.
            </Paragraph>
          </div>
          <div
            style={{
              display: "grid",
              gap: 8,
              color: "#242424",
              fontFamily: SERIF_FONT,
              fontSize: 12,
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            <div>
              <span style={{ color: ACCENT }}>THE LIST:</span>{" "}
              {NEWSLETTER_DATA.length} vendor recommendations
            </div>
            <div>
              <span style={{ color: ACCENT }}>FEATURED ARTICLES:</span>{" "}
              {FEATURED_ARTICLE_COUNT} featured articles
            </div>
            <div>
              <span style={{ color: ACCENT }}>EVENTS:</span>{" "}
              {THIS_WEEK_EVENTS.length} events
            </div>
            <div>
              <span style={{ color: ACCENT }}>COMP PASS SIGNUPS:</span>{" "}
              {compPassVenueCount} venues
            </div>
          </div>
        </section>

        <WhatsOnSection />

        <section style={{ marginTop: 28 }}>
          {NEWSLETTER_DATA.map((item, index) => (
            <React.Fragment key={`${item.vendor}-${item.category}`}>
              <NewsletterEntry item={item} index={index} />
              {index === 4 ? (
                <NewsletterArticleInsert article={SUNSET_ARTICLE} />
              ) : null}
              {index === 12 ? (
                <NewsletterArticleInsert article={TWELVE_THINGS_ARTICLE} />
              ) : null}
            </React.Fragment>
          ))}
        </section>

        <TextArticlesSection />

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
            Complimentary Pass: <span style={{ color: ACCENT }}>Signup Venues</span>
          </div>
          {NEWSLETTER_COMP_PASS_SIGNUP_VENUES.map((item) => (
            <CompPassSignupVenueEntry key={item.slug} item={item} />
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
