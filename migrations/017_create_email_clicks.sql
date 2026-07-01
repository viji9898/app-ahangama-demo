CREATE TABLE IF NOT EXISTS email_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID REFERENCES pass_guests (id) ON DELETE SET NULL,
  email_id UUID REFERENCES guest_email_history (id) ON DELETE SET NULL,
  venue_slug TEXT,
  cta TEXT,
  campaign TEXT,
  source TEXT,
  medium TEXT,
  content TEXT,
  destination_url TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS email_clicks_guest_id_idx
  ON email_clicks (guest_id);

CREATE INDEX IF NOT EXISTS email_clicks_email_id_idx
  ON email_clicks (email_id);

CREATE INDEX IF NOT EXISTS email_clicks_venue_slug_idx
  ON email_clicks (venue_slug);

CREATE INDEX IF NOT EXISTS email_clicks_campaign_idx
  ON email_clicks (campaign);

CREATE INDEX IF NOT EXISTS email_clicks_clicked_at_idx
  ON email_clicks (clicked_at DESC);
