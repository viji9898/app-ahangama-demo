# Destination Content Schema

Ahangama.com now has a normalized destination content model for listings, search, recommendations, daily intelligence, WhatsApp, concierge workflows, venue reporting, and future destination expansion.

## Core Entities

- `venues`: businesses such as cafes, restaurants, shops, wellness studios, hotels, and coworking spaces.
- `places`: non-business locations such as beaches, surf breaks, viewpoints, landmarks, towns, and attractions.
- `experiences`: activities and bookable services such as surf lessons, whale watching, cooking classes, pickleball, and ice baths.
- `articles`: editorial content such as guides, lists, and destination stories.
- `events`: time-sensitive happenings such as live music, markets, DJ nights, and workshops.

Each recommendable entity includes `priority_score`, `featured`, and timestamp fields. Destination-aware entities include `destination` and `area`, making the same schema usable for Ahangama, Weligama, Galle, Hiriketiya, Colombo, and later destinations.

## Destination Operating System Layer

Migration `016_extend_destination_operating_system.sql` extends the content model from directory data into an operating layer for editorial production, concierge automation, AI-assisted recommendations, and partner reporting.

Shared workflow fields on `venues`, `places`, `experiences`, `articles`, and `events`:

- `status`: `draft`, `review`, `published`, or `archived`.
- `editorial_status`: `hidden`, `standard`, `recommended`, or `featured`.
- `content_completeness_score`: `0-100` score for operational readiness.
- `ai_summary`, `ai_tags`, `ai_keywords`, and `ai_recommendation_notes`: AI-facing metadata for recommendation, concierge, and email flows.
- `season_notes` and `best_months`: seasonal context for destination-aware planning.

`venues`, `places`, `experiences`, and `events` all support latitude/longitude so maps, proximity recommendations, and itinerary clustering can use the same model.

## Media

`entity_media` stores reusable media for every primary content type.

Supported `entity_type` values: `venue`, `place`, `experience`, `article`, `event`.

Supported `media_type` values: `image`, `video`, `logo`, `gallery`, `og_image`.

Use `is_primary` for the canonical image/logo and `sort_order` for galleries. The table also stores `caption`, `credit`, and `alt_text` so editorial, SEO, and accessibility metadata stay attached to the media item instead of being scattered across page code.

## Tags

`tags` is the shared vocabulary for activity, audience, and stay-length matching.

Join tables:

- `venue_tags`
- `place_tags`
- `experience_tags`
- `article_tags`
- `event_tags`

Use tags to power questions like:

- top wellness venues
- cafes for digital nomads
- surf experiences
- recommendations for couples staying 7 days
- audience-specific daily intelligence emails

Initial tags are seeded in `015_seed_destination_content_tags.sql`.

## Editorial Relationships

Articles can point to the entities they mention:

- `article_venues`: articles mentioning venues
- `article_places`: articles mentioning places
- `article_experiences`: articles mentioning experiences

These support queries such as:

- articles related to Living Room
- venues mentioned in Best Cafes
- places mentioned in sunset guides
- experiences mentioned in activity guides

## Operational Relationships

Experiences and events can connect to venues:

- `experience_venues`: where an experience happens, is fulfilled, or is recommended
- `event_venues`: event hosts, co-hosts, or related venues
- `events.venue_id`: primary venue for a single-location event

Use `events.venue_id` for the canonical event venue and `event_venues` when an event has multiple participating venues.

`entity_relationships` adds a generic graph for cross-type recommendations and operating logic. Examples of `relationship_type` values:

- `nearby`
- `same_area`
- `best_before`
- `best_after`
- `alternative_to`
- `pairs_with`
- `recommended_for`
- `hosted_at`
- `mentioned_in`

This supports flows like “suggest a cafe after surf,” “show nearby wellness after lunch,” “recommend an alternative when a venue is closed,” or “build an itinerary from related places and experiences.”

## Venue Metrics

`venue_metrics_daily` stores one row per venue per day for operating dashboards and partner reports.

Tracked counters include:

- `profile_views`
- `article_mentions`
- `email_impressions`
- `email_clicks`
- `pass_recommendations`
- `pass_redemptions`
- `booking_requests`

This table is intentionally separate from the existing Visitor Intelligence Platform tables. The intelligence tables keep event-level guest behavior; `venue_metrics_daily` keeps reporting-ready aggregates.

## Search And Recommendation Indexes

The schema adds B-tree indexes for common filters:

- `slug`
- `destination`
- `area`
- `category`
- `status`
- `editorial_status`
- `featured`
- `priority_score`
- `content_completeness_score`

It also adds GIN full-text indexes over the main searchable text fields for each entity, plus array indexes for `best_months`, `ai_tags`, and `ai_keywords`.

## Scoring

`priority_score` is constrained to `0-100`.

Example scoring intent:

- Living Room: `95`
- Kaffi: `92`
- Kabalana Beach: `100`
- Surf Lessons: `88`

Recommendation helpers can boost `featured` rows and tag matches on top of `priority_score`.

`editorial_status` adds an operator-controlled boost:

- `featured`: highest editorial boost.
- `recommended`: recommended by the destination team without occupying hero inventory.
- `standard`: eligible but not boosted.
- `hidden`: excluded from public helpers.

## Helper Module

Server-side helpers live in `lib/destination-content-db.js`.

Exports:

- `listDestinationContent()`: filtered entity listing by type, destination, area, category, featured, status, editorial status, and tags.
- `searchDestinationContent()`: cross-entity search for website and concierge search.
- `listRecommendations()`: destination/tag/category weighted recommendations.
- `listRelatedArticles()`: articles linked to a venue, place, or experience.
- `listEntityTags()`: fetch tags attached to an entity.
- `listEntityMedia()`: fetch primary and gallery media for any content entity.
- `listEntityRelationships()`: fetch graph relationships for an entity.
- `listRelatedEntities()`: return related target entities with relationship metadata.
- `listFeaturedContent()`: list `featured` editorial content for a destination/entity type.
- `listRecommendedContent()`: list `recommended` and `featured` editorial content.
- `updateContentCompletenessScore()`: recompute the operational completeness score for one entity.
- `listVenueMetrics()`: fetch daily venue aggregate metrics for reporting.

## Query Examples

Top wellness venues:

```sql
SELECT venues.*
FROM venues
JOIN venue_tags ON venue_tags.venue_id = venues.id
JOIN tags ON tags.id = venue_tags.tag_id
WHERE venues.destination = 'ahangama'
  AND tags.slug = 'wellness'
  AND venues.status = 'published'
  AND venues.editorial_status <> 'hidden'
ORDER BY venues.priority_score DESC;
```

Cafes for digital nomads:

```sql
SELECT venues.*
FROM venues
JOIN venue_tags ON venue_tags.venue_id = venues.id
JOIN tags ON tags.id = venue_tags.tag_id
WHERE venues.destination = 'ahangama'
  AND venues.category = 'cafe'
  AND tags.slug = 'digital-nomads'
  AND venues.status = 'published'
  AND venues.editorial_status IN ('recommended', 'featured')
ORDER BY venues.featured DESC, venues.priority_score DESC;
```

Articles related to Living Room:

```sql
SELECT articles.*
FROM articles
JOIN article_venues ON article_venues.article_id = articles.id
WHERE article_venues.venue_id = 'living-room'
  AND (articles.status = 'published' OR articles.published = TRUE)
  AND articles.editorial_status <> 'hidden'
ORDER BY articles.featured DESC, articles.priority_score DESC, articles.published_at DESC;
```

Events happening tonight:

```sql
SELECT events.*
FROM events
WHERE events.destination = 'ahangama'
  AND events.status = 'published'
  AND events.start_datetime >= date_trunc('day', NOW()) + interval '18 hours'
  AND events.start_datetime < date_trunc('day', NOW()) + interval '1 day'
ORDER BY events.featured DESC, events.start_datetime ASC, events.priority_score DESC;
```

Venues mentioned in Best Cafes:

```sql
SELECT venues.*
FROM venues
JOIN article_venues ON article_venues.venue_id = venues.id
JOIN articles ON articles.id = article_venues.article_id
WHERE articles.slug = 'best-cafes-ahangama'
ORDER BY venues.priority_score DESC;
```

Featured venue media:

```sql
SELECT entity_media.*
FROM entity_media
WHERE entity_media.entity_type = 'venue'
  AND entity_media.entity_id = 'living-room'
ORDER BY entity_media.is_primary DESC, entity_media.sort_order ASC;
```

Recommended entities after a surf lesson:

```sql
SELECT entity_relationships.*
FROM entity_relationships
WHERE entity_relationships.source_type = 'experience'
  AND entity_relationships.source_id = 'surf-lesson-kabalana'
  AND entity_relationships.relationship_type IN ('best_after', 'nearby', 'pairs_with')
ORDER BY entity_relationships.priority_score DESC;
```

Venue partner report for the last 30 days:

```sql
SELECT
  venue_id,
  SUM(profile_views) AS profile_views,
  SUM(email_impressions) AS email_impressions,
  SUM(email_clicks) AS email_clicks,
  SUM(pass_recommendations) AS pass_recommendations,
  SUM(pass_redemptions) AS pass_redemptions,
  SUM(booking_requests) AS booking_requests
FROM venue_metrics_daily
WHERE venue_id = 'living-room'
  AND date >= CURRENT_DATE - interval '30 days'
GROUP BY venue_id;
```

Content readiness backlog:

```sql
SELECT 'venue' AS entity_type, id, name AS title, content_completeness_score
FROM venues
WHERE status IN ('draft', 'review')
ORDER BY content_completeness_score ASC, updated_at DESC;
```
