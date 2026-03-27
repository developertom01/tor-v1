-- =============================================
-- Tor Platform — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  price numeric(10,2) not null,
  compare_at_price numeric(10,2),
  category text not null default 'wigs',
  in_stock boolean not null default true,
  stock_quantity integer not null default 0,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "Products are viewable by everyone"
  on public.products for select using (true);

create policy "Admins can manage products"
  on public.products for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Product Media (photos & videos)
create table public.product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products on delete cascade,
  url text not null,
  type text not null default 'image' check (type in ('image', 'video')),
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.product_media enable row level security;

create policy "Product media is viewable by everyone"
  on public.product_media for select using (true);

create policy "Admins can manage product media"
  on public.product_media for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Orders
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  customer_email text not null,
  customer_name text not null,
  customer_phone text not null,
  shipping_address text not null,
  city text not null default '',
  region text not null default '',
  total_amount numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
  paystack_reference text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "Users can view own orders"
  on public.orders for select using (auth.uid() = user_id);

create policy "Admins can view all orders"
  on public.orders for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update orders"
  on public.orders for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Anyone can create orders"
  on public.orders for insert with check (true);

-- Order Items
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders on delete cascade,
  product_id uuid references public.products,
  product_name text not null,
  quantity integer not null,
  unit_price numeric(10,2) not null
);

alter table public.order_items enable row level security;

create policy "Users can view own order items"
  on public.order_items for select using (
    exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
  );

create policy "Admins can view all order items"
  on public.order_items for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Anyone can create order items"
  on public.order_items for insert with check (true);

-- Indexes for performance
create index idx_products_slug on public.products(slug);
create index idx_products_category on public.products(category);
create index idx_products_featured on public.products(featured) where featured = true;
create index idx_product_media_product on public.product_media(product_id);
create index idx_orders_user on public.orders(user_id);
create index idx_orders_status on public.orders(status);
create index idx_order_items_order on public.order_items(order_id);

-- Updated_at trigger
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at
  before update on public.products
  for each row execute procedure public.update_updated_at();

create trigger orders_updated_at
  before update on public.orders
  for each row execute procedure public.update_updated_at();
