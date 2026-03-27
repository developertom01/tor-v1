# Check if project already exists via Doppler REST API
data "external" "project_check" {
  program = ["sh", "-c", <<-EOF
    HTTP_CODE=$(curl -s -o /dev/null -w "%%{http_code}" \
      "https://api.doppler.com/v3/projects/project?project=${var.project_name}" \
      -H "Authorization: Bearer ${var.doppler_token}")
    if [ "$HTTP_CODE" = "200" ]; then
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

# Create project + all environments only if it doesn't exist yet
resource "doppler_project" "this" {
  count       = local.project_exists ? 0 : 1
  name        = var.project_name
  description = "Secrets for ${var.project_name} store"
}

resource "doppler_environment" "dev" {
  count   = local.project_exists ? 0 : 1
  project = doppler_project.this[0].name
  slug    = "dev"
  name    = "Development"
}

resource "doppler_environment" "staging" {
  count   = local.project_exists ? 0 : 1
  project = doppler_project.this[0].name
  slug    = "staging"
  name    = "Staging"
}

resource "doppler_environment" "prod" {
  count   = local.project_exists ? 0 : 1
  project = doppler_project.this[0].name
  slug    = "prod"
  name    = "Production"
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
