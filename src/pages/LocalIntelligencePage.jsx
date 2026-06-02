import React from "react";
import { Typography } from "antd";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";

const { Title, Paragraph, Text } = Typography;

const LIVE_TICKER_ITEMS = [
  "Surf 3-4ft at Marshmallow",
  "Sunny 29°C",
  "New opening: Studio Mukti",
  "Pickleball trending",
  "Sunset Session Fri 6PM",
];

const FEATURE_SUMMARY =
  "Ahangama feels more kinetic this week. Morning surf has been clean, new openings are pulling more foot traffic into Kabalana, and the social temperature around town is rising ahead of the weekend. Pickleball continues to dominate local conversation, while quieter corners like Secret Beach still offer the calmest sunsets. The mood is energetic but not chaotic: more people, more reasons to stay out, and a noticeable sense that the season is building rather than peaking. If you want the week in one sentence, it is this: Ahangama is busy, bright and slightly ahead of itself.";

const INTELLIGENCE_CARDS = [
  {
    key: "feature",
    kind: "feature",
    eyebrow: "Weekly Briefing",
    tone: "neutral",
    title: "This Week in Ahangama",
    body: FEATURE_SUMMARY,
    actionLabel: "Read briefing",
    href: "/blog",
  },
  {
    key: "surf",
    kind: "tall",
    eyebrow: "Surf Conditions",
    tone: "green",
    title: "3-4ft at Marshmallow",
    body: "Light offshore winds and clean morning conditions.",
    footer: "Updated 2 hours ago",
    actionLabel: "Open report",
    href: "/12-things",
  },
  {
    key: "weather",
    kind: "compact",
    eyebrow: "Weather",
    tone: "yellow",
    title: "Mostly Sunny",
    meta: "29°C",
    body: "Light winds expected throughout the afternoon.",
  },
  {
    key: "opening",
    kind: "compact",
    eyebrow: "New Opening",
    tone: "blue",
    title: "Studio Mukti",
    body: "Now open in Kabalana.",
  },
  {
    key: "trending",
    kind: "compact",
    eyebrow: "Trending",
    tone: "purple",
    title: "Pickleball",
    body: "Coconut Court remains busy.",
  },
  {
    key: "discussed",
    kind: "compact",
    eyebrow: "Most Discussed",
    tone: "purple",
    title: "The Ahangama Guide 2026",
    body: "Most shared article this week.",
  },
  {
    key: "event",
    kind: "compact",
    eyebrow: "Event This Week",
    tone: "amber",
    title: "Sunset Sessions",
    detailLines: ["Friday", "The Kip", "6:00 PM"],
  },
  {
    key: "editor-note",
    kind: "compact",
    eyebrow: "Editor's Note",
    tone: "neutral",
    title: "The town feels noticeably busier this week",
    body: "The town feels noticeably busier this week.",
  },
  {
    key: "breakfast",
    kind: "compact",
    eyebrow: "Best Breakfast",
    tone: "neutral",
    title: "Follow The White Rabbit",
    body: "Editor's pick this week.",
  },
  {
    key: "sunset",
    kind: "compact",
    eyebrow: "Best Sunset",
    tone: "neutral",
    title: "Secret Beach",
    body: "Calm conditions and clear skies.",
  },
  {
    key: "crowd",
    kind: "compact",
    eyebrow: "Crowd Meter",
    tone: "amber",
    title: "Right Now",
    crowdRows: [
      ["Ahangama Town", "Busy"],
      ["Kabalana", "Moderate"],
      ["Midigama", "Quiet"],
    ],
  },
  {
    key: "nomad",
    kind: "compact",
    eyebrow: "Digital Nomad Report",
    tone: "blue",
    title: "Best Work Cafe",
    meta: "Focus Hub",
    body: "Reliable WiFi and plenty of seating this week.",
  },
  {
    key: "community",
    kind: "compact",
    eyebrow: "Community Board",
    tone: "green",
    title: "Beach Cleanup",
    detailLines: ["Saturday", "8:00 AM", "Meet at Kabalana Beach."],
  },
  {
    key: "read",
    kind: "compact",
    eyebrow: "Most Read",
    tone: "neutral",
    title: "What Everyone Is Reading",
    numberedItems: [
      "48 Hours in Ahangama",
      "Wellness Guide",
      "Best Cafes in Ahangama",
    ],
  },
];

function IntelligenceCard({ card }) {
  return (
    <a
      href={card.href || "#"}
      onClick={card.href ? undefined : (event) => event.preventDefault()}
      className={`local-intelligence-card local-intelligence-card--${card.kind}`}
      aria-label={card.eyebrow}
    >
      <div className="local-intelligence-cardEyebrowRow">
        <Text className="local-intelligence-cardEyebrow">{card.eyebrow}</Text>
        <span
          className={`local-intelligence-statusDot local-intelligence-statusDot--${card.tone || "neutral"}`}
          aria-hidden="true"
        />
      </div>

      <Title level={3} className="local-intelligence-cardTitle">
        {card.title}
      </Title>

      {card.meta ? (
        <Text className="local-intelligence-cardMeta">{card.meta}</Text>
      ) : null}

      {card.body ? (
        <Paragraph className="local-intelligence-cardBody">
          {card.body}
        </Paragraph>
      ) : null}

      {card.footer ? (
        <Text className="local-intelligence-cardFooter">{card.footer}</Text>
      ) : null}

      {card.detailLines ? (
        <div className="local-intelligence-cardDetailGroup">
          {card.detailLines.map((line) => (
            <Text key={line} className="local-intelligence-cardDetailLine">
              {line}
            </Text>
          ))}
        </div>
      ) : null}

      {card.crowdRows ? (
        <div className="local-intelligence-cardCrowdList">
          {card.crowdRows.map(([place, status]) => (
            <div className="local-intelligence-cardCrowdRow" key={place}>
              <Text className="local-intelligence-cardCrowdPlace">{place}</Text>
              <Text className="local-intelligence-cardCrowdStatus">
                {status}
              </Text>
            </div>
          ))}
        </div>
      ) : null}

      {card.numberedItems ? (
        <ol className="local-intelligence-cardNumberedList">
          {card.numberedItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      ) : null}

      {card.bulletItems ? (
        <ul className="local-intelligence-cardBulletList">
          {card.bulletItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}

      {card.actionLabel ? (
        <span className="local-intelligence-cardAction">{`${card.actionLabel} ->`}</span>
      ) : null}
    </a>
  );
}

export default function LocalIntelligencePage() {
  const canonical = absUrl("/local-intelligence");

  return (
    <SiteLayout>
      <Seo
        title="Ahangama Intelligence | Live Snapshot of What Is Happening Right Now"
        description="Local updates, openings, events and observations from around town. A live editorial snapshot of what is happening in Ahangama right now."
        canonical={canonical}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Ahangama Intelligence",
          url: canonical,
          description:
            "A live editorial snapshot of openings, trends, events and observations from Ahangama.",
        }}
      />

      <div className="local-intelligence-page">
        <div className="local-intelligence-shell">
          <header className="local-intelligence-header">
            <Text className="local-intelligence-kicker">Ahangama Bulletin</Text>
            <Title className="local-intelligence-title">
              Ahangama Intelligence
            </Title>
            <Paragraph className="local-intelligence-subtitle">
              Local updates, openings, events and observations from around town.
            </Paragraph>
            <Text className="local-intelligence-timestamp">
              Updated 2 hours ago
            </Text>
          </header>

          <div
            className="local-intelligence-ticker"
            aria-label="Live intelligence ticker"
          >
            <div className="local-intelligence-tickerTrack">
              {[...LIVE_TICKER_ITEMS, ...LIVE_TICKER_ITEMS].map(
                (item, index) => (
                  <span
                    className="local-intelligence-tickerItem"
                    key={`${item}-${index}`}
                  >
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>

          <section
            className="local-intelligence-grid"
            aria-label="Local intelligence cards"
          >
            {INTELLIGENCE_CARDS.map((card) => (
              <IntelligenceCard key={card.key} card={card} />
            ))}
          </section>
        </div>
      </div>
    </SiteLayout>
  );
}
