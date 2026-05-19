import { getPromoPurchaseBySessionId } from "../../lib/promo-purchases-db.js";

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

  const { session_id: sessionId, sessionId: legacySessionId } =
    event.queryStringParameters || {};
  const resolvedSessionId = sessionId || legacySessionId || "";

  if (!resolvedSessionId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "session_id is required" }),
    };
  }

  try {
    const purchase = await getPromoPurchaseBySessionId(resolvedSessionId);

    if (!purchase) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: "Promo purchase not found" }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: purchase.fulfillmentStatus,
        stripeSessionId: purchase.stripeSessionId,
        productName: purchase.productName,
        productDescription: purchase.productDescription,
        customerName: purchase.customerName,
        promoCode: purchase.promoCode,
        venueSlug: purchase.venueSlug,
        listPriceUsd: purchase.listPriceUsd,
        discountUsd: purchase.discountUsd,
        chargedPriceUsd: purchase.chargedPriceUsd,
        customerEmail: purchase.customerEmail,
        customerPhone: purchase.customerPhone,
        purchaseDate: purchase.createdAt,
        startDate: purchase.startDate,
        expiryDate: purchase.expiryDate,
        validityDays: purchase.validityDays,
        passId: purchase.passId,
        passUrl: purchase.passUrl,
        passkitUrl: purchase.passkitUrl,
        stripeReceiptUrl: purchase.stripeReceiptUrl,
        customerEmailStatus: purchase.customerEmailStatus,
        venueEmailStatus: purchase.venueEmailStatus,
        teamEmailStatus: purchase.teamEmailStatus,
        createdAt: purchase.createdAt,
        updatedAt: purchase.updatedAt,
      }),
    };
  } catch (error) {
    console.error("promo-purchase-by-session error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || "Unknown error" }),
    };
  }
};