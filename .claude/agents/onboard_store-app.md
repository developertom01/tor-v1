---
name: onboard_store-app
description: Creates the app directory for a new store — store.config.ts, globals.css, layout.tsx, page.tsx, supabase config, symlinks, env files, and package.json.
tools: Read, Write, Edit, Glob, Bash
---

You are creating the app directory for a new store in the tor monorepo. You will be given the full confirmed store config. Build everything listed below.

**Read existing store files first** to understand exact formats before writing anything. Reference `apps/aseesthreads/` as the primary example — it is the most up-to-date store.

## What to create

1. `apps/{slug}/` — copy directory structure from an existing store (`cp -r apps/hairfordays apps/{slug}`, then clean store-specific files)
2. `apps/{slug}/package.json` — update `name` to `{slug}`
3. `apps/{slug}/src/store.config.ts` — full `StoreConfig` with all provided values. Import type from `@tor/store`. Read `packages/store/index.ts` for the exact type shape.
   - Include `theme.colors` using the **Semantic Color Tokens** from the UI plan (`agent_work/{slug}.ui_plan.md`). If no plan exists, derive them from the brand palette following this mapping:
     - `background`: `#ffffff`
     - `backgroundAlt`: `brand-50`
     - `foreground`: `brand-900`
     - `foregroundMuted`: `brand-600`
     - `border`: `brand-200`
     - `primary`: `brand-900` (or `#ffffff` if the store has a light-background nav)
     - `primaryForeground`: `brand-200`
     - `primaryMuted`: `brand-500`
     - `primaryBorder`: `brand-800`
     - `accent`: `gold-500`
     - `accentForeground`: `#ffffff`
   - If `logo` was provided, set `logo: '/logo.{ext}'`.
4. `apps/{slug}/src/app/globals.css` — two blocks inside `@theme inline`:
   - **Brand palette**: `--color-brand-50` through `--color-brand-900`, `--color-gold-400/500/600`, fonts
   - **Semantic tokens** (must match `theme.colors` in `store.config.ts`, comment each one):
     ```css
     /* Semantic tokens — match theme.colors in store.config.ts */
     --color-background: {background};
     --color-background-alt: {backgroundAlt};
     --color-foreground: {foreground};
     --color-foreground-muted: {foregroundMuted};
     --color-border: {border};
     --color-primary: {primary};
     --color-primary-foreground: {primaryForeground};
     --color-primary-muted: {primaryMuted};
     --color-primary-border: {primaryBorder};
     --color-accent: {accent};
     --color-accent-foreground: {accentForeground};
     ```
   - CSS utilities: `hero-gradient`, `gold-gradient`, `gold-text`, `glass-card`, `animate-slide-in`, `animate-dropdown`, all `@source` directives for `packages/`
5. `apps/{slug}/src/app/layout.tsx` — store-specific SEO metadata (title, description, keywords, OpenGraph, Twitter cards, JSON-LD). Import Navbar and Footer from `@/app/_components/` (NOT `@tor/ui`).
6. `apps/{slug}/src/app/_components/Navbar.tsx` — store-specific navbar. Base it on `apps/aseesthreads/src/app/_components/Navbar.tsx`. Use semantic tokens (`bg-primary`, `text-primary-foreground`, `text-primary-muted`, `border-primary-border`, `bg-accent`, `text-accent-foreground`) — NOT `bg-brand-900`, `text-brand-200`, etc. Adjust nav background and logo sizing to match the store's `primary` color.
7. `apps/{slug}/src/app/_components/Footer.tsx` — store-specific footer. Base it on `apps/aseesthreads/src/app/_components/Footer.tsx`. Use semantic tokens (`bg-primary`, `text-primary-foreground`, `text-primary-muted`, `border-primary-border`, `text-accent`) throughout.
8. `apps/{slug}/src/app/page.tsx` — creative, distinctive landing page following the UI plan. Server component. Fetches featured products via `getProducts()`. Includes Featured Products section with `ProductCard` grid. For section backgrounds and text: use semantic tokens (`bg-primary`, `bg-background`, `bg-background-alt`, `text-foreground`, `text-foreground-muted`, `bg-accent`, `text-accent-foreground`) for structural layout; use `brand-*` for fine-grained decorative accents. Never hardcode colors in JSX.
9. `apps/{slug}/supabase/config.toml` — unique ports (read all existing stores' config.toml to find the next available range: hairlukgud 54321–54329, hairfordays 54331–54339, aseesthreads 54341–54349, next is 54351–54359, etc.)
10. `apps/{slug}/supabase/migrations` — symlink: `ln -s ../../../supabase/migrations apps/{slug}/supabase/migrations`
11. `apps/{slug}/.env.example` — copy from existing store, update `NEXT_PUBLIC_STORE_ID={slug}`
12. If logo was provided, copy it to `apps/{slug}/public/logo.{ext}` and favicon files to `apps/{slug}/src/app/`

## Rules
- **Semantic tokens for structure, `brand-*` for decoration.** Use `bg-primary`, `text-primary-foreground`, `bg-background`, `text-foreground`, `bg-accent` for all structural layout elements (section backgrounds, nav, footer, primary text, CTAs). Use `brand-*` shades for fine-grained decorative details within sections. Never hardcode hex colors in JSX.
- Hex values only in `store.config.ts` (in `theme.colors` and `theme.brand`) and `globals.css` `@theme inline`.
- Never copy another store's landing page structure — every page must have a distinct hero layout, section order, and visual rhythm.
- Do not touch shared packages or other stores.
- `layout.tsx` MUST import Navbar and Footer from `@/app/_components/`, never `@tor/ui`.

## Output
When done, return: "App directory created: {list of files created}"
