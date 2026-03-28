# --- Generated secrets ---

resource "random_password" "db_password" {
  length  = 32
  special = true
}

resource "random_password" "admin_password" {
  length           = 16
  special          = true
  override_special = "!@#$%&*"
}

locals {
  admin_email = var.env == "prod" ? "admin@${var.base_domain}" : "${var.env}.admin@${var.base_domain}"
}

# --- Supabase ---

module "supabase" {
  source = "../supabase"

  name                 = var.name
  org_id               = var.supabase_org_id
  region               = var.supabase_region
  domain               = var.domain
  db_password          = random_password.db_password.result
  google_client_id     = var.google_client_id
  google_client_secret = var.google_client_secret
}

# --- Google OAuth ---
# NOTE: OAuth clients must be created manually in GCP console
# (IAP Brand requires a GCP organization, not available on personal accounts)
# Set TF_VAR_GOOGLE_CLIENT_ID and TF_VAR_GOOGLE_CLIENT_SECRET env vars to enable Google Auth

# --- Resend (only for prd — dev shares prd's domain) ---

module "resend" {
  source = "../resend"
  count  = var.env == "prod" ? 1 : 0

  name           = var.name
  domain         = var.base_domain
  from_email     = var.from_email
  resend_api_key = var.resend_api_key
}

# --- Vercel ---

module "vercel" {
  source = "../vercel"

  name       = var.name
  domain     = var.domain
  root_dir   = var.root_dir
  git_repo   = var.git_repo
  git_branch = var.git_branch
  team_id    = var.vercel_team_id
  env        = var.env

  env_vars = merge(
    module.supabase.env_vars,
    var.env == "prod" ? module.resend[0].env_vars : {
      RESEND_API_KEY = "placeholder-set-in-doppler"
      FROM_EMAIL     = var.from_email
    },
    {
      NEXT_PUBLIC_SITE_URL           = "https://${var.domain}"
      NEXT_PUBLIC_BASE_URL           = "https://${var.domain}"
      NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY = var.paystack_public_key
      PAYSTACK_SECRET_KEY            = var.paystack_secret_key
      LOG_LEVEL                      = var.env == "dev" ? "debug" : "info"
    }
  )
}

# --- Doppler ---

module "doppler" {
  source = "../doppler"

  project_name = replace(var.name, "-${var.env}", "")
  env          = var.env

  secrets = merge(
    module.supabase.env_vars,
    var.env == "prod" ? module.resend[0].env_vars : {},
    {
      NEXT_PUBLIC_SITE_URL           = "https://${var.domain}"
      NEXT_PUBLIC_BASE_URL           = "https://${var.domain}"
      NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY = var.paystack_public_key
      PAYSTACK_SECRET_KEY            = var.paystack_secret_key
      LOG_LEVEL                      = var.env == "dev" ? "debug" : "info"
      SUPABASE_DB_PASSWORD           = random_password.db_password.result
      SUPABASE_DATABASE_URL          = module.supabase.database_url
      ADMIN_EMAIL                    = local.admin_email
      ADMIN_PASSWORD                 = random_password.admin_password.result
    }
  )
}
