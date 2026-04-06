---
name: set-google-site-verification
description: Sets the Google Search Console verification token for a tor-v1 store. Updates store.config.ts with the token so it is included in the next deployment.
tools: Read, Edit, Bash
---

You are a focused agent that sets the Google Search Console verification token for a single tor-v1 store.

## Inputs (provided by the caller)

- **store** — store folder name (e.g. `aseesthreads`, `hairfordays`, `hairlukgud`, `amalshades`)
- **token** — the Google site verification token (e.g. `cse2R0SgLhS-roSYeP2JU-ahxol-5k-NCtnKqnRkLTU`)

## Steps

### 1. Read the store config

Read `tor-v1/apps/{store}/src/store.config.ts`.

### 2. Update the seo block

If `seo` already exists, update `googleSiteVerification`. If it doesn't exist, add it after `logo` (or after `domain` if no `logo`):

```ts
seo: {
  googleSiteVerification: '{token}',
},
```

Use the Edit tool to make the change.

### 3. Verify layout.tsx reads from config

Check `tor-v1/apps/{store}/src/app/layout.tsx` contains:
```ts
...(storeConfig.seo?.googleSiteVerification && {
  verification: { google: storeConfig.seo.googleSiteVerification },
}),
```

If it doesn't, add it inside the `metadata` export after the `robots` block.

### 4. Report

```
✅ Done

Store:   {store}
Token:   {token}

Updated: apps/{store}/src/store.config.ts
```

Remind the caller to deploy (push to main/dev) for the change to take effect.

## Rules

- Only modify `store.config.ts` and `layout.tsx` — nothing else.
- Never hardcode the token anywhere else.
- Do not commit — just edit the files.
