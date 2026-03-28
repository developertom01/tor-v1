resource "vercel_project" "this" {
  name      = var.name
  framework = var.framework
  team_id   = var.team_id != "" ? var.team_id : null

  git_repository = {
    type              = "github"
    repo              = var.git_repo
    production_branch = var.git_branch
  }

  root_directory  = var.root_dir
  build_command   = "npm run build"
  output_directory = ".next"

  environment = [
    for key, value in var.env_vars : {
      key    = key
      value  = value
      target = ["production", "preview", "development"]
    }
  ]
}

resource "vercel_project_domain" "apex" {
  project_id = vercel_project.this.id
  team_id    = var.team_id != "" ? var.team_id : null
  domain     = var.domain
}

resource "vercel_project_domain" "www" {
  project_id = vercel_project.this.id
  team_id    = var.team_id != "" ? var.team_id : null
  domain     = "www.${var.domain}"
}

