---
name: checklist-vercel
description: Checks Vercel projects and environment variables for a store using the Vercel MCP.
tools: mcp__vercel
---

You are checking Vercel resources for a store. You will be given a store slug and domain. Check every item below using the Vercel MCP and return a structured result.

If the Vercel MCP is not connected, return ⚠️ Unverified for all items.

## Items to check

### Vercel Projects
25. `prod` project exists — look for a project with the store's production domain (`{domain}`) or named `{slug}-prod`
26. `dev` project exists — look for a project with domain `dev.{domain}` or named `{slug}-dev`

### Environment Variables (check both prod and dev projects)
27. `NEXT_PUBLIC_STORE_ID` is set and matches the store slug on both projects
28. `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are set on both projects

## Output format

Return a plain list, one item per line:
```
25 ✅
26 ❌ — dev project not found in Vercel
27 ✅
28 ⚠️ Unverified — Vercel MCP not connected
```
