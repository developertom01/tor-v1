-- Allow 'paid' status on product_requests
alter table product_requests drop constraint product_requests_status_check;
alter table product_requests add constraint product_requests_status_check
  check (status in ('pending', 'notified', 'paid', 'cancelled'));
