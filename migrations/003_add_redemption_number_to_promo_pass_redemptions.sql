ALTER TABLE promo_pass_redemptions
  ADD COLUMN IF NOT EXISTS redemption_number TEXT;

WITH ranked AS (
  SELECT
    id,
    COALESCE(
      NULLIF(
        CASE
          WHEN regexp_replace(
            lower(COALESCE(venue_name, '')),
            '[^a-z0-9]+',
            '',
            'g'
          ) <> ''
            AND regexp_replace(
              regexp_replace(lower(COALESCE(venue_name, '')), '(?:\s+ag|\s+ahangama)$', ''),
              '[^a-z0-9]+',
              '',
              'g'
            ) <> regexp_replace(
              regexp_replace(lower(COALESCE(venue_slug, '')), '(?:-ag|-ahangama)$', ''),
              '[^a-z0-9]+',
              '',
              'g'
            )
          THEN regexp_replace(
            regexp_replace(lower(COALESCE(venue_name, '')), '(?:\s+ag|\s+ahangama)$', ''),
            '[^a-z0-9]+',
            '',
            'g'
          )
          ELSE regexp_replace(
            regexp_replace(lower(COALESCE(venue_slug, '')), '(?:-ag|-ahangama)$', ''),
            '[^a-z0-9]+',
            '',
            'g'
          )
        END,
        ''
      ),
      'redemption'
    ) AS prefix,
    ROW_NUMBER() OVER (
      PARTITION BY venue_slug
      ORDER BY redeemed_at, created_at, id
    ) AS sequence_number
  FROM promo_pass_redemptions
  WHERE COALESCE(redemption_number, '') = ''
)
UPDATE promo_pass_redemptions AS target
SET redemption_number = ranked.prefix || LPAD(ranked.sequence_number::text, 4, '0')
FROM ranked
WHERE target.id = ranked.id;

CREATE UNIQUE INDEX IF NOT EXISTS promo_pass_redemptions_redemption_number_idx
  ON promo_pass_redemptions (redemption_number)
  WHERE redemption_number IS NOT NULL;