CREATE TABLE IF NOT EXISTS stay_enquiries (
  id BIGSERIAL PRIMARY KEY,
  property_slug TEXT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  adults INTEGER NOT NULL DEFAULT 2 CHECK (adults > 0),
  children INTEGER NOT NULL DEFAULT 0 CHECK (children >= 0),
  budget TEXT,
  guest_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  notes TEXT,
  source TEXT NOT NULL DEFAULT 'stays-editorial',
  status TEXT NOT NULL DEFAULT 'new',
  notification_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT stay_enquiries_valid_dates CHECK (check_out > check_in)
);

CREATE INDEX IF NOT EXISTS idx_stay_enquiries_status_created_at
  ON stay_enquiries (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_stay_enquiries_email
  ON stay_enquiries (LOWER(email));