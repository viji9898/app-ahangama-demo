ALTER TABLE pass_guests
  ADD COLUMN IF NOT EXISTS normalized_email TEXT;

UPDATE pass_guests
SET normalized_email = lower(trim(email)),
    updated_at = NOW()
WHERE email IS NOT NULL
  AND normalized_email IS DISTINCT FROM lower(trim(email));

CREATE INDEX IF NOT EXISTS pass_guests_normalized_email_idx
  ON pass_guests (normalized_email);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pass_guests
    WHERE normalized_email IS NOT NULL
      AND source_hotel_slug IS NOT NULL
      AND destination IS NOT NULL
    GROUP BY normalized_email, source_hotel_slug, destination
    HAVING COUNT(*) > 1
  ) THEN
    RAISE NOTICE 'Skipping pass_guests_hotel_destination_email_uidx because duplicate hotel guest rows already exist. Run docs/hotel-pass-duplicate-audit.sql, resolve duplicates, then create this index.';
  ELSE
    CREATE UNIQUE INDEX IF NOT EXISTS pass_guests_hotel_destination_email_uidx
      ON pass_guests (normalized_email, source_hotel_slug, destination)
      WHERE normalized_email IS NOT NULL
        AND source_hotel_slug IS NOT NULL
        AND destination IS NOT NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM passes
    WHERE source_hotel_slug IS NOT NULL
      AND status = 'active'
      AND pass_type = 'complimentary_hotel_guest'
    GROUP BY guest_id, source_hotel_slug, pass_type
    HAVING COUNT(*) > 1
  ) THEN
    RAISE NOTICE 'Skipping passes_active_hotel_guest_uidx because duplicate active hotel passes already exist. Resolve duplicates before adding the index.';
  ELSE
    CREATE UNIQUE INDEX IF NOT EXISTS passes_active_hotel_guest_uidx
      ON passes (guest_id, source_hotel_slug, pass_type)
      WHERE status = 'active'
        AND pass_type = 'complimentary_hotel_guest'
        AND source_hotel_slug IS NOT NULL;
  END IF;
END $$;