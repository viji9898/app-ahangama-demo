import pg from "pg";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationFiles = [
  "029_centralize_guide_venues.sql",
  "030_seed_guide_placements.sql",
];

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

try {
  for (const migrationFile of migrationFiles) {
    const sql = readFileSync(
      join(__dirname, "../migrations", migrationFile),
      "utf8",
    );
    await pool.query(sql);
    console.log(`${migrationFile} applied successfully.`);
  }
} catch (err) {
  console.error("Migration failed:", err.message);
  process.exit(1);
} finally {
  await pool.end();
}
