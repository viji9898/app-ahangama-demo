#!/usr/bin/env node
import { neon } from "@netlify/neon";

const databaseUrl =
  process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error(
    "❌ Database URL not found. Make sure NETLIFY_DATABASE_URL is set."
  );
  process.exit(1);
}

const sql = neon(databaseUrl);

console.log("🗄️ Creating database tables...\n");

try {
  // Create tables using Neon SQL
  console.log("📋 Creating 'purchases' table...");
  await sql(`
    CREATE TABLE IF NOT EXISTS purchases (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      session_id TEXT UNIQUE NOT NULL,
      qr_code TEXT UNIQUE NOT NULL,
      
      -- Product details
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      price_usd DECIMAL(10, 2) NOT NULL,
      validity_days INTEGER NOT NULL,
      max_people INTEGER NOT NULL,
      
      -- Customer details
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      
      -- Payment details
      stripe_payment_intent_id TEXT,
      currency TEXT DEFAULT 'usd',
      
      -- Pass validity
      purchase_date TIMESTAMP DEFAULT NOW() NOT NULL,
      expiry_date TIMESTAMP NOT NULL,
      is_active BOOLEAN DEFAULT true,
      
      -- Timestamps
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `);

  console.log("🏪 Creating 'redemptions' table...");
  await sql(`
    CREATE TABLE IF NOT EXISTS redemptions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      purchase_id UUID REFERENCES purchases(id) NOT NULL,
      
      -- Venue details
      venue_id TEXT NOT NULL,
      venue_name TEXT NOT NULL,
      venue_category TEXT NOT NULL,
      
      -- Redemption details
      redeemed_at TIMESTAMP DEFAULT NOW() NOT NULL,
      offer_used TEXT,
      
      -- Staff verification (optional)
      verified_by_staff TEXT,
      staff_notes TEXT,
      
      -- Timestamps
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `);

  console.log("🔗 Creating indexes...");
  await sql(`
    CREATE INDEX IF NOT EXISTS idx_purchases_qr_code ON purchases(qr_code);
  `);
  await sql(`
    CREATE INDEX IF NOT EXISTS idx_purchases_customer_email ON purchases(customer_email);
  `);
  await sql(`
    CREATE INDEX IF NOT EXISTS idx_purchases_session_id ON purchases(session_id);
  `);
  await sql(`
    CREATE INDEX IF NOT EXISTS idx_redemptions_purchase_id ON redemptions(purchase_id);
  `);
  await sql(`
    CREATE INDEX IF NOT EXISTS idx_redemptions_venue_id ON redemptions(venue_id);
  `);

  console.log("\n✅ Database schema created successfully!");
  console.log("📊 Tables created:");
  console.log("  - purchases (customer pass purchases)");
  console.log("  - redemptions (venue redemption history)");
  console.log("🔍 Indexes created for optimal querying");
} catch (error) {
  console.error("❌ Error creating database schema:", error.message);
  process.exit(1);
} finally {
  process.exit(0);
}
