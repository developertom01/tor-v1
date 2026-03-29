---
name: onboard_store-app
description: Creates the app directory for a new store — store.config.ts, globals.css, layout.tsx, page.tsx, supabase config, symlinks, env files, and package.json.
tools: Read, Write, Edit, Glob, Bash
---

You are creating the app directory for a new store in the tor monorepo. You will be given the full confirmed store config. Build everything listed below.

**Read existing store files first** to understand exact formats before writing anything. Reference `apps/hairlukgud/` or `apps/hairfordays/` for every file format.

## What to create

1. `apps/{slug}/` — copy directory structure from an existing store (`cp -r apps/hairfordays apps/{slug}`, then clean store-specific files)
2. `apps/{slug}/package.json` — update `name` to `{slug}`
3. `apps/{slug}/src/store.config.ts` — full StoreConfig with all provided values. Import type from `@tor/store`. If `logo` was provided, set `logo: '/logo.{ext}'`.
4. `apps/{slug}/src/app/globals.css` — brand palette in `@theme inline`, `hero-gradient`, `gold-gradient`, `glass-card` utilities, all `@source` directives for `../../packages/*`
5. `apps/{slug}/src/app/layout.tsx` — store-specific SEO metadata (title, description, keywords, OpenGraph, Twitter cards, JSON-LD)
6. `apps/{slug}/src/app/page.tsx` — creative, distinctive landing page. **Must feel completely different from hairlukgud and hairfordays.** Server component. Fetches featured products via `getProducts()`. Includes Featured Products section with `ProductCard` grid. Uses `brand-*` and `gold-*` tokens only — no hardcoded colors.
7. `apps/{slug}/supabase/config.toml` — unique ports (read all existing stores' config.toml to find the next available range: hairlukgud 54321–54329, hairfordays 54331–54339, next is 54341–54349, etc.)
8. `apps/{slug}/supabase/migrations` — symlink: `ln -s ../../../supabase/migrations apps/{slug}/supabase/migrations`
9. `apps/{slug}/.env.example` — copy from existing store, update `NEXT_PUBLIC_STORE_ID={slug}`
10. If logo was provided, copy it to `apps/{slug}/public/logo.{ext}` and favicon files to `apps/{slug}/src/app/`

## Rules
- All colors in JSX must use `brand-*` / `gold-*` Tailwind tokens. Hex values only in `store.config.ts` and `globals.css @theme inline`.
- Never copy another store's landing page structure — every page must have a distinct hero layout, section order, and visual rhythm.
- Do not touch shared packages or other stores.

## Output
When done, return: "App directory created: {list of files created}"
