#!/usr/bin/env node
import { neon } from "@netlify/neon";

const databaseUrl =
  process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
const sql = neon(databaseUrl);

console.log("🔍 Verifying database connection and schema...\n");

try {
  // Check if tables exist
  const tables = await sql(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('purchases', 'redemptions')
    ORDER BY table_name;
  `);

  console.log("📋 Tables found:", tables.map((t) => t.table_name).join(", "));

  // Check purchases table structure
  const purchasesColumns = await sql(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'purchases' 
    ORDER BY ordinal_position;
  `);

  console.log("\n📊 Purchases table columns:");
  purchasesColumns.forEach((col) => {
    console.log(`  - ${col.column_name}: ${col.data_type}`);
  });

  // Check redemptions table structure
  const redemptionsColumns = await sql(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'redemptions' 
    ORDER BY ordinal_position;
  `);

  console.log("\n🏪 Redemptions table columns:");
  redemptionsColumns.forEach((col) => {
    console.log(`  - ${col.column_name}: ${col.data_type}`);
  });

  // Test a simple query
  const purchaseCount = await sql(`SELECT COUNT(*) as count FROM purchases`);
  const redemptionCount = await sql(
    `SELECT COUNT(*) as count FROM redemptions`
  );

  console.log("\n📈 Data summary:");
  console.log(`  - Purchases: ${purchaseCount[0].count} records`);
  console.log(`  - Redemptions: ${redemptionCount[0].count} records`);

  console.log("\n✅ Database connection verified successfully!");
  console.log("🔗 Connected to Neon PostgreSQL via Netlify DB");
} catch (error) {
  console.error("❌ Error verifying database:", error.message);
  process.exit(1);
} finally {
  process.exit(0);
}
