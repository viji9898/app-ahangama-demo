# How to Change the New QR Code Redirect Destinations

**File to edit:** `src/data/guideQrRedirectsNew.js`

These are the **37 new** QR codes for the Ahangama Physical Guide 2026/27.
The original seven QR codes live in `src/data/guideQrRedirects.js` and are
**not affected** by this file.

## Background

Every QR code encodes a permanent URL:

```
https://ahangama.com/go/{slug}
```

That URL is printed on paper and must never change. Only the destination it
redirects to can change later.

Because the individual pages do not exist yet, **every new entry currently uses
a safe fallback destination**:

```js
destination: "/guide"
```

`/guide` is the live online guide, so no QR code can produce a 404.

The intended future page for each entry is recorded separately:

```js
plannedDestination: "/guide/{slug}"
```

`plannedDestination` is documentation only — it is not used by the redirect
until you copy it into `destination`.

## Prerequisite: publish the page first

Before changing a destination, confirm the target page actually exists and
returns 200. For the planned URLs this means creating a route/pages such as
`/guide/first-24-hours`.

If the page is not live yet, leave `destination: "/guide"` in place.

## Step-by-step: update one destination

1. Open `src/data/guideQrRedirectsNew.js`.
2. Find the entry by its `slug` (for example `first-24-hours`).
3. Change **only** the `destination` field:

```js
// Before — safe fallback
{
  slug: "first-24-hours",
  ...
  destination: "/guide",
  plannedDestination: "/guide/first-24-hours",
}

// After — dedicated page is now live
{
  slug: "first-24-hours",
  ...
  destination: "/guide/first-24-hours",
  plannedDestination: "/guide/first-24-hours",
}
```

4. Save and redeploy. **No QR codes need to be regenerated.**

> Do **not** change `slug`, `section`, or `codeId`. They are printed into the
> QR codes and sent to GA4.

## Destination formats

| Format | Example | When to use |
|--------|---------|-------------|
| Root-relative path | `/guide/first-24-hours` | Same-domain pages |
| Absolute URL | `https://pass.ahangama.com/day-pass` | External or subdomain pages |

## Updating many destinations safely

You can promote a batch by copying each `plannedDestination` into `destination`
after the corresponding pages are live. Keep the fallback in place for any page
that is not ready. Never point a QR code at a path that does not exist.

## How tracking works (unchanged)

When someone scans a new QR code:

1. Browser opens `https://ahangama.com/go/{slug}`.
2. `GuideQrLandingPage.jsx` fires the existing GA4 `qr_scan` event with:
   - `qr_section` — unique key for this QR code (e.g. `first_24_hours`)
   - `qr_code_id` — unique code ID (e.g. `qr_first_24_hours`)
   - `qr_source` — `physical_guide`
   - `qr_medium` — `qr`
   - `qr_campaign` — `ahangama_guide_2026_27`
3. After 200 ms the browser redirects to `destination`.

The event implementation, deduplication behaviour, and the original seven QR
codes are unchanged.

## Full slug / destination reference

| # | Page title | Slug | Planned destination | Live destination |
|---|------------|------|---------------------|------------------|
| 1 | Your First 24 hours in Ahangama | `first-24-hours` | `/guide/first-24-hours` | `/guide` |
| 2 | Day 02 | `day-02` | `/guide/day-02` | `/guide` |
| 3 | Rise & Dine | `rise-and-dine` | `/guide/rise-and-dine` | `/guide` |
| 4 | Brew with a View | `brew-with-a-view` | `/guide/brew-with-a-view` | `/guide` |
| 5 | Taste of Sri Lanka | `taste-of-sri-lanka` | `/guide/taste-of-sri-lanka` | `/guide` |
| 6 | Midday Plates | `midday-plates` | `/guide/midday-plates` | `/guide` |
| 7 | Sunset Eats & Drinks | `sunset-eats-drinks` | `/guide/sunset-eats-drinks` | `/guide` |
| 8 | After Dark | `after-dark` | `/guide/after-dark` | `/guide` |
| 9 | Green Plates | `green-plates` | `/guide/green-plates` | `/guide` |
| 10 | Little Feet, Big Adventures | `little-feet-big-adventures` | `/guide/little-feet-big-adventures` | `/guide` |
| 11 | Hotels to Explore | `hotels-to-explore` | `/guide/hotels-to-explore` | `/guide` |
| 12 | Boutique Hotels | `boutique-hotels` | `/guide/boutique-hotels` | `/guide` |
| 13 | Villas we love | `villas-we-love` | `/guide/villas-we-love` | `/guide` |
| 14 | Wellness & Retreat Stays | `wellness-retreat-stays` | `/guide/wellness-retreat-stays` | `/guide` |
| 15 | Hostels | `hostels` | `/guide/hostels` | `/guide` |
| 16 | Pilates | `pilates` | `/guide/pilates` | `/guide` |
| 17 | Meditation & Mindfulness | `meditation-mindfulness` | `/guide/meditation-mindfulness` | `/guide` |
| 18 | Fitness & Gyms | `fitness-gyms` | `/guide/fitness-gyms` | `/guide` |
| 19 | Spa & Traditional Healing | `spa-traditional-healing` | `/guide/spa-traditional-healing` | `/guide` |
| 20 | Recovery Therapy | `recovery-therapy` | `/guide/recovery-therapy` | `/guide` |
| 21 | Surf & Stay | `surf-and-stay` | `/guide/surf-and-stay` | `/guide` |
| 22 | Chase the Swell | `chase-the-swell` | `/guide/chase-the-swell` | `/guide` |
| 23 | Borrow A Board | `borrow-a-board` | `/guide/borrow-a-board` | `/guide` |
| 24 | 10 Things You Should do in Ahangama | `10-things-to-do` | `/guide/10-things-to-do` | `/guide` |
| 25 | Beyond the Beach | `beyond-the-beach` | `/guide/beyond-the-beach` | `/guide` |
| 26 | Everyday Ahangama | `everyday-ahangama` | `/guide/everyday-ahangama` | `/guide` |
| 27 | A Little Piece of Ahangama | `a-little-piece-of-ahangama` | `/guide/a-little-piece-of-ahangama` | `/guide` |
| 28 | Sorted in Ahangama | `sorted-in-ahangama` | `/guide/sorted-in-ahangama` | `/guide` |
| 29 | Nightlife in Ahangama | `nightlife` | `/guide/nightlife` | `/guide` |
| 30 | Local Tour Guides | `local-tour-guides` | `/guide/local-tour-guides` | `/guide` |
| 31 | Need A Ride? | `need-a-ride` | `/guide/need-a-ride` | `/guide` |
| 32 | Where the Wild Meets the Waves | `wild-meets-the-waves` | `/guide/wild-meets-the-waves` | `/guide` |
| 33 | Whales, Waves & The Open Ocean | `whales-waves-open-ocean` | `/guide/whales-waves-open-ocean` | `/guide` |
| 34 | Where to Head Out to the Sea | `head-out-to-the-sea` | `/guide/head-out-to-the-sea` | `/guide` |
| 35 | Build Your Hill-Country Adventure | `hill-country-adventure` | `/guide/hill-country-adventure` | `/guide` |
| 36 | Five Ways To Continue Your Sri Lankan Story | `continue-your-sri-lankan-story` | `/guide/continue-your-sri-lankan-story` | `/guide` |
| 37 | Ahangama Directory | `ahangama-directory` | `/guide/ahangama-directory` | `/guide` |

## Regenerating files (not normally needed)

Only regenerate if the QR artwork itself must change — regenerating is never
required when changing a destination.

```bash
node scripts/generate-guide-qr-codes-new.mjs
node scripts/generate-qr-reference-sheet-new.mjs
```

## Files involved

| File | Purpose |
|------|---------|
| `src/data/guideQrRedirectsNew.js` | Redirect map for the 37 new codes — edit destinations here |
| `src/data/guideQrRedirects.js` | Original seven codes (unchanged) + combined lookup |
| `src/pages/GuideQrLandingPage.jsx` | Shared `/go/:slug` landing page (unchanged) |
| `scripts/generate-guide-qr-codes-new.mjs` | Generates the 37 SVG + PNG files |
| `scripts/generate-qr-reference-sheet-new.mjs` | Generates the CSV + PDF |
| `ahangama-guide-qr-codes-new/` | All new QR assets and this document |
