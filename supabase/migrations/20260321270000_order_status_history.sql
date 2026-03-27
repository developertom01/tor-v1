-- Track order status changes with timestamps
create table public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders on delete cascade,
  status text not null,
  created_at timestamptz not null default now()
);

alter table public.order_status_history enable row level security;

create policy "Users can view own order status history"
  on public.order_status_history for select using (
    order_id in (select id from public.orders where user_id = auth.uid())
  );

create policy "Admins can manage order status history"
  on public.order_status_history for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create index idx_order_status_history_order on public.order_status_history(order_id, created_at);

-- Backfill: insert current status for all existing orders with now()
insert into public.order_status_history (order_id, status, created_at)
select id, 'pending', created_at from public.orders;

-- For paid orders, add a paid entry
insert into public.order_status_history (order_id, status, created_at)
select id, 'paid', updated_at from public.orders
where status in ('paid', 'processing', 'shipped', 'delivered');

-- For processing orders
insert into public.order_status_history (order_id, status, created_at)
select id, 'processing', updated_at from public.orders
where status in ('processing', 'shipped', 'delivered');

-- For shipped orders
insert into public.order_status_history (order_id, status, created_at)
select id, 'shipped', updated_at from public.orders
where status in ('shipped', 'delivered');

-- For delivered orders
insert into public.order_status_history (order_id, status, created_at)
select id, 'delivered', updated_at from public.orders
where status = 'delivered';

-- For cancelled orders
insert into public.order_status_history (order_id, status, created_at)
select id, 'cancelled', coalesce(cancelled_at, updated_at) from public.orders
where status = 'cancelled';
