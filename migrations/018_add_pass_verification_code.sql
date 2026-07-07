ALTER TABLE passes
  ADD COLUMN IF NOT EXISTS pass_verification_code TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS passes_pass_verification_code_uidx
  ON passes (LOWER(pass_verification_code))
  WHERE pass_verification_code IS NOT NULL;

CREATE INDEX IF NOT EXISTS passes_pass_verification_code_idx
  ON passes (pass_verification_code)
  WHERE pass_verification_code IS NOT NULL;
