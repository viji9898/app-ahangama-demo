import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { runInstagramSync } from "../lib/instagram-sync-orchestrator.js";

/*
 * Mocked Phase 2C orchestration tests.
 *
 * Every Meta and database dependency is injected, so these tests never call
 * the live Graph API or PostgreSQL. Real SQL and advisory-lock behaviour are
 * covered by tests/instagram-sync-db.test.js.
 */

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function mediaItem(igMediaId, overrides = {}) {
  return {
    media: {
      igMediaId,
      mediaType: "IMAGE",
      mediaProductType: "FEED",
      permalink: `https://www.instagram.com/p/${igMediaId}/`,
      caption: `caption ${igMediaId}`,
      mediaUrl: `https://cdn.example.test/${igMediaId}.jpg`,
      thumbnailUrl: null,
      postedAt: "2026-11-01T10:00:00.000Z",
      storyExpiresAt: null,
      ...overrides,
    },
    insights: null,
    insightState: {
      status: "skipped",
      supported: [],
      unavailable: [],
      errors: [],
      reason: "disabled",
    },
    retrievedAt: "2026-11-13T08:00:00.000Z",
    metricsFetchedAt: null,
    metricsCapturedAt: null,
  };
}

function retrievalFixture({
  mediaItems = [],
  storyItems = [],
  mediaError = null,
  storiesError = null,
  truncated = false,
  notConfigured = false,
} = {}) {
  if (notConfigured) {
    return {
      ok: false,
      readOnly: true,
      retrievedAt: "2026-11-13T08:00:00.000Z",
      media: null,
      stories: null,
      insights: {},
      errors: [
        {
          scope: "account",
          code: "META_NOT_CONFIGURED",
          message: "Meta Instagram credentials are not configured.",
        },
      ],
      warnings: [],
    };
  }

  const collection = (items, error) => ({
    ok: !error,
    items,
    counts: { total: items.length },
    pagination: { truncated },
    error,
  });
  const errors = [];
  if (mediaError) errors.push({ scope: "media", ...mediaError });
  if (storiesError) errors.push({ scope: "stories", ...storiesError });

  return {
    ok: !mediaError && !storiesError,
    readOnly: true,
    retrievedAt: "2026-11-13T08:00:00.000Z",
    media: collection(mediaItems, mediaError),
    stories: collection(storyItems, storiesError),
    insights: {},
    errors,
    warnings: [],
  };
}

function collectionSummary({
  seen = 0,
  created = 0,
  updated = 0,
  failed = 0,
  metricsCaptured = 0,
  metricsFailed = 0,
  metricsSkipped = 0,
  error = null,
  items = [],
} = {}) {
  return {
    ok: failed === 0 && !error,
    skipped: Boolean(error),
    itemsSeen: seen,
    persisted: seen - failed,
    created,
    updated,
    metricsCaptured,
    metricsFailed,
    metricsSkipped,
    failed,
    items,
    error,
  };
}

function discoveryFixture({
  mediaCount = 0,
  storyCount = 0,
  created = mediaCount,
  updated = 0,
  mediaFailed = 0,
  storyFailed = 0,
  errors = [],
} = {}) {
  const media = collectionSummary({
    seen: mediaCount,
    created,
    updated,
    failed: mediaFailed,
    metricsSkipped: mediaCount - mediaFailed,
  });
  const stories = collectionSummary({
    seen: storyCount,
    created: 0,
    updated: storyCount,
    failed: storyFailed,
    metricsSkipped: storyCount - storyFailed,
  });

  return {
    ok: mediaFailed + storyFailed === 0 && errors.length === 0,
    retrievedAt: "2026-11-13T08:00:00.000Z",
    media,
    stories,
    counts: {
      itemsSeen: mediaCount + storyCount,
      persisted: mediaCount + storyCount - mediaFailed - storyFailed,
      created,
      updated: updated + storyCount,
      metricsCaptured: 0,
      metricsFailed: 0,
      metricsSkipped:
        mediaCount + storyCount - mediaFailed - storyFailed,
      failed: mediaFailed + storyFailed,
    },
    errors,
  };
}

function captureResult(status = "ok", { fatal = false, errors = [] } = {}) {
  return {
    insights:
      status === "ok" || status === "partial"
        ? {
            views: 100,
            reach: 80,
            likes: 10,
            comments: 1,
            shares: 2,
            saves: 3,
          }
        : {},
    insightState: {
      status,
      supported: [],
      unavailable: status === "unavailable" ? ["views"] : [],
      errors,
      ...(fatal ? { reason: "META_RATE_LIMITED" } : {}),
    },
    metricsFetchedAt: "2026-11-13T08:00:01.000Z",
    metricsCapturedAt:
      status === "ok" || status === "partial"
        ? "2026-11-13T08:00:01.000Z"
        : null,
    fatal,
  };
}

function persistOne(item) {
  const status = item.insightState.status;
  return collectionSummary({
    seen: 1,
    updated: 1,
    metricsCaptured: status === "ok" || status === "partial" ? 1 : 0,
    metricsFailed:
      status === "error" || status === "unavailable" ? 1 : 0,
    metricsSkipped: status === "skipped" ? 1 : 0,
    items: [
      {
        ok: true,
        igMediaId: item.media.igMediaId,
        databaseId: 1,
        created: false,
        metricsStatus: status,
        error: null,
      },
    ],
  });
}

function harness(overrides = {}) {
  const client = { query: async () => ({ rows: [] }) };
  const calls = {
    withLock: 0,
    reconcile: [],
    start: [],
    finalise: [],
    skipped: [],
    retrieve: [],
    persist: [],
    queue: [],
    capture: [],
    persistCollection: [],
  };
  let clock = 1000;

  const recorders = {
    reconcileRuns: (args) => calls.reconcile.push(args[0]),
    startRun: (args) => calls.start.push(args[0]),
    finaliseRun: (args) =>
      calls.finalise.push({ id: args[0], outcome: args[1], ...args[2] }),
    recordSkippedRun: (args) => calls.skipped.push(args[0]),
    retrieve: (args) => calls.retrieve.push(args[0]),
    persist: (args) =>
      calls.persist.push({ retrieval: args[0], ...args[1] }),
    persistCollection: (args) =>
      calls.persistCollection.push({ collection: args[0], ...args[1] }),
    refreshQueue: (args) => calls.queue.push(args[0]),
    captureInsights: (args) =>
      calls.capture.push({ media: args[0], ...args[1] }),
  };

  const deps = {
    withLock: async (callback) => {
      calls.withLock += 1;
      return { acquired: true, result: await callback(client) };
    },
    reconcileRuns: async (args) => {
      calls.reconcile.push(args);
      return [];
    },
    startRun: async (args) => {
      calls.start.push(args);
      return {
        id: 1,
        status: "running",
        triggerSource: args.triggerSource,
        startedAt: "2026-11-13T08:00:00.000Z",
      };
    },
    finaliseRun: async (id, outcome, options) => {
      calls.finalise.push({ id, outcome, ...options });
      return {
        finalised: true,
        run: {
          id,
          startedAt: "2026-11-13T08:00:00.000Z",
          finishedAt: "2026-11-13T08:00:20.000Z",
          durationMs: 20000,
          ...outcome,
        },
      };
    },
    recordSkippedRun: async (args) => {
      calls.skipped.push(args);
      return {
        id: 2,
        status: "skipped",
        startedAt: "2026-11-13T08:00:00.000Z",
        finishedAt: "2026-11-13T08:00:00.000Z",
        durationMs: 0,
      };
    },
    retrieve: async (args) => {
      calls.retrieve.push(args);
      return retrievalFixture({ mediaItems: [mediaItem("m1")] });
    },
    persist: async (retrieval, options) => {
      calls.persist.push({ retrieval, ...options });
      return discoveryFixture({ mediaCount: 1 });
    },
    persistCollection: async (collection, options) => {
      calls.persistCollection.push({ collection, ...options });
      return persistOne(collection.items[0]);
    },
    refreshQueue: async (args) => {
      calls.queue.push(args);
      return [mediaItem("m1").media];
    },
    captureInsights: async (media, args) => {
      calls.capture.push({ media, ...args });
      return captureResult("ok");
    },
    now: () => clock,
  };

  for (const [name, value] of Object.entries(overrides)) {
    const recorder = recorders[name];
    if (typeof value === "function" && recorder) {
      deps[name] = async (...args) => {
        recorder(args);
        return value(...args);
      };
    } else {
      deps[name] = value;
    }
  }

  return {
    deps,
    calls,
    client,
    setClock: (value) => {
      clock = value;
    },
  };
}

/* ------------------------------------------------------------------ */
/* Lifecycle and success                                               */
/* ------------------------------------------------------------------ */

test("runs discovery, persists metadata, captures bounded insights and finalises success", async () => {
  const { deps, calls, client } = harness();
  const result = await runInstagramSync({}, deps);

  assert.equal(result.ok, true);
  assert.equal(result.status, "success");
  assert.equal(result.skipped, false);
  assert.equal(result.lockAcquired, true);
  assert.equal(calls.withLock, 1);
  assert.equal(calls.retrieve.length, 1);
  assert.equal(calls.retrieve[0].includeInsights, false);
  assert.equal(calls.retrieve[0].maxMediaItems, 1000);
  assert.equal(calls.persist.length, 1);
  assert.equal(calls.persist[0].client, client);
  assert.equal(calls.queue.length, 1);
  assert.equal(calls.queue[0].limit, 11);
  assert.equal(calls.capture.length, 1);
  assert.equal(calls.persistCollection.length, 1);
  assert.equal(calls.persistCollection[0].client, client);
  assert.equal(calls.finalise.length, 1);
  assert.equal(calls.finalise[0].client, client);
  assert.equal(calls.finalise[0].outcome.status, "success");
  assert.equal(calls.finalise[0].outcome.mediaSeen, 1);
  assert.equal(calls.finalise[0].outcome.mediaCreated, 1);
  assert.equal(calls.finalise[0].outcome.mediaUpdated, 0);
  assert.equal(calls.finalise[0].outcome.storiesSeen, 0);
  assert.equal(calls.finalise[0].outcome.insightsAttempted, 1);
  assert.equal(calls.finalise[0].outcome.insightsFailed, 0);
  assert.equal(calls.finalise[0].outcome.hasMore, false);
  assert.equal(result.counts.insightsSucceeded, 1);
  assert.equal(result.collections.media.persisted, 1);
});

test("records a skipped run and writes nothing when the lock is held", async () => {
  const { deps, calls } = harness({
    withLock: async () => ({ acquired: false }),
  });

  const result = await runInstagramSync(
    { triggerSource: "schedule" },
    deps,
  );

  assert.equal(result.ok, false);
  assert.equal(result.skipped, true);
  assert.equal(result.status, "skipped");
  assert.equal(result.lockAcquired, false);
  assert.equal(calls.retrieve.length, 0);
  assert.equal(calls.start.length, 0);
  assert.equal(calls.skipped.length, 1);
  assert.equal(calls.skipped[0].triggerSource, "schedule");
  assert.equal(calls.skipped[0].errorCode, "SYNC_LOCKED");
});

test("reconciles stale runs before starting and keeps every write on the lock client", async () => {
  const { deps, calls, client } = harness();

  await runInstagramSync({ triggerSource: "manual" }, deps);

  assert.equal(calls.reconcile.length, 1);
  assert.equal(calls.reconcile[0].client, client);
  assert.equal(calls.reconcile[0].maxAgeMinutes, 10);
  assert.equal(calls.start[0].client, client);
  assert.equal(calls.start[0].triggerSource, "manual");
  assert.equal(calls.finalise[0].client, client);
});

test("uses the configured trigger source and empty retrieval is a successful no-op", async () => {
  const { deps, calls } = harness({
    retrieve: async () => retrievalFixture(),
    persist: async () => discoveryFixture(),
    refreshQueue: async () => [],
  });

  const result = await runInstagramSync(
    { triggerSource: "manual", maxInsightItems: 0 },
    deps,
  );

  assert.equal(calls.start[0].triggerSource, "manual");
  assert.equal(calls.capture.length, 0);
  assert.equal(result.ok, true);
  assert.equal(result.status, "success");
  assert.equal(result.counts.mediaSeen, 0);
  assert.equal(result.counts.insightsAttempted, 0);
  assert.equal(result.hasMore, false);
});

/* ------------------------------------------------------------------ */
/* Partial failures and insight semantics                              */
/* ------------------------------------------------------------------ */

test("persists media and marks the run partial when Stories fail", async () => {
  const { deps, calls } = harness({
    retrieve: async () =>
      retrievalFixture({
        mediaItems: [mediaItem("m1")],
        mediaError: null,
        storiesError: {
          code: "META_TIMEOUT",
          message: "Graph API request timed out.",
        },
      }),
    persist: async () =>
      discoveryFixture({
        mediaCount: 1,
        errors: [
          {
            scope: "stories",
            code: "META_TIMEOUT",
            message: "Graph API request timed out.",
          },
        ],
      }),
    refreshQueue: async () => [],
  });

  const result = await runInstagramSync({}, deps);

  assert.equal(result.status, "partial");
  assert.equal(result.ok, false);
  assert.equal(calls.persist.length, 1);
  assert.equal(calls.finalise[0].outcome.mediaSeen, 1);
  assert.equal(calls.finalise[0].outcome.errorCode, "META_TIMEOUT");
  assert.equal(
    result.errors.some((error) => error.scope === "stories"),
    true,
  );
});

test("records an insight error without counting unavailable as failed", async () => {
  const failed = harness({
    captureInsights: async () =>
      captureResult("error", {
        errors: [
          {
            code: "META_RATE_LIMITED",
            message: "Application request limit reached",
          },
        ],
      }),
  });
  const failedResult = await runInstagramSync({}, failed.deps);

  assert.equal(failedResult.status, "partial");
  assert.equal(failedResult.counts.insightsAttempted, 1);
  assert.equal(failedResult.counts.insightsFailed, 1);
  assert.equal(
    failed.calls.finalise[0].outcome.errorCode,
    "META_RATE_LIMITED",
  );

  const unavailable = harness({
    captureInsights: async () => captureResult("unavailable"),
  });
  const unavailableResult = await runInstagramSync({}, unavailable.deps);

  assert.equal(unavailableResult.status, "success");
  assert.equal(unavailableResult.counts.insightsAttempted, 1);
  assert.equal(unavailableResult.counts.insightsUnavailable, 1);
  assert.equal(unavailableResult.counts.insightsFailed, 0);
  assert.equal(unavailable.calls.finalise[0].outcome.insightsFailed, 0);
});

test("a partial insight capture marks the run partial", async () => {
  const { deps, calls } = harness({
    captureInsights: async () => captureResult("partial"),
  });

  const result = await runInstagramSync({}, deps);

  assert.equal(result.status, "partial");
  assert.equal(result.counts.insightsPartial, 1);
  assert.equal(calls.finalise[0].outcome.insightsFailed, 0);
});

test("stops after a fatal Meta error and leaves remaining work for later", async () => {
  const { deps, calls } = harness({
    retrieve: async () =>
      retrievalFixture({
        mediaItems: [mediaItem("m1"), mediaItem("m2"), mediaItem("m3")],
      }),
    persist: async () => discoveryFixture({ mediaCount: 3 }),
    refreshQueue: async () => [
      mediaItem("m1").media,
      mediaItem("m2").media,
      mediaItem("m3").media,
    ],
    captureInsights: async () =>
      captureResult("error", {
        fatal: true,
        errors: [
          {
            code: "META_RATE_LIMITED",
            message: "Application request limit reached",
          },
        ],
      }),
  });

  const result = await runInstagramSync({}, deps);

  assert.equal(calls.capture.length, 1);
  assert.equal(result.hasMore, true);
  assert.equal(result.status, "partial");
  assert.equal(result.counts.insightsFailed, 1);
  assert.equal(calls.finalise[0].outcome.hasMore, true);
});

/* ------------------------------------------------------------------ */
/* Budgets and pagination                                              */
/* ------------------------------------------------------------------ */

test("enforces the deadline before starting another insight request", async () => {
  const { deps, calls, setClock } = harness({
    retrieve: async () =>
      retrievalFixture({
        mediaItems: [mediaItem("m1"), mediaItem("m2")],
      }),
    persist: async () => discoveryFixture({ mediaCount: 2 }),
    refreshQueue: async () => [
      mediaItem("m1").media,
      mediaItem("m2").media,
    ],
    captureInsights: async () => {
      setClock(21000);
      return captureResult("ok");
    },
  });

  const result = await runInstagramSync(
    { timeBudgetMs: 20000, reserveMs: 2500 },
    deps,
  );

  assert.equal(calls.capture.length, 1);
  assert.equal(calls.capture[0].timeoutMs, 8000);
  assert.equal(result.hasMore, true);
  assert.equal(result.status, "partial");
});

test("respects the insight budget and reports queue overflow", async () => {
  const { deps, calls } = harness({
    retrieve: async () =>
      retrievalFixture({
        mediaItems: [mediaItem("m1"), mediaItem("m2"), mediaItem("m3")],
      }),
    persist: async () => discoveryFixture({ mediaCount: 3 }),
    refreshQueue: async () => [
      mediaItem("m1").media,
      mediaItem("m2").media,
      mediaItem("m3").media,
    ],
  });

  const result = await runInstagramSync({ maxInsightItems: 1 }, deps);

  assert.equal(calls.queue[0].limit, 2);
  assert.equal(calls.capture.length, 1);
  assert.equal(result.hasMore, true);
  assert.equal(result.status, "partial");
});

test("pagination truncation sets has_more even when the queue is empty", async () => {
  const { deps, calls } = harness({
    retrieve: async () =>
      retrievalFixture({
        mediaItems: [mediaItem("m1")],
        truncated: true,
      }),
    refreshQueue: async () => [],
  });

  const result = await runInstagramSync({}, deps);

  assert.equal(calls.capture.length, 0);
  assert.equal(result.hasMore, true);
  assert.equal(result.status, "partial");
  assert.equal(calls.finalise[0].outcome.hasMore, true);
});

test("counts inserted and updated media from the persistence summary", async () => {
  const { deps, calls } = harness({
    retrieve: async () =>
      retrievalFixture({
        mediaItems: [mediaItem("m1"), mediaItem("m2"), mediaItem("m3")],
      }),
    persist: async () =>
      discoveryFixture({
        mediaCount: 3,
        created: 1,
        updated: 2,
      }),
    refreshQueue: async () => [],
  });

  await runInstagramSync({}, deps);

  assert.equal(calls.finalise[0].outcome.mediaCreated, 1);
  assert.equal(calls.finalise[0].outcome.mediaUpdated, 2);
});

/* ------------------------------------------------------------------ */
/* Failure paths                                                       */
/* ------------------------------------------------------------------ */

test("marks the run failed when Meta is not configured", async () => {
  const { deps, calls } = harness({
    retrieve: async () => retrievalFixture({ notConfigured: true }),
  });

  const result = await runInstagramSync({}, deps);

  assert.equal(calls.persist.length, 0);
  assert.equal(calls.queue.length, 0);
  assert.equal(result.status, "failed");
  assert.equal(result.ok, false);
  assert.equal(calls.finalise[0].outcome.status, "failed");
  assert.equal(calls.finalise[0].outcome.errorCode, "META_NOT_CONFIGURED");
});

test("finalises a failed run when retrieval throws unexpectedly", async () => {
  const { deps, calls } = harness({
    retrieve: async () => {
      throw new Error("network exploded");
    },
  });

  const result = await runInstagramSync({}, deps);

  assert.equal(calls.finalise.length, 1);
  assert.equal(calls.finalise[0].outcome.status, "failed");
  assert.equal(result.status, "failed");
  assert.equal(result.finalised, true);
  assert.equal(
    result.errors.some((error) => error.code === "SYNC_RETRIEVAL_FAILED"),
    true,
  );
});

test("finalises a failed run when persistence throws unexpectedly", async () => {
  const { deps, calls } = harness({
    persist: async () => {
      throw new Error("database write failed");
    },
  });

  const result = await runInstagramSync({}, deps);

  assert.equal(calls.finalise.length, 1);
  assert.equal(calls.finalise[0].outcome.status, "failed");
  assert.equal(result.status, "failed");
  assert.equal(
    result.errors.some(
      (error) => error.code === "SYNC_PERSISTENCE_FAILED",
    ),
    true,
  );
});

test("surfaces a finalisation failure clearly", async () => {
  const { deps } = harness({
    finaliseRun: async () => {
      throw new Error("finalise failed");
    },
  });

  const result = await runInstagramSync({}, deps);

  assert.equal(result.ok, false);
  assert.equal(result.status, "failed");
  assert.equal(result.finalisationFailed, true);
  assert.equal(result.finalised, false);
  assert.equal(result.runId, 1);
  assert.equal(
    result.errors.some(
      (error) => error.code === "SYNC_FINALISATION_FAILED",
    ),
    true,
  );
});

/* ------------------------------------------------------------------ */
/* Structure and boundaries                                            */
/* ------------------------------------------------------------------ */

test("returns a structured summary with collections, counts and warnings", async () => {
  const { deps } = harness();

  const result = await runInstagramSync({}, deps);

  assert.equal(typeof result.runId, "number");
  assert.equal(result.triggerSource, "manual");
  assert.equal(typeof result.counts, "object");
  assert.equal(typeof result.collections, "object");
  assert.equal(typeof result.retrieval, "object");
  assert.equal(Array.isArray(result.errors), true);
  assert.equal(Array.isArray(result.warnings), true);
  assert.equal(result.startedAt, "2026-11-13T08:00:00.000Z");
  assert.equal(result.finishedAt, "2026-11-13T08:00:20.000Z");
  assert.equal(result.durationMs, 20000);
});

test("never assigns venues, deletes media or touches manual content", () => {
  const source = readFileSync(
    join(ROOT, "lib/instagram-sync-orchestrator.js"),
    "utf8",
  );

  assert.equal(source.includes("assignInstagramMediaToVenues"), false);
  assert.equal(source.includes("removeInstagramMediaFromVenue"), false);
  assert.equal(source.includes("deleteInstagram"), false);
  assert.equal(source.includes("saveInstagramPost"), false);
  assert.equal(source.includes("venue_instagram_posts"), false);
  assert.equal(source.includes("venue_articles"), false);
  assert.equal(source.includes("netlify"), false);
});
