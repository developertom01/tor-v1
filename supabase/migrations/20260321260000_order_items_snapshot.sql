-- Snapshot product description and image into order items (immutable)
alter table public.order_items
  add column product_description text,
  add column product_image text;

-- Backfill existing order items from products
update public.order_items oi
set
  product_description = p.description,
  product_image = (
    select pm.url from public.product_media pm
    where pm.product_id = oi.product_id and pm.is_primary = true
    limit 1
  )
from public.products p
where oi.product_id = p.id;
