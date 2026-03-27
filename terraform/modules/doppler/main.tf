# Check if project already exists via Doppler API
data "external" "project_check" {
  program = ["sh", "-c", <<-EOF
    if doppler projects get ${var.project_name} --json 2>/dev/null | grep -q '"name"'; then
      echo '{"exists":"true"}'
    else
      echo '{"exists":"false"}'
    fi
  EOF
  ]
}

locals {
  project_exists = data.external.project_check.result.exists == "true"
}

resource "doppler_project" "this" {
  count       = local.project_exists ? 0 : 1
  name        = var.project_name
  description = "Secrets for ${var.project_name} store"
}

resource "doppler_environment" "dev" {
  count   = local.project_exists ? 0 : 1
  project = var.project_name
  slug    = "dev"
  name    = "Development"

  depends_on = [doppler_project.this]
}

resource "doppler_environment" "staging" {
  count   = local.project_exists ? 0 : 1
  project = var.project_name
  slug    = "staging"
  name    = "Staging"

  depends_on = [doppler_project.this]
}

resource "doppler_environment" "prod" {
  count   = local.project_exists ? 0 : 1
  project = var.project_name
  slug    = "prod"
  name    = "Production"

  depends_on = [doppler_project.this]
}

# Write secrets to the appropriate environment config
resource "doppler_secret" "all" {
  for_each = nonsensitive(var.secrets)

  project = var.project_name
  config  = var.env
  name    = each.key
  value   = each.value

  depends_on = [
    doppler_environment.dev,
    doppler_environment.staging,
    doppler_environment.prod,
  ]
}
