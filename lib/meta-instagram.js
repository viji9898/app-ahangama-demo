import process from "node:process";

/*
 * Meta Graph API access for Ahangama's Instagram Business account.
 *
 * Server-side only. Never import this module from `src/` or any browser
 * bundle. The access token must stay in Netlify environment variables.
 *
 * Supported configuration:
 *
 *   META_SYSTEM_USER_ACCESS_TOKEN  System User token (required)
 *   META_PAGE_ID                   Facebook Page linked to the account (required)
 *   META_INSTAGRAM_ACCOUNT_ID      Instagram Business account id (required)
 *   META_GRAPH_API_VERSION         e.g. v26.0 (required)
 *
 * Only Ahangama's own Instagram account is read. Partner venue accounts are
 * not queried with these credentials; their content is assigned manually in
 * the dashboard.
 *
 * This module is read-only: it never writes to the database. The token is sent
 * in the Authorization header (never in the URL) and is removed from every
 * error message before it is returned or logged.
 */

const GRAPH_ORIGIN = "https://graph.facebook.com";
const DEFAULT_TIMEOUT_MS = 10000;

const ENV = {
  token: "META_SYSTEM_USER_ACCESS_TOKEN",
  pageId: "META_PAGE_ID",
  instagramAccountId: "META_INSTAGRAM_ACCOUNT_ID",
  graphApiVersion: "META_GRAPH_API_VERSION",
};

const PERMISSION_HINT =
  "Check that the System User has instagram_basic, pages_show_list, " +
  "pages_read_engagement and instagram_manage_insights, and that it is " +
  "assigned to both the Facebook Page and the Instagram account.";

const TOKEN_HINT =
  "The System User access token is invalid or expired. Generate a new token " +
  "and update META_SYSTEM_USER_ACCESS_TOKEN in the server environment.";

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

function readEnv(name) {
  return String(process.env[name] || "").trim();
}

function redactSecrets(value) {
  let result = String(value ?? "");
  for (const pattern of SECRET_PATTERNS) {
    result = result.replace(pattern, (match, prefix) =>
      typeof prefix === "string" ? `${prefix}${REDACTED}` : REDACTED,
    );
  }
  return result;
}

export function normalizeGraphApiVersion(value) {
  const normalized = String(value || "").trim();
  if (!/^v?\d+\.\d+$/.test(normalized)) return "";
  return normalized.startsWith("v") ? normalized : `v${normalized}`;
}

/*
 * Return the non-secret view of the Meta configuration. The access token is
 * deliberately never included in the result.
 */
export function getMetaConfig() {
  const token = readEnv(ENV.token);
  const pageId = readEnv(ENV.pageId);
  const instagramAccountId = readEnv(ENV.instagramAccountId);
  const rawVersion = readEnv(ENV.graphApiVersion);
  const graphApiVersion = normalizeGraphApiVersion(rawVersion);

  const missing = [];
  if (!token) missing.push(ENV.token);
  if (!pageId) missing.push(ENV.pageId);
  if (!instagramAccountId) missing.push(ENV.instagramAccountId);
  if (!rawVersion) missing.push(ENV.graphApiVersion);

  const invalid = [];
  if (pageId && !/^\d+$/.test(pageId)) {
    invalid.push(`${ENV.pageId} must be numeric`);
  }
  if (instagramAccountId && !/^\d+$/.test(instagramAccountId)) {
    invalid.push(`${ENV.instagramAccountId} must be numeric`);
  }
  if (rawVersion && !graphApiVersion) {
    invalid.push(`${ENV.graphApiVersion} must look like v26.0`);
  }
  if (token && token.length < 20) {
    invalid.push(`${ENV.token} looks too short to be a valid token`);
  }

  return {
    configured: missing.length === 0 && invalid.length === 0,
    hasAccessToken: Boolean(token),
    missing,
    invalid,
    pageId,
    instagramAccountId,
    graphApiVersion,
  };
}

export function isMetaConfigured() {
  return getMetaConfig().configured;
}

function describeGraphError(error, status) {
  const graphCode = Number(error?.code);
  const subcode = Number(error?.error_subcode) || null;

  let code = "META_REQUEST_FAILED";
  if (graphCode === 190 || graphCode === 102 || status === 401) {
    code = subcode === 463 ? "META_TOKEN_EXPIRED" : "META_TOKEN_INVALID";
  } else if (
    [200, 10, 298, 299].includes(graphCode) ||
    status === 403
  ) {
    code = "META_PERMISSION_DENIED";
  } else if (
    [4, 17, 32, 613].includes(graphCode) ||
    (graphCode >= 80000 && graphCode <= 80099) ||
    status === 429
  ) {
    code = "META_RATE_LIMITED";
  } else if (graphCode === 100) {
    code = "META_INVALID_REQUEST";
  }

  const message = redactSecrets(
    error?.error_user_msg ||
      error?.message ||
      `Graph API request failed with status ${status}`,
  );

  let hint = "";
  if (code === "META_PERMISSION_DENIED") hint = PERMISSION_HINT;
  if (code === "META_TOKEN_INVALID" || code === "META_TOKEN_EXPIRED") {
    hint = TOKEN_HINT;
  }

  return {
    code,
    message,
    hint,
    status: Number(status) || null,
    graphCode: Number.isFinite(graphCode) ? graphCode : null,
    subcode,
    fbtraceId: error?.fbtrace_id || null,
  };
}

function buildGraphUrl(version, path, params) {
  const cleanPath = String(path || "").replace(/^\/+/, "");
  if (!cleanPath) throw new Error("Graph API path is required");

  const url = new URL(`${GRAPH_ORIGIN}/${version}/${cleanPath}`);
  for (const [key, value] of Object.entries(params || {})) {
    if (value === undefined || value === null || value === "") continue;
    url.searchParams.set(key, String(value));
  }
  return url;
}

function configurationError(config) {
  const problems = [...config.missing, ...config.invalid];
  return {
    ok: false,
    error: {
      code: "META_NOT_CONFIGURED",
      message: problems.length
        ? `Missing or invalid Meta configuration: ${problems.join(", ")}`
        : "Meta configuration is incomplete",
      hint: "",
      missing: config.missing,
      invalid: config.invalid,
    },
  };
}

/*
 * Execute a fully-built Graph URL. Kept private so every request path shares
 * the same timeout, bearer-header authentication and error redaction.
 */
async function executeGraphRequest(url, { timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const config = getMetaConfig();
  const token = readEnv(ENV.token);

  if (!config.configured || !token) return configurationError(config);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      signal: controller.signal,
    });

    const text = await response.text();
    let body = null;
    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        body = null;
      }
    }

    if (!response.ok || body?.error) {
      return {
        ok: false,
        status: response.status,
        error: describeGraphError(body?.error, response.status),
      };
    }

    if (!body || typeof body !== "object") {
      return {
        ok: false,
        status: response.status,
        error: {
          code: "META_INVALID_RESPONSE",
          message: `Graph API returned a non-JSON response (status ${response.status})`,
          hint: "",
        },
      };
    }

    return { ok: true, data: body, status: response.status };
  } catch (error) {
    if (error?.name === "AbortError") {
      return {
        ok: false,
        error: {
          code: "META_TIMEOUT",
          message: `Graph API request timed out after ${timeoutMs} ms`,
          hint: "",
        },
      };
    }

    return {
      ok: false,
      error: {
        code: "META_NETWORK_ERROR",
        message: redactSecrets(error?.message || "Graph API request failed"),
        hint: "",
      },
    };
  } finally {
    clearTimeout(timer);
  }
}

/*
 * Run a single read-only Graph API request.
 *
 * Returns `{ ok: true, data, status }` or `{ ok: false, error }`. Network and
 * permission failures are values rather than exceptions so callers can report
 * a missing permission without breaking a whole report.
 */
export async function metaGraphRequest(
  path,
  { params = {}, timeoutMs = DEFAULT_TIMEOUT_MS } = {},
) {
  const config = getMetaConfig();

  if (!config.configured || !readEnv(ENV.token)) {
    return configurationError(config);
  }

  let url;
  try {
    url = buildGraphUrl(config.graphApiVersion, path, params);
  } catch (error) {
    return {
      ok: false,
      error: {
        code: "META_INVALID_REQUEST",
        message: redactSecrets(error.message),
        hint: "",
      },
    };
  }

  return executeGraphRequest(url, { timeoutMs });
}

/* ------------------------------------------------------------------ */
/* Read-only helpers                                                   */
/* ------------------------------------------------------------------ */

const PAGE_FIELDS = "id,name,instagram_business_account{id,username}";
const ACCOUNT_FIELDS =
  "id,username,name,followers_count,media_count";
const MEDIA_FIELDS =
  "id,caption,media_type,media_product_type,permalink,media_url," +
  "thumbnail_url,timestamp,username,like_count,comments_count," +
  "children{id,media_type,media_url,thumbnail_url,permalink,timestamp}";
const STORY_FIELDS =
  "id,media_type,media_product_type,permalink,media_url,thumbnail_url," +
  "timestamp,username";

export function getPageWithInstagramAccount() {
  const { pageId } = getMetaConfig();
  return metaGraphRequest(pageId, { params: { fields: PAGE_FIELDS } });
}

export function getInstagramAccount() {
  const { instagramAccountId } = getMetaConfig();
  return metaGraphRequest(instagramAccountId, {
    params: { fields: ACCOUNT_FIELDS },
  });
}

export function listInstagramMedia({ limit = 3 } = {}) {
  const { instagramAccountId } = getMetaConfig();
  return metaGraphRequest(`${instagramAccountId}/media`, {
    params: { fields: MEDIA_FIELDS, limit },
  });
}

export function listInstagramStories({ limit = 3 } = {}) {
  const { instagramAccountId } = getMetaConfig();
  return metaGraphRequest(`${instagramAccountId}/stories`, {
    params: { fields: STORY_FIELDS, limit },
  });
}

export function getInstagramAccountInsights({
  metric = "reach",
  period = "day",
  since,
  until,
} = {}) {
  const { instagramAccountId } = getMetaConfig();
  return metaGraphRequest(`${instagramAccountId}/insights`, {
    params: { metric, period, since, until },
  });
}

export function getInstagramMediaInsights(
  mediaId,
  { metric = "reach", timeoutMs = DEFAULT_TIMEOUT_MS } = {},
) {
  if (!mediaId) {
    return Promise.resolve({
      ok: false,
      error: {
        code: "META_INVALID_REQUEST",
        message: "mediaId is required",
        hint: "",
      },
    });
  }

  return metaGraphRequest(`${mediaId}/insights`, { params: { metric }, timeoutMs });
}

/* ------------------------------------------------------------------ */
/* Phase 2A read-only retrieval                                        */
/* ------------------------------------------------------------------ */

/*
 * Metadata and insight retrieval for the media assignment queue.
 *
 * This layer only reads from Meta. It does not import the database, write
 * rows, schedule work or retry requests. The normalised shape below mirrors
 * the Phase 1 `guide_app.instagram_media` contract so Phase 2B can persist it
 * without reshaping the data:
 *
 *   {
 *     ok, readOnly, retrievedAt, graphApiVersion,
 *     account: { id, username },
 *     media:   collection,
 *     stories: collection,
 *     insights: summary,
 *     errors: [...], warnings: [...]
 *   }
 *
 *   collection = {
 *     ok, items, counts: { total, byMediaType, byProductType },
 *     pagination: {
 *       pages, itemsFetched, unique, duplicates, truncated,
 *       stoppedReason, error
 *     },
 *     error
 *   }
 *
 *   item = {
 *     media: {
 *       igMediaId, mediaType, mediaProductType, caption, permalink,
 *       mediaUrl, thumbnailUrl, postedAt, storyExpiresAt, username,
 *       likeCount, commentsCount, children[]
 *     },
 *     insights: { views, reach, likes, comments, shares, saves },
 *     insightState: {
 *       status, supported[], unavailable[], errors[], reason?
 *     },
 *     retrievedAt, metricsFetchedAt, metricsCapturedAt
 *   }
 *
 * Missing insight values stay `null`; they are never replaced with zero.
 */

const RETRIEVAL_DEFAULTS = {
  pageSize: 50,
  maxPages: 20,
  maxMediaItems: 200,
  maxStoryItems: 100,
  maxInsightItems: 50,
  includeInsights: true,
};

const MAX_PAGE_SIZE = 100;

/*
 * Metrics that are actually supported for each product type in the Graph API
 * version used by this project, mapped to the Phase 1 column names.
 *
 * Meta's metric is `saved`; the database column is `saves`.
 *
 * Stories also support navigation, replies and link_clicks. They are
 * deliberately not requested in Phase 2A because the Phase 1 contract defers
 * those columns to a later release. `impressions` is not requested at all:
 * it is unsupported from v22.0 onward and `views` replaces it.
 */
export const INSTAGRAM_INSIGHT_METRICS = Object.freeze({
  FEED: Object.freeze([
    "views",
    "reach",
    "likes",
    "comments",
    "shares",
    "saved",
  ]),
  REELS: Object.freeze([
    "views",
    "reach",
    "likes",
    "comments",
    "shares",
    "saved",
  ]),
  STORY: Object.freeze(["views", "reach", "shares"]),
});

const CONTRACT_METRICS = Object.freeze([
  "views",
  "reach",
  "likes",
  "comments",
  "shares",
  "saves",
]);

const FATAL_INSIGHT_CODES = new Set([
  "META_TOKEN_INVALID",
  "META_TOKEN_EXPIRED",
  "META_PERMISSION_DENIED",
  "META_NOT_CONFIGURED",
  "META_RATE_LIMITED",
]);

function clampInteger(value, fallback, minimum, maximum) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(maximum, Math.max(minimum, Math.trunc(parsed)));
}

function optionalCount(value) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function optionalIso(value) {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? new Date(parsed).toISOString() : null;
}

function storyExpiry(postedAt) {
  if (!postedAt) return null;
  const parsed = Date.parse(postedAt);
  if (!Number.isFinite(parsed)) return null;
  return new Date(parsed + 24 * 60 * 60 * 1000).toISOString();
}

function safeError(error) {
  if (!error) return null;
  return {
    code: error.code || "META_REQUEST_FAILED",
    message: redactSecrets(error.message || "Meta request failed"),
    hint: redactSecrets(error.hint || ""),
    status: Number.isFinite(Number(error.status)) ? Number(error.status) : null,
    graphCode: Number.isFinite(Number(error.graphCode))
      ? Number(error.graphCode)
      : null,
    subcode: Number.isFinite(Number(error.subcode)) ? Number(error.subcode) : null,
  };
}

function describeUnsupported(error) {
  const message = String(error?.message || "");
  return (
    error?.code === "META_INVALID_REQUEST" &&
    /does not support|no longer supported|must be one of/i.test(message)
  );
}

function metricSetFor(mediaProductType) {
  if (mediaProductType === "STORY") return INSTAGRAM_INSIGHT_METRICS.STORY;
  if (mediaProductType === "REELS") return INSTAGRAM_INSIGHT_METRICS.REELS;
  return INSTAGRAM_INSIGHT_METRICS.FEED;
}

function emptyInsights() {
  return Object.fromEntries(CONTRACT_METRICS.map((metric) => [metric, null]));
}

function readInsightValue(row) {
  const total = Number(row?.total_value?.value);
  if (Number.isFinite(total) && total >= 0) return total;

  if (!Array.isArray(row?.values)) return null;

  const numbers = row.values
    .map((entry) => Number(entry?.value))
    .filter((value) => Number.isFinite(value) && value >= 0);

  if (!numbers.length) return null;
  // Media insights are lifetime totals. Summing also handles a version that
  // returns more than one value entry without dropping data.
  return numbers.reduce((sum, value) => sum + value, 0);
}

function applyInsightRows(insights, rows) {
  const found = new Set();
  for (const row of Array.isArray(rows) ? rows : []) {
    const column = row?.name === "saved" ? "saves" : row?.name;
    if (!CONTRACT_METRICS.includes(column)) continue;
    const value = readInsightValue(row);
    if (value === null) continue;
    insights[column] = value;
    found.add(column);
  }
  return found;
}

function insightStatus(found, requested, errors) {
  if (found.size === requested.length) return "ok";
  if (found.size > 0) return "partial";
  if (errors.length > 0 && errors.every((error) => error.unsupported)) {
    return "unavailable";
  }
  return "error";
}

/*
 * Fetch one media item's insights. A combined request is used first because it
 * costs one call. If Meta rejects the combination, each metric is retried on
 * its own so an unsupported metric is recorded as unavailable instead of
 * failing the supported ones.
 */
async function fetchInsightsForItem(item, { timeoutMs }) {
  const productType = item.media.mediaProductType;
  const requested = [...metricSetFor(productType)];
  const insights = emptyInsights();
  const errors = [];
  const supported = [];
  const unavailable = [];

  const combined = await getInstagramMediaInsights(item.media.igMediaId, {
    metric: requested.join(","),
    timeoutMs,
  });

  if (combined.ok) {
    const found = applyInsightRows(insights, combined.data?.data);
    for (const metric of requested) {
      if (found.has(metric === "saved" ? "saves" : metric)) supported.push(metric);
    }
    for (const metric of requested) {
      if (!found.has(metric === "saved" ? "saves" : metric)) unavailable.push(metric);
    }
    if (!found.size) {
      errors.push({
        code: "META_INVALID_RESPONSE",
        message: "The insights response did not contain any metric values",
        hint: "",
        status: 200,
        graphCode: null,
        subcode: null,
        unsupported: false,
      });
    }
    const status =
      found.size === requested.length ? "ok" : found.size ? "partial" : "error";
    return { insights, state: { status, supported, unavailable, errors }, fatal: false };
  }

  const combinedError = safeError(combined.error);
  const fatal = FATAL_INSIGHT_CODES.has(combinedError.code);

  if (!describeUnsupported(combinedError) || requested.length === 1) {
    errors.push({ ...combinedError, unsupported: describeUnsupported(combinedError) });
    return {
      insights,
      state: {
        status: describeUnsupported(combinedError) ? "unavailable" : "error",
        supported,
        unavailable: describeUnsupported(combinedError) ? [...requested] : [],
        errors,
        reason: combinedError.code,
      },
      fatal,
    };
  }

  const found = new Set();
  for (const metric of requested) {
    const single = await getInstagramMediaInsights(item.media.igMediaId, {
      metric,
      timeoutMs,
    });
    if (single.ok) {
      const metricFound = applyInsightRows(insights, single.data?.data);
      if (metricFound.size) {
        found.add(metric === "saved" ? "saves" : metric);
        supported.push(metric);
      } else {
        unavailable.push(metric);
      }
      continue;
    }

    const error = safeError(single.error);
    const unsupported = describeUnsupported(error);
    errors.push({ ...error, metric, unsupported });
    if (unsupported) {
      unavailable.push(metric);
    } else if (FATAL_INSIGHT_CODES.has(error.code)) {
      return {
        insights,
        state: {
          status: insightStatus(found, requested, errors),
          supported,
          unavailable,
          errors,
          reason: error.code,
        },
        fatal: true,
      };
    }
  }

  return {
    insights,
    state: {
      status: insightStatus(found, requested, errors),
      supported,
      unavailable,
      errors,
    },
    fatal: false,
  };
}

/*
 * Capture insights for one already-known media item.
 *
 * Phase 2C uses this after metadata discovery so a run can refresh a bounded,
 * database-selected slice of the library instead of always re-fetching the
 * newest retrieval page. It reuses the same metric sets, `saved` -> `saves`
 * mapping and unsupported/fatal classification as `retrieveInstagramContent`.
 * Read-only: it never writes to PostgreSQL.
 */
export async function captureInstagramMediaInsights(
  media,
  { timeoutMs = DEFAULT_TIMEOUT_MS } = {},
) {
  const igMediaId = String(media?.igMediaId ?? media?.media_id ?? media?.id ?? "");
  const mediaProductType =
    media?.mediaProductType ?? media?.media_product_type ?? null;
  const requestedTimeout = clampInteger(
    timeoutMs,
    DEFAULT_TIMEOUT_MS,
    1000,
    60000,
  );

  if (!igMediaId) {
    return {
      insights: emptyInsights(),
      insightState: {
        status: "error",
        supported: [],
        unavailable: [],
        errors: [
          {
            code: "META_INVALID_REQUEST",
            message: "mediaId is required",
            hint: "",
            status: null,
            graphCode: null,
            subcode: null,
            unsupported: false,
          },
        ],
        reason: "META_INVALID_REQUEST",
      },
      metricsFetchedAt: new Date().toISOString(),
      metricsCapturedAt: null,
      fatal: false,
    };
  }

  const result = await fetchInsightsForItem(
    { media: { igMediaId, mediaProductType } },
    { timeoutMs: requestedTimeout },
  );
  const captured =
    result.state.status === "ok" || result.state.status === "partial";
  const fetchedAt = new Date().toISOString();

  return {
    insights: result.insights,
    insightState: result.state,
    metricsFetchedAt: fetchedAt,
    metricsCapturedAt: captured ? fetchedAt : null,
    fatal: result.fatal === true,
  };
}

function normalizeChild(child) {
  return {
    igMediaId: String(child?.id || ""),
    mediaType: child?.media_type || null,
    mediaUrl: child?.media_url || null,
    thumbnailUrl: child?.thumbnail_url || null,
    permalink: child?.permalink || null,
    postedAt: optionalIso(child?.timestamp),
  };
}

function normalizeItem(raw, { isStory, retrievedAt }) {
  const postedAt = optionalIso(raw?.timestamp);

  return {
    media: {
      igMediaId: String(raw?.id || ""),
      mediaType: raw?.media_type || null,
      mediaProductType: raw?.media_product_type || null,
      caption: raw?.caption ?? null,
      permalink: raw?.permalink || null,
      mediaUrl: raw?.media_url || null,
      thumbnailUrl: raw?.thumbnail_url || null,
      postedAt,
      storyExpiresAt: isStory ? storyExpiry(postedAt) : null,
      username: raw?.username || null,
      likeCount: optionalCount(raw?.like_count),
      commentsCount: optionalCount(raw?.comments_count),
      children: Array.isArray(raw?.children?.data)
        ? raw.children.data.map(normalizeChild)
        : [],
    },
    insights: emptyInsights(),
    insightState: {
      status: isStory ? "pending" : "pending",
      supported: [],
      unavailable: [],
      errors: [],
    },
    retrievedAt,
    metricsFetchedAt: null,
    metricsCapturedAt: null,
  };
}

/*
 * Only Graph API pagination URLs are followed. `paging.next` sometimes carries
 * the access token in its query string; it is stripped and the bearer header
 * is used instead so the token never appears in a URL or an error message.
 */
function sanitizePagingUrl(rawUrl) {
  let url;
  try {
    url = new URL(String(rawUrl || ""));
  } catch {
    return { error: "pagination cursor is not a valid URL" };
  }

  if (url.protocol !== "https:" || url.hostname !== "graph.facebook.com") {
    return { error: "pagination cursor does not point at the Graph API" };
  }

  url.searchParams.delete("access_token");
  url.searchParams.delete("appsecret_proof");
  return { url };
}

async function paginateCollection({
  path,
  fields,
  pageSize,
  maxPages,
  maxItems,
  timeoutMs,
  kind,
}) {
  const items = [];
  const seenIds = new Set();
  const seenNextUrls = new Set();
  const pagination = {
    pages: 0,
    itemsFetched: 0,
    unique: 0,
    duplicates: 0,
    truncated: false,
    stoppedReason: null,
    error: null,
  };
  const warnings = [];

  let response = await metaGraphRequest(path, {
    params: { fields, limit: pageSize },
    timeoutMs,
  });

  while (true) {
    if (!response.ok) {
      pagination.error = safeError(response.error);
      pagination.stoppedReason = "error";
      break;
    }

    const pageItems = response.data?.data;
    if (!Array.isArray(pageItems)) {
      pagination.error = {
        code: "META_INVALID_RESPONSE",
        message: `The ${kind} endpoint did not return a data array`,
        hint: "",
        status: null,
        graphCode: null,
        subcode: null,
      };
      pagination.stoppedReason = "error";
      break;
    }

    pagination.pages += 1;
    pagination.itemsFetched += pageItems.length;

    for (const raw of pageItems) {
      const id = String(raw?.id || "").trim();
      if (!id) {
        warnings.push({
          code: "META_MEDIA_WITHOUT_ID",
          message: `A ${kind} item without an id was skipped`,
        });
        continue;
      }
      if (seenIds.has(id)) {
        pagination.duplicates += 1;
        continue;
      }
      seenIds.add(id);
      items.push(raw);
      if (items.length >= maxItems) break;
    }

    pagination.unique = items.length;

    if (items.length >= maxItems) {
      pagination.truncated = true;
      pagination.stoppedReason = "max_items";
      break;
    }

    const next = response.data?.paging?.next;
    if (!next) {
      pagination.stoppedReason = "end";
      break;
    }

    if (pagination.pages >= maxPages) {
      pagination.truncated = true;
      pagination.stoppedReason = "max_pages";
      break;
    }

    const sanitized = sanitizePagingUrl(next);
    if (sanitized.error) {
      pagination.error = {
        code: "META_INVALID_CURSOR",
        message: sanitized.error,
        hint: "",
        status: null,
        graphCode: null,
        subcode: null,
      };
      pagination.stoppedReason = "invalid_cursor";
      break;
    }

    const nextUrl = sanitized.url.toString();
    if (seenNextUrls.has(nextUrl)) {
      pagination.error = {
        code: "META_PAGINATION_LOOP",
        message: "The Graph API pagination cursor repeated; stopped to avoid a loop",
        hint: "",
        status: null,
        graphCode: null,
        subcode: null,
      };
      pagination.stoppedReason = "loop";
      break;
    }
    seenNextUrls.add(nextUrl);

    response = await executeGraphRequest(sanitized.url, { timeoutMs });
  }

  return { rawItems: items, pagination, warnings };
}

function buildCollection(rawItems, { isStory, retrievedAt, pagination, error, warnings }) {
  const items = rawItems.map((raw) => normalizeItem(raw, { isStory, retrievedAt }));
  const byMediaType = {};
  const byProductType = {};

  for (const item of items) {
    const mediaType = item.media.mediaType || "UNKNOWN";
    const productType = item.media.mediaProductType || "UNKNOWN";
    byMediaType[mediaType] = (byMediaType[mediaType] || 0) + 1;
    byProductType[productType] = (byProductType[productType] || 0) + 1;
  }

  return {
    ok: !error,
    items,
    counts: { total: items.length, byMediaType, byProductType },
    pagination,
    error,
    warnings,
  };
}

function summarizeInsights(items) {
  const summary = {
    requested: 0,
    ok: 0,
    partial: 0,
    unavailable: 0,
    error: 0,
    skipped: 0,
    fatalError: null,
  };

  for (const item of items) {
    const state = item.insightState;
    if (state.status === "pending") continue;
    summary.requested += 1;
    if (state.status === "skipped") summary.skipped += 1;
    else if (state.status in summary) summary[state.status] += 1;
    if (state.fatalError && !summary.fatalError) summary.fatalError = state.fatalError;
  }

  return summary;
}

async function addInsights(items, { maxInsightItems, timeoutMs, warnings }) {
  let fatalError = null;

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const fetchedAt = new Date().toISOString();

    if (fatalError) {
      item.insightState = {
        status: "skipped",
        supported: [],
        unavailable: [],
        errors: [],
        reason: fatalError.code,
      };
      continue;
    }

    if (index >= maxInsightItems) {
      item.insightState = {
        status: "skipped",
        supported: [],
        unavailable: [],
        errors: [],
        reason: "insight_limit",
      };
      warnings.push({
        code: "INSIGHT_LIMIT_REACHED",
        message: `Insights were only requested for the first ${maxInsightItems} item(s)`,
      });
      continue;
    }

    const result = await fetchInsightsForItem(item, { timeoutMs });
    item.insights = result.insights;
    item.insightState = result.state;
    item.metricsFetchedAt = fetchedAt;
    if (result.state.status === "ok" || result.state.status === "partial") {
      item.metricsCapturedAt = fetchedAt;
    }

    if (result.fatal && !fatalError) {
      fatalError = {
        code: result.state.reason || "META_REQUEST_FAILED",
        message: "Insight retrieval stopped after a fatal Meta API error",
      };
      item.insightState.fatalError = fatalError;
    }
  }

  return fatalError;
}

/*
 * Retrieve posts, carousels, Reels and active Stories with safe pagination and
 * per-item insights. Never throws for expected Meta failures: failures are
 * values in `errors`, `warnings` and each collection's `error`.
 */
export async function retrieveInstagramContent(options = {}) {
  const config = getMetaConfig();
  const retrievedAt = new Date().toISOString();
  const pageSize = clampInteger(options.pageSize, RETRIEVAL_DEFAULTS.pageSize, 1, MAX_PAGE_SIZE);
  const maxPages = clampInteger(options.maxPages, RETRIEVAL_DEFAULTS.maxPages, 1, 100);
  const maxMediaItems = clampInteger(
    options.maxMediaItems,
    RETRIEVAL_DEFAULTS.maxMediaItems,
    1,
    1000,
  );
  const maxStoryItems = clampInteger(
    options.maxStoryItems,
    RETRIEVAL_DEFAULTS.maxStoryItems,
    1,
    1000,
  );
  const maxInsightItems = clampInteger(
    options.maxInsightItems,
    RETRIEVAL_DEFAULTS.maxInsightItems,
    0,
    500,
  );
  const includeInsights =
    options.includeInsights ?? RETRIEVAL_DEFAULTS.includeInsights;
  const timeoutMs = clampInteger(options.timeoutMs, DEFAULT_TIMEOUT_MS, 1000, 60000);

  if (!config.configured) {
    return {
      ok: false,
      readOnly: true,
      retrievedAt,
      graphApiVersion: config.graphApiVersion || null,
      account: { id: config.instagramAccountId || null, username: null },
      media: null,
      stories: null,
      insights: {
        requested: 0,
        ok: 0,
        partial: 0,
        unavailable: 0,
        error: 0,
        skipped: 0,
        fatalError: null,
      },
      errors: [configurationError(config).error],
      warnings: [],
    };
  }

  const warnings = [];
  const [mediaPaged, storyPaged] = await Promise.all([
    paginateCollection({
      path: `${config.instagramAccountId}/media`,
      fields: MEDIA_FIELDS,
      pageSize,
      maxPages,
      maxItems: maxMediaItems,
      timeoutMs,
      kind: "media",
    }),
    paginateCollection({
      path: `${config.instagramAccountId}/stories`,
      fields: STORY_FIELDS,
      pageSize,
      maxPages,
      maxItems: maxStoryItems,
      timeoutMs,
      kind: "stories",
    }),
  ]);

  const media = buildCollection(mediaPaged.rawItems, {
    isStory: false,
    retrievedAt,
    pagination: mediaPaged.pagination,
    error: mediaPaged.pagination.error,
    warnings: mediaPaged.warnings,
  });
  const stories = buildCollection(storyPaged.rawItems, {
    isStory: true,
    retrievedAt,
    pagination: storyPaged.pagination,
    error: storyPaged.pagination.error,
    warnings: storyPaged.warnings,
  });

  warnings.push(...media.warnings, ...stories.warnings);

  const allItems = [...media.items, ...stories.items];
  let fatalInsightError = null;

  if (includeInsights && allItems.length) {
    fatalInsightError = await addInsights(allItems, {
      maxInsightItems,
      timeoutMs,
      warnings,
    });
  } else {
    for (const item of allItems) {
      item.insightState = {
        status: "skipped",
        supported: [],
        unavailable: [],
        errors: [],
        reason: includeInsights ? "no_items" : "disabled",
      };
    }
  }

  const insightSummary = summarizeInsights(allItems);
  insightSummary.fatalError = fatalInsightError;

  const errors = [];
  if (media.error) errors.push({ scope: "media", ...media.error });
  if (stories.error) errors.push({ scope: "stories", ...stories.error });
  if (fatalInsightError) errors.push({ scope: "insights", ...fatalInsightError });

  const username =
    allItems.find((item) => item.media.username)?.media.username || null;

  return {
    ok: !media.error && !stories.error && !fatalInsightError,
    readOnly: true,
    retrievedAt,
    graphApiVersion: config.graphApiVersion,
    account: { id: config.instagramAccountId, username },
    media,
    stories,
    insights: insightSummary,
    errors,
    warnings,
  };
}
