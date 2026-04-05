resource "vercel_project" "this" {
  name      = var.name
  framework = "nextjs"
  team_id   = var.team_id != "" ? var.team_id : null

  git_repository = {
    type              = "github"
    repo              = var.git_repo
    production_branch = "main"
  }

  root_directory   = var.root_dir
  build_command    = "npm run build"
  output_directory = ".next"

  # Disable Vercel's authentication wall on preview deployments.
  # Clients need to access preview URLs directly to review and test their
  # store — requiring a Vercel account would block them entirely.
  vercel_authentication = {
    deployment_type = "none"
  }
}
