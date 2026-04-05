include "root" {
  path = find_in_parent_folders("root.hcl")
}

dependency "resend" {
  config_path = "../resend"

  mock_outputs = {
    dns_records = []
  }
  mock_outputs_allowed_terraform_commands = ["validate", "plan"]
}

locals {
  base_domain = "aseesthreads.store"
}

terraform {
  source = "${get_repo_root()}/terraform//modules/resend-dns"
}

inputs = {
  domain      = local.base_domain
  dns_records = dependency.resend.outputs.dns_records
}
