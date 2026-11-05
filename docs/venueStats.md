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
```

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
database connection, migration 033, and the admin password. It exits
non-zero when a required check fails, so it can run in CI or before a
deploy.

Run the regression suite with:

```sh
npm run test:venue-stats
```

The tests cover registry integrity, the preview-bypass matrix, the
`venue_link_click` payload, API auth/404/405/400 handling, and date-range
resolution.

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
