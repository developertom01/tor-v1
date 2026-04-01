-- =============================================
-- Tor Platform — Seed Data (local dev only)
-- =============================================
-- Used by `supabase db reset` for local development.
-- For CI provisioning, use: node scripts/seed-store.mjs <store-slug>
-- which reads from supabase/seeds/<store>.json

-- Stores
INSERT INTO public.stores (id, display_name, domain) VALUES
  ('hairlukgud',   'Hair Luk Gud GH', 'hairlukgud.com'),
  ('hairfordays',  'Hair For Days',   'hairfordays.store'),
  ('aseesthreads', 'Asse''s Threads', 'aseesthreads.store')
ON CONFLICT (id) DO NOTHING;

-- Store settings (one row per store, settings jsonb)
INSERT INTO public.store_settings (store_id, settings) VALUES
  ('hairlukgud',   '{"bypass_payment": true, "online_payments_enabled": false}'),
  ('hairfordays',  '{"bypass_payment": true, "online_payments_enabled": false}'),
  ('aseesthreads', '{"bypass_payment": true, "online_payments_enabled": false}')
ON CONFLICT (store_id) DO NOTHING;
