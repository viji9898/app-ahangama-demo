import process from "node:process";
import { AsyncLocalStorage } from "node:async_hooks";
import pg from "pg";

/*
 * Persistent manual content for venue statistics.
 *
 * Instagram Insights are not available through GA4, so post metrics are
 * entered by an administrator. Article rows only associate an Ahangama.com
 * article with a venue — page views are always read live from GA4.
 *
 * Tables live in the `guide_app` schema because the application database
 * role owns that schema but cannot alter the guide placement tables.
 */

const { Pool } = pg;

let pool;

function getPool() {
  if (!pool) {
    // `VENUE_STATS_DATABASE_URL` is an optional local-preview override.
    // Production uses the normal `DATABASE_URL`.
    const connectionString =
      process.env.VENUE_STATS_DATABASE_URL ||
      process.env.DATABASE_URL ||
      "";
    if (!connectionString) throw new Error("Missing env var: DATABASE_URL");
    pool = new Pool({ connectionString, connectionTimeoutMillis: 8000 });
    pool.on("error", (error) => {
      console.error("Unexpected venue stats database pool error:", error);
    });
  }
  return pool;
}

/*
 * Controlled client access.
 *
 * The pool itself is intentionally never exported: its options can contain the
 * connection string. Callers receive a client only inside a callback and the
 * client is always returned to the pool (or destroyed) by this module.
 */
export async function withVenueStatsClient(callback) {
  if (typeof callback !== "function") {
    throw new TypeError("withVenueStatsClient requires a callback");
  }

  const client = await getPool().connect();
  try {
    return await callback(client);
  } finally {
    releaseClient(client);
  }
}

export async function closeVenueStatsPool() {
  if (!pool) return;
  const current = pool;
  pool = undefined;
  await current.end();
}

function releaseClient(client, destroy = false) {
  try {
    if (destroy) client.release(true);
    else client.release();
  } catch {
    // Cleanup must never mask the result of the operation.
  }
}

function text(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function optionalText(value) {
  const normalized = text(value);
  return normalized || null;
}

function count(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return Math.round(parsed);
}

function optionalDate(value) {
  const normalized = text(value);
  if (!normalized) return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? normalized : null;
}

function toPost(row) {
  return {
    id: Number(row.id),
    venueKey: row.venue_key,
    postUrl: row.post_url,
    postDate: row.post_date ? String(row.post_date).slice(0, 10) : "",
    postType: row.post_type,
    reach: Number(row.reach) || 0,
    impressions: Number(row.impressions) || 0,
    likes: Number(row.likes) || 0,
    comments: Number(row.comments) || 0,
    shares: Number(row.shares) || 0,
    saves: Number(row.saves) || 0,
    notes: row.notes || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toArticle(row) {
  return {
    id: Number(row.id),
    venueKey: row.venue_key,
    title: row.title,
    url: row.url,
    publishedAt: row.published_at ? String(row.published_at).slice(0, 10) : "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/* ------------------------------------------------------------------ */
/* Synced Instagram media helpers                                      */
/* ------------------------------------------------------------------ */

export const INSTAGRAM_SYNC_LOCK_ID = 734001;

const TERMINAL_SYNC_STATUSES = new Set([
  "success",
  "partial",
  "failed",
  "skipped",
]);

const CAPTURED_METRIC_STATUSES = new Set(["ok", "partial"]);
const FAILED_METRIC_STATUSES = new Set(["error", "unavailable"]);

/*
 * Tracks the client bound to an in-flight advisory-lock callback. Sync-run
 * lifecycle helpers use this to reject a silent fallback to the pool: the lock
 * is session-scoped, so a run write on a different connection could outlive or
 * escape the lock.
 */
const syncLockScope = new AsyncLocalStorage();

const REDACTED = "[redacted]";

const SECRET_PATTERNS = [
  // Meta access tokens (System User and user tokens start with EAA).
  /\bEAA[A-Za-z0-9_-]{10,}\b/g,
  // OAuth bearer headers.
  /\bBearer\s+[A-Za-z0-9._~+/=-]+/gi,
  // Token in a query string.
  /([?&]access_token=)[^&\s]+/gi,
  // Token in JSON-ish or key=value text.
  /(["']?access_token["']?\s*[:=]\s*["']?)[^"'&\s,}]+/gi,
];

function runQuery(client, sql, params = []) {
  if (client) return client.query(sql, params);
  return getPool().query(sql, params);
}

/*
 * Sync-run lifecycle writes must stay on the connection that holds the
 * advisory lock. Outside the lock the pooled fallback remains available for
 * read-only status checks and tests; inside it, omitting the client throws.
 */
function assertSyncClient(client, operation) {
  const scope = syncLockScope.getStore();
  if (scope && scope.client !== client) {
    throw new Error(
      `${operation} must use the client provided by withInstagramSyncLock while the lock is held`,
    );
  }
}

/*
 * Hand the orchestrator only a query function. `release`, `end` and pool
 * controls stay private to this module, so callback code cannot return the
 * dedicated connection to the pool while the lock is still held.
 */
function createRestrictedSyncClient(rawClient) {
  let usable = true;

  const client = Object.freeze({
    query(sql, params = []) {
      if (!usable) {
        throw new Error(
          "The Instagram sync lock client is no longer available.",
        );
      }
      return rawClient.query(sql, params);
    },
  });

  return {
    client,
    close() {
      usable = false;
    },
  };
}

function optionalMetric(value) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return Math.round(parsed);
}

function optionalTimestamp(value) {
  if (value === null || value === undefined || value === "") return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

/*
 * A supplied timestamp that cannot be parsed is a caller bug, not a missing
 * value. Failing loudly prevents an invalid Story expiry from being written as
 * NULL, which would make retention impossible to reason about later.
 */
function timestampValue(value, label) {
  const normalized = optionalTimestamp(value);
  if (
    normalized === null &&
    value !== null &&
    value !== undefined &&
    value !== ""
  ) {
    throw new Error(`${label} is not a valid timestamp`);
  }
  return normalized;
}

/*
 * Meta returns media_product_type in upper case (FEED, REELS, STORY, AD).
 * Normalising lowercase input would silently move a Story into a different
 * branch, so reject it with a clear error instead.
 */
function mediaProductTypeValue(value) {
  const normalized = optionalText(value);
  if (!normalized) return null;
  if (normalized !== normalized.toUpperCase()) {
    throw new Error(
      `mediaProductType must be uppercase, received "${normalized}"`,
    );
  }
  return normalized;
}

function iso(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function enumValue(value) {
  const normalized = optionalText(value);
  return normalized ? normalized.toUpperCase() : null;
}

function boundedLimit(value, fallback = 100, maximum = 500) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(Math.round(parsed), maximum);
}

function boundedOffset(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return 0;
  return Math.round(parsed);
}

function boundedMinutes(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return Math.round(parsed);
}

function safeSyncErrorCode(value) {
  const normalized = text(value)
    .toUpperCase()
    .replace(/[^A-Z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 64);
  return normalized || null;
}

function safeSyncErrorMessage(value) {
  let result = text(value);
  if (!result) return null;

  for (const pattern of SECRET_PATTERNS) {
    result = result.replace(pattern, (match, prefix) =>
      typeof prefix === "string" ? `${prefix}${REDACTED}` : REDACTED,
    );
  }

  result = result.replace(/\s+/g, " ").trim().slice(0, 500);
  return result || null;
}

function storyExpiryFromPostedAt(postedAt) {
  const timestamp = optionalTimestamp(postedAt);
  if (!timestamp) return null;
  return new Date(new Date(timestamp).getTime() + 24 * 60 * 60 * 1000)
    .toISOString();
}

function toInstagramMedia(row) {
  if (!row) return null;

  return {
    id: Number(row.id),
    igMediaId: row.ig_media_id,
    mediaType: row.media_type || "",
    mediaProductType: row.media_product_type || "",
    permalink: row.permalink || "",
    caption: row.caption || "",
    mediaUrl: row.media_url || "",
    thumbnailUrl: row.thumbnail_url || "",
    postedAt: iso(row.posted_at),
    storyExpiresAt: iso(row.story_expires_at),
    metrics: {
      views: optionalMetric(row.views),
      reach: optionalMetric(row.reach),
      likes: optionalMetric(row.likes),
      comments: optionalMetric(row.comments),
      shares: optionalMetric(row.shares),
      saves: optionalMetric(row.saves),
    },
    metricsStatus: row.metrics_status,
    metricsFetchedAt: iso(row.metrics_fetched_at),
    metricsCapturedAt: iso(row.metrics_captured_at),
    metricsErrorCode: row.metrics_error_code || null,
    metricsErrorMessage: row.metrics_error_message || null,
    lastSeenAt: iso(row.last_seen_at),
    lastSyncedAt: iso(row.last_synced_at),
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at),
  };
}

function toMediaVenue(row) {
  return {
    id: Number(row.id),
    mediaId: Number(row.media_id),
    venueKey: row.venue_key,
    assignedAt: iso(row.assigned_at),
  };
}

function toSyncRun(row) {
  if (!row) return null;

  return {
    id: Number(row.id),
    triggerSource: row.trigger_source,
    status: row.status,
    startedAt: iso(row.started_at),
    finishedAt: iso(row.finished_at),
    durationMs: row.duration_ms === null ? null : Number(row.duration_ms),
    mediaSeen: Number(row.media_seen) || 0,
    mediaCreated: Number(row.media_created) || 0,
    mediaUpdated: Number(row.media_updated) || 0,
    storiesSeen: Number(row.stories_seen) || 0,
    insightsAttempted: Number(row.insights_attempted) || 0,
    insightsFailed: Number(row.insights_failed) || 0,
    hasMore: Boolean(row.has_more),
    errorCode: row.error_code || null,
    errorMessage: row.error_message || null,
    graphTraceId: row.graph_trace_id || null,
    accountFollowers: optionalMetric(row.account_followers),
    accountMediaCount: optionalMetric(row.account_media_count),
    accountFetchedAt: iso(row.account_fetched_at),
  };
}

export async function listInstagramPosts(venueKey) {
  const result = await getPool().query(
    `SELECT * FROM guide_app.venue_instagram_posts
     WHERE venue_key = $1
     ORDER BY post_date DESC NULLS LAST, id DESC`,
    [venueKey],
  );
  return result.rows.map(toPost);
}

export async function saveInstagramPost(venueKey, data = {}) {
  const postUrl = text(data.postUrl);
  if (!postUrl) throw new Error("postUrl is required");

  const postType = ["post", "reel", "story"].includes(text(data.postType))
    ? text(data.postType)
    : "post";

  const result = await getPool().query(
    `INSERT INTO guide_app.venue_instagram_posts
       (venue_key, post_url, post_date, post_type, reach, impressions,
        likes, comments, shares, saves, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     ON CONFLICT (venue_key, post_url) DO UPDATE SET
       post_date = EXCLUDED.post_date,
       post_type = EXCLUDED.post_type,
       reach = EXCLUDED.reach,
       impressions = EXCLUDED.impressions,
       likes = EXCLUDED.likes,
       comments = EXCLUDED.comments,
       shares = EXCLUDED.shares,
       saves = EXCLUDED.saves,
       notes = EXCLUDED.notes,
       updated_at = NOW()
     RETURNING *`,
    [
      venueKey,
      postUrl,
      optionalDate(data.postDate),
      postType,
      count(data.reach),
      count(data.impressions),
      count(data.likes),
      count(data.comments),
      count(data.shares),
      count(data.saves),
      optionalText(data.notes),
    ],
  );

  return toPost(result.rows[0]);
}

export async function deleteInstagramPost(venueKey, id) {
  const result = await getPool().query(
    `DELETE FROM guide_app.venue_instagram_posts
     WHERE venue_key = $1 AND id = $2
     RETURNING id`,
    [venueKey, Number(id)],
  );
  return Boolean(result.rows[0]);
}

export async function listVenueArticles(venueKey) {
  const result = await getPool().query(
    `SELECT * FROM guide_app.venue_articles
     WHERE venue_key = $1
     ORDER BY published_at DESC NULLS LAST, id DESC`,
    [venueKey],
  );
  return result.rows.map(toArticle);
}

export async function saveVenueArticle(venueKey, data = {}) {
  const url = text(data.url);
  const title = text(data.title);
  if (!url) throw new Error("url is required");
  if (!title) throw new Error("title is required");

  const result = await getPool().query(
    `INSERT INTO guide_app.venue_articles
       (venue_key, title, url, published_at)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (venue_key, url) DO UPDATE SET
       title = EXCLUDED.title,
       published_at = EXCLUDED.published_at,
       updated_at = NOW()
     RETURNING *`,
    [venueKey, title, url, optionalDate(data.publishedAt)],
  );

  return toArticle(result.rows[0]);
}

export async function deleteVenueArticle(venueKey, id) {
  const result = await getPool().query(
    `DELETE FROM guide_app.venue_articles
     WHERE venue_key = $1 AND id = $2
     RETURNING id`,
    [venueKey, Number(id)],
  );
  return Boolean(result.rows[0]);
}

/* ------------------------------------------------------------------ */
/* Synced Instagram media                                              */
/* ------------------------------------------------------------------ */

/*
 * Insert or refresh a synced media row.
 *
 * `story_expires_at` is deliberately written as
 * `COALESCE(existing, EXCLUDED)`: once a Story's expiry is known it must never
 * be rewritten by a later sync, even if Meta omits the timestamp.
 */
export async function upsertInstagramMedia(media = {}, { client } = {}) {
  const igMediaId = text(media.igMediaId ?? media.ig_media_id ?? media.id);
  if (!igMediaId) throw new Error("igMediaId is required");

  const mediaProductType = mediaProductTypeValue(
    media.mediaProductType ?? media.media_product_type,
  );
  const postedAt = timestampValue(
    media.postedAt ?? media.posted_at ?? media.timestamp,
    "postedAt",
  );
  const explicitExpiry = timestampValue(
    media.storyExpiresAt ?? media.story_expires_at,
    "storyExpiresAt",
  );

  if (mediaProductType === "STORY" && !postedAt && !explicitExpiry) {
    throw new Error(
      "Instagram Story media requires postedAt or storyExpiresAt",
    );
  }
  if (explicitExpiry && !postedAt) {
    throw new Error("storyExpiresAt requires postedAt");
  }

  const storyExpiresAt =
    explicitExpiry ||
    (mediaProductType === "STORY" ? storyExpiryFromPostedAt(postedAt) : null);

  const result = await runQuery(
    client,
    `INSERT INTO guide_app.instagram_media AS m (
       ig_media_id,
       media_type,
       media_product_type,
       permalink,
       caption,
       media_url,
       thumbnail_url,
       posted_at,
       story_expires_at,
       last_seen_at,
       last_synced_at
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
     ON CONFLICT (ig_media_id) DO UPDATE SET
       media_type = COALESCE(EXCLUDED.media_type, m.media_type),
       media_product_type = COALESCE(
         EXCLUDED.media_product_type,
         m.media_product_type
       ),
       permalink = COALESCE(EXCLUDED.permalink, m.permalink),
       caption = COALESCE(EXCLUDED.caption, m.caption),
       media_url = COALESCE(EXCLUDED.media_url, m.media_url),
       thumbnail_url = COALESCE(EXCLUDED.thumbnail_url, m.thumbnail_url),
       posted_at = COALESCE(m.posted_at, EXCLUDED.posted_at),
       story_expires_at = COALESCE(m.story_expires_at, EXCLUDED.story_expires_at),
       last_seen_at = NOW(),
       last_synced_at = NOW(),
       updated_at = NOW()
     RETURNING *, (xmax = 0) AS created`,
    [
      igMediaId,
      enumValue(media.mediaType ?? media.media_type),
      mediaProductType,
      optionalText(media.permalink ?? media.permalink_url),
      optionalText(media.caption),
      optionalText(media.mediaUrl ?? media.media_url),
      optionalText(media.thumbnailUrl ?? media.thumbnail_url),
      postedAt,
      storyExpiresAt,
    ],
  );

  const stored = toInstagramMedia(result.rows[0]);
  return stored ? { ...stored, created: result.rows[0].created === true } : null;
}

export async function getInstagramMediaById(id, { client } = {}) {
  const result = await runQuery(
    client,
    `SELECT * FROM guide_app.instagram_media WHERE id = $1`,
    [Number(id)],
  );
  return toInstagramMedia(result.rows[0]);
}

export async function getInstagramMediaByIgId(igMediaId, { client } = {}) {
  const result = await runQuery(
    client,
    `SELECT * FROM guide_app.instagram_media WHERE ig_media_id = $1`,
    [text(igMediaId)],
  );
  return toInstagramMedia(result.rows[0]);
}

export async function listInstagramMedia({
  venueKey,
  includeExpiredStories = true,
  limit = 100,
  offset = 0,
  client,
} = {}) {
  const conditions = [];
  const params = [];

  if (venueKey) {
    params.push(text(venueKey));
    conditions.push(
      `EXISTS (
         SELECT 1 FROM guide_app.instagram_media_venues v
         WHERE v.media_id = m.id AND v.venue_key = $${params.length}
       )`,
    );
  }

  if (!includeExpiredStories) {
    conditions.push(
      `(m.media_product_type IS DISTINCT FROM 'STORY'
        OR m.story_expires_at IS NULL
        OR m.story_expires_at > NOW())`,
    );
  }

  params.push(boundedLimit(limit));
  const limitPlaceholder = `$${params.length}`;
  params.push(boundedOffset(offset));
  const offsetPlaceholder = `$${params.length}`;

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const result = await runQuery(
    client,
    `SELECT m.*
     FROM guide_app.instagram_media m
     ${where}
     ORDER BY m.posted_at DESC NULLS LAST, m.id DESC
     LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder}`,
    params,
  );

  return result.rows.map(toInstagramMedia);
}

export async function listActiveInstagramStories({
  limit = 100,
  client,
} = {}) {
  const result = await runQuery(
    client,
    `SELECT *
     FROM guide_app.instagram_media
     WHERE media_product_type = 'STORY'
       AND (story_expires_at IS NULL OR story_expires_at > NOW())
     ORDER BY story_expires_at ASC NULLS LAST, posted_at DESC NULLS LAST
     LIMIT $1`,
    [boundedLimit(limit)],
  );

  return result.rows.map(toInstagramMedia);
}

export async function listExpiredInstagramStories({
  limit = 100,
  client,
} = {}) {
  const result = await runQuery(
    client,
    `SELECT *
     FROM guide_app.instagram_media
     WHERE media_product_type = 'STORY'
       AND story_expires_at IS NOT NULL
       AND story_expires_at <= NOW()
     ORDER BY story_expires_at DESC, posted_at DESC NULLS LAST
     LIMIT $1`,
    [boundedLimit(limit)],
  );

  return result.rows.map(toInstagramMedia);
}

/*
 * Media due for an insights refresh.
 *
 * Active Stories are ranked first so they are captured before expiry. The
 * `metrics_captured_at` comparison controls staleness; `metrics_fetched_at`
 * throttles retries after a failed attempt. Expired Stories are never
 * refreshed because their metrics are frozen.
 *
 * The refresh indexes are not partial (see migration 034), so active Stories
 * are indexed alongside feed media. Expired Stories are filtered below; at the
 * expected scale that is cheaper than maintaining a separate active-Story
 * index whose predicate would need a volatile NOW().
 */
export async function getInstagramMediaRefreshQueue({
  limit = 20,
  staleAfterMinutes = 180,
  retryAfterMinutes = 60,
  client,
} = {}) {
  const result = await runQuery(
    client,
    `SELECT m.*
     FROM guide_app.instagram_media m
     WHERE (m.story_expires_at IS NULL OR m.story_expires_at > NOW())
       AND (
         m.metrics_captured_at IS NULL
         OR m.metrics_captured_at < NOW() - ($1::int * INTERVAL '1 minute')
       )
       AND (
         m.metrics_fetched_at IS NULL
         OR m.metrics_fetched_at < NOW() - ($2::int * INTERVAL '1 minute')
       )
     ORDER BY
       CASE WHEN m.media_product_type = 'STORY' THEN 0 ELSE 1 END,
       m.metrics_captured_at ASC NULLS FIRST,
       m.posted_at DESC NULLS LAST,
       m.id DESC
     LIMIT $3`,
    [
      boundedMinutes(staleAfterMinutes, 180),
      boundedMinutes(retryAfterMinutes, 60),
      boundedLimit(limit, 20, 100),
    ],
  );

  return result.rows.map(toInstagramMedia);
}

/*
 * Record a successful (or partially successful) metrics capture.
 *
 * A failed request must use `markInstagramMediaMetricsFailed` instead. That
 * separation guarantees a failed attempt never advances
 * `metrics_captured_at` and never clears previously captured values.
 */
export async function saveInstagramMediaMetrics(
  igMediaId,
  metrics = {},
  { status = "ok", client } = {},
) {
  const normalized = {
    views: optionalMetric(metrics.views),
    reach: optionalMetric(metrics.reach),
    likes: optionalMetric(metrics.likes),
    comments: optionalMetric(metrics.comments),
    shares: optionalMetric(metrics.shares),
    saves: optionalMetric(metrics.saves),
  };

  const hasUsableMetric = Object.values(normalized).some(
    (value) => value !== null,
  );

  if (!hasUsableMetric) {
    return markInstagramMediaMetricsFailed(igMediaId, {
      status: "unavailable",
      errorCode: "METRICS_UNAVAILABLE",
      errorMessage: "Insights returned no usable metrics.",
      client,
    });
  }

  const capturedStatus = text(status);
  if (!CAPTURED_METRIC_STATUSES.has(capturedStatus)) {
    throw new Error(
      `Unsupported metrics status "${capturedStatus}"; expected "ok" or "partial"`,
    );
  }

  const result = await runQuery(
    client,
    `UPDATE guide_app.instagram_media AS m
     SET views = COALESCE($2, m.views),
         reach = COALESCE($3, m.reach),
         likes = COALESCE($4, m.likes),
         comments = COALESCE($5, m.comments),
         shares = COALESCE($6, m.shares),
         saves = COALESCE($7, m.saves),
         metrics_status = $8,
         metrics_fetched_at = NOW(),
         metrics_captured_at = NOW(),
         metrics_error_code = NULL,
         metrics_error_message = NULL,
         updated_at = NOW()
     WHERE m.ig_media_id = $1
     RETURNING *`,
    [
      text(igMediaId),
      normalized.views,
      normalized.reach,
      normalized.likes,
      normalized.comments,
      normalized.shares,
      normalized.saves,
      capturedStatus,
    ],
  );

  return toInstagramMedia(result.rows[0]);
}

/*
 * Record a failed or unavailable metrics attempt.
 *
 * Only the attempt timestamp and safe error fields change. Metric values and
 * `metrics_captured_at` keep their last successful values.
 */
export async function markInstagramMediaMetricsFailed(
  igMediaId,
  { status = "error", errorCode = "METRICS_FAILED", errorMessage, client } = {},
) {
  const nextStatus = text(status);
  if (!FAILED_METRIC_STATUSES.has(nextStatus)) {
    throw new Error(
      `Unsupported failed-metrics status "${nextStatus}"; expected "error" or "unavailable"`,
    );
  }

  const result = await runQuery(
    client,
    `UPDATE guide_app.instagram_media AS m
     SET metrics_status = $2,
         metrics_fetched_at = NOW(),
         metrics_error_code = $3,
         metrics_error_message = $4,
         updated_at = NOW()
     WHERE m.ig_media_id = $1
     RETURNING *`,
    [
      text(igMediaId),
      nextStatus,
      safeSyncErrorCode(errorCode),
      safeSyncErrorMessage(errorMessage),
    ],
  );

  return toInstagramMedia(result.rows[0]);
}

/* ------------------------------------------------------------------ */
/* Venue assignments                                                   */
/* ------------------------------------------------------------------ */

/*
 * Assign media to venues.
 *
 * This operation is insert-only: it adds missing (media_id, venue_key) pairs
 * and leaves existing assignments untouched. Duplicates are ignored through
 * ON CONFLICT DO NOTHING. Removing an assignment requires the explicit
 * `removeInstagramMediaFromVenue` call.
 */
export async function assignInstagramMediaToVenues(
  mediaId,
  venueKeys,
  { client } = {},
) {
  const id = Number(mediaId);
  if (!Number.isFinite(id) || id <= 0) {
    throw new Error("mediaId is required");
  }

  const keys = [
    ...new Set((venueKeys || []).map((key) => text(key)).filter(Boolean)),
  ];
  if (!keys.length) return [];

  const result = await runQuery(
    client,
    `INSERT INTO guide_app.instagram_media_venues (media_id, venue_key)
     SELECT $1::bigint, venue_key
     FROM unnest($2::text[]) AS venues(venue_key)
     ON CONFLICT (media_id, venue_key) DO NOTHING
     RETURNING *`,
    [id, keys],
  );

  return result.rows.map(toMediaVenue);
}

export async function removeInstagramMediaFromVenue(
  mediaId,
  venueKey,
  { client } = {},
) {
  const result = await runQuery(
    client,
    `DELETE FROM guide_app.instagram_media_venues
     WHERE media_id = $1 AND venue_key = $2
     RETURNING id`,
    [Number(mediaId), text(venueKey)],
  );
  return Boolean(result.rows[0]);
}

export async function listInstagramMediaVenues(mediaId, { client } = {}) {
  const result = await runQuery(
    client,
    `SELECT * FROM guide_app.instagram_media_venues
     WHERE media_id = $1
     ORDER BY venue_key ASC`,
    [Number(mediaId)],
  );
  return result.rows.map(toMediaVenue);
}

/* ------------------------------------------------------------------ */
/* Sync runs                                                           */
/* ------------------------------------------------------------------ */

export async function startInstagramSyncRun({
  triggerSource = "schedule",
  client,
} = {}) {
  assertSyncClient(client, "startInstagramSyncRun");
  const result = await runQuery(
    client,
    `INSERT INTO guide_app.instagram_sync_runs (trigger_source, status, started_at)
     VALUES ($1, 'running', NOW())
     RETURNING *`,
    [text(triggerSource).slice(0, 64) || "schedule"],
  );
  return toSyncRun(result.rows[0]);
}

export async function recordSkippedInstagramSyncRun({
  triggerSource = "schedule",
  errorCode = "SYNC_LOCKED",
  errorMessage = "Another Instagram sync is already running.",
  client,
} = {}) {
  assertSyncClient(client, "recordSkippedInstagramSyncRun");
  const result = await runQuery(
    client,
    `INSERT INTO guide_app.instagram_sync_runs (
       trigger_source,
       status,
       started_at,
       finished_at,
       duration_ms,
       has_more,
       error_code,
       error_message
     )
     VALUES ($1, 'skipped', NOW(), NOW(), 0, FALSE, $2, $3)
     RETURNING *`,
    [
      text(triggerSource).slice(0, 64) || "schedule",
      safeSyncErrorCode(errorCode),
      safeSyncErrorMessage(errorMessage),
    ],
  );
  return toSyncRun(result.rows[0]);
}

/*
 * Finalise a run exactly once.
 *
 * The `status = 'running'` guard makes this idempotent: a concurrent or
 * repeated finalisation cannot overwrite an already terminal run.
 */
export async function finaliseInstagramSyncRun(
  runId,
  outcome = {},
  { client } = {},
) {
  assertSyncClient(client, "finaliseInstagramSyncRun");
  const status = text(outcome.status);
  if (!TERMINAL_SYNC_STATUSES.has(status)) {
    throw new Error(
      `finaliseInstagramSyncRun requires a terminal status, received "${status}"`,
    );
  }

  const error = outcome.error || {};
  const errorCode = safeSyncErrorCode(outcome.errorCode ?? error.code);
  const errorMessage = safeSyncErrorMessage(
    outcome.errorMessage ?? error.message,
  );
  const graphTraceId = optionalText(
    outcome.graphTraceId ?? error.graphTraceId ?? error.fbtraceId,
  );
  const accountFollowers = optionalMetric(outcome.accountFollowers);
  const accountMediaCount = optionalMetric(outcome.accountMediaCount);
  const hasAccountSnapshot =
    accountFollowers !== null || accountMediaCount !== null;
  const accountFetchedAt =
    optionalTimestamp(outcome.accountFetchedAt) ||
    (hasAccountSnapshot ? new Date().toISOString() : null);

  const result = await runQuery(
    client,
    `UPDATE guide_app.instagram_sync_runs
     SET status = $2,
         finished_at = NOW(),
         duration_ms = LEAST(
           2147483647,
           GREATEST(
             0,
             FLOOR(EXTRACT(EPOCH FROM (NOW() - started_at)) * 1000)::bigint
           )
         )::int,
         media_seen = $3,
         media_created = $4,
         media_updated = $5,
         stories_seen = $6,
         insights_attempted = $7,
         insights_failed = $8,
         has_more = $9,
         error_code = $10,
         error_message = $11,
         graph_trace_id = $12,
         account_followers = $13,
         account_media_count = $14,
         account_fetched_at = $15
     WHERE id = $1 AND status = 'running'
     RETURNING *`,
    [
      Number(runId),
      status,
      count(outcome.mediaSeen),
      count(outcome.mediaCreated),
      count(outcome.mediaUpdated),
      count(outcome.storiesSeen),
      count(outcome.insightsAttempted),
      count(outcome.insightsFailed),
      Boolean(outcome.hasMore),
      errorCode,
      errorMessage,
      graphTraceId ? graphTraceId.slice(0, 255) : null,
      accountFollowers,
      accountMediaCount,
      accountFetchedAt,
    ],
  );

  if (!result.rows[0]) {
    const existing = await getInstagramSyncRunById(runId, { client });
    return { finalised: false, run: existing };
  }

  return { finalised: true, run: toSyncRun(result.rows[0]) };
}

export async function getInstagramSyncRunById(runId, { client } = {}) {
  const result = await runQuery(
    client,
    `SELECT * FROM guide_app.instagram_sync_runs WHERE id = $1`,
    [Number(runId)],
  );
  return toSyncRun(result.rows[0]);
}

/*
 * Recover runs left behind by a killed process or a lost database connection.
 * These rows would otherwise keep a dashboard stuck on "running".
 */
export async function reconcileStaleInstagramSyncRuns({
  maxAgeMinutes = 10,
  client,
} = {}) {
  assertSyncClient(client, "reconcileStaleInstagramSyncRuns");
  const result = await runQuery(
    client,
    `UPDATE guide_app.instagram_sync_runs
     SET status = 'failed',
         finished_at = NOW(),
         duration_ms = LEAST(
           2147483647,
           GREATEST(
             0,
             FLOOR(EXTRACT(EPOCH FROM (NOW() - started_at)) * 1000)::bigint
           )
         )::int,
         error_code = COALESCE(error_code, 'SYNC_INTERRUPTED'),
         error_message = COALESCE(
           error_message,
           'The sync process stopped before it could finish.'
         )
     WHERE status = 'running'
       AND started_at < NOW() - ($1::int * INTERVAL '1 minute')
     RETURNING *`,
    [boundedMinutes(maxAgeMinutes, 10)],
  );

  return result.rows.map(toSyncRun);
}

export async function listInstagramSyncRuns({ limit = 20, client } = {}) {
  const result = await runQuery(
    client,
    `SELECT * FROM guide_app.instagram_sync_runs
     ORDER BY started_at DESC, id DESC
     LIMIT $1`,
    [boundedLimit(limit, 20, 100)],
  );
  return result.rows.map(toSyncRun);
}

/*
 * Derived status for the dashboard. A stale `running` row is reported as a
 * failed `SYNC_STALE` run even before reconciliation runs. The database is
 * never allowed to present a permanent "running" state to the UI.
 */
export async function getInstagramSyncStatus({
  staleAfterMinutes = 10,
  client,
} = {}) {
  const staleMinutes = boundedMinutes(staleAfterMinutes, 10);
  const latestResult = await runQuery(
    client,
    `SELECT *,
            (status = 'running'
             AND started_at < NOW() - ($1::int * INTERVAL '1 minute')) AS is_stale
     FROM guide_app.instagram_sync_runs
     ORDER BY started_at DESC, id DESC
     LIMIT 1`,
    [staleMinutes],
  );
  const latestRow = latestResult.rows[0];
  const latest = toSyncRun(latestRow);

  if (!latest) {
    return {
      status: "never",
      lastRunStatus: "never",
      isStale: false,
      lastRunStartedAt: null,
      lastAttemptAt: null,
      lastSuccessAt: null,
      hasMore: false,
      errorCode: null,
      errorMessage: null,
      accountFollowers: null,
      accountMediaCount: null,
      latestRun: null,
    };
  }

  const successResult = await runQuery(
    client,
    `SELECT * FROM guide_app.instagram_sync_runs
     WHERE status = 'success'
     ORDER BY finished_at DESC NULLS LAST, id DESC
     LIMIT 1`,
  );
  const lastSuccess = toSyncRun(successResult.rows[0]);

  // Fall back per field: a newer successful run that omits follower or media
  // counts must not hide the most recent captured values.
  const accountResult = await runQuery(
    client,
    `SELECT
       (SELECT account_followers
        FROM guide_app.instagram_sync_runs
        WHERE status = 'success' AND account_followers IS NOT NULL
        ORDER BY finished_at DESC NULLS LAST, id DESC
        LIMIT 1) AS account_followers,
       (SELECT account_media_count
        FROM guide_app.instagram_sync_runs
        WHERE status = 'success' AND account_media_count IS NOT NULL
        ORDER BY finished_at DESC NULLS LAST, id DESC
        LIMIT 1) AS account_media_count`,
  );
  const account = accountResult.rows[0] || {};

  let status = latest.status;
  let errorCode = latest.errorCode;
  let errorMessage = latest.errorMessage;
  const isStale = latestRow?.is_stale === true;

  if (status === "running" && isStale) {
    status = "failed";
    errorCode = "SYNC_STALE";
    errorMessage =
      "The sync did not finish within the expected time. It will be reconciled before the next run.";
  }

  const latestRun = isStale
    ? { ...latest, status, errorCode, errorMessage, isStale }
    : latest;

  return {
    status,
    lastRunStatus: status,
    isStale,
    lastRunStartedAt: latest.startedAt,
    lastAttemptAt: latest.finishedAt || latest.startedAt,
    lastSuccessAt: lastSuccess?.finishedAt || null,
    hasMore: latest.hasMore,
    errorCode,
    errorMessage,
    accountFollowers: optionalMetric(account.account_followers),
    accountMediaCount: optionalMetric(account.account_media_count),
    latestRun,
  };
}

/* ------------------------------------------------------------------ */
/* Advisory lock                                                       */
/* ------------------------------------------------------------------ */

/*
 * Run `callback` while holding the dedicated Instagram sync advisory lock.
 *
 * The lock is session-scoped in PostgreSQL, so acquisition, every run update
 * performed by the callback, and release must all use the exact same
 * `PoolClient`. If the unlock cannot be confirmed, the client is destroyed
 * rather than returned to the pool with an uncertain lock state. PostgreSQL
 * releases the lock automatically when that backend terminates.
 *
 * Returns `{ acquired: false }` when another sync already holds the lock.
 * Otherwise returns `{ acquired: true, result: <callback return value> }`.
 *
 * The callback receives a restricted, client-bound `query` interface. It
 * cannot release, end or otherwise manage the underlying connection. A
 * lifecycle helper called inside this scope without that exact client throws
 * instead of silently using the pool.
 */
export async function withInstagramSyncLock(callback) {
  if (typeof callback !== "function") {
    throw new TypeError("withInstagramSyncLock requires a callback");
  }

  const rawClient = await getPool().connect();
  const restricted = createRestrictedSyncClient(rawClient);
  let lockHeld = false;
  let destroy = false;

  try {
    const acquired = await rawClient.query(
      "SELECT pg_try_advisory_lock($1) AS locked",
      [INSTAGRAM_SYNC_LOCK_ID],
    );
    lockHeld = acquired.rows[0]?.locked === true;

    if (!lockHeld) {
      return { acquired: false };
    }

    const result = await syncLockScope.run({ client: restricted.client }, () =>
      callback(restricted.client),
    );
    return { acquired: true, result };
  } finally {
    restricted.close();

    if (lockHeld) {
      // A terminated backend can emit a late client-level error in addition to
      // rejecting the unlock query. Keep that from surfacing as an unhandled
      // event; the unlock result below still decides whether to destroy.
      const swallowConnectionError = () => {};
      rawClient.on("error", swallowConnectionError);

      try {
        const unlocked = await rawClient.query(
          "SELECT pg_advisory_unlock($1) AS unlocked",
          [INSTAGRAM_SYNC_LOCK_ID],
        );
        destroy = unlocked.rows[0]?.unlocked !== true;
      } catch {
        destroy = true;
      }

      if (!destroy) {
        rawClient.off("error", swallowConnectionError);
      }

      if (destroy) {
        console.error(
          "Instagram sync advisory lock could not be released; destroying the connection.",
        );
      }
    }

    releaseClient(rawClient, destroy);
  }
}
