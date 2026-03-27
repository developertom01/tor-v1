-- Add price column to product_requests (copied from product at creation, editable by admin)
alter table product_requests add column price numeric(10,2);

-- Backfill existing requests with product price
update product_requests pr
set price = p.price
from products p
where pr.product_id = p.id and pr.price is null;

-- Make it not null after backfill
alter table product_requests alter column price set not null;
