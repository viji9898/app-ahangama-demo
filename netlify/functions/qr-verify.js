// QR verification function with database integration for vendor verification
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export const handler = async (event, context) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  // Helper function to extract QR code from URL or direct code
  const extractQrCode = (input) => {
    if (!input) return null;

    // If it's a URL with qr parameter, extract it
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

  if (event.httpMethod === "POST") {
    // Handle redemption
    try {
      const { qrCode, venueId, venueName } = JSON.parse(event.body);

      if (!qrCode || !venueId || !venueName) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Missing required fields" }),
        };
      }

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
        AND status = 'completed'
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
      const expiryDate = new Date(purchaseRecord.created_at);
      expiryDate.setDate(expiryDate.getDate() + purchaseRecord.validity_days);

      // Check if pass has expired
      if (new Date() > expiryDate) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Pass has expired" }),
        };
      }

      // Record redemption
      await sql`
        INSERT INTO redemptions (purchase_id, venue_id, venue_name, redeemed_at)
        VALUES (${purchaseRecord.id}, ${venueId}, ${venueName}, NOW())
      `;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: `Pass redeemed at ${venueName}!`,
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
      console.error("Redemption error:", error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Failed to process redemption" }),
      };
    }
  }

  if (event.httpMethod === "GET") {
    // Handle verification for vendors
    try {
      const { qr: qrCode } = event.queryStringParameters || {};

      if (!qrCode) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "QR code required" }),
        };
      }

      const actualQrCode = extractQrCode(qrCode);

      if (!actualQrCode || !actualQrCode.startsWith("AHANGAMA-")) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            valid: false,
            error: "Invalid QR code format",
          }),
        };
      }

      // Find the purchase record with customer details
      const purchase = await sql`
        SELECT *
        FROM purchases 
        WHERE qr_code = ${actualQrCode}
        LIMIT 1
      `;

      if (purchase.length === 0) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            valid: false,
            error: "Pass not found",
          }),
        };
      }

      const purchaseRecord = purchase[0];

      const expiryDate = new Date(purchaseRecord.expiry_date);
      const isExpired = new Date() > expiryDate;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          valid: !isExpired,
          expired: isExpired,
          purchase: {
            productName: purchaseRecord.product_name,
            customerName: purchaseRecord.customer_name,
            customerEmail: purchaseRecord.customer_email,
            customerPhone: purchaseRecord.customer_phone,
            validityDays: purchaseRecord.validity_days,
            expiryDate: expiryDate.toISOString(),
            maxPeople: purchaseRecord.max_people,
            redemptionCount: 0, // We'll add redemption counting later
            purchaseDate: purchaseRecord.created_at,
            qrCode: purchaseRecord.qr_code,
          },
        }),
      };
    } catch (error) {
      console.error("Verification error:", error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          valid: false,
          error: "Failed to verify pass",
        }),
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: "Method not allowed" }),
  };
};
