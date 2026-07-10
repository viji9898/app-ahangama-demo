import process from "node:process";
import sgMail from "@sendgrid/mail";
import {
  NEWSLETTER_COMP_PASS_SIGNUP_VENUES,
  NEWSLETTER_DATA,
  NEWSLETTER_ESSENTIALS_NEARBY_HELP,
} from "../src/data/newsletterData.js";
import { SHARED_UPCOMING_EVENT_DAYS } from "../src/data/upcomingEventsShared.js";
import {
  buildTrackedEmailLink,
  recordPreparedGuestEmail,
} from "./guest-email-intelligence.js";

const FROM_EMAIL = "hello@ahangama.com";
const WELCOME_EMAIL_TYPE = "welcome";
const WELCOME_EMAIL_SOURCE = "welcome-email";
const DEFAULT_SITE_URL = "https://ahangama.com";
const AHANGAMA_GOOGLE_MAP_URL = "https://maps.app.goo.gl/yziABRfTyJhHCwNG7";
const ACCENT = "#ff6f61";
const QUOTE_IMAGE_PATH = "/newsletter-character-quote.png";

const SOURCE_VENUE_NAMES = {
  "lighthouse-hotel": "Lighthouse",
  kaffi: "Kaffi",
  gusta: "Gusta",
  tahini: "Tahini & Friends",
  "living-room": "Living Room",
};

const FEATURED_ARTICLES = [
  {
    id: "sunset-article",
    label: "Sunset",
    title: "Where Ahangama Gathers for Sunset",
    path: "/where-ahangama-gathers-for-sunset-stairway-rooftop-bar-at-lighthouse-hotel/?utm_source=welcome_email&utm_medium=email&utm_campaign=newsletter_data&utm_content=sunset_article",
    image:
      "https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-edits/where-ahangama-gathers-for-sunset+/hero-view-from-the-bar.jpg",
  },
  {
    id: "twelve-things-article",
    label: "Guide",
    title: "12 Things to Do in Ahangama",
    path: "/12-things/?utm_source=welcome_email&utm_medium=email&utm_campaign=newsletter_data&utm_content=12_things_article",
    image:
      "https://hips.hearstapps.com/hmg-prod/images/exploring-ahangama-the-surfing-sweet-spot-on-sri-lanka-s-southern-coast-66475f779dc88.jpg?crop=0.6672958942897593xw:1xh;center,top&resize=640:*",
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

const LOCAL_PICKS_ARTICLE_INSERTS = [
  { afterIndex: 4, articleId: "sunset-article" },
  { afterIndex: 11, articleId: "twelve-things-article" },
];

const WELCOME_ONGOING_EVENT_SOURCE = [
  {
    dateKey: "ongoing",
    date: "Ongoing",
    title: "Daily Happy Hour",
    venue: "Samba",
    time: "5:00 PM - 7:00 PM",
    image: "https://ahangama.com/assets/Samba%20Haappy%20Hour%20-Bji6FvzF.png",
    instagramUrl:
      "https://www.instagram.com/samba_ahangama?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Samba%20Ahangama",
  },
];

function formatSharedEventDate(day) {
  if (String(day?.key || "").startsWith("ongoing")) {
    return "Ongoing";
  }

  return `${day.weekday.slice(0, 3)} ${day.dayNumber} ${day.month.slice(0, 3)} 2026`;
}

function buildEventDirectionsUrl(venue) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${venue} Ahangama`,
  )}`;
}

function getWelcomeEventSource() {
  const sharedEvents = SHARED_UPCOMING_EVENT_DAYS.flatMap((day) =>
    day.events.map((event) => ({
      ...event,
      dateKey: day.key,
      date: formatSharedEventDate(day),
      directionsUrl:
        event.directionsUrl || buildEventDirectionsUrl(event.venue),
    })),
  );

  return [...sharedEvents, ...WELCOME_ONGOING_EVENT_SOURCE];
}

function getTodayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getWelcomeEvents(date = new Date()) {
  const todayKey = getTodayKey(date);
  const eventSource = getWelcomeEventSource();
  const datedEvents = eventSource
    .filter((event) => event.dateKey !== "ongoing" && event.dateKey >= todayKey)
    .sort((firstEvent, secondEvent) =>
      firstEvent.dateKey.localeCompare(secondEvent.dateKey),
    );
  const ongoingEvents = eventSource.filter(
    (event) => event.dateKey === "ongoing",
  );

  return [...datedEvents, ...ongoingEvents].slice(0, 3).map((event) => ({
    ...event,
    id: slugify(`${event.dateKey}-${event.title}-${event.venue}`),
  }));
}

function formatSourceVenueName(sourceHotelSlug) {
  const normalizedSlug = String(sourceHotelSlug || "").trim();
  const configuredName = SOURCE_VENUE_NAMES[normalizedSlug];

  if (configuredName) {
    return configuredName;
  }

  return (
    normalizedSlug
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ") || "Lighthouse"
  );
}

function normalizeSourceVenueSlug(sourceHotelSlug) {
  const normalizedSlug = String(sourceHotelSlug || "").trim();

  if (normalizedSlug === "lighthouse-hotel") {
    return "lighthouse";
  }

  return normalizedSlug;
}

function getGuestSourceVenue({ guest, pass } = {}) {
  const sourceVenueSlug = normalizeSourceVenueSlug(
    pass?.sourceHotelSlug || guest?.sourceHotelSlug || "lighthouse-hotel",
  );
  const configuredVenue = NEWSLETTER_COMP_PASS_SIGNUP_VENUES.find(
    (venue) => venue.slug === sourceVenueSlug,
  );

  if (configuredVenue) {
    return configuredVenue;
  }

  return {
    name: formatSourceVenueName(sourceVenueSlug),
    latitude: null,
    longitude: null,
  };
}

function getWelcomeIntro({ guestName, pass } = {}) {
  if (pass?.sourceHotelSlug === "ahangama-hospo") {
    return `Hi ${guestName}, your Complimentary Ahangama Pass is ready.`;
  }

  return `Hi ${guestName}, your complimentary guest pass for your Lighthouse stay is ready.`;
}

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
  return buildTrackedEmailLink({
    url: absoluteUrl(redirectUrl),
    guestId: guest?.id,
    emailId: guest?.emailId || pass?.emailId,
    campaign: WELCOME_EMAIL_TYPE,
    venueSlug: pass?.sourceHotelSlug || guest?.sourceHotelSlug,
    cta: action || type,
    content: contentId,
  });
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

function hasCoordinates(item) {
  return (
    typeof item?.latitude === "number" && typeof item?.longitude === "number"
  );
}

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function calculateDistanceKm(origin, destination) {
  if (!hasCoordinates(origin) || !hasCoordinates(destination)) {
    return null;
  }

  const earthRadiusKm = 6371;
  const latitudeDelta = toRadians(destination.latitude - origin.latitude);
  const longitudeDelta = toRadians(destination.longitude - origin.longitude);
  const originLatitude = toRadians(origin.latitude);
  const destinationLatitude = toRadians(destination.latitude);
  const haversineValue =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(originLatitude) *
      Math.cos(destinationLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;

  return (
    earthRadiusKm *
    2 *
    Math.atan2(Math.sqrt(haversineValue), Math.sqrt(1 - haversineValue))
  );
}

function formatDistanceLabel(distanceKm, sourceVenueName) {
  if (typeof distanceKm !== "number" || !Number.isFinite(distanceKm)) {
    return null;
  }

  const distanceLabel =
    distanceKm < 0.1
      ? "under 100 m"
      : distanceKm < 1
        ? `${Math.round(distanceKm * 1000)} m`
        : `${distanceKm.toFixed(1)} km`;

  return `${distanceLabel} from ${sourceVenueName}`;
}

function getDistanceFromSourceVenue(item, sourceVenue) {
  const distanceKm = calculateDistanceKm(sourceVenue, item);

  return formatDistanceLabel(distanceKm, sourceVenue?.name);
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

function localPicksArticleCardHtml(guest, pass, article) {
  const href = trackedUrl({
    guest,
    pass,
    type: "article",
    contentId: article.id,
    action: "article_click",
    redirectUrl: article.path,
  });

  return `
    <tr>
      <td style="padding:22px 0;border-bottom:1px solid #242424;">
        <a href="${escapeHtml(href)}" style="display:block;color:#fff;text-decoration:none;">
          <img src="${escapeHtml(article.image)}" width="600" alt="${escapeHtml(article.title)}" style="display:block;width:100%;max-width:600px;height:auto;border:0;" />
          <div style="background:#111;padding:13px 14px 16px;font-family:Georgia,'Times New Roman',serif;font-size:29px;line-height:.95;font-weight:700;color:#fff;">
            ${escapeHtml(article.title)}
          </div>
        </a>
      </td>
    </tr>
  `;
}

function buildVendorHtml(guest, pass, item, index, sourceVenue) {
  const instagramLink = buildInstagramUrl(item.instagram);
  const instagramTrackedLink = instagramLink
    ? trackedUrl({
        guest,
        pass,
        type: "venue",
        contentId: `${slugify(item.vendor)}-instagram`,
        action: "instagram_click",
        redirectUrl: instagramLink,
      })
    : "";
  const distanceLabel = getDistanceFromSourceVenue(item, sourceVenue);
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
      <td style="padding:0;border-top:1px solid #242424;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:9px 8px 8px;border-bottom:1px solid #777;background:#f3f3f3;color:#242424;font-family:Georgia,'Times New Roman',serif;font-size:20px;line-height:1;font-weight:700;text-transform:uppercase;">
              ${String(index + 1).padStart(2, "0")} / <span style="color:${ACCENT};">${escapeHtml(item.category)}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 0 18px;border-bottom:1px solid #242424;vertical-align:top;">
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:.98;font-weight:700;color:#242424;margin:0;">${escapeHtml(item.tagline)}</div>
              <div style="font-family:Arial,sans-serif;font-size:11px;line-height:1.45;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#555;margin:9px 0 0;">${escapeHtml(item.vendor)}</div>
              ${distanceLabel ? `<div style="font-family:Arial,sans-serif;font-size:10px;line-height:1.45;font-weight:700;color:#777;margin:5px 0 0;">${escapeHtml(distanceLabel)}</div>` : ""}
              <div style="font-family:Arial,sans-serif;font-size:11px;line-height:1.6;color:#555;margin-top:12px;">
                ${smallLinkHtml("Instagram", instagramTrackedLink)}${instagramTrackedLink ? " &nbsp; " : ""}${smallLinkHtml("Map", mapLink)}
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

function buildLocalPicksHtml(guest, pass, sourceVenue) {
  return NEWSLETTER_DATA.map((item, index) => {
    const vendorHtml = buildVendorHtml(guest, pass, item, index, sourceVenue);
    const insert = LOCAL_PICKS_ARTICLE_INSERTS.find(
      (articleInsert) => articleInsert.afterIndex === index,
    );
    const inlineArticle = FEATURED_ARTICLES.find(
      (article) => article.id === insert?.articleId,
    );

    if (!inlineArticle) {
      return vendorHtml;
    }

    return `${vendorHtml}${localPicksArticleCardHtml(guest, pass, inlineArticle)}`;
  }).join("");
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
  const eventInstagramLink = event.instagramUrl
    ? trackedUrl({
        guest,
        pass,
        type: "event",
        contentId: `${event.id}-instagram`,
        action: "instagram_click",
        redirectUrl: event.instagramUrl,
      })
    : "";
  const eventImageUrl = event.image ? absoluteUrl(event.image) : null;
  const eventDetailsHtml = `
    <div style="font-family:Arial,sans-serif;font-size:8px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:${ACCENT};margin-bottom:4px;">${escapeHtml(event.date)}</div>
    <div style="font-family:Georgia,'Times New Roman',serif;font-size:19px;line-height:1.05;font-weight:700;color:#242424;">${escapeHtml(event.title)}</div>
    <div style="font-family:Arial,sans-serif;font-size:10px;line-height:1.45;color:#333;margin-top:5px;">${escapeHtml(event.venue)} &middot; ${escapeHtml(event.time)}</div>
    <div style="font-family:Arial,sans-serif;font-size:10px;line-height:1.6;color:#111;margin-top:7px;">
      ${smallLinkHtml("Instagram", eventInstagramLink)}${eventInstagramLink ? " &nbsp; " : ""}${smallLinkHtml("Map", eventMapLink)}
    </div>
  `;

  return `
    <tr>
      <td style="padding:13px 0;border-top:1px solid #242424;">
        ${
          eventImageUrl
            ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="78" style="width:78px;padding:0 12px 0 0;vertical-align:top;">
                    <img src="${escapeHtml(eventImageUrl)}" width="66" height="66" alt="${escapeHtml(event.title)}" style="display:block;width:66px;height:66px;object-fit:cover;border:1px solid #242424;" />
                  </td>
                  <td style="padding:0;vertical-align:top;">
                    ${eventDetailsHtml}
                  </td>
                </tr>
              </table>`
            : eventDetailsHtml
        }
      </td>
    </tr>
  `;
}

function buildArticleHtml(guest, pass, article) {
  return `
    <tr>
      <td style="padding:13px 0;border-top:1px solid #242424;">
        <div style="font-family:Arial,sans-serif;font-size:8px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:${ACCENT};margin-bottom:5px;">${escapeHtml(article.label)}</div>
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:20px;line-height:1.08;font-weight:700;color:#242424;">${articleLinkHtml(guest, pass, article)}</div>
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

function buildContentItems(welcomeEvents) {
  return [
    ...NEWSLETTER_DATA.map((item) => ({
      type: "venue",
      id: slugify(item.vendor),
    })),
    ...FEATURED_ARTICLES.map((article) => ({
      type: "article",
      id: article.id,
    })),
    ...welcomeEvents.map((event) => ({ type: "event", id: event.id })),
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
    redirectUrl: AHANGAMA_GOOGLE_MAP_URL,
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
  const welcomeEvents = getWelcomeEvents();
  const sourceVenue = getGuestSourceVenue({ guest, pass });
  const sourceVenueName = sourceVenue.name;
  const welcomeIntro = getWelcomeIntro({ guestName, pass });
  const contentItems = buildContentItems(welcomeEvents);
  const quoteImageUrl = absoluteUrl(QUOTE_IMAGE_PATH);
  const html = `
    <div style="margin:0;padding:0;background:#fff;color:#111;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fff;margin:0;padding:0;">
        <tr>
          <td align="center" style="padding:0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#fff;">
              <tr>
                <td style="padding:24px 20px 24px;background:#fff;border-top:2px solid #111;border-bottom:2px solid #111;color:#111;">
                  <div style="font-family:Arial,sans-serif;font-size:9px;line-height:1.2;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${ACCENT};margin:0 0 10px;">Lighthouse Guest Pass</div>
                  <div style="font-family:Georgia,'Times New Roman',serif;font-size:31px;line-height:.98;font-weight:700;color:#242424;margin:0 0 13px;">
                    ${escapeHtml(welcomeIntro)}
                  </div>
                  <div style="font-family:Arial,sans-serif;font-size:12px;line-height:1.5;color:#333;margin:0 0 14px;">
                    Use it as your first Ahangama starting point: unlock the pass, then open the map before you head out.
                  </div>
                  <div style="font-family:Arial,sans-serif;font-size:11px;line-height:1.4;font-weight:700;">
                    <a href="${escapeHtml(passLink)}" style="display:inline-block;margin:0 8px 8px 0;padding:10px 13px;background:#111;color:#fff;text-decoration:none;border:1px solid #111;">View My Pass</a>
                    <a href="${escapeHtml(mapLink)}" style="display:inline-block;margin:0 0 8px 0;padding:10px 13px;background:#fff;color:#111;text-decoration:none;border:1px solid #111;">See the Ahangama Map</a>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding:18px 20px 20px;border-bottom:1px solid #242424;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="width:88px;vertical-align:middle;padding-right:14px;">
                        <img src="${escapeHtml(quoteImageUrl)}" width="88" alt="Ahangama character" style="display:block;width:88px;height:auto;border:0;" />
                      </td>
                      <td style="vertical-align:middle;font-family:Georgia,'Times New Roman',serif;font-size:21px;line-height:1.28;font-weight:700;font-style:italic;color:#242424;">
                        Physically I'm here. Mentally I'm in a pool in Ahangama ordering my third arrack cocktail.
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:9px 20px 10px;background:#f3f3f3;border-bottom:2px solid #111;">
                  <div style="font-family:Arial,sans-serif;font-size:12px;line-height:1.55;font-weight:700;color:#111;">
                    <span style="color:${ACCENT};">THE LIST:</span> ${NEWSLETTER_DATA.length} vendor recommendations<br />
                    <span style="color:${ACCENT};">FEATURED ARTICLES:</span> ${FEATURED_ARTICLES.length} featured articles<br />
                    <span style="color:${ACCENT};">EVENTS:</span> ${welcomeEvents.length} events
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding:18px 20px 8px;">
                  <div style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;font-weight:700;color:${ACCENT};margin-bottom:6px;">What&rsquo;s On</div>
                  <div style="font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:.98;font-weight:700;color:#242424;">This Week</div>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">${welcomeEvents
                    .map((event) => buildEventHtml(guest, pass, event))
                    .join("")}</table>
                  <div style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;margin-top:12px;">${smallLinkHtml("View Full Events", eventsLink)}</div>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 20px 0;">
                  <div style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;font-weight:700;color:${ACCENT};margin-bottom:6px;">Local Picks Near ${escapeHtml(sourceVenueName)}</div>
                  <div style="font-family:Georgia,'Times New Roman',serif;font-size:32px;line-height:.98;font-weight:700;color:#242424;">The List</div>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">${buildLocalPicksHtml(
                    guest,
                    pass,
                    sourceVenue,
                  )}</table>
                </td>
              </tr>
              <tr>
                <td style="padding:20px 20px 0;">
                  <div style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;font-weight:700;color:${ACCENT};margin-bottom:6px;">Worth Reading</div>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${FEATURED_ARTICLES.map(
                    (article) => buildArticleHtml(guest, pass, article),
                  ).join("")}</table>
                </td>
              </tr>
              <tr>
                <td style="padding:20px 20px 26px;">
                  <div style="background:#fff;border-top:2px solid #111;border-bottom:2px solid #111;padding:14px 0 4px;">
                    <div style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;font-weight:700;color:${ACCENT};margin:0 0 6px;">Essentials</div>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${NEWSLETTER_ESSENTIALS_NEARBY_HELP.map(
                      (item) => buildEssentialHtml(guest, pass, item),
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
    welcomeIntro,
    `View My Pass: ${passLink}`,
    `See the Ahangama map: ${mapLink}`,
    "",
    "The Ahangama Minute",
    "",
    "Physically I'm here. Mentally I'm in a pool in Ahangama ordering my third arrack cocktail.",
    "",
    `THE LIST: ${NEWSLETTER_DATA.length} vendor recommendations`,
    `FEATURED ARTICLES: ${FEATURED_ARTICLES.length} featured articles`,
    `EVENTS: ${welcomeEvents.length} events`,
    "",
    "WHAT'S ON",
    ...welcomeEvents.map(
      (event) =>
        `${event.date}: ${event.title} at ${event.venue} - ${event.time}`,
    ),
    "",
    "THE LIST",
    ...NEWSLETTER_DATA.flatMap((item, index) => {
      const distanceLabel = getDistanceFromSourceVenue(item, sourceVenue);
      const pickLine = `${String(index + 1).padStart(2, "0")}. ${item.vendor} (${item.category}) - ${item.tagline}${distanceLabel ? ` - ${distanceLabel}` : ""}`;
      const insert = LOCAL_PICKS_ARTICLE_INSERTS.find(
        (articleInsert) => articleInsert.afterIndex === index,
      );
      const inlineArticle = FEATURED_ARTICLES.find(
        (article) => article.id === insert?.articleId,
      );

      if (!inlineArticle) {
        return [pickLine];
      }

      return [pickLine, `Article: ${inlineArticle.title}`];
    }),
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

export async function sendGuestWelcomeEmail({
  guest,
  pass,
  preferences,
  recordHistory = true,
} = {}) {
  const email = generateGuestWelcomeEmail({ guest, pass, preferences });

  ensureSendgrid();

  await sgMail.send({
    to: guest?.email,
    from: FROM_EMAIL,
    subject: email.subject,
    html: email.html,
    text: email.text,
  });

  let history = { emailHistory: null, contentHistory: [] };

  if (!recordHistory) {
    console.log("guest welcome email sent", {
      guestId: guest?.id,
      passId: pass?.id,
      emailHistoryId: null,
      contentItems: 0,
    });

    return { ...email, history };
  }

  try {
    history = await recordPreparedGuestEmail({
      guestId: guest?.id,
      passId: pass?.id,
      emailType: WELCOME_EMAIL_TYPE,
      source: WELCOME_EMAIL_SOURCE,
      contents: email.contentItems,
    });
  } catch (error) {
    console.error("guest welcome email history error", {
      guestId: guest?.id,
      passId: pass?.id,
      message: error?.message || "Unable to record guest welcome email history",
    });
  }

  console.log("guest welcome email sent", {
    guestId: guest?.id,
    passId: pass?.id,
    emailHistoryId: history.emailHistory?.id,
    contentItems: history.contentHistory.length,
  });

  return { ...email, history };
}
