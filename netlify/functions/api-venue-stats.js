import process from "node:process";
import {
  LINK_TYPES,
  VENUE_STATS,
  getVenueStats,
} from "../../lib/venue-stats-config.js";
import {
  isVenueStatsAuthDisabled,
  isVenueStatsAuthorized,
  venueStatsUnauthorizedResponse,
} from "../../lib/venue-stats-auth.js";
import {
  dimensionValue,
  hasExplicitCredentials,
  isGa4Configured,
  metricValue,
  runGa4Report,
} from "../../lib/ga4-report.js";
import {
  listInstagramPosts,
  listVenueArticles,
} from "../../lib/venue-stats-db.js";
import { EDITORIAL_ARTICLES } from "../../src/data/editorialArticles.js";

const headers = {
  "Content-Type": "application/json",
  "Cache-Control": "private, no-store",
};

const json = (statusCode, body) => ({
  statusCode,
  headers,
  body: JSON.stringify(body),
});

const GUIDE_PATH = "/guide";
const CLICK_EVENT = "venue_link_click";
const IMPRESSION_EVENT = "venue_impression";

let cachedFirstTrackedDate;
let cachedFirstTrackedAt = 0;

/* ------------------------------------------------------------------ */
/* Date ranges                                                         */
/* ------------------------------------------------------------------ */

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function startOfUtcDay(date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function parseIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))) return null;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function resolveRange(params = {}) {
  const now = startOfUtcDay(new Date());

  const customStart = parseIsoDate(params.start);
  const customEnd = parseIsoDate(params.end);

  if (customStart && customEnd) {
    const start = customStart <= customEnd ? customStart : customEnd;
    const end = customStart <= customEnd ? customEnd : customStart;
    const days = Math.round((end - start) / 86400000) + 1;
    return {
      key: "custom",
      startDate: isoDate(start),
      endDate: isoDate(end),
      days,
      label: `${isoDate(start)} → ${isoDate(end)}`,
      ga4: { startDate: isoDate(start), endDate: isoDate(end) },
    };
  }

  if (params.period === "this_month") {
    const start = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
    );
    return {
      key: "this_month",
      startDate: isoDate(start),
      endDate: isoDate(now),
      days: Math.round((now - start) / 86400000) + 1,
      label: "This month",
      ga4: { startDate: isoDate(start), endDate: isoDate(now) },
    };
  }

  const requested = Number(params.days);
  const days = [7, 30, 90, 180, 365].includes(requested) ? requested : 30;
  const start = new Date(now.getTime() - (days - 1) * 86400000);

  return {
    key: `${days}d`,
    startDate: isoDate(start),
    endDate: isoDate(now),
    days,
    label: `Last ${days} days`,
    ga4: { startDate: `${days}daysAgo`, endDate: "today" },
  };
}

function toIsoDate(ga4Date) {
  const value = String(ga4Date || "");
  if (!/^\d{8}$/.test(value)) return value;
  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
}

function bucketKey(iso, granularity) {
  if (granularity === "month") return iso.slice(0, 7);
  if (granularity === "week") {
    const date = new Date(`${iso}T00:00:00.000Z`);
    const day = (date.getUTCDay() + 6) % 7; // Monday = 0
    date.setUTCDate(date.getUTCDate() - day);
    return isoDate(date);
  }
  return iso;
}

function bucketLabel(key, granularity) {
  if (granularity === "month") {
    const [year, month] = key.split("-");
    return new Date(Date.UTC(Number(year), Number(month) - 1, 1)).toLocaleString(
      "en-GB",
      { month: "short", year: "numeric", timeZone: "UTC" },
    );
  }
  if (granularity === "week") {
    const date = new Date(`${key}T00:00:00.000Z`);
    return `w/c ${date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      timeZone: "UTC",
    })}`;
  }
  const date = new Date(`${key}T00:00:00.000Z`);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  });
}

function normaliseGranularity(value) {
  return ["day", "week", "month"].includes(value) ? value : "day";
}

/* ------------------------------------------------------------------ */
/* GA4 filters                                                         */
/* ------------------------------------------------------------------ */

function eventFilter(name) {
  return {
    filter: {
      fieldName: "eventName",
      stringFilter: { matchType: "EXACT", value: name },
    },
  };
}

function customFilter(field, value) {
  return {
    filter: {
      fieldName: `customEvent:${field}`,
      stringFilter: {
        matchType: "EXACT",
        value: String(value),
        caseSensitive: false,
      },
    },
  };
}

function andFilter(expressions) {
  return { andGroup: { expressions: expressions.filter(Boolean) } };
}

function addError(store, section, error) {
  if (!error) return;
  store.push({
    section,
    code: error.code || "GA4_REQUEST_FAILED",
    message: error.message || String(error),
  });
}

/* ------------------------------------------------------------------ */
/* Reports                                                             */
/* ------------------------------------------------------------------ */

async function fetchLinkBreakdown(venue, range, errors) {
  const filter = andFilter([
    eventFilter(CLICK_EVENT),
    customFilter("venue_id", venue.venueId),
  ]);

  const [report, usersReport] = await Promise.all([
    runGa4Report({
      dateRanges: [range.ga4],
      dimensions: [{ name: "customEvent:link_type" }],
      metrics: [{ name: "eventCount" }, { name: "totalUsers" }],
      dimensionFilter: filter,
    }),
    // Users are deduplicated only without a dimension breakdown, so the
    // combined "unique clickers" figure needs its own query. Summing the
    // per-link-type users would double-count anyone who clicked twice.
    runGa4Report({
      dateRanges: [range.ga4],
      metrics: [{ name: "totalUsers" }],
      dimensionFilter: filter,
    }),
  ]);

  if (!report.ok) {
    addError(errors, "linkClicks", report.error);
    return {
      available: false,
      totalClicks: 0,
      uniqueClickers: 0,
      byType: Object.fromEntries(
        LINK_TYPES.map((type) => [type.key, { clicks: 0, users: 0 }]),
      ),
    };
  }

  const byType = Object.fromEntries(
    LINK_TYPES.map((type) => [type.key, { clicks: 0, users: 0 }]),
  );

  let totalClicks = 0;

  for (const row of report.rows) {
    const type = dimensionValue(row, 0);
    const clicks = metricValue(row, 0);
    const users = metricValue(row, 1);
    totalClicks += clicks;
    if (byType[type]) {
      byType[type].clicks += clicks;
      byType[type].users += users;
    } else if (type) {
      byType[type] = { clicks, users };
    }
  }

  const uniqueClickers =
    usersReport.ok && usersReport.rows[0]
      ? metricValue(usersReport.rows[0], 0)
      : 0;

  return {
    available: true,
    totalClicks,
    uniqueClickers,
    byType,
  };
}

async function fetchImpressions(venue, range, errors) {
  const report = await runGa4Report({
    dateRanges: [range.ga4],
    metrics: [{ name: "eventCount" }, { name: "totalUsers" }],
    dimensionFilter: andFilter([
      eventFilter(IMPRESSION_EVENT),
      customFilter("venue_id", venue.venueId),
    ]),
  });

  if (!report.ok) {
    addError(errors, "impressions", report.error);
    return { available: false, impressions: 0, uniqueExposed: 0 };
  }

  const row = report.rows[0];
  return {
    available: true,
    impressions: row ? metricValue(row, 0) : 0,
    uniqueExposed: row ? metricValue(row, 1) : 0,
  };
}

async function fetchGuidePages(range, errors) {
  const report = await runGa4Report({
    dateRanges: [range.ga4],
    metrics: [
      { name: "screenPageViews" },
      { name: "totalUsers" },
      { name: "sessions" },
    ],
    dimensionFilter: {
      filter: {
        fieldName: "pagePath",
        stringFilter: { matchType: "EXACT", value: GUIDE_PATH },
      },
    },
  });

  if (!report.ok) {
    addError(errors, "guidePages", report.error);
    return { available: false, pageViews: 0, uniqueVisitors: 0, sessions: 0 };
  }

  const row = report.rows[0];
  return {
    available: true,
    pageViews: row ? metricValue(row, 0) : 0,
    uniqueVisitors: row ? metricValue(row, 1) : 0,
    sessions: row ? metricValue(row, 2) : 0,
  };
}

async function fetchTimeseries(venue, range, errors) {
  const report = await runGa4Report({
    dateRanges: [range.ga4],
    dimensions: [{ name: "date" }, { name: "eventName" }],
    metrics: [{ name: "eventCount" }, { name: "totalUsers" }],
    dimensionFilter: andFilter([
      {
        orGroup: {
          expressions: [
            eventFilter(CLICK_EVENT),
            eventFilter(IMPRESSION_EVENT),
          ],
        },
      },
      customFilter("venue_id", venue.venueId),
    ]),
    orderBys: [{ dimension: { dimensionName: "date" } }],
  });

  if (!report.ok) {
    addError(errors, "timeseries", report.error);
    return { available: false, daily: [] };
  }

  const daily = new Map();

  for (const row of report.rows) {
    const date = toIsoDate(dimensionValue(row, 0));
    const eventName = dimensionValue(row, 1);
    if (!daily.has(date)) {
      daily.set(date, { date, clicks: 0, impressions: 0, users: 0 });
    }
    const entry = daily.get(date);
    if (eventName === CLICK_EVENT) entry.clicks += metricValue(row, 0);
    if (eventName === IMPRESSION_EVENT) entry.impressions += metricValue(row, 0);
    entry.users = Math.max(entry.users, metricValue(row, 1));
  }

  return {
    available: true,
    daily: Array.from(daily.values()).sort((a, b) =>
      a.date.localeCompare(b.date),
    ),
  };
}

async function fetchFirstTrackedDate(errors) {
  const now = Date.now();
  if (cachedFirstTrackedDate !== undefined && now - cachedFirstTrackedAt < 600000) {
    return cachedFirstTrackedDate;
  }

  const report = await runGa4Report({
    dateRanges: [{ startDate: "2020-01-01", endDate: "today" }],
    dimensions: [{ name: "date" }],
    metrics: [{ name: "eventCount" }],
    dimensionFilter: eventFilter(CLICK_EVENT),
    orderBys: [{ dimension: { dimensionName: "date" } }],
    limit: 1,
  });

  if (!report.ok) {
    addError(errors, "trackingStart", report.error);
    cachedFirstTrackedDate = null;
  } else {
    cachedFirstTrackedDate = report.rows[0]
      ? toIsoDate(dimensionValue(report.rows[0], 0))
      : null;
  }

  cachedFirstTrackedAt = now;
  return cachedFirstTrackedDate;
}

function articleMeta(path) {
  const match = EDITORIAL_ARTICLES.find(
    (article) => article.href === path || article.href === `${path}/`,
  );
  return {
    title: match?.title || path,
    publishedAt: match?.publishDate
      ? String(match.publishDate).slice(0, 10)
      : "",
  };
}

function pathnameOf(url) {
  try {
    return new URL(url, "https://ahangama.com").pathname;
  } catch {
    return "";
  }
}

async function fetchArticleMetrics(paths, range, errors) {
  if (!paths.length) return { available: true, byPath: {} };

  const report = await runGa4Report({
    dateRanges: [range.ga4],
    dimensions: [{ name: "pagePath" }],
    metrics: [{ name: "screenPageViews" }, { name: "totalUsers" }],
    dimensionFilter: {
      filter: {
        fieldName: "pagePath",
        inListFilter: { values: paths, caseSensitive: false },
      },
    },
  });

  if (!report.ok) {
    addError(errors, "articles", report.error);
    return { available: false, byPath: {} };
  }

  const byPath = {};
  for (const row of report.rows) {
    byPath[dimensionValue(row, 0)] = {
      pageViews: metricValue(row, 0),
      uniqueVisitors: metricValue(row, 1),
    };
  }
  return { available: true, byPath };
}

/* ------------------------------------------------------------------ */
/* Payload builders                                                    */
/* ------------------------------------------------------------------ */

function buildSeries(daily, granularity) {
  const buckets = new Map();

  for (const entry of daily) {
    const key = bucketKey(entry.date, granularity);
    if (!buckets.has(key)) {
      buckets.set(key, {
        key,
        label: bucketLabel(key, granularity),
        clicks: 0,
        impressions: 0,
      });
    }
    const bucket = buckets.get(key);
    bucket.clicks += entry.clicks;
    bucket.impressions += entry.impressions;
  }

  return Array.from(buckets.values()).sort((a, b) =>
    a.key.localeCompare(b.key),
  );
}

function sumPosts(posts) {
  return posts.reduce(
    (totals, post) => ({
      reach: totals.reach + post.reach,
      impressions: totals.impressions + post.impressions,
      likes: totals.likes + post.likes,
      comments: totals.comments + post.comments,
      shares: totals.shares + post.shares,
      saves: totals.saves + post.saves,
    }),
    { reach: 0, impressions: 0, likes: 0, comments: 0, shares: 0, saves: 0 },
  );
}

async function buildVenuePayload(venue, params) {
  const range = resolveRange(params);
  const granularity = normaliseGranularity(params.granularity);
  const errors = [];

  const ga4Configured = isGa4Configured();

  const [links, impressions, guidePages, timeseries, firstTrackedDate, posts, manualArticles] =
    await Promise.all([
      fetchLinkBreakdown(venue, range, errors),
      fetchImpressions(venue, range, errors),
      fetchGuidePages(range, errors),
      fetchTimeseries(venue, range, errors),
      ga4Configured ? fetchFirstTrackedDate(errors) : Promise.resolve(null),
      listInstagramPosts(venue.key).catch((error) => {
        addError(errors, "instagram", {
          code: "DATABASE_ERROR",
          message: error.message,
        });
        return [];
      }),
      listVenueArticles(venue.key).catch((error) => {
        addError(errors, "articlesDb", {
          code: "DATABASE_ERROR",
          message: error.message,
        });
        return [];
      }),
    ]);

  const articleMap = new Map();

  for (const path of venue.articlePaths || []) {
    articleMap.set(path, { path, ...articleMeta(path), manual: false });
  }
  for (const article of manualArticles) {
    const path = pathnameOf(article.url);
    if (!path) continue;
    articleMap.set(path, {
      path,
      title: article.title,
      publishedAt: article.publishedAt,
      url: article.url,
      manual: true,
    });
  }

  const articlePaths = Array.from(articleMap.keys());
  const articleMetrics = await fetchArticleMetrics(articlePaths, range, errors);

  const articles = articlePaths.map((path) => {
    const metrics = articleMetrics.byPath[path] || {
      pageViews: 0,
      uniqueVisitors: 0,
    };
    const meta = articleMap.get(path);
    return {
      ...meta,
      url: meta.url || `https://ahangama.com${path}`,
      pageViews: metrics.pageViews,
      uniqueVisitors: metrics.uniqueVisitors,
    };
  });

  const byType = {};
  for (const type of LINK_TYPES) {
    byType[type.key] = links.byType[type.key] || { clicks: 0, users: 0 };
  }

  const ctr =
    impressions.impressions > 0
      ? links.totalClicks / impressions.impressions
      : 0;

  return {
    ok: true,
    venue: {
      key: venue.key,
      venueId: venue.venueId,
      name: venue.name,
      section: venue.section,
      sectionLabel: venue.sectionLabel,
      image: venue.image,
      links: {
        instagram: venue.instagram,
        google_maps: venue.googleMaps,
        website: venue.website,
      },
    },
    range: {
      key: range.key,
      startDate: range.startDate,
      endDate: range.endDate,
      days: range.days,
      label: range.label,
      granularity,
    },
    ga4: {
      configured: ga4Configured,
      credentialsConfigured: hasExplicitCredentials(),
      propertyConfigured: Boolean(
        String(process.env.GA4_PROPERTY_ID || "").trim(),
      ),
    },
    metrics: {
      totalClicks: links.totalClicks,
      uniqueClickers: links.uniqueClickers,
      instagramClicks: byType.instagram.clicks,
      googleMapsClicks: byType.google_maps.clicks,
      websiteClicks: byType.website.clicks,
      impressions: impressions.impressions,
      uniqueExposed: impressions.uniqueExposed,
      guidePageViews: guidePages.pageViews,
      guideUniqueVisitors: guidePages.uniqueVisitors,
      guideSessions: guidePages.sessions,
      ctr,
      trackingStartedAt: firstTrackedDate,
    },
    available: {
      linkBreakdown: links.available,
      impressions: impressions.available,
      guidePages: guidePages.available,
      timeseries: timeseries.available,
      articles: articleMetrics.available,
      instagram: true,
    },
    linkBreakdown: LINK_TYPES.map((type) => ({
      key: type.key,
      label: type.label,
      clicks: byType[type.key].clicks,
      users: byType[type.key].users,
      url: venue[type.key === "google_maps" ? "googleMaps" : type.key],
    })),
    series: buildSeries(timeseries.daily, granularity),
    daily: timeseries.daily,
    content: {
      instagram: {
        posts,
        totals: sumPosts(posts),
      },
      articles,
    },
    errors,
    generatedAt: new Date().toISOString(),
  };
}

async function buildOverview(params) {
  const range = resolveRange(params);
  const errors = [];

  const [clicksReport, impressionsReport, guidePages] = await Promise.all([
    runGa4Report({
      dateRanges: [range.ga4],
      dimensions: [
        { name: "customEvent:venue_id" },
        { name: "customEvent:link_type" },
      ],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: eventFilter(CLICK_EVENT),
    }),
    runGa4Report({
      dateRanges: [range.ga4],
      dimensions: [{ name: "customEvent:venue_id" }],
      metrics: [{ name: "eventCount" }, { name: "totalUsers" }],
      dimensionFilter: eventFilter(IMPRESSION_EVENT),
    }),
    fetchGuidePages(range, errors),
  ]);

  if (!clicksReport.ok) addError(errors, "overviewClicks", clicksReport.error);
  if (!impressionsReport.ok)
    addError(errors, "overviewImpressions", impressionsReport.error);

  const clickMap = new Map();
  const impressionMap = new Map();

  if (clicksReport.ok) {
    for (const row of clicksReport.rows) {
      const venueId = dimensionValue(row, 0);
      const type = dimensionValue(row, 1);
      if (!clickMap.has(venueId)) {
        clickMap.set(venueId, {
          total: 0,
          instagram: 0,
          google_maps: 0,
          website: 0,
        });
      }
      const entry = clickMap.get(venueId);
      const count = metricValue(row, 0);
      entry.total += count;
      if (entry[type] !== undefined) entry[type] += count;
    }
  }

  if (impressionsReport.ok) {
    for (const row of impressionsReport.rows) {
      impressionMap.set(dimensionValue(row, 0), {
        impressions: metricValue(row, 0),
        uniqueExposed: metricValue(row, 1),
      });
    }
  }

  const venues = VENUE_STATS.map((venue) => {
    const clicks = clickMap.get(venue.venueId) || {
      total: 0,
      instagram: 0,
      google_maps: 0,
      website: 0,
    };
    const impressions = impressionMap.get(venue.venueId) || {
      impressions: 0,
      uniqueExposed: 0,
    };
    return {
      key: venue.key,
      venueId: venue.venueId,
      name: venue.name,
      shortName: venue.shortName,
      section: venue.section,
      sectionLabel: venue.sectionLabel,
      image: venue.image,
      totalClicks: clicks.total,
      instagramClicks: clicks.instagram,
      googleMapsClicks: clicks.google_maps,
      websiteClicks: clicks.website,
      impressions: impressions.impressions,
      uniqueExposed: impressions.uniqueExposed,
      ctr:
        impressions.impressions > 0
          ? clicks.total / impressions.impressions
          : 0,
    };
  });

  return {
    ok: true,
    scope: "overview",
    range: {
      key: range.key,
      startDate: range.startDate,
      endDate: range.endDate,
      days: range.days,
      label: range.label,
    },
    ga4: {
      configured: isGa4Configured(),
      credentialsConfigured: hasExplicitCredentials(),
    },
    guide: {
      pageViews: guidePages.pageViews,
      uniqueVisitors: guidePages.uniqueVisitors,
      available: guidePages.available,
    },
    venues,
    errors,
    generatedAt: new Date().toISOString(),
  };
}

/* ------------------------------------------------------------------ */
/* Handler                                                             */
/* ------------------------------------------------------------------ */

export const handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return json(405, { ok: false, error: "Method not allowed" });
  }

  if (!isVenueStatsAuthorized(event.headers)) {
    return venueStatsUnauthorizedResponse();
  }

  const params = event.queryStringParameters || {};

  // Cheap access probe used by the frontend to decide whether to show the
  // password gate. Never touches GA4 or the database.
  if (params.check === "1") {
    return json(200, {
      ok: true,
      authRequired: !isVenueStatsAuthDisabled(),
    });
  }

  try {
    if (params.scope === "overview" || params.venue === "all") {
      return json(200, await buildOverview(params));
    }

    const venue = getVenueStats(params.venue);
    if (!venue) {
      return json(404, { ok: false, error: "Unknown venue" });
    }

    return json(200, await buildVenuePayload(venue, params));
  } catch (error) {
    console.error("Venue stats failed:", error);
    return json(500, {
      ok: false,
      error: error.message || String(error),
    });
  }
};
