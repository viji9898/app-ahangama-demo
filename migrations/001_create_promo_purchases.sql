CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS promo_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id TEXT NOT NULL UNIQUE,
  stripe_payment_intent_id TEXT,
  stripe_customer_id TEXT,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_description TEXT,
  flow_type TEXT NOT NULL DEFAULT 'promo',
  promo_code TEXT,
  venue_slug TEXT,
  cta_location TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  list_price_usd NUMERIC(10, 2) NOT NULL,
  discount_usd NUMERIC(10, 2) NOT NULL DEFAULT 0,
  charged_price_usd NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  start_date TIMESTAMPTZ,
  expiry_date TIMESTAMPTZ,
  validity_days INTEGER,
  max_people INTEGER,
  pass_id TEXT NOT NULL UNIQUE,
  pass_url TEXT NOT NULL,
  passkit_pass_id TEXT,
  passkit_url TEXT,
  fulfillment_status TEXT NOT NULL DEFAULT 'checkout_created',
  customer_email_status TEXT NOT NULL DEFAULT 'pending',
  venue_email_status TEXT NOT NULL DEFAULT 'pending',
  team_email_status TEXT NOT NULL DEFAULT 'pending',
  customer_email_sent_at TIMESTAMPTZ,
  venue_email_sent_at TIMESTAMPTZ,
  team_email_sent_at TIMESTAMPTZ,
  stripe_receipt_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS promo_purchases_pass_id_idx
  ON promo_purchases (pass_id);

CREATE INDEX IF NOT EXISTS promo_purchases_customer_email_idx
  ON promo_purchases (customer_email);

CREATE INDEX IF NOT EXISTS promo_purchases_created_at_idx
  ON promo_purchases (created_at DESC);