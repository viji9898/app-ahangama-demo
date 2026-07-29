CREATE TABLE IF NOT EXISTS retreat_enquiries (
  id BIGSERIAL PRIMARY KEY,
  preferred_venue TEXT NOT NULL DEFAULT 'help-me-choose',
  retreat_style TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  expected_guests INTEGER NOT NULL CHECK (expected_guests > 0),
  organiser_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  notes TEXT,
  source TEXT NOT NULL DEFAULT 'host-a-retreat',
  status TEXT NOT NULL DEFAULT 'new',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  notification_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT retreat_enquiries_valid_dates CHECK (end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS idx_retreat_enquiries_unread_created_at
  ON retreat_enquiries (is_read, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_retreat_enquiries_status_created_at
  ON retreat_enquiries (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_retreat_enquiries_email
  ON retreat_enquiries (LOWER(email));