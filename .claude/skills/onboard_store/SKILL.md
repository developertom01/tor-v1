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

This is where you shine. Based on the store's name, categories, and description, craft a **compelling, conversion-focused landing page** that feels premium, modern, and aspirational.

Think like a creative director. The landing page is the store's first impression. It should make visitors want to buy.

**Every store's landing page must feel different.** Do NOT copy the layout or structure from existing stores. Each store has its own personality, and the page should reflect that.

#### Required visual quality bar

Every landing page MUST have:

- **Real background images from Unsplash** — not placeholder colors. Find, download, and upload them to Supabase Storage before writing any component code. See the image workflow below.
- **Parallax scrolling** on the hero and at least one other section — use framer-motion `useScroll` + `useTransform` in a `'use client'` component
- **Brand color overlay** on all background images — `bg-brand-900/75` (or similar opacity) so the store's color always reads through
- **Gradient vignettes** to blend image edges into sections — `bg-gradient-to-t from-brand-900 via-transparent to-transparent` etc.
- **`gold-text` class for gradient text** — NEVER use `bg-clip-text text-transparent gold-gradient` on a `block` element (it renders as a solid gold rectangle). Use the `.gold-text` CSS class defined in `globals.css` instead.
- **Staggered entrance animations** on all sections using `Animate` from `@tor/ui/Animate` or framer-motion `whileInView` with staggered delays
- **`backdrop-blur-sm`** on cards that sit over background images — gives a frosted glass feel
- **Rotating/crossfading images** in the hero if multiple images are available (auto-rotate every 5s with 1s CSS transition)

#### Image workflow — do this BEFORE writing components

1. **Search Unsplash** for 3 high-quality images that match the store's products and vibe (search terms like the product type + "fashion editorial" or "Ghana lifestyle")
2. **Download them** to a temp location: `curl -L "{url}" -o /tmp/{slug}-hero-{n}.jpg`
3. **Upload to local Supabase Storage**:
   - `curl -s -X POST "http://127.0.0.1:54321/storage/v1/object/products/assets/{slug}-hero-{n}.jpg" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU" -H "Content-Type: image/jpeg" --data-binary "@/tmp/{slug}-hero-{n}.jpg"`
4. **Upload to dev remote Supabase Storage**: get URL + key via `doppler run --project {slug} --config dev -- env | grep SUPABASE`, then POST to `{SUPABASE_URL}/storage/v1/object/products/assets/{slug}-hero-{n}.jpg`
   - If the store's dev Doppler config doesn't exist yet (command fails or returns no output), fall back to the provisioner project: `doppler run --project provisioner --config dev -- env | grep SUPABASE`
   - If that also fails or the upload returns non-200, skip and leave a note: "⚠️ Dev hero images not uploaded — dev Supabase not reachable. Re-upload after provisioning with: `doppler run --project {slug} --config dev -- env | grep SUPABASE`"
5. **Keep the downloaded `/tmp/{slug}-hero-{n}.jpg` files** — they are needed again in Phase 4 for the prod upload.
6. **Reference images via env var** in components — NEVER commit images to the repo or put them in `public/`:
   ```ts
   const STORAGE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products`
   const images = [`${STORAGE}/assets/{slug}-hero-1.jpg`, ...]
   ```
7. **Use `next/image`** with `fill` + `object-cover` for background images — never `<img>` tags

Do NOT skip this step and use Unsplash URLs directly in the seed/components — images must live in Supabase Storage so they work in all environments and don't depend on Unsplash availability.

#### Section architecture

Split the page into a server component (`page.tsx`) that fetches data, and `'use client'` components in `src/app/_components/` for animated sections. Rules:

- **Only make a component `'use client'`** if it genuinely needs `useScroll`, `useTransform`, or `useState` (e.g. image carousel, parallax hero). Otherwise use the server-renderable `Animate` wrapper from `@tor/ui/Animate`.
- **Hero** — always `'use client'` (needs `useScroll` for parallax + `useState` for image rotation)
- **CTA section** — `'use client'` if it has parallax scale effect
- **All other sections** (Categories, Values, Testimonials, Featured Products) — server components using `Animate`

#### Design variation guidelines

Vary these per store — never repeat the same layout:

- **Hero layout**: Full-height editorial stacked type, split with imagery, centered minimal, asymmetric floating elements
- **Section order**: Mix it up — not every store needs Hero → Categories → Products → Values → Testimonials → CTA
- **Visual rhythm**: Alternate dark (`bg-brand-900`) and light (`bg-white`, `bg-brand-50`) sections. Use image-backed sections for at least 3 of them.
- **Typography**: Luxury = large type + generous whitespace. Playful = tighter, more energetic
- **CTA style**: Gold gradient buttons, outlined, underlined text links, icon-led
- **Section headers**: Gold line + uppercase tracking, centered with subtitles, left-aligned large type — vary per store
- **Icons**: Use store-appropriate `lucide-react` icons. Never default to Truck/Shield/Star. `Crown`, `Gem`, `Heart`, `Zap`, `Sparkles`, `Flame`, `Award`, `Feather` are all available

#### Design constraints (non-negotiable)

- All colors must use theme tokens: `brand-50` through `brand-900`, `gold-400/500/600`. NEVER use literal color names (`text-pink-600`, `text-teal-500`) or hardcoded hex in JSX.
- Use `.hero-gradient`, `.gold-gradient`, `.glass-card` CSS classes for branded backgrounds
- Use `.gold-text` for gradient text — NOT `bg-clip-text text-transparent gold-gradient` on block elements
- Icons from `lucide-react` only
- `page.tsx` must be a server component. Featured products fetched via `getProducts()`.
- **Always include a Featured Products section** — use the `ProductCard` grid
- `FeaturedProductsSection` props must use `ProductWithMedia[]` from `@tor/lib/types` — not a loose `{ id: string; [key: string]: unknown }[]` interface (causes TypeScript errors that hang the dev compiler)
- Include JSON-LD structured data at the bottom of `page.tsx`

### Layout metadata (`src/app/layout.tsx`)

Generate compelling SEO metadata (title, description, keywords, OpenGraph, Twitter cards) based on the store's name, products, and location. Think about what someone in Ghana would search for.

### Seed products (`supabase/seeds/{slug}.json`)

Create a per-store JSON seed file at `supabase/seeds/{slug}.json`. CI runs `node scripts/seed-store.mjs {slug}` which reads this file and inserts via the Supabase REST API — no hardcoded UUIDs, fully idempotent (skips existing slugs).

The JSON file should contain:
- `display_name` and `domain` for the store row
- `products` array with 8-14 realistic products, each having: `name`, `slug`, `description`, `price`, `compare_at_price` (optional), `category`, `in_stock`, `stock_quantity`, `featured`, `image_url`

For `image_url`: use Unsplash URLs for seed data (these are product images, not hero images — they live in the DB not storage). Use the format `https://images.unsplash.com/photo-{id}?w=800&q=80`. Find real, relevant photo IDs.

Mark 4-5 products as `featured: true`.

Also add the store row to `supabase/seed.sql` so local `db:reset` includes it.

Reference `supabase/seeds/hairlukgud.json` or `supabase/seeds/hairfordays.json` for the exact format.

## Code Rules (enforce in all generated code)

- **Avoid `useEffect` for event-driven logic.** Handle mouse events, clicks, keyboard, focus/blur directly in event handler props. `useEffect` is only for true side-effects: data fetching on mount, syncing with an external system, or cleanup.
- **Never use native `<select>`.** Always use the custom `Select` component from `@tor/ui`. If the component lacks a needed feature, extend the shared component.
- **`FeaturedProductsSection` must use `ProductWithMedia[]`** from `@tor/lib/types` — not a generic interface. Loose types cause TypeScript errors that make the dev server hang on every recompile.
- **Gold gradient text must use `.gold-text` CSS class** — not `bg-clip-text text-transparent gold-gradient` on `block` elements. That renders as a solid gold rectangle in the browser.
- **Images go in Supabase Storage, not `public/`** — reference via `NEXT_PUBLIC_SUPABASE_URL` env var so they work locally and in production without code changes.

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

### Phase 2: Find and upload hero images FIRST

Before spawning build agents, do the image workflow:

1. Search Unsplash for 3 images matching the store's products/vibe
2. Download to `/tmp/{slug}-hero-{1,2,3}.jpg`
3. Upload to local Supabase Storage (`products/assets/` path)
4. Upload to dev remote Supabase Storage (credentials from `doppler run --project {slug} --config dev`, or provisioner if store not yet provisioned)
5. Confirm all 6 uploads succeeded before proceeding
6. **Do NOT delete the `/tmp` files** — they are needed in Phase 4 for the prod upload

### Phase 3: Build in parallel

**Spawn all 4 agents in a single message simultaneously.** Pass the full confirmed store config AND the confirmed Supabase Storage image paths to each agent.

| Agent | File | Covers |
|-------|------|--------|
| **Agent A** | `onboard_store-app` | App directory, store.config.ts, globals.css, layout.tsx, page.tsx, supabase config, symlinks, env, branding assets |
| **Agent B** | `onboard_store-terraform` | terraform/stores/{slug}/ — doppler, dev, prod, **vercel, resend** terragrunt.hcl |
| **Agent C** | `onboard_store-seed` | supabase/seeds/{slug}.json, init/{slug}.yaml, supabase/seed.sql |
| **Agent D** | `onboard_store-ci` | CI workflow update, apps/{slug}/CLAUDE.md, apps/{slug}/AGENTS.md |

Wait for all 4 to return before proceeding.

### Phase 4: Verify + upload prod images

Once all agents complete:
- Run `task inject` — copies proxy.ts and all shared pages into the app
- Run a build (`npx next build` inside the app dir) to catch TypeScript errors before the user tries to dev
- Confirm the supabase/migrations symlink is correct
- **Upload hero images to prod Supabase Storage**: get URL + key via `doppler run --project {slug} --config prod -- env | grep SUPABASE`, then POST each `/tmp/{slug}-hero-{n}.jpg` to `{SUPABASE_URL}/storage/v1/object/products/assets/{slug}-hero-{n}.jpg`.
  - If the Doppler prod config doesn't exist yet (command fails or returns no output), skip and leave this note for the user: "⚠️ Prod hero images not uploaded — prod Supabase not provisioned yet. Run `task tg:all APP={slug} ENV=prod` then re-upload with: `doppler run --project {slug} --config prod -- env | grep SUPABASE`"
  - If the upload returns a non-200 (bucket missing, infra not ready), skip and leave the same note.
  - If all 3 return 200, confirm success.
- List all created files for the user to review

## Reference Files

When you need to understand the exact format or structure, read these files:

- **StoreConfig type**: `packages/store/index.ts`
- **Example store config**: `apps/hairlukgud/src/store.config.ts` or `apps/hairfordays/src/store.config.ts`
- **Example globals.css**: `apps/hairlukgud/src/app/globals.css`
- **Example layout.tsx**: `apps/hairlukgud/src/app/layout.tsx`
- **Example page.tsx**: `apps/aseesthreads/src/app/page.tsx` (best reference — server component composing client sections)
- **Example hero component**: `apps/aseesthreads/src/app/_components/HeroSection.tsx` (parallax + image carousel)
- **Example values component**: `apps/aseesthreads/src/app/_components/ValuesSection.tsx` (image background + overlay)
- **Example CTA component**: `apps/aseesthreads/src/app/_components/CtaSection.tsx` (parallax scale + image)
- **Example config.toml**: `apps/hairlukgud/supabase/config.toml` and `apps/hairfordays/supabase/config.toml`
- **Example terragrunt**: `terraform/stores/hairfordays/prod/terragrunt.hcl`
- **Example init yaml**: `init/hairlukgud.yaml`
- **Seed data**: `supabase/seeds/hairlukgud.json` or `supabase/seeds/aseesthreads.json`
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
- **`proxy.ts` not `middleware.ts`**: Next.js 16 renamed middleware to proxy. Each app has `src/proxy.ts` that re-exports the function from `@tor/lib/proxy` with a static `config` matcher.
