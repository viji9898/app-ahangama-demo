import process from "node:process";
import sgMail from "@sendgrid/mail";
import {
  NEWSLETTER_DATA,
  NEWSLETTER_ESSENTIALS_NEARBY_HELP,
} from "../src/data/newsletterData.js";
import {
  createTrackedLink,
  recordPreparedGuestEmail,
} from "./guest-email-intelligence.js";

const FROM_EMAIL = "hello@ahangama.com";
const WELCOME_EMAIL_TYPE = "welcome";
const WELCOME_EMAIL_SOURCE = "welcome-email";
const DEFAULT_SITE_URL = "https://ahangama.com";
const ACCENT = "#ff6f61";
const QUOTE_IMAGE_PATH = "/newsletter-character-quote.png";

const FEATURED_ARTICLES = [
  {
    id: "sunset-article",
    label: "Sunset",
    title: "Where Ahangama Gathers for Sunset",
    path: "/where-ahangama-gathers-for-sunset-stairway-rooftop-bar-at-lighthouse-hotel/?utm_source=welcome_email&utm_medium=email&utm_campaign=newsletter_data&utm_content=sunset_article",
  },
  {
    id: "twelve-things-article",
    label: "Guide",
    title: "12 Things to Do in Ahangama",
    path: "/12-things/?utm_source=welcome_email&utm_medium=email&utm_campaign=newsletter_data&utm_content=12_things_article",
  },
  {
    id: "coastal-town-article",
    label: "Town Guide",
    title: "Sri Lanka's Most Interesting Coastal Town",
    path: "/sri-lankas-most-interesting-coastal-town/?utm_source=welcome_email&utm_medium=email&utm_campaign=newsletter_data&utm_content=text_coastal_town_article",
  },
  {
    id: "getting-around-article",
    label: "Transport",
    title: "Getting Around Ahangama",
    path: "/getting-around-ahangama-scooters-tuk-tuks-airport-transfers/?utm_source=welcome_email&utm_medium=email&utm_campaign=newsletter_data&utm_content=text_getting_around_article",
  },
  {
    id: "living-room-article",
    label: "Design",
    title: "The Living Room Concept Store",
    path: "/the-living-room-concept-store/?utm_source=welcome_email&utm_medium=email&utm_campaign=newsletter_data&utm_content=text_living_room_article",
  },
];

const WELCOME_EVENTS = [
  {
    id: "surf-club-sunset-club",
    date: "Sat 27 Jun 2026",
    title: "Sunset Club",
    venue: "Surf Club Midigama",
    time: "From 4:00 PM onwards",
    instagramUrl:
      "https://www.google.com/search?q=site%3Ainstagram.com%20Surf%20Club%20Midigama%20Ahangama",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Surf%20Club%20Midigama%20Ahangama",
  },
  {
    id: "ceylon-sliders-saturday-session",
    date: "Sat 27 Jun 2026",
    title: "Saturday Session",
    venue: "Ceylon Sliders",
    time: "8:00 PM - 1:00 AM",
    instagramUrl: "https://www.instagram.com/ceylonsliders/",
    directionsUrl: "https://maps.app.goo.gl/4761wqeeWxPwhEhMA",
  },
  {
    id: "ember-ice-breathwork",
    date: "Tue 30 Jun 2026",
    title: "Breathwork",
    venue: "Ember & Ice",
    time: "10:00 AM",
    instagramUrl:
      "https://www.google.com/search?q=site%3Ainstagram.com%20Ember%20%26%20Ice%20Ahangama",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Ember%20%26%20Ice%20Ahangama",
  },
  {
    id: "le-cafe-happy-hour",
    date: "Ongoing",
    title: "Daily Happy Hour",
    venue: "Le Cafe French Bistro",
    time: "5:00 PM - 6:00 PM",
    instagramUrl:
      "https://www.google.com/search?q=site%3Ainstagram.com%20Le%20Cafe%20French%20Bistro%20Ahangama",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Le%20Cafe%20French%20Bistro%20Ahangama",
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

function slugify(value) {
  return String(value || "item")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildInstagramUrl(handle) {
  if (!handle) return null;

  return `https://www.instagram.com/${String(handle).replace(/^@/, "")}/`;
}

function smallLinkHtml(label, href) {
  if (!href) return "";

  return `<a href="${escapeHtml(href)}" style="color:#111;text-decoration:underline;font-weight:700;">${escapeHtml(label)}</a>`;
}

function articleLinkHtml(guest, pass, article) {
  const href = trackedUrl({
    guest,
    pass,
    type: "article",
    contentId: article.id,
    action: "article_click",
    redirectUrl: article.path,
  });

  return `<a href="${escapeHtml(href)}" style="color:#111;text-decoration:none;display:block;">${escapeHtml(article.title)}</a>`;
}

function buildVendorHtml(guest, pass, item, index) {
  const instagramLink = buildInstagramUrl(item.instagram);
  const mapLink = trackedUrl({
    guest,
    pass,
    type: "venue",
    contentId: slugify(item.vendor),
    action: "directions_click",
    redirectUrl: item.googleUrl,
  });

  return `
    <tr>
      <td style="padding:16px 0;border-top:1px solid #111;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="width:42px;vertical-align:top;color:${ACCENT};font-family:Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:1.5px;">${String(index + 1).padStart(2, "0")}</td>
            <td style="vertical-align:top;">
              <div style="font-family:Arial,sans-serif;font-size:8px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${ACCENT};margin-bottom:5px;">${escapeHtml(item.category)}</div>
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:20px;line-height:1.05;font-weight:700;color:#111;margin-bottom:4px;">${escapeHtml(item.vendor)}</div>
              <div style="font-family:Arial,sans-serif;font-size:10px;line-height:1.35;text-transform:uppercase;letter-spacing:.8px;color:#333;margin-bottom:9px;">${escapeHtml(item.tagline)}</div>
              <div style="font-family:Arial,sans-serif;font-size:10px;line-height:1.6;color:#111;">
                ${smallLinkHtml("Instagram", instagramLink)}${instagramLink ? " &nbsp; " : ""}${smallLinkHtml("Map", mapLink)}
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

function buildEventHtml(guest, pass, event) {
  const eventMapLink = trackedUrl({
    guest,
    pass,
    type: "event",
    contentId: event.id,
    action: "directions_click",
    redirectUrl: event.directionsUrl,
  });

  return `
    <tr>
      <td style="padding:13px 0;border-top:1px solid #111;">
        <div style="font-family:Arial,sans-serif;font-size:8px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:${ACCENT};margin-bottom:4px;">${escapeHtml(event.date)}</div>
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.1;font-weight:700;color:#111;">${escapeHtml(event.title)}</div>
        <div style="font-family:Arial,sans-serif;font-size:10px;line-height:1.45;color:#333;margin-top:5px;">${escapeHtml(event.venue)} &middot; ${escapeHtml(event.time)}</div>
        <div style="font-family:Arial,sans-serif;font-size:10px;line-height:1.6;color:#111;margin-top:7px;">
          ${smallLinkHtml("Instagram", event.instagramUrl)} &nbsp; ${smallLinkHtml("Map", eventMapLink)}
        </div>
      </td>
    </tr>
  `;
}

function buildArticleHtml(guest, pass, article) {
  return `
    <tr>
      <td style="padding:11px 0;border-top:1px solid #111;">
        <div style="font-family:Arial,sans-serif;font-size:8px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:${ACCENT};margin-bottom:5px;">${escapeHtml(article.label)}</div>
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:1.12;font-weight:700;color:#111;">${articleLinkHtml(guest, pass, article)}</div>
      </td>
    </tr>
  `;
}

function buildEssentialHtml(guest, pass, item) {
  const mapLink = trackedUrl({
    guest,
    pass,
    type: "venue",
    contentId: slugify(item.name),
    action: "directions_click",
    redirectUrl: item.googleUrl,
  });

  return `
    <tr>
      <td style="padding:10px 0;border-top:1px solid #cfc8bd;">
        <div style="font-family:Arial,sans-serif;font-size:8px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:${ACCENT};margin-bottom:4px;">${escapeHtml(item.type)}</div>
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.15;font-weight:700;color:#111;">${escapeHtml(item.name)}</div>
        <div style="font-family:Arial,sans-serif;font-size:10px;margin-top:6px;">${smallLinkHtml("Map", mapLink)}</div>
      </td>
    </tr>
  `;
}

function buildContentItems() {
  return [
    ...NEWSLETTER_DATA.map((item) => ({
      type: "venue",
      id: slugify(item.vendor),
    })),
    ...FEATURED_ARTICLES.map((article) => ({
      type: "article",
      id: article.id,
    })),
    ...WELCOME_EVENTS.map((event) => ({ type: "event", id: event.id })),
    ...NEWSLETTER_ESSENTIALS_NEARBY_HELP.map((item) => ({
      type: "venue",
      id: slugify(item.name),
    })),
  ];
}

export function generateGuestWelcomeEmail({ guest, pass } = {}) {
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
  const newsletterLink = trackedUrl({
    guest,
    pass,
    type: "article",
    contentId: "newsletter-data",
    action: "newsletter_click",
    redirectUrl: "/newsletter-data",
  });
  const eventsLink = trackedUrl({
    guest,
    pass,
    type: "event",
    contentId: "events",
    action: "events_click",
    redirectUrl:
      "/events?utm_source=welcome_email&utm_medium=email&utm_campaign=newsletter_data&utm_content=view_full_events",
  });
  const guestName = guest?.fullName?.split(" ")?.[0] || "there";
  const subject = "Welcome to Ahangama";
  const contentItems = buildContentItems();
  const quoteImageUrl = absoluteUrl(QUOTE_IMAGE_PATH);
  const html = `
    <div style="margin:0;padding:0;background:#fbfaf6;color:#111;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fbfaf6;margin:0;padding:0;">
        <tr>
          <td align="center" style="padding:0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#fbfaf6;border-left:1px solid #111;border-right:1px solid #111;">
              <tr>
                <td style="padding:22px 20px 24px;background:#fbfaf6;border-bottom:2px solid #111;color:#111;">
                  <div style="font-family:Arial,sans-serif;font-size:9px;line-height:1.2;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${ACCENT};margin:0 0 10px;">Lighthouse Guest Pass</div>
                  <div style="font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.12;font-weight:700;color:#111;margin:0 0 13px;">
                    Hi ${escapeHtml(guestName)}, your complimentary guest pass for your Lighthouse stay is ready.
                  </div>
                  <div style="font-family:Arial,sans-serif;font-size:12px;line-height:1.5;color:#333;margin:0 0 14px;">
                    Use it as your first Ahangama starting point: unlock the pass, then open the map before you head out.
                  </div>
                  <div style="font-family:Arial,sans-serif;font-size:11px;line-height:1.4;font-weight:700;">
                    <a href="${escapeHtml(passLink)}" style="display:inline-block;margin:0 8px 8px 0;padding:10px 13px;background:#111;color:#fff;text-decoration:none;border:1px solid #111;">View My Pass</a>
                    <a href="${escapeHtml(mapLink)}" style="display:inline-block;margin:0 0 8px 0;padding:10px 13px;background:#fbfaf6;color:#111;text-decoration:none;border:1px solid #111;">See the Ahangama Map</a>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding:18px 20px 20px;border-bottom:1px solid #111;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="width:88px;vertical-align:middle;padding-right:14px;">
                        <img src="${escapeHtml(quoteImageUrl)}" width="88" alt="Ahangama character" style="display:block;width:88px;height:auto;border:0;" />
                      </td>
                      <td style="vertical-align:middle;font-family:Georgia,'Times New Roman',serif;font-size:21px;line-height:1.28;font-weight:700;font-style:italic;color:#111;">
                        Physically I'm here. Mentally I'm in a pool in Ahangama ordering my third arrack cocktail.
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 20px;border-bottom:2px solid #111;">
                  <div style="font-family:Arial,sans-serif;font-size:12px;line-height:1.55;font-weight:700;color:#111;">
                    <span style="color:${ACCENT};">THE LIST:</span> ${NEWSLETTER_DATA.length} vendor recommendations<br />
                    <span style="color:${ACCENT};">FEATURED ARTICLES:</span> ${FEATURED_ARTICLES.length} featured articles<br />
                    <span style="color:${ACCENT};">EVENTS:</span> ${WELCOME_EVENTS.length} events
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding:18px 20px 8px;">
                  <div style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;font-weight:700;color:${ACCENT};margin-bottom:6px;">What&rsquo;s On</div>
                  <div style="font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1;font-weight:700;color:#111;">This Week</div>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">${WELCOME_EVENTS.slice(0, 3)
                    .map((event) => buildEventHtml(guest, pass, event))
                    .join("")}</table>
                  <div style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;margin-top:12px;">${smallLinkHtml("View Full Events", eventsLink)}</div>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 20px 0;">
                  <div style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;font-weight:700;color:${ACCENT};margin-bottom:6px;">Local Picks</div>
                  <div style="font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1;font-weight:700;color:#111;">The List</div>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">${NEWSLETTER_DATA.map((item, index) =>
                    buildVendorHtml(guest, pass, item, index),
                  ).join("")}</table>
                </td>
              </tr>
              <tr>
                <td style="padding:20px 20px 0;">
                  <div style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;font-weight:700;color:${ACCENT};margin-bottom:6px;">Worth Reading</div>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${FEATURED_ARTICLES.map((article) =>
                    buildArticleHtml(guest, pass, article),
                  ).join("")}</table>
                </td>
              </tr>
              <tr>
                <td style="padding:20px 20px 26px;">
                  <div style="background:#f7f3ea;border-top:2px solid #111;border-bottom:2px solid #111;padding:14px 0 4px;">
                    <div style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;font-weight:700;color:${ACCENT};margin:0 0 6px;">Essentials</div>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${NEWSLETTER_ESSENTIALS_NEARBY_HELP.map((item) =>
                      buildEssentialHtml(guest, pass, item),
                    ).join("")}</table>
                  </div>
                  <div style="font-family:Arial,sans-serif;font-size:11px;line-height:1.5;color:#333;margin-top:18px;">${smallLinkHtml("Open the online dispatch", newsletterLink)}</div>
                  <div style="font-family:Arial,sans-serif;font-size:10px;color:#777;margin-top:22px;">Ahangama Pass</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
  const text = [
    `Hi ${guestName}, your complimentary guest pass for your Lighthouse stay is ready.`,
    `View My Pass: ${passLink}`,
    `See the Ahangama map: ${mapLink}`,
    "",
    "The Ahangama Minute",
    "",
    "Physically I'm here. Mentally I'm in a pool in Ahangama ordering my third arrack cocktail.",
    "",
    `THE LIST: ${NEWSLETTER_DATA.length} vendor recommendations`,
    `FEATURED ARTICLES: ${FEATURED_ARTICLES.length} featured articles`,
    `EVENTS: ${WELCOME_EVENTS.length} events`,
    "",
    "WHAT'S ON",
    ...WELCOME_EVENTS.slice(0, 3).map(
      (event) => `${event.date}: ${event.title} at ${event.venue} - ${event.time}`,
    ),
    "",
    "THE LIST",
    ...NEWSLETTER_DATA.map(
      (item, index) =>
        `${String(index + 1).padStart(2, "0")}. ${item.vendor} (${item.category}) - ${item.tagline}`,
    ),
    "",
    "WORTH READING",
    ...FEATURED_ARTICLES.map((article) => article.title),
    "",
    "ESSENTIALS",
    ...NEWSLETTER_ESSENTIALS_NEARBY_HELP.map(
      (item) => `${item.name} - ${item.type}`,
    ),
    "",
    `See the Ahangama map: ${mapLink}`,
    `Open the online dispatch: ${newsletterLink}`,
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
