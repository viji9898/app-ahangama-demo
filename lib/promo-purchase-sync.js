import crypto from "crypto";
import process from "node:process";
import { createPromoPasskitLink } from "./promo-passkit.js";
import { upsertPromoPurchase } from "./promo-purchases-db.js";

function getFallbackBaseUrl() {
  return (process.env.VITE_SITE_URL || "https://pass.ahangama.com").replace(
    /\/$/,
    "",
  );
}

export function resolveBaseUrl(headers = {}) {
  const host = headers.host || headers.Host || "";
  const forwardedProto =
    headers["x-forwarded-proto"] || headers["X-Forwarded-Proto"] || "";

  if (host) {
    const protocol = forwardedProto || (host.startsWith("localhost") ? "http" : "https");
    return `${protocol}://${host}`;
  }

  return getFallbackBaseUrl();
}

export function buildPromoPassId(stripeSessionId) {
  const digest = crypto
    .createHash("sha256")
    .update(String(stripeSessionId || ""))
    .digest("hex")
    .slice(0, 12)
    .toUpperCase();

  return `AHG-${digest}`;
}

function buildPasskitPassId(passId) {
  return `${passId}-APPLE`;
}

function toIsoDate(dateString) {
  if (!dateString) {
    return null;
  }

  const iso = new Date(dateString);
  return Number.isNaN(iso.getTime()) ? null : iso.toISOString();
}

function addDays(dateString, days) {
  const startDate = new Date(dateString);

  if (Number.isNaN(startDate.getTime())) {
    return null;
  }

  startDate.setUTCDate(startDate.getUTCDate() + Number(days || 0));
  return startDate.toISOString();
}

function getPromoValidityDays(metadata = {}) {
  return metadata.flowType === "promo"
    ? 30
    : Number(metadata.validityDays || 0);
}

export async function syncPromoPurchaseFromSession(session, options = {}) {
  const metadata = session.metadata || {};
  const paymentIntent =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id || null;
  const passId = buildPromoPassId(session.id);
  const passUrl = `${resolveBaseUrl(options.headers)}/card/pass/${encodeURIComponent(passId)}`;
  const passkitPassId = buildPasskitPassId(passId);
  const startDate = toIsoDate(metadata.startDate);
  const validityDays = getPromoValidityDays(metadata);
  const expiryDate = startDate ? addDays(startDate, validityDays) : null;
  const customerEmail =
    session.customer_details?.email || session.customer_email || "";

  if (!customerEmail) {
    throw new Error(
      `checkout.session.completed missing customer email for ${session.id}`,
    );
  }

  let passkitUrl = null;
  const stripeReceiptUrl = options.resolveStripeReceiptUrl
    ? await options.resolveStripeReceiptUrl(session)
    : null;

  if (expiryDate) {
    try {
      passkitUrl = await createPromoPasskitLink({
        passkitPassId,
        passHolderName:
          metadata.customerName || session.customer_details?.name || null,
        customerEmail,
        customerPhone:
          metadata.customerPhone || session.customer_details?.phone || null,
        expiryDate,
      });
    } catch (error) {
      console.error("PassKit smart link generation failed:", error);
    }
  }

  return upsertPromoPurchase({
    stripeSessionId: session.id,
    stripePaymentIntentId: paymentIntent,
    stripeCustomerId:
      typeof session.customer === "string" ? session.customer : null,
    customerEmail,
    customerName:
      metadata.customerName || session.customer_details?.name || null,
    customerPhone:
      metadata.customerPhone || session.customer_details?.phone || null,
    productId: metadata.productId,
    productName: metadata.productName,
    productDescription: metadata.productDescription,
    flowType: metadata.flowType || "promo",
    promoCode: metadata.promoCode,
    venueSlug: metadata.venueSlug,
    ctaLocation: metadata.ctaLocation,
    utmSource: metadata.utmSource,
    utmMedium: metadata.utmMedium,
    utmCampaign: metadata.utmCampaign,
    utmContent: metadata.utmContent,
    utmTerm: metadata.utmTerm,
    listPriceUsd: metadata.listPriceUsd,
    discountUsd: metadata.discountUsd,
    chargedPriceUsd:
      metadata.chargedPriceUsd || Number(session.amount_total || 0) / 100,
    currency: (session.currency || "usd").toUpperCase(),
    startDate,
    expiryDate,
    validityDays,
    maxPeople: metadata.maxPeople,
    passId,
    passUrl,
    passkitPassId,
    passkitUrl,
    stripeReceiptUrl,
    fulfillmentStatus:
      session.payment_status === "paid" ? "payment_confirmed" : "manual_review",
    customerEmailStatus: "pending",
    venueEmailStatus: "pending",
    teamEmailStatus: "pending",
  });
}