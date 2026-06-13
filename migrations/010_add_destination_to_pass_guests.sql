ALTER TABLE pass_guests
  ADD COLUMN IF NOT EXISTS destination TEXT;

UPDATE pass_guests
SET destination = 'ahangama',
    updated_at = NOW()
WHERE source_hotel_slug = 'lighthouse-hotel'
  AND (destination IS NULL OR destination = '');

CREATE INDEX IF NOT EXISTS pass_guests_destination_idx
  ON pass_guests (destination);