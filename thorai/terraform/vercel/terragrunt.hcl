include "root" {
  path = find_in_parent_folders("root.hcl")
}

locals {
  name     = "thorai"
  root_dir = "thorai"
}

terraform {
  source = "${get_parent_terragrunt_dir()}//modules/vercel-project"
}

inputs = {
  name     = local.name
  root_dir = local.root_dir
}
