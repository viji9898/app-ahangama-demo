import {
  finaliseInstagramSyncRun,
  getInstagramMediaRefreshQueue,
  reconcileStaleInstagramSyncRuns,
  recordSkippedInstagramSyncRun,
  startInstagramSyncRun,
  withInstagramSyncLock,
} from "./venue-stats-db.js";
import {
  captureInstagramMediaInsights,
  retrieveInstagramContent,
} from "./meta-instagram.js";
import {
  persistInstagramCollection,
  persistInstagramRetrieval,
} from "./instagram-sync-persistence.js";

/*
 * Phase 2C sync orchestration.
 *
 * One invocation:
 *   1. acquires the existing PostgreSQL advisory lock,
 *   2. reconciles stale runs and starts a new audit row,
 *   3. retrieves metadata for media and active Stories without insights,
 *   4. persists that metadata through Phase 2B,
 *   5. refreshes a bounded, database-selected slice of insights,
 *   6. finalises the audit row and returns a structured summary.
 *
 * It deliberately does not schedule itself, run a Netlify function, retry,
 * assign venues or delete media. The refresh queue is ordered by Phase 1, so
 * repeated runs rotate through the library instead of always refreshing the
 * same newest items.
 */

const DEFAULT_OPTIONS = Object.freeze({
  triggerSource: "manual",
  timeBudgetMs: 20000,
  reserveMs: 2500,
  maxInsightItems: 10,
  pageSize: 100,
  maxPages: 10,
  maxMediaItems: 1000,
  maxStoryItems: 100,
  requestTimeoutMs: 8000,
  insightTimeoutMs: 8000,
  staleAfterMinutes: 180,
  retryAfterMinutes: 60,
  reconcileAfterMinutes: 10,
  includeInsights: true,
});

const FATAL_INSIGHT_CODES = new Set([
  "META_TOKEN_INVALID",
  "META_TOKEN_EXPIRED",
  "META_PERMISSION_DENIED",
  "META_NOT_CONFIGURED",
  "META_RATE_LIMITED",
]);

const DEFAULT_DEPENDENCIES = Object.freeze({
  withLock: withInstagramSyncLock,
  reconcileRuns: reconcileStaleInstagramSyncRuns,
  startRun: startInstagramSyncRun,
  finaliseRun: finaliseInstagramSyncRun,
  recordSkippedRun: recordSkippedInstagramSyncRun,
  retrieve: retrieveInstagramContent,
  persist: persistInstagramRetrieval,
  persistCollection: persistInstagramCollection,
  refreshQueue: getInstagramMediaRefreshQueue,
  captureInsights: captureInstagramMediaInsights,
  now: () => Date.now(),
});

function integer(value, fallback, minimum, maximum) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(maximum, Math.max(minimum, Math.trunc(parsed)));
}

function safeMessage(value) {
  return String(value || "")
    .replace(/postgres(?:ql)?:\/\/\S+/gi, "[database-url]")
    .replace(/\bEAA[A-Za-z0-9_-]{10,}\b/g, "[redacted]")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500);
}

function normalizeOptions(options) {
  const timeBudgetMs = integer(
    options.timeBudgetMs,
    DEFAULT_OPTIONS.timeBudgetMs,
    1000,
    300000,
  );
  const reserveMs = Math.min(
    integer(options.reserveMs, DEFAULT_OPTIONS.reserveMs, 0, 60000),
    Math.max(0, timeBudgetMs - 1000),
  );

  return {
    triggerSource:
      String(options.triggerSource || DEFAULT_OPTIONS.triggerSource)
        .trim()
        .slice(0, 64) || DEFAULT_OPTIONS.triggerSource,
    timeBudgetMs,
    reserveMs,
    maxInsightItems: integer(
      options.maxInsightItems,
      DEFAULT_OPTIONS.maxInsightItems,
      0,
      100,
    ),
    pageSize: integer(options.pageSize, DEFAULT_OPTIONS.pageSize, 1, 100),
    maxPages: integer(options.maxPages, DEFAULT_OPTIONS.maxPages, 1, 100),
    maxMediaItems: integer(
      options.maxMediaItems,
      DEFAULT_OPTIONS.maxMediaItems,
      1,
      1000,
    ),
    maxStoryItems: integer(
      options.maxStoryItems,
      DEFAULT_OPTIONS.maxStoryItems,
      1,
      1000,
    ),
    requestTimeoutMs: integer(
      options.requestTimeoutMs,
      DEFAULT_OPTIONS.requestTimeoutMs,
      1000,
      60000,
    ),
    insightTimeoutMs: integer(
      options.insightTimeoutMs,
      DEFAULT_OPTIONS.insightTimeoutMs,
      1000,
      60000,
    ),
    staleAfterMinutes: integer(
      options.staleAfterMinutes,
      DEFAULT_OPTIONS.staleAfterMinutes,
      1,
      10080,
    ),
    retryAfterMinutes: integer(
      options.retryAfterMinutes,
      DEFAULT_OPTIONS.retryAfterMinutes,
      1,
      10080,
    ),
    reconcileAfterMinutes: integer(
      options.reconcileAfterMinutes,
      DEFAULT_OPTIONS.reconcileAfterMinutes,
      1,
      1440,
    ),
    includeInsights: options.includeInsights !== false,
  };
}

function assertDependencies(deps) {
  for (const name of [
    "withLock",
    "reconcileRuns",
    "startRun",
    "finaliseRun",
    "recordSkippedRun",
    "retrieve",
    "persist",
    "persistCollection",
    "refreshQueue",
    "captureInsights",
    "now",
  ]) {
    if (typeof deps[name] !== "function") {
      throw new TypeError(`Instagram sync dependency ${name} must be a function`);
    }
  }
}

function errorEntry(scope, error, fallbackCode) {
  return {
    scope,
    code: error?.code || fallbackCode,
    message: safeMessage(error?.message || error || "Instagram sync failed."),
  };
}

function emptyCounts() {
  return {
    mediaSeen: 0,
    mediaCreated: 0,
    mediaUpdated: 0,
    storiesSeen: 0,
    insightsAttempted: 0,
    insightsSucceeded: 0,
    insightsPartial: 0,
    insightsFailed: 0,
    insightsUnavailable: 0,
    insightsSkipped: 0,
  };
}

function emptyCollections() {
  return { media: null, stories: null, insights: null };
}

function captureStatus(capture) {
  const status = String(capture?.insightState?.status || "error").toLowerCase();
  if (status === "pending") return "skipped";
  if (
    status === "ok" ||
    status === "partial" ||
    status === "error" ||
    status === "unavailable" ||
    status === "skipped"
  ) {
    return status;
  }
  return "error";
}

function firstInsightError(capture) {
  const errors = capture?.insightState?.errors;
  if (Array.isArray(errors) && errors.length > 0) {
    return {
      code: errors[0]?.code || "METRICS_FAILED",
      message: safeMessage(
        errors[0]?.message || "Instagram insight capture failed.",
      ),
    };
  }
  return {
    code: capture?.insightState?.reason || "METRICS_FAILED",
    message: "Instagram insight capture failed.",
  };
}

function captureItem(media, capture) {
  return {
    media: {
      igMediaId: media?.igMediaId ?? null,
      mediaType: media?.mediaType ?? null,
      mediaProductType: media?.mediaProductType ?? null,
      permalink: media?.permalink ?? null,
      caption: media?.caption ?? null,
      mediaUrl: media?.mediaUrl ?? null,
      thumbnailUrl: media?.thumbnailUrl ?? null,
      postedAt: media?.postedAt ?? null,
      storyExpiresAt: media?.storyExpiresAt ?? null,
    },
    insights: capture?.insights ?? {},
    insightState: capture?.insightState ?? {
      status: "error",
      supported: [],
      unavailable: [],
      errors: [],
      reason: "METRICS_FAILED",
    },
    metricsFetchedAt: capture?.metricsFetchedAt ?? null,
    metricsCapturedAt: capture?.metricsCapturedAt ?? null,
  };
}

function mergeSummaries(target, source) {
  if (!source) return target;
  if (!target) {
    return { ...source, items: [...(source.items || [])] };
  }

  return {
    ok: target.ok && source.ok,
    skipped: target.skipped || source.skipped,
    itemsSeen: target.itemsSeen + source.itemsSeen,
    persisted: target.persisted + source.persisted,
    created: target.created + source.created,
    updated: target.updated + source.updated,
    metricsCaptured: target.metricsCaptured + source.metricsCaptured,
    metricsFailed: target.metricsFailed + source.metricsFailed,
    metricsSkipped: target.metricsSkipped + source.metricsSkipped,
    failed: target.failed + source.failed,
    items: [...target.items, ...(source.items || [])],
    error: target.error || source.error || null,
  };
}

function countCaptures(captures) {
  const counts = {
    insightsAttempted: 0,
    insightsSucceeded: 0,
    insightsPartial: 0,
    insightsFailed: 0,
    insightsUnavailable: 0,
    insightsSkipped: 0,
  };

  for (const { status } of captures) {
    if (status === "ok") {
      counts.insightsAttempted += 1;
      counts.insightsSucceeded += 1;
    } else if (status === "partial") {
      counts.insightsAttempted += 1;
      counts.insightsPartial += 1;
    } else if (status === "error") {
      counts.insightsAttempted += 1;
      counts.insightsFailed += 1;
    } else if (status === "unavailable") {
      counts.insightsAttempted += 1;
      counts.insightsUnavailable += 1;
    } else {
      counts.insightsSkipped += 1;
    }
  }

  return counts;
}

function shouldAttemptInsights(retrieval) {
  if (!retrieval) return false;
  if (retrieval.media === null && retrieval.stories === null) return false;
  const errors = Array.isArray(retrieval.errors) ? retrieval.errors : [];
  return !errors.some((error) => FATAL_INSIGHT_CODES.has(error?.code));
}

function buildOutcome({
  retrieval,
  discovery,
  captures,
  captureSummary,
  errors,
  warnings,
  fatalError,
  unexpectedError,
  hasMore,
}) {
  const captureCounts = countCaptures(captures);
  const counts = {
    mediaSeen:
      retrieval?.media?.counts?.total ??
      discovery?.media?.itemsSeen ??
      0,
    mediaCreated: discovery?.media?.created ?? 0,
    mediaUpdated: discovery?.media?.updated ?? 0,
    storiesSeen:
      retrieval?.stories?.counts?.total ??
      discovery?.stories?.itemsSeen ??
      0,
    ...captureCounts,
  };

  const noCollections =
    retrieval?.media === null && retrieval?.stories === null;
  const notConfigured =
    noCollections ||
    (Array.isArray(retrieval?.errors) &&
      retrieval.errors.some((error) => error?.code === "META_NOT_CONFIGURED"));
  const bothCollectionsFailed =
    Boolean(retrieval?.media?.error) && Boolean(retrieval?.stories?.error);
  const persistenceFailedAll =
    discovery &&
    Number(discovery.counts?.failed) > 0 &&
    Number(discovery.counts?.persisted) === 0;
  const hadWork =
    Number(discovery?.counts?.persisted) > 0 || captures.length > 0;
  const hasPartialCapture = captures.some(
    (capture) => capture.status === "partial",
  );
  const hasErrors = errors.length > 0;

  let status = "success";
  if (
    unexpectedError ||
    notConfigured ||
    bothCollectionsFailed ||
    persistenceFailedAll ||
    (fatalError && !hadWork)
  ) {
    status = "failed";
  } else if (hasErrors || hasMore || hasPartialCapture) {
    status = "partial";
  }

  const recordError =
    fatalError ||
    (unexpectedError
      ? errors.find((error) => error.scope === "sync") || null
      : null) ||
    errors.find((error) => error.code) ||
    null;

  return {
    record: {
      status,
      mediaSeen: counts.mediaSeen,
      mediaCreated: counts.mediaCreated,
      mediaUpdated: counts.mediaUpdated,
      storiesSeen: counts.storiesSeen,
      insightsAttempted: counts.insightsAttempted,
      insightsFailed: counts.insightsFailed,
      hasMore,
      errorCode: recordError?.code || null,
      errorMessage: recordError?.message || null,
    },
    summary: {
      ok: status === "success",
      skipped: false,
      status,
      hasMore,
      counts,
      collections: {
        media: discovery?.media ?? null,
        stories: discovery?.stories ?? null,
        insights: captureSummary,
      },
      retrieval: retrieval
        ? {
            ok: retrieval.ok === true,
            retrievedAt: retrieval.retrievedAt ?? null,
            mediaOk: retrieval.media?.ok === true,
            storiesOk: retrieval.stories?.ok === true,
            mediaCount: retrieval.media?.counts?.total ?? 0,
            storyCount: retrieval.stories?.counts?.total ?? 0,
            errors: Array.isArray(retrieval.errors) ? retrieval.errors : [],
            warnings: Array.isArray(retrieval.warnings)
              ? retrieval.warnings
              : [],
          }
        : null,
      errors,
      warnings,
    },
  };
}

async function executeSync(run, options, deps, client, deadlineAt) {
  let retrieval = null;
  let discovery = null;
  let captureSummary = null;
  const captures = [];
  const errors = [];
  const warnings = [];
  let fatalError = null;
  let unexpectedError = null;
  let hasMore = false;

  try {
    retrieval = await deps.retrieve({
      includeInsights: false,
      pageSize: options.pageSize,
      maxPages: options.maxPages,
      maxMediaItems: options.maxMediaItems,
      maxStoryItems: options.maxStoryItems,
      timeoutMs: options.requestTimeoutMs,
    });
  } catch (error) {
    unexpectedError = error;
    errors.push(errorEntry("retrieval", error, "SYNC_RETRIEVAL_FAILED"));
  }

  if (retrieval) {
    if (Array.isArray(retrieval.warnings)) warnings.push(...retrieval.warnings);
    if (Array.isArray(retrieval.errors)) {
      for (const error of retrieval.errors) {
        errors.push({ ...error, scope: error?.scope || "retrieval" });
      }
    }

    if (!(retrieval.media === null && retrieval.stories === null)) {
      hasMore =
        retrieval.media?.pagination?.truncated === true ||
        retrieval.stories?.pagination?.truncated === true;

      try {
        discovery = await deps.persist(retrieval, { client });
        if (Array.isArray(discovery?.errors)) {
          errors.push(...discovery.errors);
        }
      } catch (error) {
        unexpectedError = error;
        errors.push(errorEntry("persistence", error, "SYNC_PERSISTENCE_FAILED"));
      }
    }
  }

  if (
    !unexpectedError &&
    discovery &&
    options.includeInsights &&
    shouldAttemptInsights(retrieval)
  ) {
    try {
      const queueLimit = Math.min(
        100,
        Math.max(1, options.maxInsightItems + 1),
      );
      const queue = await deps.refreshQueue({
        limit: queueLimit,
        staleAfterMinutes: options.staleAfterMinutes,
        retryAfterMinutes: options.retryAfterMinutes,
        client,
      });
      const candidates = Array.isArray(queue)
        ? queue.slice(0, options.maxInsightItems)
        : [];
      const queueOverflow =
        Array.isArray(queue) &&
        (queue.length > candidates.length ||
          (queue.length === queueLimit &&
            options.maxInsightItems >= queueLimit));
      if (queueOverflow) hasMore = true;

      for (const media of candidates) {
        const remaining = deadlineAt - deps.now() - options.reserveMs;
        if (remaining < 1000) {
          hasMore = true;
          break;
        }

        const timeoutMs = Math.min(options.insightTimeoutMs, remaining);
        let capture;

        try {
          capture = await deps.captureInsights(media, { timeoutMs });
        } catch (error) {
          capture = {
            insights: null,
            insightState: {
              status: "error",
              supported: [],
              unavailable: [],
              errors: [errorEntry("insights", error, "SYNC_INSIGHT_FAILED")],
              reason: "SYNC_INSIGHT_FAILED",
            },
            metricsFetchedAt: new Date(deps.now()).toISOString(),
            metricsCapturedAt: null,
            fatal: false,
          };
        }

        const status = captureStatus(capture);
        captures.push({ media, capture, status });

        try {
          const summary = await deps.persistCollection(
            {
              ok: true,
              items: [captureItem(media, capture)],
              error: null,
            },
            { scope: "insights", client },
          );
          captureSummary = mergeSummaries(captureSummary, summary);
          if (summary?.error) {
            errors.push({ scope: "insights", ...summary.error });
          }
          for (const item of summary?.items || []) {
            if (!item.ok) {
              errors.push({
                scope: "insights",
                igMediaId: item.igMediaId,
                ...item.error,
              });
            }
          }
        } catch (error) {
          unexpectedError = error;
          errors.push(
            errorEntry("insights", error, "SYNC_INSIGHT_PERSISTENCE_FAILED"),
          );
          break;
        }

        if (status === "error") {
          const detail = firstInsightError(capture);
          errors.push({
            scope: "insights",
            igMediaId: media.igMediaId,
            code: detail.code,
            message: detail.message,
          });
        }

        if (capture?.fatal === true) {
          fatalError = {
            scope: "insights",
            code:
              capture?.insightState?.reason ||
              firstInsightError(capture).code ||
              "META_FATAL",
            message: "Insight retrieval stopped after a fatal Meta API error",
          };
          errors.push(fatalError);
          hasMore = true;
          break;
        }
      }
    } catch (error) {
      unexpectedError = error;
      errors.push(errorEntry("insights", error, "SYNC_INSIGHT_QUEUE_FAILED"));
    }
  }

  return buildOutcome({
    retrieval,
    discovery,
    captures,
    captureSummary,
    errors,
    warnings,
    fatalError,
    unexpectedError,
    hasMore,
  });
}

function failedOutcome(error) {
  const entry = errorEntry("sync", error, "SYNC_FAILED");
  return {
    record: {
      status: "failed",
      mediaSeen: 0,
      mediaCreated: 0,
      mediaUpdated: 0,
      storiesSeen: 0,
      insightsAttempted: 0,
      insightsFailed: 0,
      hasMore: false,
      errorCode: entry.code,
      errorMessage: entry.message,
    },
    summary: {
      ok: false,
      skipped: false,
      status: "failed",
      hasMore: false,
      counts: emptyCounts(),
      collections: emptyCollections(),
      retrieval: null,
      errors: [entry],
      warnings: [],
    },
  };
}

async function runLocked(options, deps, client) {
  try {
    const deadlineAt = deps.now() + options.timeBudgetMs;

    await deps.reconcileRuns({
      maxAgeMinutes: options.reconcileAfterMinutes,
      client,
    });
    const run = await deps.startRun({
      triggerSource: options.triggerSource,
      client,
    });

    let outcome;
    try {
      outcome = await executeSync(run, options, deps, client, deadlineAt);
    } catch (error) {
      outcome = failedOutcome(error);
    }

    let finalised;
    try {
      finalised = await deps.finaliseRun(run.id, outcome.record, { client });
    } catch (error) {
      const wrapped = new Error(safeMessage(error?.message || error));
      wrapped.code = "SYNC_FINALISATION_FAILED";
      wrapped.lockAcquired = true;
      wrapped.runId = run.id;
      wrapped.summary = outcome.summary;
      throw wrapped;
    }

    const finalRun = finalised?.run ?? null;
    const runStatus = finalRun?.status || outcome.summary.status;

    return {
      ok: finalised?.finalised !== false && runStatus === "success",
      skipped: false,
      status: runStatus,
      runId: run.id,
      run: finalRun,
      triggerSource: options.triggerSource,
      lockAcquired: true,
      hasMore: finalRun?.hasMore ?? outcome.summary.hasMore,
      counts: {
        ...outcome.summary.counts,
        mediaSeen: finalRun?.mediaSeen ?? outcome.summary.counts.mediaSeen,
        mediaCreated:
          finalRun?.mediaCreated ?? outcome.summary.counts.mediaCreated,
        mediaUpdated:
          finalRun?.mediaUpdated ?? outcome.summary.counts.mediaUpdated,
        storiesSeen:
          finalRun?.storiesSeen ?? outcome.summary.counts.storiesSeen,
        insightsAttempted:
          finalRun?.insightsAttempted ??
          outcome.summary.counts.insightsAttempted,
        insightsFailed:
          finalRun?.insightsFailed ?? outcome.summary.counts.insightsFailed,
      },
      collections: outcome.summary.collections,
      retrieval: outcome.summary.retrieval,
      errors: outcome.summary.errors,
      warnings: outcome.summary.warnings,
      startedAt: run.startedAt ?? null,
      finishedAt: finalRun?.finishedAt ?? null,
      durationMs: finalRun?.durationMs ?? null,
      finalised: finalised?.finalised !== false,
    };
  } catch (error) {
    if (error && typeof error === "object" && error.lockAcquired === undefined) {
      error.lockAcquired = true;
    }
    throw error;
  }
}

function failureSummary(options, error, { lockAcquired = false } = {}) {
  const code = error?.code || "SYNC_FAILED";
  const base = error?.summary || {};

  return {
    ok: false,
    skipped: false,
    status: "failed",
    runId: error?.runId ?? null,
    run: null,
    triggerSource: options.triggerSource,
    lockAcquired: error?.lockAcquired ?? lockAcquired,
    hasMore: base.hasMore ?? false,
    counts: base.counts ?? emptyCounts(),
    collections: base.collections ?? emptyCollections(),
    retrieval: base.retrieval ?? null,
    errors: [
      ...(Array.isArray(base.errors) ? base.errors : []),
      errorEntry("sync", error, code),
    ],
    warnings: base.warnings ?? [],
    startedAt: null,
    finishedAt: null,
    durationMs: null,
    finalised: false,
    finalisationFailed: code === "SYNC_FINALISATION_FAILED",
  };
}

function skippedSummary(options, run) {
  return {
    ok: false,
    skipped: true,
    status: "skipped",
    runId: run?.id ?? null,
    run: run ?? null,
    triggerSource: options.triggerSource,
    lockAcquired: false,
    hasMore: false,
    counts: emptyCounts(),
    collections: emptyCollections(),
    retrieval: null,
    errors: [
      {
        scope: "sync",
        code: "SYNC_LOCKED",
        message: "Another Instagram sync is already running.",
      },
    ],
    warnings: [],
    startedAt: run?.startedAt ?? null,
    finishedAt: run?.finishedAt ?? null,
    durationMs: run?.durationMs ?? null,
    finalised: true,
  };
}

export async function runInstagramSync(options = {}, dependencies = {}) {
  const normalized = normalizeOptions(options);
  const deps = { ...DEFAULT_DEPENDENCIES, ...dependencies };
  assertDependencies(deps);

  let lock;
  try {
    lock = await deps.withLock((client) =>
      runLocked(normalized, deps, client),
    );
  } catch (error) {
    return failureSummary(normalized, error, { lockAcquired: false });
  }

  if (!lock?.acquired) {
    try {
      const run = await deps.recordSkippedRun({
        triggerSource: normalized.triggerSource,
        errorCode: "SYNC_LOCKED",
        errorMessage: "Another Instagram sync is already running.",
      });
      return skippedSummary(normalized, run);
    } catch (error) {
      return failureSummary(normalized, error, { lockAcquired: false });
    }
  }

  return lock.result;
}
