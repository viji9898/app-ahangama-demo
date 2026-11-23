-- Keep the canonical venue category in sync with the guide section that
-- editors choose in the guide admin. The pass perks page reads the canonical
-- category, so without this a venue moved from "Best Stays" to "Best Eats"
-- would stay under Stays.
--
-- Only venues with a single active guide placement are updated here. Venues
-- intentionally listed in several sections keep their existing category; the
-- guide admin will sync the category the next time their section is saved.

CREATE INDEX IF NOT EXISTS idx_guide_venue_placements_venue
  ON guide_venue_placements (venue_id, guide_key, status);

WITH mapped AS (
  SELECT
    placement.venue_id,
    CASE placement.section
      WHEN 'best_stays' THEN 'stays'
      WHEN 'best_eats' THEN 'eat'
      WHEN 'best_cafes' THEN 'eat'
      WHEN 'night_life' THEN 'eat'
      WHEN 'wellness' THEN 'wellness'
      WHEN 'best_experiences' THEN 'experiences'
      WHEN 'surf_schools' THEN 'experiences'
      WHEN 'best_retail_stores' THEN 'shopping'
      WHEN 'transport' THEN 'transport'
    END AS category
  FROM guide_venue_placements AS placement
  WHERE placement.guide_key = 'ahangama-guide'
    AND placement.status = 'active'
),
single_placement_venues AS (
  SELECT venue_id
  FROM mapped
  GROUP BY venue_id
  HAVING COUNT(*) = 1
)
UPDATE venues260414 AS venue
SET
  category = mapped.category,
  updated_at = NOW(),
  updated_by = 'category-sync-migration'
FROM mapped
JOIN single_placement_venues AS single
  ON single.venue_id = mapped.venue_id
WHERE mapped.venue_id = venue.id
  AND mapped.category IS NOT NULL
  AND venue.deleted_at IS NULL
  AND venue.category IS DISTINCT FROM mapped.category;
