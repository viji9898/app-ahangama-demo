# Ahangama Guide and Guide Admin

This document explains how the public `/guide` page and the `/admin-guide` dashboard work, where their data comes from, and how to update them safely.

## At a Glance

| Page | Purpose | Access |
| --- | --- | --- |
| `/guide` | Public destination guide showing active venues by category | Public |
| `/admin-guide` | Dashboard for managing guide placements, venue details, and editable guide content | Password protected |

The guide is database-backed. Venue identity and shared venue facts come from the canonical `venues260414` table. Guide-specific category, order, publishing status, and editorial overrides come from `guide_venue_placements`.

```mermaid
flowchart LR
  Canonical[(venues260414)] --> Join[Joined guide query]
  Placement[(guide_venue_placements)] --> Join
  Content[(guide_content)] --> API[Guide APIs]
  Join --> API
  API --> Public[/guide]
  API --> Admin[/admin-guide]
```

## Public Guide: `/guide`

The public guide requests:

```text
GET /api/guide/venues?status=active
```

The API joins each guide placement to its canonical venue and returns the result ordered by section and `priority_order`. The page groups those records into these sections:

- Best Stays
- Best Eats
- Best Cafes
- Experiences
- Wellness
- Night Life
- Retail
- Surf Schools
- Transport

Only placements with `status = active` appear publicly. Draft and archived placements remain available to the admin but are hidden from visitors.

If the venue API fails or returns no venues, `/guide` displays an unavailable message. It does not silently render an old hardcoded venue list.

The public page also sends GA4 engagement events using canonical venue IDs. See [guideEngagement.md](guideEngagement.md) for event names, parameters, and reporting setup.

## Guide Admin: `/admin-guide`

The admin dashboard provides:

- venue search and section filters
- active, draft, and archived placement management
- adding an existing canonical venue to a guide section
- guide-specific display name, description, image, and tagline overrides
- editing shared venue details
- rating and review-count updates from Google Place ID
- editable guide content blocks

### Signing In

The current temporary password is:

```text
admin123
```

The browser stores it in `sessionStorage` under `ahangama-guide-admin-password`, so it lasts only for the current browser tab session. Admin requests send it in the `X-Admin-Password` header, and the server validates it.

This is temporary authentication, not production-grade identity management. Replace the hardcoded password in `lib/guide-admin-auth.js` with environment-backed authentication before giving the dashboard broad access.

## Understanding the Data Model

### Canonical venue data

`venues260414` is the source of truth for facts shared across the application:

- canonical ID and name
- public slug
- coordinates
- Instagram, Google Maps, and website links
- Google Place ID
- rating and review count
- ownership
- default description and image

Changing these fields in `/admin-guide` updates the canonical venue. That change may affect other pages and APIs that use the same venue record.

### Guide placement data

`guide_venue_placements` controls how a venue appears in this guide:

- section
- order within the section
- status: `active`, `draft`, or `archived`
- optional guide display-name override
- optional tagline
- optional description override
- optional image override

A canonical venue can have multiple placements in different sections. For example, one venue can appear under both Experiences and Wellness without duplicating its canonical record.

### Guide content

`guide_content` stores editable section copy with:

- `section_key`
- title
- body
- optional image

These records are managed from the Content tab in `/admin-guide`.

## Common Admin Tasks

### Add a venue to the guide

1. Open `/admin-guide` and sign in.
2. Select **Add Venue**.
3. Search for an existing canonical venue by name, ID, or slug.
4. Select the guide section.
5. Optionally enter a guide display name, description, image, or tagline.
6. Set its order and publication status.
7. Select **Add to Category**.

The venue must already exist in `venues260414`. Adding it here creates or updates a guide placement; it does not create a new canonical venue.

### Edit a venue

1. Find the placement in the Venues tab.
2. Select its edit action.
3. Update the required fields.
4. Select **Update Venue**.

Use guide-specific fields when the change should apply only to this guide placement. Edit canonical fields only when the shared venue record itself needs correction.

| Admin field | Storage | Scope |
| --- | --- | --- |
| Canonical Venue Name | `venues260414.name` | Everywhere the canonical venue is used |
| Coordinates and links | `venues260414` | Shared application-wide |
| Rating, reviews, ownership | `venues260414` | Shared application-wide |
| Section, order, status | `guide_venue_placements` | This guide placement |
| Guide Display Name | `guide_venue_placements.name_override` | This guide placement |
| Description, image, tagline | `guide_venue_placements` overrides | This guide placement |

### Remove a venue from the guide

The admin **Delete** action does not delete the canonical venue. It changes the placement status to `archived`, removing it from `/guide` while preserving the venue and placement history.

### Edit guide copy

1. Open the Content tab.
2. Select a content card.
3. Edit its title, body, or image URL.
4. Save the changes.

## API Summary

| Endpoint | Method | Purpose | Authentication |
| --- | --- | --- | --- |
| `/api/guide/venues?status=active` | GET | Public active venue placements | None |
| `/api/guide/venues` | GET | All admin-visible placements | Admin password |
| `/api/guide/venues` | POST | Add a canonical venue to a section | Admin password |
| `/api/guide/venue?id=PLACEMENT_ID` | GET | Read one placement | Admin password |
| `/api/guide/venue?id=PLACEMENT_ID` | PUT | Update placement/canonical fields | Admin password |
| `/api/guide/venue?id=PLACEMENT_ID` | DELETE | Archive a placement | Admin password |
| `/api/guide/content` | GET | Read guide content | None |
| `/api/guide/content` | PUT | Update guide content | Admin password |
| `/api/guide/google-rating?placeId=...` | GET | Fetch Google rating data | Admin password |

The `id` returned for a guide venue is the placement ID. `venueId` is the durable canonical venue ID used by analytics and shared venue data.

## Database Setup

The guide uses `DATABASE_URL`, not `NETLIFY_DATABASE_URL`.

Required migrations:

- `migrations/029_centralize_guide_venues.sql`
- `migrations/030_seed_guide_placements.sql`

Migration 029 adds canonical metadata fields and creates the placement/content tables. Migration 030 seeds the current guide placements and canonical website/ownership values. Both are designed to be rerunnable.

With `DATABASE_URL` configured, apply them using:

```bash
node scripts/run-guide-migration.mjs
```

After migration, verify the active public data:

```bash
curl "http://localhost:8890/api/guide/venues?status=active"
```

## Local Development

Install dependencies and start Netlify Dev:

```bash
npm install
ntl dev --port 8890
```

Then open:

- public guide: `http://localhost:8890/guide`
- admin dashboard: `http://localhost:8890/admin-guide`

Netlify redirects map `/api/guide/*` to the corresponding functions. Vite also contains local guide API middleware for direct Vite development.

## Important Files

| File | Responsibility |
| --- | --- |
| `src/pages/ExperienceAhangamaGuide.jsx` | Public guide rendering and interactions |
| `src/pages/AdminGuidePage.jsx` | Admin dashboard |
| `lib/guide-db.js` | Joined venue/placement queries and mutations |
| `lib/venues-db.js` | Canonical venue queries |
| `lib/guide-admin-auth.js` | Temporary admin authorization |
| `netlify/functions/api-guide-*.js` | Production guide API handlers |
| `vite.config.js` | Local guide API middleware |
| `migrations/029_centralize_guide_venues.sql` | Canonical guide schema |
| `migrations/030_seed_guide_placements.sql` | Current guide placement seed |
| `docs/guideEngagement.md` | GA4 event and reporting documentation |

## Troubleshooting

**A venue is missing from `/guide`:** Confirm it has a placement with `status = active`, its canonical venue is not soft-deleted, and its section is one of the supported section keys.

**A venue is not available in Add Venue:** It must exist in `venues260414` with `destination_slug = 'ahangama'` and no `deleted_at` value.

**The admin returns Unauthorized:** Sign out and sign in again. Confirm the temporary password and that requests include `X-Admin-Password`.

**The guide shows “temporarily unavailable”:** Check `DATABASE_URL`, verify migrations 029 and 030 were applied, and inspect `/api/guide/venues?status=active`.

**A change appeared elsewhere on the site:** A canonical field was edited. Use placement overrides for guide-only display changes.
