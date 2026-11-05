# QR Code Implementation — Testing Report

**Date:** 2026-11-05  
**Prepared by:** Ahangama.com Development  
**GA4 Property:** G-HZ20D69WMB  
**Campaign:** ahangama_guide_2026_27

---

## 1. Route Registration Check

**Method:** Inspected `src/app/routes.jsx`  
**Result:** ✅ PASS

The `/go/:section` route is registered as the **first** route in the route array, before all other routes. This ensures it takes priority and cannot be accidentally matched by a catch-all.

```
{ path: "/go/:section", element: <GuideQrLandingPage /> }
```

---

## 2. Redirect Configuration Check

**Method:** Inspected `src/data/guideQrRedirects.js`  
**Result:** ✅ PASS — All seven entries verified

| Slug | Destination | Exists? |
|------|-------------|---------|
| `eats` | `/guide#best-eats` | ✅ `/guide` route active |
| `stays` | `/stays` | ✅ `/stays` route active |
| `wellness` | `/guide#wellness` | ✅ `/guide` route active |
| `beaches-surf` | `/guide#surf-schools` | ✅ `/guide` route active |
| `experiences` | `/guide#best-experiences` | ✅ `/guide` route active |
| `events` | `/events` | ✅ `/events` route active |
| `transport` | `/transport-rates` | ✅ TRANSPORT_PATH = `/transport-rates` confirmed |

None of the destinations produce a 404 — all map to confirmed routes.

---

## 3. URL Structure Check

**Method:** Verified URL construction in `generate-guide-qr-codes.mjs`  
**Result:** ✅ PASS

All seven QR codes encode the following URLs:
- `https://ahangama.com/go/eats`
- `https://ahangama.com/go/stays`
- `https://ahangama.com/go/wellness`
- `https://ahangama.com/go/beaches-surf`
- `https://ahangama.com/go/experiences`
- `https://ahangama.com/go/events`
- `https://ahangama.com/go/transport`

---

## 4. QR Code File Quality Check

**Method:** Verified generated files in `ahangama-guide-qr-codes/`  
**Result:** ✅ PASS

| File | Type | Size | Error Correction | Quiet Zone |
|------|------|------|-----------------|------------|
| QR-Best-Eats.svg | SVG | Generated | H (30%) | 4 modules |
| QR-Best-Eats.png | PNG 1200×1200px | Generated | H (30%) | 4 modules |
| QR-Best-Stays.svg | SVG | Generated | H (30%) | 4 modules |
| QR-Best-Stays.png | PNG 1200×1200px | Generated | H (30%) | 4 modules |
| QR-Best-Wellness.svg | SVG | Generated | H (30%) | 4 modules |
| QR-Best-Wellness.png | PNG 1200×1200px | Generated | H (30%) | 4 modules |
| QR-Best-Beaches-Surf.svg | SVG | Generated | H (30%) | 4 modules |
| QR-Best-Beaches-Surf.png | PNG 1200×1200px | Generated | H (30%) | 4 modules |
| QR-Best-Experiences.svg | SVG | Generated | H (30%) | 4 modules |
| QR-Best-Experiences.png | PNG 1200×1200px | Generated | H (30%) | 4 modules |
| QR-Whats-On-Ahangama.svg | SVG | Generated | H (30%) | 4 modules |
| QR-Whats-On-Ahangama.png | PNG 1200×1200px | Generated | H (30%) | 4 modules |
| QR-Transport.svg | SVG | Generated | H (30%) | 4 modules |
| QR-Transport.png | PNG 1200×1200px | Generated | H (30%) | 4 modules |

Error Correction Level H provides ~30% redundancy — maximum resilience for print media where codes may be partially obscured.

---

## 5. GA4 Event Implementation Check

**Method:** Code review of `GuideQrLandingPage.jsx` and `analytics.js`  
**Result:** ✅ PASS

### Event name
`qr_scan` — fires via `window.gtag("event", "qr_scan", {...})`

### Parameters sent
| Parameter | Value | Source |
|-----------|-------|--------|
| `qr_section` | e.g. `eats` | `guideQrRedirects.js` per section |
| `qr_code_id` | e.g. `qr_best_eats` | `guideQrRedirects.js` per section |
| `qr_source` | `physical_guide` | hardcoded constant |
| `qr_medium` | `qr` | hardcoded constant |
| `qr_campaign` | `ahangama_guide_2026_27` | hardcoded constant |
| `page_path` | current path | `window.location.pathname` |
| `page_location` | full URL | `window.location.href` |

### Deduplication mechanism
- `sessionStorage` key: `qr_scan_fired:<codeId>`
- Event fires at most once per browser session per QR code
- React Strict Mode double-invoke is blocked by `useRef(false)` guard (`firedRef.current`)
- No PII is included in any parameter

### Redirect timing
- 200 ms delay after `gtag("event", ...)` before `window.location.replace()`
- GA4 uses `navigator.sendBeacon` internally — beacon survives page navigation

---

## 6. Non-QR Visitor Isolation Check

**Method:** Code review  
**Result:** ✅ PASS

The `qr_scan` event is called **only** from `GuideQrLandingPage.jsx` which is **only** served at `/go/:section`. Visitors who navigate directly to `/guide`, `/stays`, `/events`, or any other section will never reach `GuideQrLandingPage` and will never trigger the event.

---

## 7. Existing GA4 Configuration Check

**Method:** Reviewed `index.html`  
**Result:** ✅ PASS — GA4 ID confirmed unchanged

```html
gtag("config", "G-HZ20D69WMB", { send_page_view: false });
```

The GA4 Measurement ID `G-HZ20D69WMB` is active and unchanged. No new analytics property was created. No duplicate tracking scripts were added.

---

## 8. Existing Route Integrity Check

**Method:** Reviewed `src/app/routes.jsx` before and after changes  
**Result:** ✅ PASS

All pre-existing routes are intact. The only changes to `routes.jsx` were:
1. Import of `GuideQrLandingPage` and `GUIDE_QR_LANDING_PATH`
2. Addition of `{ path: "/go/:section", element: <GuideQrLandingPage /> }` as the first route entry

No existing routes were modified or removed.

---

## 9. Mobile Compatibility Check

**Method:** Code review  
**Result:** ✅ PASS

- Landing page uses `min-height: 100dvh` (dynamic viewport height for mobile browsers)
- No JavaScript libraries are loaded on the landing page — it uses only the existing `window.gtag` global
- `navigator.sendBeacon` (used by gtag internally) is supported in all modern mobile browsers
- The page renders a minimal, text-only loading state — no images or heavy assets to block

---

## Pending: Live GA4 DebugView Verification

**Status:** ⚠️ REQUIRES DEPLOY + MANUAL VERIFICATION

The following must be verified once the site is deployed to production:

- [ ] Scan `https://ahangama.com/go/eats` QR with a phone → verify redirect to `/guide#best-eats`
- [ ] Check GA4 DebugView for `qr_scan` event with `qr_section = eats`
- [ ] Repeat scan to verify no duplicate event fires
- [ ] Repeat for all 7 QR codes
- [ ] Verify direct navigation to `/stays` does NOT show `qr_scan` in DebugView

**How to enable GA4 DebugView for your device:**
1. Install the [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) Chrome extension, **or**
2. Append `?_ga_debug=1` to any URL on the site (this activates debug mode in GA4)
3. Open GA4 → Configure → DebugView
4. Scan a QR code with your phone while DebugView is open on your desktop

---

## Summary

| Check | Status |
|-------|--------|
| Route registration | ✅ |
| All 7 redirect destinations exist (no 404s) | ✅ |
| QR files generated (SVG + PNG) | ✅ |
| Correct URLs encoded in QR codes | ✅ |
| GA4 `qr_scan` event implemented | ✅ |
| All 5 required parameters present | ✅ |
| Event deduplication | ✅ |
| No PII sent to GA4 | ✅ |
| Non-QR visitors isolated | ✅ |
| Existing GA4 config unchanged | ✅ |
| Existing routes unbroken | ✅ |
| Mobile compatible | ✅ |
| Live GA4 DebugView verification | ⚠️ Pending deploy |

