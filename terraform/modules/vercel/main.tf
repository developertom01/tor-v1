resource "vercel_project_environment_variable" "vars" {
  for_each   = nonsensitive(toset(keys(var.env_vars)))
  project_id = var.project_id
  team_id    = var.team_id != "" ? var.team_id : null
  key        = each.key
  value      = var.env_vars[each.key]
  target     = var.env == "prod" ? ["production"] : ["preview", "development"]
}

resource "vercel_project_domain" "this" {
  project_id = var.project_id
  team_id    = var.team_id != "" ? var.team_id : null
  domain     = var.domain
  git_branch = var.env == "prod" ? null : "dev"
}

resource "vercel_project_domain" "www" {
  count      = var.env == "prod" ? 1 : 0
  project_id = var.project_id
  team_id    = var.team_id != "" ? var.team_id : null
  domain     = "www.${var.domain}"
}
