# Write secrets to the appropriate environment config
# Project + environments are managed by the doppler-project module
resource "doppler_secret" "all" {
  for_each = nonsensitive(var.secrets)

  project = var.project_name
  config  = var.env
  name    = each.key
  value   = each.value
}
