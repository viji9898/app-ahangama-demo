// Dedicated redemption logging function with enhanced data capture
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export const handler = async (event, context) => {
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
      qrCode,
      venueId,
      venueName,
      venueCategory,
      redemptionType,
      customOffer,
      offerUsed,
      vendorPin,
    } = JSON.parse(event.body);

    // Validate required fields
    if (!qrCode || !venueId || !venueName || !venueCategory) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error:
            "Missing required fields: qrCode, venueId, venueName, venueCategory",
        }),
      };
    }

    // Helper function to extract QR code from URL or direct code
    const extractQrCode = (input) => {
      if (!input) return null;

      if (input.includes("/card/verify?qr=")) {
        try {
          const urlParams = new URLSearchParams(input.split("?")[1]);
          return decodeURIComponent(urlParams.get("qr") || "");
        } catch (e) {
          return input;
        }
      }
      return input;
    };

    const actualQrCode = extractQrCode(qrCode);

    if (!actualQrCode || !actualQrCode.startsWith("AHANGAMA-")) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Invalid QR code format" }),
      };
    }

    // Find the purchase record
    const purchase = await sql`
      SELECT * FROM purchases 
      WHERE qr_code = ${actualQrCode}
      LIMIT 1
    `;

    if (purchase.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: "Pass not found or invalid" }),
      };
    }

    const purchaseRecord = purchase[0];
    const expiryDate = new Date(purchaseRecord.expiry_date);

    // Check if pass has expired
    if (new Date() > expiryDate) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Pass has expired" }),
      };
    }

    // Check if already redeemed today at this venue (optional business rule)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const existingRedemption = await sql`
      SELECT * FROM redemptions
      WHERE purchase_id = ${purchaseRecord.id}
      AND venue_id = ${venueId}
      AND redeemed_at BETWEEN ${todayStart.toISOString()} AND ${todayEnd.toISOString()}
    `;

    if (existingRedemption.length > 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Pass already redeemed at this venue today",
          redemption: existingRedemption[0],
        }),
      };
    }

    // Determine the final offer used
    let finalOfferUsed = offerUsed;
    if (redemptionType === "custom" && customOffer) {
      finalOfferUsed = customOffer;
    }

    // Record redemption with all details
    const redemption = await sql`
      INSERT INTO redemptions (
        purchase_id, 
        venue_id, 
        venue_name, 
        venue_category,
        redeemed_at,
        offer_used,
        verified_by_staff,
        staff_notes
      )
      VALUES (
        ${purchaseRecord.id}, 
        ${venueId}, 
        ${venueName}, 
        ${venueCategory},
        NOW(),
        ${finalOfferUsed || "Standard offer"},
        ${vendorPin || "Not provided"},
        ${
          redemptionType === "custom"
            ? `Custom redemption: ${customOffer}`
            : `Type: ${redemptionType}`
        }
      )
      RETURNING *
    `;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `Pass successfully redeemed at ${venueName}!`,
        redemption: {
          id: redemption[0].id,
          venueId: redemption[0].venue_id,
          venueName: redemption[0].venue_name,
          venueCategory: redemption[0].venue_category,
          redeemedAt: redemption[0].redeemed_at,
          offerUsed: redemption[0].offer_used,
          redemptionType: redemptionType,
        },
        purchase: {
          productName: purchaseRecord.product_name,
          customerName: purchaseRecord.customer_name,
          customerEmail: purchaseRecord.customer_email,
          customerPhone: purchaseRecord.customer_phone,
          expiryDate: expiryDate.toISOString(),
        },
      }),
    };
  } catch (error) {
    console.error("Redemption logging error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to log redemption",
        details: error.message,
      }),
    };
  }
};
