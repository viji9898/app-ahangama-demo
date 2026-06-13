-- Safely merge the known duplicate complimentary hotel guest flow for:
--   normalized_email   = 'hello@viji.com'
--   source_hotel_slug  = 'lighthouse-hotel'
--   destination        = 'ahangama'
--
-- This script does not delete data. It reassigns child activity to the
-- survivor guest/pass where doing so does not violate constraints, marks
-- non-survivor active passes inactive, and leaves duplicate pass_guests rows
-- in place because pass_guests currently has no safe archive/merge marker.
--
-- Intended usage:
--   psql "$NETLIFY_DATABASE_URL" -X -v ON_ERROR_STOP=1 \
--     -f scripts/merge-duplicate-hotel-guest-hello-viji.sql
--
-- To dry run manually, replace the final COMMIT with ROLLBACK before running.

BEGIN;

SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';

SELECT pg_advisory_xact_lock(
  hashtext('merge-duplicate-hotel-guest:hello@viji.com:lighthouse-hotel:ahangama')
);

CREATE TEMP TABLE merge_target_guests ON COMMIT DROP AS
SELECT *
FROM pass_guests
WHERE normalized_email = 'hello@viji.com'
  AND source_hotel_slug = 'lighthouse-hotel'
  AND destination = 'ahangama';

CREATE TEMP TABLE merge_survivor_guest ON COMMIT DROP AS
SELECT *
FROM merge_target_guests
ORDER BY updated_at DESC NULLS LAST, created_at DESC NULLS LAST, id DESC
LIMIT 1;

CREATE TEMP TABLE merge_duplicate_guests ON COMMIT DROP AS
SELECT target.*
FROM merge_target_guests AS target
WHERE target.id <> (SELECT id FROM merge_survivor_guest);

CREATE TEMP TABLE merge_target_passes ON COMMIT DROP AS
SELECT passes.*
FROM passes
JOIN merge_target_guests AS target
  ON target.id = passes.guest_id
WHERE passes.source_hotel_slug = 'lighthouse-hotel'
  AND passes.pass_type = 'complimentary_hotel_guest';

CREATE TEMP TABLE merge_survivor_pass ON COMMIT DROP AS
SELECT *
FROM merge_target_passes
WHERE status = 'active'
ORDER BY created_at DESC NULLS LAST, updated_at DESC NULLS LAST, id DESC
LIMIT 1;

CREATE TEMP TABLE merge_duplicate_passes ON COMMIT DROP AS
SELECT target.*
FROM merge_target_passes AS target
WHERE target.id <> (SELECT id FROM merge_survivor_pass);

DO $$
BEGIN
  IF (SELECT COUNT(*) FROM merge_target_guests) < 2 THEN
    RAISE NOTICE 'Fewer than two matching pass_guests rows found. Script will only attempt the strict unique index.';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM merge_survivor_guest) THEN
    RAISE EXCEPTION 'No survivor guest found for target duplicate group.';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM merge_survivor_pass) THEN
    RAISE EXCEPTION 'No active survivor pass found for target duplicate group.';
  END IF;
END $$;

\echo 'Before merge audit: guests'
SELECT
  'before' AS phase,
  id,
  full_name,
  email,
  normalized_email,
  phone,
  country,
  whatsapp_opt_in,
  marketing_consent,
  source_hotel_slug,
  destination,
  created_at,
  updated_at,
  CASE
    WHEN id = (SELECT id FROM merge_survivor_guest) THEN 'survivor'
    ELSE 'duplicate'
  END AS merge_role
FROM merge_target_guests
ORDER BY updated_at DESC NULLS LAST, created_at DESC NULLS LAST, id DESC;

\echo 'Before merge audit: passes'
SELECT
  'before' AS phase,
  id,
  guest_id,
  source_hotel_slug,
  pass_type,
  status,
  valid_from,
  valid_until,
  passkit_status,
  created_at,
  updated_at,
  CASE
    WHEN id = (SELECT id FROM merge_survivor_pass) THEN 'survivor'
    ELSE 'duplicate'
  END AS merge_role
FROM merge_target_passes
ORDER BY created_at DESC NULLS LAST, updated_at DESC NULLS LAST, id DESC;

\echo 'Before merge audit: child row counts'
SELECT 'before' AS phase, 'guest_preferences' AS table_name, COUNT(*) AS row_count
FROM guest_preferences
WHERE guest_id IN (SELECT id FROM merge_target_guests)
   OR pass_id IN (SELECT id FROM merge_target_passes)
UNION ALL
SELECT 'before', 'booking_requests', COUNT(*)
FROM booking_requests
WHERE guest_id IN (SELECT id FROM merge_target_guests)
   OR pass_id IN (SELECT id FROM merge_target_passes)
UNION ALL
SELECT 'before', 'guest_content_history', COUNT(*)
FROM guest_content_history
WHERE guest_id IN (SELECT id FROM merge_target_guests)
   OR pass_id IN (SELECT id FROM merge_target_passes)
UNION ALL
SELECT 'before', 'guest_email_history', COUNT(*)
FROM guest_email_history
WHERE guest_id IN (SELECT id FROM merge_target_guests)
   OR pass_id IN (SELECT id FROM merge_target_passes)
UNION ALL
SELECT 'before', 'venue_interactions', COUNT(*)
FROM venue_interactions
WHERE guest_id IN (SELECT id FROM merge_target_guests)
   OR pass_id IN (SELECT id FROM merge_target_passes)
UNION ALL
SELECT 'before', 'article_interactions', COUNT(*)
FROM article_interactions
WHERE guest_id IN (SELECT id FROM merge_target_guests)
   OR pass_id IN (SELECT id FROM merge_target_passes)
UNION ALL
SELECT 'before', 'experience_interactions', COUNT(*)
FROM experience_interactions
WHERE guest_id IN (SELECT id FROM merge_target_guests)
   OR pass_id IN (SELECT id FROM merge_target_passes)
UNION ALL
SELECT 'before', 'pass_redemptions', COUNT(*)
FROM pass_redemptions
WHERE guest_id IN (SELECT id FROM merge_target_guests)
   OR pass_id IN (SELECT id FROM merge_target_passes)
ORDER BY table_name;

-- Preserve the latest submitted preferences on the survivor pass.
WITH latest_preferences AS (
  SELECT guest_preferences.*
  FROM guest_preferences
  WHERE guest_id IN (SELECT id FROM merge_target_guests)
     OR pass_id IN (SELECT id FROM merge_target_passes)
  ORDER BY updated_at DESC NULLS LAST,
           completed_at DESC NULLS LAST,
           created_at DESC NULLS LAST,
           id DESC
  LIMIT 1
)
UPDATE guest_preferences AS survivor_preferences
SET
  guest_id = (SELECT id FROM merge_survivor_guest),
  stay_length = latest_preferences.stay_length,
  interests = latest_preferences.interests,
  travel_group = latest_preferences.travel_group,
  services_interested = latest_preferences.services_interested,
  wants_whatsapp_recommendations = latest_preferences.wants_whatsapp_recommendations,
  completed_at = latest_preferences.completed_at,
  updated_at = NOW()
FROM latest_preferences
WHERE survivor_preferences.pass_id = (SELECT id FROM merge_survivor_pass);

-- If the survivor pass has no preference row, promote the latest duplicate
-- preference to survivor guest/pass. The UNIQUE(pass_id) constraint keeps this safe.
WITH latest_duplicate_preferences AS (
  SELECT guest_preferences.id
  FROM guest_preferences
  WHERE pass_id IN (SELECT id FROM merge_duplicate_passes)
  ORDER BY updated_at DESC NULLS LAST,
           completed_at DESC NULLS LAST,
           created_at DESC NULLS LAST,
           id DESC
  LIMIT 1
), survivor_preference_exists AS (
  SELECT 1
  FROM guest_preferences
  WHERE pass_id = (SELECT id FROM merge_survivor_pass)
)
UPDATE guest_preferences
SET
  guest_id = (SELECT id FROM merge_survivor_guest),
  pass_id = (SELECT id FROM merge_survivor_pass),
  updated_at = NOW()
WHERE id IN (SELECT id FROM latest_duplicate_preferences)
  AND NOT EXISTS (SELECT 1 FROM survivor_preference_exists);

-- Remaining duplicate preference rows cannot all move to the survivor pass
-- because guest_preferences.pass_id is unique. Keep them attached to their
-- historical pass, but reassign them to the survivor guest.
UPDATE guest_preferences
SET
  guest_id = (SELECT id FROM merge_survivor_guest),
  updated_at = NOW()
WHERE guest_id IN (SELECT id FROM merge_duplicate_guests);

-- Booking requests have a partial unique index for active initial interest:
-- (guest_id, pass_id, service_type) WHERE request_status = 'interested'.
-- Reassign only rows that will not collide with an existing survivor request.
UPDATE booking_requests AS booking_request
SET
  guest_id = (SELECT id FROM merge_survivor_guest),
  pass_id = (SELECT id FROM merge_survivor_pass),
  updated_at = NOW()
WHERE (
    booking_request.guest_id IN (SELECT id FROM merge_duplicate_guests)
    OR booking_request.pass_id IN (SELECT id FROM merge_duplicate_passes)
  )
  AND NOT (
    booking_request.request_status = 'interested'
    AND EXISTS (
      SELECT 1
      FROM booking_requests AS existing
      WHERE existing.id <> booking_request.id
        AND existing.guest_id = (SELECT id FROM merge_survivor_guest)
        AND existing.pass_id = (SELECT id FROM merge_survivor_pass)
        AND existing.service_type = booking_request.service_type
        AND existing.request_status = 'interested'
    )
  );

-- Preserve complete booking intent coverage on the survivor pass without
-- creating duplicate interested requests.
INSERT INTO booking_requests (
  guest_id,
  pass_id,
  service_type,
  request_status,
  notes,
  updated_at
)
SELECT DISTINCT
  (SELECT id FROM merge_survivor_guest),
  (SELECT id FROM merge_survivor_pass),
  booking_request.service_type,
  'interested',
  COALESCE(booking_request.notes, 'Merged from duplicate hotel guest flow'),
  NOW()
FROM booking_requests AS booking_request
WHERE (booking_request.guest_id IN (SELECT id FROM merge_target_guests)
    OR booking_request.pass_id IN (SELECT id FROM merge_target_passes))
  AND booking_request.request_status = 'interested'
ON CONFLICT (guest_id, pass_id, service_type)
  WHERE request_status = 'interested'
DO NOTHING;

UPDATE guest_content_history
SET
  guest_id = (SELECT id FROM merge_survivor_guest),
  pass_id = (SELECT id FROM merge_survivor_pass)
WHERE guest_id IN (SELECT id FROM merge_duplicate_guests)
   OR pass_id IN (SELECT id FROM merge_duplicate_passes);

UPDATE guest_email_history
SET
  guest_id = (SELECT id FROM merge_survivor_guest),
  pass_id = (SELECT id FROM merge_survivor_pass)
WHERE guest_id IN (SELECT id FROM merge_duplicate_guests)
   OR pass_id IN (SELECT id FROM merge_duplicate_passes);

UPDATE venue_interactions
SET
  guest_id = (SELECT id FROM merge_survivor_guest),
  pass_id = (SELECT id FROM merge_survivor_pass)
WHERE guest_id IN (SELECT id FROM merge_duplicate_guests)
   OR pass_id IN (SELECT id FROM merge_duplicate_passes);

UPDATE article_interactions
SET
  guest_id = (SELECT id FROM merge_survivor_guest),
  pass_id = (SELECT id FROM merge_survivor_pass)
WHERE guest_id IN (SELECT id FROM merge_duplicate_guests)
   OR pass_id IN (SELECT id FROM merge_duplicate_passes);

UPDATE experience_interactions
SET
  guest_id = (SELECT id FROM merge_survivor_guest),
  pass_id = (SELECT id FROM merge_survivor_pass)
WHERE guest_id IN (SELECT id FROM merge_duplicate_guests)
   OR pass_id IN (SELECT id FROM merge_duplicate_passes);

UPDATE pass_redemptions
SET
  guest_id = (SELECT id FROM merge_survivor_guest),
  pass_id = (SELECT id FROM merge_survivor_pass)
WHERE guest_id IN (SELECT id FROM merge_duplicate_guests)
   OR pass_id IN (SELECT id FROM merge_duplicate_passes);

-- There is no safe archive field on pass_guests, so duplicate guest rows are
-- left intact. Ensure non-survivor active passes cannot remain active.
WITH inactive_status AS (
  SELECT CASE
    WHEN NOT EXISTS (
      SELECT 1
      FROM pg_constraint
      WHERE conrelid = 'passes'::regclass
        AND contype = 'c'
        AND pg_get_constraintdef(oid) ILIKE '%status%'
    ) THEN 'duplicate_inactive'
    WHEN EXISTS (
      SELECT 1
      FROM pg_constraint
      WHERE conrelid = 'passes'::regclass
        AND contype = 'c'
        AND pg_get_constraintdef(oid) ILIKE '%duplicate_inactive%'
    ) THEN 'duplicate_inactive'
    ELSE 'inactive'
  END AS status
)
UPDATE passes
SET
  status = (SELECT status FROM inactive_status),
  updated_at = NOW()
WHERE id IN (SELECT id FROM merge_duplicate_passes)
  AND status = 'active';

\echo 'After merge audit: guests'
SELECT
  'after' AS phase,
  guest.id,
  guest.full_name,
  guest.email,
  guest.normalized_email,
  guest.phone,
  guest.country,
  guest.whatsapp_opt_in,
  guest.marketing_consent,
  guest.source_hotel_slug,
  guest.destination,
  guest.created_at,
  guest.updated_at,
  CASE
    WHEN guest.id = (SELECT id FROM merge_survivor_guest) THEN 'survivor'
    ELSE 'duplicate_left_in_place'
  END AS merge_role
FROM pass_guests AS guest
WHERE guest.normalized_email = 'hello@viji.com'
  AND guest.source_hotel_slug = 'lighthouse-hotel'
  AND guest.destination = 'ahangama'
ORDER BY guest.updated_at DESC NULLS LAST, guest.created_at DESC NULLS LAST, guest.id DESC;

\echo 'After merge audit: passes'
SELECT
  'after' AS phase,
  pass.id,
  pass.guest_id,
  pass.source_hotel_slug,
  pass.pass_type,
  pass.status,
  pass.valid_from,
  pass.valid_until,
  pass.passkit_status,
  pass.created_at,
  pass.updated_at,
  CASE
    WHEN pass.id = (SELECT id FROM merge_survivor_pass) THEN 'survivor'
    ELSE 'duplicate_inactivated'
  END AS merge_role
FROM passes AS pass
WHERE pass.id IN (SELECT id FROM merge_target_passes)
   OR pass.guest_id IN (SELECT id FROM merge_target_guests)
ORDER BY pass.created_at DESC NULLS LAST, pass.updated_at DESC NULLS LAST, pass.id DESC;

\echo 'After merge audit: child row counts'
SELECT 'after' AS phase, 'guest_preferences' AS table_name, COUNT(*) AS survivor_row_count
FROM guest_preferences
WHERE guest_id = (SELECT id FROM merge_survivor_guest)
   OR pass_id = (SELECT id FROM merge_survivor_pass)
UNION ALL
SELECT 'after', 'booking_requests', COUNT(*)
FROM booking_requests
WHERE guest_id = (SELECT id FROM merge_survivor_guest)
   OR pass_id = (SELECT id FROM merge_survivor_pass)
UNION ALL
SELECT 'after', 'guest_content_history', COUNT(*)
FROM guest_content_history
WHERE guest_id = (SELECT id FROM merge_survivor_guest)
   OR pass_id = (SELECT id FROM merge_survivor_pass)
UNION ALL
SELECT 'after', 'guest_email_history', COUNT(*)
FROM guest_email_history
WHERE guest_id = (SELECT id FROM merge_survivor_guest)
   OR pass_id = (SELECT id FROM merge_survivor_pass)
UNION ALL
SELECT 'after', 'venue_interactions', COUNT(*)
FROM venue_interactions
WHERE guest_id = (SELECT id FROM merge_survivor_guest)
   OR pass_id = (SELECT id FROM merge_survivor_pass)
UNION ALL
SELECT 'after', 'article_interactions', COUNT(*)
FROM article_interactions
WHERE guest_id = (SELECT id FROM merge_survivor_guest)
   OR pass_id = (SELECT id FROM merge_survivor_pass)
UNION ALL
SELECT 'after', 'experience_interactions', COUNT(*)
FROM experience_interactions
WHERE guest_id = (SELECT id FROM merge_survivor_guest)
   OR pass_id = (SELECT id FROM merge_survivor_pass)
UNION ALL
SELECT 'after', 'pass_redemptions', COUNT(*)
FROM pass_redemptions
WHERE guest_id = (SELECT id FROM merge_survivor_guest)
   OR pass_id = (SELECT id FROM merge_survivor_pass)
ORDER BY table_name;

\echo 'After merge audit: remaining duplicate groups'
SELECT
  normalized_email,
  source_hotel_slug,
  destination,
  COUNT(*) AS guest_count,
  ARRAY_AGG(id ORDER BY updated_at DESC NULLS LAST, created_at DESC NULLS LAST, id DESC) AS guest_ids
FROM pass_guests
WHERE normalized_email = 'hello@viji.com'
  AND source_hotel_slug = 'lighthouse-hotel'
  AND destination = 'ahangama'
GROUP BY normalized_email, source_hotel_slug, destination
HAVING COUNT(*) > 1;

DO $$
BEGIN
  BEGIN
    CREATE UNIQUE INDEX IF NOT EXISTS pass_guests_hotel_destination_email_uidx
      ON pass_guests (normalized_email, source_hotel_slug, destination)
      WHERE normalized_email IS NOT NULL
        AND source_hotel_slug IS NOT NULL
        AND destination IS NOT NULL;

    RAISE NOTICE 'Created pass_guests_hotel_destination_email_uidx.';
  EXCEPTION
    WHEN unique_violation THEN
      RAISE NOTICE 'Could not create pass_guests_hotel_destination_email_uidx because duplicate pass_guests rows still exist. No safe archive field exists on pass_guests, so duplicate guest rows were left in place.';
    WHEN duplicate_table THEN
      RAISE NOTICE 'pass_guests_hotel_destination_email_uidx already exists.';
  END;
END $$;

COMMIT;
