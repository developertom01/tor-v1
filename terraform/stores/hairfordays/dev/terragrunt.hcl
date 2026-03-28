include "root" {
  path = find_in_parent_folders("root.hcl")
}

dependency "doppler" {
  config_path = "../doppler"
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
  display_name = local.display_name
  domain       = local.domain
  base_domain  = local.base_domain
  root_dir     = local.root_dir
  from_email   = local.from_email
  git_branch   = "dev"
  env          = "dev"
}
