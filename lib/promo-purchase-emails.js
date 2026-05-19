import process from "node:process";
import sgMail from "@sendgrid/mail";

const FROM_EMAIL = "hello@ahangama.com";
const TEAM_EMAIL = "team@ahangama.com";
const DEFAULT_VENUE_NOTIFICATION_EMAIL = "hello@viji.com";

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

function purchaseSummaryHtml(purchase, includeCustomer = false) {
  const rows = [
    ["Product", purchase.productName],
    [
      "Description",
      purchase.productDescription || "Ahangama Pass promo bundle",
    ],
    ["Promo Code", purchase.promoCode || "None"],
    ["Venue", purchase.venueSlug || "Unknown"],
    ["List Price", formatCurrency(purchase.listPriceUsd, purchase.currency)],
    ["Discount", formatCurrency(purchase.discountUsd, purchase.currency)],
    ["Paid", formatCurrency(purchase.chargedPriceUsd, purchase.currency)],
    ["Valid From", formatDate(purchase.startDate)],
    ["Valid Until", formatDate(purchase.expiryDate)],
    ["Pass URL", purchase.passUrl],
  ];

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
              <td style="padding: 10px 12px; border: 1px solid #e5e7eb;">${escapeHtml(value)}</td>
            </tr>
          `,
        )
        .join("")}
    </table>
  `;
}

export async function sendPromoCustomerEmail(purchase) {
  ensureSendgrid();

  const html = baseEmailShell(
    "Your Ahangama Pass is ready",
    `
      <p>Hi ${escapeHtml(purchase.customerName || "there")},</p>
      <p>Your purchase is confirmed. Your digital pass is ready now.</p>
      <p><a href="${escapeHtml(purchase.passUrl)}" style="display: inline-block; padding: 12px 18px; background: #111827; color: #ffffff; text-decoration: none; border-radius: 8px;">View your digital pass</a></p>
      ${purchaseSummaryHtml(purchase, false)}
      <p>Please keep this link handy when you redeem your offer.</p>
    `,
  );

  await sgMail.send({
    to: purchase.customerEmail,
    from: FROM_EMAIL,
    subject: `${purchase.productName || "Ahangama Pass"} confirmation`,
    html,
  });
}

export async function sendPromoRedemptionVenueEmail(
  purchase,
  redemption,
  promotion,
) {
  ensureSendgrid();

  const venueName =
    redemption?.venueName || purchase.venueSlug || "Partner venue";
  const recipient =
    String(promotion?.venueEmail || "").trim() ||
    DEFAULT_VENUE_NOTIFICATION_EMAIL;
  const html = baseEmailShell(
    `${escapeHtml(venueName)} promo redeemed`,
    `
      <p>A customer has redeemed your Ahangama promo.</p>
      ${purchaseSummaryHtml(purchase, true)}
      <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
        <tr>
          <td style="padding: 10px 12px; border: 1px solid #e5e7eb; width: 160px; font-weight: 700; background: #f9fafb; vertical-align: top;">Pass ID</td>
          <td style="padding: 10px 12px; border: 1px solid #e5e7eb;">${escapeHtml(purchase.passId || purchase.qrCode || "Unknown")}</td>
        </tr>
        <tr>
          <td style="padding: 10px 12px; border: 1px solid #e5e7eb; width: 160px; font-weight: 700; background: #f9fafb; vertical-align: top;">Venue</td>
          <td style="padding: 10px 12px; border: 1px solid #e5e7eb;">${escapeHtml(venueName)}</td>
        </tr>
        <tr>
          <td style="padding: 10px 12px; border: 1px solid #e5e7eb; width: 160px; font-weight: 700; background: #f9fafb; vertical-align: top;">Redeemed At</td>
          <td style="padding: 10px 12px; border: 1px solid #e5e7eb;">${escapeHtml(formatDateTime(redemption?.redeemedAt))}</td>
        </tr>
        <tr>
          <td style="padding: 10px 12px; border: 1px solid #e5e7eb; width: 160px; font-weight: 700; background: #f9fafb; vertical-align: top;">Redemption Type</td>
          <td style="padding: 10px 12px; border: 1px solid #e5e7eb;">${escapeHtml(redemption?.redemptionType || "Not provided")}</td>
        </tr>
        <tr>
          <td style="padding: 10px 12px; border: 1px solid #e5e7eb; width: 160px; font-weight: 700; background: #f9fafb; vertical-align: top;">Offer Used</td>
          <td style="padding: 10px 12px; border: 1px solid #e5e7eb;">${escapeHtml(redemption?.offerUsed || "Not provided")}</td>
        </tr>
      </table>
      <p>This email is for confirmation that the redemption button was used successfully.</p>
    `,
  );

  await sgMail.send({
    to: recipient,
    from: FROM_EMAIL,
    subject: `${venueName} promo redemption notification`,
    html,
  });
}

export async function sendPromoTeamEmail(purchase, venue) {
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
      ${purchaseSummaryHtml(purchase, true)}
      <p><strong>Venue Name:</strong> ${escapeHtml(venueName)}</p>
      <p><strong>CTA Location:</strong> ${escapeHtml(purchase.ctaLocation || "Unknown")}</p>
      <p><strong>UTM:</strong><br>${utmSummary || "None"}</p>
      <p><strong>Stripe Session:</strong> ${escapeHtml(purchase.stripeSessionId)}</p>
    `,
  );

  await sgMail.send({
    to: TEAM_EMAIL,
    from: FROM_EMAIL,
    subject: `Promo purchase: ${venueName} · ${purchase.customerEmail}`,
    html,
  });
}
