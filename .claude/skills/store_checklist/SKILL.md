---
name: store_checklist
description: Production readiness checklist for a store — checks every file, config, and asset that should be in place, reports what's done and what's missing, grouped by AI-fixable vs human-fixable.
---

# Store Production Checklist

You are auditing a store in the tor monorepo to determine whether it is production-ready. Your job is to check every file and config that matters, report what's in place, clearly flag what's missing, and offer to fix what you can.

## Step 1: Identify the store

Check `$ARGUMENTS` for a store slug. If not provided, list the existing stores (check `apps/` directories) and ask which one to audit.

## Step 2: Run the full checklist in parallel

**Spawn all 4 agents in a single message simultaneously.** Do not wait for one before starting the next. Pass the store slug (and domain from `store.config.ts`) to each agent prompt.

| Agent | Subagent file | Covers |
|-------|--------------|--------|
| **Agent 1** | `checklist-files` | Store config, theme, landing page, seed data (items 1–16) |
| **Agent 2** | `checklist-vercel` | Vercel projects + env vars (items 25–28) |
| **Agent 3** | `checklist-supabase` | Supabase dev — store row, products, settings (items 29–31) |
| **Agent 4** | `checklist-infra` | Terraform, CI, Doppler (items 20–24, 32) |

Each agent returns a structured list of item numbers with ✅, ❌, or ⚠️. Wait for all 4 to return, then merge into the final report.

---

### Store Config (`apps/{slug}/src/store.config.ts`)

| # | Item | How to check | Fixable by |
|---|------|-------------|------------|
| 1 | All required fields present (`name`, `tagline`, `domain`, `theme`, `categories` ≥1, `contact`, `hero`) | Read and verify each field | 🤖 AI |
| 2 | `logo` field set | Check if present | 👤 Human (needs image file) |
| 3 | No placeholder values (e.g. "Your Store", "example.com") | Read and spot-check | 👤 Human |

### Theme & Styles (`apps/{slug}/src/app/globals.css`)

| # | Item | How to check | Fixable by |
|---|------|-------------|------------|
| 4 | Brand palette in `@theme inline` (`--color-brand-50` through `--color-brand-900`) | Read and verify all 10 shades | 🤖 AI |
| 5 | `hero-gradient` and `gold-gradient` CSS utilities defined | Read and verify | 🤖 AI |
| 6 | `@source` directives for all `packages/` present | Grep for `@source` | 🤖 AI |

### Landing Page & Layout

| # | Item | How to check | Fixable by |
|---|------|-------------|------------|
| 7 | `layout.tsx` — store-specific metadata (title, description, OG, Twitter) | Check not placeholder | 🤖 AI |
| 7a | `layout.tsx` — imports `Navbar` and `Footer` from local `@/app/_components/`, not `@tor/ui` | Grep import lines | 🤖 AI |
| 8 | `page.tsx` — custom landing page (not a copy of another store's page) | Read and compare structure | 🤖 AI |
| 8a | `apps/{slug}/src/app/_components/Navbar.tsx` — store-specific Navbar exists | Check file present | 🤖 AI |
| 8b | `apps/{slug}/src/app/_components/Footer.tsx` — store-specific Footer exists | Check file present | 🤖 AI |
| 9 | No hardcoded hex colors in `page.tsx` or `layout.tsx` (outside JSON-LD) | Grep for `#[0-9a-fA-F]{3,6}` | 🤖 AI |
| 10 | No literal Tailwind color classes (`text-pink-*`, `text-teal-*`, etc.) in `page.tsx` | Grep for non-`brand-*`/`gold-*` color classes | 🤖 AI |

### Branding Assets

| # | Item | How to check | Fixable by |
|---|------|-------------|------------|
| 11 | `apps/{slug}/public/logo.{ext}` — logo file present | Check `public/` directory | 👤 Human (must provide image) |
| 12 | `apps/{slug}/src/app/favicon.ico` — custom favicon (not default Next.js stub) | Check file size — default is tiny | 👤 Human (must provide image) |
| 13 | `apps/{slug}/src/app/icon.svg` present | ⚠️ optional | 👤 Human |
| 14 | `apps/{slug}/src/app/apple-icon.png` present | ⚠️ optional | 👤 Human |

### Supabase / Database

| # | Item | How to check | Fixable by |
|---|------|-------------|------------|
| 15 | `supabase/seeds/{slug}.json` exists with ≥8 products | Read and count | 🤖 AI |
| 16 | All product `category` slugs match categories in `store.config.ts` | Cross-reference | 🤖 AI |
| 17 | `supabase/seed.sql` — store row present | Grep for slug | 🤖 AI |
| 18 | `apps/{slug}/supabase/config.toml` — ports unique (no conflict with other stores) | Read all stores' config.toml and compare | 🤖 AI |
| 19 | `apps/{slug}/supabase/migrations` — symlink to `../../../supabase/migrations` | Check symlink | 🤖 AI |

### Terraform / Infra

| # | Item | How to check | Fixable by |
|---|------|-------------|------------|
| 20 | `terraform/stores/{slug}/doppler/terragrunt.hcl` exists | Check file present | 🤖 AI |
| 21 | `terraform/stores/{slug}/dev/terragrunt.hcl` — dev domain is `dev.{base_domain}` | Read and verify | 🤖 AI |
| 22 | `terraform/stores/{slug}/prod/terragrunt.hcl` — prod domain matches store domain | Read and verify | 🤖 AI |
| 23 | `init/{slug}.yaml` exists | Check file present | 🤖 AI |

### CI Integration

| # | Item | How to check | Fixable by |
|---|------|-------------|------------|
| 24 | `.github/workflows/provision-store-init.yml` — slug in store input options | Grep for slug | 🤖 AI |

### Production & Dev Resources (use MCP tools if available)

Use the Vercel and Supabase MCP tools if connected — otherwise flag all resource checks as ⚠️ **Unverified — requires MCP connection or manual check**.

**Supabase checks are dev-only** — prod is seeded by CI after provisioning, not something to validate here.

| # | Item | Env | How to check | Fixable by |
|---|------|-----|-------------|------------|
| 25 | **Vercel** — `prod` project exists for `{slug}` | prod | Vercel MCP: list projects, look for `{slug}-prod` or matching domain | 👤 Human (provision via CI) |
| 26 | **Vercel** — `dev` project exists for `{slug}` | dev | Vercel MCP: look for `{slug}-dev` or `dev.{domain}` | 👤 Human (provision via CI) |
| 27 | **Vercel** — `NEXT_PUBLIC_STORE_ID` env var set on both projects | both | Vercel MCP: check env vars on each project | 🤖 AI (via Vercel MCP) |
| 28 | **Vercel** — `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` set | both | Vercel MCP: check env vars | 🤖 AI (via Vercel MCP) |
| 29 | **Supabase** — store row exists in `stores` table | dev | Supabase MCP: `select * from stores where id = '{slug}'` | 👤 Human (run `node scripts/seed-store.mjs {slug}`) |
| 30 | **Supabase** — products seeded (≥8) | dev | Supabase MCP: `select count(*) from products where store_id = '{slug}'` | 👤 Human (run `node scripts/seed-store.mjs {slug}`) |
| 31 | **Supabase** — `store_settings` row exists | dev | Supabase MCP: `select * from store_settings where store_id = '{slug}'` | 👤 Human (run `node scripts/seed-store.mjs {slug}`) |
| 32 | **Doppler** — secrets project exists for `{slug}` | both | Check `terraform/stores/{slug}/doppler/terragrunt.hcl` references correct project | 👤 Human (provision via CI) |

---

## Step 3: Present the results

Group output into three sections:

### ✅ Ready ({n} items)
List everything that passed in one line each.

### ❌ Needs attention — grouped by who fixes it

#### 🤖 AI can fix ({n} items)
For each: item number, what's wrong, what needs to change.

#### 👤 Human must fix ({n} items)
For each: item number, what's missing, exact action the human needs to take (e.g. "Place your logo image at `apps/{slug}/public/logo.png` and run the checklist again").

### ⚠️ Optional / Recommended ({n} items)
Non-blocking items (icon.svg, apple-icon.png, etc.).

---

## Step 4: Offer to fix

If there are any 🤖 AI-fixable issues, ask:

> "I can fix {n} of these automatically. Want me to go ahead?"

**If yes:** use the `edit_store` skill targeting the specific broken items. Pass precise instructions — e.g. "fix missing `@source` directives in globals.css", "correct category slug mismatch in seed JSON", "add store row to seed.sql". Do not re-run the full onboard flow — only fix what's broken.

**If no:** end with the summary verdict and leave it to the user.

---

## Step 5: Summary verdict

End with one of:
- **"Production ready."** — all ✅, no ❌
- **"Not ready — {n} issue(s) to resolve."** — split: "{x} AI-fixable, {y} need your input"
