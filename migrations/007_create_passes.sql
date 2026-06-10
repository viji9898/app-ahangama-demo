CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID NOT NULL REFERENCES pass_guests (id) ON DELETE CASCADE,
  source_hotel_slug TEXT,
  pass_type TEXT NOT NULL DEFAULT 'complimentary_hotel_guest',
  status TEXT NOT NULL DEFAULT 'active',
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  -- Populated after the PassKit member/pass has been created.
  passkit_program_id TEXT,
  -- Populated after the PassKit member/pass has been created.
  passkit_member_id TEXT,
  -- Populated after the PassKit member/pass has been created.
  passkit_external_id TEXT,
  -- Populated after the PassKit member/pass has been created.
  passkit_pass_url TEXT,
  -- Populated after the PassKit member/pass has been created.
  passkit_install_url TEXT,
  -- Populated after the PassKit member/pass has been created.
  passkit_status TEXT,
  apple_wallet_installed BOOLEAN NOT NULL DEFAULT FALSE,
  google_wallet_installed BOOLEAN NOT NULL DEFAULT FALSE,
  last_passkit_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS passes_passkit_member_id_uidx
  ON passes (passkit_member_id)
  WHERE passkit_member_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS passes_passkit_external_id_uidx
  ON passes (passkit_external_id)
  WHERE passkit_external_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS passes_guest_id_idx
  ON passes (guest_id);

CREATE INDEX IF NOT EXISTS passes_source_hotel_slug_idx
  ON passes (source_hotel_slug);

CREATE INDEX IF NOT EXISTS passes_created_at_idx
  ON passes (created_at DESC);