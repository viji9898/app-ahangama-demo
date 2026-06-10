CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS guest_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID NOT NULL REFERENCES pass_guests (id) ON DELETE CASCADE,
  pass_id UUID NOT NULL REFERENCES passes (id) ON DELETE CASCADE,
  stay_length INTEGER,
  interests TEXT[] NOT NULL DEFAULT '{}',
  services_interested TEXT[] NOT NULL DEFAULT '{}',
  wants_whatsapp_recommendations BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT guest_preferences_pass_id_unique UNIQUE (pass_id)
);

CREATE INDEX IF NOT EXISTS guest_preferences_guest_id_idx
  ON guest_preferences (guest_id);

CREATE INDEX IF NOT EXISTS guest_preferences_pass_id_idx
  ON guest_preferences (pass_id);

CREATE INDEX IF NOT EXISTS guest_preferences_created_at_idx
  ON guest_preferences (created_at DESC);