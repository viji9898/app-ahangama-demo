import process from "node:process";
import sgMail from "@sendgrid/mail";
import {
  createTrackedLink,
  recordPreparedGuestEmail,
} from "./guest-email-intelligence.js";

const FROM_EMAIL = "hello@ahangama.com";
const WELCOME_EMAIL_TYPE = "welcome";
const WELCOME_EMAIL_SOURCE = "welcome-email";
const DEFAULT_SITE_URL = "https://ahangama.com";

const VENUES = {
  livingRoom: {
    id: "living-room",
    name: "Living Room Concept Store",
    category: "Breakfast",
    description:
      "A calm cafe and concept store for an easy first morning in Ahangama.",
    storyPath: "/the-living-room-concept-store",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Living%20Room%20Concept%20Store%20Ahangama",
  },
  kaffi: {
    id: "kaffi",
    name: "Kaffi",
    category: "Breakfast",
    description:
      "A reliable coffee stop with a polished, social morning rhythm.",
    storyPath: "/eat",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Kaffi%20Ahangama",
  },
  kabalanaBeach: {
    id: "kabalana-beach",
    name: "Kabalana Beach",
    category: "Beach",
    description:
      "A wide beach and surf-facing stretch for a simple first ocean stop.",
    storyPath: "/guide",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Kabalana%20Beach",
  },
  theRock: {
    id: "the-rock",
    name: "The Rock",
    category: "Sunset",
    description:
      "A sunset-facing landmark when the evening light starts to soften.",
    storyPath: "/guide",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=The%20Rock%20Ahangama",
  },
  hakunaMatata: {
    id: "hakuna-matata",
    name: "Hakuna Matata",
    category: "Dinner",
    description:
      "An easy dinner pick when you want the first night to feel relaxed.",
    storyPath: "/eat",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Hakuna%20Matata%20Ahangama",
  },
  puraPilates: {
    id: "pura-pilates",
    name: "Pura Pilates",
    offer:
      "A focused movement stop for travellers building wellness into the stay.",
    path: "/wellness",
  },
  frostys: {
    id: "frostys",
    name: "Frosty's",
    offer: "A refreshing local benefit for a softer afternoon reset.",
    path: "/wellness",
  },
};

const ARTICLES = {
  bestCafes: {
    id: "best-cafes-ahangama",
    title: "Best Cafes in Ahangama",
    path: "/eat",
  },
  twelveThings: {
    id: "twelve-must-do-things-ahangama",
    title: "12 Must Do Things in Ahangama",
    path: "/12-things",
  },
  sunset: {
    id: "where-to-watch-sunset-ahangama",
    title: "Where to Watch Sunset in Ahangama",
    path: "/guide",
  },
  firstTimers: {
    id: "first-timers-guide-ahangama",
    title: "A First-Timer's Guide to Ahangama",
    path: "/guide",
  },
  surfGuide: {
    id: "surf-guide-ahangama",
    title: "Surf Guide to Ahangama",
    path: "/why-surfing-changed-everything-in-ahangama",
  },
  restaurantRecommendations: {
    id: "restaurant-recommendations-ahangama",
    title: "Restaurant Recommendations in Ahangama",
    path: "/eat",
  },
};

const OFFERS = [
  {
    type: "offer",
    id: "living-room-offer",
    venueId: "living-room",
    name: "Living Room",
    offer: "A welcome stop for coffee, browsing and a gentle first-day reset.",
    path: "/the-living-room-concept-store",
  },
  {
    type: "offer",
    id: "pura-pilates-offer",
    venueId: "pura-pilates",
    name: "Pura Pilates",
    offer: "A useful movement-led benefit for wellness-minded stays.",
    path: "/wellness",
  },
  {
    type: "offer",
    id: "frostys-offer",
    venueId: "frostys",
    name: "Frosty's",
    offer: "A light local perk for a refreshing break between plans.",
    path: "/wellness",
  },
];

function isLocalHostname(hostname) {
  const normalized = String(hostname || "").toLowerCase();

  return (
    normalized === "localhost" ||
    normalized === "127.0.0.1" ||
    normalized === "0.0.0.0" ||
    normalized.endsWith(".local")
  );
}

function getSiteUrl() {
  const candidates = [
    process.env.GUEST_EMAIL_BASE_URL,
    process.env.EMAIL_PUBLIC_SITE_URL,
    process.env.PUBLIC_SITE_URL,
    process.env.VITE_SITE_URL,
  ];

  for (const candidate of candidates) {
    const configured = String(candidate || "").trim();

    if (!configured) {
      continue;
    }

    try {
      const url = new URL(configured);

      if (!isLocalHostname(url.hostname)) {
        return url.origin.replace(/\/$/, "");
      }
    } catch {
      // Ignore invalid URL input and use the canonical production domain.
    }
  }

  return DEFAULT_SITE_URL;
}

function absoluteUrl(pathOrUrl) {
  if (/^https?:\/\//i.test(String(pathOrUrl || ""))) {
    return pathOrUrl;
  }

  return `${getSiteUrl()}${String(pathOrUrl || "/")}`;
}

function trackedUrl({ guest, pass, type, contentId, action, redirectUrl }) {
  return absoluteUrl(
    createTrackedLink({
      guestId: guest?.id,
      passId: pass?.id,
      type,
      contentId,
      action,
      source: WELCOME_EMAIL_SOURCE,
      redirectUrl: absoluteUrl(redirectUrl),
    }),
  );
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeInterestLabels(preferences = {}) {
  return Array.isArray(preferences?.interests)
    ? preferences.interests.map((item) => String(item || "").toLowerCase())
    : [];
}

function hasInterest(interests, keyword) {
  return interests.some((interest) => interest.includes(keyword));
}

function uniqueById(items) {
  const seen = new Set();

  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }

    seen.add(item.id);
    return true;
  });
}

function selectVenues(preferences = {}) {
  const interests = normalizeInterestLabels(preferences);
  const venues = [
    VENUES.livingRoom,
    VENUES.kaffi,
    VENUES.kabalanaBeach,
    hasInterest(interests, "food") ? VENUES.hakunaMatata : VENUES.theRock,
  ];

  return uniqueById(venues).slice(0, 4);
}

function selectArticles(preferences = {}) {
  const interests = normalizeInterestLabels(preferences);
  const articles = [ARTICLES.bestCafes, ARTICLES.twelveThings];

  if (hasInterest(interests, "surf")) {
    articles.push(ARTICLES.surfGuide);
  }

  if (hasInterest(interests, "food")) {
    articles.push(ARTICLES.restaurantRecommendations);
  }

  articles.push(ARTICLES.sunset, ARTICLES.firstTimers);

  return uniqueById(articles).slice(0, 4);
}

function selectOffers(preferences = {}) {
  const interests = normalizeInterestLabels(preferences);

  if (hasInterest(interests, "wellness")) {
    return OFFERS;
  }

  return [OFFERS[0], OFFERS[1], OFFERS[2]];
}

function linkHtml(label, href, background = "#111827", color = "#ffffff") {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;padding:10px 14px;background:${background};color:${color};text-decoration:none;border-radius:6px;font-weight:700;margin:6px 8px 6px 0;">${escapeHtml(label)}</a>`;
}

function buildVenueHtml(guest, pass, venue) {
  const storyLink = trackedUrl({
    guest,
    pass,
    type: "article",
    contentId: `${venue.id}-story`,
    action: "article_click",
    redirectUrl: venue.storyPath,
  });
  const directionsLink = trackedUrl({
    guest,
    pass,
    type: "venue",
    contentId: venue.id,
    action: "directions_click",
    redirectUrl: venue.directionsUrl,
  });

  return `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid #e5e7eb;">
        <p style="margin:0 0 4px;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:.05em;">${escapeHtml(venue.category)}</p>
        <h3 style="margin:0 0 6px;font-size:18px;">${escapeHtml(venue.name)}</h3>
        <p style="margin:0 0 8px;color:#374151;">${escapeHtml(venue.description)}</p>
        ${linkHtml("Read Story", storyLink, "#ffffff", "#111827")}
        ${linkHtml("Get Directions", directionsLink, "#0f766e")}
      </td>
    </tr>
  `;
}

function buildOfferHtml(guest, pass, offer) {
  const venueLink = trackedUrl({
    guest,
    pass,
    type: "venue",
    contentId: offer.venueId,
    action: "venue_click",
    redirectUrl: offer.path,
  });

  return `
    <li style="margin:0 0 12px;">
      <strong>${escapeHtml(offer.name)}</strong><br />
      <span style="color:#374151;">${escapeHtml(offer.offer)}</span><br />
      ${linkHtml("View Venue", venueLink, "#ffffff", "#111827")}
    </li>
  `;
}

function buildArticleHtml(guest, pass, article) {
  const articleLink = trackedUrl({
    guest,
    pass,
    type: "article",
    contentId: article.id,
    action: "article_click",
    redirectUrl: article.path,
  });

  return `<li style="margin:0 0 10px;"><strong>${escapeHtml(article.title)}</strong><br />${linkHtml("Read Article", articleLink, "#ffffff", "#111827")}</li>`;
}

function buildContentItems(venues, articles, offers) {
  return [
    ...venues.map((venue) => ({ type: "venue", id: venue.id })),
    ...articles.map((article) => ({ type: "article", id: article.id })),
    ...offers.map((offer) => ({ type: "offer", id: offer.id })),
  ];
}

export function generateGuestWelcomeEmail({ guest, pass, preferences } = {}) {
  const venues = selectVenues(preferences);
  const articles = selectArticles(preferences);
  const offers = selectOffers(preferences).slice(0, 3);
  const passLink = trackedUrl({
    guest,
    pass,
    type: "venue",
    contentId: "pass",
    action: "pass_click",
    redirectUrl: pass?.passkitInstallUrl || "/lighthouse",
  });
  const mapLink = trackedUrl({
    guest,
    pass,
    type: "article",
    contentId: "ahangama-map",
    action: "map_click",
    redirectUrl: "/map",
  });
  const guideLink = trackedUrl({
    guest,
    pass,
    type: "article",
    contentId: "ahangama-guide",
    action: "guide_click",
    redirectUrl: "/guide",
  });
  const guestName = guest?.fullName?.split(" ")?.[0] || "there";
  const subject = "Welcome to Ahangama";
  const contentItems = buildContentItems(venues, articles, offers);
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#111827;line-height:1.6;">
      <h1 style="margin:0 0 12px;font-size:30px;">Welcome to Ahangama</h1>
      <p>Hi ${escapeHtml(guestName)}, your complimentary guest pass is ready. Start with the pass, the map, and a few local picks for your first days around town.</p>
      <p>
        ${linkHtml("View My Pass", passLink, "#0f766e")}
        ${linkHtml("Open the Ahangama Map", mapLink, "#111827")}
        ${linkHtml("Read the Ahangama Guide", guideLink, "#ffffff", "#111827")}
      </p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
      <h2 style="font-size:22px;margin:0 0 8px;">Editor's Picks</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${venues
        .map((venue) => buildVenueHtml(guest, pass, venue))
        .join("")}</table>
      <h2 style="font-size:22px;margin:28px 0 8px;">Popular Pass Benefits</h2>
      <ul style="padding-left:20px;margin-top:0;">${offers
        .map((offer) => buildOfferHtml(guest, pass, offer))
        .join("")}</ul>
      <h2 style="font-size:22px;margin:28px 0 8px;">Worth Reading</h2>
      <ul style="padding-left:20px;margin-top:0;">${articles
        .map((article) => buildArticleHtml(guest, pass, article))
        .join("")}</ul>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
      <p>Over the next few days, we will use your preferences to send short daily intelligence emails with timely recommendations, events, offers and local notes.</p>
      <p style="color:#6b7280;font-size:12px;margin-top:28px;">Ahangama Pass</p>
    </div>
  `;
  const text = [
    "Welcome to Ahangama",
    "",
    `Hi ${guestName}, your complimentary guest pass is ready.`,
    `View My Pass: ${passLink}`,
    `Open the Ahangama Map: ${mapLink}`,
    `Read the Ahangama Guide: ${guideLink}`,
    "",
    "Editor's Picks",
    ...venues.map(
      (venue) => `${venue.category}: ${venue.name} - ${venue.description}`,
    ),
    "",
    "Popular Pass Benefits",
    ...offers.map((offer) => `${offer.name}: ${offer.offer}`),
    "",
    "Worth Reading",
    ...articles.map((article) => article.title),
    "",
    "Over the next few days, we will send short daily intelligence emails with timely recommendations, events, offers and local notes.",
  ].join("\n");

  return { subject, html, text, contentItems };
}

function ensureSendgrid() {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error("SENDGRID_API_KEY is required for guest welcome emails");
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function sendGuestWelcomeEmail({ guest, pass, preferences } = {}) {
  const email = generateGuestWelcomeEmail({ guest, pass, preferences });
  const history = await recordPreparedGuestEmail({
    guestId: guest?.id,
    passId: pass?.id,
    emailType: WELCOME_EMAIL_TYPE,
    source: WELCOME_EMAIL_SOURCE,
    contents: email.contentItems,
  });

  ensureSendgrid();

  await sgMail.send({
    to: guest?.email,
    from: FROM_EMAIL,
    subject: email.subject,
    html: email.html,
    text: email.text,
  });

  console.log("guest welcome email sent", {
    guestId: guest?.id,
    passId: pass?.id,
    emailHistoryId: history.emailHistory?.id,
    contentItems: history.contentHistory.length,
  });

  return { ...email, history };
}
