-- Instagram sync foundation (Phase 1).
--
-- Creates the automatically synced Instagram content library, its venue
-- assignments, and the sync-run audit log.
--
-- IMPORTANT: this migration deliberately leaves
-- `guide_app.venue_instagram_posts` and `guide_app.venue_articles` untouched.
-- Manually entered Instagram entries remain a separate, historical data set
-- with their existing add/edit/delete behaviour. Synced media is never merged
-- into, or allowed to overwrite, a manual row.
--
-- Stories are retained indefinitely. Expired Stories keep their last captured
-- metrics and `story_expires_at`; no cleanup or deletion is performed here.
--
-- Apply this file atomically. It owns its transaction, so any failed statement
-- rolls back the whole 034 schema instead of leaving a partial one. The
-- migration runner sends the file as one multi-statement query. With psql, run
-- the file as a whole and stop on the first error, for example:
--   psql -v ON_ERROR_STOP=1 -f migrations/034_create_instagram_sync.sql

BEGIN;

CREATE SCHEMA IF NOT EXISTS guide_app;

CREATE TABLE IF NOT EXISTS guide_app.instagram_media (
  id                     BIGSERIAL PRIMARY KEY,
  ig_media_id            TEXT NOT NULL,
  media_type             TEXT,
  media_product_type     TEXT,
  permalink              TEXT,
  caption                TEXT,
  media_url              TEXT,
  thumbnail_url          TEXT,
  posted_at              TIMESTAMPTZ,
  story_expires_at       TIMESTAMPTZ,

  -- Metric columns are nullable on purpose: a missing metric must stay
  -- distinguishable from a legitimate zero.
  views                  BIGINT,
  reach                  BIGINT,
  likes                  BIGINT,
  comments               BIGINT,
  shares                 BIGINT,
  saves                  BIGINT,

  -- `metrics_fetched_at` is the last attempt (successful or failed).
  -- `metrics_captured_at` is the last successful capture and is the value the
  -- UI must use for its "last captured" label.
  metrics_status         TEXT NOT NULL DEFAULT 'pending',
  metrics_fetched_at     TIMESTAMPTZ,
  metrics_captured_at    TIMESTAMPTZ,
  metrics_error_code     TEXT,
  metrics_error_message  TEXT,

  last_seen_at           TIMESTAMPTZ,
  last_synced_at         TIMESTAMPTZ,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT instagram_media_ig_media_id_unique
    UNIQUE (ig_media_id),
  CONSTRAINT instagram_media_metrics_status_check
    CHECK (metrics_status IN (
      'pending',
      'ok',
      'partial',
      'unavailable',
      'error'
    )),
  CONSTRAINT instagram_media_metric_values_check
    CHECK (
      (views IS NULL OR views >= 0)
      AND (reach IS NULL OR reach >= 0)
      AND (likes IS NULL OR likes >= 0)
      AND (comments IS NULL OR comments >= 0)
      AND (shares IS NULL OR shares >= 0)
      AND (saves IS NULL OR saves >= 0)
    ),
  CONSTRAINT instagram_media_story_expiry_check
    CHECK (story_expires_at IS NULL OR posted_at IS NOT NULL)
);

-- Enforced outside CREATE TABLE so an installation that already has the table
-- is repaired on rerun. Meta product types are uppercase; rejecting lowercase
-- input keeps the Story queries and indexes reliable.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE n.nspname = 'guide_app'
      AND t.relname = 'instagram_media'
      AND c.conname = 'instagram_media_product_type_check'
  ) THEN
    ALTER TABLE guide_app.instagram_media
      ADD CONSTRAINT instagram_media_product_type_check
      CHECK (
        media_product_type IS NULL
        OR (
          media_product_type <> ''
          AND media_product_type = UPPER(media_product_type)
        )
      );
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_instagram_media_posted
  ON guide_app.instagram_media (posted_at DESC NULLS LAST, id DESC);

CREATE INDEX IF NOT EXISTS idx_instagram_media_product_posted
  ON guide_app.instagram_media (media_product_type, posted_at DESC NULLS LAST);

-- Used to find active and expired Stories without scanning the full library.
CREATE INDEX IF NOT EXISTS idx_instagram_media_stories
  ON guide_app.instagram_media (media_product_type, story_expires_at);

-- Refresh candidates are ordered by last successful capture. Failed attempts
-- are throttled separately through `metrics_fetched_at`.
--
-- These indexes are deliberately *not* partial: partial predicates cannot use
-- the volatile NOW() function, and excluding Stories would leave active
-- Stories out of the refresh index. At the expected library size (thousands of
-- rows) scanning expired Stories and filtering them out is cheaper than
-- maintaining a more complex active-Story index. Expired Stories are frozen by
-- the WHERE clause in `getInstagramMediaRefreshQueue`.
--
-- DROP is needed so a rerun replaces the earlier Phase 1 partial definition
-- instead of leaving it in place via IF NOT EXISTS.
DROP INDEX IF EXISTS guide_app.idx_instagram_media_refresh_due;
CREATE INDEX IF NOT EXISTS idx_instagram_media_refresh_due
  ON guide_app.instagram_media (metrics_captured_at NULLS FIRST);

DROP INDEX IF EXISTS guide_app.idx_instagram_media_refresh_retry;
CREATE INDEX IF NOT EXISTS idx_instagram_media_refresh_retry
  ON guide_app.instagram_media (metrics_fetched_at NULLS FIRST);

CREATE INDEX IF NOT EXISTS idx_instagram_media_metrics_status
  ON guide_app.instagram_media (metrics_status, metrics_captured_at NULLS FIRST);

CREATE TABLE IF NOT EXISTS guide_app.instagram_media_venues (
  id           BIGSERIAL PRIMARY KEY,
  media_id     BIGINT NOT NULL
    REFERENCES guide_app.instagram_media (id) ON DELETE CASCADE,
  venue_key    TEXT NOT NULL,
  assigned_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT instagram_media_venues_unique
    UNIQUE (media_id, venue_key)
);

CREATE INDEX IF NOT EXISTS idx_instagram_media_venues_venue
  ON guide_app.instagram_media_venues (venue_key, media_id);

CREATE TABLE IF NOT EXISTS guide_app.instagram_sync_runs (
  id                    BIGSERIAL PRIMARY KEY,
  trigger_source        TEXT NOT NULL DEFAULT 'schedule',
  status                TEXT NOT NULL DEFAULT 'running',
  started_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at           TIMESTAMPTZ,
  duration_ms           INTEGER,

  media_seen            INTEGER NOT NULL DEFAULT 0,
  media_created         INTEGER NOT NULL DEFAULT 0,
  media_updated         INTEGER NOT NULL DEFAULT 0,
  stories_seen          INTEGER NOT NULL DEFAULT 0,
  insights_attempted    INTEGER NOT NULL DEFAULT 0,
  insights_failed       INTEGER NOT NULL DEFAULT 0,
  has_more              BOOLEAN NOT NULL DEFAULT FALSE,

  -- Only safe, redacted error information may be stored here.
  error_code            TEXT,
  error_message         TEXT,
  graph_trace_id        TEXT,

  account_followers     BIGINT,
  account_media_count   BIGINT,
  account_fetched_at    TIMESTAMPTZ,

  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT instagram_sync_runs_status_check
    CHECK (status IN ('running', 'success', 'partial', 'failed', 'skipped')),
  CONSTRAINT instagram_sync_runs_terminal_check
    CHECK (
      (status = 'running' AND finished_at IS NULL AND duration_ms IS NULL)
      OR
      (status <> 'running' AND finished_at IS NOT NULL AND duration_ms IS NOT NULL)
    ),
  CONSTRAINT instagram_sync_runs_duration_check
    CHECK (duration_ms IS NULL OR duration_ms >= 0),
  CONSTRAINT instagram_sync_runs_finished_after_start_check
    CHECK (finished_at IS NULL OR finished_at >= started_at),
  CONSTRAINT instagram_sync_runs_counters_check
    CHECK (
      media_seen >= 0
      AND media_created >= 0
      AND media_updated >= 0
      AND stories_seen >= 0
      AND insights_attempted >= 0
      AND insights_failed >= 0
    ),
  CONSTRAINT instagram_sync_runs_account_check
    CHECK (
      (account_followers IS NULL OR account_followers >= 0)
      AND (account_media_count IS NULL OR account_media_count >= 0)
    )
);

CREATE INDEX IF NOT EXISTS idx_instagram_sync_runs_started
  ON guide_app.instagram_sync_runs (started_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_instagram_sync_runs_status_started
  ON guide_app.instagram_sync_runs (status, started_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_instagram_sync_runs_last_success
  ON guide_app.instagram_sync_runs (finished_at DESC, id DESC)
  WHERE status = 'success';

COMMENT ON TABLE guide_app.instagram_media IS
  'Automatically synced Instagram media. Manual venue_instagram_posts rows are separate and never merged here.';

COMMENT ON COLUMN guide_app.instagram_media.metrics_fetched_at IS
  'Last insights attempt, successful or failed.';

COMMENT ON COLUMN guide_app.instagram_media.metrics_captured_at IS
  'Last successful insights capture. UI "last captured" must use this column.';

COMMENT ON TABLE guide_app.instagram_sync_runs IS
  'Audit log for Instagram sync attempts. Every non-running run must have finished_at and duration_ms.';

COMMIT;
