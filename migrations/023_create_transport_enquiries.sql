CREATE TABLE IF NOT EXISTS transport_enquiries (
  id BIGSERIAL PRIMARY KEY,
  service_type TEXT NOT NULL,
  journey_date DATE NOT NULL,
  pickup_location TEXT,
  destination TEXT,
  passengers INTEGER NOT NULL DEFAULT 1 CHECK (passengers > 0),
  rental_days INTEGER CHECK (rental_days IS NULL OR rental_days > 0),
  guest_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  notes TEXT,
  source TEXT NOT NULL DEFAULT 'transport-page',
  status TEXT NOT NULL DEFAULT 'new',
  notification_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transport_enquiries_status_created_at
  ON transport_enquiries (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_transport_enquiries_email
  ON transport_enquiries (LOWER(email));