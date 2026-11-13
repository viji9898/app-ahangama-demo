import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import process from "node:process";
import { dirname, join } from "node:path";
import { after, before, beforeEach, describe, test } from "node:test";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { persistInstagramRetrieval } from "../lib/instagram-sync-persistence.js";
import {
  INSTAGRAM_SYNC_LOCK_ID,
  assignInstagramMediaToVenues,
  closeVenueStatsPool,
  deleteInstagramPost,
  finaliseInstagramSyncRun,
  getInstagramMediaByIgId,
  getInstagramMediaRefreshQueue,
  getInstagramSyncStatus,
  listActiveInstagramStories,
  listExpiredInstagramStories,
  listInstagramMedia,
  listInstagramMediaVenues,
  listInstagramPosts,
  listInstagramSyncRuns,
  markInstagramMediaMetricsFailed,
  reconcileStaleInstagramSyncRuns,
  recordSkippedInstagramSyncRun,
  removeInstagramMediaFromVenue,
  saveInstagramMediaMetrics,
  saveInstagramPost,
  startInstagramSyncRun,
  upsertInstagramMedia,
  withInstagramSyncLock,
} from "../lib/venue-stats-db.js";

/* ------------------------------------------------------------------ */
/* Safety guard                                                        */
/* ------------------------------------------------------------------ */

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TEST_URL = process.env.INSTAGRAM_TEST_DATABASE_URL || "";
const ALLOW_DB_TESTS = process.env.ALLOW_INSTAGRAM_DB_TESTS === "1";

/*
 * Explicit safety policy. The integration suite only runs against a
 * disposable target that satisfies every check below; anything unrecognised
 * is skipped rather than guessed at.
 */
const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
const SAFE_TEST_NAME_PATTERN =
  /(^|[-_.])(test|tests|testing|ci|dev|development|staging)([-_.]|$)/i;
const PRODUCTION_NAME_PATTERN =
  /(^|[-_.])(prod|production|live|primary|main)([-_.]|$)/i;

const createdManualPostIds = new Set();

function persistenceItem({
  igMediaId,
  mediaType = "IMAGE",
  mediaProductType = "FEED",
  caption = `caption ${igMediaId}`,
  permalink = `https://www.instagram.com/p/${igMediaId}/`,
  mediaUrl = `https://cdn.example.test/${igMediaId}.jpg`,
  thumbnailUrl = null,
  postedAt = "2026-11-01T10:00:00.000Z",
  storyExpiresAt = null,
  insights = {},
  insightStatus = "ok",
  insightErrors = [],
} = {}) {
  return {
    media: {
      igMediaId,
      mediaType,
      mediaProductType,
      caption,
      permalink,
      mediaUrl,
      thumbnailUrl,
      postedAt,
      storyExpiresAt,
      username: "ahangamacom",
      likeCount: 10,
      commentsCount: 2,
      children: [],
    },
    insights: {
      views: 100,
      reach: 80,
      likes: 12,
      comments: 3,
      shares: 2,
      saves: 4,
      ...insights,
    },
    insightState: {
      status: insightStatus,
      supported: [],
      unavailable: [],
      errors: insightErrors,
    },
    retrievedAt: "2026-11-13T08:00:00.000Z",
    metricsFetchedAt: "2026-11-13T08:00:01.000Z",
    metricsCapturedAt:
      insightStatus === "ok" || insightStatus === "partial"
        ? "2026-11-13T08:00:01.000Z"
        : null,
  };
}

function persistenceRetrieval({
  mediaItems = [],
  storyItems = [],
  mediaOk = true,
  storiesOk = true,
  mediaError = null,
  storiesError = null,
} = {}) {
  return {
    ok: mediaOk && storiesOk,
    retrievedAt: "2026-11-13T08:00:00.000Z",
    media: {
      ok: mediaOk,
      items: mediaItems,
      counts: { total: mediaItems.length },
      error: mediaError,
    },
    stories: {
      ok: storiesOk,
      items: storyItems,
      counts: { total: storyItems.length },
      error: storiesError,
    },
  };
}

const MIGRATION_033 = readFileSync(
  join(ROOT, "migrations/033_create_venue_stats_content.sql"),
  "utf8",
);
const MIGRATION_034 = readFileSync(
  join(ROOT, "migrations/034_create_instagram_sync.sql"),
  "utf8",
);

function databaseName(url) {
  try {
    return decodeURIComponent(new URL(url).pathname.replace(/^\//, ""));
  } catch {
    return "";
  }
}

function validateDatabaseName(name) {
  if (!name) {
    return "refusing a connection whose database name cannot be determined";
  }
  if (PRODUCTION_NAME_PATTERN.test(name)) {
    return `refusing production-like database "${name}"`;
  }
  if (!SAFE_TEST_NAME_PATTERN.test(name)) {
    return `refusing database "${name}"; it must contain a test, staging, ci or dev segment`;
  }
  return false;
}

function allowedTestHosts() {
  const extra = String(process.env.INSTAGRAM_TEST_DATABASE_HOSTS || "")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
  return new Set([...LOOPBACK_HOSTS, ...extra]);
}

function validateTestTarget(rawUrl) {
  if (!rawUrl) {
    return "INSTAGRAM_TEST_DATABASE_URL is not set";
  }
  if (!ALLOW_DB_TESTS) {
    return "set ALLOW_INSTAGRAM_DB_TESTS=1 to run real PostgreSQL tests";
  }

  if (String(process.env.NODE_ENV || "").toLowerCase() === "production") {
    return "refusing to run with NODE_ENV=production";
  }
  if (String(process.env.CONTEXT || "").toLowerCase() === "production") {
    return "refusing to run in a production context";
  }
  if (
    rawUrl === process.env.DATABASE_URL ||
    rawUrl === process.env.VENUE_STATS_DATABASE_URL
  ) {
    return "refusing the configured application database";
  }

  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    return "INSTAGRAM_TEST_DATABASE_URL is not a valid URL";
  }
  if (!/^postgres(ql)?:$/.test(url.protocol)) {
    return "INSTAGRAM_TEST_DATABASE_URL must use the postgres:// or postgresql:// scheme";
  }

  const nameReason = validateDatabaseName(databaseName(rawUrl));
  if (nameReason) return nameReason;

  const host = url.hostname.toLowerCase();
  if (!host) {
    return "refusing a connection without an explicit host";
  }
  if (host.includes("prod")) {
    return `refusing production-like host "${host}"`;
  }
  if (!allowedTestHosts().has(host)) {
    return `refusing host "${host}"; allow only loopback or explicit INSTAGRAM_TEST_DATABASE_HOSTS entries`;
  }

  return false;
}

const skipReason = validateTestTarget(TEST_URL);

/* ------------------------------------------------------------------ */
/* Integration suite                                                   */
/* ------------------------------------------------------------------ */

describe(
  "Instagram sync database foundation (real PostgreSQL)",
  { skip: skipReason },
  () => {
    let admin;

    async function waitForBackendGone(pid, timeoutMs = 3000) {
      const deadline = Date.now() + timeoutMs;
      while (Date.now() < deadline) {
        const result = await admin.query(
          "SELECT COUNT(*)::int AS count FROM pg_stat_activity WHERE pid = $1",
          [pid],
        );
        if (result.rows[0].count === 0) return;
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      assert.fail(`backend ${pid} was not destroyed`);
    }

    async function insertSyncRun({
      status = "success",
      startedAt,
      finishedAt,
      durationMs = 60000,
      accountFollowers = null,
      accountMediaCount = null,
      accountFetchedAt = null,
    }) {
      const started = startedAt || new Date(Date.now() - durationMs).toISOString();
      const finished = finishedAt || new Date().toISOString();
      const result = await admin.query(
        `INSERT INTO guide_app.instagram_sync_runs (
           trigger_source,
           status,
           started_at,
           finished_at,
           duration_ms,
           account_followers,
           account_media_count,
           account_fetched_at
         )
         VALUES ('test', $1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          status,
          started,
          finished,
          durationMs,
          accountFollowers,
          accountMediaCount,
          accountFetchedAt,
        ],
      );
      return result.rows[0];
    }

    before(async () => {
      admin = new pg.Client({
        connectionString: TEST_URL,
        connectionTimeoutMillis: 8000,
      });
      await admin.connect();

      const identity = await admin.query(
        "SELECT current_database() AS name",
      );
      const nameReason = validateDatabaseName(String(identity.rows[0].name));
      assert.equal(nameReason, false, nameReason || "");

      // The pool reads this lazily, so setting it after the safety check keeps
      // every library call inside the disposable test database.
      process.env.VENUE_STATS_DATABASE_URL = TEST_URL;

      await admin.query(MIGRATION_033);
      await admin.query(MIGRATION_034);
    });

    beforeEach(async () => {
      // Only tables owned by this suite are cleared. Manual Instagram posts and
      // articles are deliberately excluded: pre-existing content must survive,
      // and individual tests remove the rows they create.
      await admin.query(
        `TRUNCATE
           guide_app.instagram_media_venues,
           guide_app.instagram_media,
           guide_app.instagram_sync_runs
         RESTART IDENTITY CASCADE`,
      );
    });

    after(async () => {
      if (admin) {
        for (const id of createdManualPostIds) {
          await admin
            .query(
              "DELETE FROM guide_app.venue_instagram_posts WHERE id = $1",
              [id],
            )
            .catch(() => {});
        }
      }
      createdManualPostIds.clear();
      await closeVenueStatsPool();
      if (admin) await admin.end();
      delete process.env.VENUE_STATS_DATABASE_URL;
    });

    /* -------------------------------------------------------------- */
    /* Advisory lock                                                   */
    /* -------------------------------------------------------------- */

    test("acquires and releases the advisory lock on the callback client", async () => {
      let backendPid = null;

      const result = await withInstagramSyncLock(async (client) => {
        assert.equal(typeof client.query, "function");
        assert.equal(client.release, undefined);
        assert.equal(client.end, undefined);
        assert.equal(Object.isFrozen(client), true);

        const identity = await client.query(
          "SELECT pg_backend_pid() AS pid",
        );
        backendPid = Number(identity.rows[0].pid);

        const held = await client.query(
          `SELECT COUNT(*)::int AS held
           FROM pg_locks
           WHERE locktype = 'advisory'
             AND objid = $1
             AND pid = pg_backend_pid()`,
          [INSTAGRAM_SYNC_LOCK_ID],
        );

        assert.equal(held.rows[0].held, 1);
        return "same-client";
      });

      assert.deepEqual(result, { acquired: true, result: "same-client" });
      assert.ok(Number.isInteger(backendPid));

      const probe = await admin.query(
        "SELECT pg_try_advisory_lock($1) AS locked",
        [INSTAGRAM_SYNC_LOCK_ID],
      );
      assert.equal(probe.rows[0].locked, true);
      await admin.query("SELECT pg_advisory_unlock($1)", [
        INSTAGRAM_SYNC_LOCK_ID,
      ]);
    });

    test("overlapping sync attempts do not run concurrently", async () => {
      let signalStarted;
      const started = new Promise((resolve) => {
        signalStarted = resolve;
      });
      let releaseFirst;
      const gate = new Promise((resolve) => {
        releaseFirst = resolve;
      });

      const first = withInstagramSyncLock(async () => {
        signalStarted();
        await gate;
        return "first";
      });

      await started;

      const second = await withInstagramSyncLock(async () => "second");
      assert.equal(second.acquired, false);

      releaseFirst();
      assert.deepEqual(await first, { acquired: true, result: "first" });

      const third = await withInstagramSyncLock(async () => "third");
      assert.deepEqual(third, { acquired: true, result: "third" });
    });

    test("a throwing callback still releases the lock and connection", async () => {
      await assert.rejects(
        withInstagramSyncLock(async () => {
          throw new Error("boom");
        }),
        /boom/,
      );

      const probe = await admin.query(
        "SELECT pg_try_advisory_lock($1) AS locked",
        [INSTAGRAM_SYNC_LOCK_ID],
      );
      assert.equal(probe.rows[0].locked, true);
      await admin.query("SELECT pg_advisory_unlock($1)", [
        INSTAGRAM_SYNC_LOCK_ID,
      ]);

      const next = await withInstagramSyncLock(async () => "next");
      assert.deepEqual(next, { acquired: true, result: "next" });
    });

    test("an unconfirmed unlock destroys the connection and a later attempt succeeds", async () => {
      let backendPid = null;
      const originalError = console.error;
      console.error = () => {};

      try {
        const result = await withInstagramSyncLock(async (client) => {
          const identity = await client.query("SELECT pg_backend_pid() AS pid");
          backendPid = Number(identity.rows[0].pid);

          // Simulate a lost lock: release it before the wrapper's own unlock.
          const unlocked = await client.query(
            "SELECT pg_advisory_unlock($1) AS unlocked",
            [INSTAGRAM_SYNC_LOCK_ID],
          );
          assert.equal(unlocked.rows[0].unlocked, true);
          return "unlock-returned-false";
        });

        assert.deepEqual(result, {
          acquired: true,
          result: "unlock-returned-false",
        });
        await waitForBackendGone(backendPid);
      } finally {
        console.error = originalError;
      }

      const next = await withInstagramSyncLock(
        async () => "after-unlock-failure",
      );
      assert.deepEqual(next, {
        acquired: true,
        result: "after-unlock-failure",
      });
    });

    test("an unlock error destroys the connection and a later attempt succeeds", async () => {
      let backendPid = null;
      const originalError = console.error;
      const originalQuery = pg.Client.prototype.query;
      console.error = () => {};

      // Simulate a failed unlock without killing the backend from outside:
      // an external termination emits late socket errors outside the test's
      // async scope. Forcing only the unlock query to throw exercises the same
      // destroy-on-unconfirmed-unlock path deterministically.
      pg.Client.prototype.query = function query(sql, params) {
        if (typeof sql === "string" && sql.includes("pg_advisory_unlock")) {
          throw new Error("forced unlock failure");
        }
        return originalQuery.call(this, sql, params);
      };

      try {
        const result = await withInstagramSyncLock(async (client) => {
          const identity = await client.query("SELECT pg_backend_pid() AS pid");
          backendPid = Number(identity.rows[0].pid);
          return "unlock-threw";
        });

        assert.deepEqual(result, { acquired: true, result: "unlock-threw" });
        await waitForBackendGone(backendPid);
      } finally {
        pg.Client.prototype.query = originalQuery;
        console.error = originalError;
      }

      const next = await withInstagramSyncLock(async () => "after-unlock-error");
      assert.deepEqual(next, { acquired: true, result: "after-unlock-error" });
    });

    test("sync lifecycle writes inside the lock must use the bound client", async () => {
      const result = await withInstagramSyncLock(async (client) => {
        await assert.rejects(
          startInstagramSyncRun({ triggerSource: "manual" }),
          /must use the client provided by withInstagramSyncLock/,
        );
        await assert.rejects(
          recordSkippedInstagramSyncRun(),
          /must use the client provided by withInstagramSyncLock/,
        );
        await assert.rejects(
          finaliseInstagramSyncRun(1, { status: "success" }),
          /must use the client provided by withInstagramSyncLock/,
        );
        await assert.rejects(
          reconcileStaleInstagramSyncRuns(),
          /must use the client provided by withInstagramSyncLock/,
        );

        const run = await startInstagramSyncRun({
          triggerSource: "manual",
          client,
        });
        const finalised = await finaliseInstagramSyncRun(
          run.id,
          { status: "success" },
          { client },
        );

        assert.equal(finalised.finalised, true);
        assert.equal(finalised.run.status, "success");
        return "bound";
      });

      assert.deepEqual(result, { acquired: true, result: "bound" });

      const status = await getInstagramSyncStatus();
      assert.equal(status.latestRun.status, "success");
    });

    /* -------------------------------------------------------------- */
    /* Schema constraints                                              */
    /* -------------------------------------------------------------- */

    test("run status and terminal timestamp constraints are enforced", async () => {
      for (const status of ["success", "partial", "failed", "skipped"]) {
        await admin.query(
          `INSERT INTO guide_app.instagram_sync_runs
             (status, finished_at, duration_ms)
           VALUES ($1, NOW(), 10)`,
          [status],
        );
      }

      await assert.rejects(
        admin.query(
          `INSERT INTO guide_app.instagram_sync_runs
             (status, finished_at, duration_ms)
           VALUES ('queued', NOW(), 10)`,
        ),
        /instagram_sync_runs_status_check/,
      );

      await assert.rejects(
        admin.query(
          `INSERT INTO guide_app.instagram_sync_runs
             (status, finished_at, duration_ms)
           VALUES ('running', NOW(), 10)`,
        ),
        /instagram_sync_runs_terminal_check/,
      );

      await assert.rejects(
        admin.query(
          "INSERT INTO guide_app.instagram_sync_runs (status) VALUES ('success')",
        ),
        /instagram_sync_runs_terminal_check/,
      );

      await assert.rejects(
        admin.query(
          `INSERT INTO guide_app.instagram_sync_runs
             (status, finished_at)
           VALUES ('failed', NOW())`,
        ),
        /instagram_sync_runs_terminal_check/,
      );
    });

    test("media, metric and venue assignment constraints are enforced", async () => {
      await admin.query(
        "INSERT INTO guide_app.instagram_media (ig_media_id) VALUES ('duplicate')",
      );

      await assert.rejects(
        admin.query(
          "INSERT INTO guide_app.instagram_media (ig_media_id) VALUES ('duplicate')",
        ),
        /instagram_media_ig_media_id_unique/,
      );

      await assert.rejects(
        admin.query(
          `INSERT INTO guide_app.instagram_media (ig_media_id, metrics_status)
           VALUES ('bad-status', 'queued')`,
        ),
        /instagram_media_metrics_status_check/,
      );

      await assert.rejects(
        admin.query(
          `INSERT INTO guide_app.instagram_media
             (ig_media_id, media_product_type)
           VALUES ('lowercase-product-type', 'story')`,
        ),
        /instagram_media_product_type_check/,
      );

      await assert.rejects(
        admin.query(
          `INSERT INTO guide_app.instagram_media
             (ig_media_id, media_product_type)
           VALUES ('empty-product-type', '')`,
        ),
        /instagram_media_product_type_check/,
      );

      await assert.rejects(
        admin.query(
          `INSERT INTO guide_app.instagram_media (ig_media_id, views)
           VALUES ('negative-metric', -1)`,
        ),
        /instagram_media_metric_values_check/,
      );

      await assert.rejects(
        admin.query(
          `INSERT INTO guide_app.instagram_media_venues (media_id, venue_key)
           VALUES (999999, 'namikaze')`,
        ),
        /foreign key|violates/,
      );
    });

    /* -------------------------------------------------------------- */
    /* Story expiry and retention                                      */
    /* -------------------------------------------------------------- */

    test("Story upsert preserves the first expiry and only fills a null one", async () => {
      const first = await upsertInstagramMedia({
        igMediaId: "story-expiry",
        mediaType: "VIDEO",
        mediaProductType: "STORY",
        postedAt: "2026-11-13T10:00:00Z",
        storyExpiresAt: "2026-11-14T10:00:00Z",
      });

      assert.equal(first.storyExpiresAt, "2026-11-14T10:00:00.000Z");

      const laterDifferent = await upsertInstagramMedia({
        igMediaId: "story-expiry",
        mediaType: "VIDEO",
        mediaProductType: "STORY",
        postedAt: "2026-11-13T10:00:00Z",
        storyExpiresAt: "2026-11-15T10:00:00Z",
      });
      assert.equal(laterDifferent.storyExpiresAt, first.storyExpiresAt);

      const laterMissing = await upsertInstagramMedia({
        igMediaId: "story-expiry",
        mediaType: "VIDEO",
        mediaProductType: "STORY",
        postedAt: "2026-11-13T10:00:00Z",
      });
      assert.equal(laterMissing.storyExpiresAt, first.storyExpiresAt);

      await assert.rejects(
        upsertInstagramMedia({
          igMediaId: "story-missing-timestamps",
          mediaProductType: "STORY",
        }),
        /requires postedAt or storyExpiresAt/,
      );

      await assert.rejects(
        upsertInstagramMedia({
          igMediaId: "story-expiry-without-posted",
          mediaProductType: "STORY",
          storyExpiresAt: "2026-11-14T12:00:00Z",
        }),
        /storyExpiresAt requires postedAt/,
      );

      await assert.rejects(
        upsertInstagramMedia({
          igMediaId: "story-invalid-posted",
          mediaProductType: "STORY",
          postedAt: "not-a-timestamp",
        }),
        /postedAt is not a valid timestamp/,
      );

      await assert.rejects(
        upsertInstagramMedia({
          igMediaId: "story-lowercase-type",
          mediaProductType: "story",
          postedAt: "2026-11-13T10:00:00Z",
        }),
        /mediaProductType must be uppercase/,
      );

      const computed = await upsertInstagramMedia({
        igMediaId: "story-computed-expiry",
        mediaProductType: "STORY",
        postedAt: "2026-11-13T10:00:00Z",
      });
      assert.equal(computed.storyExpiresAt, "2026-11-14T10:00:00.000Z");

      // A legacy row with a NULL expiry can still be filled by a later sync.
      await admin.query(
        `INSERT INTO guide_app.instagram_media
           (ig_media_id, media_product_type, posted_at)
         VALUES ('story-legacy-null', 'STORY', '2026-11-13T12:00:00Z')`,
      );
      const filled = await upsertInstagramMedia({
        igMediaId: "story-legacy-null",
        mediaProductType: "STORY",
        postedAt: "2026-11-13T12:00:00Z",
        storyExpiresAt: "2026-11-14T12:00:00Z",
      });
      assert.equal(filled.storyExpiresAt, "2026-11-14T12:00:00.000Z");
    });

    test("expired Stories are retained and active Stories are refreshed first", async () => {
      const expired = await upsertInstagramMedia({
        igMediaId: "story-expired",
        mediaType: "VIDEO",
        mediaProductType: "STORY",
        postedAt: "2026-11-10T10:00:00Z",
        storyExpiresAt: "2026-11-11T10:00:00Z",
      });
      await saveInstagramMediaMetrics("story-expired", {
        views: 500,
        reach: 300,
        shares: 4,
      });

      await upsertInstagramMedia({
        igMediaId: "story-active",
        mediaType: "VIDEO",
        mediaProductType: "STORY",
        postedAt: "2026-11-13T09:00:00Z",
        storyExpiresAt: "2099-01-01T00:00:00Z",
      });
      await saveInstagramMediaMetrics("story-active", { views: 10, reach: 8 });

      await upsertInstagramMedia({
        igMediaId: "feed-recent",
        mediaType: "IMAGE",
        mediaProductType: "FEED",
        postedAt: "2026-11-01T10:00:00Z",
      });
      await saveInstagramMediaMetrics("feed-recent", { views: 20, reach: 15 });

      await admin.query(
        `UPDATE guide_app.instagram_media
         SET metrics_captured_at = NOW() - INTERVAL '2 days',
             metrics_fetched_at = NOW() - INTERVAL '2 hours'
         WHERE ig_media_id IN ('story-active', 'feed-recent')`,
      );

      const activeStories = await listActiveInstagramStories();
      assert.deepEqual(
        activeStories.map((story) => story.igMediaId),
        ["story-active"],
      );

      const expiredStories = await listExpiredInstagramStories();
      assert.deepEqual(
        expiredStories.map((story) => story.igMediaId),
        ["story-expired"],
      );
      assert.equal(expiredStories[0].metrics.views, 500);
      assert.equal(expiredStories[0].metrics.reach, 300);
      assert.equal(expiredStories[0].storyExpiresAt, expired.storyExpiresAt);

      // Simulate a later sync that no longer returns the expired Story.
      await upsertInstagramMedia({
        igMediaId: "feed-recent",
        mediaType: "IMAGE",
        mediaProductType: "FEED",
        postedAt: "2026-11-01T10:00:00Z",
      });

      const retained = await getInstagramMediaByIgId("story-expired");
      assert.ok(retained);
      assert.equal(retained.storyExpiresAt, expired.storyExpiresAt);
      assert.equal(retained.metrics.views, 500);
      assert.equal(retained.metrics.reach, 300);

      const queue = await getInstagramMediaRefreshQueue({
        limit: 10,
        staleAfterMinutes: 60,
        retryAfterMinutes: 60,
      });
      assert.equal(queue[0].igMediaId, "story-active");
      assert.equal(
        queue.some((media) => media.igMediaId === "story-expired"),
        false,
      );
      assert.equal(
        queue.some((media) => media.igMediaId === "feed-recent"),
        true,
      );

      // A failed active-Story attempt is throttled by metrics_fetched_at.
      await markInstagramMediaMetricsFailed("story-active", {
        status: "error",
        errorCode: "META_TIMEOUT",
        errorMessage: "Timed out while reading Story insights.",
      });

      const throttled = await getInstagramMediaRefreshQueue({
        limit: 10,
        staleAfterMinutes: 0,
        retryAfterMinutes: 60,
      });
      assert.equal(
        throttled.some((media) => media.igMediaId === "story-active"),
        false,
      );

      await admin.query(
        `UPDATE guide_app.instagram_media
         SET metrics_fetched_at = NOW() - INTERVAL '2 hours'
         WHERE ig_media_id = 'story-active'`,
      );

      const retried = await getInstagramMediaRefreshQueue({
        limit: 10,
        staleAfterMinutes: 0,
        retryAfterMinutes: 60,
      });
      assert.equal(retried[0].igMediaId, "story-active");
    });

    /* -------------------------------------------------------------- */
    /* Metric timestamps                                               */
    /* -------------------------------------------------------------- */

    test("failed metric refreshes only advance the attempt timestamp", async () => {
      await upsertInstagramMedia({
        igMediaId: "feed-metrics",
        mediaType: "IMAGE",
        mediaProductType: "FEED",
        postedAt: "2026-11-01T10:00:00Z",
      });

      const captured = await saveInstagramMediaMetrics("feed-metrics", {
        views: 100,
        reach: 50,
        likes: 10,
      });
      assert.equal(captured.metricsStatus, "ok");
      assert.ok(captured.metricsCapturedAt);
      assert.ok(captured.metricsFetchedAt);

      const oldCaptured = "2026-11-01T00:00:00.000Z";
      const oldFetched = "2026-11-10T00:00:00.000Z";
      await admin.query(
        `UPDATE guide_app.instagram_media
         SET metrics_captured_at = $2, metrics_fetched_at = $3
         WHERE ig_media_id = $1`,
        ["feed-metrics", oldCaptured, oldFetched],
      );

      const token = "EAAfake-system-user-token-0000000000";
      const failed = await markInstagramMediaMetricsFailed("feed-metrics", {
        status: "error",
        errorCode: "META_TOKEN_EXPIRED",
        errorMessage: `Invalid OAuth token ${token} ?access_token=${token}`,
      });

      assert.equal(failed.metricsStatus, "error");
      assert.equal(failed.metrics.views, 100);
      assert.equal(failed.metrics.reach, 50);
      assert.equal(failed.metrics.likes, 10);
      assert.equal(failed.metricsCapturedAt, oldCaptured);
      assert.ok(
        new Date(failed.metricsFetchedAt) > new Date(oldFetched),
        "the failed attempt must advance metrics_fetched_at",
      );
      assert.equal(failed.metricsErrorMessage.includes(token), false);
      assert.match(failed.metricsErrorMessage, /\[redacted\]/);
    });

    test("partial captures advance both timestamps and preserve missing metrics", async () => {
      await upsertInstagramMedia({
        igMediaId: "feed-partial",
        mediaType: "IMAGE",
        mediaProductType: "FEED",
        postedAt: "2026-11-01T10:00:00Z",
      });
      await saveInstagramMediaMetrics("feed-partial", {
        views: 100,
        reach: 50,
      });

      const oldCaptured = "2026-11-01T00:00:00.000Z";
      const oldFetched = "2026-11-10T00:00:00.000Z";
      await admin.query(
        `UPDATE guide_app.instagram_media
         SET metrics_captured_at = $2, metrics_fetched_at = $3
         WHERE ig_media_id = $1`,
        ["feed-partial", oldCaptured, oldFetched],
      );

      const partial = await saveInstagramMediaMetrics(
        "feed-partial",
        { views: null, reach: 75 },
        { status: "partial" },
      );

      assert.equal(partial.metricsStatus, "partial");
      assert.equal(partial.metrics.views, 100);
      assert.equal(partial.metrics.reach, 75);
      assert.ok(new Date(partial.metricsCapturedAt) > new Date(oldCaptured));
      assert.ok(new Date(partial.metricsFetchedAt) > new Date(oldFetched));
    });

    test("an empty insights response advances only the attempt timestamp", async () => {
      await upsertInstagramMedia({
        igMediaId: "feed-empty",
        mediaType: "IMAGE",
        mediaProductType: "FEED",
        postedAt: "2026-11-01T10:00:00Z",
      });

      const empty = await saveInstagramMediaMetrics("feed-empty", {
        views: null,
        reach: null,
        likes: null,
        comments: null,
        shares: null,
        saves: null,
      });

      assert.equal(empty.metricsStatus, "unavailable");
      assert.equal(empty.metricsCapturedAt, null);
      assert.ok(empty.metricsFetchedAt);
      assert.equal(empty.metrics.views, null);
    });

    test("an empty capture preserves all previously captured metrics", async () => {
      await upsertInstagramMedia({
        igMediaId: "feed-preserve",
        mediaType: "VIDEO",
        mediaProductType: "REELS",
        postedAt: "2026-11-01T10:00:00Z",
      });

      const captured = await saveInstagramMediaMetrics("feed-preserve", {
        views: 400,
        reach: 250,
        likes: 40,
        comments: 3,
        shares: 2,
        saves: 9,
      });
      assert.ok(captured.metricsCapturedAt);

      const oldCaptured = "2026-11-01T00:00:00.000Z";
      const oldFetched = "2026-11-10T00:00:00.000Z";
      await admin.query(
        `UPDATE guide_app.instagram_media
         SET metrics_captured_at = $2, metrics_fetched_at = $3
         WHERE ig_media_id = $1`,
        ["feed-preserve", oldCaptured, oldFetched],
      );

      const empty = await saveInstagramMediaMetrics("feed-preserve", {
        views: null,
        reach: null,
        likes: null,
        comments: null,
        shares: null,
        saves: null,
      });

      assert.equal(empty.metricsStatus, "unavailable");
      assert.deepEqual(empty.metrics, {
        views: 400,
        reach: 250,
        likes: 40,
        comments: 3,
        shares: 2,
        saves: 9,
      });
      assert.equal(empty.metricsCapturedAt, oldCaptured);
      assert.ok(
        new Date(empty.metricsFetchedAt) > new Date(oldFetched),
        "the empty attempt must still advance metrics_fetched_at",
      );
    });

    test("unsupported metrics statuses are rejected", async () => {
      await upsertInstagramMedia({
        igMediaId: "feed-status",
        mediaType: "IMAGE",
        mediaProductType: "FEED",
        postedAt: "2026-11-01T10:00:00Z",
      });

      await assert.rejects(
        saveInstagramMediaMetrics(
          "feed-status",
          { views: 1 },
          { status: "success" },
        ),
        /Unsupported metrics status/,
      );

      await assert.rejects(
        markInstagramMediaMetricsFailed("feed-status", {
          status: "queued",
        }),
        /Unsupported failed-metrics status/,
      );
    });

    /* -------------------------------------------------------------- */
    /* Sync runs and status                                            */
    /* -------------------------------------------------------------- */

    test("sync runs are finalised once and stale runs never stay running", async () => {
      let status = await getInstagramSyncStatus();
      assert.equal(status.status, "never");

      const running = await startInstagramSyncRun({ triggerSource: "manual" });
      assert.equal(running.status, "running");
      assert.equal(running.finishedAt, null);
      assert.equal(running.durationMs, null);

      const success = await finaliseInstagramSyncRun(running.id, {
        status: "success",
        mediaSeen: 10,
        mediaCreated: 2,
        mediaUpdated: 8,
        storiesSeen: 1,
        insightsAttempted: 5,
        insightsFailed: 0,
        hasMore: false,
        accountFollowers: 1528,
        accountMediaCount: 78,
      });

      assert.equal(success.finalised, true);
      assert.equal(success.run.status, "success");
      assert.ok(success.run.finishedAt);
      assert.ok(success.run.durationMs >= 0);
      assert.equal(success.run.accountFollowers, 1528);
      assert.equal(success.run.accountMediaCount, 78);
      assert.ok(success.run.accountFetchedAt);

      const repeated = await finaliseInstagramSyncRun(running.id, {
        status: "failed",
      });
      assert.equal(repeated.finalised, false);
      assert.equal(repeated.run.status, "success");

      const skipped = await recordSkippedInstagramSyncRun({
        triggerSource: "schedule",
      });
      assert.equal(skipped.status, "skipped");
      assert.ok(skipped.finishedAt);
      assert.equal(skipped.durationMs, 0);

      status = await getInstagramSyncStatus();
      assert.equal(status.lastRunStatus, "skipped");
      assert.ok(status.lastSuccessAt);
      assert.equal(status.accountFollowers, 1528);

      const runs = await listInstagramSyncRuns({ limit: 10 });
      assert.equal(runs.length, 2);
      assert.deepEqual(
        runs.map((run) => run.status),
        ["skipped", "success"],
      );
    });

    test("account counts fall back to the newest successful run that has them", async () => {
      await insertSyncRun({
        status: "success",
        startedAt: "2026-11-10T10:00:00Z",
        finishedAt: "2026-11-10T10:01:00Z",
        accountFollowers: 1000,
        accountMediaCount: 50,
      });
      await insertSyncRun({
        status: "success",
        startedAt: "2026-11-11T10:00:00Z",
        finishedAt: "2026-11-11T10:01:00Z",
        accountFollowers: 2000,
        accountMediaCount: null,
      });
      const newest = await insertSyncRun({
        status: "success",
        startedAt: "2026-11-12T10:00:00Z",
        finishedAt: "2026-11-12T10:01:00Z",
        accountFollowers: null,
        accountMediaCount: null,
      });

      const status = await getInstagramSyncStatus();
      assert.equal(status.status, "success");
      assert.equal(
        status.lastSuccessAt,
        new Date(newest.finished_at).toISOString(),
      );
      assert.equal(status.accountFollowers, 2000);
      assert.equal(status.accountMediaCount, 50);
      assert.equal(status.latestRun.id, Number(newest.id));
    });

    test("stale running runs are shown as failed and then reconciled", async () => {
      const staleStarted = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const stale = await admin.query(
        `INSERT INTO guide_app.instagram_sync_runs (status, started_at)
         VALUES ('running', $1)
         RETURNING id`,
        [staleStarted],
      );

      const staleStatus = await getInstagramSyncStatus({
        staleAfterMinutes: 10,
      });
      assert.equal(staleStatus.status, "failed");
      assert.equal(staleStatus.isStale, true);
      assert.equal(staleStatus.errorCode, "SYNC_STALE");
      assert.equal(staleStatus.latestRun.status, "failed");
      assert.equal(staleStatus.latestRun.errorCode, "SYNC_STALE");
      assert.equal(staleStatus.latestRun.isStale, true);

      const stillRunning = await admin.query(
        "SELECT status FROM guide_app.instagram_sync_runs WHERE id = $1",
        [stale.rows[0].id],
      );
      assert.equal(stillRunning.rows[0].status, "running");

      const reconciled = await reconcileStaleInstagramSyncRuns({
        maxAgeMinutes: 10,
      });
      const reconciledStale = reconciled.find(
        (run) => run.id === Number(stale.rows[0].id),
      );

      assert.ok(reconciledStale);
      assert.equal(reconciledStale.status, "failed");
      assert.equal(reconciledStale.errorCode, "SYNC_INTERRUPTED");
      assert.ok(reconciledStale.finishedAt);
      assert.ok(reconciledStale.durationMs > 0);
    });

    test("terminal run errors are redacted and truncated", async () => {
      const run = await startInstagramSyncRun();
      const token = "EAAfake-system-user-token-0000000000";
      const result = await finaliseInstagramSyncRun(run.id, {
        status: "failed",
        errorCode: "meta token expired!",
        errorMessage: `Token ${token} failed with ?access_token=${token} ${"x".repeat(800)}`,
      });

      assert.equal(result.run.errorCode, "META_TOKEN_EXPIRED");
      assert.equal(result.run.errorMessage.includes(token), false);
      assert.match(result.run.errorMessage, /\[redacted\]/);
      assert.ok(result.run.errorMessage.length <= 500);
    });

    test("finalisation rejects a non-terminal status", async () => {
      const run = await startInstagramSyncRun();

      await assert.rejects(
        finaliseInstagramSyncRun(run.id, { status: "running" }),
        /terminal status/,
      );

      const stillRunning = await getInstagramSyncStatus();
      assert.equal(stillRunning.latestRun.status, "running");
    });

    /* -------------------------------------------------------------- */
    /* Phase 2B persistence                                            */
    /* -------------------------------------------------------------- */

    test("persistence inserts once and updates the same media row on repeat syncs", async () => {
      const first = persistenceRetrieval({
        mediaItems: [
          persistenceItem({
            igMediaId: "persist-repeat",
            caption: "first caption",
            thumbnailUrl: "https://cdn.example.test/old.jpg",
            insights: { views: 111 },
          }),
          persistenceItem({
            igMediaId: "persist-carousel",
            mediaType: "CAROUSEL_ALBUM",
          }),
          persistenceItem({
            igMediaId: "persist-reel",
            mediaType: "VIDEO",
            mediaProductType: "REELS",
            thumbnailUrl: "https://cdn.example.test/reel.jpg",
          }),
        ],
        storyItems: [
          persistenceItem({
            igMediaId: "persist-story",
            mediaProductType: "STORY",
            postedAt: "2026-11-12T10:00:00.000Z",
            storyExpiresAt: "2027-01-01T00:00:00.000Z",
          }),
        ],
      });

      const firstResult = await persistInstagramRetrieval(first);
      assert.equal(firstResult.ok, true);
      assert.equal(firstResult.counts.persisted, 4);
      assert.equal(firstResult.counts.metricsCaptured, 4);

      const inserted = await getInstagramMediaByIgId("persist-repeat");
      assert.ok(inserted);
      const databaseId = inserted.id;
      assert.equal(inserted.mediaType, "IMAGE");
      assert.equal(inserted.caption, "first caption");
      assert.equal(inserted.metrics.views, 111);
      assert.equal(inserted.metricsStatus, "ok");
      assert.ok(inserted.metricsFetchedAt);
      assert.ok(inserted.metricsCapturedAt);
      assert.equal(
        (await getInstagramMediaByIgId("persist-carousel")).mediaType,
        "CAROUSEL_ALBUM",
      );
      assert.equal(
        (await getInstagramMediaByIgId("persist-reel")).mediaProductType,
        "REELS",
      );

      const secondResult = await persistInstagramRetrieval(
        persistenceRetrieval({
          mediaItems: [
            persistenceItem({
              igMediaId: "persist-repeat",
              caption: "second caption",
              thumbnailUrl: "https://cdn.example.test/new.jpg",
              insights: { views: 222 },
            }),
          ],
        }),
      );

      assert.equal(secondResult.ok, true);
      const updated = await getInstagramMediaByIgId("persist-repeat");
      assert.equal(updated.id, databaseId);
      assert.equal(updated.caption, "second caption");
      assert.equal(updated.thumbnailUrl, "https://cdn.example.test/new.jpg");
      assert.equal(updated.metrics.views, 222);

      const count = await admin.query(
        `SELECT COUNT(*)::int AS count
         FROM guide_app.instagram_media
         WHERE ig_media_id = $1`,
        ["persist-repeat"],
      );
      assert.equal(count.rows[0].count, 1);
    });

    test("null API metadata never erases stored useful metadata", async () => {
      await persistInstagramRetrieval(
        persistenceRetrieval({
          mediaItems: [
            persistenceItem({
              igMediaId: "persist-null",
              caption: "keep caption",
              mediaUrl: "https://cdn.example.test/keep.jpg",
              thumbnailUrl: "https://cdn.example.test/keep-thumb.jpg",
            }),
          ],
        }),
      );

      await persistInstagramRetrieval(
        persistenceRetrieval({
          mediaItems: [
            persistenceItem({
              igMediaId: "persist-null",
              caption: null,
              mediaUrl: null,
              thumbnailUrl: null,
              permalink: null,
              insights: { views: 250 },
            }),
          ],
        }),
      );

      const row = await getInstagramMediaByIgId("persist-null");
      assert.equal(row.caption, "keep caption");
      assert.equal(row.mediaUrl, "https://cdn.example.test/keep.jpg");
      assert.equal(
        row.thumbnailUrl,
        "https://cdn.example.test/keep-thumb.jpg",
      );
      assert.match(row.permalink, /persist-null/);
      assert.equal(row.metrics.views, 250);
    });

    test("partial insights update available metrics and preserve missing ones", async () => {
      await persistInstagramRetrieval(
        persistenceRetrieval({
          mediaItems: [
            persistenceItem({ igMediaId: "persist-partial" }),
          ],
        }),
      );
      const before = await getInstagramMediaByIgId("persist-partial");
      await new Promise((resolve) => setTimeout(resolve, 25));

      await persistInstagramRetrieval(
        persistenceRetrieval({
          mediaItems: [
            persistenceItem({
              igMediaId: "persist-partial",
              insights: {
                views: 250,
                reach: null,
                likes: null,
                comments: 9,
                shares: null,
                saves: null,
              },
              insightStatus: "partial",
            }),
          ],
        }),
      );

      const row = await getInstagramMediaByIgId("persist-partial");
      assert.equal(row.metricsStatus, "partial");
      assert.equal(row.metrics.views, 250);
      assert.equal(row.metrics.comments, 9);
      assert.equal(row.metrics.reach, 80);
      assert.equal(row.metrics.likes, 12);
      assert.equal(row.metrics.shares, 2);
      assert.equal(row.metrics.saves, 4);
      assert.ok(
        Date.parse(row.metricsCapturedAt) >
          Date.parse(before.metricsCapturedAt),
      );
    });

    test("failed and unavailable insights preserve metrics and captured time", async () => {
      await persistInstagramRetrieval(
        persistenceRetrieval({
          mediaItems: [
            persistenceItem({ igMediaId: "persist-failure" }),
          ],
        }),
      );
      const before = await getInstagramMediaByIgId("persist-failure");
      await new Promise((resolve) => setTimeout(resolve, 25));

      await persistInstagramRetrieval(
        persistenceRetrieval({
          mediaItems: [
            persistenceItem({
              igMediaId: "persist-failure",
              insights: {
                views: null,
                reach: null,
                likes: null,
                comments: null,
                shares: null,
                saves: null,
              },
              insightStatus: "error",
              insightErrors: [
                {
                  code: "META_RATE_LIMITED",
                  message: "Application request limit reached",
                },
              ],
            }),
          ],
        }),
      );

      const failed = await getInstagramMediaByIgId("persist-failure");
      assert.equal(failed.metricsStatus, "error");
      assert.equal(failed.metrics.views, 100);
      assert.equal(failed.metrics.saves, 4);
      assert.equal(failed.metricsCapturedAt, before.metricsCapturedAt);
      assert.ok(
        Date.parse(failed.metricsFetchedAt) > Date.parse(before.metricsFetchedAt),
      );
      assert.equal(failed.metricsErrorCode, "META_RATE_LIMITED");
      assert.match(failed.metricsErrorMessage, /limit reached/);

      await new Promise((resolve) => setTimeout(resolve, 25));
      await persistInstagramRetrieval(
        persistenceRetrieval({
          mediaItems: [
            persistenceItem({
              igMediaId: "persist-failure",
              insights: {
                views: null,
                reach: null,
                likes: null,
                comments: null,
                shares: null,
                saves: null,
              },
              insightStatus: "unavailable",
              insightErrors: [
                {
                  code: "META_INVALID_REQUEST",
                  message: "The metric is not supported.",
                },
              ],
            }),
          ],
        }),
      );

      const unavailable = await getInstagramMediaByIgId("persist-failure");
      assert.equal(unavailable.metricsStatus, "unavailable");
      assert.equal(unavailable.metrics.views, 100);
      assert.equal(unavailable.metricsCapturedAt, before.metricsCapturedAt);
      assert.equal(unavailable.metricsErrorCode, "META_INVALID_REQUEST");
    });

    test("Story expiry is preserved and expired Stories are retained", async () => {
      const active = persistenceItem({
        igMediaId: "persist-story-expiry",
        mediaType: "VIDEO",
        mediaProductType: "STORY",
        postedAt: "2026-11-12T10:00:00.000Z",
        storyExpiresAt: "2027-01-01T00:00:00.000Z",
      });

      await persistInstagramRetrieval(
        persistenceRetrieval({ storyItems: [active] }),
      );
      const first = await getInstagramMediaByIgId("persist-story-expiry");
      assert.equal(first.storyExpiresAt, "2027-01-01T00:00:00.000Z");

      const changed = persistenceItem({
        igMediaId: "persist-story-expiry",
        mediaType: "VIDEO",
        mediaProductType: "STORY",
        caption: "updated story",
        postedAt: "2026-11-12T10:00:00.000Z",
        storyExpiresAt: "2027-02-01T00:00:00.000Z",
        insights: { views: 200 },
      });
      await persistInstagramRetrieval(
        persistenceRetrieval({ storyItems: [changed] }),
      );

      const updated = await getInstagramMediaByIgId("persist-story-expiry");
      assert.equal(updated.storyExpiresAt, "2027-01-01T00:00:00.000Z");
      assert.equal(updated.caption, "updated story");
      assert.equal(updated.metrics.views, 200);

      const expired = persistenceItem({
        igMediaId: "persist-expired-story",
        mediaProductType: "STORY",
        postedAt: "2020-01-01T10:00:00.000Z",
        storyExpiresAt: "2020-01-02T10:00:00.000Z",
        insights: { views: 77 },
      });
      await persistInstagramRetrieval(
        persistenceRetrieval({ storyItems: [expired] }),
      );

      const expiredRow = await getInstagramMediaByIgId(
        "persist-expired-story",
      );
      assert.equal(expiredRow.metrics.views, 77);

      await persistInstagramRetrieval(persistenceRetrieval());

      const retained = await getInstagramMediaByIgId(
        "persist-expired-story",
      );
      assert.equal(retained.metrics.views, 77);
      assert.equal(retained.storyExpiresAt, "2020-01-02T10:00:00.000Z");
      assert.equal(
        (await listExpiredInstagramStories()).some(
          (story) => story.igMediaId === "persist-expired-story",
        ),
        true,
      );
    });

    test("empty retrieval writes nothing and failed collections do not erase rows", async () => {
      const empty = await persistInstagramRetrieval(persistenceRetrieval());
      assert.equal(empty.ok, true);
      assert.equal(empty.counts.persisted, 0);

      await persistInstagramRetrieval(
        persistenceRetrieval({
          mediaItems: [
            persistenceItem({
              igMediaId: "persist-preserve",
              caption: "before failure",
              insights: { views: 42 },
            }),
          ],
        }),
      );

      const failed = await persistInstagramRetrieval(
        persistenceRetrieval({
          mediaOk: false,
          storiesOk: false,
          mediaError: {
            code: "META_TOKEN_EXPIRED",
            message: "Invalid OAuth access token.",
          },
          storiesError: {
            code: "META_TIMEOUT",
            message: "Graph API request timed out.",
          },
        }),
      );

      assert.equal(failed.ok, false);
      assert.equal(failed.media.skipped, true);
      assert.equal(failed.stories.skipped, true);
      assert.equal(failed.errors.length, 2);

      const preserved = await getInstagramMediaByIgId("persist-preserve");
      assert.equal(preserved.caption, "before failure");
      assert.equal(preserved.metrics.views, 42);
    });

    test("media without an insight attempt keeps metrics pending", async () => {
      const result = await persistInstagramRetrieval(
        persistenceRetrieval({
          mediaItems: [
            persistenceItem({
              igMediaId: "persist-no-insights",
              insightStatus: "skipped",
            }),
          ],
        }),
      );

      assert.equal(result.ok, true);
      assert.equal(result.counts.metricsSkipped, 1);
      const row = await getInstagramMediaByIgId("persist-no-insights");
      assert.equal(row.metricsStatus, "pending");
      assert.equal(row.metrics.views, null);
      assert.equal(row.metricsFetchedAt, null);
      assert.equal(row.metricsCapturedAt, null);
    });

    test("persistence leaves manual content and venue assignments untouched", async () => {
      const before = await listInstagramPosts("namikaze");
      const manual = await saveInstagramPost("namikaze", {
        postUrl: "https://www.instagram.com/p/persistence-manual/",
        postDate: "2026-02-01",
        postType: "post",
        reach: 321,
        impressions: 456,
        likes: 12,
        comments: 3,
        shares: 2,
        saves: 1,
        notes: "manual record for persistence isolation",
      });
      createdManualPostIds.add(manual.id);

      try {
        const assigned = await upsertInstagramMedia({
          igMediaId: "persist-assigned",
          mediaType: "IMAGE",
          mediaProductType: "FEED",
          postedAt: "2026-11-01T10:00:00.000Z",
        });
        await assignInstagramMediaToVenues(assigned.id, ["namikaze"]);
        const assignmentsBefore = await listInstagramMediaVenues(assigned.id);
        const manualBefore = (await listInstagramPosts("namikaze")).find(
          (post) => post.id === manual.id,
        );

        const result = await persistInstagramRetrieval(
          persistenceRetrieval({
            mediaItems: [
              persistenceItem({ igMediaId: "persist-unassigned" }),
            ],
            storyItems: [],
          }),
        );
        assert.equal(result.ok, true);

        assert.deepEqual(
          await listInstagramMediaVenues(assigned.id),
          assignmentsBefore,
        );
        assert.deepEqual(
          (await listInstagramPosts("namikaze")).find(
            (post) => post.id === manual.id,
          ),
          manualBefore,
        );

        const unassigned = await getInstagramMediaByIgId(
          "persist-unassigned",
        );
        assert.deepEqual(await listInstagramMediaVenues(unassigned.id), []);
        assert.deepEqual(
          (await listInstagramPosts("namikaze")).filter(
            (post) => post.id !== manual.id,
          ),
          before,
          "pre-existing manual posts must remain unchanged",
        );
      } finally {
        createdManualPostIds.delete(manual.id);
        assert.equal(await deleteInstagramPost("namikaze", manual.id), true);
      }
    });

    /* -------------------------------------------------------------- */
    /* Venue assignment and manual isolation                           */
    /* -------------------------------------------------------------- */

    test("assigns media to venues and rejects unknown media ids", async () => {
      const media = await upsertInstagramMedia({
        igMediaId: "assigned-media",
        mediaType: "IMAGE",
        mediaProductType: "FEED",
        postedAt: "2026-11-01T10:00:00Z",
      });

      const assigned = await assignInstagramMediaToVenues(media.id, [
        "namikaze",
        "little-bang-kitchen",
        "namikaze",
      ]);
      assert.equal(assigned.length, 2);

      const duplicate = await assignInstagramMediaToVenues(media.id, [
        "namikaze",
      ]);
      assert.deepEqual(duplicate, []);

      const venues = await listInstagramMediaVenues(media.id);
      assert.deepEqual(
        venues.map((venue) => venue.venueKey),
        ["little-bang-kitchen", "namikaze"],
      );

      const filtered = await listInstagramMedia({ venueKey: "namikaze" });
      assert.equal(filtered.length, 1);
      assert.equal(filtered[0].igMediaId, "assigned-media");

      assert.equal(
        await removeInstagramMediaFromVenue(media.id, "namikaze"),
        true,
      );
      assert.equal((await listInstagramMediaVenues(media.id)).length, 1);

      await assert.rejects(
        assignInstagramMediaToVenues(999999, ["namikaze"]),
        /foreign key|violates/,
      );
    });

    test("synced media operations leave manual Instagram records untouched", async () => {
      const before = await listInstagramPosts("namikaze");

      const manual = await saveInstagramPost("namikaze", {
        postUrl: "https://www.instagram.com/p/manual-entry/",
        postDate: "2026-01-01",
        postType: "post",
        reach: 123,
        impressions: 200,
        likes: 10,
        comments: 2,
        shares: 1,
        saves: 3,
        notes: "legacy manual record",
      });
      createdManualPostIds.add(manual.id);

      try {
        assert.equal(
          (await listInstagramPosts("namikaze")).length,
          before.length + 1,
        );

        const media = await upsertInstagramMedia({
          igMediaId: "synced-not-manual",
          mediaType: "IMAGE",
          mediaProductType: "FEED",
          postedAt: "2026-11-01T10:00:00Z",
        });
        await assignInstagramMediaToVenues(media.id, ["namikaze"]);

        const run = await startInstagramSyncRun({ triggerSource: "manual" });
        await finaliseInstagramSyncRun(run.id, { status: "success" });

        const after = await listInstagramPosts("namikaze");
        assert.deepEqual(
          after.filter((post) => post.id !== manual.id),
          before,
          "pre-existing manual records must be unchanged",
        );
        assert.deepEqual(
          after.find((post) => post.id === manual.id),
          manual,
          "the manual record created by this test must be unchanged",
        );

        const count = await admin.query(
          `SELECT COUNT(*)::int AS count
           FROM guide_app.venue_instagram_posts
           WHERE id = $1`,
          [manual.id],
        );
        assert.equal(count.rows[0].count, 1);
      } finally {
        createdManualPostIds.delete(manual.id);
        assert.equal(await deleteInstagramPost("namikaze", manual.id), true);
        assert.deepEqual(
          await listInstagramPosts("namikaze"),
          before,
          "cleanup must leave pre-existing manual records in place",
        );
      }
    });
  },
);
