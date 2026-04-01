# ThorAI — includes monorepo root for shared provider credentials
include "monorepo_root" {
  path = "${get_repo_root()}/terraform/root.hcl"
}
