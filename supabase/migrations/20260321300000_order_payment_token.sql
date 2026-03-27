-- Add payment_token to orders for payment request flow
alter table public.orders
  add column payment_token text unique;
