include "root" {
  path = find_in_parent_folders("root.hcl")
}

locals {
  base_domain = "thorai.app"
  from_email  = "ThorAI <no-reply@thorai.app>"
}

terraform {
  source = "${get_parent_terragrunt_dir()}//modules/resend"
}

inputs = {
  name       = "thorai"
  domain     = local.base_domain
  from_email = local.from_email
}
