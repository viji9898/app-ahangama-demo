-- Venue Performance Statistics: manually maintained content.
--
-- Instagram Insights are not exposed through GA4 and Meta's Graph API
-- requires a business account with `instagram_manage_insights`, so the
-- numbers are entered by an administrator and stored here.
--
-- Article rows only record which Ahangama.com articles belong to a venue.
-- Page views and unique visitors for those articles are read live from
-- the GA4 Data API, never stored here.
--
-- Tables live in `guide_app` because the application database role owns
-- that schema but cannot alter `guide_venue_placements` (see 032).

CREATE SCHEMA IF NOT EXISTS guide_app;

CREATE TABLE IF NOT EXISTS guide_app.venue_instagram_posts (
  id           BIGSERIAL PRIMARY KEY,
  venue_key    TEXT NOT NULL,
  post_url     TEXT NOT NULL,
  post_date    DATE,
  post_type    TEXT NOT NULL DEFAULT 'post',
  reach        INTEGER NOT NULL DEFAULT 0,
  impressions  INTEGER NOT NULL DEFAULT 0,
  likes        INTEGER NOT NULL DEFAULT 0,
  comments     INTEGER NOT NULL DEFAULT 0,
  shares       INTEGER NOT NULL DEFAULT 0,
  saves        INTEGER NOT NULL DEFAULT 0,
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT venue_instagram_posts_type_check
    CHECK (post_type IN ('post', 'reel', 'story')),
  CONSTRAINT venue_instagram_posts_unique
    UNIQUE (venue_key, post_url)
);

CREATE INDEX IF NOT EXISTS idx_venue_instagram_posts_venue
  ON guide_app.venue_instagram_posts (venue_key, post_date DESC);

CREATE TABLE IF NOT EXISTS guide_app.venue_articles (
  id           BIGSERIAL PRIMARY KEY,
  venue_key    TEXT NOT NULL,
  title        TEXT NOT NULL,
  url          TEXT NOT NULL,
  published_at DATE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT venue_articles_unique
    UNIQUE (venue_key, url)
);

CREATE INDEX IF NOT EXISTS idx_venue_articles_venue
  ON guide_app.venue_articles (venue_key, published_at DESC);
