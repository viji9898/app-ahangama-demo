# Guide Engagement Tracking

This document describes the Google Analytics 4 (GA4) tracking implemented for `/guide`, the canonical venue identity model, and how to query the resulting data through the Google Analytics Data API.

## Goals

The tracking answers these questions:

- Which venues receive the most interest?
- Which venue cards receive qualified exposure before an interaction?
- Do visitors prefer Instagram, Google Maps, or venue websites?
- Which guide sections and UI locations generate engagement?
- Which map filters and markers are used?
- Which sections are selected from guide navigation?
- How often does the guide send visitors to the complimentary pass?

Tracking is anonymous and GA4-only. Do not include names, email addresses, pass identifiers, or other personally identifiable information in guide event parameters.

## Architecture

```mermaid
flowchart LR
  DB[(venues260414)] --> API[Venue API]
  API -. validates canonical ID and slug .-> Identity[guideVenueIdentities.js]
  Editorial[Guide editorial arrays] --> Enrich[Identity and section enrichment]
  Identity --> Enrich
  Enrich --> UI[/guide interactions]
  UI --> Helper[trackGuideEvent]
  Helper --> GA4[GA4 property]
  GA4 --> DataAPI[Google Analytics Data API]
```

Relevant files:

- `src/analytics.js`: shared guide-event and venue-impression GA4 transports
- `src/hooks/useTrackedImpression.js`: reusable timed visibility observer
- `src/pages/ExperienceAhangamaGuide.jsx`: event triggers and guide-section context
- `src/data/guideVenueIdentities.js`: one mapping from guide display names to canonical venue IDs and slugs
- `lib/venues-db.js`: canonical venue API query and DTO normalization
- `netlify/functions/api-venues-list.js`: public venue API endpoint
- `migrations/026_seed_guide_venues.sql`: idempotent seed for guide venues that were missing from the canonical table
- `index.html`: GA4 tag for measurement ID `G-HZ20D69WMB`

## Single Source of Truth

The canonical venue source is the `venues260414` database table, exposed through the venue API. Treat these API fields as authoritative:

- `id`
- `slug`
- `name`
- `instagram`
- `mapUrl`
- other mutable venue metadata

`src/data/guideVenueIdentities.js` is the single identity bridge used while `/guide` still keeps its editorial copy, ordering, and images in static arrays. It maps each current guide display name to:

```js
{
  venueId: "kaffi-ahangama",
  venueSlug: "kaffi-ag",
}
```

The guide must not repeat canonical IDs or slugs inside individual venue cards. Every venue collection is enriched through `withGuideVenueIdentity()` and receives a `guideSection` separately. This prevents ID drift and correctly handles records where `id !== slug`.

Use `venue_id` as the durable reporting key. Use `venue_slug` for readable URLs and reports, and `venue_name` as the display-name snapshot captured when the event occurred. Names and slugs can change; historical reports should not join on either field alone.

When adding or changing a guide venue:

1. Create or update the canonical `venues260414` record first.
2. Confirm the exact `id` and `slug` returned by the public venue API.
3. Add or update the mapping only in `guideVenueIdentities.js`.
4. Do not create a second mapping inside `ExperienceAhangamaGuide.jsx`.
5. Validate that the registry pair resolves to one live API record.

A future API-rendered guide should store only editorial configuration such as canonical venue ID, section, and position. The API should then supply mutable names, links, images, and coordinates. At that point, the temporary display-name identity bridge can be removed.

## GA4 Event Transport

`trackGuideEvent(eventName, params)` calls:

```js
window.gtag("event", eventName, {
  event_category: "guide_engagement",
  source_domain: window.location.hostname,
  page_path: window.location.pathname,
  ...params,
});
```

The helper safely returns without throwing when rendered outside the browser or when `gtag` is unavailable. Tracking does not delay outbound navigation.

GA4 Enhanced Measurement may also produce generic `click` events. Use the custom `guide_*` events for guide reporting; combining both will double-count some outbound actions.

## Events

| Event | Trigger | Important parameters |
| --- | --- | --- |
| `venue_impression` | A venue card is at least 50% visible for one continuous second | venue fields, `guide_section`, `component_location`, `position`, content fields, available UTM attribution |
| `guide_outbound_click` | Instagram, Google Maps, website, or guide social link | `link_type`, venue fields when applicable, `guide_section`, `component_location`, `destination_url` |
| `guide_lightbox_open` | Venue image opens in the lightbox | venue fields, `guide_section`, `component_location` |
| `guide_map_marker_select` | Map marker selected | venue fields, `guide_section`, `map_category`, `component_location` |
| `guide_map_filter_select` | Map category filter selected | `selected_filter`, `component_location` |
| `guide_contents_select` | Contents page or floating ribbon navigation selected | `target_section`, `component_location` |
| `guide_pass_cta_click` | Complimentary Pass CTA selected | `cta_location`, `destination_url` |

Venue fields are:

- `venue_id`
- `venue_slug`
- `venue_name`

`component_location` distinguishes placements such as `venue_card`, `venue_lightbox`, `guide_map`, `contents_page`, `toc_ribbon`, and `closing_cta`.

`venue_impression` is emitted once per canonical `venue_id` during one `/guide` render. Leaving the card before the one-second threshold cancels the pending impression. Map markers do not count as impressions, and cards without a canonical identity are not emitted. A full page refresh can count the venue again.

Example outbound payload:

```js
{
  event_category: "guide_engagement",
  source_domain: "ahangama.com",
  page_path: "/guide",
  link_type: "instagram",
  venue_id: "kaffi-ahangama",
  venue_slug: "kaffi-ag",
  venue_name: "Kaffi Ahangama",
  guide_section: "best_cafes",
  component_location: "venue_card",
  destination_url: "https://www.instagram.com/kaffi.ahangama/",
}
```

## Configure GA4 Reporting

The parameters are collected immediately, but GA4 custom-parameter reporting requires event-scoped custom dimensions.

In GA4, open **Admin > Data display > Custom definitions > Create custom dimension** and register these event parameters:

| Dimension name | Event parameter |
| --- | --- |
| Venue ID | `venue_id` |
| Venue slug | `venue_slug` |
| Venue name | `venue_name` |
| Guide section | `guide_section` |
| Link type | `link_type` |
| Component location | `component_location` |
| Destination URL | `destination_url` |
| Target section | `target_section` |
| Selected filter | `selected_filter` |
| Map category | `map_category` |
| CTA location | `cta_location` |
| Position | `position` |
| Page type | `page_type` |
| Content ID | `content_id` |
| Content type | `content_type` |

Custom definitions are not retroactive. Create them before relying on breakdown reports. `eventName`, `eventCount`, `totalUsers`, `date`, `pagePath`, and similar built-in fields do not need custom definitions.

Use GA4 **DebugView** during implementation and **Realtime** for an immediate directional check. Standard reports and Data API results can take time to process.

## Access Through the Google Analytics Data API

The Data API reads processed GA4 reporting data. It is different from the browser measurement endpoint and from the Google Analytics Admin API.

### Prerequisites

1. Find the numeric GA4 **Property ID** under **Admin > Property settings**. The property ID is not the measurement ID `G-HZ20D69WMB`.
2. Create or select a Google Cloud project.
3. Enable **Google Analytics Data API v1** for that project.
4. Authenticate with Application Default Credentials or a service account.
5. In GA4 **Admin > Property access management**, add the user or service-account email with at least Viewer access.
6. Keep credential JSON outside the repository and never commit it.

For local service-account authentication:

```sh
export GA4_PROPERTY_ID="123456789"
export GOOGLE_APPLICATION_CREDENTIALS="/absolute/path/to/service-account.json"
```

Install Google's Node client in the environment that will run reports:

```sh
npm install @google-analytics/data
```

### Node.js report example

The following query returns guide event counts broken down by venue and link type:

```js
import { BetaAnalyticsDataClient } from "@google-analytics/data";

const propertyId = process.env.GA4_PROPERTY_ID;

if (!propertyId) {
  throw new Error("GA4_PROPERTY_ID is required");
}

const analyticsData = new BetaAnalyticsDataClient();

const [report] = await analyticsData.runReport({
  property: `properties/${propertyId}`,
  dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
  dimensions: [
    { name: "eventName" },
    { name: "customEvent:venue_id" },
    { name: "customEvent:venue_name" },
    { name: "customEvent:guide_section" },
    { name: "customEvent:link_type" },
    { name: "customEvent:component_location" },
  ],
  metrics: [
    { name: "eventCount" },
    { name: "totalUsers" },
  ],
  dimensionFilter: {
    filter: {
      fieldName: "eventName",
      stringFilter: {
        matchType: "BEGINS_WITH",
        value: "guide_",
        caseSensitive: true,
      },
    },
  },
  orderBys: [
    {
      metric: { metricName: "eventCount" },
      desc: true,
    },
  ],
  limit: 10000,
});

const dimensionNames = report.dimensionHeaders.map(({ name }) => name);
const metricNames = report.metricHeaders.map(({ name }) => name);

const rows = (report.rows || []).map((row) => ({
  ...Object.fromEntries(
    dimensionNames.map((name, index) => [name, row.dimensionValues[index].value]),
  ),
  ...Object.fromEntries(
    metricNames.map((name, index) => [name, Number(row.metricValues[index].value)]),
  ),
}));

console.table(rows);
```

GA4 event-scoped custom dimensions use the Data API name `customEvent:<event_parameter>`. For example, the registered `venue_id` parameter is queried as `customEvent:venue_id`. A request fails if the custom dimension has not been registered in that GA4 property.

To report only venue outbound intent, change the filter to an exact event match:

```js
dimensionFilter: {
  filter: {
    fieldName: "eventName",
    stringFilter: {
      matchType: "EXACT",
      value: "guide_outbound_click",
      caseSensitive: true,
    },
  },
},
```

Useful report combinations include:

- venue leaderboard: `customEvent:venue_id`, `customEvent:venue_name`, `eventCount`
- Instagram versus Maps: `customEvent:link_type`, `eventCount`, filtered to `guide_outbound_click`
- section engagement: `customEvent:guide_section`, `eventName`, `eventCount`
- card versus lightbox: `customEvent:component_location`, `eventCount`
- navigation interest: `customEvent:target_section`, filtered to `guide_contents_select`
- map interest: `customEvent:map_category` or `customEvent:selected_filter`

### REST endpoint

The equivalent reporting endpoint is:

```text
POST https://analyticsdata.googleapis.com/v1beta/properties/PROPERTY_ID:runReport
```

It requires an OAuth access token with the `analytics.readonly` or `analytics` scope. Prefer the official client library unless a REST-only integration is required because it handles authentication and response types.

## Operational Notes

- GA4 is suitable for product and editorial analytics, but ad blockers and consent settings can reduce counts.
- Do not present GA4 counts as audited partner billing totals. Add a first-party server-side event store if contractual reporting is required.
- Avoid renaming event names or parameter keys after release; doing so fragments historical reports.
- Adding a new event parameter requires updating this document and registering its custom dimension before querying it.
- If a venue display name changes, preserve its canonical `venue_id` so historical and current engagement remain comparable.

## Official References

- [Google Analytics Data API quickstart](https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart-client-libraries)
- [Data API dimensions and metrics](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema)
- [`properties.runReport` reference](https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport)
