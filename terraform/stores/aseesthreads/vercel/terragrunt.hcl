include "root" {
  path = find_in_parent_folders("root.hcl")
}

locals {
  name     = "aseesthreads"
  root_dir = "apps/aseesthreads"
}

terraform {
  source = "${get_repo_root()}/terraform//modules/vercel-project"
}

inputs = {
  name     = local.name
  root_dir = local.root_dir
}
