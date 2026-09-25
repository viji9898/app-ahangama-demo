ALTER TABLE venues260414
  ADD COLUMN IF NOT EXISTS website TEXT,
  ADD COLUMN IF NOT EXISTS ownership TEXT;

CREATE TABLE IF NOT EXISTS guide_venue_placements (
  id BIGSERIAL PRIMARY KEY,
  guide_key TEXT NOT NULL DEFAULT 'ahangama-guide',
  venue_id TEXT NOT NULL REFERENCES venues260414(id) ON DELETE CASCADE,
  section TEXT NOT NULL,
  priority_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  name_override TEXT,
  tagline TEXT,
  description_override TEXT,
  image_override TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT guide_venue_placements_status_check
    CHECK (status IN ('active', 'draft', 'archived')),
  CONSTRAINT guide_venue_placements_unique
    UNIQUE (guide_key, venue_id, section)
);

CREATE INDEX IF NOT EXISTS idx_guide_venue_placements_lookup
  ON guide_venue_placements (guide_key, status, section, priority_order);

CREATE TABLE IF NOT EXISTS guide_content (
  section_key TEXT PRIMARY KEY,
  title TEXT,
  body TEXT,
  image TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO guide_content (section_key, title, body) VALUES
  ('overview', 'Overview', 'Ahangama is a laid-back coastal town on Sri Lanka''s southern surf belt, home to world-class waves, tropical cafes, and a growing community of creatives, surfers, and slow-livers.'),
  ('best_season', 'Best Season', 'The undisputed prime time to visit is late October through April. During these months, the weather is hot and sunny, rainfall is minimal, and the ocean is calm and glassy.'),
  ('how_long', 'How Long Do People Usually Stay?', 'Vacationers typically carve out 5 to 10 days to soak up the surf and food scene. Digital nomads and slow-travelers frequently extend their stays to 1 to 3 months.'),
  ('transport_getting_here', 'Getting Here', 'Ahangama is around a 2 to 3 hour drive from Bandaranaike International Airport, depending on traffic and your exact destination.'),
  ('transport_getting_around', 'Getting Around', 'Renting a scooter is one of the easiest ways to explore Ahangama and the surrounding coast. Local tuk-tuks are also widely available for shorter journeys.'),
  ('surf_schools', 'Surf Schools', 'Ahangama is surrounded by beginner and intermediate surf breaks, with local schools offering coaching and equipment.')
ON CONFLICT (section_key) DO NOTHING;