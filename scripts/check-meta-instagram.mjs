import "dotenv/config";
import process from "node:process";
import {
  getInstagramAccount,
  getInstagramAccountInsights,
  getInstagramMediaInsights,
  getMetaConfig,
  getPageWithInstagramAccount,
  listInstagramMedia,
  listInstagramStories,
} from "../lib/meta-instagram.js";

/*
 * Read-only connection test for Ahangama's Instagram Business account.
 *
 * Verifies the System User token, the Facebook Page, the linked Instagram
 * account, media/story reads and Insights access. It never writes to the
 * database, never changes content, and never prints the access token.
 *
 * Usage: npm run check:meta
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

function maskId(value) {
  const text = String(value || "");
  return text ? `…${text.slice(-4)}` : "unknown";
}

function formatNumber(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "—";
  return parsed.toLocaleString("en-US");
}

function describe(error) {
  if (!error) return "unknown error";
  const message = `${error.code}: ${error.message}`;
  return error.hint ? `${message} — ${error.hint}` : message;
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

/*
 * Instagram Insights usually has data up to yesterday. Ask for the previous
 * seven complete days so a quiet account still returns a valid response.
 */
function insightWindow() {
  const now = new Date();
  const until = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1),
  );
  const since = new Date(until.getTime() - 7 * 86400000);
  return { since: isoDate(since), until: isoDate(until) };
}

async function checkConfiguration() {
  const config = getMetaConfig();

  if (!config.configured) {
    const problems = [...config.missing, ...config.invalid];
    fail(
      "Configuration",
      problems.length
        ? `missing or invalid: ${problems.join(", ")}`
        : "incomplete",
    );
    return null;
  }

  pass(
    "Configuration",
    `four variables set · page ${maskId(config.pageId)} · Instagram ${maskId(
      config.instagramAccountId,
    )}`,
  );
  pass("Graph API version", config.graphApiVersion);
  return config;
}

async function checkPage(config) {
  const page = await getPageWithInstagramAccount();

  if (!page.ok) {
    fail("Page access", describe(page.error));
    return null;
  }

  pass(
    "Page access",
    `${page.data.name || "Facebook Page"} (${maskId(page.data.id)})`,
  );

  const linked = page.data.instagram_business_account;
  if (!linked?.id) {
    fail(
      "Linked Instagram account",
      "the Page has no instagram_business_account. Connect the Instagram Business account to the Page in Meta Business Suite.",
    );
    return null;
  }

  pass(
    "Linked Instagram account",
    `@${linked.username || "unknown"} (${maskId(linked.id)})`,
  );

  if (String(linked.id) !== config.instagramAccountId) {
    fail(
      "Instagram account id",
      `META_INSTAGRAM_ACCOUNT_ID (${maskId(
        config.instagramAccountId,
      )}) does not match the Page's linked account (${maskId(
        linked.id,
      )}); insights would target the wrong account.`,
    );
    return null;
  }

  pass(
    "Instagram account id",
    "matches the Page's linked Business account",
  );
  return linked;
}

async function checkAccount() {
  const account = await getInstagramAccount();

  if (!account.ok) {
    fail("Instagram account read", describe(account.error));
    return;
  }

  pass(
    "Instagram account read",
    `@${account.data.username || "unknown"} · ${formatNumber(
      account.data.followers_count,
    )} followers · ${formatNumber(account.data.media_count)} media items`,
  );
}

async function checkMediaReads() {
  const media = await listInstagramMedia({ limit: 3 });
  let recent = [];

  if (!media.ok) {
    fail("Media read", describe(media.error));
  } else {
    recent = Array.isArray(media.data?.data) ? media.data.data : [];
    pass(
      "Media read",
      recent.length
        ? `${recent.length} recent post/reel item(s)`
        : "endpoint reachable; no media returned",
    );
  }

  const stories = await listInstagramStories({ limit: 3 });

  if (!stories.ok) {
    fail("Stories read", describe(stories.error));
  } else {
    const count = stories.data?.data?.length || 0;
    pass(
      "Stories read",
      count ? `${count} active story item(s)` : "endpoint reachable; no active stories",
    );
  }

  return recent;
}

async function checkInsights(recentMedia) {
  const { since, until } = insightWindow();

  const accountInsights = await getInstagramAccountInsights({
    metric: "reach",
    period: "day",
    since,
    until,
  });

  if (!accountInsights.ok) {
    fail("Account insights (reach)", describe(accountInsights.error));
  } else {
    pass(
      "Account insights (reach)",
      `${accountInsights.data?.data?.length || 0} daily row(s) for ${since} → ${until}`,
    );
  }

  if (!recentMedia.length) {
    warn("Media insights", "skipped: the account returned no media to sample");
  } else {
    const sample = recentMedia[0];
    for (const metric of ["reach", "views"]) {
      const result = await getInstagramMediaInsights(sample.id, { metric });

      if (result.ok) {
        pass(
          `Media insights (${metric})`,
          `${sample.media_product_type || sample.media_type || "media"} ${maskId(
            sample.id,
          )}`,
        );
      } else if (result.error.code === "META_PERMISSION_DENIED") {
        fail(`Media insights (${metric})`, describe(result.error));
      } else {
        warn(`Media insights (${metric})`, describe(result.error));
      }
    }
  }

  // The dashboard currently stores an `impressions` column. Meta deprecated
  // that metric for Instagram Insights, so report whether it is still usable
  // instead of failing the connection test.
  const legacy = await getInstagramAccountInsights({
    metric: "impressions",
    period: "day",
    since,
    until,
  });

  if (legacy.ok) {
    warn(
      "Legacy impressions metric",
      "still available; existing dashboard rows can be mapped from it",
    );
  } else {
    warn(
      "Legacy impressions metric",
      `${legacy.error.code}: ${legacy.error.message} (not required for the connection test)`,
    );
  }
}

const symbols = { pass: "✓", warn: "!", fail: "✗" };

console.log("Meta / Instagram connection — read-only check\n");

const config = await checkConfiguration();

if (config) {
  const linked = await checkPage(config);

  if (linked) {
    await checkAccount();
    const recentMedia = await checkMediaReads();
    await checkInsights(recentMedia);
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
  "No data was written. The access token is sent in the Authorization header and is never printed.",
);

process.exit(failures ? 1 : 0);
