include "root" {
  path = find_in_parent_folders("root.hcl")
}

locals {
  base_domain = "aseesthreads.store"
  from_email  = "Asee's Threads <no-reply@${local.base_domain}>"
}

terraform {
  source = "${get_repo_root()}/terraform//modules/resend"
}

inputs = {
  name       = "aseesthreads"
  domain     = local.base_domain
  from_email = local.from_email
}
