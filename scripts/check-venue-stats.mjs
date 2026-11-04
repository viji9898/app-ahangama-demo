import "dotenv/config";
import process from "node:process";
import pg from "pg";
import {
  getGa4PropertyId,
  hasExplicitCredentials,
  isGa4Configured,
  runGa4Report,
} from "../lib/ga4-report.js";
import { LINK_TYPES, VENUE_STATS } from "../lib/venue-stats-config.js";

/*
 * Pre-flight check for the venue performance statistics feature.
 *
 * Verifies the three things that cannot be guessed from the source:
 *   1. the venue registry is complete and consistent
 *   2. GA4 credentials work and the custom dimensions are registered
 *   3. the database is reachable and migration 033 has been applied
 *
 * Usage: npm run check:venue-stats
 * Exits non-zero when a required check fails.
 */

const results = [];

function pass(label, detail = "") {
  results.push({ level: "pass", label, detail });
}

function warn(label, detail = "") {
  results.push({ level: "warn", label, detail });
}

function fail(label, detail = "") {
  results.push({ level: "fail", label, detail });
}

function checkRegistry() {
  if (VENUE_STATS.length !== 8) {
    fail("Venue registry", `expected 8 venues, found ${VENUE_STATS.length}`);
    return;
  }

  const keys = new Set();
  const venueIds = new Set();
  const problems = [];

  for (const venue of VENUE_STATS) {
    if (!/^[a-z0-9-]+$/.test(venue.key || "")) {
      problems.push(`invalid key "${venue.key}"`);
    }
    if (keys.has(venue.key)) problems.push(`duplicate key "${venue.key}"`);
    keys.add(venue.key);

    if (venueIds.has(venue.venueId)) {
      problems.push(`duplicate venueId "${venue.venueId}"`);
    }
    venueIds.add(venue.venueId);

    for (const field of ["name", "shortName", "section", "sectionLabel"]) {
      if (!venue[field]) problems.push(`${venue.key}: missing ${field}`);
    }

    for (const field of ["instagram", "googleMaps"]) {
      if (!String(venue[field] || "").startsWith("https://")) {
        problems.push(`${venue.key}: ${field} is not an https URL`);
      }
    }

    for (const path of venue.articlePaths || []) {
      if (!String(path).startsWith("/")) {
        problems.push(`${venue.key}: article path "${path}" is not absolute`);
      }
    }
  }

  if (problems.length) {
    fail("Venue registry", problems.join("; "));
  } else {
    pass(
      "Venue registry",
      `${VENUE_STATS.length} venues, ${LINK_TYPES.length} link types`,
    );
  }
}

async function checkGa4() {
  if (!isGa4Configured()) {
    fail(
      "GA4 configuration",
      "GA4_PROPERTY_ID is missing. Set the numeric property id in the environment.",
    );
    return;
  }

  const propertyId = getGa4PropertyId();
  if (!/^\d+$/.test(propertyId)) {
    fail(
      "GA4 property id",
      `"${propertyId}" is not numeric. Use the property id (for example 123456789), not the G- measurement id.`,
    );
    return;
  }

  if (
    !hasExplicitCredentials() &&
    !process.env.GOOGLE_APPLICATION_CREDENTIALS
  ) {
    warn(
      "GA4 credentials",
      "No explicit service-account credential found; falling back to application default credentials.",
    );
  }

  const probe = await runGa4Report({
    dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
    metrics: [{ name: "eventCount" }],
  });

  if (!probe.ok) {
    fail("GA4 Data API", `${probe.error.code}: ${probe.error.message}`);
    return;
  }

  pass("GA4 Data API", `property ${propertyId} responded`);

  const dimensions = [
    ["venue_id", "customEvent:venue_id"],
    ["venue_slug", "customEvent:venue_slug"],
    ["venue_name", "customEvent:venue_name"],
    ["link_type", "customEvent:link_type"],
    ["link_url", "customEvent:link_url"],
  ];

  const missing = [];
  for (const [name, dimension] of dimensions) {
    const report = await runGa4Report({
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
      dimensions: [{ name: dimension }],
      metrics: [{ name: "eventCount" }],
      limit: 1,
    });

    if (!report.ok) {
      if (report.error.code === "GA4_DIMENSION_UNAVAILABLE") {
        missing.push(name);
      } else {
        fail("GA4 custom dimensions", `${name}: ${report.error.message}`);
        return;
      }
    }
  }

  if (missing.length) {
    fail(
      "GA4 custom dimensions",
      `missing: ${missing.join(", ")}. Register them under Admin → Data display → Custom definitions (event scope).`,
    );
  } else {
    pass("GA4 custom dimensions", "all five event-scoped dimensions exist");
  }

  const clicks = await runGa4Report({
    dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
    dimensions: [{ name: "eventName" }],
    metrics: [{ name: "eventCount" }],
    dimensionFilter: {
      filter: { fieldName: "eventName", stringFilter: { value: "venue_link_click" } },
    },
    limit: 1,
  });

  if (!clicks.ok) {
    warn("GA4 click events", clicks.error.message);
  } else if (!clicks.rows.length) {
    warn(
      "GA4 click events",
      "no venue_link_click events in the last 7 days yet",
    );
  } else {
    pass("GA4 click events", "venue_link_click is recording");
  }
}

async function checkDatabase() {
  const connectionString = process.env.DATABASE_URL || "";
  if (!connectionString) {
    fail("Database", "DATABASE_URL is not set");
    return;
  }

  const client = new pg.Client({
    connectionString,
    connectionTimeoutMillis: 8000,
  });

  try {
    await client.connect();
    const identity = await client.query(
      "select current_database() as database, current_user as role",
    );
    pass(
      "Database connection",
      `${identity.rows[0].database} as ${identity.rows[0].role}`,
    );

    const tables = await client.query(
      `select
         to_regclass('guide_app.venue_instagram_posts') as posts,
         to_regclass('guide_app.venue_articles') as articles`,
    );
    const row = tables.rows[0];

    if (!row.posts || !row.articles) {
      const missing = [];
      if (!row.posts) missing.push("guide_app.venue_instagram_posts");
      if (!row.articles) missing.push("guide_app.venue_articles");
      fail(
        "Migration 033",
        `missing table(s): ${missing.join(", ")}. Run node scripts/run-guide-migration.mjs`,
      );
    } else {
      pass("Migration 033", "content tables are present");
    }
  } catch (error) {
    fail("Database connection", error.message);
  } finally {
    await client.end().catch(() => {});
  }
}

function checkAuth() {
  if (!process.env.GUIDE_ADMIN_PASSWORD) {
    fail(
      "Admin password",
      "GUIDE_ADMIN_PASSWORD is not set. The statistics API returns 401 without it.",
    );
  } else {
    pass("Admin password", "GUIDE_ADMIN_PASSWORD is configured");
  }

  if (process.env.VENUE_STATS_AUTH_DISABLED === "1") {
    const context = String(process.env.CONTEXT || "").trim();
    if (context && context !== "dev" && context !== "development") {
      warn(
        "Preview bypass",
        `VENUE_STATS_AUTH_DISABLED=1 is set but ignored because CONTEXT=${context}`,
      );
    } else {
      warn(
        "Preview bypass",
        "VENUE_STATS_AUTH_DISABLED=1 is active in this environment",
      );
    }
  }
}

const symbols = { pass: "✓", warn: "!", fail: "✗" };

console.log("Venue performance statistics — pre-flight check\n");

checkRegistry();
await checkGa4();
await checkDatabase();
checkAuth();

for (const result of results) {
  console.log(
    `${symbols[result.level]} ${result.label}${result.detail ? ` — ${result.detail}` : ""}`,
  );
}

const failures = results.filter((result) => result.level === "fail").length;
const warnings = results.filter((result) => result.level === "warn").length;

console.log(
  `\n${results.length - failures - warnings} passed, ${warnings} warning(s), ${failures} failure(s)`,
);

process.exit(failures ? 1 : 0);
