CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS hospo_pass_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pass_id UUID NOT NULL REFERENCES passes (id) ON DELETE CASCADE,
  guest_id UUID REFERENCES pass_guests (id) ON DELETE SET NULL,
  full_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  source_hotel_slug TEXT,
  audience_type TEXT NOT NULL,
  business_name TEXT,
  business_category TEXT,
  business_location TEXT,
  resident_area TEXT,
  resident_connection TEXT,
  stay_length TEXT,
  travel_group TEXT,
  interests TEXT[] NOT NULL DEFAULT '{}',
  goals TEXT[] NOT NULL DEFAULT '{}',
  whatsapp_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
  wants_partner_updates BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT hospo_pass_profiles_pass_id_unique UNIQUE (pass_id)
);

CREATE INDEX IF NOT EXISTS hospo_pass_profiles_guest_id_idx
  ON hospo_pass_profiles (guest_id);

CREATE INDEX IF NOT EXISTS hospo_pass_profiles_email_idx
  ON hospo_pass_profiles (email);

CREATE INDEX IF NOT EXISTS hospo_pass_profiles_source_hotel_slug_idx
  ON hospo_pass_profiles (source_hotel_slug);

CREATE INDEX IF NOT EXISTS hospo_pass_profiles_audience_type_idx
  ON hospo_pass_profiles (audience_type);

CREATE INDEX IF NOT EXISTS hospo_pass_profiles_submitted_at_idx
  ON hospo_pass_profiles (submitted_at DESC);