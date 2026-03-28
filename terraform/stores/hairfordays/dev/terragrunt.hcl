include "root" {
  path = find_in_parent_folders("root.hcl")
}

dependency "doppler" {
  config_path  = "../doppler"
  skip_outputs = true
}

dependency "supabase" {
  config_path = "${get_repo_root()}/terraform/shared/supabase/dev"
  mock_outputs = {
    url              = "https://mock.supabase.co"
    anon_key         = "mock-anon-key"
    service_role_key = "mock-service-role-key"
    db_password      = "mock-db-password"
    database_url     = "postgresql://mock@localhost/postgres"
  }
  mock_outputs_allowed_terraform_commands = ["init", "validate", "plan", "apply", "destroy"]
  mock_outputs_merge_strategy_with_state  = "shallow"
}

locals {
  name         = "hairfordays"
  display_name = "Hair For Days"
  base_domain  = "hairfordays.com"
  domain       = "dev.${local.base_domain}"
  root_dir     = "apps/hairfordays"
  from_email   = "Hair For Days <no-reply@${local.base_domain}>"
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

  # Shared Supabase
  supabase_url              = dependency.supabase.outputs.url
  supabase_anon_key         = dependency.supabase.outputs.anon_key
  supabase_service_role_key = dependency.supabase.outputs.service_role_key
  supabase_db_password      = dependency.supabase.outputs.db_password
  supabase_database_url     = dependency.supabase.outputs.database_url
}
