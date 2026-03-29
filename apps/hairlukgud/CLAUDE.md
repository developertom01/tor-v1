# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Start dev server
npm run build            # Production build
npm run lint             # ESLint
npm run db:start         # Start local Supabase (needs Docker)
npm run db:stop          # Stop local Supabase
npm run db:reset         # Reset local DB, re-run migrations + seed
npm run db:push          # Push migrations to remote Supabase
npm run db:migrate       # Create new migration file
npm run db:link          # Link to remote Supabase project
npm run db:status        # Show local Supabase URLs & keys
```

## Architecture

**Hair Luk Gud GH** — e-commerce app for a wig business in Ghana. Next.js 16 App Router, Supabase (Postgres + Auth + Storage), Paystack payments. Currency is GHS (Ghana Cedis).

### Server-first pattern — no API/frontend split

- **Server components** are the default. Pages fetch data by calling server actions directly.
- **Server actions** (`src/lib/actions/`) handle all database reads and mutations. No API routes except the Paystack webhook.
- **Client components** (`'use client'`) only where interactivity is required: cart state, forms, media gallery, Paystack popup.
- Only API route: `/api/paystack-webhook` — required because Paystack posts to it externally.

### Data flow

Pages (server components) → call server actions → query Supabase → render HTML.
Client components call server actions for mutations (e.g., `createOrder`, `addProductMedia`).
Cart state lives in React Context + localStorage (no server involvement).

### Auth flow

1. `src/middleware.ts` refreshes Supabase auth session on every request via cookies.
2. Google OAuth via `signInWithGoogle()` → Google → callback at `/auth/callback`.
3. Email signup: `supabaseAdmin.auth.admin.createUser()` with `email_confirm: true` — bypasses Supabase emails. Global password encrypted in `user_credentials`, bcrypt hash in `profiles.hashed_password`.
4. Email sign-in: decrypts global password → signs in via Supabase, validates against `profiles.hashed_password`. Blocks if `email_verified = false`.
5. Email verification + password reset handled entirely in-house via `email_verification_tokens` / `password_reset_tokens` tables and Resend. No Supabase-generated links.
6. Database trigger auto-creates a `profiles` row on signup.
7. Admin access: `profiles.role = 'admin'` — checked by `isAdmin()` in admin layout.

### Key directories

- `src/lib/actions/` — Server actions: `products.ts`, `orders.ts`, `auth.ts`
- `src/lib/supabase/` — Three clients: `server.ts` (SSR with cookies), `client.ts` (browser), `admin.ts` (service role, server-only)
- `src/components/` — Shared UI: Navbar, Footer, ProductCard, AddToCartButton
- `supabase/migrations/` — Database schema (tables, RLS policies, triggers)
- `supabase/seed.sql` — Seed data with Unsplash product images

### Database (Supabase Postgres)

Tables: `profiles`, `products`, `product_media`, `orders`, `order_items`, `stores`, `user_credentials`, `email_verification_tokens`, `password_reset_tokens`. All have RLS policies. Products use `gen_random_uuid()` (not `uuid_generate_v4()`). The `product_media` table supports both images and videos with a `type` field and `sort_order`.

`profiles` has `hashed_password` (bcrypt) and `email_verified` (boolean) columns. `user_credentials` holds the AES-256-GCM encrypted global Supabase auth password per user.

### Payments

Checkout creates an order (status: pending) → opens Paystack inline popup → on success, redirects to `/checkout/success?reference=X` which calls `verifyPaystackPayment()` server-side. Paystack webhook at `/api/paystack-webhook` also marks orders paid (signature-verified).

### Product images

Stored in Supabase Storage (`products` bucket, public). Admin uploads via `MediaManager.tsx` using the browser Supabase client. External URLs (Unsplash, etc.) also supported via "Add by URL". `next.config.ts` allows images from `res.cloudinary.com`, `*.supabase.co`, and `images.unsplash.com`.

### Env vars

Uses new Supabase key naming: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (not `ANON_KEY`) and `SUPABASE_SECRET_KEY` (not `SERVICE_ROLE_KEY`).

### Emails

All emails via Resend — Supabase email is bypassed entirely. Auth emails (welcome, verification, password reset) and order emails are all sent from `@tor/lib/email.ts`. Order emails must include item details with thumbnails via `orderItemsTableHtml()`. `FROM_EMAIL` comes from the store's Doppler/Vercel env vars.

## Style

- Tailwind CSS 4 with custom `@theme inline` — brand colors are `brand-50` through `brand-900` (pink) and `gold-400/500/600`.
- Icons: `lucide-react`.
- Products page uses infinite scroll (Intersection Observer) with SSR for the initial 12 products.

## Rules

- **Avoid `useEffect` for event-driven logic.** Handle mouse events, clicks, keyboard, focus/blur directly in event handler props. `useEffect` is only for true side-effects: data fetching on mount, syncing with an external system, or cleanup.
- **Never use native `<select>`.** Always use the custom `Select` component from `@tor/ui`. If the component lacks a needed feature (e.g. search, images in options), extend the shared component — don't use a native element or one-off solution.

@AGENTS.md
