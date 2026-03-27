-- Add timestamp for payment token expiration
alter table public.orders
  add column payment_token_created_at timestamptz;
