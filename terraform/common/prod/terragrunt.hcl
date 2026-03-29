include "root" {
  path = find_in_parent_folders("root.hcl")
}

dependency "doppler" {
  config_path  = "../doppler"
  skip_outputs = true
}

terraform {
  source = "${get_repo_root()}/terraform//modules/common"
}

inputs = {
  env             = "prod"
  doppler_project = "tor-common"
}
