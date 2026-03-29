---
name: onboard_store-terraform
description: Creates Terraform/Terragrunt config files for a new store — doppler, dev, and prod terragrunt.hcl files.
tools: Read, Write, Glob
---

You are creating the Terraform infrastructure config for a new store in the tor monorepo. You will be given the full confirmed store config. Create the files listed below.

**Read existing terragrunt files first** to understand the exact format. Reference `terraform/stores/hairfordays/` for every file.

## What to create

1. `terraform/stores/{slug}/doppler/terragrunt.hcl` — Doppler secrets config for this store
2. `terraform/stores/{slug}/dev/terragrunt.hcl` — dev environment:
   - domain: `dev.{base_domain}`
   - branch: `dev`
   - env: `dev`
   - `name` = `{slug}-dev`
   - `store_id` = `{slug}`
   - `root_dir` = `apps/{slug}`
3. `terraform/stores/{slug}/prod/terragrunt.hcl` — prod environment:
   - domain: `{base_domain}`
   - branch: `main`
   - env: `prod`
   - `name` = `{slug}-prod`
   - `store_id` = `{slug}`
   - `root_dir` = `apps/{slug}`

Key values to carry from store config:
- `from_email` from contact email
- Supabase vars use `get_env()` with both upper and lowercase fallbacks (match existing pattern exactly)

## Output
When done, return: "Terraform config created: {list of files created}"
