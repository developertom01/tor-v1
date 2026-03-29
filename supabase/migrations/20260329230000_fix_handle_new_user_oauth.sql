-- Fix handle_new_user() to skip profile insert when store_id is absent.
-- Google OAuth users don't carry store_id in their metadata — their profile
-- is created in the /auth/callback route after the OAuth exchange completes.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Skip if store_id is not set (e.g. Google OAuth — profile created in callback)
  if new.raw_user_meta_data ->> 'store_id' is null then
    return new;
  end if;

  insert into public.profiles (id, email, full_name, store_id)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''),
    new.raw_user_meta_data ->> 'store_id'
  );
  return new;
end;
$$ language plpgsql security definer;
