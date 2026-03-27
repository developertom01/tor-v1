# --- Supabase ---

module "supabase" {
  source = "../supabase"

  name        = var.name
  org_id      = var.supabase_org_id
  region      = var.supabase_region
  db_password = var.supabase_db_password
}

# --- Google OAuth ---
# NOTE: OAuth clients must be created manually in GCP console
# (IAP Brand requires a GCP organization, not available on personal accounts)
# Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to each store's Doppler project

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

  name = var.name

  secrets = merge(
    module.supabase.env_vars,
    var.env == "prod" ? module.resend[0].env_vars : {},
    {
      NEXT_PUBLIC_SITE_URL           = "https://${var.domain}"
      NEXT_PUBLIC_BASE_URL           = "https://${var.domain}"
      NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY = var.paystack_public_key
      PAYSTACK_SECRET_KEY            = var.paystack_secret_key
      LOG_LEVEL                      = var.env == "dev" ? "debug" : "info"
    }
  )
}
