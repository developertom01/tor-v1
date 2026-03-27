-- Allow users to update their own requests
create policy "Users can update own requests"
  on product_requests for update
  using (auth.uid() = user_id);

-- Allow users to delete their own requests
create policy "Users can delete own requests"
  on product_requests for delete
  using (auth.uid() = user_id);
