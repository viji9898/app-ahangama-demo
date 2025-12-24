import { db } from "../../src/lib/database.js";
import { purchases, redemptions } from "../../db/schema.js";
import { CARD_PRODUCTS } from "../../src/data/cardConfig.js";

const TEST_CUSTOMERS = [
  {
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+94 77 123 4567",
  },
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@gmail.com",
    phone: "+94 71 987 6543",
  },
  {
    name: "Mike Chen",
    email: "mike.chen@outlook.com",
    phone: "+94 76 555 0123",
  },
  {
    name: "Emma Williams",
    email: "emma.williams@yahoo.com",
    phone: "+94 70 444 9876",
  },
  {
    name: "David Brown",
    email: "david.brown@hotmail.com",
    phone: "+94 75 333 2468",
  },
];

const SAMPLE_VENUES = [
  { id: "coco-bay", name: "Coco Bay Restaurant", category: "eat" },
  { id: "sunset-villa", name: "Sunset Villa", category: "stays" },
  { id: "surf-school", name: "Ahangama Surf School", category: "experiences" },
  { id: "palm-cafe", name: "Palm Tree Cafe", category: "eat" },
  { id: "beach-yoga", name: "Beach Yoga Sessions", category: "experiences" },
  { id: "ocean-view", name: "Ocean View Guesthouse", category: "stays" },
];

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
      body: JSON.stringify({
        error: "Method not allowed. Use POST to seed data.",
      }),
    };
  }

  try {
    // Clear existing test data first
    await db.delete(redemptions);
    await db.delete(purchases);

    const createdPurchases = [];
    const createdRedemptions = [];

    // Create sample purchases for each customer
    for (let i = 0; i < TEST_CUSTOMERS.length; i++) {
      const customer = TEST_CUSTOMERS[i];
      const productKeys = Object.keys(CARD_PRODUCTS);
      const randomProduct = CARD_PRODUCTS[productKeys[i % productKeys.length]];

      // Create purchase with dates spread over last 30 days
      const daysAgo = Math.floor(Math.random() * 30);
      const purchaseDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
      const expiryDate = new Date(
        purchaseDate.getTime() +
          randomProduct.validityDays * 24 * 60 * 60 * 1000
      );

      const purchaseData = {
        sessionId: `cs_test_${Date.now()}_${i}`,
        qrCode: `AHANGAMA-${randomProduct.id.toUpperCase()}-${Math.random()
          .toString(36)
          .substr(2, 8)
          .toUpperCase()}`,
        productId: randomProduct.id,
        productName: randomProduct.name,
        priceUsd: randomProduct.price.toString(),
        validityDays: randomProduct.validityDays,
        maxPeople: randomProduct.maxPeople,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        stripePaymentIntentId: `pi_test_${Date.now()}_${i}`,
        currency: "usd",
        purchaseDate: purchaseDate,
        expiryDate: expiryDate,
        isActive: Math.random() > 0.1, // 90% active
        createdAt: purchaseDate,
        updatedAt: purchaseDate,
      };

      const [createdPurchase] = await db
        .insert(purchases)
        .values(purchaseData)
        .returning();
      createdPurchases.push(createdPurchase);

      // Create 1-3 random redemptions for each purchase (if active and not expired)
      if (
        createdPurchase.isActive &&
        new Date() < new Date(createdPurchase.expiryDate)
      ) {
        const redemptionCount = Math.floor(Math.random() * 3) + 1;

        for (let j = 0; j < redemptionCount; j++) {
          const venue =
            SAMPLE_VENUES[Math.floor(Math.random() * SAMPLE_VENUES.length)];
          const redemptionDate = new Date(
            purchaseDate.getTime() +
              Math.random() * (Date.now() - purchaseDate.getTime())
          );

          // Don't create future redemptions
          if (redemptionDate <= new Date()) {
            const offers = [
              "20% off main dishes",
              "Free welcome drink",
              "Complimentary dessert",
              "10% off total bill",
              "Free appetizer",
              "Buy 1 get 1 coffee",
            ];

            const redemptionData = {
              purchaseId: createdPurchase.id,
              venueId: venue.id,
              venueName: venue.name,
              venueCategory: venue.category,
              redeemedAt: redemptionDate,
              offerUsed: offers[Math.floor(Math.random() * offers.length)],
              verifiedByStaff: ["Manager", "Server", "Owner"][
                Math.floor(Math.random() * 3)
              ],
              staffNotes:
                Math.random() > 0.7 ? "Great customer, very friendly" : null,
              createdAt: redemptionDate,
            };

            const [createdRedemption] = await db
              .insert(redemptions)
              .values(redemptionData)
              .returning();
            createdRedemptions.push(createdRedemption);
          }
        }
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Test data seeded successfully!",
        data: {
          purchasesCreated: createdPurchases.length,
          redemptionsCreated: createdRedemptions.length,
          customers: TEST_CUSTOMERS.length,
        },
        summary: {
          totalRevenue: createdPurchases.reduce(
            (sum, p) => sum + parseFloat(p.priceUsd),
            0
          ),
          activePasses: createdPurchases.filter(
            (p) => p.isActive && new Date() < new Date(p.expiryDate)
          ).length,
          expiredPasses: createdPurchases.filter(
            (p) => new Date() >= new Date(p.expiryDate)
          ).length,
        },
      }),
    };
  } catch (error) {
    console.error("Seed data error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to seed test data",
        details: error.message,
      }),
    };
  }
};
