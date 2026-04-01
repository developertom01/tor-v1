resource "doppler_project" "this" {
  name        = var.project_name
  description = "Secrets for ${var.project_name} store"
}

resource "doppler_environment" "dev" {
  project = doppler_project.this.name
  slug    = "dev"
  name    = "Development"
}

resource "doppler_environment" "staging" {
  project = doppler_project.this.name
  slug    = "staging"
  name    = "Staging"
}

resource "doppler_environment" "prod" {
  project = doppler_project.this.name
  slug    = "prod"
  name    = "Production"
}
