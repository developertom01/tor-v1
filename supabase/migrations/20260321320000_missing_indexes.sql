-- Index for customer lookups and aggregation (get_customers, getCustomerByEmail)
create index idx_orders_customer_email on public.orders(customer_email);

-- Index for ordering by date (used in most order queries)
create index idx_orders_created_at on public.orders(created_at desc);

-- Index for product stock lookups on order items
create index idx_order_items_product on public.order_items(product_id);
