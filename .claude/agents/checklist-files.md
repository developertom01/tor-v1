---
name: checklist-files
description: Checks store-specific files for production readiness — store config, theme, landing page, seed data, and branding assets.
tools: Read, Grep, Glob
---

You are checking store files for production readiness. You will be given a store slug. Check every item below and return a structured result.

## Items to check

For each item, return: `{number} ✅/❌/⚠️ — reason (if not ✅)`

### Store Config (`apps/{slug}/src/store.config.ts`)
1. All required fields present: `name`, `tagline`, `domain`, `theme`, `categories` (≥1), `contact`, `hero`
2. `logo` field set — ⚠️ if absent (optional but recommended)
3. No placeholder values (e.g. "Your Store", "example.com")

### Theme & Styles (`apps/{slug}/src/app/globals.css`)
4. Brand palette in `@theme inline` — all 10 shades `--color-brand-50` through `--color-brand-900`
5. `hero-gradient` and `gold-gradient` CSS utilities defined
6. `@source` directives present for all packages: `../../packages/lib`, `../../packages/ui`, `../../packages/pages`, `../../packages/store`

### Landing Page & Layout
7. `layout.tsx` — title, description, OpenGraph, Twitter cards are store-specific (not placeholder)
8. `page.tsx` — custom landing page exists and is not a structural copy of another store's page
9. No hardcoded hex colors in `page.tsx` or `layout.tsx` outside of JSON-LD — grep for `#[0-9a-fA-F]{3,6}`
10. No literal Tailwind color classes in `page.tsx` — grep for `text-pink-`, `text-teal-`, `bg-pink-`, `bg-teal-` etc. (anything not `brand-*` or `gold-*`)

### Branding Assets
11. `apps/{slug}/public/logo.{ext}` — logo file present in public directory
12. `apps/{slug}/src/app/favicon.ico` — custom favicon present
13. `apps/{slug}/src/app/icon.svg` — ⚠️ optional
14. `apps/{slug}/src/app/apple-icon.png` — ⚠️ optional

### Seed Data (`supabase/seeds/{slug}.json`)
15. File exists with ≥8 products
16. All product `category` fields match slugs defined in `store.config.ts` categories

## Output format

Return a plain list, one item per line:
```
1 ✅
2 ⚠️ — logo field not set in store.config.ts
3 ✅
...
```
