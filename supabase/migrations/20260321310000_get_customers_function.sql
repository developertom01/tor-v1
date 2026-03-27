-- Aggregate customers from orders
create or replace function get_customers()
returns table (
  user_id uuid,
  customer_email text,
  customer_name text,
  customer_phone text,
  order_count bigint,
  total_spent numeric,
  last_order_at timestamptz
)
language sql
stable
security definer
as $$
  select
    (array_agg(o.user_id order by o.created_at desc))[1] as user_id,
    o.customer_email,
    (array_agg(o.customer_name order by o.created_at desc))[1] as customer_name,
    (array_agg(o.customer_phone order by o.created_at desc))[1] as customer_phone,
    count(*) as order_count,
    sum(o.total_amount) as total_spent,
    max(o.created_at) as last_order_at
  from orders o
  group by o.customer_email
  order by last_order_at desc;
$$;
