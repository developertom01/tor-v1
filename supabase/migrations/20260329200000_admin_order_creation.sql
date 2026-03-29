-- Admin order creation: track admin-created orders and stub user profiles

-- Orders created by admin on behalf of a customer
alter table public.orders
  add column admin_created boolean not null default false;

-- Profiles created as stubs by admin (no password set yet)
alter table public.profiles
  add column admin_created boolean not null default false;
