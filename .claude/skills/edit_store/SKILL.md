---
name: edit_store
description: Update an existing store's configuration — theme colors, landing page, contact info, categories, metadata, or Terraform config. Compares current values with requested changes and only modifies what's needed.
---

# Edit Store

You are editing an existing store in the tor monorepo. The user wants to change something about a store that's already been onboarded. Your job is to understand what they want changed, compare it to what's currently there, and make surgical updates — nothing more.

## Conversation Loop: Understand Before You Edit

**DO NOT edit any files until you know exactly what the user wants changed and have confirmed the plan.**

1. **Identify the store.** Check `$ARGUMENTS` for a store slug. If not provided, list the existing stores (check `apps/` directories) and ask which one.
2. **Read current state.** Once you know the store, read its key config files:
   - `apps/{slug}/src/store.config.ts` — name, tagline, domain, theme, categories, contact, hero
   - `apps/{slug}/src/app/globals.css` — brand colors, gradients, CSS utilities
   - `apps/{slug}/src/app/layout.tsx` — metadata, SEO
   - `apps/{slug}/src/app/page.tsx` — landing page content
   - `terraform/stores/{slug}/prod/terragrunt.hcl` — domain, from_email
   - `terraform/stores/{slug}/dev/terragrunt.hcl` — dev domain
   - `init/{slug}.yaml` — provisioning config
3. **Ask what they want to change.** If the user already said (e.g., "change the brand color to blue"), skip to step 4. If it's vague ("update the store"), ask: "What do you want to change? For example: brand colors, landing page copy, contact info, categories, domain, SEO metadata?"
4. **Show the diff.** Before editing, present a clear before/after comparison:
   ```
   Brand color 500: #ec4899 (pink) → #3b82f6 (blue)
   Hero gradient: linear-gradient(135deg, #831843...) → linear-gradient(135deg, #1e3a5f...)
   ```
   For landing page copy changes, quote the specific lines changing.
5. **Ask for confirmation.** "These are the changes I'll make. Go ahead?"
6. **Only after confirmation, make the edits.**

If the user's request is ambiguous or could affect multiple files, always clarify scope first.

### Logo and favicon changes

If the user wants to update the logo or favicon:

1. Tell them exactly what files to provide and where to put them:
   > "Please place your logo at `apps/{slug}/public/logo.{ext}` and your favicon files at `apps/{slug}/src/app/favicon.ico` (and optionally `icon.svg`, `apple-icon.png` in the same directory). Let me know the relative path(s) once they're in place."
2. Wait for the user to confirm the paths.
3. Validate each path exists before making any changes. If a file is missing:
   > "I couldn't find `{path}`. Please add the file and let me know when it's ready."
4. Only after validation, update `store.config.ts` with `logo: '/logo.{ext}'` and confirm the favicon files are in place.

## Change Propagation Map

When a value changes, you often need to update multiple files. Use this map:

| What changed | Files to update |
|---|---|
| **Brand colors** | `store.config.ts` (theme.brand), `globals.css` (@theme inline + .hero-gradient + .gold-gradient) |
| **Store name / display name** | `store.config.ts` (name), `layout.tsx` (metadata), `page.tsx` (copy referencing store name), `CLAUDE.md`, `init/{slug}.yaml`, terragrunt locals (display_name) |
| **Domain** | `store.config.ts` (domain), `init/{slug}.yaml`, `terraform/stores/{slug}/dev/terragrunt.hcl` (locals), `terraform/stores/{slug}/prod/terragrunt.hcl` (locals), `.env.example` |
| **Contact info** | `store.config.ts` (contact) only |
| **Categories** | `store.config.ts` (categories array), `supabase/seeds/{slug}.json` (remap every product's `category` field to match the new slugs — the seed script deletes and re-inserts all products on every run, so stale slugs will orphan products from their category), `page.tsx` (if categories are referenced in landing page copy) |
| **Hero / landing page copy** | `store.config.ts` (hero), `page.tsx` (landing page content) |
| **Landing page design** | `page.tsx` only |
| **Logo** | `store.config.ts` (`logo` field), `apps/{slug}/public/logo.{ext}` (the image file itself) |
| **Favicon** | `apps/{slug}/src/app/favicon.ico`, optionally `icon.svg` and `apple-icon.png` in the same directory |
| **SEO metadata** | `layout.tsx` only |
| **Tagline** | `store.config.ts` (tagline) |
| **Testimonials** | `store.config.ts` (testimonials), `page.tsx` (if testimonials are inline rather than from config) |
| **From email** | `init/{slug}.yaml`, terragrunt locals (from_email) |
| **Seed products** | `supabase/seeds/{slug}.json` only |

## Rules

### Same rules as the main codebase

- **Never hardcode colors** in JSX. `brand-*` and `gold-*` Tailwind tokens only. Hex values only in `store.config.ts`, `globals.css` `@theme inline`, and CSS utility classes.
- **Never modify shared packages** (`packages/lib`, `packages/ui`, `packages/pages`, `packages/store`).
- **Never modify other stores'** files.
- **Never modify shared migrations** (`supabase/migrations/`).
- **Never modify shared Terraform modules** or shared infra (`terraform/modules/`, `terraform/shared/`).
- **Avoid `useEffect` for event-driven logic.** Handle mouse events, clicks, keyboard, focus/blur directly in event handler props. `useEffect` is only for true side-effects: data fetching on mount, syncing with an external system, or cleanup.
- **Never use native `<select>`.** Always use the custom `Select` component from `@tor/ui`. If the component lacks a needed feature (e.g. search, images in options), extend the shared component — don't use a native element or one-off solution.

### Edit-specific rules

- **Minimal changes.** Only touch files affected by the change. If the user wants a new tagline, update `store.config.ts` and nothing else.
- **Preserve what works.** Don't "improve" or refactor code that isn't part of the change request. If the landing page works fine and they just want a color change, don't rewrite the landing page.
- **Keep colors in sync.** If brand colors change, both `store.config.ts` and `globals.css` must be updated together. The hex values in `@theme inline` must match `store.config.ts`.

### Landing page rewrites and design revamps

If the user asks for a new landing page, a design revamp, or any major visual overhaul, this is a full creative rebuild. Apply the same visual quality bar as onboarding:

#### Required visual quality bar

Every revamped landing page MUST have:

- **Real background images from Unsplash** — not flat colors. Find, download, and upload to Supabase Storage before writing any component code.
- **Parallax scrolling** on the hero and at least one other section — use framer-motion `useScroll` + `useTransform` in a `'use client'` component
- **Brand color overlay** on all background images — `bg-brand-900/75` (or tuned opacity) so the store's palette always reads through
- **Gradient vignettes** to blend image edges — `bg-gradient-to-t from-brand-900 via-transparent to-transparent` etc.
- **`gold-text` CSS class for gradient text** — NEVER `bg-clip-text text-transparent gold-gradient` on block elements (renders as a solid gold rectangle)
- **Staggered entrance animations** using `Animate` from `@tor/ui/Animate` or framer-motion `whileInView` with staggered delays
- **`backdrop-blur-sm`** on cards that sit over background images
- **Rotating crossfade hero** if multiple images — auto-rotate every 5s, 1s CSS transition

#### Image workflow for revamps

1. Search Unsplash for 3 images matching the store's products and vibe
2. Download to `/tmp/{slug}-hero-{n}.jpg`
3. Upload to Supabase Storage — **all three environments**:
   - **Local**: `curl -s -X POST "http://127.0.0.1:54321/storage/v1/object/products/assets/{slug}-hero-{n}.jpg" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU" -H "Content-Type: image/jpeg" --data-binary "@/tmp/{slug}-hero-{n}.jpg"`
   - **Dev remote**: get URL + key via `doppler run --project {slug} --config dev -- env | grep SUPABASE`, then POST to `{SUPABASE_URL}/storage/v1/object/products/assets/{slug}-hero-{n}.jpg`
   - **Prod remote**: get URL + key via `doppler run --project {slug} --config prod -- env | grep SUPABASE`, then POST to `{SUPABASE_URL}/storage/v1/object/products/assets/{slug}-hero-{n}.jpg`

   All three must return HTTP 200 before proceeding. Do not skip prod — images missing in prod means broken images on the live site.
4. Reference via env var in components — never commit images to `public/`:
   ```ts
   const STORAGE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products`
   ```
5. Use `next/image` with `fill` + `object-cover` for background images

#### Component architecture

- Split into server `page.tsx` + `'use client'` components in `src/app/_components/`
- Only make a component `'use client'` if it truly needs `useScroll`, `useTransform`, or `useState`
- All other sections → server components using `Animate` from `@tor/ui/Animate`
- `FeaturedProductsSection` props must use `ProductWithMedia[]` from `@tor/lib/types` — not a loose generic interface (causes TypeScript errors that hang the dev compiler)

#### Design variation

Make the revamped page feel completely different from the existing stores:
- Vary hero layout, section order, visual rhythm, CTA style, icon choices, typography
- Read `apps/aseesthreads/src/app/page.tsx` + `_components/` as the reference for the image/parallax/overlay pattern
- The one required section is Featured Products with the `ProductCard` grid
- But if they just want a word changed, change the word — don't rebuild everything

## Reference Files

Read these to understand exact formats before editing:

- **StoreConfig type**: `packages/store/index.ts`
- **Example store config**: `apps/hairlukgud/src/store.config.ts`
- **Example globals.css**: `apps/hairlukgud/src/app/globals.css`
- **Example layout.tsx**: `apps/hairlukgud/src/app/layout.tsx`
- **Example page.tsx**: `apps/aseesthreads/src/app/page.tsx` (best reference — server component composing client sections with image/parallax/overlay pattern)
- **Example hero**: `apps/aseesthreads/src/app/_components/HeroSection.tsx` (parallax + image carousel)
- **Example image section**: `apps/aseesthreads/src/app/_components/ValuesSection.tsx` (background image + overlay + backdrop-blur cards)
- **Example CTA**: `apps/aseesthreads/src/app/_components/CtaSection.tsx` (parallax scale + image background)
- **Example terragrunt**: `terraform/stores/hairfordays/prod/terragrunt.hcl`
- **Example init yaml**: `init/hairlukgud.yaml`
