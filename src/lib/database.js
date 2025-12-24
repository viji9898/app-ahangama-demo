import { neon } from "@netlify/neon";
import { drizzle } from "drizzle-orm/neon-http";
import {
  eq,
  and,
  gte,
  lt,
  desc,
  count,
  sum,
  max,
  countDistinct,
  sql as sqlRaw,
} from "drizzle-orm";
import { purchases, redemptions, dbQueries } from "../../db/schema.js";

// Initialize database connection
const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
const sql = neon(databaseUrl);
export const db = drizzle(sql);

export const DatabaseService = {
  // Create purchase record after successful Stripe payment
  async createPurchase(stripeSession) {
    const purchaseData = {
      sessionId: stripeSession.id,
      qrCode: this.generateQRCode(stripeSession.id, stripeSession.metadata),
      productId: stripeSession.metadata.productId,
      productName: stripeSession.metadata.productName,
      priceUsd: (stripeSession.amount_total / 100).toString(),
      validityDays: parseInt(stripeSession.metadata.validityDays),
      maxPeople: parseInt(stripeSession.metadata.maxPeople),
      customerName: stripeSession.metadata.customerName,
      customerEmail: stripeSession.customer_details.email,
      customerPhone: stripeSession.metadata.customerPhone,
      stripePaymentIntentId: stripeSession.payment_intent,
      currency: stripeSession.currency,
      expiryDate: new Date(
        Date.now() +
          parseInt(stripeSession.metadata.validityDays) * 24 * 60 * 60 * 1000
      ),
    };

    const result = await dbQueries.createPurchase(db, purchaseData);
    return result[0];
  },

  // Verify QR code and get pass details
  async verifyQRCode(qrCode) {
    const result = await dbQueries.findByQRCode(db, qrCode);

    if (result.length === 0) {
      throw new Error("Invalid QR code");
    }

    const purchase = result[0];

    // Check if pass is still valid
    if (new Date() > new Date(purchase.expiryDate)) {
      throw new Error("Pass has expired");
    }

    if (!purchase.isActive) {
      throw new Error("Pass has been deactivated");
    }

    return purchase;
  },

  // Redeem pass at venue
  async redeemPass(qrCode, venueId, venueName, venueCategory, offerUsed) {
    const purchase = await this.verifyQRCode(qrCode);

    // Check if already redeemed today at this venue (once per day rule)
    const todayRedemptions = await dbQueries.checkTodayRedemption(
      db,
      purchase.id,
      venueId
    );

    if (todayRedemptions.length > 0) {
      throw new Error("Pass already redeemed today at this venue");
    }

    // Create redemption record
    const redemptionData = {
      purchaseId: purchase.id,
      venueId,
      venueName,
      venueCategory,
      offerUsed,
    };

    const redemption = await dbQueries.addRedemption(db, redemptionData);

    return {
      success: true,
      purchase,
      redemption: redemption[0],
      message: `${purchase.productName} redeemed at ${venueName}!`,
    };
  },

  // Get customer's passes
  async getCustomerPasses(email) {
    return await dbQueries.findByEmail(db, email);
  },

  // Get pass usage history
  async getPassHistory(purchaseId) {
    return await dbQueries.getRedemptions(db, purchaseId);
  },

  // Generate unique QR codes
  generateQRCode(sessionId, metadata) {
    const timestamp = Date.now();
    const crypto = require("crypto");
    const hash = crypto
      .createHash("md5")
      .update(`${sessionId}-${metadata.productId}-${timestamp}`)
      .digest("hex")
      .substring(0, 8)
      .toUpperCase();

    return `AHANGAMA-${metadata.productId.toUpperCase()}-${hash}`;
  },

  // Analytics functions
  async getVenueStats(venueId) {
    // Get redemption stats for a venue
    const stats = await db
      .select({
        totalRedemptions: count(redemptions.id),
        uniqueCustomers: countDistinct(redemptions.purchaseId),
        lastRedemption: max(redemptions.redeemedAt),
      })
      .from(redemptions)
      .where(eq(redemptions.venueId, venueId));

    return stats[0];
  },

  async getPassTypeStats() {
    // Get stats by pass type
    return await db
      .select({
        productId: purchases.productId,
        totalSold: count(purchases.id),
        totalRevenue: sum(purchases.priceUsd),
        // Simplified count for active passes
        activeCount: sqlRaw`count(case when ${purchases.expiryDate} > now() and ${purchases.isActive} = true then ${purchases.id} end)`,
      })
      .from(purchases)
      .groupBy(purchases.productId);
  },
};

// Export for use in Netlify Functions
export default DatabaseService;
