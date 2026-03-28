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

## Change Propagation Map

When a value changes, you often need to update multiple files. Use this map:

| What changed | Files to update |
|---|---|
| **Brand colors** | `store.config.ts` (theme.brand), `globals.css` (@theme inline + .hero-gradient + .gold-gradient) |
| **Store name / display name** | `store.config.ts` (name), `layout.tsx` (metadata), `page.tsx` (copy referencing store name), `CLAUDE.md`, `init/{slug}.yaml`, terragrunt locals (display_name) |
| **Domain** | `store.config.ts` (domain), `init/{slug}.yaml`, `terraform/stores/{slug}/dev/terragrunt.hcl` (locals), `terraform/stores/{slug}/prod/terragrunt.hcl` (locals), `.env.example` |
| **Contact info** | `store.config.ts` (contact) only |
| **Categories** | `store.config.ts` (categories), `page.tsx` (if categories are referenced in landing page copy), `supabase/seeds/{slug}.json` (update `category` field on every product to use the new category slugs — the seed script always deletes and re-inserts, so stale slugs will break filtering) |
| **Hero / landing page copy** | `store.config.ts` (hero), `page.tsx` (landing page content) |
| **Landing page design** | `page.tsx` only |
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

### Edit-specific rules

- **Minimal changes.** Only touch files affected by the change. If the user wants a new tagline, update `store.config.ts` and nothing else.
- **Preserve what works.** Don't "improve" or refactor code that isn't part of the change request. If the landing page works fine and they just want a color change, don't rewrite the landing page.
- **Keep colors in sync.** If brand colors change, both `store.config.ts` and `globals.css` must be updated together. The hex values in `@theme inline` must match `store.config.ts`.
- **Landing page rewrites are creative.** If the user asks for a new landing page or major copy changes, design something that feels completely different from the existing stores' pages. Every store's landing page should have its own personality — different hero layout, section order, visual rhythm, CTA style, icon choices, and typography. Read `apps/hairlukgud/src/app/page.tsx` (bright, playful, split hero) and `apps/hairfordays/src/app/page.tsx` (dark, editorial, full-height stacked type) to see how different two stores can be, then make yours equally distinct. Vary hero layouts (full-height editorial, split, centered minimal, asymmetric), section headers (gold line + uppercase, centered, left-aligned large type), CTA styles (gold gradient, outlined, underlined), and icons (`Crown`, `Gem`, `Flame`, `Feather`, etc. — not the same `Truck`/`Shield`/`Star` every time). The one required section is Featured Products with the `ProductCard` grid. But if they just want a word changed, change the word.

## Reference Files

Read these to understand exact formats before editing:

- **StoreConfig type**: `packages/store/index.ts`
- **Example store config**: `apps/hairlukgud/src/store.config.ts`
- **Example globals.css**: `apps/hairlukgud/src/app/globals.css`
- **Example layout.tsx**: `apps/hairlukgud/src/app/layout.tsx`
- **Example page.tsx**: `apps/hairlukgud/src/app/page.tsx`
- **Example terragrunt**: `terraform/stores/hairfordays/prod/terragrunt.hcl`
- **Example init yaml**: `init/hairlukgud.yaml`
