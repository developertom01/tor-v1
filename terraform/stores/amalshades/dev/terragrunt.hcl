include "root" {
  path = find_in_parent_folders("root.hcl")
}

dependency "doppler" {
  config_path  = "../doppler"
  skip_outputs = true
}

dependency "vercel" {
  config_path = "../vercel"
  mock_outputs = {
    project_id = ""
  }
  mock_outputs_allowed_terraform_commands = ["plan"]
}

locals {
  name         = "amalshades"
  display_name = "Amal-shades"
  base_domain  = "amalshades.store"
  domain       = "dev.${local.base_domain}"
  root_dir     = "apps/amalshades"
  from_email   = "Amal-shades <no-reply@${local.base_domain}>"
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

  # Shared Supabase — read from TF_VAR_* env vars (set by Doppler in CI)
  supabase_url              = get_env("TF_VAR_SUPABASE_URL", get_env("TF_VAR_supabase_url", ""))
  supabase_anon_key         = get_env("TF_VAR_SUPABASE_ANON_KEY", get_env("TF_VAR_supabase_anon_key", ""))
  supabase_service_role_key = get_env("TF_VAR_SUPABASE_SERVICE_ROLE_KEY", get_env("TF_VAR_supabase_service_role_key", ""))
  supabase_db_password      = get_env("TF_VAR_SUPABASE_DB_PASSWORD", get_env("TF_VAR_supabase_db_password", ""))
  supabase_database_url     = get_env("TF_VAR_SUPABASE_DATABASE_URL", get_env("TF_VAR_supabase_database_url", ""))
  auth_encryption_key       = get_env("TF_VAR_AUTH_ENCRYPTION_KEY", get_env("TF_VAR_auth_encryption_key", ""))
  vercel_project_id         = dependency.vercel.outputs.project_id
}
