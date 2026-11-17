import {
  markInstagramMediaMetricsFailed,
  saveInstagramMediaMetrics,
  upsertInstagramMedia,
} from "./venue-stats-db.js";

/*
 * Phase 2B persistence layer.
 *
 * Accepts the normalised result from `retrieveInstagramContent()` and writes
 * media metadata and insights through the existing Phase 1 database methods.
 * It deliberately does not implement the sync worker, advisory locking,
 * scheduling, retries or venue assignment.
 *
 * Failed or unavailable insight attempts use `markInstagramMediaMetricsFailed`
 * so previously captured metric values and `metrics_captured_at` are never
 * replaced with nulls. Media without an insight attempt is upserted but its
 * metric columns are left untouched.
 */

const CAPTURED_STATUSES = new Set(["ok", "partial"]);
const FAILED_STATUSES = new Set(["error", "unavailable"]);
const SKIPPED_STATUSES = new Set(["pending", "skipped"]);

const DEFAULT_STORE = Object.freeze({
  upsertInstagramMedia,
  saveInstagramMediaMetrics,
  markInstagramMediaMetricsFailed,
});

function safeMessage(value) {
  return String(value || "")
    .replace(/postgres(?:ql)?:\/\/\S+/gi, "[database-url]")
    .replace(/\bEAA[A-Za-z0-9_-]{10,}\b/g, "[redacted]")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500);
}

function assertStore(store) {
  for (const method of [
    "upsertInstagramMedia",
    "saveInstagramMediaMetrics",
    "markInstagramMediaMetricsFailed",
  ]) {
    if (typeof store?.[method] !== "function") {
      throw new TypeError(`Instagram persistence store is missing ${method}()`);
    }
  }
}

function mediaPayload(item) {
  const media = item?.media && typeof item.media === "object" ? item.media : {};

  return {
    igMediaId: media.igMediaId ?? media.ig_media_id ?? media.id ?? null,
    mediaType: media.mediaType ?? media.media_type ?? null,
    mediaProductType: media.mediaProductType ?? media.media_product_type ?? null,
    permalink: media.permalink ?? null,
    caption: media.caption ?? null,
    mediaUrl: media.mediaUrl ?? media.media_url ?? null,
    thumbnailUrl: media.thumbnailUrl ?? media.thumbnail_url ?? null,
    postedAt: media.postedAt ?? media.posted_at ?? media.timestamp ?? null,
    storyExpiresAt: media.storyExpiresAt ?? media.story_expires_at ?? null,
  };
}

/*
 * Only the six Phase 1 metric columns are forwarded. The API's `saved` name is
 * mapped to `saves`, and legacy `impressions` is intentionally ignored.
 */
function metricsPayload(item) {
  const insights =
    item?.insights && typeof item.insights === "object" ? item.insights : {};

  return {
    views: insights.views ?? null,
    reach: insights.reach ?? null,
    likes: insights.likes ?? null,
    comments: insights.comments ?? null,
    shares: insights.shares ?? null,
    saves: insights.saves ?? insights.saved ?? null,
  };
}

function insightStatus(item) {
  const status = String(item?.insightState?.status || "").toLowerCase();
  if (CAPTURED_STATUSES.has(status) || FAILED_STATUSES.has(status)) {
    return status;
  }
  if (SKIPPED_STATUSES.has(status)) return "skipped";
  return "skipped";
}

function failureDetails(item, status) {
  const state = item?.insightState || {};
  const firstError = Array.isArray(state.errors) ? state.errors[0] : null;
  const defaultCode =
    status === "unavailable" ? "METRICS_UNAVAILABLE" : "METRICS_FAILED";
  const defaultMessage =
    status === "unavailable"
      ? "Insights were unavailable for this media item."
      : "Insights retrieval failed for this media item.";

  return {
    status,
    errorCode: firstError?.code || state.reason || defaultCode,
    errorMessage: firstError?.message || state.reason || defaultMessage,
  };
}

async function persistItem(item, { store, client }) {
  const media = mediaPayload(item);

  if (!media.igMediaId) {
    return {
      ok: false,
      igMediaId: null,
      databaseId: null,
      metricsStatus: "untouched",
      error: {
        code: "MEDIA_ID_MISSING",
        message: "The retrieved media item has no Instagram media id.",
      },
    };
  }

  const stored = await store.upsertInstagramMedia(media, { client });
  const status = insightStatus(item);

  if (CAPTURED_STATUSES.has(status)) {
    await store.saveInstagramMediaMetrics(media.igMediaId, metricsPayload(item), {
      status,
      client,
    });
  } else if (FAILED_STATUSES.has(status)) {
    await store.markInstagramMediaMetricsFailed(
      media.igMediaId,
      { ...failureDetails(item, status), client },
    );
  }

  return {
    ok: true,
    igMediaId: media.igMediaId,
    databaseId: stored?.id ?? null,
    created: stored?.created === true,
    metricsStatus: CAPTURED_STATUSES.has(status) || FAILED_STATUSES.has(status)
      ? status
      : "untouched",
    error: null,
  };
}

function emptySummary() {
  return {
    ok: false,
    skipped: false,
    itemsSeen: 0,
    persisted: 0,
    created: 0,
    updated: 0,
    metricsCaptured: 0,
    metricsFailed: 0,
    metricsSkipped: 0,
    failed: 0,
    items: [],
    error: null,
  };
}

/*
 * Persist one Phase 2A collection. A failed collection is never treated as an
 * empty collection: nothing is written for it, and its error is returned so
 * existing rows are left exactly as they were.
 */
export async function persistInstagramCollection(
  collection,
  { scope = "media", store = DEFAULT_STORE, client } = {},
) {
  assertStore(store);
  const summary = emptySummary();

  if (!collection) {
    summary.skipped = true;
    summary.error = {
      code: "COLLECTION_NOT_RETRIEVED",
      message: `The ${scope} collection was not retrieved.`,
    };
    return summary;
  }

  if (collection.ok === false || collection.error) {
    summary.skipped = true;
    summary.error = collection.error || {
      code: "COLLECTION_FAILED",
      message: `The ${scope} collection could not be retrieved.`,
    };
    return summary;
  }

  if (!Array.isArray(collection.items)) {
    summary.skipped = true;
    summary.error = {
      code: "COLLECTION_INVALID",
      message: `The ${scope} collection does not contain an items array.`,
    };
    return summary;
  }

  summary.ok = true;

  for (const item of collection.items) {
    summary.itemsSeen += 1;

    try {
      const result = await persistItem(item, { store, client });
      summary.items.push(result);

      if (!result.ok) {
        summary.failed += 1;
        summary.ok = false;
        continue;
      }

      summary.persisted += 1;
      if (result.created) summary.created += 1;
      else summary.updated += 1;

      if (result.metricsStatus === "ok" || result.metricsStatus === "partial") {
        summary.metricsCaptured += 1;
      } else if (
        result.metricsStatus === "error" ||
        result.metricsStatus === "unavailable"
      ) {
        summary.metricsFailed += 1;
      } else {
        summary.metricsSkipped += 1;
      }
    } catch (error) {
      summary.failed += 1;
      summary.ok = false;
      summary.items.push({
        ok: false,
        igMediaId: item?.media?.igMediaId ?? null,
        databaseId: null,
        created: false,
        metricsStatus: "untouched",
        error: {
          code: "PERSISTENCE_FAILED",
          message: safeMessage(error?.message || error),
        },
      });
    }
  }

  return summary;
}

/*
 * Persist both retrieved collections. Media and Stories are independent: a
 * failed Stories collection does not prevent media persistence, and vice
 * versa. No venue assignment or sync-run bookkeeping happens here.
 */
export async function persistInstagramRetrieval(
  retrieval,
  { store = DEFAULT_STORE, client } = {},
) {
  assertStore(store);

  const media = await persistInstagramCollection(retrieval?.media, {
    scope: "media",
    store,
    client,
  });
  const stories = await persistInstagramCollection(retrieval?.stories, {
    scope: "stories",
    store,
    client,
  });

  const errors = [];
  if (media.error) errors.push({ scope: "media", ...media.error });
  if (stories.error) errors.push({ scope: "stories", ...stories.error });
  for (const [scope, summary] of [
    ["media", media],
    ["stories", stories],
  ]) {
    for (const item of summary.items) {
      if (item.ok) continue;
      errors.push({
        scope,
        igMediaId: item.igMediaId,
        ...item.error,
      });
    }
  }

  return {
    ok: media.ok && stories.ok,
    retrievedAt: retrieval?.retrievedAt ?? null,
    media,
    stories,
    counts: {
      itemsSeen: media.itemsSeen + stories.itemsSeen,
      persisted: media.persisted + stories.persisted,
      created: media.created + stories.created,
      updated: media.updated + stories.updated,
      metricsCaptured: media.metricsCaptured + stories.metricsCaptured,
      metricsFailed: media.metricsFailed + stories.metricsFailed,
      metricsSkipped: media.metricsSkipped + stories.metricsSkipped,
      failed: media.failed + stories.failed,
    },
    errors,
  };
}
