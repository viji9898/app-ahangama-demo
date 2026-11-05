import assert from "node:assert/strict";
import process from "node:process";
import test from "node:test";
import {
  LINK_TYPES,
  VENUE_STATS,
  getVenueStats,
} from "../lib/venue-stats-config.js";
import {
  isVenueStatsAuthDisabled,
  isVenueStatsAuthorized,
} from "../lib/venue-stats-auth.js";
import { handler as statsHandler } from "../netlify/functions/api-venue-stats.js";
import { handler as contentHandler } from "../netlify/functions/api-venue-content.js";
import { trackVenueLinkClick } from "../src/analytics.js";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const ENV_KEYS = [
  "GUIDE_ADMIN_PASSWORD",
  "VENUE_STATS_AUTH_DISABLED",
  "CONTEXT",
  "DATABASE_URL",
  "GA4_PROPERTY_ID",
];

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

function statsEvent(query = {}, { headers = {}, method = "GET" } = {}) {
  return { httpMethod: method, headers, queryStringParameters: query };
}

function parse(response) {
  return JSON.parse(response.body || "{}");
}

const AUTH = { "x-admin-password": "test-password" };

/* ------------------------------------------------------------------ */
/* Registry                                                            */
/* ------------------------------------------------------------------ */

test("venue registry contains the eight guide venues with unique identifiers", () => {
  assert.equal(VENUE_STATS.length, 8);

  const keys = VENUE_STATS.map((venue) => venue.key);
  const venueIds = VENUE_STATS.map((venue) => venue.venueId);

  assert.equal(new Set(keys).size, keys.length, "venue keys must be unique");
  assert.equal(
    new Set(venueIds).size,
    venueIds.length,
    "venue ids must be unique",
  );

  for (const venue of VENUE_STATS) {
    assert.match(venue.key, /^[a-z0-9-]+$/);
    assert.ok(venue.name);
    assert.ok(venue.section);
    assert.ok(venue.sectionLabel);
    assert.match(venue.instagram, /^https:\/\//);
    assert.match(venue.googleMaps, /^https:\/\//);
    assert.ok(Array.isArray(venue.articlePaths));

    for (const path of venue.articlePaths) {
      assert.match(path, /^\//, `${venue.key} article path must be absolute`);
    }
  }

  assert.deepEqual(
    LINK_TYPES.map((type) => type.key),
    ["instagram", "google_maps", "website"],
  );
});

test("getVenueStats is case-insensitive and rejects unknown venues", () => {
  assert.equal(getVenueStats("namikaze").key, "namikaze");
  assert.equal(getVenueStats("  Namikaze  ").key, "namikaze");
  assert.equal(getVenueStats("does-not-exist"), null);
  assert.equal(getVenueStats(""), null);
  assert.equal(getVenueStats(undefined), null);
});

/* ------------------------------------------------------------------ */
/* Temporary preview bypass                                            */
/* ------------------------------------------------------------------ */

test("preview bypass is off unless explicitly enabled", async () => {
  await withEnv(
    {
      VENUE_STATS_AUTH_DISABLED: undefined,
      CONTEXT: undefined,
      GUIDE_ADMIN_PASSWORD: "test-password",
    },
    () => {
      assert.equal(isVenueStatsAuthDisabled(), false);
      assert.equal(isVenueStatsAuthorized({}), false);
      assert.equal(isVenueStatsAuthorized(AUTH), true);
    },
  );
});

test("preview bypass allows passwordless access outside production", async () => {
  await withEnv(
    {
      VENUE_STATS_AUTH_DISABLED: "1",
      CONTEXT: undefined,
      GUIDE_ADMIN_PASSWORD: undefined,
    },
    () => {
      assert.equal(isVenueStatsAuthDisabled(), true);
      assert.equal(isVenueStatsAuthorized({}), true);
    },
  );
});

test("preview bypass never applies when CONTEXT=production", async () => {
  await withEnv(
    {
      VENUE_STATS_AUTH_DISABLED: "1",
      CONTEXT: "production",
      GUIDE_ADMIN_PASSWORD: "test-password",
    },
    () => {
      assert.equal(isVenueStatsAuthDisabled(), false);
      assert.equal(isVenueStatsAuthorized({}), false);
      assert.equal(isVenueStatsAuthorized(AUTH), true);
    },
  );
});

test("preview bypass never applies to deploy previews or branch deploys", async () => {
  for (const context of ["deploy-preview", "branch-deploy", "staging"]) {
    await withEnv(
      {
        VENUE_STATS_AUTH_DISABLED: "1",
        CONTEXT: context,
        GUIDE_ADMIN_PASSWORD: undefined,
      },
      () => {
        assert.equal(
          isVenueStatsAuthDisabled(),
          false,
          `bypass must be off for CONTEXT=${context}`,
        );
        assert.equal(isVenueStatsAuthorized({}), false);
      },
    );
  }
});

test("preview bypass applies to an explicit local dev context", async () => {
  await withEnv(
    {
      VENUE_STATS_AUTH_DISABLED: "1",
      CONTEXT: "dev",
      GUIDE_ADMIN_PASSWORD: undefined,
    },
    () => {
      assert.equal(isVenueStatsAuthDisabled(), true);
      assert.equal(isVenueStatsAuthorized({}), true);
    },
  );
});

test("preview bypass does not accept other flag values", async () => {
  await withEnv(
    {
      VENUE_STATS_AUTH_DISABLED: "true",
      CONTEXT: undefined,
      GUIDE_ADMIN_PASSWORD: undefined,
    },
    () => {
      assert.equal(isVenueStatsAuthDisabled(), false);
      assert.equal(isVenueStatsAuthorized({}), false);
    },
  );
});

/* ------------------------------------------------------------------ */
/* Click tracking                                                      */
/* ------------------------------------------------------------------ */

test("trackVenueLinkClick emits structured venue_link_click without rewriting the URL", () => {
  const calls = [];
  const destination = "https://maps.app.goo.gl/zBaLF7oDPAXZosbV9?foo=bar";

  globalThis.window = {
    location: {
      hostname: "ahangama.com",
      pathname: "/guide",
      href: "https://ahangama.com/guide",
      search: "",
      origin: "https://ahangama.com",
    },
    gtag: (...args) => calls.push(args),
  };

  try {
    const tracked = trackVenueLinkClick({
      venueId: "abode-by-the-beach",
      venueSlug: "abode-by-the-beach",
      venueName: "Abode by the Beach",
      linkType: "google_maps",
      linkUrl: destination,
      guideSection: "best_stays",
      componentLocation: "venue_card",
    });

    assert.equal(tracked, true);
    assert.equal(calls.length, 1);

    const [command, eventName, payload] = calls[0];
    assert.equal(command, "event");
    assert.equal(eventName, "venue_link_click");
    assert.equal(payload.venue_id, "abode-by-the-beach");
    assert.equal(payload.venue_slug, "abode-by-the-beach");
    assert.equal(payload.venue_name, "Abode by the Beach");
    assert.equal(payload.link_type, "google_maps");
    assert.equal(payload.link_url, destination);
    assert.equal(payload.page_location, "https://ahangama.com/guide");
    assert.equal(payload.guide_section, "best_stays");
    assert.equal(payload.component_location, "venue_card");

    for (const key of ["utm_source", "utm_medium", "utm_campaign"]) {
      assert.equal(key in payload, false, `${key} must not be added`);
    }
  } finally {
    delete globalThis.window;
  }
});

test("trackVenueLinkClick ignores incomplete events", () => {
  const calls = [];
  globalThis.window = {
    location: {
      hostname: "ahangama.com",
      pathname: "/guide",
      href: "https://ahangama.com/guide",
      search: "",
      origin: "https://ahangama.com",
    },
    gtag: (...args) => calls.push(args),
  };

  try {
    assert.equal(trackVenueLinkClick({ linkType: "instagram" }), false);
    assert.equal(trackVenueLinkClick({ venueId: "namikaze" }), false);
    assert.equal(calls.length, 0);
  } finally {
    delete globalThis.window;
  }
});

/* ------------------------------------------------------------------ */
/* API status codes                                                    */
/* ------------------------------------------------------------------ */

test("stats API rejects unsupported methods and unauthenticated requests", async () => {
  await withEnv(
    {
      VENUE_STATS_AUTH_DISABLED: undefined,
      CONTEXT: undefined,
      GUIDE_ADMIN_PASSWORD: "test-password",
    },
    async () => {
      const post = await statsHandler(statsEvent({}, { method: "POST" }));
      assert.equal(post.statusCode, 405);

      const unauthorized = await statsHandler(statsEvent({ venue: "namikaze" }));
      assert.equal(unauthorized.statusCode, 401);
      assert.equal(parse(unauthorized).ok, false);
    },
  );
});

test("stats API access probe reports whether a password is required", async () => {
  await withEnv(
    {
      VENUE_STATS_AUTH_DISABLED: "1",
      CONTEXT: undefined,
      GUIDE_ADMIN_PASSWORD: "test-password",
    },
    async () => {
      const open = await statsHandler(statsEvent({ check: "1" }));
      assert.equal(open.statusCode, 200);
      assert.deepEqual(parse(open), { ok: true, authRequired: false });
    },
  );

  await withEnv(
    {
      VENUE_STATS_AUTH_DISABLED: undefined,
      CONTEXT: undefined,
      GUIDE_ADMIN_PASSWORD: "test-password",
    },
    async () => {
      const locked = await statsHandler(statsEvent({ check: "1" }));
      assert.equal(locked.statusCode, 401);

      const unlocked = await statsHandler(
        statsEvent({ check: "1" }, { headers: AUTH }),
      );
      assert.equal(unlocked.statusCode, 200);
      assert.deepEqual(parse(unlocked), { ok: true, authRequired: true });
    },
  );
});

test("stats API returns 404 for an unknown venue", async () => {
  await withEnv(
    {
      VENUE_STATS_AUTH_DISABLED: undefined,
      CONTEXT: undefined,
      GUIDE_ADMIN_PASSWORD: "test-password",
    },
    async () => {
      const response = await statsHandler(
        statsEvent({ venue: "not-a-venue" }, { headers: AUTH }),
      );
      assert.equal(response.statusCode, 404);
      assert.equal(parse(response).error, "Unknown venue");
    },
  );
});

test("content API enforces auth, venue, method and body validation", async () => {
  await withEnv(
    {
      VENUE_STATS_AUTH_DISABLED: undefined,
      CONTEXT: undefined,
      GUIDE_ADMIN_PASSWORD: "test-password",
      DATABASE_URL: undefined,
    },
    async () => {
      const unauthorized = await contentHandler(
        statsEvent({ venue: "namikaze" }),
      );
      assert.equal(unauthorized.statusCode, 401);

      const unknown = await contentHandler(
        statsEvent({ venue: "not-a-venue" }, { headers: AUTH }),
      );
      assert.equal(unknown.statusCode, 404);

      const wrongMethod = await contentHandler(
        statsEvent({ venue: "namikaze" }, { headers: AUTH, method: "PATCH" }),
      );
      assert.equal(wrongMethod.statusCode, 405);

      const badBody = await contentHandler({
        httpMethod: "POST",
        headers: AUTH,
        queryStringParameters: { venue: "namikaze", type: "instagram" },
        body: "{not json",
      });
      assert.equal(badBody.statusCode, 400);

      const missingId = await contentHandler(
        statsEvent({ venue: "namikaze", type: "instagram" }, { headers: AUTH, method: "DELETE" }),
      );
      assert.equal(missingId.statusCode, 400);
    },
  );
});

/* ------------------------------------------------------------------ */
/* Date ranges                                                         */
/* ------------------------------------------------------------------ */

test("stats API resolves preset and custom date ranges", async () => {
  await withEnv(
    {
      VENUE_STATS_AUTH_DISABLED: undefined,
      CONTEXT: undefined,
      GUIDE_ADMIN_PASSWORD: "test-password",
      DATABASE_URL: undefined,
      GA4_PROPERTY_ID: undefined,
    },
    async () => {
      const load = async (query) => {
        const response = await statsHandler(statsEvent(query, { headers: AUTH }));
        assert.equal(response.statusCode, 200);
        return parse(response);
      };

      const seven = await load({ venue: "abode-by-the-beach", days: "7" });
      assert.equal(seven.range.key, "7d");
      assert.equal(seven.range.days, 7);

      const ninety = await load({ venue: "abode-by-the-beach", days: "90" });
      assert.equal(ninety.range.key, "90d");
      assert.equal(ninety.range.days, 90);

      const fallback = await load({ venue: "abode-by-the-beach", days: "999" });
      assert.equal(fallback.range.key, "30d");
      assert.equal(fallback.range.days, 30);

      const month = await load({
        venue: "abode-by-the-beach",
        period: "this_month",
      });
      assert.equal(month.range.key, "this_month");
      assert.match(month.range.startDate, /-01$/);

      const custom = await load({
        venue: "abode-by-the-beach",
        start: "2026-09-01",
        end: "2026-09-30",
      });
      assert.equal(custom.range.key, "custom");
      assert.equal(custom.range.startDate, "2026-09-01");
      assert.equal(custom.range.endDate, "2026-09-30");
      assert.equal(custom.range.days, 30);

      const reversed = await load({
        venue: "abode-by-the-beach",
        start: "2026-09-30",
        end: "2026-09-01",
      });
      assert.equal(reversed.range.startDate, "2026-09-01");
      assert.equal(reversed.range.endDate, "2026-09-30");
    },
  );
});

test("overview reports every registered venue", async () => {
  await withEnv(
    {
      VENUE_STATS_AUTH_DISABLED: undefined,
      CONTEXT: undefined,
      GUIDE_ADMIN_PASSWORD: "test-password",
      DATABASE_URL: undefined,
      GA4_PROPERTY_ID: undefined,
    },
    async () => {
      const response = await statsHandler(
        statsEvent({ scope: "overview", days: "7" }, { headers: AUTH }),
      );
      assert.equal(response.statusCode, 200);

      const body = parse(response);
      assert.equal(body.venues.length, VENUE_STATS.length);
      assert.deepEqual(
        body.venues.map((venue) => venue.key),
        VENUE_STATS.map((venue) => venue.key),
      );
    },
  );
});
