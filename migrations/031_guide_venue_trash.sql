-- Soft-delete / trash support for guide venue placements.
-- Deleted venues move to the trash for 30 days, then are purged
-- automatically (see netlify/functions/guide-trash-purge.js).

ALTER TABLE guide_venue_placements
  DROP CONSTRAINT IF EXISTS guide_venue_placements_status_check,
  ADD CONSTRAINT guide_venue_placements_status_check
    CHECK (status IN ('active', 'draft', 'archived', 'trashed')),
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS deleted_reason TEXT;

CREATE INDEX IF NOT EXISTS idx_guide_venue_placements_trash_purge
  ON guide_venue_placements (status, deleted_at);

-- Legacy archived rows become trashed so they surface in the trash page.
UPDATE guide_venue_placements
   SET status = 'trashed',
       deleted_at = NOW(),
       deleted_reason = 'migrated_from_archived',
       updated_at = NOW()
 WHERE status = 'archived' AND deleted_at IS NULL;