CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION set_destination_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE venues ADD COLUMN IF NOT EXISTS content_completeness_score INTEGER NOT NULL DEFAULT 0;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS ai_summary TEXT;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS season_notes TEXT;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS best_months TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE venues ADD COLUMN IF NOT EXISTS editorial_status TEXT NOT NULL DEFAULT 'standard';
ALTER TABLE venues ADD COLUMN IF NOT EXISTS latitude NUMERIC;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS longitude NUMERIC;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS ai_tags TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE venues ADD COLUMN IF NOT EXISTS ai_keywords TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE venues ADD COLUMN IF NOT EXISTS ai_recommendation_notes TEXT;

ALTER TABLE venues DROP CONSTRAINT IF EXISTS venues_status_check;

UPDATE venues
SET status = CASE status
  WHEN 'active' THEN 'published'
  WHEN 'inactive' THEN 'archived'
  WHEN 'coming_soon' THEN 'draft'
  WHEN 'draft' THEN 'draft'
  WHEN 'review' THEN 'review'
  WHEN 'published' THEN 'published'
  WHEN 'archived' THEN 'archived'
  ELSE 'draft'
END;

ALTER TABLE venues ALTER COLUMN status SET DEFAULT 'draft';

ALTER TABLE places ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft';
ALTER TABLE places ADD COLUMN IF NOT EXISTS content_completeness_score INTEGER NOT NULL DEFAULT 0;
ALTER TABLE places ADD COLUMN IF NOT EXISTS ai_summary TEXT;
ALTER TABLE places ADD COLUMN IF NOT EXISTS season_notes TEXT;
ALTER TABLE places ADD COLUMN IF NOT EXISTS best_months TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE places ADD COLUMN IF NOT EXISTS editorial_status TEXT NOT NULL DEFAULT 'standard';
ALTER TABLE places ADD COLUMN IF NOT EXISTS ai_tags TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE places ADD COLUMN IF NOT EXISTS ai_keywords TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE places ADD COLUMN IF NOT EXISTS ai_recommendation_notes TEXT;

ALTER TABLE experiences ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft';
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS content_completeness_score INTEGER NOT NULL DEFAULT 0;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS ai_summary TEXT;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS season_notes TEXT;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS best_months TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS editorial_status TEXT NOT NULL DEFAULT 'standard';
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS latitude NUMERIC;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS longitude NUMERIC;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS ai_tags TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS ai_keywords TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS ai_recommendation_notes TEXT;

ALTER TABLE articles ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS content_completeness_score INTEGER NOT NULL DEFAULT 0;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS ai_summary TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS season_notes TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS best_months TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS editorial_status TEXT NOT NULL DEFAULT 'standard';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS ai_tags TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS ai_keywords TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS ai_recommendation_notes TEXT;

UPDATE articles
SET status = 'published'
WHERE published = TRUE
  AND status = 'draft';

ALTER TABLE events ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft';
ALTER TABLE events ADD COLUMN IF NOT EXISTS content_completeness_score INTEGER NOT NULL DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS ai_summary TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS season_notes TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS best_months TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE events ADD COLUMN IF NOT EXISTS editorial_status TEXT NOT NULL DEFAULT 'standard';
ALTER TABLE events ADD COLUMN IF NOT EXISTS latitude NUMERIC;
ALTER TABLE events ADD COLUMN IF NOT EXISTS longitude NUMERIC;
ALTER TABLE events ADD COLUMN IF NOT EXISTS ai_tags TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE events ADD COLUMN IF NOT EXISTS ai_keywords TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE events ADD COLUMN IF NOT EXISTS ai_recommendation_notes TEXT;

DO $$
DECLARE
  entity_table TEXT;
BEGIN
  FOREACH entity_table IN ARRAY ARRAY['venues', 'places', 'experiences', 'articles', 'events'] LOOP
    EXECUTE FORMAT('ALTER TABLE %I DROP CONSTRAINT IF EXISTS %I', entity_table, entity_table || '_status_check');
    EXECUTE FORMAT(
      'ALTER TABLE %I ADD CONSTRAINT %I CHECK (status IN (''draft'', ''review'', ''published'', ''archived''))',
      entity_table,
      entity_table || '_status_check'
    );

    EXECUTE FORMAT('ALTER TABLE %I DROP CONSTRAINT IF EXISTS %I', entity_table, entity_table || '_editorial_status_check');
    EXECUTE FORMAT(
      'ALTER TABLE %I ADD CONSTRAINT %I CHECK (editorial_status IN (''hidden'', ''standard'', ''recommended'', ''featured''))',
      entity_table,
      entity_table || '_editorial_status_check'
    );

    EXECUTE FORMAT('ALTER TABLE %I DROP CONSTRAINT IF EXISTS %I', entity_table, entity_table || '_content_completeness_score_check');
    EXECUTE FORMAT(
      'ALTER TABLE %I ADD CONSTRAINT %I CHECK (content_completeness_score BETWEEN 0 AND 100)',
      entity_table,
      entity_table || '_content_completeness_score_check'
    );
  END LOOP;
END $$;

CREATE TABLE IF NOT EXISTS entity_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'image',
  url TEXT NOT NULL,
  caption TEXT,
  credit TEXT,
  alt_text TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT entity_media_entity_type_check CHECK (entity_type IN ('venue', 'place', 'experience', 'article', 'event')),
  CONSTRAINT entity_media_media_type_check CHECK (media_type IN ('image', 'video', 'logo', 'gallery', 'og_image'))
);

CREATE TABLE IF NOT EXISTS entity_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  relationship_type TEXT NOT NULL DEFAULT 'related',
  priority_score INTEGER NOT NULL DEFAULT 50,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT entity_relationships_source_type_check CHECK (source_type IN ('venue', 'place', 'experience', 'article', 'event')),
  CONSTRAINT entity_relationships_target_type_check CHECK (target_type IN ('venue', 'place', 'experience', 'article', 'event')),
  CONSTRAINT entity_relationships_priority_score_check CHECK (priority_score BETWEEN 0 AND 100),
  CONSTRAINT entity_relationships_unique UNIQUE (source_type, source_id, target_type, target_id, relationship_type)
);

CREATE TABLE IF NOT EXISTS venue_metrics_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id TEXT NOT NULL,
  date DATE NOT NULL,
  destination TEXT,
  profile_views INTEGER NOT NULL DEFAULT 0,
  article_mentions INTEGER NOT NULL DEFAULT 0,
  email_impressions INTEGER NOT NULL DEFAULT 0,
  email_clicks INTEGER NOT NULL DEFAULT 0,
  pass_recommendations INTEGER NOT NULL DEFAULT 0,
  pass_redemptions INTEGER NOT NULL DEFAULT 0,
  booking_requests INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT venue_metrics_daily_venue_date_unique UNIQUE (venue_id, date),
  CONSTRAINT venue_metrics_daily_non_negative_check CHECK (
    profile_views >= 0
    AND article_mentions >= 0
    AND email_impressions >= 0
    AND email_clicks >= 0
    AND pass_recommendations >= 0
    AND pass_redemptions >= 0
    AND booking_requests >= 0
  )
);

CREATE INDEX IF NOT EXISTS venues_status_idx ON venues (status);
CREATE INDEX IF NOT EXISTS venues_editorial_status_idx ON venues (editorial_status);
CREATE INDEX IF NOT EXISTS venues_content_completeness_score_idx ON venues (content_completeness_score);
CREATE INDEX IF NOT EXISTS venues_latitude_longitude_idx ON venues (latitude, longitude);
CREATE INDEX IF NOT EXISTS venues_best_months_idx ON venues USING GIN (best_months);
CREATE INDEX IF NOT EXISTS venues_ai_tags_idx ON venues USING GIN (ai_tags);
CREATE INDEX IF NOT EXISTS venues_ai_keywords_idx ON venues USING GIN (ai_keywords);

CREATE INDEX IF NOT EXISTS places_status_idx ON places (status);
CREATE INDEX IF NOT EXISTS places_editorial_status_idx ON places (editorial_status);
CREATE INDEX IF NOT EXISTS places_content_completeness_score_idx ON places (content_completeness_score);
CREATE INDEX IF NOT EXISTS places_latitude_longitude_idx ON places (latitude, longitude);
CREATE INDEX IF NOT EXISTS places_best_months_idx ON places USING GIN (best_months);
CREATE INDEX IF NOT EXISTS places_ai_tags_idx ON places USING GIN (ai_tags);
CREATE INDEX IF NOT EXISTS places_ai_keywords_idx ON places USING GIN (ai_keywords);

CREATE INDEX IF NOT EXISTS experiences_status_idx ON experiences (status);
CREATE INDEX IF NOT EXISTS experiences_editorial_status_idx ON experiences (editorial_status);
CREATE INDEX IF NOT EXISTS experiences_content_completeness_score_idx ON experiences (content_completeness_score);
CREATE INDEX IF NOT EXISTS experiences_latitude_longitude_idx ON experiences (latitude, longitude);
CREATE INDEX IF NOT EXISTS experiences_best_months_idx ON experiences USING GIN (best_months);
CREATE INDEX IF NOT EXISTS experiences_ai_tags_idx ON experiences USING GIN (ai_tags);
CREATE INDEX IF NOT EXISTS experiences_ai_keywords_idx ON experiences USING GIN (ai_keywords);

CREATE INDEX IF NOT EXISTS articles_status_idx ON articles (status);
CREATE INDEX IF NOT EXISTS articles_editorial_status_idx ON articles (editorial_status);
CREATE INDEX IF NOT EXISTS articles_content_completeness_score_idx ON articles (content_completeness_score);
CREATE INDEX IF NOT EXISTS articles_best_months_idx ON articles USING GIN (best_months);
CREATE INDEX IF NOT EXISTS articles_ai_tags_idx ON articles USING GIN (ai_tags);
CREATE INDEX IF NOT EXISTS articles_ai_keywords_idx ON articles USING GIN (ai_keywords);

CREATE INDEX IF NOT EXISTS events_status_idx ON events (status);
CREATE INDEX IF NOT EXISTS events_editorial_status_idx ON events (editorial_status);
CREATE INDEX IF NOT EXISTS events_content_completeness_score_idx ON events (content_completeness_score);
CREATE INDEX IF NOT EXISTS events_latitude_longitude_idx ON events (latitude, longitude);
CREATE INDEX IF NOT EXISTS events_best_months_idx ON events USING GIN (best_months);
CREATE INDEX IF NOT EXISTS events_ai_tags_idx ON events USING GIN (ai_tags);
CREATE INDEX IF NOT EXISTS events_ai_keywords_idx ON events USING GIN (ai_keywords);

CREATE INDEX IF NOT EXISTS entity_media_entity_idx ON entity_media (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS entity_media_is_primary_idx ON entity_media (is_primary);
CREATE INDEX IF NOT EXISTS entity_media_sort_order_idx ON entity_media (sort_order);
CREATE INDEX IF NOT EXISTS entity_media_entity_sort_idx ON entity_media (entity_type, entity_id, is_primary DESC, sort_order);

CREATE INDEX IF NOT EXISTS entity_relationships_source_idx ON entity_relationships (source_type, source_id);
CREATE INDEX IF NOT EXISTS entity_relationships_target_idx ON entity_relationships (target_type, target_id);
CREATE INDEX IF NOT EXISTS entity_relationships_relationship_type_idx ON entity_relationships (relationship_type);
CREATE INDEX IF NOT EXISTS entity_relationships_priority_score_idx ON entity_relationships (priority_score DESC);

CREATE INDEX IF NOT EXISTS venue_metrics_daily_venue_id_idx ON venue_metrics_daily (venue_id);
CREATE INDEX IF NOT EXISTS venue_metrics_daily_date_idx ON venue_metrics_daily (date DESC);
CREATE INDEX IF NOT EXISTS venue_metrics_daily_destination_idx ON venue_metrics_daily (destination);

DROP TRIGGER IF EXISTS entity_media_set_updated_at ON entity_media;
CREATE TRIGGER entity_media_set_updated_at
  BEFORE UPDATE ON entity_media
  FOR EACH ROW
  EXECUTE FUNCTION set_destination_content_updated_at();

DROP TRIGGER IF EXISTS venue_metrics_daily_set_updated_at ON venue_metrics_daily;
CREATE TRIGGER venue_metrics_daily_set_updated_at
  BEFORE UPDATE ON venue_metrics_daily
  FOR EACH ROW
  EXECUTE FUNCTION set_destination_content_updated_at();
