import {
  pgTable,
  text,
  timestamp,
  decimal,
  integer,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";

// Pass purchases table
export const purchases = pgTable("purchases", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: text("session_id").unique().notNull(), // Stripe session ID
  qrCode: text("qr_code").unique().notNull(), // Unique QR code

  // Product details
  productId: text("product_id").notNull(), // standard, duo, longStay, etc.
  productName: text("product_name").notNull(),
  priceUsd: decimal("price_usd", { precision: 10, scale: 2 }).notNull(),
  validityDays: integer("validity_days").notNull(),
  maxPeople: integer("max_people").notNull(),

  // Customer details
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),

  // Payment details
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  currency: text("currency").default("usd"),

  // Pass validity
  purchaseDate: timestamp("purchase_date").defaultNow().notNull(),
  expiryDate: timestamp("expiry_date").notNull(),
  isActive: boolean("is_active").default(true),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Redemptions/usage tracking table
export const redemptions = pgTable("redemptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  purchaseId: uuid("purchase_id")
    .references(() => purchases.id)
    .notNull(),

  // Venue details
  venueId: text("venue_id").notNull(), // from places.js
  venueName: text("venue_name").notNull(),
  venueCategory: text("venue_category").notNull(),

  // Redemption details
  redeemedAt: timestamp("redeemed_at").defaultNow().notNull(),
  offerUsed: text("offer_used"), // What offer was redeemed

  // Staff verification (optional)
  verifiedByStaff: text("verified_by_staff"),
  staffNotes: text("staff_notes"),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Database functions for easy querying
export const dbQueries = {
  // Create a new purchase
  createPurchase: async (db, purchaseData) => {
    return await db.insert(purchases).values(purchaseData).returning();
  },

  // Find purchase by QR code
  findByQRCode: async (db, qrCode) => {
    return await db
      .select()
      .from(purchases)
      .where(eq(purchases.qrCode, qrCode));
  },

  // Find purchases by customer email
  findByEmail: async (db, email) => {
    return await db
      .select()
      .from(purchases)
      .where(eq(purchases.customerEmail, email))
      .orderBy(desc(purchases.createdAt));
  },

  // Add redemption
  addRedemption: async (db, redemptionData) => {
    return await db.insert(redemptions).values(redemptionData).returning();
  },

  // Check if already redeemed today at venue
  checkTodayRedemption: async (db, purchaseId, venueId) => {
    const today = new Date().toISOString().split("T")[0];
    return await db
      .select()
      .from(redemptions)
      .where(
        and(
          eq(redemptions.purchaseId, purchaseId),
          eq(redemptions.venueId, venueId),
          gte(redemptions.redeemedAt, `${today}T00:00:00`),
          lt(redemptions.redeemedAt, `${today}T23:59:59`)
        )
      );
  },

  // Get redemption history for a purchase
  getRedemptions: async (db, purchaseId) => {
    return await db
      .select()
      .from(redemptions)
      .where(eq(redemptions.purchaseId, purchaseId))
      .orderBy(desc(redemptions.redeemedAt));
  },
};
