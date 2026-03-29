-- Form drafts: persist multi-step form state server-side across page refreshes
-- Session created on start, restored on reload, closed on submit.
-- Stale drafts (not touched in 1 hour) are purged by pg_cron.

create table public.form_drafts (
  id          uuid        primary key default gen_random_uuid(),
  store_id    text        not null,
  form_type   text        not null,
  data        jsonb       not null default '{}',
  status      text        not null default 'active' check (status in ('active', 'closed')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index form_drafts_store_status_idx on public.form_drafts (store_id, status);

-- Keep updated_at current on every write
create or replace function public.touch_form_draft()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger form_drafts_updated_at
  before update on public.form_drafts
  for each row execute function public.touch_form_draft();

-- RLS: all mutations go through supabaseAdmin (service role), so no user-level policies needed
alter table public.form_drafts enable row level security;

-- Purge drafts not touched in the last hour (runs every hour)
select cron.schedule(
  'delete-stale-form-drafts',
  '0 * * * *',
  $$delete from public.form_drafts where updated_at < now() - interval '1 hour'$$
);
