#!/usr/bin/env node
import { db } from "../src/lib/database.js";
import { purchases, redemptions } from "../db/schema.js";
import { desc, eq } from "drizzle-orm";

const commands = {
  async seedDatabase() {
    console.log("🌱 Seeding database with test data...\n");

    try {
      const response = await fetch(
        "http://localhost:8888/.netlify/functions/seed-database",
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        console.log("✅ Database seeded successfully!");
        console.log(`📊 ${result.data.purchasesCreated} purchases created`);
        console.log(`🏪 ${result.data.redemptionsCreated} redemptions created`);
        console.log(`👥 ${result.data.customers} customers added`);
        console.log(`💰 Total revenue: $${result.summary.totalRevenue}`);
        console.log(`✅ Active passes: ${result.summary.activePasses}`);
        console.log(`❌ Expired passes: ${result.summary.expiredPasses}`);
      } else {
        throw new Error(result.error || "Seeding failed");
      }
    } catch (error) {
      console.error("❌ Seeding failed:", error.message);
      console.log("\n💡 Make sure your development server is running:");
      console.log("   npm run dev");
    }
  },

  async listCustomers() {
    console.log("🧑‍🤝‍🧑 All Customers and Their Passes:\n");

    const allPurchases = await db
      .select()
      .from(purchases)
      .orderBy(desc(purchases.createdAt));

    allPurchases.forEach((purchase, index) => {
      const isExpired = new Date(purchase.expiryDate) < new Date();
      const status =
        purchase.isActive && !isExpired ? "✅ ACTIVE" : "❌ EXPIRED/INACTIVE";

      console.log(`${index + 1}. ${purchase.customerName}`);
      console.log(`   📧 ${purchase.customerEmail}`);
      console.log(`   📱 ${purchase.customerPhone || "No phone"}`);
      console.log(`   🎫 ${purchase.productName} - $${purchase.priceUsd}`);
      console.log(`   🔢 QR: ${actualQrCode}`);
      if (actualQrCode.startsWith("AHANGAMA-")) {
        console.log(
          `   📱 Scan URL: https://ahangama.com/card/verify?qr=${encodeURIComponent(
            actualQrCode
          )}`
        );
      }
      console.log(
        `   📅 Expires: ${new Date(
          purchase.expiryDate
        ).toLocaleDateString()} ${status}`
      );
      console.log(`   🆔 Purchase ID: ${purchase.id}`);
      console.log("   " + "-".repeat(50));
    });

    console.log(`\n📊 Total: ${allPurchases.length} passes sold`);
  },

  async customerDetails(email) {
    if (!email) {
      console.log(
        "❌ Please provide customer email: node db-query.js customer-details customer@example.com"
      );
      return;
    }

    console.log(`🔍 Customer Details for: ${email}\n`);

    const customerPurchases = await db
      .select()
      .from(purchases)
      .where(eq(purchases.customerEmail, email))
      .orderBy(desc(purchases.createdAt));

    if (customerPurchases.length === 0) {
      console.log("❌ No purchases found for this email");
      return;
    }

    for (const purchase of customerPurchases) {
      const isExpired = new Date(purchase.expiryDate) < new Date();
      const status =
        purchase.isActive && !isExpired ? "✅ ACTIVE" : "❌ EXPIRED/INACTIVE";

      console.log(`🎫 Pass: ${purchase.productName}`);
      console.log(`💰 Price: $${purchase.priceUsd}`);
      console.log(`🔢 QR Code: ${purchase.qrCode}`);
      console.log(
        `📅 Purchased: ${new Date(purchase.purchaseDate).toLocaleString()}`
      );
      console.log(
        `⏰ Expires: ${new Date(
          purchase.expiryDate
        ).toLocaleString()} ${status}`
      );
      console.log(`👥 Max People: ${purchase.maxPeople}`);
      console.log(`📝 Stripe Session: ${purchase.sessionId}`);

      // Get redemptions for this purchase
      const purchaseRedemptions = await db
        .select()
        .from(redemptions)
        .where(eq(redemptions.purchaseId, purchase.id))
        .orderBy(desc(redemptions.redeemedAt));

      if (purchaseRedemptions.length > 0) {
        console.log(`🏪 Redemptions (${purchaseRedemptions.length}):`);
        purchaseRedemptions.forEach((redemption, idx) => {
          console.log(
            `   ${idx + 1}. ${redemption.venueName} (${
              redemption.venueCategory
            })`
          );
          console.log(
            `      📅 ${new Date(redemption.redeemedAt).toLocaleString()}`
          );
          if (redemption.offerUsed) {
            console.log(`      🎁 Offer: ${redemption.offerUsed}`);
          }
        });
      } else {
        console.log(`🏪 Redemptions: None yet`);
      }

      console.log("   " + "=".repeat(60));
    }
  },

  async verifyQr(qrCode) {
    if (!qrCode) {
      console.log(
        "❌ Please provide QR code: node db-query.js verify-qr AHANGAMA-STANDARD-ABC123"
      );
      return;
    }

    console.log(`🔍 Verifying QR Code: ${qrCode}\n`);

    const purchaseResult = await db
      .select()
      .from(purchases)
      .where(eq(purchases.qrCode, qrCode));

    if (purchaseResult.length === 0) {
      console.log("❌ Invalid QR code - not found in database");
      return;
    }

    const purchase = purchaseResult[0];
    const isExpired = new Date(purchase.expiryDate) < new Date();
    const isValid = purchase.isActive && !isExpired;

    console.log(`${isValid ? "✅ VALID" : "❌ INVALID"} Pass Details:`);
    console.log(`👤 Customer: ${purchase.customerName}`);
    console.log(`📧 Email: ${purchase.customerEmail}`);
    console.log(`🎫 Pass: ${purchase.productName}`);
    console.log(`💰 Price: $${purchase.priceUsd}`);
    console.log(`👥 Max People: ${purchase.maxPeople}`);
    console.log(
      `📅 Purchased: ${new Date(purchase.purchaseDate).toLocaleString()}`
    );
    console.log(
      `⏰ Expires: ${new Date(purchase.expiryDate).toLocaleString()}`
    );
    console.log(`🔄 Status: ${purchase.isActive ? "Active" : "Inactive"}`);

    if (isExpired) {
      console.log("❌ This pass has EXPIRED");
    }

    // Show redemption history
    const redemptionHistory = await db
      .select()
      .from(redemptions)
      .where(eq(redemptions.purchaseId, purchase.id))
      .orderBy(desc(redemptions.redeemedAt));

    if (redemptionHistory.length > 0) {
      console.log(`\n🏪 Redemption History (${redemptionHistory.length}):`);
      redemptionHistory.forEach((redemption, idx) => {
        console.log(`  ${idx + 1}. ${redemption.venueName}`);
        console.log(
          `     📅 ${new Date(redemption.redeemedAt).toLocaleString()}`
        );
        if (redemption.offerUsed)
          console.log(`     🎁 ${redemption.offerUsed}`);
      });
    } else {
      console.log(`\n🏪 No redemptions yet`);
    }
  },

  async stats() {
    console.log("📊 Database Statistics:\n");

    const allPurchases = await db.select().from(purchases);
    const allRedemptions = await db.select().from(redemptions);

    const totalRevenue = allPurchases.reduce(
      (sum, p) => sum + parseFloat(p.priceUsd || 0),
      0
    );
    const activePasses = allPurchases.filter(
      (p) => p.isActive && new Date(p.expiryDate) > new Date()
    );
    const expiredPasses = allPurchases.filter(
      (p) => new Date(p.expiryDate) < new Date()
    );

    console.log(`🎫 Total Passes Sold: ${allPurchases.length}`);
    console.log(`💰 Total Revenue: $${totalRevenue.toFixed(2)}`);
    console.log(`✅ Active Passes: ${activePasses.length}`);
    console.log(`❌ Expired Passes: ${expiredPasses.length}`);
    console.log(`🏪 Total Redemptions: ${allRedemptions.length}`);

    // Pass type breakdown
    const passByType = {};
    allPurchases.forEach((p) => {
      passByType[p.productName] = (passByType[p.productName] || 0) + 1;
    });

    console.log(`\n🎫 Pass Types:`);
    Object.entries(passByType).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });

    // Recent purchases (last 10)
    const recentPurchases = allPurchases
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    console.log(`\n🕐 Recent Purchases:`);
    recentPurchases.forEach((purchase, idx) => {
      console.log(
        `   ${idx + 1}. ${purchase.customerName} - ${
          purchase.productName
        } - ${new Date(purchase.createdAt).toLocaleDateString()}`
      );
    });
  },

  help() {
    console.log("🗃️  Ahangama Pass Database Query Tool\n");
    console.log("Available commands:");
    console.log(
      "  seed-database            - Populate database with test data"
    );
    console.log(
      "  list-customers           - Show all customers and their passes"
    );
    console.log(
      "  customer-details <email> - Show detailed info for a customer"
    );
    console.log("  verify-qr <qrcode>       - Verify and show QR code details");
    console.log("  stats                    - Show database statistics");
    console.log("  help                     - Show this help message");
    console.log("\nExamples:");
    console.log("  node db-query.js seed-database");
    console.log("  node db-query.js list-customers");
    console.log("  node db-query.js customer-details john@example.com");
    console.log("  node db-query.js verify-qr AHANGAMA-STANDARD-ABC123");
    console.log("  node db-query.js stats");
  },
};

// Main execution
const command = process.argv[2];
const argument = process.argv[3];

if (!command || !commands[command.replace(/-/g, "")]) {
  commands.help();
  process.exit(0);
}

try {
  const normalizedCommand = command.replace(/-/g, "");
  await commands[normalizedCommand](argument);
} catch (error) {
  console.error("❌ Database error:", error.message);
} finally {
  process.exit(0);
}
