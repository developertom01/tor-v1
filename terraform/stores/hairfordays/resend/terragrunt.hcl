include "root" {
  path = find_in_parent_folders("root.hcl")
}

locals {
  base_domain = "hairfordays.store"
  from_email  = "Hair For Days <no-reply@${local.base_domain}>"
}

terraform {
  source = "${get_repo_root()}/terraform//modules/resend"
}

inputs = {
  name       = "hairfordays"
  domain     = local.base_domain
  from_email = local.from_email
}
