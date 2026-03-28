# Onboarding a New Store

Step-by-step guide for adding a new store to the monorepo. Uses **hairfordays** as the reference example.

---

## Prerequisites

Before you begin, gather from the store owner:

| Info | Example | Notes |
|------|---------|-------|
| Store name (slug) | `hairfordays` | Lowercase, no spaces. Used as `store_id` everywhere |
| Display name | `Hair For Days` | Human-readable, shown in UI |
| Domain | `hairfordays.com` | Must be purchased and DNS accessible |
| Contact phone | `+233 XX XXX XXXX` | Shown on site |
| Contact email | `hello@hairfordays.com` | Shown on site |
| Contact location | `Accra, Ghana` | Shown on site |
| Brand colors | Teal palette | 50-900 scale + gold accents |
| Categories | Wigs, Extensions, etc. | Product categories for the store |
| Hero copy | Title, subtitle, CTA | Landing page content |
| Admin email | `admin@hairfordays.com` | First admin user for the store |
| Paystack keys | Public + secret | From Paystack dashboard |
| Resend API key | `re_xxx` | From Resend dashboard |
| Google OAuth credentials | Client ID + secret | From Google Cloud Console (shared project) |

---

## Code Structure Overview

```
tor/
├── apps/
│   ├── hairlukgud/          # Existing store
│   └── hairfordays/         # New store (you create this)
│       ├── src/
│       │   ├── app/
│       │   │   ├── layout.tsx       # App-specific (custom per store)
│       │   │   ├── page.tsx         # App-specific (landing page)
│       │   │   ├── globals.css      # App-specific (theme colors)
│       │   │   ├── favicon.ico      # App-specific
│       │   │   └── ... (injected)   # Auto-copied from packages/pages/
│       │   ├── components/          # Store-specific component overrides (optional)
│       │   ├── store.config.ts      # Store configuration (required)
│       │   └── middleware.ts        # Supabase auth refresh (same across stores)
│       ├── supabase/
│       │   ├── config.toml          # Local Supabase ports (unique per store)
│       │   └── migrations -> ../../supabase/migrations  # Symlink to shared
│       ├── next.config.ts
│       ├── package.json
│       ├── tsconfig.json
│       └── .env.example
├── packages/
│   ├── lib/       (@tor/lib)    # Server actions, Supabase clients, utils
│   ├── ui/        (@tor/ui)     # Shared UI components
│   ├── pages/     (@tor/pages)  # Shared page templates (injected into apps)
│   └── store/     (@tor/store)  # Store config types + React context
├── supabase/
│   ├── migrations/              # Shared DB schema (all stores use same tables)
│   └── seed.sql                 # Seed data (add new store's products here)
├── terraform/
│   ├── shared/supabase/         # Shared Supabase project (one for all stores)
│   ├── stores/{store}/          # Per-store infra (Vercel, Doppler, etc.)
│   └── modules/                 # Reusable Terraform modules
├── init/
│   └── {store}.yaml             # Provisioning config per store
└── scripts/
    └── inject-pages.mjs         # Copies shared pages into apps
```

### What's shared vs. store-specific

| Shared (don't duplicate) | Store-specific (you create) |
|---|---|
| `packages/pages/*` (all routes) | `src/app/layout.tsx` (metadata, fonts) |
| `packages/lib/*` (actions, clients) | `src/app/page.tsx` (landing page) |
| `packages/ui/*` (components) | `src/app/globals.css` (theme colors) |
| `supabase/migrations/*` (schema) | `src/store.config.ts` (name, colors, copy) |
| `packages/store/*` (types, context) | `supabase/config.toml` (local ports) |
| `scripts/*` (injection, build) | `favicon.ico` |

---

## Step 1: Create the App Directory

Copy an existing store as a starting point:

```bash
cp -r apps/hairlukgud apps/NEWSTORE
```

### Files to customize

#### 1. `apps/NEWSTORE/package.json`

Update the `name` field:

```json
{
  "name": "NEWSTORE",
  "private": true,
  ...
}
```

#### 2. `apps/NEWSTORE/src/store.config.ts`

This is the central config for the store. All shared pages and components read from this.

```typescript
import type { StoreConfig } from '@tor/store'

const config: StoreConfig = {
  name: 'Hair For Days',
  tagline: 'Your tagline here.',
  domain: 'hairfordays.com',
  theme: {
    brand: {
      50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4', 400: '#2dd4bf',
      500: '#14b8a6', 600: '#0d9488', 700: '#0f766e', 800: '#115e59', 900: '#134e4a',
    },
    gold: { 400: '#d4a843', 500: '#c4982f', 600: '#a67c2e' },
    heroGradient: 'linear-gradient(135deg, #134e4a 0%, #0f766e 40%, #14b8a6 100%)',
  },
  categories: [
    { name: 'Wigs', slug: 'wigs', description: 'Premium wigs', emoji: '...' },
    // Add store categories
  ],
  testimonials: [],
  contact: {
    phone: '+233 XX XXX XXXX',
    email: 'hello@hairfordays.com',
    location: 'Accra, Ghana',
  },
  hero: {
    title: 'Your Hair,',
    highlight: 'Your Crown',
    subtitle: 'Store subtitle.',
    cta: 'Shop Now',
    stat: '100+',
    statLabel: 'Happy Customers',
  },
}

export default config
```

#### 3. `apps/NEWSTORE/src/app/globals.css`

Set the brand color palette in the `@theme inline` block. Must match `store.config.ts` values:

```css
@import "tailwindcss";

/* These @source directives tell Tailwind to scan shared packages */
@source "../../../../packages/ui/**/*.tsx";
@source "../../../../packages/lib/**/*.tsx";
@source "../../../../packages/pages/**/*.tsx";
@source "../../../../packages/store/**/*.tsx";

@theme inline {
  --color-brand-50: #f0fdfa;
  --color-brand-100: #ccfbf1;
  /* ... full 50-900 scale ... */
  --color-brand-900: #134e4a;
  --color-gold-400: #d4a843;
  --color-gold-500: #c4982f;
  --color-gold-600: #a67c2e;
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

Also update `.hero-gradient` and `.gold-gradient` CSS classes to match the new colors.

#### 4. `apps/NEWSTORE/src/app/layout.tsx`

Update metadata (title, description, keywords, OpenGraph) for the new store. The component tree stays the same:

```tsx
<StoreProvider config={storeConfig}>
  <CartProvider>
    <ToastProvider>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </ToastProvider>
  </CartProvider>
</StoreProvider>
```

#### 5. `apps/NEWSTORE/src/app/page.tsx`

Customize the landing page hero section, testimonials, and copy. Use `brand-*` and `gold-*` color tokens (never hardcode colors like `text-pink-600` or `text-teal-500`).

#### 6. `apps/NEWSTORE/supabase/config.toml`

Assign **unique ports** so multiple stores can run locally at the same time:

| Port | hairlukgud | hairfordays | Next store |
|------|-----------|-------------|------------|
| API | 54321 | 54331 | 54341 |
| DB | 54322 | 54332 | 54342 |
| Studio | 54323 | 54333 | 54343 |
| Inbucket | 54324 | 54334 | 54344 |
| Realtime | 54325 | 54335 | 54345 |
| Analytics | 54327 | 54337 | 54347 |
| Storage | 54328 | 54338 | 54348 |
| Meta | 54329 | 54339 | 54349 |

Update `project_id` to match the store slug.

#### 7. `apps/NEWSTORE/supabase/migrations` (symlink)

Create a symlink to the shared migrations:

```bash
cd apps/NEWSTORE/supabase
rm -rf migrations
ln -s ../../../supabase/migrations migrations
```

#### 8. `apps/NEWSTORE/.env.example`

Copy from an existing store and update `NEXT_PUBLIC_STORE_ID`:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54341
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
SUPABASE_SECRET_KEY=your-service-role-key

NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxx
PAYSTACK_SECRET_KEY=sk_test_xxx

NEXT_PUBLIC_STORE_ID=NEWSTORE
NEXT_PUBLIC_SITE_URL=http://localhost:3001
NEXT_PUBLIC_BASE_URL=http://localhost:3001

RESEND_API_KEY=re_xxx
FROM_EMAIL=Store Name <orders@domain.com>
```

#### 9. `apps/NEWSTORE/next.config.ts`

Usually no changes needed. Verify `transpilePackages` includes all `@tor/*` packages.

#### 10. Favicon

Replace `apps/NEWSTORE/public/favicon.ico` with the store's branding.

---

## Step 2: Add Seed Data

Edit `supabase/seed.sql` to add the new store and its initial products:

```sql
-- Add store
INSERT INTO stores (id, display_name, domain) VALUES
  ('NEWSTORE', 'Store Display Name', 'storedomain.com')
ON CONFLICT (id) DO NOTHING;

-- Add store settings
INSERT INTO store_settings (store_id, bypass_payment, online_payments_enabled) VALUES
  ('NEWSTORE', false, true)
ON CONFLICT (store_id) DO NOTHING;

-- Add products (use unique UUIDs)
INSERT INTO products (id, store_id, name, slug, description, price, ...) VALUES
  ...
ON CONFLICT (id) DO NOTHING;
```

---

## Step 3: Add Store to Provisioning Config

### `init/NEWSTORE.yaml`

Create a provisioning config file. Copy `init/hairlukgud.yaml` and update:

```yaml
project:
  name: NEWSTORE
  display_name: "Store Display Name"
  domain: storedomain.com
  directory: ./NEWSTORE

vercel:
  # ... same structure, update root_directory
  git:
    root_directory: "NEWSTORE"
  env_vars:
    NEXT_PUBLIC_SITE_URL: "https://www.${PROJECT_DOMAIN}"

supabase:
  # ... same shared project config
  auth:
    site_url: "https://www.${PROJECT_DOMAIN}"
    redirect_urls:
      - "https://www.${PROJECT_DOMAIN}/auth/callback"
      - "https://${PROJECT_DOMAIN}/auth/callback"

resend:
  from_email: "Store Name <orders@${PROJECT_DOMAIN}>"
```

---

## Step 4: Create Terraform Config

Create three directories under `terraform/stores/NEWSTORE/`:

### `terraform/stores/NEWSTORE/doppler/terragrunt.hcl`

```hcl
include "root" {
  path = find_in_parent_folders("root.hcl")
}

locals {
  name = "NEWSTORE"
}

terraform {
  source = "${get_repo_root()}/terraform//modules/doppler"
}

inputs = {
  name = local.name
}
```

### `terraform/stores/NEWSTORE/dev/terragrunt.hcl`

```hcl
include "root" {
  path = find_in_parent_folders("root.hcl")
}

dependency "doppler" {
  config_path  = "../doppler"
  skip_outputs = true
}

locals {
  name         = "NEWSTORE"
  display_name = "Store Display Name"
  base_domain  = "storedomain.com"
  domain       = "dev.${local.base_domain}"
  root_dir     = "apps/NEWSTORE"
  from_email   = "Store Name <no-reply@${local.base_domain}>"
}

terraform {
  source = "${get_repo_root()}/terraform//modules/store"
}

inputs = {
  name         = "${local.name}-dev"
  store_id     = local.name
  display_name = local.display_name
  domain       = local.domain
  base_domain  = local.base_domain
  root_dir     = local.root_dir
  from_email   = local.from_email
  git_branch   = "dev"
  env          = "dev"

  supabase_url              = get_env("TF_VAR_SUPABASE_URL", get_env("TF_VAR_supabase_url", ""))
  supabase_anon_key         = get_env("TF_VAR_SUPABASE_ANON_KEY", get_env("TF_VAR_supabase_anon_key", ""))
  supabase_service_role_key = get_env("TF_VAR_SUPABASE_SERVICE_ROLE_KEY", get_env("TF_VAR_supabase_service_role_key", ""))
  supabase_db_password      = get_env("TF_VAR_SUPABASE_DB_PASSWORD", get_env("TF_VAR_supabase_db_password", ""))
  supabase_database_url     = get_env("TF_VAR_SUPABASE_DATABASE_URL", get_env("TF_VAR_supabase_database_url", ""))
}
```

### `terraform/stores/NEWSTORE/prod/terragrunt.hcl`

Same as dev but with:
- `domain = local.base_domain` (no `dev.` prefix)
- `git_branch = "main"`
- `env = "prod"`
- `name = "${local.name}-prod"`

---

## Step 5: Add Third-Party Credentials to Doppler

Before running the provisioning workflow, ensure these secrets exist in the **Doppler `provisioner` project**:

| Secret | Source | Config |
|--------|--------|--------|
| `TF_VAR_SUPABASE_ACCESS_TOKEN` | Supabase dashboard > Access Tokens | dev + prod |
| `TF_VAR_SUPABASE_ORG_ID` | Supabase dashboard > Org Settings | dev + prod |
| `TF_VAR_VERCEL_TOKEN` | Vercel dashboard > Settings > Tokens | dev + prod |
| `TF_VAR_VERCEL_TEAM_ID` | Vercel dashboard > Settings > General | dev + prod |
| `TF_VAR_GOOGLE_PROJECT_ID` | Google Cloud Console | dev + prod |
| `TF_VAR_GOOGLE_SUPPORT_EMAIL` | Google Cloud Console | dev + prod |
| `TF_VAR_RESEND_API_KEY` | Resend dashboard | dev + prod |
| `TF_VAR_PAYSTACK_PUBLIC_KEY` | Paystack dashboard | dev + prod |
| `TF_VAR_PAYSTACK_SECRET_KEY` | Paystack dashboard | dev + prod |
| `TF_CLOUD_TOKEN` | Terraform Cloud > User Settings > Tokens | dev + prod |
| `ADMIN_EMAIL` | You decide | dev + prod |
| `ADMIN_PASSWORD` | You decide (strong, 16+ chars) | dev + prod |

Also add the new store to the `provision-store-init.yml` workflow's store input options:

```yaml
# .github/workflows/provision-store-init.yml
inputs:
  store:
    options:
      - hairlukgud
      - hairfordays
      - NEWSTORE      # Add here
```

---

## Step 6: Run the Provisioning Pipeline

Go to **GitHub Actions > Provision Store** and run with:

| Input | Value |
|-------|-------|
| Store | `NEWSTORE` |
| Environment | `dev` (start here) |
| Action | `plan` (review first, then `apply`) |

The pipeline runs 4 jobs in sequence:

1. **shared-supabase** - Creates/updates the shared Supabase project (skipped if already exists)
2. **doppler-project** - Creates a Doppler project for the store with dev/prod environments
3. **provision-store** - Creates Vercel project, sets env vars, configures Google OAuth, Resend domain
4. **post-provision** - Runs database migrations, creates the store row, seeds admin user

After dev succeeds, run again with `env: prod`.

---

## Step 7: Update CI Workflows

### `db-push.yml`

The migration workflow uses `apps/hairlukgud` as the working directory (since migrations are symlinked and identical). No changes needed unless you want per-store migration tracking.

### Vercel auto-deploys

Terraform configures Vercel to auto-deploy from the `main` branch (prod) and `dev` branch (dev). Pushes to those branches will trigger builds automatically.

---

## Step 8: Verify

1. **Admin login**: Go to `https://DOMAIN/auth`, sign in with the admin email
2. **Admin panel**: Navigate to `/admin` - should see the dashboard
3. **Products**: Add a product via admin, verify it shows on the storefront
4. **Checkout**: Test the full Paystack flow (use test keys)
5. **Emails**: Verify order confirmation emails render correctly

---

## Quick Reference: Adding Store-Specific Overrides

If a store needs a custom version of a shared page:

1. Create the file directly in `apps/NEWSTORE/src/app/` at the same path
2. The injection system will skip it (local files take precedence)
3. The file will be committed to git (not in `.gitignore`)

Example: custom admin dashboard at `apps/NEWSTORE/src/app/admin/page.tsx`.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Admin not recognized | Check for RLS recursion errors in Vercel logs. The `is_store_admin()` function must exist. |
| Pages not updating | Run `task inject` or restart dev server (injection runs on `npm run dev`) |
| Supabase ports conflict | Ensure unique ports in `supabase/config.toml` |
| `Module not found: @tor/*` | Check `transpilePackages` in `next.config.ts` and exports in `packages/*/package.json` |
| Terraform state lock | Don't use `-lock=false`. Wait for any running workflow to finish, or unlock in Terraform Cloud. |
| FK violation on admin seed | The provisioning workflow creates the store row before the admin user (required by trigger). If it fails, re-run. |
