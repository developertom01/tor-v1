-- profiles: auto-populated from Google OAuth via trigger
create table public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  email       text not null,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Trigger: auto-create profile on new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- store_registrations
create table public.store_registrations (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users on delete cascade not null,
  owner_name       text not null,
  business_name    text not null,
  category         text not null,
  location_country text not null,
  location_city    text,
  whatsapp         text,
  logo_url         text,
  color_palette    text,
  payment_methods  text[] default '{}',
  status           text not null default 'pending'
                   check (status in ('pending', 'active', 'rejected', 'in_progress')),
  linear_ticket_id text,
  notes            text,
  created_at       timestamptz default now() not null,
  updated_at       timestamptz default now() not null
);

alter table public.store_registrations enable row level security;

create policy "Users can view own registrations"
  on public.store_registrations for select
  using (auth.uid() = user_id);

create policy "Users can create registrations"
  on public.store_registrations for insert
  with check (auth.uid() = user_id);

-- updated_at trigger
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at
  before update on public.store_registrations
  for each row execute procedure public.handle_updated_at();
