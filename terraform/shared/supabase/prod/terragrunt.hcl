include "root" {
  path = find_in_parent_folders("root.hcl")
}

terraform {
  source = "${get_repo_root()}/terraform//modules/supabase"
}

inputs = {
  name   = "tor-prod"
  org_id = get_env("TF_VAR_SUPABASE_ORG_ID", get_env("TF_VAR_supabase_org_id", ""))

  # All store domains for this env — auth redirect URLs are registered for all of them
  domains = [
    "hairluksgudgh.com",
    "hairfordays.store",
    "aseesthreads.store",
    "amalshades.store",
  ]
}
