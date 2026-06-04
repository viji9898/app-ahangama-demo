CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT NOT NULL UNIQUE,
  subscription_status BOOLEAN NOT NULL DEFAULT TRUE,
  audience_type TEXT,
  interests TEXT[] NOT NULL DEFAULT '{}',
  source TEXT,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS newsletter_subscribers_subscribed_at_idx
  ON newsletter_subscribers (subscribed_at DESC);

CREATE INDEX IF NOT EXISTS newsletter_subscribers_source_idx
  ON newsletter_subscribers (source);