-- Add cancellation and manual payment tracking to orders
alter table public.orders
  add column cancelled_reason text,
  add column cancelled_at timestamptz,
  add column paid_manually boolean not null default false;
