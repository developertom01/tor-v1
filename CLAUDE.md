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

# Infrastructure (Terragrunt — requires Doppler + Terraform Cloud)
task tg:plan APP=hairlukgud ENV=dev    # Plan store env changes
task tg:apply APP=hairlukgud ENV=prod  # Apply store env changes
task tg:doppler APP=hairlukgud ENV=dev # Create/update store Doppler project
task tg:vercel APP=hairlukgud ENV=dev  # Create Vercel project (once per store)
task tg:resend APP=hairlukgud ENV=dev  # Register Resend domain (once per store)
task tg:all APP=hairlukgud ENV=dev     # Run full store provision pipeline
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
- **`terraform/`** — Terragrunt/Terraform IaC (Vercel, Supabase, Google OAuth, Doppler secrets, Resend)
- **`init/`** — YAML config files per store for provisioning
- **`scripts/`** — inject-pages.mjs, clean-pages.mjs, seed-admin-credentials.mjs, seed-store.mjs

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
3. **Email signup**: `supabaseAdmin.auth.admin.createUser()` with `email_confirm: true` — bypasses Supabase emails entirely. A random global password is generated, encrypted (AES-256-GCM), and stored in `user_credentials`. A bcrypt hash of the user's chosen password is stored in `profiles.hashed_password`.
4. **Email sign-in**: decrypts global password from `user_credentials`, signs in via Supabase auth, then validates the user's password against `profiles.hashed_password`.
5. **Email verification**: token stored in `email_verification_tokens`, sent via Resend. Sign-in blocks if `profiles.email_verified = false`.
6. **Password reset**: own token in `password_reset_tokens`, email sent via Resend. No Supabase `generateLink` used.
7. Database trigger auto-creates a `profiles` row on signup.
8. Admin access: `profiles.role = 'admin'` — checked by `isAdmin()` in admin layout.

### Supabase clients

Three client types in `packages/lib/supabase/`:
- `server.ts` — SSR-safe, reads/sets cookies (use in server components and actions)
- `client.ts` — Browser client with localStorage (use in client components)
- `admin.ts` — Service role key, server-only (bypasses RLS)

### Database

Shared migrations in `supabase/migrations/` (symlinked into each app). Each app runs its own local Supabase instance on different ports.

Key tables: `profiles`, `products`, `product_variants`, `product_media`, `orders`, `order_items`, `product_requests`, `request_tokens`, `order_payment_tokens`, `order_status_history`, `stores`, `user_credentials`, `email_verification_tokens`, `password_reset_tokens`. All have RLS policies. UUIDs via `gen_random_uuid()`.

`profiles` has extra columns: `hashed_password` (bcrypt of store password), `email_verified` (boolean, default false — set true after verification or for Google/admin users).
`user_credentials` stores the AES-256-GCM encrypted global Supabase auth password per user (used by the sign-in flow to authenticate with Supabase).

### Store isolation

Each store is identified by `NEXT_PUBLIC_STORE_ID` env var. `getStoreId()` from `packages/lib/store-id.ts` provides this at runtime. Tables use `store_id` for data isolation across tenants.

### Payments

Paystack inline popup. Checkout creates order (pending) → Paystack popup → on success redirects to `/checkout/success?reference=X` → `verifyPaystackPayment()` server-side. Webhook at `/api/paystack-webhook` is signature-verified.

### Env vars

Uses new Supabase key naming: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (not `ANON_KEY`) and `SUPABASE_SECRET_KEY` (not `SERVICE_ROLE_KEY`). See `apps/*/.env.example` for full list.

### Emails

All emails go through Resend — Supabase email is bypassed entirely. Functions in `packages/lib/email.ts`:
- `sendWelcomeEmail` — on new signup
- `sendNewStoreNotificationEmail` — when an existing user signs up for another store
- `sendVerificationEmail` — email verification link (token from `email_verification_tokens`)
- `sendPasswordResetEmail` — password reset link (token from `password_reset_tokens`)
- Order confirmation, receipt, status update emails — must include item details with thumbnails via `orderItemsTableHtml()`

PDF receipts generated via pdfkit (`packages/lib/receipt.ts`). `FROM_EMAIL` and `RESEND_API_KEY` are set per-store in Doppler/Vercel.

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

### Avoid useEffect — handle events in handlers

**Never use `useEffect` for event-driven logic.** Mouse events, clicks, keyboard events, and focus/blur should be handled directly in event handler props (`onClick`, `onKeyDown`, `onFocus`, `onBlur`, etc.). `useEffect` is only acceptable for true side-effects with no event trigger: data fetching on mount, syncing with an external system, or cleanup. If you find yourself writing `useEffect` to react to a user interaction, move the logic into the event handler instead.

### Never use native `<select>` — always use the custom Select component

**Never use the native HTML `<select>` element.** Always use the custom `Select` component from `@tor/ui`. If a use case requires a feature the component doesn't have (e.g. searchable options, images in options), add that feature to the shared component rather than reaching for a native element or one-off implementation.

## Important patterns

- Each app's `globals.css` must include `@source` directives for all shared packages, or Tailwind won't detect their classes
- Each app has its own `supabase/config.toml` with unique ports so both can run simultaneously
- The `supabase/migrations/` dir in each app is a symlink to the root `supabase/migrations/`
- Next.js 16 has breaking changes from prior versions — check `node_modules/next/dist/docs/` before writing code
- `next.config.ts` must list all `@tor/*` packages in `transpilePackages` and server-only native deps (e.g. `pdfkit`) in `serverExternalPackages`
- CI: `db-push.yml` auto-pushes migrations on merge to main/dev; `provision-store-init.yml` manages infra via Terragrunt with jobs: `shared-supabase` → `common-doppler` → `common-env` → `vercel-project` + `doppler-project` + `resend-domain` (parallel) → `provision-store` → `post-provision` (migrations + admin seed)
- Vercel Pro: one project per store, dev and prod are branch deployments (`main` = prod, `dev` = dev). No separate Vercel projects per env.
- `scripts/seed-admin-credentials.mjs` — seeds `user_credentials` + `profiles.hashed_password` for admin after provisioning. Requires: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `AUTH_ENCRYPTION_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_STORE_ID`

@apps/hairlukgud/CLAUDE.md
@apps/hairfordays/CLAUDE.md
