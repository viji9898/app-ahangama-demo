ALTER TABLE hospo_pass_profiles
  ADD COLUMN IF NOT EXISTS pass_context TEXT NOT NULL DEFAULT 'hospo';

UPDATE hospo_pass_profiles
SET pass_context = 'hospo'
WHERE pass_context IS NULL OR pass_context = '';

CREATE INDEX IF NOT EXISTS hospo_pass_profiles_pass_context_idx
  ON hospo_pass_profiles (pass_context);