include "root" {
  path = find_in_parent_folders("root.hcl")
}

locals {
  base_domain = "hairluksgudgh.com"
  from_email  = "Hair Luk Gud GH <no-reply@${local.base_domain}>"
}

terraform {
  source = "${get_repo_root()}/terraform//modules/resend"
}

inputs = {
  name       = "hairlukgud"
  domain     = local.base_domain
  from_email = local.from_email
}
