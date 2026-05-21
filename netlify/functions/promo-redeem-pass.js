import {
  createPromoRedemption,
  getPromoPurchaseByPassId,
  getPromoRedemptionByPassAndVenue,
} from "../../lib/promo-purchases-db.js";
import { sendPromoRedemptionVenueEmail } from "../../lib/promo-purchase-emails.js";
import { PLACES } from "../../src/data/places.js";
import { getPrPromotion } from "../../src/data/prPromotions.js";

const DEMO_VENDOR_PIN = "1234";

function resolveVenueName(venueSlug, fallbackName) {
  const place = PLACES.find((entry) => entry.slug === venueSlug);
  return fallbackName || place?.name || venueSlug || "Venue";
}

export const handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const {
      passId,
      venueSlug,
      venueName,
      redemptionType,
      offerUsed,
      vendorPin,
    } = JSON.parse(event.body || "{}");

    if (!passId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "passId is required" }),
      };
    }

    if (vendorPin !== DEMO_VENDOR_PIN) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Invalid venue PIN." }),
      };
    }

    const purchase = await getPromoPurchaseByPassId(passId);

    if (!purchase) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: "Promo pass not found" }),
      };
    }

    if (!purchase.venueSlug) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Promo pass is missing a venue slug" }),
      };
    }

    if (venueSlug && venueSlug !== purchase.venueSlug) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: `This promo can only be redeemed at ${purchase.venueSlug}.`,
        }),
      };
    }

    const now = Date.now();
    const startTime = Date.parse(purchase.startDate || 0);
    const expiryTime = Date.parse(purchase.expiryDate || 0);

    if (Number.isFinite(startTime) && now < startTime) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Pass not active yet." }),
      };
    }

    if (Number.isFinite(expiryTime) && now > expiryTime) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Pass expired." }),
      };
    }

    const existingRedemption = await getPromoRedemptionByPassAndVenue(
      purchase.passId,
      purchase.venueSlug,
    );

    if (existingRedemption) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: false,
          alreadyRedeemed: true,
          error: "Pass already redeemed at this venue.",
          redemption: existingRedemption,
        }),
      };
    }

    const redemption = await createPromoRedemption({
      passId: purchase.passId,
      venueSlug: purchase.venueSlug,
      venueName: resolveVenueName(purchase.venueSlug, venueName),
      redemptionType,
      offerUsed,
      redeemedBy: "promo-verify",
    });

    try {
      const promotion = getPrPromotion(purchase.venueSlug);
      await sendPromoRedemptionVenueEmail(purchase, redemption, promotion);
    } catch (emailError) {
      console.error("promo-redeem-pass venue email error:", {
        passId: purchase.passId,
        venueSlug: purchase.venueSlug,
        message: emailError?.message || "Unknown error",
      });
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `${purchase.productName} redeemed at ${redemption.venueName || redemption.venueSlug}!`,
        redemption,
      }),
    };
  } catch (error) {
    console.error("promo-redeem-pass error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || "Unknown error" }),
    };
  }
};
