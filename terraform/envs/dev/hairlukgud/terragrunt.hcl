include "root" {
  path = find_in_parent_folders("root.hcl")
}

locals {
  env = read_terragrunt_config(find_in_parent_folders("env.hcl")).locals

  name         = "hairlukgud"
  display_name = "Hair Luk Gud GH"
  base_domain  = "hairluksgudgh.com"
  domain       = "${local.env.domain_prefix}${local.base_domain}"
  root_dir     = "apps/hairlukgud"
  from_email   = "Hair Luk Gud GH <orders@${local.base_domain}>"
}

terraform {
  source = "${get_repo_root()}/terraform//modules/store"
}

inputs = {
  name         = "${local.name}-${local.env.env}"
  display_name = local.display_name
  domain       = local.domain
  base_domain  = local.base_domain
  root_dir     = local.root_dir
  from_email   = local.from_email
  git_branch   = local.env.git_branch
  env          = local.env.env
}
