-- =============================================
-- Tor Platform — Seed Data (local dev only)
-- =============================================
-- Used by `supabase db reset` for local development.
-- For CI provisioning, use: node scripts/seed-store.mjs <store-slug>
-- which reads from supabase/seeds/<store>.json

-- Stores
INSERT INTO public.stores (id, display_name, domain) VALUES
  ('hairlukgud', 'Hair Luk Gud GH', 'hairlukgud.com'),
  ('hairfordays', 'Hair For Days', 'hairfordays.com')
ON CONFLICT (id) DO NOTHING;

-- Store settings
INSERT INTO public.store_settings (store_id, bypass_payment, online_payments_enabled) VALUES
  ('hairlukgud', false, true),
  ('hairfordays', false, true)
ON CONFLICT (store_id) DO NOTHING;
