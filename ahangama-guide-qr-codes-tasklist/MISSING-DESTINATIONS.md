# Missing destinations — task-list QR batch

This file records every QR code in `ahangama-guide-qr-codes-tasklist/` whose final
destination could **not** be verified when the batch was generated on
25 November 2026.

Nothing in this batch silently substitutes a guessed destination. Each affected
QR code uses a safe, working fallback and keeps its permanent `/go/` URL, so the
printed artwork never has to change when the real destination is supplied.

## Summary

| # | QR label | Permanent URL | Section | Code ID | Current fallback | Status |
|---|---|---|---|---|---|---|
| 1 | Transport — Enquiry / Booking Form | `https://ahangama.com/go/transport-google-form` | `transport_google_form` | `qr_transport_google_form` | `/transport-rates` | Provisional |
| 2 | Route 1 | `https://ahangama.com/go/continue-route-1` | `continue_route_1` | `qr_continue_route_1` | `/guide` | Provisional |
| 3 | Route 2 | `https://ahangama.com/go/continue-route-2` | `continue_route_2` | `qr_continue_route_2` | `/guide` | Provisional |
| 4 | Route 3 | `https://ahangama.com/go/continue-route-3` | `continue_route_3` | `qr_continue_route_3` | `/guide` | Provisional |
| 5 | Route 4 | `https://ahangama.com/go/continue-route-4` | `continue_route_4` | `qr_continue_route_4` | `/guide` | Provisional |
| 6 | Route 5 | `https://ahangama.com/go/continue-route-5` | `continue_route_5` | `qr_continue_route_5` | `/guide` | Provisional |

All other **174** QR codes in this batch point at a verified, live destination.

## 1. Transport — Google Form

**What the checklist asks for:** “Put the Google Form on page 1 of the transport
ad.”

**What is missing:** the URL of the official Google Form. No `forms.gle`,
`docs.google.com/forms` or `1FAIpQL…` URL exists in the Ahangama.com repository,
the `Transport ahangama` project, the checklist PDF, or the shared home folder.

**Current behaviour:** the QR code points at the existing official transport
enquiry/booking form on Ahangama.com — `https://ahangama.com/transport-rates`.
That page contains the live transport enquiry form
(`/.netlify/functions/create-transport-enquiry`) and the airport rate table, so
the QR is usable today.

**Needed to close this item:** the exact Google Form URL (the published
`https://forms.gle/…` or `https://docs.google.com/forms/d/e/…/viewform` link).

**How to update it:** edit only the `destination` field of the
`transport-google-form` entry in `src/data/guideQrRedirectsTasklist.js`, then
change `status` from `"provisional"` to `"confirmed"` and remove
`provisionalNote`. Do **not** change `slug`, `section`, `codeId` or `file` — the
printed QR code encodes the permanent `/go/transport-google-form` URL.

## 2–6. Five Ways to Continue Your Sri Lankan Story — Routes 1–5

**What the checklist asks for:** “Add QR codes linking to dedicated web pages,
with ‘book from us’ as the call to action.”

**What is missing:** the final titles and the five dedicated web pages. No route
titles, copy or `/guide/continue-route-…` pages exist in the repository yet.

**Current behaviour:** each QR code points at the working online guide,
`https://ahangama.com/guide`. Each code has its own permanent `/go/` URL,
`qr_section` and `qr_code_id`, so scans can already be attributed individually
in GA4.

**Needed to close this item:** for each of the five routes, the final title, the
dedicated page URL (or the page copy so the page can be built), and confirmation
of the “Book from us” booking destination.

**How to update them:** edit only the `destination` field of the matching
`continue-route-N` entry in `src/data/guideQrRedirectsTasklist.js`. Set
`plannedDestination` to the real page URL, change `status` to `"confirmed"` and
remove `provisionalNote`. Keep the `slug`, `section`, `codeId` and `file` values
unchanged.

## Verified advertiser destinations (for the record)

These were checked against official sources and return HTTP 200:

| QR label | Destination | Source of verification |
|---|---|---|
| Spice Trails — Official Booking Page | `https://bookdirect.prenohq.com/inst/#home?propertyId=323IjU7IqGlE7WYcTCbyDywODczMiI=&JDRN=Y` | Booking button on `https://www.thespicetrails.com/rooms-ahangama` |
| Sawan — Petals Ahangama (Official Instagram) | `https://www.instagram.com/petals.ahangama/` | `instagramUrl` on the live Petals venue record; Sawan Chamika Walgamage is the Petals founder |
| Villa Alba — Founder Story | `https://ahangama.com/villa-alba-a-boutique-hotel-with-a-commitment-to-those-who-built-it` | Live article route in `src/app/routes.jsx` |
| Spa Therapy — Official Instagram | `https://www.instagram.com/thespicetrail.ahangama/` | `instagramUrl` on the live “Spa Therapy Ahangama” venue record and the official `thespicetrails.com` site |

> **Spa Therapy note:** the venue record uses the shared Spice Trails Ahangama
> Instagram handle (`thespicetrail.ahangama`). If Spa Therapy has a separate
> dedicated handle, supply it and update only the `destination` field.

## Verification rules used

- A destination is **confirmed** only when it appears in the live venue data,
  the site’s own routes, an official website, or an official booking/Instagram
  link.
- Anything that could not be verified is **provisional**, uses a safe fallback,
  and is listed above.
- No destination was invented, guessed or silently replaced.
