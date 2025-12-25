// Force fresh deployment - 2025-12-25
// Use raw SQL like qr-verify function to avoid drizzle import issues
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export const handler = async (event, context) => {
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
    const { type } = event.queryStringParameters || {};

    switch (type) {
      case "purchases":
        const allPurchasesRaw = await sql`
          SELECT * FROM purchases 
          ORDER BY created_at DESC
        `;

        // Transform snake_case to camelCase to match frontend expectations
        const allPurchases = allPurchasesRaw.map((purchase) => ({
          id: purchase.id,
          sessionId: purchase.session_id,
          qrCode: purchase.qr_code,
          productId: purchase.product_id,
          productName: purchase.product_name,
          priceUsd: purchase.price_usd,
          validityDays: purchase.validity_days,
          maxPeople: purchase.max_people,
          customerName: purchase.customer_name,
          customerEmail: purchase.customer_email,
          customerPhone: purchase.customer_phone,
          stripePaymentIntentId: purchase.stripe_payment_intent_id,
          currency: purchase.currency,
          purchaseDate: purchase.purchase_date,
          expiryDate: purchase.expiry_date,
          isActive: purchase.is_active,
          createdAt: purchase.created_at,
          updatedAt: purchase.updated_at,
        }));

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            data: allPurchases,
            count: allPurchases.length,
          }),
        };

      case "redemptions":
        const allRedemptionsRaw = await sql`
          SELECT 
            r.*,
            p.qr_code,
            p.product_name,
            p.customer_name,
            p.customer_email,
            p.customer_phone
          FROM redemptions r
          LEFT JOIN purchases p ON r.purchase_id = p.id
          ORDER BY r.redeemed_at DESC
        `;

        // Transform snake_case to camelCase and include enhanced details
        const allRedemptions = allRedemptionsRaw.map((redemption) => ({
          id: redemption.id,
          purchaseId: redemption.purchase_id,
          qrCode: redemption.qr_code,
          venueId: redemption.venue_id,
          venueName: redemption.venue_name,
          venueCategory: redemption.venue_category,
          redeemedAt: redemption.redeemed_at,
          offerUsed: redemption.offer_used,
          verifiedByStaff: redemption.verified_by_staff,
          staffNotes: redemption.staff_notes,
          createdAt: redemption.created_at,
          // Purchase details
          productName: redemption.product_name,
          customerName: redemption.customer_name,
          customerEmail: redemption.customer_email,
          customerPhone: redemption.customer_phone,
        }));

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            data: allRedemptions,
            count: allRedemptions.length,
          }),
        };

      case "stats":
        const purchaseCount = await sql`
          SELECT COUNT(*) as count FROM purchases
        `;

        const redemptionCount = await sql`
          SELECT COUNT(*) as count FROM redemptions
        `;

        const totalRevenue = await sql`
          SELECT SUM(price_usd::numeric) as total FROM purchases
        `;

        const activePurchases = await sql`
          SELECT COUNT(*) as count FROM purchases 
          WHERE is_active = true AND expiry_date >= NOW()
        `;

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            stats: {
              totalPurchases: parseInt(purchaseCount[0]?.count) || 0,
              totalRedemptions: parseInt(redemptionCount[0]?.count) || 0,
              totalRevenue: parseFloat(totalRevenue[0]?.total) || 0,
              activePasses: parseInt(activePurchases[0]?.count) || 0,
            },
          }),
        };

      case "customer":
        const { email } = event.queryStringParameters;
        if (!email) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: "Email parameter required" }),
          };
        }

        const customerPurchasesRaw = await sql`
          SELECT * FROM purchases 
          WHERE customer_email = ${email}
          ORDER BY created_at DESC
        `;

        // Transform snake_case to camelCase
        const customerPurchases = customerPurchasesRaw.map((purchase) => ({
          id: purchase.id,
          sessionId: purchase.session_id,
          qrCode: purchase.qr_code,
          productId: purchase.product_id,
          productName: purchase.product_name,
          priceUsd: purchase.price_usd,
          validityDays: purchase.validity_days,
          maxPeople: purchase.max_people,
          customerName: purchase.customer_name,
          customerEmail: purchase.customer_email,
          customerPhone: purchase.customer_phone,
          stripePaymentIntentId: purchase.stripe_payment_intent_id,
          currency: purchase.currency,
          purchaseDate: purchase.purchase_date,
          expiryDate: purchase.expiry_date,
          isActive: purchase.is_active,
          createdAt: purchase.created_at,
          updatedAt: purchase.updated_at,
        }));

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            data: customerPurchases,
          }),
        };

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error:
              "Invalid type parameter. Use: purchases, redemptions, stats, or customer",
          }),
        };
    }
  } catch (error) {
    console.error("Admin data error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
    };
  }
};
