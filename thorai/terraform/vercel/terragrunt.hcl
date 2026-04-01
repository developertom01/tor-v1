include "root" {
  path = find_in_parent_folders("root.hcl")
}

locals {
  name     = "thorai"
  root_dir = "thorai"
}

terraform {
  source = "${get_repo_root()}/terraform//modules/vercel-project"
}

inputs = {
  name     = local.name
  root_dir = local.root_dir
}
