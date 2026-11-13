import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { INSTAGRAM_SYNC_LOCK_ID } from "../lib/venue-stats-db.js";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath) {
  return readFileSync(join(ROOT, relativePath), "utf8");
}

function sourceBetween(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  assert.notEqual(start, -1, `${startMarker} must exist`);
  const end = source.indexOf(endMarker, start + startMarker.length);
  assert.notEqual(end, -1, `${endMarker} must follow ${startMarker}`);
  return source.slice(start, end);
}

const migration = read("migrations/034_create_instagram_sync.sql");
const dbSource = read("lib/venue-stats-db.js");
const migrationRunner = read("scripts/run-guide-migration.mjs");
const checkScript = read("scripts/check-venue-stats.mjs");

/* ------------------------------------------------------------------ */
/* Lock identity                                                       */
/* ------------------------------------------------------------------ */

test("the Instagram sync advisory lock uses the dedicated id 734001", () => {
  assert.equal(INSTAGRAM_SYNC_LOCK_ID, 734001);
  assert.match(dbSource, /INSTAGRAM_SYNC_LOCK_ID\s*=\s*734001/);
});

/* ------------------------------------------------------------------ */
/* Migration structure                                                 */
/* ------------------------------------------------------------------ */

test("migration 034 creates the three Instagram sync tables", () => {
  for (const table of [
    "instagram_media",
    "instagram_media_venues",
    "instagram_sync_runs",
  ]) {
    assert.match(
      migration,
      new RegExp(`CREATE TABLE IF NOT EXISTS guide_app\\.${table}\\b`),
      `${table} must be created`,
    );
  }
});

test("synced media has unique ids, nullable metrics and separate metric timestamps", () => {
  assert.match(migration, /ig_media_id\s+TEXT NOT NULL/);
  assert.match(
    migration,
    /CONSTRAINT instagram_media_ig_media_id_unique\s+UNIQUE \(ig_media_id\)/,
  );

  for (const metric of [
    "views",
    "reach",
    "likes",
    "comments",
    "shares",
    "saves",
  ]) {
    assert.match(
      migration,
      new RegExp(`${metric}\\s+BIGINT`),
      `${metric} must be a nullable BIGINT`,
    );
  }

  assert.match(migration, /metrics_fetched_at\s+TIMESTAMPTZ/);
  assert.match(migration, /metrics_captured_at\s+TIMESTAMPTZ/);

  assert.match(
    migration,
    /CONSTRAINT instagram_media_metrics_status_check[\s\S]*?'pending'[\s\S]*?'ok'[\s\S]*?'partial'[\s\S]*?'unavailable'[\s\S]*?'error'/,
  );

  assert.match(migration, /story_expires_at\s+TIMESTAMPTZ/);
});

test("venue assignments have a foreign key and a unique media/venue pair", () => {
  assert.match(
    migration,
    /media_id\s+BIGINT NOT NULL\s+REFERENCES guide_app\.instagram_media \(id\) ON DELETE CASCADE/,
  );
  assert.match(
    migration,
    /CONSTRAINT instagram_media_venues_unique\s+UNIQUE \(media_id, venue_key\)/,
  );
  assert.match(
    migration,
    /CREATE INDEX IF NOT EXISTS idx_instagram_media_venues_venue/,
  );
});

test("sync runs enforce allowed statuses and terminal timestamps", () => {
  assert.match(
    migration,
    /CONSTRAINT instagram_sync_runs_status_check[\s\S]*?'running'[\s\S]*?'success'[\s\S]*?'partial'[\s\S]*?'failed'[\s\S]*?'skipped'/,
  );

  assert.match(
    migration,
    /CONSTRAINT instagram_sync_runs_terminal_check[\s\S]*?status = 'running' AND finished_at IS NULL AND duration_ms IS NULL[\s\S]*?status <> 'running' AND finished_at IS NOT NULL AND duration_ms IS NOT NULL/,
  );

  assert.match(migration, /duration_ms\s+INTEGER/);
  assert.match(migration, /account_followers\s+BIGINT/);
  assert.match(migration, /account_media_count\s+BIGINT/);
  assert.match(migration, /account_fetched_at\s+TIMESTAMPTZ/);
});

test("refresh and Story indexes support active, expired and retry selection", () => {
  assert.match(migration, /idx_instagram_media_stories/);
  assert.match(migration, /idx_instagram_media_refresh_due/);
  assert.match(migration, /idx_instagram_media_refresh_retry/);
  assert.match(
    migration,
    /idx_instagram_media_refresh_due[\s\S]*?metrics_captured_at NULLS FIRST/,
  );
  assert.match(
    migration,
    /idx_instagram_media_refresh_retry[\s\S]*?metrics_fetched_at NULLS FIRST/,
  );
  // Partial refresh indexes cannot use NOW(), and excluding Stories would
  // leave active Stories out of the refresh index.
  assert.doesNotMatch(migration, /WHERE story_expires_at IS NULL/);
});

test("migration 034 wraps its DDL in an explicit transaction", () => {
  const schemaStart = migration.indexOf("CREATE SCHEMA");
  assert.notEqual(schemaStart, -1);
  assert.match(migration.slice(0, schemaStart), /\bBEGIN;/);
  assert.match(migration, /COMMIT;\s*$/);
});

test("migration 034 validates media_product_type casing", () => {
  assert.match(migration, /instagram_media_product_type_check/);
  assert.match(migration, /media_product_type = UPPER\(media_product_type\)/);
});

test("migration 034 never alters, deletes or rewrites manual Instagram rows", () => {
  assert.doesNotMatch(
    migration,
    /(?:ALTER|DROP|TRUNCATE)\s+TABLE[^;]*guide_app\.venue_instagram_posts/i,
  );
  assert.doesNotMatch(
    migration,
    /(?:INSERT\s+INTO|UPDATE|DELETE\s+FROM)\s+guide_app\.venue_instagram_posts/i,
  );
  assert.doesNotMatch(
    migration,
    /(?:ALTER|DROP|TRUNCATE)\s+TABLE[^;]*guide_app\.venue_articles/i,
  );
});

/* ------------------------------------------------------------------ */
/* Story retention and timestamp semantics                             */
/* ------------------------------------------------------------------ */

test("Story upsert preserves the existing expiry before using the incoming value", () => {
  assert.match(
    dbSource,
    /story_expires_at\s*=\s*COALESCE\(\s*m\.story_expires_at,\s*EXCLUDED\.story_expires_at\s*\)/s,
  );
});

test("the sync library contains no deletion path for synced media", () => {
  assert.doesNotMatch(
    dbSource,
    /DELETE\s+FROM\s+guide_app\.instagram_media\b/i,
  );
  assert.doesNotMatch(
    dbSource,
    /TRUNCATE\s+(?:TABLE\s+)?guide_app\.instagram_media\b/i,
  );
});

test("failed metric refreshes never write metrics_captured_at or clear metrics", () => {
  const failureBody = sourceBetween(
    dbSource,
    "export async function markInstagramMediaMetricsFailed",
    "/* ------------------------------------------------------------------ */\n/* Venue assignments",
  );

  assert.match(failureBody, /metrics_fetched_at\s*=\s*NOW\(\)/);
  assert.doesNotMatch(failureBody, /metrics_captured_at\s*=/);
  assert.doesNotMatch(failureBody, /\bviews\s*=/);
  assert.doesNotMatch(failureBody, /\breach\s*=/);
});

test("successful metric captures write both fetched and captured timestamps", () => {
  const captureBody = sourceBetween(
    dbSource,
    "export async function saveInstagramMediaMetrics",
    "/*\n * Record a failed or unavailable metrics attempt.",
  );

  assert.match(captureBody, /metrics_fetched_at\s*=\s*NOW\(\)/);
  assert.match(captureBody, /metrics_captured_at\s*=\s*NOW\(\)/);
  assert.match(captureBody, /COALESCE\(\$3, m\.reach\)/);
});

/* ------------------------------------------------------------------ */
/* Advisory lock wiring                                                */
/* ------------------------------------------------------------------ */

test("the advisory lock uses one PoolClient for lock, callback and unlock", () => {
  const lockBody = dbSource.slice(
    dbSource.indexOf("export async function withInstagramSyncLock"),
  );
  assert.notEqual(lockBody.indexOf("export async function"), -1);
  assert.equal(
    lockBody.indexOf("export async function"),
    0,
    "withInstagramSyncLock must be the final exported function",
  );

  assert.match(lockBody, /getPool\(\)\.connect\(\)/);
  assert.match(lockBody, /SELECT pg_try_advisory_lock\(\$1\) AS locked/);
  assert.match(lockBody, /callback\(restricted\.client\)/);
  assert.match(lockBody, /SELECT pg_advisory_unlock\(\$1\) AS unlocked/);
  assert.match(lockBody, /releaseClient\(rawClient, destroy\)/);
  assert.doesNotMatch(lockBody, /getPool\(\)\.query/);
  assert.doesNotMatch(lockBody, /pool\.query/);

  assert.match(dbSource, /function createRestrictedSyncClient/);
  assert.match(dbSource, /Object\.freeze/);
  assert.match(dbSource, /assertSyncClient\(client, "startInstagramSyncRun"\)/);
  assert.match(
    dbSource,
    /assertSyncClient\(client, "finaliseInstagramSyncRun"\)/,
  );
});

test("the database module does not export the pool or connection string", () => {
  assert.doesNotMatch(dbSource, /export\s+(?:const|let|var)\s+pool\b/);
  assert.doesNotMatch(dbSource, /export\s*\{[^}]*\bpool\b[^}]*\}/);
  assert.doesNotMatch(dbSource, /export\s+function\s+getPool\b/);
  assert.match(dbSource, /export async function withVenueStatsClient/);
});

/* ------------------------------------------------------------------ */
/* Migration wiring                                                    */
/* ------------------------------------------------------------------ */

test("the migration runner includes migration 034", () => {
  assert.match(migrationRunner, /"034_create_instagram_sync\.sql"/);
});

test("check:venue-stats recognises migration 034 tables", () => {
  assert.match(checkScript, /"instagram_media"/);
  assert.match(checkScript, /"instagram_media_venues"/);
  assert.match(checkScript, /"instagram_sync_runs"/);
  assert.match(checkScript, /Migration 034/);
});

test("check:venue-stats verifies columns, constraints and foreign keys", () => {
  assert.match(checkScript, /information_schema\.columns/);
  assert.match(checkScript, /pg_constraint/);
  assert.match(checkScript, /pg_indexes/);
  assert.match(checkScript, /ON DELETE CASCADE/);
  assert.match(checkScript, /instagram_media_product_type_check/);
  assert.match(checkScript, /instagram_sync_runs_terminal_check/);
});

test("the integration suite never truncates manual content tables", () => {
  const integration = read("tests/instagram-sync-db.test.js");
  const truncateBlocks = integration.match(/TRUNCATE[\s\S]*?`/g) || [];
  assert.ok(truncateBlocks.length > 0, "expected a test cleanup TRUNCATE");

  for (const block of truncateBlocks) {
    assert.doesNotMatch(block, /venue_instagram_posts/);
    assert.doesNotMatch(block, /venue_articles/);
  }

  assert.match(integration, /ALLOW_INSTAGRAM_DB_TESTS/);
  assert.match(integration, /NODE_ENV/);
  assert.match(integration, /process\.env\.CONTEXT/);
  assert.match(integration, /INSTAGRAM_TEST_DATABASE_HOSTS/);
});
