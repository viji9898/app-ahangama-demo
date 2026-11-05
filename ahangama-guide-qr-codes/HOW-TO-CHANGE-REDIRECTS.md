# How to Change QR Code Redirect Destinations

**File to edit:** `src/data/guideQrRedirects.js`

## Background

The seven printed QR codes in the Ahangama Physical Guide (2026/27) point to permanent URLs under `ahangama.com/go/`. These URLs will never change — they are etched into the printed magazine.

What **can** change is where those URLs redirect to. All redirect destinations live in a single configuration file. Changing a destination requires editing one line and redeploying.

## Step-by-Step: Update a Redirect Destination

1. Open `src/data/guideQrRedirects.js`
2. Find the section entry you want to update (e.g. `Best Eats` → slug `eats`)
3. Change the `destination` field to the new path or full URL

**Example — point Best Eats to a new dedicated page:**
```js
// Before
{ slug: "eats", ..., destination: "/guide#best-eats" }

// After
{ slug: "eats", ..., destination: "/best-eats-ahangama" }
```

4. Save the file and redeploy to Netlify (or push to your main branch if auto-deploy is on)

> **Do not change** the `slug`, `section`, `codeId`, or `label` fields — these feed into GA4 tracking and must stay consistent.

## Destination Field Values

| Format | Example | When to use |
|--------|---------|-------------|
| Root-relative path | `/guide#best-eats` | Same-domain internal pages |
| Absolute URL | `https://pass.ahangama.com/eats` | External or subdomain destinations |

## QR Section Reference

| Section | Slug | Current Destination |
|---------|------|---------------------|
| Best Eats | `eats` | `/guide#best-eats` |
| Best Stays | `stays` | `/stays` |
| Best Wellness | `wellness` | `/guide#wellness` |
| Best Beaches & Surf | `beaches-surf` | `/guide#surf-schools` |
| Best Experiences | `experiences` | `/guide#best-experiences` |
| What's On in Ahangama | `events` | `/events` |
| Transport | `transport` | `/transport-rates` |

## How the Tracking Works

When someone scans a QR code:

1. Browser opens `https://ahangama.com/go/<section>`
2. The landing page (`GuideQrLandingPage.jsx`) renders and fires a GA4 `qr_scan` event with:
   - `qr_section` — the section name (e.g. `eats`)
   - `qr_code_id` — the unique code ID (e.g. `qr_best_eats`)
   - `qr_source` — `physical_guide`
   - `qr_medium` — `qr`
   - `qr_campaign` — `ahangama_guide_2026_27`
3. After 200 ms (enough for GA4's `sendBeacon` to queue the hit), the browser redirects to the destination
4. The event appears in GA4 → Reports → Events → `qr_scan`

Duplicate events are suppressed using `sessionStorage`. Ordinary visitors who go directly to `/guide`, `/stays`, etc. will **not** trigger `qr_scan` events.

## Viewing Results in GA4

- GA4 → Reports → Engagement → Events → `qr_scan`
- Filter by `qr_campaign = ahangama_guide_2026_27` to isolate Physical Guide traffic
- Compare `qr_section` to see which guide sections get the most scans

## Files Added by This Implementation

| File | Purpose |
|------|---------|
| `src/data/guideQrRedirects.js` | Central redirect map — edit destinations here |
| `src/pages/GuideQrLandingPage.jsx` | React page served at `/go/:section` |
| `src/analytics.js` | Added `trackPhysicalGuideQrScan()` function |
| `src/app/routes.jsx` | Registered `/go/:section` route |
| `ahangama-guide-qr-codes/` | QR code files, reference sheet, this document |

