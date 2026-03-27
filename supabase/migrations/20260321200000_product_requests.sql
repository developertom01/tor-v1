-- Product restock/pre-order requests from customers
create table product_requests (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  note text,
  desired_date date,
  status text not null default 'pending' check (status in ('pending', 'notified', 'cancelled')),
  created_at timestamptz default now() not null
);

-- RLS
alter table product_requests enable row level security;

-- Users can insert requests
create policy "Anyone can create a request"
  on product_requests for insert
  with check (true);

-- Users can view their own requests
create policy "Users can view own requests"
  on product_requests for select
  using (auth.uid() = user_id);

-- Admin full access via service role (bypasses RLS)
