-- =============================================
-- Per-store auth: user_credentials + hashed_password
-- =============================================

-- 1. Global credentials table (one row per auth.users row)
--    Stores AES-encrypted global password used to create Supabase sessions.
create table public.user_credentials (
  user_id uuid primary key references auth.users(id) on delete cascade,
  encrypted_password text not null,
  created_at timestamptz not null default now()
);

alter table public.user_credentials enable row level security;

-- Only accessible via service role (admin client) — no user-facing RLS needed
create policy "No direct access"
  on public.user_credentials for all using (false);

-- 2. Add per-store hashed password to profiles
alter table public.profiles
  add column hashed_password text;

-- NULL is allowed: Google OAuth users will never have a hashed_password
