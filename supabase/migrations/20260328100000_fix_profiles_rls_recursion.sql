-- Fix infinite recursion in profiles RLS policies.
-- The "Admins can view store profiles" policy queries profiles to check admin status,
-- which triggers the same policy again → infinite loop.
-- Solution: use a security definer function that bypasses RLS for the admin check.

create or replace function public.is_store_admin(check_store_id text)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and store_id = check_store_id
  );
$$;

-- Replace the recursive policy
drop policy if exists "Admins can view store profiles" on public.profiles;

create policy "Admins can view store profiles"
  on public.profiles for select using (
    public.is_store_admin(store_id)
  );

-- Also fix the admin insert policy (same recursion risk)
drop policy if exists "Admins can insert profiles" on public.profiles;

create policy "Admins can insert profiles"
  on public.profiles for insert with check (
    public.is_store_admin(store_id)
  );
