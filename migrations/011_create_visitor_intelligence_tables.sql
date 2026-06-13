CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS guest_content_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID REFERENCES pass_guests (id) ON DELETE CASCADE,
  pass_id UUID REFERENCES passes (id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  content_id TEXT NOT NULL,
  source TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT guest_content_history_content_type_check
    CHECK (content_type IN ('venue', 'article', 'offer', 'experience'))
);

CREATE INDEX IF NOT EXISTS guest_content_history_guest_id_idx
  ON guest_content_history (guest_id);

CREATE INDEX IF NOT EXISTS guest_content_history_content_type_idx
  ON guest_content_history (content_type);

CREATE INDEX IF NOT EXISTS guest_content_history_content_id_idx
  ON guest_content_history (content_id);

CREATE INDEX IF NOT EXISTS guest_content_history_guest_content_idx
  ON guest_content_history (guest_id, content_type, content_id);

CREATE TABLE IF NOT EXISTS venue_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID REFERENCES pass_guests (id) ON DELETE SET NULL,
  pass_id UUID REFERENCES passes (id) ON DELETE SET NULL,
  venue_id TEXT NOT NULL,
  source TEXT,
  interaction_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT venue_interactions_interaction_type_check
    CHECK (interaction_type IN (
      'venue_view',
      'venue_click',
      'article_view',
      'article_click',
      'directions_click',
      'instagram_click',
      'website_click',
      'offer_view',
      'offer_click',
      'redemption'
    ))
);

CREATE INDEX IF NOT EXISTS venue_interactions_guest_id_idx
  ON venue_interactions (guest_id);

CREATE INDEX IF NOT EXISTS venue_interactions_pass_id_idx
  ON venue_interactions (pass_id);

CREATE INDEX IF NOT EXISTS venue_interactions_venue_id_idx
  ON venue_interactions (venue_id);

CREATE INDEX IF NOT EXISTS venue_interactions_type_idx
  ON venue_interactions (interaction_type);

CREATE INDEX IF NOT EXISTS venue_interactions_created_at_idx
  ON venue_interactions (created_at DESC);

CREATE TABLE IF NOT EXISTS article_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID REFERENCES pass_guests (id) ON DELETE SET NULL,
  pass_id UUID REFERENCES passes (id) ON DELETE SET NULL,
  article_id TEXT NOT NULL,
  source TEXT,
  interaction_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT article_interactions_interaction_type_check
    CHECK (interaction_type IN ('view', 'click', 'share'))
);

CREATE INDEX IF NOT EXISTS article_interactions_guest_id_idx
  ON article_interactions (guest_id);

CREATE INDEX IF NOT EXISTS article_interactions_pass_id_idx
  ON article_interactions (pass_id);

CREATE INDEX IF NOT EXISTS article_interactions_article_id_idx
  ON article_interactions (article_id);

CREATE INDEX IF NOT EXISTS article_interactions_type_idx
  ON article_interactions (interaction_type);

CREATE INDEX IF NOT EXISTS article_interactions_created_at_idx
  ON article_interactions (created_at DESC);

CREATE TABLE IF NOT EXISTS experience_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID REFERENCES pass_guests (id) ON DELETE SET NULL,
  pass_id UUID REFERENCES passes (id) ON DELETE SET NULL,
  experience_id TEXT NOT NULL,
  source TEXT,
  interaction_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT experience_interactions_interaction_type_check
    CHECK (interaction_type IN ('view', 'click', 'enquiry', 'booking'))
);

CREATE INDEX IF NOT EXISTS experience_interactions_guest_id_idx
  ON experience_interactions (guest_id);

CREATE INDEX IF NOT EXISTS experience_interactions_pass_id_idx
  ON experience_interactions (pass_id);

CREATE INDEX IF NOT EXISTS experience_interactions_experience_id_idx
  ON experience_interactions (experience_id);

CREATE INDEX IF NOT EXISTS experience_interactions_type_idx
  ON experience_interactions (interaction_type);

CREATE INDEX IF NOT EXISTS experience_interactions_created_at_idx
  ON experience_interactions (created_at DESC);

CREATE TABLE IF NOT EXISTS booking_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID REFERENCES pass_guests (id) ON DELETE SET NULL,
  pass_id UUID REFERENCES passes (id) ON DELETE SET NULL,
  service_type TEXT NOT NULL,
  request_status TEXT NOT NULL DEFAULT 'interested',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT booking_requests_request_status_check
    CHECK (request_status IN (
      'interested',
      'contacted',
      'quoted',
      'booked',
      'completed',
      'cancelled'
    ))
);

CREATE INDEX IF NOT EXISTS booking_requests_guest_id_idx
  ON booking_requests (guest_id);

CREATE INDEX IF NOT EXISTS booking_requests_pass_id_idx
  ON booking_requests (pass_id);

CREATE INDEX IF NOT EXISTS booking_requests_service_type_idx
  ON booking_requests (service_type);

CREATE INDEX IF NOT EXISTS booking_requests_status_idx
  ON booking_requests (request_status);
CREATE INDEX IF NOT EXISTS booking_requests_created_at_idx
  ON booking_requests (created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS booking_requests_initial_interest_uidx
  ON booking_requests (guest_id, pass_id, service_type)
  WHERE request_status = 'interested';

INSERT INTO booking_requests (
  guest_id,
  pass_id,
  service_type,
  request_status,
  notes,
  updated_at
)
SELECT
  guest_preferences.guest_id,
  guest_preferences.pass_id,
  BTRIM(
    REGEXP_REPLACE(
      LOWER(REPLACE(booking_interest.service_type, '&', 'and')),
      '[^a-z0-9]+',
      '-',
      'g'
    ),
    '-'
  ) AS service_type,
  'interested',
  'Backfilled from guest preferences',
  NOW()
FROM guest_preferences
CROSS JOIN LATERAL UNNEST(guest_preferences.services_interested)
  AS booking_interest(service_type)
WHERE booking_interest.service_type IS NOT NULL
  AND booking_interest.service_type <> ''
ON CONFLICT (guest_id, pass_id, service_type)
  WHERE request_status = 'interested'
DO NOTHING;

CREATE TABLE IF NOT EXISTS pass_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID REFERENCES pass_guests (id) ON DELETE SET NULL,
  pass_id UUID REFERENCES passes (id) ON DELETE SET NULL,
  venue_id TEXT,
  offer_id TEXT,
  redeemed_at TIMESTAMPTZ,
  redemption_value NUMERIC,
  status TEXT NOT NULL DEFAULT 'redeemed',
  CONSTRAINT pass_redemptions_status_check
    CHECK (status IN ('redeemed', 'cancelled'))
);

CREATE INDEX IF NOT EXISTS pass_redemptions_guest_id_idx
  ON pass_redemptions (guest_id);

CREATE INDEX IF NOT EXISTS pass_redemptions_pass_id_idx
  ON pass_redemptions (pass_id);

CREATE INDEX IF NOT EXISTS pass_redemptions_venue_id_idx
  ON pass_redemptions (venue_id);

CREATE INDEX IF NOT EXISTS pass_redemptions_offer_id_idx
  ON pass_redemptions (offer_id);

CREATE INDEX IF NOT EXISTS pass_redemptions_redeemed_at_idx
  ON pass_redemptions (redeemed_at DESC);

CREATE TABLE IF NOT EXISTS daily_intelligence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination TEXT NOT NULL,
  headline TEXT,
  weather_summary TEXT,
  temperature INTEGER,
  sunset_time TEXT,
  surf_conditions TEXT,
  editor_note TEXT,
  local_note TEXT,
  featured_events JSONB,
  featured_articles JSONB,
  featured_venues JSONB,
  featured_experiences JSONB,
  featured_offers JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS daily_intelligence_destination_idx
  ON daily_intelligence (destination);

CREATE INDEX IF NOT EXISTS daily_intelligence_created_at_idx
  ON daily_intelligence (created_at DESC);

CREATE TABLE IF NOT EXISTS guest_email_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID REFERENCES pass_guests (id) ON DELETE CASCADE,
  pass_id UUID REFERENCES passes (id) ON DELETE CASCADE,
  email_type TEXT NOT NULL,
  daily_intelligence_id UUID REFERENCES daily_intelligence (id) ON DELETE SET NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  opened BOOLEAN NOT NULL DEFAULT FALSE,
  clicked BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS guest_email_history_guest_id_idx
  ON guest_email_history (guest_id);

CREATE INDEX IF NOT EXISTS guest_email_history_pass_id_idx
  ON guest_email_history (pass_id);

CREATE INDEX IF NOT EXISTS guest_email_history_email_type_idx
  ON guest_email_history (email_type);

CREATE INDEX IF NOT EXISTS guest_email_history_sent_at_idx
  ON guest_email_history (sent_at DESC);