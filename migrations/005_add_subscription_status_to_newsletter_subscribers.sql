ALTER TABLE newsletter_subscribers
ADD COLUMN IF NOT EXISTS subscription_status BOOLEAN NOT NULL DEFAULT TRUE;

UPDATE newsletter_subscribers
SET subscription_status = TRUE
WHERE subscription_status IS DISTINCT FROM TRUE;