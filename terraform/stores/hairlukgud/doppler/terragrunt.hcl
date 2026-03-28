include "root" {
  path = find_in_parent_folders("root.hcl")
}

terraform {
  source = "${get_repo_root()}/terraform//modules/doppler-project"
}

inputs = {
  project_name = "hairlukgud"
}
