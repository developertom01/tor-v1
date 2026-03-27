-- Store-wide settings (single-row pattern)
create table store_settings (
  id uuid primary key default gen_random_uuid(),
  bypass_payment boolean not null default false,
  updated_at timestamptz not null default now()
);

-- Insert the single settings row
insert into store_settings (bypass_payment) values (false);

-- Prevent additional rows
create unique index store_settings_singleton on store_settings ((true));

-- RLS
alter table store_settings enable row level security;

create policy "Anyone can read store settings"
  on store_settings for select using (true);

create policy "Admins can update store settings"
  on store_settings for update using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );
