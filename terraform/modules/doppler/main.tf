resource "doppler_project" "this" {
  name        = var.name
  description = "Secrets for ${var.name} store"
}

# Environments: dev, staging, prod
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
  for_each = var.secrets

  project = doppler_project.this.name
  config  = "prod"
  name    = each.key
  value   = each.value
}

# Vercel integration sync (if project ID provided)
resource "doppler_integration" "vercel" {
  count = var.vercel_project_id != "" ? 1 : 0

  name = "${var.name}-vercel"
  type = "vercel"
}

resource "doppler_secrets_sync" "vercel_prod" {
  count = var.vercel_project_id != "" ? 1 : 0

  integration = doppler_integration.vercel[0].id
  project     = doppler_project.this.name
  config      = "prod"

  path = var.vercel_project_id
}
