include "root" {
  path = find_in_parent_folders("root.hcl")
}

locals {
  name     = "hairlukgud"
  root_dir = "apps/hairlukgud"
}

terraform {
  source = "${get_repo_root()}/terraform//modules/vercel-project"
}

inputs = {
  name     = local.name
  root_dir = local.root_dir
}
