resource "doppler_project" "this" {
  name        = var.name
  description = "Secrets for ${var.name} store"
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

# Sync secrets to production config
resource "doppler_secret" "all" {
  for_each = nonsensitive(var.secrets)

  project = doppler_project.this.name
  config  = "prod"
  name    = each.key
  value   = each.value
}
