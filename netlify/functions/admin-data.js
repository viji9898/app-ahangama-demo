// Force fresh deployment - 2025-12-24
import { db } from "../../src/lib/database.js";
import { purchases, redemptions } from "../../db/schema.js";
import { desc, eq, and, gte, count, sum } from "drizzle-orm";

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
        const allPurchases = await db
          .select()
          .from(purchases)
          .orderBy(desc(purchases.createdAt));

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
        const allRedemptions = await db
          .select()
          .from(redemptions)
          .orderBy(desc(redemptions.redeemedAt));

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
        const purchaseCount = await db
          .select({ count: count() })
          .from(purchases);

        const redemptionCount = await db
          .select({ count: count() })
          .from(redemptions);

        const totalRevenue = await db
          .select({ total: sum(purchases.priceUsd) })
          .from(purchases);

        const activePurchases = await db
          .select({ count: count() })
          .from(purchases)
          .where(
            and(
              eq(purchases.isActive, true),
              gte(purchases.expiryDate, new Date())
            )
          );

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            stats: {
              totalPurchases: purchaseCount[0]?.count || 0,
              totalRedemptions: redemptionCount[0]?.count || 0,
              totalRevenue: totalRevenue[0]?.total || 0,
              activePasses: activePurchases[0]?.count || 0,
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

        const customerPurchases = await db
          .select()
          .from(purchases)
          .where(eq(purchases.customerEmail, email))
          .orderBy(desc(purchases.createdAt));

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
