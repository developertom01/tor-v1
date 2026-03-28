-- =============================================
-- Multi-tenant migration: single shared Supabase project
-- Adds store_id to tenant-scoped tables for store isolation
-- =============================================

-- 1. Stores reference table
create table public.stores (
  id text primary key,
  display_name text not null,
  domain text not null unique,
  created_at timestamptz not null default now()
);

alter table public.stores enable row level security;

create policy "Stores are viewable by everyone"
  on public.stores for select using (true);

-- 2. Add store_id to tenant-scoped tables

-- profiles: change PK to composite (id, store_id) to support one user per store
alter table public.profiles
  drop constraint profiles_pkey cascade,
  add column store_id text not null references public.stores(id),
  add primary key (id, store_id);

-- Re-add the FK to auth.users (dropped by cascade)
alter table public.profiles
  add constraint profiles_user_fk foreign key (id) references auth.users(id) on delete cascade;

-- products
alter table public.products
  add column store_id text not null references public.stores(id);

-- Drop old unique on slug, replace with per-store unique
alter table public.products
  drop constraint products_slug_key;
alter table public.products
  add constraint products_slug_store_unique unique (store_id, slug);

-- orders
alter table public.orders
  add column store_id text not null references public.stores(id);

-- product_requests
alter table public.product_requests
  add column store_id text not null references public.stores(id);

-- store_settings: replace singleton with per-store unique
-- Delete the old singleton row (will be re-seeded with store_id)
delete from public.store_settings;

alter table public.store_settings
  add column store_id text not null references public.stores(id);

drop index if exists store_settings_singleton;
alter table public.store_settings
  add constraint store_settings_store_unique unique (store_id);

-- 3. Indexes for store_id filtering
create index idx_products_store on public.products(store_id);
create index idx_products_store_slug on public.products(store_id, slug);
create index idx_products_store_category on public.products(store_id, category);
create index idx_orders_store on public.orders(store_id);
create index idx_orders_store_status on public.orders(store_id, status);
create index idx_orders_store_user on public.orders(store_id, user_id);
create index idx_orders_store_email on public.orders(store_id, customer_email);
create index idx_profiles_store on public.profiles(store_id);
create index idx_product_requests_store on public.product_requests(store_id);

-- 4. Update handle_new_user() to include store_id from user metadata
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, store_id)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''),
    new.raw_user_meta_data ->> 'store_id'
  );
  return new;
end;
$$ language plpgsql security definer;

-- 5. Update get_customers() to filter by store_id
create or replace function public.get_customers(p_store_id text)
returns table (
  user_id uuid,
  customer_email text,
  customer_name text,
  customer_phone text,
  order_count bigint,
  total_spent numeric,
  last_order_at timestamptz
)
language sql stable security definer as $$
  select
    o.user_id,
    o.customer_email,
    max(o.customer_name) as customer_name,
    max(o.customer_phone) as customer_phone,
    count(*) as order_count,
    coalesce(sum(o.total_amount), 0) as total_spent,
    max(o.created_at) as last_order_at
  from public.orders o
  where o.store_id = p_store_id
  group by o.user_id, o.customer_email
  order by last_order_at desc;
$$;

-- 6. Drop ALL existing RLS policies and recreate with store isolation
-- We use explicit store_id filtering in the application layer.
-- RLS provides defense-in-depth: auth checks + admin checks remain in RLS.

-- profiles
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Admins can view store profiles"
  on public.profiles for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin' and p.store_id = profiles.store_id)
  );

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id and store_id = store_id);

create policy "Admins can insert profiles"
  on public.profiles for insert with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- products
drop policy if exists "Products are viewable by everyone" on public.products;
drop policy if exists "Admins can manage products" on public.products;

create policy "Products are viewable by everyone"
  on public.products for select using (true);

create policy "Admins can manage products"
  on public.products for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin' and store_id = products.store_id)
  );

-- product_media (inherits from product — admin check joins through product)
drop policy if exists "Product media is viewable by everyone" on public.product_media;
drop policy if exists "Admins can manage product media" on public.product_media;

create policy "Product media is viewable by everyone"
  on public.product_media for select using (true);

create policy "Admins can manage product media"
  on public.product_media for all using (
    exists (
      select 1 from public.products p
      join public.profiles pr on pr.id = auth.uid() and pr.role = 'admin' and pr.store_id = p.store_id
      where p.id = product_media.product_id
    )
  );

-- orders
drop policy if exists "Users can view own orders" on public.orders;
drop policy if exists "Admins can view all orders" on public.orders;
drop policy if exists "Admins can update orders" on public.orders;
drop policy if exists "Anyone can create orders" on public.orders;

create policy "Users can view own orders"
  on public.orders for select using (auth.uid() = user_id);

create policy "Admins can view store orders"
  on public.orders for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin' and store_id = orders.store_id)
  );

create policy "Admins can update store orders"
  on public.orders for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin' and store_id = orders.store_id)
  );

create policy "Anyone can create orders"
  on public.orders for insert with check (true);

-- order_items (inherits from order)
drop policy if exists "Users can view own order items" on public.order_items;
drop policy if exists "Admins can view all order items" on public.order_items;
drop policy if exists "Anyone can create order items" on public.order_items;

create policy "Users can view own order items"
  on public.order_items for select using (
    exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
  );

create policy "Admins can view store order items"
  on public.order_items for select using (
    exists (
      select 1 from public.orders o
      join public.profiles pr on pr.id = auth.uid() and pr.role = 'admin' and pr.store_id = o.store_id
      where o.id = order_items.order_id
    )
  );

create policy "Anyone can create order items"
  on public.order_items for insert with check (true);

-- product_variants (inherits from product)
drop policy if exists "Variants are viewable by everyone" on public.product_variants;
drop policy if exists "Admins can manage variants" on public.product_variants;

create policy "Variants are viewable by everyone"
  on public.product_variants for select using (true);

create policy "Admins can manage variants"
  on public.product_variants for all using (
    exists (
      select 1 from public.products p
      join public.profiles pr on pr.id = auth.uid() and pr.role = 'admin' and pr.store_id = p.store_id
      where p.id = product_variants.product_id
    )
  );

-- product_requests
drop policy if exists "Anyone can create a request" on public.product_requests;
drop policy if exists "Users can view own requests" on public.product_requests;
drop policy if exists "Anyone can view request by token" on public.product_requests;
drop policy if exists "Users can update own requests" on public.product_requests;
drop policy if exists "Users can delete own requests" on public.product_requests;

create policy "Anyone can create a request"
  on public.product_requests for insert with check (true);

create policy "Users can view own requests"
  on public.product_requests for select using (auth.uid() = user_id);

create policy "Anyone can view request by token"
  on public.product_requests for select using (true);

create policy "Users can update own requests"
  on public.product_requests for update using (auth.uid() = user_id);

create policy "Users can delete own requests"
  on public.product_requests for delete using (auth.uid() = user_id);

-- order_status_history (inherits from order)
drop policy if exists "Users can view own order status history" on public.order_status_history;
drop policy if exists "Admins can manage order status history" on public.order_status_history;

create policy "Users can view own order status history"
  on public.order_status_history for select using (
    order_id in (select id from public.orders where user_id = auth.uid())
  );

create policy "Admins can manage store order status history"
  on public.order_status_history for all using (
    exists (
      select 1 from public.orders o
      join public.profiles pr on pr.id = auth.uid() and pr.role = 'admin' and pr.store_id = o.store_id
      where o.id = order_status_history.order_id
    )
  );

-- store_settings
drop policy if exists "Anyone can read store settings" on public.store_settings;
drop policy if exists "Admins can update store settings" on public.store_settings;

create policy "Anyone can read store settings"
  on public.store_settings for select using (true);

create policy "Admins can update store settings"
  on public.store_settings for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin' and store_id = store_settings.store_id)
  );
