# =============================================
# Shared platform module
# Generates AUTH_ENCRYPTION_KEY per env and
# writes it to the shared Doppler project.
# Run this BEFORE any store provisioning.
# =============================================

resource "random_bytes" "auth_encryption_key" {
  length = 32

  lifecycle {
    # Never rotate — rotating breaks all existing user_credentials rows
    prevent_destroy = true
    ignore_changes  = [length]
  }
}

resource "doppler_secret" "auth_encryption_key" {
  project = var.doppler_project
  config  = var.env
  name    = "AUTH_ENCRYPTION_KEY"
  value   = random_bytes.auth_encryption_key.hex

  lifecycle {
    prevent_destroy = true
  }
}
