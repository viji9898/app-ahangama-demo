import React from "react";
import { Link } from "react-router-dom";
import SiteLayout from "../components/layout/SiteLayout";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import { GUIDE_ITINERARIES } from "../features/print-guide/openingGuideData";

const DAYS = {
  "day-01": {
    slug: "day-01",
    kicker: "Start here",
    title: "Your First 24 Hours in Ahangama",
    standfirst:
      "Just arrived? Don't overthink it. Here's how we'd spend your first day.",
    metaTitle: "Your First 24 Hours in Ahangama (Day 1) | Ahangama Guide",
    metaDescription:
      "An hour-by-hour first day in Ahangama, from breakfast and a morning swim at Kabalana to Koggala Lake, sunset and dinner.",
    itinerary: GUIDE_ITINERARIES[8],
  },
  "day-02": {
    slug: "day-02",
    kicker: "48 hours in Ahangama",
    title: "Day 02",
    standfirst:
      "A slower second day: movement, coffee, the lake, and a long Sri Lankan lunch.",
    metaTitle: "Day 02 in Ahangama | Ahangama Guide",
    metaDescription:
      "A slower second day in Ahangama: morning movement, coffee, Koggala Lake, a Sri Lankan lunch, shopping and sunset.",
    itinerary: GUIDE_ITINERARIES[9],
  },
};

const styles = {
  page: {
    background: "#F7F3EC",
    color: "#1F2A24",
    minHeight: "100svh",
    padding: "clamp(96px, 12vw, 148px) clamp(20px, 6vw, 72px) 72px",
  },
  inner: {
    maxWidth: 920,
    margin: "0 auto",
  },
  back: {
    display: "inline-block",
    marginBottom: 28,
    color: "#7A4B36",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textDecoration: "none",
    textTransform: "uppercase",
  },
  kicker: {
    display: "block",
    marginBottom: 14,
    color: "#9B4E3F",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
  },
  title: {
    margin: 0,
    fontFamily: '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
    fontSize: "clamp(44px, 8vw, 92px)",
    fontWeight: 500,
    lineHeight: 0.96,
  },
  standfirst: {
    maxWidth: 640,
    margin: "24px 0 48px",
    color: "#4B463F",
    fontSize: "clamp(17px, 2vw, 20px)",
    lineHeight: 1.7,
  },
  list: {
    display: "grid",
    gap: 0,
    borderTop: "1px solid #D8CFBE",
  },
  item: {
    display: "grid",
    gridTemplateColumns: "88px minmax(0, 1fr)",
    gap: 24,
    padding: "22px 0",
    borderBottom: "1px solid #D8CFBE",
  },
  time: {
    color: "#9B4E3F",
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: "0.08em",
  },
  itemTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
    lineHeight: 1.3,
  },
  itemText: {
    margin: "8px 0 0",
    color: "#4B463F",
    fontSize: 16,
    lineHeight: 1.7,
  },
  footerNote: {
    marginTop: 44,
    color: "#6B6358",
    fontSize: 14,
    lineHeight: 1.7,
  },
  link: {
    color: "#1F2A24",
    fontWeight: 700,
  },
};

export default function GuideDayPage({ day }) {
  const config = DAYS[day];

  if (!config) return null;

  const canonical = absUrl(`/guide/${config.slug}`);

  return (
    <SiteLayout>
      <Seo
        title={config.metaTitle}
        description={config.metaDescription}
        canonical={canonical}
        ogImage="https://res.cloudinary.com/dp7in4ulw/image/upload/v1786550110/Guide_OG_Image_kbrjmt.webp"
      />
      <main style={styles.page}>
        <div style={styles.inner}>
          <Link to="/guide" style={styles.back}>
            ← Back to the Ahangama Guide
          </Link>
          <span style={styles.kicker}>{config.kicker}</span>
          <h1 style={styles.title}>{config.title}</h1>
          <p style={styles.standfirst}>{config.standfirst}</p>

          <div style={styles.list}>
            {config.itinerary.map(([time, title, description]) => (
              <article key={time} style={styles.item}>
                <time style={styles.time}>{time}</time>
                <div>
                  <h2 style={styles.itemTitle}>{title}</h2>
                  <p style={styles.itemText}>{description}</p>
                </div>
              </article>
            ))}
          </div>

          <p style={styles.footerNote}>
            Looking for more?{" "}
            <Link to="/guide" style={styles.link}>
              Explore the full Ahangama Guide
            </Link>
            .
          </p>
        </div>
      </main>
    </SiteLayout>
  );
}
