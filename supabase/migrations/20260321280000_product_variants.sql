-- Product Variants
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products on delete cascade,
  name text not null,
  price numeric(10,2) not null,
  compare_at_price numeric(10,2),
  stock_quantity integer not null default 0,
  in_stock boolean not null default true,
  is_default boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.product_variants enable row level security;

create policy "Variants are viewable by everyone"
  on public.product_variants for select using (true);

create policy "Admins can manage variants"
  on public.product_variants for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create index idx_product_variants_product on public.product_variants(product_id);

-- Enforce at most one default variant per product
create unique index idx_one_default_variant
  on public.product_variants(product_id) where is_default = true;

-- Extend product_media to optionally belong to a variant
alter table public.product_media
  add column variant_id uuid references public.product_variants on delete cascade;

create index idx_product_media_variant on public.product_media(variant_id);

-- Extend order_items with variant snapshot
alter table public.order_items
  add column variant_id uuid references public.product_variants on delete set null,
  add column variant_name text;

-- Trigger: keep products.price and products.in_stock in sync with variants
create or replace function public.sync_product_from_variants()
returns trigger as $$
declare
  target_product_id uuid;
begin
  -- Handle DELETE where NEW is null
  if TG_OP = 'DELETE' then
    target_product_id := OLD.product_id;
  else
    target_product_id := NEW.product_id;
  end if;

  update public.products
  set
    price = coalesce(
      (select min(v.price) from public.product_variants v where v.product_id = target_product_id),
      price
    ),
    in_stock = coalesce(
      (select bool_or(v.in_stock) from public.product_variants v where v.product_id = target_product_id),
      in_stock
    )
  where id = target_product_id;

  if TG_OP = 'DELETE' then
    return OLD;
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

create trigger sync_product_after_variant_change
  after insert or update or delete on public.product_variants
  for each row execute procedure public.sync_product_from_variants();
