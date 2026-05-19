CREATE TABLE IF NOT EXISTS promo_pass_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pass_id TEXT NOT NULL,
  venue_slug TEXT NOT NULL,
  venue_name TEXT,
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  redemption_type TEXT,
  offer_used TEXT,
  redeemed_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT promo_pass_redemptions_pass_venue_unique UNIQUE (pass_id, venue_slug),
  CONSTRAINT promo_pass_redemptions_pass_id_fk
    FOREIGN KEY (pass_id) REFERENCES promo_purchases(pass_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS promo_pass_redemptions_pass_id_idx
  ON promo_pass_redemptions (pass_id);

CREATE INDEX IF NOT EXISTS promo_pass_redemptions_venue_slug_idx
  ON promo_pass_redemptions (venue_slug);
