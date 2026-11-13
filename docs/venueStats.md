# Venue Performance Statistics

Per-venue analytics for the eight venues featured in the Ahangama Digital Guide.

## Pages

| Venue | URL |
| --- | --- |
| Abode by the Beach | `/stats/abode-by-the-beach` |
| Abode Ahangama | `/stats/abode-ahangama` |
| Spa Therapy Ahangama | `/stats/spa-therapy-ahangama` |
| The Spice Trail Boutique Hotel & Spa | `/stats/the-spice-trail` |
| Little Bang Kitchen | `/stats/little-bang-kitchen` |
| Nirbana Retreat – Paddle Boarding | `/stats/nirbana-paddle-boarding` |
| Salon Change | `/stats/salon-change` |
| Namikaze Restaurant & Bar | `/stats/namikaze` |

`/stats` is the overview that links to all eight. The canonical venue
registry lives in `lib/venue-stats-config.js` and is shared by the browser
bundle and the Netlify functions.

The pages reuse the guide admin password. A session is stored in
`sessionStorage` under `ahangama-guide-admin-password`, and every API
request sends `X-Admin-Password`. The same gate protects `/admin-guide`,
so signing in to either area unlocks both.

### Temporary preview without a password

To browse the reports before setting a password, add this to `.env` and
restart the dev server:

```sh
VENUE_STATS_AUTH_DISABLED=1
```

The API answers a lightweight `GET /api/venue-stats?check=1` probe with
`200`, and the pages skip the password gate. The switch is deliberately
ignored outside local development (production, deploy previews and branch
deploys), so a deployed site stays locked even if the variable is present.
Remove the line (or set it to anything other than `1`) to restore the gate.

## Tracking

The guide already tracks outbound venue links as `guide_outbound_click`.
A second, canonical event is now emitted for the statistics pages:

```js
window.gtag("event", "venue_link_click", {
  event_category: "venue_engagement",
  source_domain: "ahangama.com",
  page_path: "/guide",
  page_location: "https://ahangama.com/guide",
  venue_id: "abode-by-the-beach",
  venue_slug: "abode-by-the-beach",
  venue_name: "Abode by the Beach",
  link_type: "instagram", // instagram | google_maps | website
  link_url: "https://www.instagram.com/abode.bythebeach/",
  guide_section: "best_stays",
  component_location: "venue_card",
});
```

The original destination is passed through unchanged. **No UTM or other
tracking parameters are appended** and no duplicate links are created.

`venue_impression` is unchanged: it fires once per venue per guide render
after the card is at least 50% visible for one continuous second.

### GA4 custom dimensions

The Data API can only break events down by parameters that are registered
as event-scoped custom dimensions. In GA4 go to **Admin → Data display →
Custom definitions → Create custom dimension** and register:

| Dimension name | Event parameter |
| --- | --- |
| Venue ID | `venue_id` |
| Venue slug | `venue_slug` |
| Venue name | `venue_name` |
| Link type | `link_type` |
| Link URL | `link_url` |
| Guide section | `guide_section` |
| Component location | `component_location` |
| Destination URL | `destination_url` |

Custom definitions are **not retroactive**. Data collected before a
dimension is registered cannot be broken down per venue. The report shows
a setup notice when the dimensions are missing.

## Environment variables

Server-side only — never expose these to the frontend.

```sh
GA4_PROPERTY_ID=123456789            # numeric property id, not G-HZ20D69WMB
GA4_SERVICE_ACCOUNT_JSON=...         # full service-account JSON on one line
# or
GA4_SERVICE_ACCOUNT_EMAIL=...
GA4_SERVICE_ACCOUNT_PRIVATE_KEY=...
# or
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

GUIDE_ADMIN_PASSWORD=...             # shared with the guide dashboard

# Meta / Instagram Graph API — Ahangama's own Business account only.
META_SYSTEM_USER_ACCESS_TOKEN=...    # System User token, server-side only
META_PAGE_ID=...                     # Facebook Page linked to the account
META_INSTAGRAM_ACCOUNT_ID=...        # Instagram Business account id
META_GRAPH_API_VERSION=v26.0
```

The System User needs `instagram_basic`, `pages_show_list`,
`pages_read_engagement` and `instagram_manage_insights`, and must be assigned
to both the Facebook Page and the Instagram Business account. Partner venue
accounts are not queried with these credentials; their posts are assigned
manually in the dashboard.

The service account needs at least **Viewer** access to the GA4 property.
Enable the **Google Analytics Data API v1** in the Google Cloud project.

When `GA4_PROPERTY_ID` is missing, the pages load normally and show zero
metrics with a clear “GA4 Data API is not connected” notice. Nothing is
fabricated.

## Database

Run `migrations/033_create_venue_stats_content.sql`. It creates two tables
in the `guide_app` schema:

- `guide_app.venue_instagram_posts` — manually entered Instagram Insights.
- `guide_app.venue_articles` — associations between a venue and an
  Ahangama.com article. Article traffic is always read live from GA4.

`migrations/034_create_instagram_sync.sql` adds the Instagram sync
foundation:

- `guide_app.instagram_media` — automatically synced media and last captured
  Insights. `metrics_fetched_at` records the last attempt;
  `metrics_captured_at` records the last successful capture.
- `guide_app.instagram_media_venues` — venue assignments for synced media.
  Assignment is insert-only: existing pairs are left alone and removal is an
  explicit operation.
- `guide_app.instagram_sync_runs` — audit log of sync attempts. Every
  non-running run must have `finished_at` and `duration_ms`.

Migration 034 owns an explicit transaction, so a failed statement rolls back
the whole Instagram schema instead of leaving a partial one. Apply it as one
file (`node scripts/run-guide-migration.mjs`, or
`psql -v ON_ERROR_STOP=1 -f migrations/034_create_instagram_sync.sql`). It has
not been applied to staging or production as part of Phase 1.

Manual `venue_instagram_posts` rows are never migrated, merged or deleted by
the sync foundation. Expired Stories are retained with their last captured
metrics and `story_expires_at`; there is no cleanup job.

**Planned Phase 2 contract.** The sync worker is not implemented in Phase 1.
When it is added, it will use PostgreSQL session advisory lock `734001`.
Acquisition, run updates and release will all use the same database
connection, exposed to the worker only as a restricted client-bound `query`
interface. Overlapping attempts will record a `skipped` run and exit without
syncing. No scheduler, API endpoint, dashboard UI or automatic Meta sync
exists yet.

`getInstagramSyncStatus` takes account follower and media counts from the
newest successful run that contains each value, so a newer success with empty
account fields cannot hide earlier captured counts.

`venue_key` is the statistics URL segment (for example `little-bang-kitchen`),
not the database venue id. This keeps URLs stable.

For local preview against a different database, set an optional
`VENUE_STATS_DATABASE_URL`. It is used only by the venue statistics content
layer; the rest of the app keeps using `DATABASE_URL`. Production normally
leaves it unset.

## Verification

Run the pre-flight check after configuring the environment:

```sh
npm run check:venue-stats
```

It validates the eight-venue registry, the numeric GA4 property id, the
service-account connection, the five event-scoped custom dimensions, the
database connection, migration 033, and the admin password. For migration 034
it verifies all three tables, their essential columns, named constraints, the
cascade foreign key and the supporting indexes. The check is read-only: it
reports missing schema elements and never applies or repairs a migration. It
exits non-zero when a required check fails, so it can run in CI or before a
deploy.

Validate the Meta connection separately with the read-only check:

```sh
npm run check:meta
```

It verifies the token, Page, linked Instagram account, media/story reads and
Insights access. It never writes to the database, never changes content, and
never prints the access token.

Validate the Phase 2A retrieval layer with the live, read-only check:

```sh
npm run check:instagram-retrieval
```

It retrieves posts, carousels, Reels and active Stories through
`retrieveInstagramContent()` and prints a safe summary: counts by media and
product type, insight success/failure counts, unsupported metrics, and
pagination pages/duplicates/truncation. Media ids are masked and URLs are
removed from error text. It never opens a database connection, writes data,
changes content or prints credentials. It exits non-zero when a collection or a
fatal insight request fails; unsupported metrics remain warnings because Meta
reports them per media type.

### Phase 2A retrieval contract

`lib/meta-instagram.js` exposes `retrieveInstagramContent(options)`. It is
read-only and returns a normalised object rather than writing to PostgreSQL:

- `media.items` and `stories.items` — each has `media` metadata, `insights`,
  `insightState`, `retrievedAt`, `metricsFetchedAt` and `metricsCapturedAt`.
- `insights` — aggregate counts of `ok`, `partial`, `unavailable`, `error` and
  `skipped` items, plus any fatal error.
- `errors` and `warnings` — collection-level and safety failures.
- `media.pagination` and `stories.pagination` — pages, fetched/unique/duplicate
  counts, `truncated`, `stoppedReason` and any cursor error.

Metadata fields are `igMediaId`, `mediaType`, `mediaProductType`, `caption`,
`permalink`, `mediaUrl`, `thumbnailUrl`, `postedAt`, `storyExpiresAt`,
`username`, `likeCount`, `commentsCount` and carousel `children`. Missing
fields are `null`, never guessed.

Insight values use the Phase 1 column names: `views`, `reach`, `likes`,
`comments`, `shares` and `saves`. Meta's `saved` metric is mapped to `saves`.
Metrics unsupported for a media type are left `null` and listed in
`insightState.unavailable`; temporary failures are listed in
`insightState.errors` and never converted to zero.

Supported insight requests in the configured Graph API version:

| Product type | Metrics |
| --- | --- |
| `FEED` (images and carousels) | `views, reach, likes, comments, shares, saved` |
| `REELS` | `views, reach, likes, comments, shares, saved` |
| `STORY` | `views, reach, shares` |

`impressions` is not requested: it is unsupported from v22.0 onward and `views`
replaces it. Stories also support `navigation`, `replies` and `link_clicks`;
those remain deferred because migration 034 does not have columns for them.

Pagination follows only `paging.next` URLs on `graph.facebook.com`. The
`access_token` query parameter is stripped from the cursor and the token is
sent in the Authorization header instead. Retrieval stops on the end of the
collection, an invalid or off-origin cursor, a repeated cursor, the page limit
or the item limit. Duplicate media ids are counted and skipped.

Run the retrieval tests with:

```sh
npm run test:instagram-retrieval
```

The suite uses a mocked Graph API. It covers posts, carousels, Reels, active
Stories, multi-page collections, duplicate ids, empty results, missing optional
fields, supported and unsupported metrics, rate limits, invalid credentials,
partial collection failures, cursor safety and credential redaction. It never
calls the live API or a database.

### Phase 2B persistence contract

`lib/instagram-sync-persistence.js` writes a Phase 2A retrieval result through
the existing Phase 1 database methods:

- `persistInstagramRetrieval(retrieval)` persists both `media` and `stories`
  and returns per-collection counts plus a flattened error list.
- `persistInstagramCollection(collection)` persists one collection. It accepts
  an optional `store` override, used by the mocked tests; the default store is
  `upsertInstagramMedia`, `saveInstagramMediaMetrics` and
  `markInstagramMediaMetricsFailed`.

`upsertInstagramMedia` keys on `ig_media_id`, so repeated syncs update the same
row instead of duplicating it. Null or omitted API metadata is passed through
as `null`, which the SQL `COALESCE` preserves existing useful values. Story
expiry is written once: a later sync never moves the original
`story_expires_at`, and expired Stories remain in the table with their last
captured metrics.

`ok` and `partial` insight states call `saveInstagramMediaMetrics`; `error` and
`unavailable` states call `markInstagramMediaMetricsFailed`, which advances
`metrics_fetched_at` without replacing the metric values or
`metrics_captured_at`. `pending` and `skipped` states only refresh metadata.
Meta's `saved` is mapped to `saves`; `impressions` is never forwarded.

A collection-level failure (for example an expired token or timeout) writes
nothing for that collection, so failed collections are never treated as empty
ones. One item failing does not abort the rest of its collection. Persistence
never assigns media to venues, edits manual Instagram records, uses advisory
locks, retries or schedules work.

Run the mocked persistence tests with:

```sh
npm run test:instagram-sync-persistence
```

Run the regression suite with:

```sh
npm run test:venue-stats
```

The tests cover registry integrity, the preview-bypass matrix, the
`venue_link_click` payload, API auth/404/405/400 handling, and date-range
resolution.

The Instagram sync foundation has a static suite and a real-PostgreSQL
integration suite:

```sh
npm run test:instagram-sync      # migration structure and safety invariants
npm run test:instagram-sync-persistence  # mocked Phase 2B persistence
npm run test:instagram-sync-db   # skipped unless a test database is supplied
```

To run the database suite against a disposable local database:

```sh
createdb ahangama_instagram_test
INSTAGRAM_TEST_DATABASE_URL=postgres://localhost/ahangama_instagram_test \
ALLOW_INSTAGRAM_DB_TESTS=1 \
npm run test:instagram-sync-db
```

The suite is opt-in and deliberately refuses uncertain databases:

- `ALLOW_INSTAGRAM_DB_TESTS=1` is required.
- `NODE_ENV=production` and Netlify `CONTEXT=production` are rejected.
- The URL must use `postgres://` or `postgresql://` and must not be the
  configured `DATABASE_URL` or `VENUE_STATS_DATABASE_URL`.
- The database name must contain an explicit `test`, `tests`, `testing`, `ci`,
  `dev`, `development` or `staging` segment, and must not contain a `prod`,
  `production`, `live`, `primary` or `main` segment.
- The host must be loopback (`localhost`, `127.0.0.1`, `::1`) unless it is
  explicitly listed in `INSTAGRAM_TEST_DATABASE_HOSTS`.
- Cleanup truncates only the three Instagram sync tables. Pre-existing
  `venue_instagram_posts` and `venue_articles` rows are never truncated; tests
  remove only the rows they create.

Do not point the suite at a shared database whose Instagram sync tables are
not disposable: the suite still truncates those three sync tables between
tests.

## API

Both endpoints require `X-Admin-Password`. A lightweight
`GET /api/venue-stats?check=1` probe returns `{ ok: true, authRequired }`
without touching GA4 or the database; the frontend uses it to decide
whether to show the password gate.

### `GET /api/venue-stats`

| Parameter | Values |
| --- | --- |
| `venue` | statistics key, or omit with `scope=overview` |
| `scope` | `overview` |
| `days` | `7`, `30`, `90`, `180`, `365` |
| `period` | `this_month` |
| `start`, `end` | `YYYY-MM-DD` custom range |
| `granularity` | `day`, `week`, `month` |

Response highlights:

```json
{
  "ok": true,
  "venue": { "key": "...", "venueId": "...", "name": "..." },
  "range": { "startDate": "2026-10-05", "endDate": "2026-11-03" },
  "ga4": { "configured": true },
  "metrics": {
    "totalClicks": 0,
    "instagramClicks": 0,
    "googleMapsClicks": 0,
    "websiteClicks": 0,
    "impressions": 0,
    "uniqueExposed": 0,
    "guidePageViews": 0,
    "guideUniqueVisitors": 0,
    "ctr": 0,
    "trackingStartedAt": null
  },
  "linkBreakdown": [],
  "series": [],
  "content": { "instagram": { "posts": [] }, "articles": [] },
  "errors": []
}
```

Each GA4 query is isolated: a missing dimension returns
`GA4_DIMENSION_UNAVAILABLE` for that section instead of failing the whole
report.

Article entries in `content.articles` expose five metrics:

| Field | Source |
| --- | --- |
| `pageViews` | GA4 `screenPageViews` for the article path |
| `uniqueVisitors` | GA4 `totalUsers` for the article path |
| `engagedReads` | `article_engaged_read` event count |
| `completions` | `article_complete` event count |
| `placeClicks` | `article_outbound_click` event count |

A metric is `null` when the relevant GA4 query could not run. The interface
renders that as an em dash (`—`). A legitimate zero stays `0`.

### `/api/venue-content`

| Method | Query | Body |
| --- | --- | --- |
| `GET` | `?venue=<key>` | — |
| `POST` | `?venue=<key>&type=instagram` | post fields |
| `POST` | `?venue=<key>&type=article` | `title`, `url`, `publishedAt` |
| `DELETE` | `?venue=<key>&type=instagram&id=<id>` | — |
| `DELETE` | `?venue=<key>&type=article&id=<id>` | — |

## Limitations

- GA4 cannot report Instagram Insights. Post reach, impressions, likes,
  comments, shares and saves are entered manually.
- The guide is a single page (`/guide`), so “page views” are guide page
  views. Venue-level exposure is measured with `venue_impression`.
- Nothing is backfilled or estimated. Periods before tracking began show
  zero and the report states the first recorded click date.

## Adding a venue

1. Add an entry to `VENUE_STATS` in `lib/venue-stats-config.js`.
2. Use the canonical `venues260414.id` as `venueId`.
3. Keep `key` as the public `/stats/<key>` URL segment.
4. The overview page and API pick it up automatically.
