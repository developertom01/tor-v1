-- Add token for secure payment links
alter table product_requests add column token text unique;

-- Allow public access by token (for payment page)
create policy "Anyone can view request by token"
  on product_requests for select
  using (true);
