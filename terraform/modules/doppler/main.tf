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

# Write secrets to the appropriate environment config
resource "doppler_secret" "all" {
  for_each = nonsensitive(var.secrets)

  project = doppler_project.this.name
  config  = var.env
  name    = each.key
  value   = each.value

  depends_on = [
    doppler_environment.dev,
    doppler_environment.staging,
    doppler_environment.prod,
  ]
}
