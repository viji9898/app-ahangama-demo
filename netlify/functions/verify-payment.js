import Stripe from "stripe";
import { CARD_PRODUCTS } from "../../src/data/cardConfig.js";
import { sendPromoNotifications } from "../../lib/promo-purchase-fulfillment.js";
import { syncPromoPurchaseFromSession } from "../../lib/promo-purchase-sync.js";
import { getStripeKey } from "../../lib/stripe-config.js";

const stripe = new Stripe(getStripeKey());

async function resolveStripeReceiptUrl(session) {
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id || null;

  const latestChargeReceiptUrl =
    session.payment_intent?.latest_charge?.receipt_url || null;

  if (latestChargeReceiptUrl) {
    return latestChargeReceiptUrl;
  }

  if (!paymentIntentId) {
    return null;
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId,
      {
        expand: ["latest_charge"],
      },
    );

    return paymentIntent.latest_charge?.receipt_url || null;
  } catch (error) {
    console.error("Failed to resolve Stripe receipt URL:", error);
    return null;
  }
}

function isInvalidSessionId(sessionId) {
  const normalized = String(sessionId || "").trim();

  return (
    !normalized ||
    normalized.includes("CHECKOUT_SESSION_ID") ||
    normalized.startsWith("{") ||
    normalized.startsWith("%7B")
  );
}

function getResolvedValidityDays(session) {
  return session.metadata.flowType === "promo"
    ? 30
    : parseInt(session.metadata.validityDays);
}

export const handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { sessionId } = event.queryStringParameters || {};

    if (!sessionId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Session ID required" }),
      };
    }

    if (isInvalidSessionId(sessionId)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Invalid session ID",
          details:
            "Received Stripe placeholder instead of a real checkout session id. Start a fresh checkout.",
        }),
      };
    }

    // Environment validation
    try {
      getStripeKey();
    } catch (error) {
      console.error("Stripe configuration error:", error.message);
      const testStartDate = new Date();
      const testExpiryDate = new Date(
        testStartDate.getTime() + 15 * 24 * 60 * 60 * 1000,
      );

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          productId: CARD_PRODUCTS.standard.id,
          productName: "Test Ahangama Pass",
          customerName: "Test Customer",
          customerEmail: "test@example.com",
          customerPhone: "+1234567890",
          qrCode: `AHG-${CARD_PRODUCTS.standard.qrId}-${sessionId
            .substring(0, 8)
            .toUpperCase()}`,
          priceUsd: CARD_PRODUCTS.standard.priceUsd,
          listPriceUsd: CARD_PRODUCTS.standard.priceUsd,
          chargedPriceUsd: CARD_PRODUCTS.standard.priceUsd,
          flowType: "standard",
          ctaLocation: "",
          venueSlug: "",
          promoCode: "",
          utmSource: "",
          utmMedium: "",
          utmCampaign: "",
          utmContent: "",
          utmTerm: "",
          maxPeople: CARD_PRODUCTS.standard.maxPeople,
          validityDays: 15,
          purchaseDate: new Date().toISOString(),
          startDate: testStartDate.toISOString(),
          expiryDate: testExpiryDate.toISOString(),
        }),
      };
    }

    // Try to retrieve Stripe session
    console.log("Attempting to retrieve Stripe session:", sessionId);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Payment not completed" }),
      };
    }

    const product = CARD_PRODUCTS[session.metadata.productId];
    const isPromoFlow = session.metadata.flowType === "promo";
    let promoPurchase = isPromoFlow
      ? await syncPromoPurchaseFromSession(session, {
          headers: event.headers || {},
          resolveStripeReceiptUrl,
        })
      : null;

    if (promoPurchase?.fulfillmentStatus === "payment_confirmed") {
      promoPurchase = await sendPromoNotifications(promoPurchase);
    }

    const qrCodeId = promoPurchase?.passId
      ? promoPurchase.passId
      : `AHG-${product.qrId}-${sessionId.substring(0, 8).toUpperCase()}`;

    // Calculate dates based on start date from metadata
    const startDate = session.metadata.startDate
      ? new Date(session.metadata.startDate)
      : new Date();

    const validityDays = getResolvedValidityDays(session);
    const expiryDate = new Date(
      startDate.getTime() + validityDays * 24 * 60 * 60 * 1000,
    );

    const responseData = {
      productId: session.metadata.productId,
      productName: session.metadata.productName,
      customerName: session.metadata.customerName || "Guest",
      customerEmail: session.customer_details.email,
      customerPhone: session.metadata.customerPhone,
      qrCode: qrCodeId,
      priceUsd: (session.amount_total / 100).toString(),
      listPriceUsd: session.metadata.listPriceUsd || "",
      chargedPriceUsd:
        session.metadata.chargedPriceUsd ||
        (session.amount_total / 100).toString(),
      flowType: session.metadata.flowType || "standard",
      ctaLocation: session.metadata.ctaLocation || "",
      venueSlug: session.metadata.venueSlug || "",
      promoCode: session.metadata.promoCode || "",
      utmSource: session.metadata.utmSource || "",
      utmMedium: session.metadata.utmMedium || "",
      utmCampaign: session.metadata.utmCampaign || "",
      utmContent: session.metadata.utmContent || "",
      utmTerm: session.metadata.utmTerm || "",
      maxPeople: parseInt(session.metadata.maxPeople || "1"),
      validityDays,
      purchaseDate: new Date().toISOString(),
      startDate: startDate.toISOString(),
      expiryDate: expiryDate.toISOString(),
      passId: promoPurchase?.passId || "",
      passUrl: promoPurchase?.passUrl || "",
      passkitUrl: promoPurchase?.passkitUrl || "",
      customerEmailStatus: promoPurchase?.customerEmailStatus || "",
      venueEmailStatus: promoPurchase?.venueEmailStatus || "",
      teamEmailStatus: promoPurchase?.teamEmailStatus || "",
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(responseData),
    };
  } catch (error) {
    console.error("Error in verify-payment:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Payment verification failed",
        details: error.message,
      }),
    };
  }
};
