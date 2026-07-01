import process from "node:process";
import sgMail from "@sendgrid/mail";
import { buildTrackedEmailLink } from "./email-link-tracking.js";

const FROM_EMAIL = "hello@ahangama.com";
const DEFAULT_NOTIFICATION_EMAIL = "hello@viji.com";
const DEFAULT_SITE_URL = "https://ahangama.com";
const ACCENT = "#ff6f61";

const VENUE_CONFIGS = {
  "lighthouse-hotel": {
    name: "Lighthouse Hotel",
    pagePath: "/lighthouse",
    envKey: "GUEST_PASS_VENUE_EMAIL_LIGHTHOUSE_HOTEL",
  },
  kaffi: {
    name: "Kaffi",
    pagePath: "/kaffi",
    envKey: "GUEST_PASS_VENUE_EMAIL_KAFFI",
  },
  gusta: {
    name: "Gusta",
    pagePath: "/gusta",
    envKey: "GUEST_PASS_VENUE_EMAIL_GUSTA",
  },
  tahini: {
    name: "Tahini & Friends",
    pagePath: "/tahini",
    envKey: "GUEST_PASS_VENUE_EMAIL_TAHINI",
  },
  "living-room": {
    name: "Living Room",
    pagePath: "/living-Room",
    envKey: "GUEST_PASS_VENUE_EMAIL_LIVING_ROOM",
  },
};

function ensureSendgrid() {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error(
      "SENDGRID_API_KEY is required for venue notification emails",
    );
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
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

function formatVenueName(sourceHotelSlug) {
  const config = VENUE_CONFIGS[sourceHotelSlug];

  if (config?.name) {
    return config.name;
  }

  return String(sourceHotelSlug || "Partner venue")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate(value) {
  const date = new Date(value || "");

  if (Number.isNaN(date.getTime())) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDateTime(value) {
  const date = new Date(value || "");

  if (Number.isNaN(date.getTime())) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatList(items) {
  return Array.isArray(items) && items.length ? items.join(", ") : "Not set";
}

function getRecipientFromJsonMap(sourceHotelSlug) {
  const raw = String(process.env.GUEST_PASS_VENUE_EMAILS || "").trim();

  if (!raw) {
    return null;
  }

  try {
    const map = JSON.parse(raw);
    return String(map?.[sourceHotelSlug] || "").trim() || null;
  } catch {
    return null;
  }
}

export function getGuestPassVenueRecipient(sourceHotelSlug) {
  const config = VENUE_CONFIGS[sourceHotelSlug];

  return (
    String(config?.envKey ? process.env[config.envKey] || "" : "").trim() ||
    getRecipientFromJsonMap(sourceHotelSlug) ||
    String(process.env.GUEST_PASS_VENUE_NOTIFICATION_EMAIL || "").trim() ||
    DEFAULT_NOTIFICATION_EMAIL
  );
}

function summaryRow(label, value) {
  return `
    <tr>
      <td style="padding:10px 12px;border:1px solid #e5e7eb;width:160px;font-weight:700;background:#f9fafb;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:10px 12px;border:1px solid #e5e7eb;">${escapeHtml(value || "Not set")}</td>
    </tr>
  `;
}

function normalizeList(items) {
  return Array.isArray(items)
    ? items.map((item) => String(item || "").trim()).filter(Boolean)
    : [];
}

function recommendationItem(label, detail) {
  return `
    <li style="margin:0 0 10px;">
      <strong>${escapeHtml(label)}:</strong> ${escapeHtml(detail)}
    </li>
  `;
}

function buildActionableRecommendations(preferences = {}) {
  const interests = normalizeList(preferences.interests);
  const services = normalizeList(preferences.servicesInterested);
  const combined = [...interests, ...services].join(" ").toLowerCase();
  const recommendations = [];

  if (/surf/.test(combined)) {
    recommendations.push([
      "Surf",
      "Share the closest beginner-friendly break, board rental contact, or best tide window when the guest arrives.",
    ]);
  }

  if (/food|restaurant|dinner|lunch|breakfast|cafe|booking/.test(combined)) {
    recommendations.push([
      "Food and bookings",
      "Offer one easy dinner suggestion and ask whether they want help reserving a table for their first night.",
    ]);
  }

  if (/event|music|night|party/.test(combined)) {
    recommendations.push([
      "Events",
      "Point them to this week's live music, market, or sunset plan so they have something simple to say yes to.",
    ]);
  }

  if (/wellness|yoga|pilates|spa|massage|ice|breath/.test(combined)) {
    recommendations.push([
      "Wellness",
      "Suggest a nearby yoga, pilates, spa, or recovery option and mention if advance booking is recommended.",
    ]);
  }

  if (/experience|tour|trip|activity|tuk|transfer/.test(combined)) {
    recommendations.push([
      "Experiences",
      "Recommend one low-effort local experience and confirm whether they need transport arranged.",
    ]);
  }

  if (!recommendations.length) {
    recommendations.push([
      "First touch",
      "Welcome them by name, confirm they received the pass, and offer one simple local recommendation based on their arrival time.",
    ]);
  }

  recommendations.push([
    "Follow-up",
    "If the guest has not installed the pass yet, remind them to open the wallet link before heading out.",
  ]);

  return recommendations;
}

function buildInterestServiceSection(preferences = {}) {
  const interests = normalizeList(preferences.interests);
  const services = normalizeList(preferences.servicesInterested);
  const recommendations = buildActionableRecommendations(preferences);

  return `
    <div style="margin-top:22px;padding:16px 0 4px;border-top:2px solid #111;border-bottom:2px solid #111;">
      <div style="font-family:Arial,sans-serif;font-size:9px;line-height:1.2;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${ACCENT};margin:0 0 10px;">Guest interests & service requests</div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 16px;">
        ${summaryRow("Interests", formatList(interests))}
        ${summaryRow("Services", formatList(services))}
      </table>
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.05;font-weight:700;color:#242424;margin:0 0 10px;">Recommended next actions</div>
      <ul style="font-family:Arial,sans-serif;font-size:12px;line-height:1.55;color:#333;margin:0 0 10px;padding-left:20px;">
        ${recommendations
          .map(([label, detail]) => recommendationItem(label, detail))
          .join("")}
      </ul>
    </div>
  `;
}

export function generateGuestPassVenueNotificationEmail({
  guest,
  pass,
  preferences,
  sourceHotelSlug,
} = {}) {
  const resolvedSourceHotelSlug =
    sourceHotelSlug || pass?.sourceHotelSlug || guest?.sourceHotelSlug;
  const shouldShowInterestServiceSection =
    resolvedSourceHotelSlug === "lighthouse-hotel";
  const venueName = formatVenueName(resolvedSourceHotelSlug);
  const config = VENUE_CONFIGS[resolvedSourceHotelSlug] || {};
  const passUrl = pass?.passkitInstallUrl || pass?.passkitPassUrl || "";
  const venuePageUrl = absoluteUrl(config.pagePath || "/");
  const trackedPassUrl = passUrl
    ? buildTrackedEmailLink({
        url: absoluteUrl(passUrl),
        guestId: guest?.id,
        emailId: guest?.emailId || pass?.emailId,
        campaign: "venue_notification",
        venueSlug: resolvedSourceHotelSlug,
        cta: "open_guest_pass",
        content: "guest-pass",
      })
    : "";
  const trackedVenuePageUrl = buildTrackedEmailLink({
    url: venuePageUrl,
    guestId: guest?.id,
    emailId: guest?.emailId || pass?.emailId,
    campaign: "venue_notification",
    venueSlug: resolvedSourceHotelSlug,
    cta: "open_venue_pass_page",
    content: "venue-pass-page",
  });
  const subject = `New complimentary pass signup - ${venueName}`;

  const html = `
    <div style="margin:0;padding:0;background:#f4f0e8;color:#111;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f0e8;margin:0;padding:24px 12px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-top:2px solid #111;border-bottom:2px solid #111;">
              <tr>
                <td style="padding:24px 22px 20px;color:#111;">
                  <div style="font-family:Arial,sans-serif;font-size:9px;line-height:1.2;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${ACCENT};margin:0 0 10px;">Venue Notification</div>
                  <div style="font-family:Georgia,'Times New Roman',serif;font-size:31px;line-height:.98;font-weight:700;color:#242424;margin:0 0 13px;">
                    A new ${escapeHtml(venueName)} guest signed up for a complimentary Ahangama Pass.
                  </div>
                  <div style="font-family:Arial,sans-serif;font-size:12px;line-height:1.55;color:#333;margin:0;">
                    This is an automatic notification from the ${escapeHtml(venueName)} pass page.
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding:0 22px 22px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0;">
                    ${summaryRow("Guest", guest?.fullName || "Guest")}
                    ${summaryRow("Email", guest?.email)}
                    ${summaryRow("Phone", guest?.phone)}
                    ${summaryRow("Venue", venueName)}
                    ${summaryRow("Destination", guest?.destination || "ahangama")}
                    ${summaryRow("Pass Status", pass?.status || "active")}
                    ${summaryRow("Valid From", formatDate(pass?.validFrom))}
                    ${summaryRow("Valid Until", formatDate(pass?.validUntil))}
                    ${summaryRow("Submitted", formatDateTime(pass?.createdAt || new Date().toISOString()))}
                    ${summaryRow("Stay Length", preferences?.stayLength ? `${preferences.stayLength} days` : "Not set")}
                    ${summaryRow("Travel Group", preferences?.travelGroup || "Not set")}
                  </table>
                  ${shouldShowInterestServiceSection ? buildInterestServiceSection(preferences) : ""}
                  <div style="font-family:Arial,sans-serif;font-size:11px;line-height:1.6;color:#333;margin-top:18px;">
                    ${trackedPassUrl ? `<a href="${escapeHtml(trackedPassUrl)}" style="color:#111;text-decoration:underline;font-weight:700;">Open guest pass</a> &nbsp;` : ""}
                    <a href="${escapeHtml(trackedVenuePageUrl)}" style="color:#111;text-decoration:underline;font-weight:700;">Open venue pass page</a>
                  </div>
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
    `New complimentary pass signup - ${venueName}`,
    "",
    `Guest: ${guest?.fullName || "Guest"}`,
    `Email: ${guest?.email || "Not set"}`,
    `Phone: ${guest?.phone || "Not set"}`,
    `Venue: ${venueName}`,
    `Destination: ${guest?.destination || "ahangama"}`,
    `Pass Status: ${pass?.status || "active"}`,
    `Valid From: ${formatDate(pass?.validFrom)}`,
    `Valid Until: ${formatDate(pass?.validUntil)}`,
    `Submitted: ${formatDateTime(pass?.createdAt || new Date().toISOString())}`,
    `Stay Length: ${preferences?.stayLength ? `${preferences.stayLength} days` : "Not set"}`,
    `Travel Group: ${preferences?.travelGroup || "Not set"}`,
    ...(shouldShowInterestServiceSection
      ? [
          "",
          "GUEST INTERESTS & SERVICE REQUESTS",
          `Interests: ${formatList(normalizeList(preferences?.interests))}`,
          `Services: ${formatList(normalizeList(preferences?.servicesInterested))}`,
          "",
          "RECOMMENDED NEXT ACTIONS",
          ...buildActionableRecommendations(preferences).map(
            ([label, detail]) => `${label}: ${detail}`,
          ),
        ]
      : []),
    trackedPassUrl ? `Guest Pass: ${trackedPassUrl}` : "Guest Pass: Pending",
    `Venue Pass Page: ${trackedVenuePageUrl}`,
  ].join("\n");

  return {
    subject,
    html,
    text,
    recipient: getGuestPassVenueRecipient(resolvedSourceHotelSlug),
  };
}

export async function sendGuestPassVenueNotificationEmail({
  guest,
  pass,
  preferences,
  sourceHotelSlug,
  recipientOverride,
} = {}) {
  const email = generateGuestPassVenueNotificationEmail({
    guest,
    pass,
    preferences,
    sourceHotelSlug,
  });
  const recipient = String(recipientOverride || email.recipient || "").trim();

  ensureSendgrid();

  await sgMail.send({
    to: recipient,
    from: FROM_EMAIL,
    subject: email.subject,
    html: email.html,
    text: email.text,
  });

  console.log("guest pass venue notification sent", {
    guestId: guest?.id,
    passId: pass?.id,
    sourceHotelSlug: sourceHotelSlug || pass?.sourceHotelSlug,
    recipient,
  });

  return { ...email, recipient };
}
