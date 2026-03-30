-- Replace store_settings columns with a single settings jsonb column.
-- Keeps the store_settings table and its RLS policies intact.

-- 1. Drop old columns
ALTER TABLE public.store_settings
  DROP COLUMN IF EXISTS bypass_payment,
  DROP COLUMN IF EXISTS online_payments_enabled,
  DROP COLUMN IF EXISTS updated_at;

-- 2. Add settings jsonb (no hardcoded defaults — values seeded by seed-store.mjs / seed.sql)
ALTER TABLE public.store_settings
  ADD COLUMN IF NOT EXISTS settings jsonb NOT NULL DEFAULT '{}'::jsonb;

-- 3. Remove settings from stores if it was added by a previous migration attempt
ALTER TABLE public.stores
  DROP COLUMN IF EXISTS settings;
