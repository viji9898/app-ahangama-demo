CREATE OR REPLACE FUNCTION set_destination_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS venues (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  name TEXT NOT NULL,
  category TEXT,
  short_description TEXT,
  long_description TEXT,
  area TEXT,
  destination TEXT,
  priority_score INTEGER NOT NULL DEFAULT 50,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  recommended_by_editorial BOOLEAN NOT NULL DEFAULT FALSE,
  pass_partner BOOLEAN NOT NULL DEFAULT FALSE,
  circle_partner BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'active',
  website_url TEXT,
  instagram_url TEXT,
  google_maps_url TEXT,
  phone TEXT,
  email TEXT,
  image_url TEXT,
  offer_title TEXT,
  offer_description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT venues_priority_score_check CHECK (priority_score BETWEEN 0 AND 100),
  CONSTRAINT venues_status_check CHECK (status IN ('active', 'inactive', 'draft', 'archived', 'coming_soon'))
);

CREATE TABLE IF NOT EXISTS places (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  name TEXT,
  category TEXT,
  description TEXT,
  area TEXT,
  destination TEXT,
  priority_score INTEGER NOT NULL DEFAULT 50,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  latitude NUMERIC,
  longitude NUMERIC,
  image_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT places_priority_score_check CHECK (priority_score BETWEEN 0 AND 100)
);

CREATE TABLE IF NOT EXISTS experiences (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  name TEXT,
  category TEXT,
  description TEXT,
  area TEXT,
  destination TEXT,
  priority_score INTEGER NOT NULL DEFAULT 50,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  bookable BOOLEAN NOT NULL DEFAULT FALSE,
  price_from NUMERIC,
  image_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT experiences_priority_score_check CHECK (priority_score BETWEEN 0 AND 100),
  CONSTRAINT experiences_price_from_check CHECK (price_from IS NULL OR price_from >= 0)
);

CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  title TEXT,
  category TEXT,
  excerpt TEXT,
  featured_image TEXT,
  author TEXT,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  priority_score INTEGER NOT NULL DEFAULT 50,
  published_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT articles_priority_score_check CHECK (priority_score BETWEEN 0 AND 100)
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  title TEXT,
  category TEXT,
  description TEXT,
  destination TEXT,
  area TEXT,
  venue_id TEXT REFERENCES venues (id) ON DELETE SET NULL,
  start_datetime TIMESTAMP,
  end_datetime TIMESTAMP,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  priority_score INTEGER NOT NULL DEFAULT 50,
  ticket_url TEXT,
  image_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT events_priority_score_check CHECK (priority_score BETWEEN 0 AND 100),
  CONSTRAINT events_datetime_check CHECK (end_datetime IS NULL OR start_datetime IS NULL OR end_datetime >= start_datetime)
);

CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  name TEXT,
  tag_type TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS venue_tags (
  venue_id TEXT NOT NULL REFERENCES venues (id) ON DELETE CASCADE,
  tag_id TEXT NOT NULL REFERENCES tags (id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (venue_id, tag_id)
);

CREATE TABLE IF NOT EXISTS place_tags (
  place_id TEXT NOT NULL REFERENCES places (id) ON DELETE CASCADE,
  tag_id TEXT NOT NULL REFERENCES tags (id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (place_id, tag_id)
);

CREATE TABLE IF NOT EXISTS experience_tags (
  experience_id TEXT NOT NULL REFERENCES experiences (id) ON DELETE CASCADE,
  tag_id TEXT NOT NULL REFERENCES tags (id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (experience_id, tag_id)
);

CREATE TABLE IF NOT EXISTS article_tags (
  article_id TEXT NOT NULL REFERENCES articles (id) ON DELETE CASCADE,
  tag_id TEXT NOT NULL REFERENCES tags (id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (article_id, tag_id)
);

CREATE TABLE IF NOT EXISTS event_tags (
  event_id TEXT NOT NULL REFERENCES events (id) ON DELETE CASCADE,
  tag_id TEXT NOT NULL REFERENCES tags (id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (event_id, tag_id)
);

CREATE TABLE IF NOT EXISTS article_venues (
  article_id TEXT NOT NULL REFERENCES articles (id) ON DELETE CASCADE,
  venue_id TEXT NOT NULL REFERENCES venues (id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (article_id, venue_id)
);

CREATE TABLE IF NOT EXISTS article_places (
  article_id TEXT NOT NULL REFERENCES articles (id) ON DELETE CASCADE,
  place_id TEXT NOT NULL REFERENCES places (id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (article_id, place_id)
);

CREATE TABLE IF NOT EXISTS article_experiences (
  article_id TEXT NOT NULL REFERENCES articles (id) ON DELETE CASCADE,
  experience_id TEXT NOT NULL REFERENCES experiences (id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (article_id, experience_id)
);

CREATE TABLE IF NOT EXISTS experience_venues (
  experience_id TEXT NOT NULL REFERENCES experiences (id) ON DELETE CASCADE,
  venue_id TEXT NOT NULL REFERENCES venues (id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (experience_id, venue_id)
);

CREATE TABLE IF NOT EXISTS event_venues (
  event_id TEXT NOT NULL REFERENCES events (id) ON DELETE CASCADE,
  venue_id TEXT NOT NULL REFERENCES venues (id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (event_id, venue_id)
);

CREATE INDEX IF NOT EXISTS venues_slug_idx ON venues (slug);
CREATE INDEX IF NOT EXISTS venues_destination_idx ON venues (destination);
CREATE INDEX IF NOT EXISTS venues_area_idx ON venues (area);
CREATE INDEX IF NOT EXISTS venues_category_idx ON venues (category);
CREATE INDEX IF NOT EXISTS venues_featured_idx ON venues (featured);
CREATE INDEX IF NOT EXISTS venues_priority_score_idx ON venues (priority_score DESC);
CREATE INDEX IF NOT EXISTS venues_pass_partner_idx ON venues (pass_partner);
CREATE INDEX IF NOT EXISTS venues_circle_partner_idx ON venues (circle_partner);
CREATE INDEX IF NOT EXISTS venues_search_idx ON venues USING GIN (
  to_tsvector('simple', COALESCE(name, '') || ' ' || COALESCE(short_description, '') || ' ' || COALESCE(long_description, '') || ' ' || COALESCE(area, '') || ' ' || COALESCE(destination, ''))
);

CREATE INDEX IF NOT EXISTS places_slug_idx ON places (slug);
CREATE INDEX IF NOT EXISTS places_destination_idx ON places (destination);
CREATE INDEX IF NOT EXISTS places_area_idx ON places (area);
CREATE INDEX IF NOT EXISTS places_category_idx ON places (category);
CREATE INDEX IF NOT EXISTS places_featured_idx ON places (featured);
CREATE INDEX IF NOT EXISTS places_priority_score_idx ON places (priority_score DESC);
CREATE INDEX IF NOT EXISTS places_search_idx ON places USING GIN (
  to_tsvector('simple', COALESCE(name, '') || ' ' || COALESCE(description, '') || ' ' || COALESCE(area, '') || ' ' || COALESCE(destination, ''))
);

CREATE INDEX IF NOT EXISTS experiences_slug_idx ON experiences (slug);
CREATE INDEX IF NOT EXISTS experiences_destination_idx ON experiences (destination);
CREATE INDEX IF NOT EXISTS experiences_area_idx ON experiences (area);
CREATE INDEX IF NOT EXISTS experiences_category_idx ON experiences (category);
CREATE INDEX IF NOT EXISTS experiences_featured_idx ON experiences (featured);
CREATE INDEX IF NOT EXISTS experiences_bookable_idx ON experiences (bookable);
CREATE INDEX IF NOT EXISTS experiences_priority_score_idx ON experiences (priority_score DESC);
CREATE INDEX IF NOT EXISTS experiences_search_idx ON experiences USING GIN (
  to_tsvector('simple', COALESCE(name, '') || ' ' || COALESCE(description, '') || ' ' || COALESCE(area, '') || ' ' || COALESCE(destination, ''))
);

CREATE INDEX IF NOT EXISTS articles_slug_idx ON articles (slug);
CREATE INDEX IF NOT EXISTS articles_category_idx ON articles (category);
CREATE INDEX IF NOT EXISTS articles_published_idx ON articles (published);
CREATE INDEX IF NOT EXISTS articles_featured_idx ON articles (featured);
CREATE INDEX IF NOT EXISTS articles_priority_score_idx ON articles (priority_score DESC);
CREATE INDEX IF NOT EXISTS articles_published_at_idx ON articles (published_at DESC);
CREATE INDEX IF NOT EXISTS articles_search_idx ON articles USING GIN (
  to_tsvector('simple', COALESCE(title, '') || ' ' || COALESCE(excerpt, '') || ' ' || COALESCE(category, '') || ' ' || COALESCE(author, ''))
);

CREATE INDEX IF NOT EXISTS events_slug_idx ON events (slug);
CREATE INDEX IF NOT EXISTS events_destination_idx ON events (destination);
CREATE INDEX IF NOT EXISTS events_area_idx ON events (area);
CREATE INDEX IF NOT EXISTS events_category_idx ON events (category);
CREATE INDEX IF NOT EXISTS events_featured_idx ON events (featured);
CREATE INDEX IF NOT EXISTS events_priority_score_idx ON events (priority_score DESC);
CREATE INDEX IF NOT EXISTS events_start_datetime_idx ON events (start_datetime);
CREATE INDEX IF NOT EXISTS events_venue_id_idx ON events (venue_id);
CREATE INDEX IF NOT EXISTS events_search_idx ON events USING GIN (
  to_tsvector('simple', COALESCE(title, '') || ' ' || COALESCE(description, '') || ' ' || COALESCE(area, '') || ' ' || COALESCE(destination, ''))
);

CREATE INDEX IF NOT EXISTS tags_slug_idx ON tags (slug);
CREATE INDEX IF NOT EXISTS tags_tag_type_idx ON tags (tag_type);

CREATE INDEX IF NOT EXISTS venue_tags_tag_id_idx ON venue_tags (tag_id);
CREATE INDEX IF NOT EXISTS place_tags_tag_id_idx ON place_tags (tag_id);
CREATE INDEX IF NOT EXISTS experience_tags_tag_id_idx ON experience_tags (tag_id);
CREATE INDEX IF NOT EXISTS article_tags_tag_id_idx ON article_tags (tag_id);
CREATE INDEX IF NOT EXISTS event_tags_tag_id_idx ON event_tags (tag_id);

CREATE INDEX IF NOT EXISTS article_venues_venue_id_idx ON article_venues (venue_id);
CREATE INDEX IF NOT EXISTS article_places_place_id_idx ON article_places (place_id);
CREATE INDEX IF NOT EXISTS article_experiences_experience_id_idx ON article_experiences (experience_id);
CREATE INDEX IF NOT EXISTS experience_venues_venue_id_idx ON experience_venues (venue_id);
CREATE INDEX IF NOT EXISTS event_venues_venue_id_idx ON event_venues (venue_id);

DROP TRIGGER IF EXISTS venues_set_updated_at ON venues;
CREATE TRIGGER venues_set_updated_at
  BEFORE UPDATE ON venues
  FOR EACH ROW
  EXECUTE FUNCTION set_destination_content_updated_at();

DROP TRIGGER IF EXISTS places_set_updated_at ON places;
CREATE TRIGGER places_set_updated_at
  BEFORE UPDATE ON places
  FOR EACH ROW
  EXECUTE FUNCTION set_destination_content_updated_at();

DROP TRIGGER IF EXISTS experiences_set_updated_at ON experiences;
CREATE TRIGGER experiences_set_updated_at
  BEFORE UPDATE ON experiences
  FOR EACH ROW
  EXECUTE FUNCTION set_destination_content_updated_at();

DROP TRIGGER IF EXISTS articles_set_updated_at ON articles;
CREATE TRIGGER articles_set_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION set_destination_content_updated_at();

DROP TRIGGER IF EXISTS events_set_updated_at ON events;
CREATE TRIGGER events_set_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION set_destination_content_updated_at();

DROP TRIGGER IF EXISTS tags_set_updated_at ON tags;
CREATE TRIGGER tags_set_updated_at
  BEFORE UPDATE ON tags
  FOR EACH ROW
  EXECUTE FUNCTION set_destination_content_updated_at();
