# Shared Supabase project — one per environment (dev/prod)
# All stores share this single project; tenant isolation is via store_id in the app layer.

resource "random_password" "db_password" {
  length  = 32
  special = true
}

resource "supabase_project" "this" {
  organization_id   = var.org_id
  name              = var.name
  database_password = random_password.db_password.result
  region            = var.region

  lifecycle {
    ignore_changes = [database_password]
  }
}

data "supabase_apikeys" "this" {
  project_ref = supabase_project.this.id
}

# Auth settings — configure Google OAuth + redirect URLs for ALL stores
resource "supabase_settings" "auth" {
  project_ref = supabase_project.this.id

  auth = var.google_client_id != "" ? jsonencode({
    site_url                    = "https://${var.domains[0]}"
    uri_allow_list              = join(",", flatten([
      for d in var.domains : [
        "https://${d}/auth/callback*",
        "https://www.${d}/auth/callback*"
      ]
    ]))
    external_google_enabled     = true
    external_google_client_id   = var.google_client_id
    external_google_secret      = var.google_client_secret
  }) : jsonencode({
    site_url       = "https://${var.domains[0]}"
    uri_allow_list = join(",", flatten([
      for d in var.domains : [
        "https://${d}/auth/callback*",
        "https://www.${d}/auth/callback*"
      ]
    ]))
  })
}
