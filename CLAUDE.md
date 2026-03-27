# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Monorepo (from root)
task dev                          # Start all apps in dev mode
task dev APP=hairlukgud           # Start one app
task build                        # Build all
task build APP=hairfordays        # Build one app
task lint                         # Lint all
task test                         # Test all
task inject                       # Inject shared pages into all apps
task clean:pages                  # Remove injected pages from all apps
task install                      # npm install

# Database (each app has its own Supabase instance)
task db:start                     # Start all Supabase instances
task db:start APP=hairlukgud      # Start one
task db:stop                      # Stop all
task db:reset                     # Reset + re-run migrations + seed

# From within an app directory
npm run db:push                   # Push migrations to remote Supabase
npm run db:migrate                # Create new migration file
npm run db:link                   # Link to remote Supabase project

# Provisioning a new store
npm run provision                 # node provisioner/bin/provision.mjs <store-name>
```

## Architecture

Multi-tenant e-commerce monorepo for hair businesses in Ghana. Two independent stores share a single codebase via shared packages and a page injection system. Next.js 16 App Router, Supabase (Postgres + Auth + Storage), Paystack payments. Currency is GHS (Ghana Cedis).

### Monorepo structure

- **`apps/hairlukgud`** — Hair Luk Gud GH store (pink theme, ports 54321-54329)
- **`apps/hairfordays`** — Hair For Days store (teal theme, ports 54331-54339)
- **`packages/lib`** (`@tor/lib`) — Server actions, Supabase clients, types, utils, email, cart context, Paystack hook, logging (Pino)
- **`packages/ui`** (`@tor/ui`) — Shared UI components: ProductCard, AddToCartButton, Dialog, Toast, Animate, Select
- **`packages/pages`** (`@tor/pages`) — Shared page templates injected into apps at dev/build time
- **`packages/store`** (`@tor/store`) — Store config types and context (StoreConfig, useStore hook)
- **`supabase/`** — Shared migrations and seed.sql (symlinked into each app's `supabase/` dir)
- **`provisioner/`** — Automated store provisioning (Vercel, Supabase, Google OAuth, Resend)
- **`init/`** — YAML config files per store for the provisioner
- **`scripts/`** — inject-pages.mjs, clean-pages.mjs

### Page injection system

`packages/pages/` contains shared page files (admin, auth, products, checkout, etc.). The `scripts/inject-pages.mjs` script copies them into each app's `src/app/` directory. The `dev` script runs this with `--watch` for hot reload.

- Injected files are tracked via `src/app/.injected` manifest
- A generated `src/app/.gitignore` prevents committing injected files (brackets escaped for git glob)
- **Local overrides**: If an app already has a file at that path (not previously injected), injection skips it
- App-specific files that stay committed: `layout.tsx`, `page.tsx`, `globals.css`, `favicon.ico`

When adding new shared pages, add them to `packages/pages/`. When an app needs a custom version, create the file directly in the app's `src/app/` — it will take precedence.

### Server-first pattern

- **Server components** are the default. Pages call server actions directly.
- **Server actions** in `packages/lib/actions/` handle all database reads and mutations.
- **Client components** (`'use client'`) only for interactivity: cart, forms, media gallery, Paystack popup.
- Only API route: `/api/paystack-webhook` (Paystack posts to it externally).
- Cart state lives in React Context + localStorage (no server involvement).

### Auth flow

1. `middleware.ts` refreshes Supabase auth session on every request via cookies.
2. Google OAuth via `signInWithGoogle()` → Google → `/auth/callback` route.
3. Database trigger auto-creates a `profiles` row on signup.
4. Admin access: `profiles.role = 'admin'` — checked by `isAdmin()` in admin layout.

### Supabase clients

Three client types in `packages/lib/supabase/`:
- `server.ts` — SSR-safe, reads/sets cookies (use in server components and actions)
- `client.ts` — Browser client with localStorage (use in client components)
- `admin.ts` — Service role key, server-only (bypasses RLS)

### Database

Shared migrations in `supabase/migrations/` (symlinked into each app). Each app runs its own local Supabase instance on different ports.

Key tables: `profiles`, `products`, `product_variants`, `product_media`, `orders`, `order_items`, `product_requests`, `request_tokens`, `order_payment_tokens`, `order_status_history`. All have RLS policies. UUIDs via `gen_random_uuid()`.

### Payments

Paystack inline popup. Checkout creates order (pending) → Paystack popup → on success redirects to `/checkout/success?reference=X` → `verifyPaystackPayment()` server-side. Webhook at `/api/paystack-webhook` is signature-verified.

### Env vars

Uses new Supabase key naming: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (not `ANON_KEY`) and `SUPABASE_SECRET_KEY` (not `SERVICE_ROLE_KEY`). See `apps/*/.env.example` for full list.

### Emails

Resend for transactional emails. All order-related emails must include item details with thumbnails using the shared `orderItemsTableHtml()` helper in `packages/lib/email.ts`.

## Style

- Tailwind CSS 4 with `@theme inline` per app — each app defines its own brand colors in `globals.css`
- `@source` directives in `globals.css` tell Tailwind to scan `packages/` for class names
- Icons: `lucide-react`
- Animations: `framer-motion`
- Charts: `recharts` (admin dashboard)

## Rules — READ BEFORE WRITING ANY CODE

### Write in packages, never in apps

All code goes in the shared packages (`packages/pages`, `packages/lib`, `packages/ui`, `packages/store`). The injection system copies pages into apps automatically. **Never edit files inside `apps/*/src/app/` for shared functionality** — those are generated. The only app-specific files are `layout.tsx`, `page.tsx`, `globals.css`, `favicon.ico`, and component overrides like `Navbar.tsx`/`Footer.tsx`.

### No hardcoded colors — everything comes from config

**Never use implicit/hardcoded color values** in shared code. All colors must reference the theme tokens defined in each app's `globals.css` (`brand-50` through `brand-900`, `gold-400/500/600`). Use `text-brand-600`, `bg-brand-100`, etc. — never `text-pink-600`, `text-teal-500`, `bg-[#14b8a6]`, or any literal color. Each store has its own brand palette; shared components must be color-agnostic.

### Everything is config-driven

Store-specific values (name, tagline, domain, categories, contact info, theme, hero content) live in `@tor/store` config accessed via `useStore()`. Shared components and pages must read from store config — never hardcode store names, domains, categories, or copy. If a value differs between stores, it belongs in the store config.

## Important patterns

- Each app's `globals.css` must include `@source` directives for all shared packages, or Tailwind won't detect their classes
- Each app has its own `supabase/config.toml` with unique ports so both can run simultaneously
- The `supabase/migrations/` dir in each app is a symlink to the root `supabase/migrations/`
- Next.js 16 has breaking changes from prior versions — check `node_modules/next/dist/docs/` before writing code

@apps/hairlukgud/CLAUDE.md
@apps/hairfordays/CLAUDE.md
