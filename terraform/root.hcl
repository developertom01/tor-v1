# Root Terragrunt config — shared across all envs and stores

remote_state {
  backend = "remote"
  generate = {
    path      = "backend.tf"
    if_exists = "overwrite_terragrunt"
  }
  config = {
    organization = "project-tor"
    workspaces = {
      name = replace(path_relative_to_include(), "/", "-")
    }
  }
}

# Generate provider config once — all stores inherit it
generate "providers" {
  path      = "providers.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<-EOF
    terraform {
      required_version = ">= 1.5"

      required_providers {
        vercel = {
          source  = "vercel/vercel"
          version = "~> 2.0"
        }
        supabase = {
          source  = "supabase/supabase"
          version = "~> 1.0"
        }
        google = {
          source  = "hashicorp/google"
          version = "~> 5.0"
        }
        doppler = {
          source  = "DopplerHQ/doppler"
          version = "~> 1.0"
        }
        restapi = {
          source  = "Mastercard/restapi"
          version = "~> 1.0"
        }
      }
    }

    provider "supabase" {
      access_token = var.supabase_access_token
    }

    provider "google" {
      project = var.google_project_id
    }

    provider "vercel" {
      api_token = var.vercel_token
      team      = var.vercel_team_id != "" ? var.vercel_team_id : null
    }

    provider "restapi" {
      uri                  = "https://api.resend.com"
      write_returns_object = true

      headers = {
        Authorization = "Bearer $${var.resend_api_key}"
        Content-Type  = "application/json"
      }
    }

    provider "doppler" {
      doppler_token = var.doppler_token
    }
  EOF
}

# Shared inputs — credentials from TF_VAR_* env vars, passed to every store module
inputs = {
  supabase_access_token = get_env("TF_VAR_SUPABASE_ACCESS_TOKEN", get_env("TF_VAR_supabase_access_token", ""))
  supabase_org_id       = get_env("TF_VAR_SUPABASE_ORG_ID", get_env("TF_VAR_supabase_org_id", ""))
  supabase_region       = get_env("TF_VAR_SUPABASE_REGION", get_env("TF_VAR_supabase_region", "eu-west-2"))
  supabase_db_password  = get_env("TF_VAR_SUPABASE_DB_PASSWORD", get_env("TF_VAR_supabase_db_password", "placeholder"))
  google_project_id     = get_env("TF_VAR_GOOGLE_PROJECT_ID", get_env("TF_VAR_google_project_id", ""))
  google_support_email  = get_env("TF_VAR_GOOGLE_SUPPORT_EMAIL", get_env("TF_VAR_google_support_email", ""))
  resend_api_key        = get_env("TF_VAR_RESEND_API_KEY", get_env("TF_VAR_resend_api_key", ""))
  vercel_token          = get_env("TF_VAR_VERCEL_TOKEN", get_env("TF_VAR_vercel_token", ""))
  vercel_team_id        = get_env("TF_VAR_VERCEL_TEAM_ID", get_env("TF_VAR_vercel_team_id", ""))
  doppler_token         = get_env("TF_VAR_DOPPLER_TOKEN", get_env("TF_VAR_doppler_token", ""))
  paystack_public_key   = get_env("TF_VAR_PAYSTACK_PUBLIC_KEY", get_env("TF_VAR_paystack_public_key", "placeholder"))
  paystack_secret_key   = get_env("TF_VAR_PAYSTACK_SECRET_KEY", get_env("TF_VAR_paystack_secret_key", "placeholder"))
  git_repo              = get_env("TF_VAR_GIT_REPO", get_env("TF_VAR_git_repo", "developertom01/tor-v1"))
}
