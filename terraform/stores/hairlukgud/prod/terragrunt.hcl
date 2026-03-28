include "root" {
  path = find_in_parent_folders("root.hcl")
}

dependency "doppler" {
  config_path = "../doppler"
}

locals {
  name         = "hairlukgud"
  display_name = "Hair Luk Gud GH"
  base_domain  = "hairluksgudgh.com"
  domain       = local.base_domain
  root_dir     = "apps/hairlukgud"
  from_email   = "Hair Luk Gud GH <no-reply@${local.base_domain}>"
}

terraform {
  source = "${get_repo_root()}/terraform//modules/store"
}

inputs = {
  name         = "${local.name}-prod"
  display_name = local.display_name
  domain       = local.domain
  base_domain  = local.base_domain
  root_dir     = local.root_dir
  from_email   = local.from_email
  git_branch   = "main"
  env          = "prod"
}
