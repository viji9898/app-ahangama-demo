CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS pass_guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  normalized_email TEXT,
  phone TEXT,
  country TEXT,
  whatsapp_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
  marketing_consent BOOLEAN NOT NULL DEFAULT FALSE,
  source_hotel_slug TEXT,
  destination TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS pass_guests_email_idx
  ON pass_guests (email);

CREATE INDEX IF NOT EXISTS pass_guests_normalized_email_idx
  ON pass_guests (normalized_email);

CREATE UNIQUE INDEX IF NOT EXISTS pass_guests_hotel_destination_email_uidx
  ON pass_guests (normalized_email, source_hotel_slug, destination)
  WHERE normalized_email IS NOT NULL
    AND source_hotel_slug IS NOT NULL
    AND destination IS NOT NULL;

CREATE INDEX IF NOT EXISTS pass_guests_source_hotel_slug_idx
  ON pass_guests (source_hotel_slug);

CREATE INDEX IF NOT EXISTS pass_guests_destination_idx
  ON pass_guests (destination);

CREATE INDEX IF NOT EXISTS pass_guests_created_at_idx
  ON pass_guests (created_at DESC);