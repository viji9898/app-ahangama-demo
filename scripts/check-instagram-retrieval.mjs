import "dotenv/config";
import process from "node:process";
import {
  getMetaConfig,
  retrieveInstagramContent,
} from "../lib/meta-instagram.js";

/*
 * Read-only retrieval verification for Ahangama's Instagram account.
 *
 * Retrieves posts, carousels, Reels and active Stories with their supported
 * insights through the same code path the future sync will use. It never opens
 * a database connection, writes data, changes content or prints credentials.
 *
 * Usage: npm run check:instagram-retrieval
 * Exits non-zero when a collection or a fatal insight request fails.
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

function maskId(value) {
  const text = String(value || "");
  return text ? `…${text.slice(-4)}` : "unknown";
}

function formatNumber(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "—";
  return parsed.toLocaleString("en-US");
}

/*
 * Error messages are already redacted by the Meta client. This second pass
 * removes anything that still looks like a credential or a full URL so the
 * terminal output stays safe to share.
 */
function safeText(value, maximum = 220) {
  const text = String(value || "")
    .replace(/https?:\/\/\S+/gi, "[url]")
    .replace(/\bEAA[A-Za-z0-9_-]{10,}\b/g, "[redacted]")
    .replace(/([?&]access_token=)[^&\s]+/gi, "$1[redacted]")
    .replace(/(["']?access_token["']?\s*[:=]\s*["']?)[^"'&\s,}]+/gi, "$1[redacted]");
  return text.length > maximum ? `${text.slice(0, maximum)}…` : text;
}

function describe(error) {
  if (!error) return "unknown error";
  const message = `${error.code || "META_REQUEST_FAILED"}: ${safeText(
    error.message,
  )}`;
  return error.hint ? `${message} — ${safeText(error.hint)}` : message;
}

function countLabel(counts) {
  const entries = Object.entries(counts || {});
  if (!entries.length) return "none";
  return entries
    .map(([name, count]) => `${name} ${formatNumber(count)}`)
    .join(" · ");
}

function reportCollection(label, collection) {
  if (!collection) {
    fail(label, "collection was not retrieved");
    return;
  }

  if (!collection.ok) {
    fail(label, describe(collection.error));
    return;
  }

  pass(
    label,
    `${formatNumber(collection.counts.total)} item(s) · ${countLabel(
      collection.counts.byProductType,
    )} · by media type: ${countLabel(collection.counts.byMediaType)}`,
  );
}

function reportPagination(label, collection) {
  if (!collection) return;
  const pagination = collection.pagination;

  const detail =
    `${pagination.pages} page(s), ${pagination.itemsFetched} fetched, ` +
    `${pagination.unique} unique, ${pagination.duplicates} duplicate(s), ` +
    `stopped: ${pagination.stoppedReason || "unknown"}` +
    `${pagination.truncated ? ", truncated by a safety limit" : ""}`;

  if (pagination.error) {
    fail(`${label} pagination`, `${detail} — ${describe(pagination.error)}`);
  } else if (pagination.truncated) {
    warn(`${label} pagination`, detail);
  } else {
    pass(`${label} pagination`, detail);
  }
}

function reportInsights(retrieval) {
  const summary = retrieval.insights;
  const detail =
    `${summary.ok} ok, ${summary.partial} partial, ` +
    `${summary.unavailable} unavailable, ${summary.error} error, ` +
    `${summary.skipped} skipped`;

  const fatal = summary.fatalError;
  if (fatal) {
    fail("Insights", `${detail} — stopped: ${describe(fatal)}`);
    return;
  }

  if (summary.error > 0) {
    fail("Insights", detail);
  } else if (summary.partial > 0 || summary.unavailable > 0) {
    warn("Insights", `${detail} (unsupported metrics are reported, not zeroed)`);
  } else {
    pass("Insights", detail);
  }

  const items = [
    ...(retrieval.media?.items || []),
    ...(retrieval.stories?.items || []),
  ];
  const problems = items.filter(
    (item) =>
      item.insightState.status === "error" ||
      item.insightState.status === "unavailable",
  );

  for (const item of problems.slice(0, 5)) {
    const first = item.insightState.errors[0];
    const kind = [
      item.media.mediaType || "UNKNOWN",
      item.media.mediaProductType || "UNKNOWN",
    ].join("/");
    warn(
      `Insight detail ${kind} ${maskId(item.media.igMediaId)}`,
      first ? describe(first) : item.insightState.reason || "no values returned",
    );
  }
  if (problems.length > 5) {
    warn("Insight detail", `${problems.length - 5} more item(s) omitted`);
  }

  const unsupported = new Set();
  for (const item of items) {
    for (const metric of item.insightState.unavailable) unsupported.add(metric);
  }
  if (unsupported.size) {
    warn(
      "Unsupported metrics",
      `${[...unsupported].sort().join(", ")} — stored as unavailable (null)`,
    );
  }
}

const symbols = { pass: "✓", warn: "!", fail: "✗" };

console.log("Instagram retrieval — read-only verification\n");

const config = getMetaConfig();

if (!config.configured) {
  const problems = [...config.missing, ...config.invalid];
  fail(
    "Configuration",
    problems.length
      ? `missing or invalid: ${problems.join(", ")}`
      : "incomplete",
  );
} else {
  pass(
    "Configuration",
    `${config.graphApiVersion} · Page ${maskId(config.pageId)} · Instagram ${maskId(
      config.instagramAccountId,
    )}`,
  );

  const retrievedAt = Date.now();
  const retrieval = await retrieveInstagramContent({
    pageSize: 50,
    maxPages: 10,
    maxMediaItems: 200,
    maxStoryItems: 100,
    maxInsightItems: 200,
  });

  pass("Retrieval mode", "read-only · no database connection · no database writes");

  if (retrieval.account?.username) {
    pass("Account", `@${safeText(retrieval.account.username, 60)}`);
  } else {
    warn("Account", "username was not returned with the retrieved media");
  }

  reportCollection("Media", retrieval.media);
  reportCollection("Stories", retrieval.stories);
  reportPagination("Media", retrieval.media);
  reportPagination("Stories", retrieval.stories);
  reportInsights(retrieval);

  const elapsed = Date.now() - retrievedAt;
  pass("Retrieved at", `${retrieval.retrievedAt} (${elapsed} ms)`);

  for (const error of retrieval.errors) {
    if (error.scope === "insights") continue;
    if (error.scope === "media" && retrieval.media?.error) continue;
    if (error.scope === "stories" && retrieval.stories?.error) continue;
    fail(`Retrieval ${error.scope || "error"}`, describe(error));
  }

  if (retrieval.warnings.length) {
    const counts = new Map();
    for (const warning of retrieval.warnings) {
      const code = warning.code || "META_WARNING";
      counts.set(code, (counts.get(code) || 0) + 1);
    }
    warn(
      "Warnings",
      [...counts.entries()].map(([code, count]) => `${code} × ${count}`).join(" · "),
    );
  }
}

for (const result of results) {
  console.log(
    `${symbols[result.level]} ${result.label}${
      result.detail ? ` — ${result.detail}` : ""
    }`,
  );
}

const failures = results.filter((result) => result.level === "fail").length;
const warnings = results.filter((result) => result.level === "warn").length;

console.log(
  `\n${results.length - failures - warnings} passed, ${warnings} warning(s), ${failures} failure(s)`,
);
console.log(
  "Read-only verification: no database connection was opened, no data was written, and no credentials were printed.",
);

process.exit(failures ? 1 : 0);
