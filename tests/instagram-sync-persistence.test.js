import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  persistInstagramCollection,
  persistInstagramRetrieval,
} from "../lib/instagram-sync-persistence.js";

/*
 * Mocked Phase 2B persistence tests.
 *
 * The in-memory store mirrors the Phase 1 SQL contracts closely enough to test
 * orchestration: upsert by Instagram media id, COALESCE-style metadata
 * preservation, successful captures and failed attempts. Real SQL semantics
 * are covered by the PostgreSQL integration suite.
 */

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function createMemoryStore() {
  let nextId = 1;
  const records = new Map();
  const calls = { upsert: [], save: [], fail: [] };

  function requiredRecord(igMediaId) {
    const record = records.get(igMediaId);
    if (!record) throw new Error(`unknown media ${igMediaId}`);
    return record;
  }

  return {
    records,
    calls,
    async upsertInstagramMedia(media, { client } = {}) {
      calls.upsert.push({ media, client });
      let record = records.get(media.igMediaId);
      const created = !record;

      if (!record) {
        record = {
          id: nextId++,
          igMediaId: media.igMediaId,
          mediaType: null,
          mediaProductType: null,
          permalink: null,
          caption: null,
          mediaUrl: null,
          thumbnailUrl: null,
          postedAt: null,
          storyExpiresAt: null,
          metrics: {
            views: null,
            reach: null,
            likes: null,
            comments: null,
            shares: null,
            saves: null,
          },
          metricsStatus: "pending",
          metricsFetchedAt: null,
          metricsCapturedAt: null,
          metricsErrorCode: null,
          metricsErrorMessage: null,
        };
        records.set(media.igMediaId, record);
      }

      for (const field of [
        "mediaType",
        "mediaProductType",
        "permalink",
        "caption",
        "mediaUrl",
        "thumbnailUrl",
        "postedAt",
      ]) {
        if (media[field] !== null && media[field] !== undefined) {
          record[field] = media[field];
        }
      }
      if (!record.storyExpiresAt && media.storyExpiresAt) {
        record.storyExpiresAt = media.storyExpiresAt;
      }
      return { ...record, created };
    },
    async saveInstagramMediaMetrics(igMediaId, metrics, { status } = {}) {
      calls.save.push({ igMediaId, metrics, status });
      const record = requiredRecord(igMediaId);
      for (const field of [
        "views",
        "reach",
        "likes",
        "comments",
        "shares",
        "saves",
      ]) {
        if (metrics[field] !== null && metrics[field] !== undefined) {
          record.metrics[field] = metrics[field];
        }
      }
      record.metricsStatus = status;
      record.metricsFetchedAt = new Date().toISOString();
      record.metricsCapturedAt = record.metricsFetchedAt;
      record.metricsErrorCode = null;
      record.metricsErrorMessage = null;
      return { ...record };
    },
    async markInstagramMediaMetricsFailed(
      igMediaId,
      { status, errorCode, errorMessage } = {},
    ) {
      calls.fail.push({ igMediaId, status, errorCode, errorMessage });
      const record = requiredRecord(igMediaId);
      record.metricsStatus = status;
      record.metricsFetchedAt = new Date().toISOString();
      record.metricsErrorCode = errorCode;
      record.metricsErrorMessage = errorMessage;
      return { ...record };
    },
  };
}

function media(overrides = {}) {
  return {
    igMediaId: "m1",
    mediaType: "IMAGE",
    mediaProductType: "FEED",
    permalink: "https://www.instagram.com/p/m1/",
    caption: "caption m1",
    mediaUrl: "https://cdn.example.test/m1.jpg",
    thumbnailUrl: null,
    postedAt: "2026-11-01T10:00:00.000Z",
    storyExpiresAt: null,
    ...overrides,
  };
}

function item(overrides = {}) {
  const { media: mediaOverrides, insights, insightState, ...rest } = overrides;
  return {
    media: media(mediaOverrides),
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
      status: "ok",
      supported: ["views", "reach", "likes", "comments", "shares", "saved"],
      unavailable: [],
      errors: [],
      ...insightState,
    },
    retrievedAt: "2026-11-13T08:00:00.000Z",
    metricsFetchedAt: "2026-11-13T08:00:01.000Z",
    metricsCapturedAt: "2026-11-13T08:00:01.000Z",
    ...rest,
  };
}

function retrieval({
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

/* ------------------------------------------------------------------ */
/* Inserts, updates and metadata                                       */
/* ------------------------------------------------------------------ */

test("first sync inserts media and persists successful insights", async () => {
  const store = createMemoryStore();
  const result = await persistInstagramRetrieval(
    retrieval({ mediaItems: [item()] }),
    { store },
  );

  assert.equal(result.ok, true);
  assert.equal(result.counts.persisted, 1);
  assert.equal(result.counts.metricsCaptured, 1);
  assert.equal(store.records.size, 1);

  const record = store.records.get("m1");
  assert.equal(record.mediaType, "IMAGE");
  assert.equal(record.mediaProductType, "FEED");
  assert.equal(record.caption, "caption m1");
  assert.deepEqual(record.metrics, {
    views: 100,
    reach: 80,
    likes: 12,
    comments: 3,
    shares: 2,
    saves: 4,
  });
  assert.equal(record.metricsStatus, "ok");
  assert.equal(record.metricsCapturedAt !== null, true);
  assert.equal(store.calls.save[0].status, "ok");
});

test("repeated syncs update the same media row instead of duplicating it", async () => {
  const store = createMemoryStore();
  const payload = retrieval({ mediaItems: [item()] });

  await persistInstagramRetrieval(payload, { store });
  const first = store.records.get("m1").id;

  await persistInstagramRetrieval(payload, { store });

  assert.equal(store.records.size, 1);
  assert.equal(store.records.get("m1").id, first);
  assert.equal(store.calls.upsert.length, 2);
  assert.equal(store.calls.upsert[0].media.igMediaId, "m1");
  assert.equal(store.calls.upsert[1].media.igMediaId, "m1");
});

test("reports inserted and updated counts from the store", async () => {
  const store = createMemoryStore();

  const first = await persistInstagramRetrieval(
    retrieval({ mediaItems: [item({ media: { igMediaId: "count-1" } })] }),
    { store },
  );
  assert.equal(first.media.created, 1);
  assert.equal(first.media.updated, 0);
  assert.equal(first.counts.created, 1);
  assert.equal(first.counts.updated, 0);

  const second = await persistInstagramRetrieval(
    retrieval({
      mediaItems: [
        item({ media: { igMediaId: "count-1" } }),
        item({ media: { igMediaId: "count-2" } }),
      ],
    }),
    { store },
  );
  assert.equal(second.media.created, 1);
  assert.equal(second.media.updated, 1);
  assert.equal(second.counts.created, 1);
  assert.equal(second.counts.updated, 1);
});

test("refreshes available metadata and thumbnail URLs", async () => {
  const store = createMemoryStore();

  await persistInstagramRetrieval(
    retrieval({
      mediaItems: [
        item({
          media: {
            thumbnailUrl: "https://cdn.example.test/old.jpg",
            caption: "old caption",
          },
        }),
      ],
    }),
    { store },
  );

  await persistInstagramRetrieval(
    retrieval({
      mediaItems: [
        item({
          media: {
            thumbnailUrl: "https://cdn.example.test/new.jpg",
            caption: "new caption",
            permalink: "https://www.instagram.com/p/new/",
          },
        }),
      ],
    }),
    { store },
  );

  const record = store.records.get("m1");
  assert.equal(record.thumbnailUrl, "https://cdn.example.test/new.jpg");
  assert.equal(record.caption, "new caption");
  assert.equal(record.permalink, "https://www.instagram.com/p/new/");
  assert.equal(store.records.size, 1);
});

test("passes null metadata through so existing useful values are preserved", async () => {
  const store = createMemoryStore();

  await persistInstagramRetrieval(
    retrieval({ mediaItems: [item()] }),
    { store },
  );

  const sparse = item({
    media: {
      caption: null,
      mediaUrl: null,
      thumbnailUrl: null,
      permalink: null,
    },
  });
  await persistInstagramRetrieval(retrieval({ mediaItems: [sparse] }), {
    store,
  });

  const record = store.records.get("m1");
  assert.equal(record.caption, "caption m1");
  assert.equal(record.mediaUrl, "https://cdn.example.test/m1.jpg");
  assert.equal(record.permalink, "https://www.instagram.com/p/m1/");

  const sent = store.calls.upsert.at(-1).media;
  assert.equal(sent.caption, null);
  assert.equal(sent.mediaUrl, null);
  assert.equal(sent.thumbnailUrl, null);
  assert.equal(sent.permalink, null);
});

test("maps the legacy saved name to saves and ignores impressions", async () => {
  const store = createMemoryStore();
  const legacy = item({
    insights: { saved: 9, impressions: 12345 },
  });
  delete legacy.insights.saves;

  await persistInstagramRetrieval(retrieval({ mediaItems: [legacy] }), {
    store,
  });

  const captured = store.calls.save[0].metrics;
  assert.equal(captured.saves, 9);
  assert.equal("impressions" in captured, false);
  assert.equal(store.records.get("m1").metrics.saves, 9);
});

/* ------------------------------------------------------------------ */
/* Insight success, partial and failure                                */
/* ------------------------------------------------------------------ */

test("persists partial insights and preserves metrics omitted from the update", async () => {
  const store = createMemoryStore();

  await persistInstagramRetrieval(
    retrieval({ mediaItems: [item()] }),
    { store },
  );

  const partial = item({
    insights: {
      views: 150,
      reach: null,
      likes: null,
      comments: 5,
      shares: null,
      saves: null,
    },
    insightState: { status: "partial", unavailable: ["reach", "shares", "saves"] },
  });
  const result = await persistInstagramRetrieval(
    retrieval({ mediaItems: [partial] }),
    { store },
  );

  const record = store.records.get("m1");
  assert.equal(record.metricsStatus, "partial");
  assert.equal(record.metrics.views, 150);
  assert.equal(record.metrics.comments, 5);
  assert.equal(record.metrics.reach, 80);
  assert.equal(record.metrics.likes, 12);
  assert.equal(record.metrics.shares, 2);
  assert.equal(record.metrics.saves, 4);
  assert.equal(store.calls.save.at(-1).status, "partial");
  assert.equal(result.counts.metricsCaptured, 1);
});

test("failed insights mark the attempt without replacing captured metrics", async () => {
  const store = createMemoryStore();

  await persistInstagramRetrieval(
    retrieval({ mediaItems: [item()] }),
    { store },
  );
  const capturedAt = store.records.get("m1").metricsCapturedAt;

  const failed = item({
    insights: {
      views: null,
      reach: null,
      likes: null,
      comments: null,
      shares: null,
      saves: null,
    },
    insightState: {
      status: "error",
      errors: [
        {
          code: "META_RATE_LIMITED",
          message: "Application request limit reached",
        },
      ],
    },
  });
  const result = await persistInstagramRetrieval(
    retrieval({ mediaItems: [failed] }),
    { store },
  );

  const record = store.records.get("m1");
  assert.deepEqual(record.metrics, {
    views: 100,
    reach: 80,
    likes: 12,
    comments: 3,
    shares: 2,
    saves: 4,
  });
  assert.equal(record.metricsCapturedAt, capturedAt);
  assert.equal(record.metricsStatus, "error");
  assert.equal(record.metricsErrorCode, "META_RATE_LIMITED");
  assert.match(record.metricsErrorMessage, /limit reached/);
  assert.equal(store.calls.save.length, 1);
  assert.equal(store.calls.fail.length, 1);
  assert.equal(result.counts.metricsFailed, 1);
});

test("unavailable insights use the failed path and keep old values", async () => {
  const store = createMemoryStore();

  await persistInstagramRetrieval(
    retrieval({ mediaItems: [item()] }),
    { store },
  );

  const unavailable = item({
    insightState: {
      status: "unavailable",
      unavailable: ["views", "reach", "likes", "comments", "shares", "saved"],
      errors: [
        {
          code: "META_INVALID_REQUEST",
          message: "The Media Insights API does not support this metric.",
        },
      ],
    },
  });
  await persistInstagramRetrieval(
    retrieval({ mediaItems: [unavailable] }),
    { store },
  );

  const record = store.records.get("m1");
  assert.equal(record.metricsStatus, "unavailable");
  assert.equal(record.metrics.views, 100);
  assert.equal(record.metrics.saves, 4);
  assert.equal(store.calls.fail.at(-1).status, "unavailable");
});

test("media without an insight attempt only upserts metadata", async () => {
  const store = createMemoryStore();
  const withoutInsights = item({
    insightState: { status: "skipped", reason: "disabled" },
  });

  const result = await persistInstagramRetrieval(
    retrieval({ mediaItems: [withoutInsights] }),
    { store },
  );

  assert.equal(result.counts.persisted, 1);
  assert.equal(result.counts.metricsSkipped, 1);
  assert.equal(store.calls.save.length, 0);
  assert.equal(store.calls.fail.length, 0);
  assert.equal(store.records.get("m1").metricsStatus, "pending");
  assert.equal(store.records.get("m1").metricsCapturedAt, null);
});

/* ------------------------------------------------------------------ */
/* Stories                                                             */
/* ------------------------------------------------------------------ */

test("passes Story expiry through and preserves the first captured expiry", async () => {
  const store = createMemoryStore();
  const story = item({
    media: {
      igMediaId: "s1",
      mediaType: "IMAGE",
      mediaProductType: "STORY",
      postedAt: "2026-11-12T10:00:00.000Z",
      storyExpiresAt: "2026-11-13T10:00:00.000Z",
    },
  });

  await persistInstagramRetrieval(retrieval({ storyItems: [story] }), {
    store,
  });

  const changed = item({
    media: {
      igMediaId: "s1",
      mediaType: "IMAGE",
      mediaProductType: "STORY",
      postedAt: "2026-11-12T10:00:00.000Z",
      storyExpiresAt: "2026-11-14T10:00:00.000Z",
    },
  });
  await persistInstagramRetrieval(retrieval({ storyItems: [changed] }), {
    store,
  });

  assert.equal(
    store.calls.upsert[0].media.storyExpiresAt,
    "2026-11-13T10:00:00.000Z",
  );
  assert.equal(
    store.records.get("s1").storyExpiresAt,
    "2026-11-13T10:00:00.000Z",
  );
});

test("an empty Stories collection leaves expired Stories untouched", async () => {
  const store = createMemoryStore();
  store.records.set("expired-story", {
    id: 99,
    igMediaId: "expired-story",
    mediaProductType: "STORY",
    storyExpiresAt: "2026-11-10T10:00:00.000Z",
    metrics: { views: 50 },
  });

  const result = await persistInstagramRetrieval(
    retrieval({ mediaItems: [], storyItems: [] }),
    { store },
  );

  assert.equal(result.ok, true);
  assert.equal(store.calls.upsert.length, 0);
  assert.equal(store.records.get("expired-story").metrics.views, 50);
});

/* ------------------------------------------------------------------ */
/* Collections and failures                                            */
/* ------------------------------------------------------------------ */

test("empty media results are a successful no-op", async () => {
  const store = createMemoryStore();
  const result = await persistInstagramCollection(
    { ok: true, items: [], error: null },
    { store },
  );

  assert.equal(result.ok, true);
  assert.equal(result.itemsSeen, 0);
  assert.equal(store.calls.upsert.length, 0);
});

test("a failed collection is not treated as an empty collection", async () => {
  const store = createMemoryStore();
  const result = await persistInstagramRetrieval(
    retrieval({
      mediaItems: [item()],
      storyItems: [item({ media: { igMediaId: "s1", mediaProductType: "STORY" } })],
      storiesOk: false,
      storiesError: {
        code: "META_TOKEN_EXPIRED",
        message: "The access token expired.",
      },
    }),
    { store },
  );

  assert.equal(result.ok, false);
  assert.equal(result.media.persisted, 1);
  assert.equal(result.stories.skipped, true);
  assert.equal(result.stories.error.code, "META_TOKEN_EXPIRED");
  assert.equal(store.records.has("s1"), false);
  assert.equal(
    store.calls.upsert.some((call) => call.media.igMediaId === "s1"),
    false,
  );
  assert.equal(
    result.errors.some(
      (error) => error.scope === "stories" && error.code === "META_TOKEN_EXPIRED",
    ),
    true,
  );
});

test("one item failure does not abort the remaining media", async () => {
  const store = createMemoryStore();
  const originalUpsert = store.upsertInstagramMedia;
  store.upsertInstagramMedia = async (media, options) => {
    if (media.igMediaId === "bad") throw new Error("insert failed");
    return originalUpsert(media, options);
  };

  const result = await persistInstagramRetrieval(
    retrieval({
      mediaItems: [
        item({ media: { igMediaId: "bad" } }),
        item({ media: { igMediaId: "good" } }),
      ],
    }),
    { store },
  );

  assert.equal(result.ok, false);
  assert.equal(result.counts.failed, 1);
  assert.equal(result.counts.persisted, 1);
  assert.equal(store.records.has("good"), true);
  assert.equal(
    result.errors.some((error) => error.code === "PERSISTENCE_FAILED"),
    true,
  );
});

test("media without an Instagram id is reported without writing", async () => {
  const store = createMemoryStore();
  const result = await persistInstagramRetrieval(
    retrieval({ mediaItems: [item({ media: { igMediaId: null } })] }),
    { store },
  );

  assert.equal(result.ok, false);
  assert.equal(result.counts.failed, 1);
  assert.equal(store.calls.upsert.length, 0);
  assert.equal(
    result.errors.some((error) => error.code === "MEDIA_ID_MISSING"),
    true,
  );
});

test("persistence never assigns media to venues or touches manual content", () => {
  const source = readFileSync(
    join(ROOT, "lib/instagram-sync-persistence.js"),
    "utf8",
  );

  assert.equal(source.includes("assignInstagramMediaToVenues"), false);
  assert.equal(source.includes("saveInstagramPost"), false);
  assert.equal(source.includes("deleteInstagramPost"), false);
  assert.equal(source.includes("venue_instagram_posts"), false);
  assert.equal(source.includes("venue_articles"), false);
  assert.equal(source.includes("withInstagramSyncLock"), false);
});
