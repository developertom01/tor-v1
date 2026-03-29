-- Per-store email verification

alter table public.profiles
  add column email_verified boolean not null default false;

-- Existing admins and Google OAuth users are pre-verified
update public.profiles
  set email_verified = true
  where role = 'admin'
     or hashed_password is null; -- Google OAuth users

create table public.email_verification_tokens (
  token       text primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  store_id    text not null,
  expires_at  timestamptz not null default (now() + interval '24 hours'),
  created_at  timestamptz not null default now()
);

alter table public.email_verification_tokens enable row level security;
create policy "No direct access" on public.email_verification_tokens for all using (false);

create table public.password_reset_tokens (
  token       text primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  store_id    text not null,
  expires_at  timestamptz not null default (now() + interval '1 hour'),
  created_at  timestamptz not null default now()
);

alter table public.password_reset_tokens enable row level security;
create policy "No direct access" on public.password_reset_tokens for all using (false);
