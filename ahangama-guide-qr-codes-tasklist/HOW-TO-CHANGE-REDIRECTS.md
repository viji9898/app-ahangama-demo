# How to change a QR code redirect

This batch is controlled by one file:

```
src/data/guideQrRedirectsTasklist.js
```

The original seven QR codes (`src/data/guideQrRedirects.js`) and the earlier 39
QR codes (`src/data/guideQrRedirectsNew.js`) are **not** edited by this batch.
The shared lookup in `src/data/guideQrRedirects.js` checks all three files in
that order.

## How a QR code works

Every printed QR code encodes a permanent URL:

```
https://ahangama.com/go/<slug>
```

For example, the Abode by the Beach QR code encodes:

```
https://ahangama.com/go/place-abode-by-the-beach
```

When someone scans it, `/go/:slug` looks up the entry in
`guideQrRedirectsTasklist.js`, fires one `qr_scan` event, and redirects to the
current `destination`.

**The printed URL never changes.** To move a QR code to a new page, change only
its `destination`.

## Change an existing destination

1. Open `src/data/guideQrRedirectsTasklist.js`.
2. Find the entry by its `slug` (for example `place-abode-by-the-beach`).
3. Edit only the `destination` value. Use a site-relative path for an
   Ahangama.com page:

   ```js
   destination: "/stays/abode-by-the-beach",
   ```

   or a full URL for an external page:

   ```js
   destination: "https://www.instagram.com/petals.ahangama/",
   ```

4. Keep `slug`, `section`, `codeId` and `file` exactly as they are. Those
   values are tied to the printed artwork and to GA4 history.
5. Run the checks below and deploy.

## Change a provisional destination

Six entries are provisional: `transport-google-form` and
`continue-route-1` … `continue-route-5`. They currently use a safe fallback so
the QR codes work today. See `MISSING-DESTINATIONS.md` for what is still
needed.

When the real destination arrives:

1. Set `destination` to the real URL or path.
2. Set `plannedDestination` to the same value.
3. Change `status` from `"provisional"` to `"confirmed"`.
4. Delete the `provisionalNote` field.
5. Update `MISSING-DESTINATIONS.md`.

No artwork needs to be regenerated, because the encoded URL does not change.

## Add a new QR code

1. Add an entry to `GUIDE_QR_REDIRECTS_TASKLIST`:

   ```js
   {
     slug: "place-example-venue",
     section: "place_example_venue",
     codeId: "qr_place_example_venue",
     label: "Example Venue",
     group: "Guide Places – Eat & Drink",
     file: "QR-Place-Example-Venue",
     destination: "/eat/example-venue",
     plannedDestination: "/eat/example-venue",
     status: "confirmed",
     cta: "View on ahangama.com",
   },
   ```

2. Keep `slug`, `section`, `codeId` and `file` unique across **all three**
   redirect files (7 + 39 + this batch).
3. Generate the artwork:

   ```bash
   node scripts/generate-guide-qr-codes-tasklist.mjs
   ```

   The generator refuses to run if a slug, section, code ID, filename or
   encoded URL is duplicated.

4. Regenerate the reference sheets:

   ```bash
   node scripts/generate-qr-reference-sheet-tasklist.mjs
   ```

## Tracking fields

Every entry produces the same GA4 event:

| Parameter | Value |
|---|---|
| Event name | `qr_scan` |
| `qr_section` | the entry’s `section` |
| `qr_code_id` | the entry’s `codeId` |
| `qr_source` | `physical_guide` |
| `qr_medium` | `qr` |
| `qr_campaign` | `ahangama_guide_2026_27` |

The measurement ID is `G-HZ20D69WMB` (configured in `index.html`). Each genuine
scan fires exactly one `qr_scan` event; React Strict Mode’s double effect is
deduplicated in `src/pages/GuideQrLandingPage.jsx`.

Do not reuse a `section` or `codeId` for a different place. GA4 reports and the
printed reference sheet rely on them being unique.

## Verify before deploying

```bash
# 1. Decode every PNG and confirm it contains the permanent /go/ URL
node scripts/verify-guide-qr-codes-tasklist.mjs

# 2. Check every confirmed destination returns HTTP 200
node scripts/check-guide-qr-destinations-tasklist.mjs

# 3. Build
NODE_ENV=production npm run build
```

In a local or preview build, scan or open a `/go/` URL and confirm:

- it redirects to the intended page;
- the URL bar shows the destination;
- GA4 DebugView / Realtime shows one `qr_scan` with the expected parameters.

## Important

- Do not edit `guideQrRedirects.js` entries for the original seven codes.
- Do not edit `guideQrRedirectsNew.js` for the earlier 39 codes.
- Do not rename a `slug` after artwork is printed.
- Do not delete an entry that has been printed. Point its `destination`
  somewhere valid instead.
