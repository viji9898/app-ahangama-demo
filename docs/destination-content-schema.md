# Destination Content Schema

Ahangama.com now has a normalized destination content model for listings, search, recommendations, daily intelligence, WhatsApp, concierge workflows, venue reporting, and future destination expansion.

## Core Entities

- `venues`: businesses such as cafes, restaurants, shops, wellness studios, hotels, and coworking spaces.
- `places`: non-business locations such as beaches, surf breaks, viewpoints, landmarks, towns, and attractions.
- `experiences`: activities and bookable services such as surf lessons, whale watching, cooking classes, pickleball, and ice baths.
- `articles`: editorial content such as guides, lists, and destination stories.
- `events`: time-sensitive happenings such as live music, markets, DJ nights, and workshops.

Each recommendable entity includes `priority_score`, `featured`, and timestamp fields. Destination-aware entities include `destination` and `area`, making the same schema usable for Ahangama, Weligama, Galle, Hiriketiya, Colombo, and later destinations.

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

## Search And Recommendation Indexes

The schema adds B-tree indexes for common filters:

- `slug`
- `destination`
- `area`
- `category`
- `featured`
- `priority_score`

It also adds GIN full-text indexes over the main searchable text fields for each entity.

## Scoring

`priority_score` is constrained to `0-100`.

Example scoring intent:

- Living Room: `95`
- Kaffi: `92`
- Kabalana Beach: `100`
- Surf Lessons: `88`

Recommendation helpers can boost `featured` rows and tag matches on top of `priority_score`.

## Helper Module

Server-side helpers live in `lib/destination-content-db.js`.

Exports:

- `listDestinationContent()`: filtered entity listing by type, destination, area, category, featured, and tags.
- `searchDestinationContent()`: cross-entity search for website and concierge search.
- `listRecommendations()`: destination/tag/category weighted recommendations.
- `listRelatedArticles()`: articles linked to a venue, place, or experience.
- `listEntityTags()`: fetch tags attached to an entity.

## Query Examples

Top wellness venues:

```sql
SELECT venues.*
FROM venues
JOIN venue_tags ON venue_tags.venue_id = venues.id
JOIN tags ON tags.id = venue_tags.tag_id
WHERE venues.destination = 'ahangama'
  AND tags.slug = 'wellness'
  AND venues.status = 'active'
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
  AND venues.status = 'active'
ORDER BY venues.featured DESC, venues.priority_score DESC;
```

Articles related to Living Room:

```sql
SELECT articles.*
FROM articles
JOIN article_venues ON article_venues.article_id = articles.id
WHERE article_venues.venue_id = 'living-room'
  AND articles.published = TRUE
ORDER BY articles.featured DESC, articles.priority_score DESC, articles.published_at DESC;
```

Events happening tonight:

```sql
SELECT events.*
FROM events
WHERE events.destination = 'ahangama'
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
