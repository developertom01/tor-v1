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

**Hair For Days** — e-commerce app for a hair business in Ghana. Next.js 16 App Router, Supabase (Postgres + Auth + Storage), Paystack payments. Currency is GHS (Ghana Cedis).

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
2. Google OAuth via `signInWithGoogle()` server action → redirects to Google → callback at `/auth/callback`.
3. Database trigger auto-creates a `profiles` row on signup.
4. Admin access: `profiles.role = 'admin'` — checked by `isAdmin()` in admin layout.

### Key directories

- `src/lib/actions/` — Server actions: `products.ts`, `orders.ts`, `auth.ts`
- `src/lib/supabase/` — Three clients: `server.ts` (SSR with cookies), `client.ts` (browser), `admin.ts` (service role, server-only)
- `src/components/` — Shared UI: Navbar, Footer, ProductCard, AddToCartButton
- `supabase/migrations/` — Database schema (tables, RLS policies, triggers)
- `supabase/seed.sql` — Seed data with Unsplash product images

### Database (Supabase Postgres)

Tables: `profiles`, `products`, `product_media`, `orders`, `order_items`. All have RLS policies. Products use `gen_random_uuid()` (not `uuid_generate_v4()`). The `product_media` table supports both images and videos with a `type` field and `sort_order`.

### Payments

Checkout creates an order (status: pending) → opens Paystack inline popup → on success, redirects to `/checkout/success?reference=X` which calls `verifyPaystackPayment()` server-side. Paystack webhook at `/api/paystack-webhook` also marks orders paid (signature-verified).

### Product images

Stored in Supabase Storage (`products` bucket, public). Admin uploads via `MediaManager.tsx` using the browser Supabase client. External URLs (Unsplash, etc.) also supported via "Add by URL". `next.config.ts` allows images from `res.cloudinary.com`, `*.supabase.co`, and `images.unsplash.com`.

### Env vars

Uses new Supabase key naming: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (not `ANON_KEY`) and `SUPABASE_SECRET_KEY` (not `SERVICE_ROLE_KEY`).

### Emails

All order-related emails must include item details (product name, variant name, quantity, price) with product image thumbnails. Use the shared `orderItemsTableHtml()` helper in `src/lib/email.ts` for consistent formatting across all email templates.

## Style

- Tailwind CSS 4 with custom `@theme inline` — brand colors are `brand-50` through `brand-900` (teal) and `gold-400/500/600`.
- Icons: `lucide-react`.
- Products page uses infinite scroll (Intersection Observer) with SSR for the initial 12 products.

@AGENTS.md
