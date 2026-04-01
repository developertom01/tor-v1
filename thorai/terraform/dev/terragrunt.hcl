include "root" {
  path = find_in_parent_folders("root.hcl")
}

dependency "doppler" {
  config_path  = "../doppler"
  skip_outputs = true
}

locals {
  name         = "thorai"
  display_name = "ThorAI"
  base_domain  = "thorai.app"
  domain       = "dev.thorai.app"
  root_dir     = "thorai"
  from_email   = "ThorAI <no-reply@thorai.app>"
}

terraform {
  source = "${get_parent_terragrunt_dir()}//modules/store"
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

  supabase_url              = get_env("TF_VAR_THORAI_SUPABASE_URL", "")
  supabase_anon_key         = get_env("TF_VAR_THORAI_SUPABASE_ANON_KEY", "")
  supabase_service_role_key = get_env("TF_VAR_THORAI_SUPABASE_SERVICE_ROLE_KEY", "")
  supabase_db_password      = get_env("TF_VAR_THORAI_SUPABASE_DB_PASSWORD", "")
  supabase_database_url     = get_env("TF_VAR_THORAI_SUPABASE_DATABASE_URL", "")
  auth_encryption_key       = get_env("TF_VAR_AUTH_ENCRYPTION_KEY", "")
  linear_api_key            = get_env("TF_VAR_LINEAR_API_KEY", "")
  linear_website_builder_team_id = get_env("TF_VAR_LINEAR_WEBSITE_BUILDER_TEAM_ID", "")
  paystack_public_key       = ""
  paystack_secret_key       = ""
}
