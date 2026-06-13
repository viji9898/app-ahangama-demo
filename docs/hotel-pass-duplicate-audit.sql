SELECT
  normalized_email,
  source_hotel_slug,
  destination,
  COUNT(*) AS guest_count,
  ARRAY_AGG(id ORDER BY created_at ASC) AS guest_ids,
  MIN(created_at) AS first_seen_at,
  MAX(created_at) AS last_seen_at
FROM pass_guests
WHERE normalized_email IS NOT NULL
  AND source_hotel_slug IS NOT NULL
  AND destination IS NOT NULL
GROUP BY normalized_email, source_hotel_slug, destination
HAVING COUNT(*) > 1
ORDER BY guest_count DESC, last_seen_at DESC;