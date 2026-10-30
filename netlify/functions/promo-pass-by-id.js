import {
  getPromoPurchaseByPassId,
  getPromoRedemptionByPassAndVenue,
  listPromoRedemptionsForPass,
} from "../../lib/promo-purchases-db.js";
import { maskDisplayName } from "../../lib/public-pass-data.js";

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

  const { pass_id: passId, passId: legacyPassId } =
    event.queryStringParameters || {};
  const resolvedPassId = passId || legacyPassId || "";

  if (!resolvedPassId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "pass_id is required" }),
    };
  }

  try {
    const purchase = await getPromoPurchaseByPassId(resolvedPassId);

    if (!purchase) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: "Promo pass not found" }),
      };
    }

    const venueRedemption = purchase.venueSlug
      ? await getPromoRedemptionByPassAndVenue(
          purchase.passId,
          purchase.venueSlug,
        )
      : null;
    const redemptions = await listPromoRedemptionsForPass(purchase.passId);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        passId: purchase.passId,
        productName: purchase.productName,
        customerName: maskDisplayName(purchase.customerName),
        purchaseDate: purchase.createdAt,
        startDate: purchase.startDate,
        expiryDate: purchase.expiryDate,
        status: purchase.fulfillmentStatus,
        maxPeople: purchase.maxPeople,
        venueSlug: purchase.venueSlug,
        venueName: purchase.venueSlug,
        redemptionCount: redemptions.length,
        isRedeemedAtVenue: Boolean(venueRedemption),
        redeemedAt: venueRedemption?.redeemedAt || null,
        redemptionNumber: venueRedemption?.redemptionNumber || null,
        redemptionVenueSlug: venueRedemption?.venueSlug || purchase.venueSlug,
      }),
    };
  } catch (error) {
    console.error("promo-pass-by-id error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || "Unknown error" }),
    };
  }
};
