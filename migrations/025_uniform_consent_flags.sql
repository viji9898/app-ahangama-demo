DO $$
DECLARE
  target_table TEXT;
BEGIN
  FOREACH target_table IN ARRAY ARRAY[
    'circle',
    'guest_pass',
    'pass_guests',
    'hospo_pass_profile',
    'hospo_pass_profiles'
  ]
  LOOP
    IF to_regclass(target_table) IS NULL THEN
      CONTINUE;
    END IF;

    EXECUTE format(
      'ALTER TABLE %I ADD COLUMN IF NOT EXISTS whatsapp_opt_in BOOLEAN NOT NULL DEFAULT TRUE',
      target_table
    );
    EXECUTE format(
      'ALTER TABLE %I ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN NOT NULL DEFAULT TRUE',
      target_table
    );
    EXECUTE format(
      'ALTER TABLE %I ALTER COLUMN whatsapp_opt_in SET DEFAULT TRUE',
      target_table
    );
    EXECUTE format(
      'ALTER TABLE %I ALTER COLUMN marketing_consent SET DEFAULT TRUE',
      target_table
    );
    EXECUTE format(
      'UPDATE %I SET whatsapp_opt_in = TRUE, marketing_consent = TRUE',
      target_table
    );
  END LOOP;
END $$;