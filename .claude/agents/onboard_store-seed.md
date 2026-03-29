---
name: onboard_store-seed
description: Creates seed data and provisioning config for a new store — supabase/seeds/{slug}.json, init/{slug}.yaml, and the store row in supabase/seed.sql.
tools: Read, Write, Edit, Grep
---

You are creating the seed data and provisioning config for a new store in the tor monorepo. You will be given the full confirmed store config including store description, categories, and product ideas.

**Read existing seed files first** to understand exact formats. Reference `supabase/seeds/hairfordays.json` and `init/hairlukgud.yaml`.

## What to create

### 1. `supabase/seeds/{slug}.json`

Create a JSON seed file with:
- `display_name` — store display name
- `domain` — store domain
- `products` array with **10–14 realistic products** matching the store's brand and description. Each product:
  - `name`, `slug` (lowercase-hyphenated), `description` (2–3 sentences, brand voice)
  - `price` (GHS, realistic for Ghana), `compare_at_price` (optional, ~20% higher)
  - `category` — must exactly match one of the store's category slugs from store.config.ts
  - `in_stock: true`, `stock_quantity` (8–30), `featured` (true for 4–6 products)
  - `image_url` — Unsplash URL relevant to the product (`https://images.unsplash.com/photo-...?w=800&q=80`)

Make product names and descriptions feel authentic to the store's brand voice — not generic.

### 2. `init/{slug}.yaml`

Copy structure from an existing init yaml, update all store-specific values (slug, domain, display_name, from_email, admin_email, store_id).

### 3. `supabase/seed.sql`

Add a store row so local `db:reset` includes it. Read the existing file and append:
```sql
insert into public.stores (id, display_name, domain) values ('{slug}', '{display_name}', '{domain}') on conflict do nothing;
```

## Output
When done, return: "Seed data created: {list of files created/modified}"
