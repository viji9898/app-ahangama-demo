import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import process from "node:process";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  INSTAGRAM_INSIGHT_METRICS,
  retrieveInstagramContent,
} from "../lib/meta-instagram.js";

/*
 * Mocked retrieval tests. They never call the live Meta API and never touch a
 * database. Every fake response is routed by Graph API path so pagination,
 * per-type insights and failure handling are exercised without credentials.
 */

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TOKEN = "EAAfake-system-user-token-0000000000";
const ACCOUNT_ID = "9876543210";
const PAGE_ID = "1234567890";
const GRAPH = "v26.0";
const BASE = `https://graph.facebook.com/${GRAPH}/${ACCOUNT_ID}`;

const ENV_KEYS = [
  "META_SYSTEM_USER_ACCESS_TOKEN",
  "META_PAGE_ID",
  "META_INSTAGRAM_ACCOUNT_ID",
  "META_GRAPH_API_VERSION",
];

const VALID_ENV = {
  META_SYSTEM_USER_ACCESS_TOKEN: TOKEN,
  META_PAGE_ID: PAGE_ID,
  META_INSTAGRAM_ACCOUNT_ID: ACCOUNT_ID,
  META_GRAPH_API_VERSION: GRAPH,
};

async function withEnv(overrides, run) {
  const saved = {};
  for (const key of ENV_KEYS) saved[key] = process.env[key];

  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }

  try {
    return await run();
  } finally {
    for (const key of ENV_KEYS) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
  }
}

async function withFetch(fakeFetch, run) {
  const original = globalThis.fetch;
  globalThis.fetch = fakeFetch;
  try {
    return await run();
  } finally {
    globalThis.fetch = original;
  }
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function graphError(message, { code = 100, subcode, status = 400 } = {}) {
  return jsonResponse(
    {
      error: {
        message,
        code,
        ...(subcode ? { error_subcode: subcode } : {}),
        fbtrace_id: "trace-safe",
      },
    },
    status,
  );
}

function mediaPage(items, next) {
  return {
    data: items,
    ...(next ? { paging: { cursors: { after: "cursor-after" }, next } } : {}),
  };
}

function insightRow(name, value, shape = "values") {
  if (shape === "total") return { name, total_value: { value } };
  return { name, values: [{ value }] };
}

/*
 * Router for the media, stories and insights endpoints.
 *
 * `insights(mediaId, metric)` returns a Response. `mediaPages` and
 * `storyPages` are indexed by the `after` query parameter so tests can build
 * multi-page collections.
 */
function fakeGraph({
  mediaPages = [mediaPage([])],
  storyPages = [mediaPage([])],
  insights = defaultInsights,
} = {}) {
  const calls = [];

  const fake = async (url, options) => {
    const parsed = new URL(String(url));
    const params = parsed.searchParams;
    const metric = params.get("metric") || "";
    const segments = parsed.pathname.split("/").filter(Boolean);
    const tail = segments.at(-1);
    const mediaId = segments.at(-2);

    calls.push({ url: String(url), options, params, metric });

    if (tail === "media") {
      const page = Number(params.get("after") || 0);
      return jsonResponse(mediaPages[Math.min(page, mediaPages.length - 1)]);
    }

    if (tail === "stories") {
      const page = Number(params.get("after") || 0);
      return jsonResponse(storyPages[Math.min(page, storyPages.length - 1)]);
    }

    if (tail === "insights") {
      return insights(mediaId, metric, calls);
    }

    return graphError(`unexpected path ${tail}`, { code: 1, status: 500 });
  };

  fake.calls = calls;
  return fake;
}

function defaultInsights(mediaId, metric) {
  const rows = metric.split(",").map((name) => {
    const values = {
      views: 100,
      reach: 80,
      likes: 12,
      comments: 3,
      shares: 2,
      saved: 4,
    };
    return insightRow(name, values[name] ?? 1);
  });
  return jsonResponse({ data: rows });
}

function mediaItem(id, overrides = {}) {
  return {
    id,
    media_type: "IMAGE",
    media_product_type: "FEED",
    caption: `caption ${id}`,
    permalink: `https://www.instagram.com/p/${id}/`,
    media_url: `https://cdn.example.test/${id}.jpg`,
    timestamp: "2026-11-01T10:00:00+0000",
    username: "ahangama",
    like_count: 10,
    comments_count: 2,
    ...overrides,
  };
}

function storyItem(id, overrides = {}) {
  return {
    id,
    media_type: "IMAGE",
    media_product_type: "STORY",
    permalink: `https://www.instagram.com/stories/ahangama/${id}/`,
    media_url: `https://cdn.example.test/${id}.jpg`,
    timestamp: "2026-11-12T10:00:00+0000",
    username: "ahangama",
    ...overrides,
  };
}

/* ------------------------------------------------------------------ */
/* Successful retrieval                                                */
/* ------------------------------------------------------------------ */

test("retrieves posts, carousels and Reels with supported insights", async () => {
  await withEnv(VALID_ENV, async () => {
    const carousel = mediaItem("m2", {
      media_type: "CAROUSEL_ALBUM",
      media_product_type: "FEED",
      children: {
        data: [
          {
            id: "c1",
            media_type: "IMAGE",
            media_url: "https://cdn.example.test/c1.jpg",
            timestamp: "2026-11-01T10:00:00+0000",
          },
        ],
      },
    });
    const reel = mediaItem("m3", {
      media_type: "VIDEO",
      media_product_type: "REELS",
      thumbnail_url: "https://cdn.example.test/m3.jpg",
    });

    const fake = fakeGraph({
      mediaPages: [mediaPage([mediaItem("m1"), carousel, reel])],
      storyPages: [mediaPage([])],
    });

    await withFetch(fake, async () => {
      const result = await retrieveInstagramContent();

      assert.equal(result.ok, true);
      assert.equal(result.readOnly, true);
      assert.equal(result.graphApiVersion, GRAPH);
      assert.equal(result.account.username, "ahangama");
      assert.equal(result.media.counts.total, 3);
      assert.deepEqual(result.media.counts.byMediaType, {
        IMAGE: 1,
        CAROUSEL_ALBUM: 1,
        VIDEO: 1,
      });
      assert.deepEqual(result.media.counts.byProductType, { FEED: 2, REELS: 1 });
      assert.equal(result.stories.counts.total, 0);

      const image = result.media.items[0];
      assert.equal(image.media.igMediaId, "m1");
      assert.equal(image.media.caption, "caption m1");
      assert.equal(image.media.storyExpiresAt, null);
      assert.equal(image.insights.views, 100);
      assert.equal(image.insights.reach, 80);
      assert.equal(image.insights.likes, 12);
      assert.equal(image.insights.comments, 3);
      assert.equal(image.insights.shares, 2);
      assert.equal(image.insights.saves, 4);
      assert.equal(image.insightState.status, "ok");
      assert.match(image.retrievedAt, /^\d{4}-\d{2}-\d{2}T/);
      assert.equal(image.metricsFetchedAt, image.metricsCapturedAt);
      assert.equal(image.metricsFetchedAt !== null, true);

      const carouselItem = result.media.items[1];
      assert.equal(carouselItem.media.children.length, 1);
      assert.equal(carouselItem.media.children[0].igMediaId, "c1");

      const reelItem = result.media.items[2];
      assert.equal(reelItem.media.mediaProductType, "REELS");
      assert.equal(reelItem.media.thumbnailUrl, "https://cdn.example.test/m3.jpg");

      assert.equal(result.insights.ok, 3);
      assert.equal(result.insights.error, 0);
    });
  });
});

test("maps the API `saved` metric to the database `saves` column", async () => {
  await withEnv(VALID_ENV, async () => {
    const fake = fakeGraph({
      mediaPages: [mediaPage([mediaItem("m1")])],
      insights: (_id, metric) =>
        jsonResponse({
          data: metric.split(",").map((name) => ({
            name,
            total_value: { value: name === "saved" ? 7 : 1 },
          })),
        }),
    });

    await withFetch(fake, async () => {
      const result = await retrieveInstagramContent();
      const item = result.media.items[0];

      assert.equal(item.insights.saves, 7);
      assert.equal(item.insights.views, 1);
      assert.equal(item.insightState.status, "ok");
      assert.equal(
        fake.calls.some((call) => call.metric.includes("saved")),
        true,
      );
      assert.equal(
        fake.calls.some((call) => call.metric.includes("impressions")),
        false,
      );
    });
  });
});

test("retrieves active Stories and requests only Story-safe metrics", async () => {
  await withEnv(VALID_ENV, async () => {
    const fake = fakeGraph({
      mediaPages: [mediaPage([])],
      storyPages: [
        mediaPage([
          storyItem("s1"),
          storyItem("s2", {
            media_type: "VIDEO",
            thumbnail_url: "https://cdn.example.test/s2.jpg",
          }),
        ]),
      ],
      insights: (_id, metric) =>
        jsonResponse({
          data: metric.split(",").map((name) => insightRow(name, 5)),
        }),
    });

    await withFetch(fake, async () => {
      const result = await retrieveInstagramContent();
      const story = result.stories.items[0];

      assert.equal(result.stories.counts.total, 2);
      assert.deepEqual(result.stories.counts.byProductType, { STORY: 2 });
      assert.equal(story.media.storyExpiresAt, "2026-11-13T10:00:00.000Z");
      assert.equal(story.media.caption, null);
      assert.equal(story.media.likeCount, null);
      assert.deepEqual(story.insights, {
        views: 5,
        reach: 5,
        likes: null,
        comments: null,
        shares: 5,
        saves: null,
      });
      assert.equal(story.insightState.status, "ok");

      const insightCalls = fake.calls.filter((call) => call.metric);
      for (const call of insightCalls) {
        assert.equal(call.metric, "views,reach,shares");
      }
      assert.deepEqual(INSTAGRAM_INSIGHT_METRICS.STORY, [
        "views",
        "reach",
        "shares",
      ]);
    });
  });
});

/* ------------------------------------------------------------------ */
/* Pagination                                                          */
/* ------------------------------------------------------------------ */

test("follows multiple pages, deduplicates ids and strips tokens from cursors", async () => {
  await withEnv(VALID_ENV, async () => {
    const next = `${BASE}/media?after=1&access_token=${TOKEN}`;
    const fake = fakeGraph({
      mediaPages: [
        mediaPage([mediaItem("m1"), mediaItem("m2")], next),
        mediaPage([mediaItem("m2"), mediaItem("m3")]),
      ],
      storyPages: [mediaPage([])],
    });

    await withFetch(fake, async () => {
      const result = await retrieveInstagramContent({ includeInsights: false });

      assert.equal(result.media.items.length, 3);
      assert.deepEqual(
        result.media.items.map((item) => item.media.igMediaId),
        ["m1", "m2", "m3"],
      );
      assert.equal(result.media.pagination.pages, 2);
      assert.equal(result.media.pagination.itemsFetched, 4);
      assert.equal(result.media.pagination.duplicates, 1);
      assert.equal(result.media.pagination.stoppedReason, "end");
      assert.equal(result.media.pagination.truncated, false);

      for (const call of fake.calls) {
        assert.equal(call.url.includes(TOKEN), false);
        assert.equal(call.url.includes("access_token"), false);
        assert.equal(call.options.headers.Authorization, `Bearer ${TOKEN}`);
      }
    });
  });
});

test("rejects an off-origin pagination cursor and keeps the first page", async () => {
  await withEnv(VALID_ENV, async () => {
    const fake = fakeGraph({
      mediaPages: [
        mediaPage([mediaItem("m1")], "https://evil.example.test/steal?after=1"),
      ],
      storyPages: [mediaPage([])],
    });

    await withFetch(fake, async () => {
      const result = await retrieveInstagramContent({ includeInsights: false });

      assert.equal(result.ok, false);
      assert.equal(result.media.items.length, 1);
      assert.equal(result.media.pagination.stoppedReason, "invalid_cursor");
      assert.equal(result.media.pagination.error.code, "META_INVALID_CURSOR");
      assert.equal(result.errors[0].scope, "media");
      assert.equal(result.errors[0].message.includes("evil.example"), false);
    });
  });
});

test("stops on a repeated cursor instead of looping forever", async () => {
  await withEnv(VALID_ENV, async () => {
    const next = `${BASE}/media?after=1`;
    const fake = fakeGraph({
      mediaPages: [mediaPage([mediaItem("m1")], next), mediaPage([mediaItem("m2")], next)],
      storyPages: [mediaPage([])],
    });

    await withFetch(fake, async () => {
      const result = await retrieveInstagramContent({ includeInsights: false });

      assert.equal(result.ok, false);
      assert.equal(result.media.pagination.pages, 2);
      assert.equal(result.media.pagination.stoppedReason, "loop");
      assert.equal(result.media.pagination.error.code, "META_PAGINATION_LOOP");
    });
  });
});

test("caps pagination at the configured page and item limits", async () => {
  await withEnv(VALID_ENV, async () => {
    const fake = fakeGraph({
      mediaPages: [
        mediaPage([mediaItem("m1")], `${BASE}/media?after=1`),
        mediaPage([mediaItem("m2")], `${BASE}/media?after=2`),
        mediaPage([mediaItem("m3")], `${BASE}/media?after=3`),
      ],
      storyPages: [mediaPage([])],
    });

    await withFetch(fake, async () => {
      const result = await retrieveInstagramContent({
        includeInsights: false,
        maxPages: 2,
      });

      assert.equal(result.media.items.length, 2);
      assert.equal(result.media.pagination.pages, 2);
      assert.equal(result.media.pagination.truncated, true);
      assert.equal(result.media.pagination.stoppedReason, "max_pages");
    });
  });
});

test("handles an empty library without inventing media", async () => {
  await withEnv(VALID_ENV, async () => {
    const fake = fakeGraph({
      mediaPages: [mediaPage([])],
      storyPages: [mediaPage([])],
    });

    await withFetch(fake, async () => {
      const result = await retrieveInstagramContent();

      assert.equal(result.ok, true);
      assert.equal(result.media.counts.total, 0);
      assert.equal(result.stories.counts.total, 0);
      assert.deepEqual(result.media.counts.byMediaType, {});
      assert.equal(result.media.pagination.stoppedReason, "end");
      assert.equal(result.insights.requested, 0);
      assert.deepEqual(result.errors, []);
    });
  });
});

test("keeps missing optional metadata as null", async () => {
  await withEnv(VALID_ENV, async () => {
    const sparse = { id: "m1", media_type: "IMAGE" };
    const fake = fakeGraph({
      mediaPages: [mediaPage([sparse])],
      storyPages: [mediaPage([])],
    });

    await withFetch(fake, async () => {
      const result = await retrieveInstagramContent();
      const item = result.media.items[0];

      assert.equal(item.media.mediaProductType, null);
      assert.equal(item.media.caption, null);
      assert.equal(item.media.permalink, null);
      assert.equal(item.media.mediaUrl, null);
      assert.equal(item.media.thumbnailUrl, null);
      assert.equal(item.media.postedAt, null);
      assert.equal(item.media.username, null);
      assert.equal(item.media.likeCount, null);
      assert.equal(item.media.commentsCount, null);
      assert.deepEqual(item.media.children, []);
    });
  });
});

/* ------------------------------------------------------------------ */
/* Insight handling                                                    */
/* ------------------------------------------------------------------ */

test("records unsupported insight metrics without zeroing supported values", async () => {
  await withEnv(VALID_ENV, async () => {
    const fake = fakeGraph({
      mediaPages: [mediaPage([mediaItem("m1")])],
      storyPages: [mediaPage([])],
      insights: (_id, metric) => {
        if (metric.includes(",") && metric.includes("saved")) {
          return graphError(
            "(#100) The Media Insights API does not support the saved metric for this media product type.",
          );
        }
        if (metric === "saved") {
          return graphError(
            "(#100) The Media Insights API does not support the saved metric for this media product type.",
          );
        }
        const value = { views: 55, reach: 40, likes: 6, comments: 1, shares: 2 }[
          metric
        ];
        return jsonResponse({ data: [insightRow(metric, value)] });
      },
    });

    await withFetch(fake, async () => {
      const result = await retrieveInstagramContent();
      const item = result.media.items[0];

      assert.equal(item.insightState.status, "partial");
      assert.deepEqual(item.insightState.unavailable, ["saved"]);
      assert.equal(item.insights.views, 55);
      assert.equal(item.insights.reach, 40);
      assert.equal(item.insights.saves, null);
      assert.equal(
        item.insightState.errors.some(
          (error) => error.metric === "saved" && error.unsupported === true,
        ),
        true,
      );
      assert.equal(result.insights.partial, 1);
      assert.equal(result.ok, true);
    });
  });
});

test("marks a fully unsupported insight set as unavailable, not zero", async () => {
  await withEnv(VALID_ENV, async () => {
    const fake = fakeGraph({
      mediaPages: [mediaPage([mediaItem("m1")])],
      storyPages: [mediaPage([])],
      insights: () =>
        graphError(
          "(#100) The Media Insights API does not support the views metric for this media product type.",
        ),
    });

    await withFetch(fake, async () => {
      const result = await retrieveInstagramContent();
      const item = result.media.items[0];

      assert.equal(item.insightState.status, "unavailable");
      assert.equal(item.metricsCapturedAt, null);
      assert.equal(item.metricsFetchedAt !== null, true);
      for (const value of Object.values(item.insights)) assert.equal(value, null);
      assert.equal(result.insights.unavailable, 1);
      assert.equal(result.ok, true);
    });
  });
});

test("treats a malformed insight payload as an error rather than zero", async () => {
  await withEnv(VALID_ENV, async () => {
    const fake = fakeGraph({
      mediaPages: [mediaPage([mediaItem("m1")])],
      storyPages: [mediaPage([])],
      insights: (_id, metric) =>
        jsonResponse({
          data: metric.split(",").map((name) => ({ name })),
        }),
    });

    await withFetch(fake, async () => {
      const result = await retrieveInstagramContent();
      const item = result.media.items[0];

      assert.equal(item.insightState.status, "error");
      assert.equal(item.insights.views, null);
      assert.equal(item.metricsCapturedAt, null);
      assert.equal(result.insights.error, 1);
    });
  });
});

/* ------------------------------------------------------------------ */
/* Failures and safety                                                 */
/* ------------------------------------------------------------------ */

test("reports rate limiting and stops further insight requests", async () => {
  await withEnv(VALID_ENV, async () => {
    const fake = fakeGraph({
      mediaPages: [mediaPage([mediaItem("m1"), mediaItem("m2")])],
      storyPages: [mediaPage([])],
      insights: () =>
        graphError("(#4) Application request limit reached", {
          code: 4,
          status: 429,
        }),
    });

    await withFetch(fake, async () => {
      const result = await retrieveInstagramContent();
      const [first, second] = result.media.items;

      assert.equal(result.ok, false);
      assert.equal(first.insightState.status, "error");
      assert.equal(first.insightState.reason, "META_RATE_LIMITED");
      assert.equal(second.insightState.status, "skipped");
      assert.equal(second.insightState.reason, "META_RATE_LIMITED");
      assert.equal(second.metricsFetchedAt, null);
      assert.equal(result.insights.fatalError.code, "META_RATE_LIMITED");
      assert.equal(
        fake.calls.filter((call) => call.metric).length,
        1,
        "only one insight attempt should be made",
      );
      assert.equal(result.media.items.length, 2);
    });
  });
});

test("reports invalid credentials and redacts token material", async () => {
  await withEnv(VALID_ENV, async () => {
    const fake = fakeGraph({
      mediaPages: [
        {
          error: {
            message: `Invalid OAuth access token ${TOKEN}`,
            code: 190,
            error_subcode: 463,
          },
        },
      ],
      storyPages: [mediaPage([storyItem("s1")])],
      insights: (_id, metric) =>
        jsonResponse({
          data: metric.split(",").map((name) => insightRow(name, 3)),
        }),
    });

    await withFetch(fake, async () => {
      const result = await retrieveInstagramContent();
      const serialized = JSON.stringify(result);

      assert.equal(result.ok, false);
      assert.equal(result.media.ok, false);
      assert.equal(result.media.error.code, "META_TOKEN_EXPIRED");
      assert.equal(result.stories.counts.total, 1);
      assert.equal(serialized.includes(TOKEN), false);
      assert.match(result.media.error.message, /\[redacted\]/);
      assert.equal(serialized.includes("EAA"), false);
    });
  });
});

test("keeps a successful collection when the other endpoint fails", async () => {
  await withEnv(VALID_ENV, async () => {
    const fake = fakeGraph({
      mediaPages: [mediaPage([mediaItem("m1")])],
      storyPages: [
        {
          error: {
            message: "An unexpected error has occurred. Please retry your request later.",
            code: 2,
          },
        },
      ],
      insights: (_id, metric) =>
        jsonResponse({
          data: metric.split(",").map((name) => insightRow(name, 3)),
        }),
    });

    await withFetch(fake, async () => {
      const result = await retrieveInstagramContent();

      assert.equal(result.ok, false);
      assert.equal(result.media.ok, true);
      assert.equal(result.media.items.length, 1);
      assert.equal(result.stories.ok, false);
      assert.equal(result.stories.items.length, 0);
      assert.equal(result.errors.length, 1);
      assert.equal(result.errors[0].scope, "stories");
      assert.equal(result.errors[0].code, "META_REQUEST_FAILED");
    });
  });
});

test("redacts credentials from list and insight error messages", async () => {
  await withEnv(VALID_ENV, async () => {
    const fake = fakeGraph({
      mediaPages: [
        {
          error: {
            message: `Request failed for access_token=${TOKEN}&fields=id`,
            code: 1,
          },
        },
      ],
      storyPages: [mediaPage([])],
    });

    await withFetch(fake, async () => {
      const result = await retrieveInstagramContent();
      const serialized = JSON.stringify(result);

      assert.equal(serialized.includes(TOKEN), false);
      assert.match(serialized, /access_token=\[redacted\]/);
      assert.equal(serialized.includes("Bearer"), false);
    });
  });
});

test("does not log the token in request URLs or authorization headers", async () => {
  await withEnv(VALID_ENV, async () => {
    const fake = fakeGraph({
      mediaPages: [mediaPage([mediaItem("m1")])],
      storyPages: [mediaPage([])],
    });

    await withFetch(fake, async () => {
      const result = await retrieveInstagramContent();

      for (const call of fake.calls) {
        assert.equal(call.url.includes(TOKEN), false);
        assert.equal(call.url.includes("access_token"), false);
        assert.equal(call.options.headers.Authorization, `Bearer ${TOKEN}`);
      }
      assert.equal(JSON.stringify(result).includes(TOKEN), false);
    });
  });
});

test("returns a configuration error without making a request", async () => {
  await withEnv(
    {
      ...VALID_ENV,
      META_SYSTEM_USER_ACCESS_TOKEN: undefined,
      META_INSTAGRAM_ACCOUNT_ID: undefined,
    },
    async () => {
      let called = false;
      const fake = async () => {
        called = true;
        return jsonResponse({});
      };

      await withFetch(fake, async () => {
        const result = await retrieveInstagramContent();

        assert.equal(called, false);
        assert.equal(result.ok, false);
        assert.equal(result.errors[0].code, "META_NOT_CONFIGURED");
        assert.equal(result.media, null);
        assert.equal(result.stories, null);
      });
    },
  );
});

test("the retrieval layer has no database imports or write statements", () => {
  const source = readFileSync(join(ROOT, "lib/meta-instagram.js"), "utf8");

  assert.equal(source.includes("venue-stats-db"), false);
  assert.equal(source.includes("@neondatabase"), false);
  assert.doesNotMatch(source, /\bINSERT\s+INTO\b/i);
  assert.doesNotMatch(source, /\bUPDATE\s+guide_app\b/i);
  assert.doesNotMatch(source, /\bDELETE\s+FROM\b/i);
});
