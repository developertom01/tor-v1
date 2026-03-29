---
name: onboard_store
description: Scaffold a new store in the multi-tenant e-commerce monorepo — creates app directory, store config, theme, landing page, Terraform infra, seed data, and CI integration. Use when adding a new hair business store.
---

# Onboard New Store

You are onboarding a new store into the tor monorepo — a multi-tenant e-commerce platform for hair businesses in Ghana. Your job is to scaffold the entire app directory, config files, Terraform infra, seed data, and CI integration so the store is ready to provision and deploy.

## Conversation Loop: Gather Before You Build

**DO NOT write a single file until you have every required field confirmed by the user.**

You must run a conversation loop with the user to collect all required information. The loop works like this:

1. **Check what's known.** Parse `$ARGUMENTS` and anything the user said in the initial message. Mark each required field as provided or missing.
2. **Ask for what's missing.** Group related missing fields into 2-3 questions max per turn — don't ask for everything in one wall of text, and don't ask one field at a time. Be conversational.
3. **Validate what you got.** After the user responds, check:
   - Is the slug lowercase with no spaces or special chars?
   - Does the domain look like a real domain (has a TLD)?
   - Are the color hex values valid? If the user gave a single primary color, generate the 50-900 scale and show it for confirmation.
   - Are there at least 2 product categories?
   - Do phone/email look real (not placeholder)?
4. **If anything is still missing or unclear, ask again.** Don't proceed. Don't fill in gaps yourself.
5. **Once you have everything, present a full summary** of all values and ask: "Does this all look correct? I'll start building once you confirm."
6. **Only after explicit confirmation ("yes", "looks good", "go ahead", etc.) do you move to Phase 2.**

If at any point the user says something vague like "just pick something" for a required field, push back: "I need this from you since it'll be customer-facing / used in production. What should it be?"

### Required fields (block until ALL are provided)

| Field | Why it matters |
|-------|---------------|
| **Store slug** | Used as `store_id` in the database, directory name, Doppler project name, Terraform resource names. Must be lowercase, no spaces, no special chars. Example: `hairfordays` |
| **Display name** | Shown in the UI, emails, metadata. Example: `Hair For Days` |
| **Domain** | Production domain. Must be a real domain the owner has purchased. Example: `hairfordays.com` |
| **Brief store description** | What the store sells, its vibe, target audience. Used to generate landing page copy, SEO metadata, and seed products. Example: "Premium braiding hair and crochet extensions for natural hair lovers in Ghana" |
| **Brand color palette** | Full 50-900 scale of hex values. Ask the user for their primary brand color and help them generate the scale if needed, but confirm the final values. The palette defines the entire look of the store. |
| **Contact phone** | Shown on site. Must be a real phone number. |
| **Contact email** | Shown on site. Must be a real email address. |
| **Contact location** | City/country shown on site. |
| **Product categories** | What the store sells (e.g., Wigs, Extensions, Accessories). Need name, slug, description, emoji for each. |
| **Admin email** | The email address for the first admin user account. |

### Optional fields (use defaults if not provided, but mention the defaults)

| Field | Default if not provided |
|-------|------------------------|
| Gold accent colors | `{ 400: '#d4a843', 500: '#c4982f', 600: '#a67c2e' }` (shared gold) |
| Hero gradient | Auto-generate from brand-900 → brand-700 → brand-500 |
| Currency | GHS (Ghana Cedis) |
| Region | `eu-west-2` (Supabase region) |
| Logo & favicon | Optional — see branding section below |

### Branding: logo and favicon

After collecting the required fields, ask the user about branding assets:

> "Do you have a logo and favicon for this store? If yes, place them in the repo and give me the paths. If you'd like to skip branding for now, just say so and we'll leave it out."

**If the user provides paths:**
1. Validate each path exists before proceeding (check the file is present relative to the repo root).
2. If a path doesn't exist, tell the user exactly what's missing and ask them to fix it before continuing:
   > "I couldn't find `{path}`. Please add the file and let me know when it's in place."
3. Once validated:
   - Copy or note the logo path for `public/logo.{ext}` in the app directory
   - Copy or note the favicon for `src/app/favicon.ico` (and `src/app/icon.svg`, `src/app/apple-icon.png` if provided)
   - Set `logo: '/logo.{ext}'` in `store.config.ts`

**If the user skips:** omit `logo` from `store.config.ts` entirely. Do not add a placeholder.

### Example conversation flow

```
Agent: "Let's set up your new store! I need a few things first.
        What's the store slug (lowercase, e.g. hairfordays), display name, and domain?"
User:  "curlqueen, Curl Queen GH, curlqueengh.com"
Agent: "Got it. What does Curl Queen GH sell? Give me a quick description
        and list the product categories (e.g., Wigs, Extensions, Accessories)."
User:  "natural hair products and curl-defining tools. Categories: Curl Creams, Styling Tools, Accessories"
Agent: "Nice. What's the brand color? Give me a hex code for the primary color
        and I'll generate the full 50-900 palette for you to review."
User:  "#7c3aed"
Agent: "Here's the palette I generated from #7c3aed:
        50: #f5f3ff, 100: #ede9fe, ..., 900: #4c1d95
        Does this look right?"
User:  "yes"
Agent: "Last bits — contact info (phone, email, location) and the admin email?"
User:  "+233 20 123 4567, hello@curlqueengh.com, Accra Ghana, admin@curlqueengh.com"
Agent: "Here's the full summary:
        - Slug: curlqueen
        - Display name: Curl Queen GH
        - Domain: curlqueengh.com
        - Description: natural hair products and curl-defining tools
        - Brand primary: #7c3aed (palette confirmed above)
        - Categories: Curl Creams, Styling Tools, Accessories
        - Contact: +233 20 123 4567 / hello@curlqueengh.com / Accra, Ghana
        - Admin: admin@curlqueengh.com
        - Gold accents: default (shared)
        Does this all look correct? I'll start building once you confirm."
User:  "yes go ahead"
Agent: [NOW begins Phase 2]
```

## What You CAN Be Creative With

### Landing page (`src/app/page.tsx`)

This is where you shine. Based on the store's name, categories, and description, craft a **compelling, conversion-focused landing page** that:

- Tells the store's story and builds trust
- Has an eye-catching hero section with strong CTAs
- Showcases product categories in an engaging way
- Includes social proof / testimonials section (can use placeholder names with Ghanaian names)
- Has a final CTA section that creates urgency
- Feels premium, modern, and aspirational
- Uses animations via `Animate` from `@tor/ui/Animate` (fade-up, fade-left, scale-up, blur-in)
- Has personality — the copy should feel like the store's brand voice, not generic e-commerce

Think like a creative director. The landing page is the store's first impression. It should make visitors want to buy.

**Every store's landing page must feel different.** Do NOT copy the layout or structure from existing stores. Each store has its own personality, and the page should reflect that. Vary:

- **Hero layout**: Full-height editorial with stacked typography, split hero with imagery placeholder, centered minimal hero, asymmetric layout with floating elements — pick something that matches the store's vibe.
- **Section order and composition**: Not every page needs the same sections in the same order. A luxury store might lead with a "Why Us" story section right after the hero. A playful store might put categories first. Mix it up.
- **Visual rhythm**: Alternate between dark (`bg-brand-900`) and light (`bg-white`, `bg-brand-50`) sections. Use different patterns — horizontal strips with dividers, stat grids, split layouts, card grids, editorial text blocks.
- **Typography and spacing**: A luxury brand wants large type, generous whitespace, and restraint. A fun brand can be tighter and more energetic.
- **CTA style**: Gold gradient buttons, outlined buttons, underlined text links, icon-led CTAs — vary them per store.
- **Section headers**: Gold line + uppercase tracking labels (`— COLLECTIONS`), centered with subtitles, left-aligned with large type — don't repeat the same pattern.
- **Icons**: Use different `lucide-react` icons per store. Don't default to Truck/Shield/Star for every store. `Crown`, `Gem`, `Heart`, `Zap`, `Sparkles`, `Flame`, `Award`, `Feather` etc. are all available.

For inspiration on how different two pages can be, read `apps/hairlukgud/src/app/page.tsx` (bright, playful, split hero with floating cards) and `apps/hairfordays/src/app/page.tsx` (dark, editorial, full-height hero with stacked type and gold accents). Your new store should be equally distinct from both.

**Design constraints:**
- All colors must use theme tokens: `brand-50` through `brand-900`, `gold-400/500/600`. NEVER use literal color names like `text-pink-600` or `text-teal-500` or hardcoded hex values in JSX.
- Use CSS classes `hero-gradient`, `gold-gradient`, `glass-card` for branded backgrounds. You can also use `bg-clip-text text-transparent` with `gold-gradient` for gradient text effects.
- Icons from `lucide-react` only.
- Must be a server component (no `'use client'`). Featured products are fetched via `getProducts()` server action.
- **Always include a Featured Products section** with the `ProductCard` grid — this is the one required section.
- Include JSON-LD structured data at the bottom.

### Layout metadata (`src/app/layout.tsx`)

Generate compelling SEO metadata (title, description, keywords, OpenGraph, Twitter cards) based on the store's name, products, and location. Think about what someone in Ghana would search for.

### Seed products (`supabase/seeds/{slug}.json`)

Create a per-store JSON seed file at `supabase/seeds/{slug}.json`. CI runs `node scripts/seed-store.mjs {slug}` which reads this file and inserts via the Supabase REST API — no hardcoded UUIDs, fully idempotent (skips existing slugs).

The JSON file should contain:
- `display_name` and `domain` for the store row
- `products` array with 8-14 realistic products, each having: `name`, `slug`, `description`, `price`, `compare_at_price` (optional), `category`, `in_stock`, `stock_quantity`, `featured`, `image_url`

Generate creative product names and descriptions that match the store's brand voice. Use Unsplash image URLs.

Also add the store row to `supabase/seed.sql` so local `db:reset` includes it.

Reference `supabase/seeds/hairlukgud.json` or `supabase/seeds/hairfordays.json` for the exact format.

## What You MUST NOT Change

These are shared across all stores. Do not modify them:

- `packages/lib/*` — Server actions, Supabase clients, utilities
- `packages/ui/*` — Shared UI components
- `packages/pages/*` — Shared page templates (injected into all apps)
- `packages/store/index.ts` — StoreConfig type definitions
- `packages/store/context.tsx` — StoreProvider context
- `supabase/migrations/*` — Database schema (shared by all stores)
- `scripts/*` — Build and injection scripts
- `terraform/modules/*` — Shared Terraform modules
- `terraform/shared/*` — Shared Supabase infra
- `.github/workflows/*` — CI workflows (except adding the store to input options)
- Any files in other stores' `apps/` directories

## Execution Plan

Follow this order. Use the todo list to track progress.

### Phase 1: Gather Information

Follow the **Conversation Loop** described above. Do not proceed to Phase 2 until the user has confirmed the full summary.

### Phase 2: Create App Directory

Read the existing store files first to understand the exact format, then create the new store:

4. Create `apps/{slug}/` by copying structure from an existing store
5. Update `apps/{slug}/package.json` — change `name` field
6. Create `apps/{slug}/src/store.config.ts` with the user's values (type: `StoreConfig` from `@tor/store`)
7. Create `apps/{slug}/src/app/globals.css` with the brand palette in `@theme inline`, plus matching `hero-gradient` and `gold-gradient` CSS classes. Include all `@source` directives for shared packages.
8. Create `apps/{slug}/src/app/layout.tsx` with store-specific metadata
9. Create `apps/{slug}/src/app/page.tsx` — **be creative here** (see above)
10. Create `apps/{slug}/supabase/config.toml` with unique ports. Use the next available port range:
    - hairlukgud: 54321-54329
    - hairfordays: 54331-54339
    - Next store: 54341-54349, then 54351-54359, etc.
    - Read existing stores' config.toml files to find the next available range.
11. Create symlink: `apps/{slug}/supabase/migrations` -> `../../../supabase/migrations`
12. Create `apps/{slug}/.env.example` with the store's `NEXT_PUBLIC_STORE_ID`
13. Create `apps/{slug}/src/middleware.ts` (copy from existing store — it's identical)
14. Verify `apps/{slug}/next.config.ts` has all `@tor/*` in `transpilePackages`
15. Verify `apps/{slug}/tsconfig.json` has `@/*` path alias pointing to `./src/*`

### Phase 3: Terraform Config

16. Create `terraform/stores/{slug}/doppler/terragrunt.hcl`
17. Create `terraform/stores/{slug}/dev/terragrunt.hcl` (domain: `dev.{base_domain}`, branch: `dev`, env: `dev`)
18. Create `terraform/stores/{slug}/prod/terragrunt.hcl` (domain: `{base_domain}`, branch: `main`, env: `prod`)

Reference the existing stores' terragrunt files for exact structure. Key values:
- `name` = `{slug}-{env}`
- `store_id` = `{slug}`
- `root_dir` = `apps/{slug}`
- Supabase vars use `get_env()` with both upper and lowercase fallbacks

### Phase 4: Provisioning Config & Seed Data

19. Create `init/{slug}.yaml` provisioning config (reference existing stores)
20. Create `supabase/seeds/{slug}.json` with store row, settings, and seed products (reference existing JSON seed files for format)
21. Add the store row to `supabase/seed.sql` so local `db:reset` includes it

### Phase 5: CI Integration

22. Add the store slug to `.github/workflows/provision-store-init.yml` store input options
23. Add the store to `.github/workflows/db-push.yml` if it needs its own migration job (currently all stores share migrations via the same Supabase project, so this may not be needed)

### Phase 6: App-level Config

24. Create `apps/{slug}/CLAUDE.md` with store-specific commands and architecture notes (follow existing pattern)
25. Create `apps/{slug}/AGENTS.md` (same content as other stores — Next.js 16 warning)

### Phase 7: Verify

26. Run `task inject` to verify page injection works for the new store
27. Confirm the symlink to migrations is correct
28. List all created files for the user to review

## Reference Files

When you need to understand the exact format or structure, read these files:

- **StoreConfig type**: `packages/store/index.ts`
- **Example store config**: `apps/hairlukgud/src/store.config.ts` or `apps/hairfordays/src/store.config.ts`
- **Example globals.css**: `apps/hairlukgud/src/app/globals.css`
- **Example layout.tsx**: `apps/hairlukgud/src/app/layout.tsx`
- **Example page.tsx**: `apps/hairlukgud/src/app/page.tsx`
- **Example config.toml**: `apps/hairlukgud/supabase/config.toml` and `apps/hairfordays/supabase/config.toml`
- **Example terragrunt**: `terraform/stores/hairfordays/prod/terragrunt.hcl`
- **Example init yaml**: `init/hairlukgud.yaml`
- **Seed data**: `supabase/seeds/hairlukgud.json` or `supabase/seeds/hairfordays.json`
- **Seed script**: `scripts/seed-store.mjs`
- **Provisioning workflow**: `.github/workflows/provision-store-init.yml`
- **Full onboarding guide**: `docs/onboard-new-store.md`

## Important Patterns

- **Colors are NEVER hardcoded** in shared code or JSX. Always use `brand-*` and `gold-*` Tailwind tokens. The only place hex values appear is in `store.config.ts`, `globals.css` `@theme inline`, and the CSS utility classes (`.hero-gradient`, `.gold-gradient`).
- **Page injection**: Shared pages from `packages/pages/` are copied into `src/app/` at dev/build time. The `.injected` manifest and `.gitignore` are auto-generated. Don't manually create files that would conflict with injected paths.
- **Supabase migrations are shared**: All stores use the same schema via symlinked `migrations/` dir. Never create store-specific migrations.
- **Store isolation is via `store_id`**: Every table query filters by `store_id`. The value comes from `NEXT_PUBLIC_STORE_ID` env var at runtime via `getStoreId()` from `@tor/lib/store-id`.
- **Next.js 16**: This is NOT standard Next.js. Check `node_modules/next/dist/docs/` before using any API you're unsure about.
- **`NEXT_PUBLIC_*` env vars are inlined at build time** by Next.js — changing them requires a redeploy.
- **Gold colors are shared** across all stores (same warm gold accent). Only brand colors differ.
