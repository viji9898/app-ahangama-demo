import process from "node:process";
import sgMail from "@sendgrid/mail";
import { buildTrackedEmailLink } from "./email-link-tracking.js";
import { getPrPromotion } from "../src/data/prPromotions.js";

const FROM_EMAIL = "hello@ahangama.com";
const TEAM_EMAIL = "team@ahangama.com";
const DEFAULT_VENUE_NOTIFICATION_EMAIL = "hello@viji.com";
const AHANGAMA_VENUES_MAP_URL = "https://maps.app.goo.gl/qSEZgM2SQyZcE2rNA";
const CUSTOMER_SUPPORT_URL =
  "https://wa.me/94777422274?text=Hi%20Ahangama%20Pass%2C%20Customer%20Care%21";

function ensureSendgrid() {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error("SENDGRID_API_KEY is required for promo emails");
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

function formatCurrency(amount, currency = "USD") {
  const numericAmount = Number(amount || 0);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(numericAmount);
}

function formatDate(value) {
  const date = new Date(value || "");

  if (Number.isNaN(date.getTime())) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatDateTime(value) {
  const date = new Date(value || "");

  if (Number.isNaN(date.getTime())) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function baseEmailShell(title, content) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #1f2937; line-height: 1.6;">
      <h1 style="margin-bottom: 24px; font-size: 28px;">${title}</h1>
      ${content}
      <p style="margin-top: 32px; color: #6b7280; font-size: 12px;">Ahangama Pass</p>
    </div>
  `;
}

function looksLikeUrl(value) {
  return /^https?:\/\//i.test(String(value || "").trim());
}

function buildTrackedPromoEmailLink(purchase, { url, campaign, cta, content }) {
  return buildTrackedEmailLink({
    url,
    guestId: purchase?.guestId || purchase?.customerId,
    emailId: purchase?.emailId,
    campaign,
    venueSlug: purchase?.venueSlug,
    cta,
    content,
  });
}

function renderReceiptValue(label, value, trackingContext = {}) {
  if (!value) {
    return "Not set";
  }

  if (!looksLikeUrl(value)) {
    return escapeHtml(value);
  }

  const linkLabel = label === "Stripe Receipt" ? "View receipt" : "Open link";
  const href = trackingContext.campaign
    ? buildTrackedPromoEmailLink(trackingContext.purchase, {
        url: value,
        campaign: trackingContext.campaign,
        cta: label === "Stripe Receipt" ? "view_stripe_receipt" : "open_link",
        content: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      })
    : value;

  return `<a href="${escapeHtml(href)}" style="color: #0f766e; font-weight: 600; text-decoration: underline;">${linkLabel}</a>`;
}

function formatVenueName(venueSlug) {
  return String(venueSlug || "")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildIncludedItemsHtml(purchase) {
  const promotion = getPrPromotion(purchase.venueSlug);
  const receiptItems = promotion?.receipt?.items || [];
  const nonPassItems = receiptItems.filter((item) => item.icon !== "pass");
  const venueName = formatVenueName(purchase.venueSlug) || "your venue";
  const itemEntries = [];

  if (nonPassItems.length >= 2) {
    itemEntries.push(
      `${nonPassItems
        .slice(0, 2)
        .map((item) => item.label)
        .join(" + ")} at ${venueName}`,
    );
  } else {
    itemEntries.push(
      ...nonPassItems.map((item) =>
        item.quantity > 1 ? `${item.quantity} x ${item.label}` : item.label,
      ),
    );
  }

  const postcardItem = nonPassItems.find((item) =>
    /postcard/i.test(item.label),
  );
  if (postcardItem && !itemEntries.some((item) => /postcard/i.test(item))) {
    itemEntries.push(
      postcardItem.quantity > 1
        ? `Complimentary ${postcardItem.label.toLowerCase()}`
        : `Complimentary ${postcardItem.label.toLowerCase()}`,
    );
  }

  itemEntries.push("Access to Ahangama Pass perks across partner venues");

  return `
    <ul style="margin: 12px 0 20px; padding-left: 20px;">
      ${itemEntries
        .filter(Boolean)
        .map((item) => `<li style="margin: 0 0 8px;">${escapeHtml(item)}</li>`)
        .join("")}
    </ul>
  `;
}

function purchaseSummaryHtml(
  purchase,
  includeCustomer = false,
  trackingContext = {},
) {
  const rows = [
    ["Product", purchase.productName],
    [
      "Description",
      purchase.productDescription || "Ahangama Pass promo bundle",
    ],
    ["Venue", purchase.venueSlug || "Unknown"],
    ["List Price", formatCurrency(purchase.listPriceUsd, purchase.currency)],
    ["Discount", formatCurrency(purchase.discountUsd, purchase.currency)],
    ["Paid", formatCurrency(purchase.chargedPriceUsd, purchase.currency)],
    ["Valid From", formatDate(purchase.startDate)],
    ["Valid Until", formatDate(purchase.expiryDate)],
  ];

  if (purchase.stripeReceiptUrl) {
    rows.push(["Stripe Receipt", purchase.stripeReceiptUrl]);
  }

  if (includeCustomer) {
    rows.unshift(
      ["Customer", purchase.customerName || "Guest"],
      ["Email", purchase.customerEmail],
      ["Phone", purchase.customerPhone || "Not provided"],
    );
  }

  return `
    <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
      ${rows
        .map(
          ([label, value]) => `
            <tr>
              <td style="padding: 10px 12px; border: 1px solid #e5e7eb; width: 160px; font-weight: 700; background: #f9fafb; vertical-align: top;">${escapeHtml(label)}</td>
              <td style="padding: 10px 12px; border: 1px solid #e5e7eb;">${renderReceiptValue(label, value, { ...trackingContext, purchase })}</td>
            </tr>
          `,
        )
        .join("")}
    </table>
  `;
}

export async function sendPromoCustomerEmail(purchase, options = {}) {
  ensureSendgrid();

  const venueName =
    formatVenueName(purchase.venueSlug) || "your selected venue";
  const includedItemsHtml = buildIncludedItemsHtml(purchase);
  const campaign = "promo_customer";
  const trackedPasskitUrl = purchase.passkitUrl
    ? buildTrackedPromoEmailLink(purchase, {
        url: purchase.passkitUrl,
        campaign,
        cta: "add_pass_to_wallet",
        content: "passkit-wallet",
      })
    : "";
  const trackedPassUrl = buildTrackedPromoEmailLink(purchase, {
    url: purchase.passUrl,
    campaign,
    cta: "view_digital_pass",
    content: "digital-pass",
  });
  const trackedVenuesMapUrl = buildTrackedPromoEmailLink(purchase, {
    url: AHANGAMA_VENUES_MAP_URL,
    campaign,
    cta: "explore_venues_map",
    content: "venues-map",
  });
  const trackedCustomerSupportUrl = buildTrackedPromoEmailLink(purchase, {
    url: CUSTOMER_SUPPORT_URL,
    campaign,
    cta: "customer_support_whatsapp",
    content: "customer-support",
  });
  const walletButtonHtml = purchase.passkitUrl
    ? `
        <p style="margin: 0 0 12px;">
          <a href="${escapeHtml(trackedPasskitUrl)}" style="display: inline-block; padding: 12px 18px; background: #0f766e; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700;">Add Pass to Digital Wallet</a>
        </p>
      `
    : "";
  const passButtonHtml = `
      <p style="margin: 0;">
        <a href="${escapeHtml(trackedPassUrl)}" style="display: inline-block; padding: 12px 18px; background: #ffffff; color: #111827; text-decoration: none; border-radius: 8px; font-weight: 700; border: 1px solid #d1d5db;">View Your Digital Pass</a>
      </p>
    `;

  const html = baseEmailShell(
    "Your Ahangama Pass is ready",
    `
      <p>Hi ${escapeHtml(purchase.customerName || "there")},</p>
      <p>Your Ahangama Pass has been activated successfully.</p>
      ${walletButtonHtml}
      ${passButtonHtml}
      <p>You can now redeem your ${escapeHtml(venueName)} promotion by showing the pass to the staff and start using perks across Ahangama.</p>
      <p style="margin-bottom: 8px;"><strong>Included with your pass today:</strong></p>
      ${includedItemsHtml}
      <p>
        <a href="${escapeHtml(trackedVenuesMapUrl)}" style="color: #0f766e; font-weight: 600; text-decoration: underline;">Explore Ahangama Pass venues on Google Maps</a>
      </p>
      <p>Have a great holiday.</p>
      <p>Ahangama Team &#10084;&#65039;</p>
      <p style="margin: 28px 0 8px;"><strong>Purchase receipt</strong></p>
      ${purchaseSummaryHtml(purchase, false, { campaign })}
      <p style="margin-top: 24px;">
        <a href="${escapeHtml(trackedCustomerSupportUrl)}" style="display: inline-block; padding: 12px 18px; background: #0f766e; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700;">Customer Support on WhatsApp</a>
      </p>
    `,
  );

  await sgMail.send({
    to: options.recipientOverride || purchase.customerEmail,
    from: FROM_EMAIL,
    subject: `${purchase.productName || "Ahangama Pass"} confirmation`,
    html,
  });
}

export async function sendPromoRedemptionVenueEmail(
  purchase,
  redemption,
  promotion,
  options = {},
) {
  ensureSendgrid();

  const venueName =
    redemption?.venueName || purchase.venueSlug || "Partner venue";
  const redemptionId = redemption?.redemptionNumber
    ? String(redemption.redemptionNumber).toUpperCase()
    : "Not assigned";
  const recipient =
    String(options.recipientOverride || "").trim() ||
    String(promotion?.venueEmail || "").trim() ||
    DEFAULT_VENUE_NOTIFICATION_EMAIL;
  const html = baseEmailShell(
    "Redemption Details",
    `
      <p>Hi ${escapeHtml(venueName)} Team,</p>
      <p>An Ahangama Pass promotion has been redeemed successfully at your venue.</p>
      <p style="margin: 28px 0 8px;"><strong>Redemption Details</strong></p>
      <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
        <tr>
          <td style="padding: 10px 12px; border: 1px solid #e5e7eb; width: 160px; font-weight: 700; background: #f9fafb; vertical-align: top;">Redemption ID</td>
          <td style="padding: 10px 12px; border: 1px solid #e5e7eb;">${escapeHtml(redemptionId)}</td>
        </tr>
        <tr>
          <td style="padding: 10px 12px; border: 1px solid #e5e7eb; width: 160px; font-weight: 700; background: #f9fafb; vertical-align: top;">Customer</td>
          <td style="padding: 10px 12px; border: 1px solid #e5e7eb;">${escapeHtml(purchase.customerName || "Guest")}</td>
        </tr>
        <tr>
          <td style="padding: 10px 12px; border: 1px solid #e5e7eb; width: 160px; font-weight: 700; background: #f9fafb; vertical-align: top;">Product Description</td>
          <td style="padding: 10px 12px; border: 1px solid #e5e7eb;">${escapeHtml(purchase.productDescription || purchase.productName || "Promo offer")}</td>
        </tr>
        <tr>
          <td style="padding: 10px 12px; border: 1px solid #e5e7eb; width: 160px; font-weight: 700; background: #f9fafb; vertical-align: top;">Redeemed At</td>
          <td style="padding: 10px 12px; border: 1px solid #e5e7eb;">${escapeHtml(formatDateTime(redemption?.redeemedAt))}</td>
        </tr>
        <tr>
          <td style="padding: 10px 12px; border: 1px solid #e5e7eb; width: 160px; font-weight: 700; background: #f9fafb; vertical-align: top;">Pass ID</td>
          <td style="padding: 10px 12px; border: 1px solid #e5e7eb;">${escapeHtml(purchase.passId || purchase.qrCode || "Unknown")}</td>
        </tr>
      </table>
      <p>This email confirms that the redemption was processed successfully in the Ahangama Pass system.</p>
      <p>Thank you,<br>Ahangama Pass</p>
    `,
  );

  await sgMail.send({
    to: recipient,
    from: FROM_EMAIL,
    subject: `${venueName} promo redemption notification`,
    html,
  });
}

export async function sendPromoTeamEmail(purchase, venue, options = {}) {
  ensureSendgrid();

  const venueName = venue?.name || purchase.venueSlug || "Unknown venue";
  const utmSummary = [
    purchase.utmSource ? `utm_source=${purchase.utmSource}` : null,
    purchase.utmMedium ? `utm_medium=${purchase.utmMedium}` : null,
    purchase.utmCampaign ? `utm_campaign=${purchase.utmCampaign}` : null,
    purchase.utmContent ? `utm_content=${purchase.utmContent}` : null,
    purchase.utmTerm ? `utm_term=${purchase.utmTerm}` : null,
  ]
    .filter(Boolean)
    .join("<br>");

  const html = baseEmailShell(
    "New promo purchase",
    `
      <p>A promo purchase was completed successfully.</p>
      ${purchaseSummaryHtml(purchase, true, { campaign: "promo_team" })}
      <p><strong>Venue Name:</strong> ${escapeHtml(venueName)}</p>
      <p><strong>CTA Location:</strong> ${escapeHtml(purchase.ctaLocation || "Unknown")}</p>
      <p><strong>UTM:</strong><br>${utmSummary || "None"}</p>
      <p><strong>Stripe Session:</strong> ${escapeHtml(purchase.stripeSessionId)}</p>
    `,
  );

  await sgMail.send({
    to: options.recipientOverride || TEAM_EMAIL,
    from: FROM_EMAIL,
    subject: `Promo purchase: ${venueName} · ${purchase.customerEmail}`,
    html,
  });
}
