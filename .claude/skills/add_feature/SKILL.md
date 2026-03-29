---
name: add_feature
description: Plan and implement a new feature in the tor monorepo — gathers user story and benefit, maps architecture impact, writes a workflow plan file, executes parallel work via sub-agents, then validates with a build or infra plan.
---

# Add Feature

You are a senior engineer on the tor monorepo — a multi-tenant e-commerce platform for hair businesses in Ghana. Your job is to understand a feature request, surface all the relevant architectural context, produce a detailed workflow plan, execute it (parallelising where possible), and validate the result.

---

## Phase 1: Gather Information

**DO NOT write a single file or line of code until you have all required information confirmed.**

### Step 1 — Parse arguments

Check `$ARGUMENTS` for:
- Feature name / slug (e.g. `product-reviews`, `order-tracking-page`)
- User story (anything starting with "As a…" or "I want…")
- Benefit / rationale

Mark each as provided or missing.

### Step 2 — Ask for what's missing

You need **all three** before proceeding. If any are missing, ask for them — group all missing fields into a single message:

```
To plan this feature I need a few things:

**Feature name** — a short slug (e.g. `product-reviews`). What should we call it?

**User story** — complete this sentence:
"As a [who], I want [what], so that [why]."

**Benefit** — in one or two sentences, what problem does this solve or what value does it add?
```

Do not ask for more than what's listed above. Do not proceed until you have all three.

### Step 3 — Validate

- Feature name: lowercase, hyphenated, no spaces. If the user gave a free-form name, convert it and confirm: `"I'll use the slug \`product-reviews\` — OK?"`
- User story: must have a "who", a "what", and a "why". If any part is vague, ask once to clarify.
- Benefit: accept whatever the user says — this is for context, not validation.

---

## Phase 2: Architecture Impact Analysis

Once you have the confirmed inputs, **read the codebase** to understand where this feature touches before writing the plan. Do this in a single parallel batch:

1. Read `CLAUDE.md` (root) — already in context, re-read if needed for specific sections
2. Read `packages/store/index.ts` — StoreConfig type (understand what's already in config)
3. Read `packages/lib/actions/` — existing server actions (what already exists vs. what to add)
4. Glob `packages/pages/` — shared page templates (will this feature add/modify a shared page?)
5. Glob `supabase/migrations/` — existing migrations (does this feature need a new table or column?)
6. Read `packages/ui/` components — reusable UI (what's already built vs. what to create?)

Based on what you find, map the feature to the monorepo layers it will touch. Use this checklist — mark each `yes / no / maybe`:

| Layer | Touches? | Notes |
|-------|----------|-------|
| Shared pages (`packages/pages/`) | | |
| Shared UI components (`packages/ui/`) | | |
| Shared lib / server actions (`packages/lib/`) | | |
| Store config (`packages/store/`) | | |
| Database schema (new migration) | | |
| Store-specific files (`apps/*/src/app/`) | | |
| Terraform / infra | | |
| CI workflows | | |
| Email templates | | |
| Paystack / payments | | |

Then surface **key architectural decisions** the plan must address:
- Does the feature need a new DB table, or can it extend an existing one?
- Is this server-only logic or does it require client interactivity?
- Does it affect both stores equally, or is it store-specific?
- Are there RLS policy implications?
- Does it require a new env var or secret?

Present the impact map and key decisions to the user **before writing the plan**:

```
Here's where this feature will touch the codebase:

✅ packages/lib/actions/ — new server action `getProductReviews()`
✅ packages/pages/ — new shared page `products/[slug]/reviews/page.tsx`
✅ supabase/migrations/ — new table `product_reviews` with RLS
❌ Terraform — no infra changes needed
❌ Store config — no new config fields needed

Key decisions:
- Reviews will be tied to authenticated users only (RLS: users can insert their own, all can read)
- Page will be a server component; the review submission form will be a client component
- No new env vars needed

Does this look right? Anything to add or change before I write the plan?
```

Wait for confirmation before proceeding.

---

## Phase 3: Write the Feature Plan File

Once the architecture impact is confirmed, create the plan file at:

```
features/<feature-slug>.md
```

from the repo root (e.g. `features/product-reviews.md`). Use this exact structure:

```markdown
# Feature: <Display Name>

## User Story
As a [who], I want [what], so that [why].

## Benefit
<benefit statement>

## Architecture Impact
<paste the confirmed impact map table>

## Key Decisions
<list the confirmed architectural decisions>

## Workflow

Each step below is tagged:
- 🔵 SEQUENTIAL — must wait for the previous step
- 🟡 PARALLEL — can run at the same time as other PARALLEL steps in the same group

---

### Step 1 — [name] 🔵 SEQUENTIAL
**What:** <what to do>
**Files:** <files to create or modify>
**Rules:** <any CLAUDE.md rules that apply>
**Done when:** <acceptance criterion>

---

### Step 2a — [name] 🟡 PARALLEL (Group A)
**What:** <what to do>
**Files:** <files>
**Rules:** <rules>
**Done when:** <criterion>

### Step 2b — [name] 🟡 PARALLEL (Group A)
**What:** <what to do>
**Files:** <files>
**Rules:** <rules>
**Done when:** <criterion>

---

### Step 3 — [name] 🔵 SEQUENTIAL
**What:** <what to do>
**Files:** <files>
**Rules:** <rules>
**Done when:** <criterion>

---

## Validation

- [ ] `task build` passes with no errors
- [ ] `task lint` passes
- [ ] <any feature-specific checks, e.g. "review form submits and row appears in DB">
- [ ] No hardcoded colors in any new JSX
- [ ] No store-specific logic in shared packages
```

**Rules for writing the workflow:**
- Be specific. Name exact files, actions, and components — not "update the backend".
- Every step must have a clear "done when" criterion.
- Group steps into PARALLEL groups wherever they have no dependency on each other. Examples of things that can run in parallel: writing a migration while writing the server action; building the UI component while writing the page template.
- Sequential gates are: schema first (before actions), actions before pages, pages before integration tests.
- Call out any CLAUDE.md rules relevant to each step so the agent executing it doesn't have to re-read the whole doc.

After writing the file, tell the user:
```
Plan written to features/<feature-slug>.md

Here's the workflow at a glance:
[paste the step list with 🔵/🟡 tags]

Ready to start executing? Say "go" to begin, or edit the plan file first and let me know when ready.
```

---

## Phase 4: Execute the Workflow

When the user says to proceed, read `features/<feature-slug>.md` and execute the workflow.

### Execution rules

1. **Sequential steps**: execute yourself, one at a time, marking each done in the todo list.
2. **Parallel groups**: spawn one sub-agent per step in the group in a **single message** using the `Agent` tool. Pass each agent:
   - The full step definition (what, files, rules, done-when)
   - The full architecture context (paste the Key Decisions section)
   - The relevant CLAUDE.md rules (no hardcoded colors, write in packages not apps, etc.)
   - The repo root path
3. Wait for all agents in a parallel group to return before moving to the next sequential step.
4. After each step completes (whether you or a sub-agent did it), update the plan file: mark the step `✅ Done` and note any deviations from the plan.

### Monorepo rules to enforce in every step (include these when briefing sub-agents)

Every step — whether sequential or parallel — must follow these rules. Remind sub-agents of them:

- **Write in packages, never in apps** — shared logic goes in `packages/pages/`, `packages/lib/`, `packages/ui/`, `packages/store/`. App-specific files (`layout.tsx`, `page.tsx`, `globals.css`, `favicon.ico`, `Navbar.tsx`, `Footer.tsx`) are the only exceptions.
- **No hardcoded colors** — `brand-*` and `gold-*` Tailwind tokens only in JSX. Hex values only in `store.config.ts`, `globals.css` `@theme inline`, and CSS utility classes.
- **Config-driven** — store-specific values come from `useStore()` / `StoreConfig`. Never hardcode store names, domains, categories, or copy in shared code.
- **Server-first** — server components are the default. `'use client'` only for interactivity.
- **No API routes** — only `/api/paystack-webhook` exists. All data fetching goes through server actions.
- **Supabase migrations are shared** — one migration file affects all stores. RLS policies must account for `store_id` isolation.
- **New env vars** — if the feature needs one, add it to `apps/*/.env.example` for both stores.

---

## Phase 5: Validate

After all workflow steps are complete, run the appropriate validation:

### App feature (code changes)

```bash
task build
task lint
```

If either fails, read the error output carefully, fix the root cause, and re-run. Do not skip or suppress errors.

### Infra feature (Terraform changes)

For each affected store and environment, run:

```bash
task tg:plan APP=<slug> ENV=dev
task tg:plan APP=<slug> ENV=prod
```

Review the plan output for unintended changes. If the plan looks wrong, investigate before applying.

### Post-validation report

Tell the user:
```
✅ Build passed
✅ Lint passed

Feature `<name>` is implemented. Here's what was created/modified:
- [list files]

Next steps (if any):
- [e.g. "Run `task db:reset` locally to test the new migration"]
- [e.g. "Add `NEW_ENV_VAR` to Doppler for both stores before deploying"]
```

Update `features/<feature-slug>.md` with the final status and any follow-up notes.

---

## Reference Files

When you need to understand the exact format or structure, read these:

- **Server action pattern**: `packages/lib/actions/products.ts`
- **Shared page example**: `packages/pages/products/page.tsx` (if it exists)
- **Client component example**: look for `'use client'` in `packages/ui/`
- **StoreConfig type**: `packages/store/index.ts`
- **Migration format**: any file in `supabase/migrations/`
- **RLS policy pattern**: `supabase/migrations/` — look for `CREATE POLICY` statements
- **Email function pattern**: `packages/lib/email.ts`
- **CLAUDE.md**: always in context — re-read specific sections if uncertain
