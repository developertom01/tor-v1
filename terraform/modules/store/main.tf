# --- Generated secrets ---

resource "random_password" "admin_password" {
  length           = 16
  special          = true
  override_special = "!@#$%&*"
}

locals {
  admin_email = var.env == "prod" ? "admin@${var.base_domain}" : "${var.env}.admin@${var.base_domain}"

  # Shared Supabase env vars — passed in from the shared Supabase project
  supabase_env_vars = {
    NEXT_PUBLIC_SUPABASE_URL             = var.supabase_url
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = var.supabase_anon_key
    SUPABASE_SECRET_KEY                  = var.supabase_service_role_key
  }
}

# --- Vercel ---
# Look up the project by name — avoids cross-workspace Terraform Cloud state reads
# which fail when the vercel workspace has no state yet.
# The vercel-project module creates the project with name = store_id (e.g. "amalshades").

data "vercel_project" "this" {
  name    = var.store_id
  team_id = var.vercel_team_id != "" ? var.vercel_team_id : null
}

module "vercel" {
  source = "../vercel"

  project_id = data.vercel_project.this.id
  domain     = var.domain
  team_id    = var.vercel_team_id
  env        = var.env

  env_vars = merge(
    local.supabase_env_vars,
    { FROM_EMAIL = var.from_email, RESEND_API_KEY = var.resend_api_key },
    {
      NEXT_PUBLIC_STORE_ID               = var.store_id
      NEXT_PUBLIC_SITE_URL               = "https://${var.domain}"
      NEXT_PUBLIC_BASE_URL               = "https://${var.domain}"
      NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY     = var.paystack_public_key
      PAYSTACK_SECRET_KEY                = var.paystack_secret_key
      LOG_LEVEL                          = var.env == "dev" ? "debug" : "info"
      AUTH_ENCRYPTION_KEY                = var.auth_encryption_key
      DOPPLER_TOKEN                      = var.doppler_token
      NEXT_PUBLIC_IMAGEKIT_URL           = var.imagekit_url
    }
  )
}

# --- Doppler ---

module "doppler" {
  source = "../doppler"

  project_name = replace(var.name, "-${var.env}", "")
  env          = var.env

  secrets = merge(
    local.supabase_env_vars,
    { FROM_EMAIL = var.from_email, RESEND_API_KEY = var.resend_api_key },
    {
      NEXT_PUBLIC_STORE_ID               = var.store_id
      NEXT_PUBLIC_SITE_URL               = "https://${var.domain}"
      NEXT_PUBLIC_BASE_URL               = "https://${var.domain}"
      NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY     = var.paystack_public_key
      PAYSTACK_SECRET_KEY                = var.paystack_secret_key
      LOG_LEVEL                          = var.env == "dev" ? "debug" : "info"
      SUPABASE_DB_PASSWORD               = var.supabase_db_password
      SUPABASE_DATABASE_URL              = var.supabase_database_url
      ADMIN_EMAIL                        = local.admin_email
      ADMIN_PASSWORD                     = random_password.admin_password.result
      # Cross-project reference — Doppler resolves this at runtime from tor-common
      AUTH_ENCRYPTION_KEY                = "$${tor-common.${var.env}.AUTH_ENCRYPTION_KEY}"
      NEXT_PUBLIC_IMAGEKIT_URL           = var.imagekit_url
    }
  )
}
