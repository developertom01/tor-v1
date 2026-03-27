-- Allow admins to disable online payments entirely.
-- When disabled, bypass_payment is automatically enabled.

ALTER TABLE store_settings
  ADD COLUMN IF NOT EXISTS online_payments_enabled boolean NOT NULL DEFAULT true;
