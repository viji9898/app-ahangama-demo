-- Multiple map/location links per guide venue placement.
-- A venue with more than one physical location (e.g. Azure Swim: Ahangama + Matara)
-- stores an array of { label, url } objects. When present the guide card
-- and lightbox show a location picker popup instead of a single map link.
--
-- Stored in its own schema rather than as a column on guide_venue_placements
-- because the application role does not own that table and cannot ALTER it.

CREATE SCHEMA IF NOT EXISTS guide_app;

CREATE TABLE IF NOT EXISTS guide_app.venue_map_links (
  placement_id BIGINT PRIMARY KEY,
  links JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed the known multi-location venue so the guide keeps working
-- without any manual admin entry. Never overwrites an existing value.
INSERT INTO guide_app.venue_map_links (placement_id, links)
SELECT p.id,
       '[{"label": "Ahangama", "url": "https://maps.app.goo.gl/j3qzgmD5GX7iSAdP8"}, {"label": "Matara", "url": "https://maps.app.goo.gl/Pr1L1ozPVcFh9oeG6"}]'::jsonb
  FROM guide_venue_placements AS p
 WHERE p.guide_key = 'ahangama-guide'
   AND p.venue_id = 'azure-swim'
ON CONFLICT (placement_id) DO NOTHING;
