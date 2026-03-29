-- Create the products storage bucket (public, for product images/videos)
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

-- Allow anyone to read objects from the products bucket
create policy "Public read access for products bucket"
  on storage.objects for select
  using (bucket_id = 'products');

-- Allow authenticated admins to upload/delete objects
create policy "Admins can upload to products bucket"
  on storage.objects for insert
  with check (
    bucket_id = 'products'
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

create policy "Admins can delete from products bucket"
  on storage.objects for delete
  using (
    bucket_id = 'products'
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );
