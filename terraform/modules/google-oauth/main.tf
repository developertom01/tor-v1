# OAuth consent screen (brand) — one per GCP project, shared across stores
resource "google_iap_brand" "this" {
  project           = var.project_id
  support_email     = var.support_email
  application_title = "Store Platform"

  lifecycle {
    # Brand may already exist; import if so
    prevent_destroy = true
  }
}

# Per-store OAuth client
resource "google_iap_client" "this" {
  brand        = google_iap_brand.this.name
  display_name = var.display_name
}
