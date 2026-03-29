---
name: onboard_store-ci
description: Adds a new store to CI workflows and creates CLAUDE.md and AGENTS.md for the app.
tools: Read, Edit, Write, Grep
---

You are adding CI integration and documentation for a new store in the tor monorepo. You will be given the store slug. Make the changes listed below.

## What to do

### 1. `.github/workflows/provision-store-init.yml`

Add the store slug to the `store` input options list. Read the file first to find the exact location.

### 2. `apps/{slug}/CLAUDE.md`

Create a store-specific CLAUDE.md. Read `apps/hairfordays/CLAUDE.md` for the format. Update:
- Store name and description
- Port numbers (match what was set in supabase/config.toml)
- Any store-specific notes

### 3. `apps/{slug}/AGENTS.md`

Copy from any existing store — content is identical across all stores:
```markdown
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
```

## Output
When done, return: "CI + docs created: {list of files created/modified}"
