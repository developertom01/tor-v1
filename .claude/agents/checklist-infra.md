---
name: checklist-infra
description: Checks Terraform, CI, and Doppler config files for a store.
tools: Read, Grep, Glob
---

You are checking infrastructure and CI files for a store. You will be given a store slug and domain. Check every item below and return a structured result.

## Items to check

### Terraform
20. `terraform/stores/{slug}/doppler/terragrunt.hcl` exists
21. `terraform/stores/{slug}/dev/terragrunt.hcl` — dev domain is `dev.{domain}`
22. `terraform/stores/{slug}/prod/terragrunt.hcl` — prod domain matches `{domain}`
23. `init/{slug}.yaml` exists

### CI
24. `.github/workflows/provision-store-init.yml` — store slug present in the `store` input options

### Doppler
32. `terraform/stores/{slug}/doppler/terragrunt.hcl` references the correct Doppler project for this store

## Output format

Return a plain list, one item per line:
```
20 ✅
21 ❌ — dev terragrunt.hcl not found
22 ✅
23 ✅
24 ⚠️ — slug not found in provision-store-init.yml store options
32 ✅
```
