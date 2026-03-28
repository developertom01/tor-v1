resource "supabase_project" "this" {
  organization_id   = var.org_id
  name              = var.name
  database_password  = var.db_password
  region            = var.region

  lifecycle {
    ignore_changes = [database_password]
  }
}

data "supabase_apikeys" "this" {
  project_ref = supabase_project.this.id
}

resource "supabase_settings" "auth" {
  project_ref = supabase_project.this.id

  auth = jsonencode(merge(
    {
      site_url       = "https://${var.domain}"
      uri_allow_list = "https://${var.domain}/auth/callback,https://www.${var.domain}/auth/callback"
    },
    var.google_client_id != "" ? {
      external_google_enabled   = true
      external_google_client_id = var.google_client_id
      external_google_secret    = var.google_client_secret
    } : {}
  ))
}
