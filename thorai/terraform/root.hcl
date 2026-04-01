# ThorAI — standalone Terraform root config
# Self-contained: no dependency on the parent monorepo.
# When moved to project-thor/thor-v2, this file works as-is.

generate "backend" {
  path      = "backend.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<-EOF
    terraform {
      cloud {
        organization = "project-tor"
        workspaces {
          name = "thorai-${replace(path_relative_to_include(), "/", "-")}"
        }
      }
    }
  EOF
}

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
        doppler = {
          source  = "DopplerHQ/doppler"
          version = "~> 1.0"
        }
        random = {
          source  = "hashicorp/random"
          version = "~> 3.0"
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

inputs = {
  supabase_access_token = get_env("TF_VAR_SUPABASE_ACCESS_TOKEN", "")
  supabase_org_id       = get_env("TF_VAR_SUPABASE_ORG_ID", "")
  supabase_region       = get_env("TF_VAR_SUPABASE_REGION", "eu-west-2")
  resend_api_key        = get_env("TF_VAR_RESEND_API_KEY", "")
  vercel_token          = get_env("TF_VAR_VERCEL_TOKEN", "")
  vercel_team_id        = get_env("TF_VAR_VERCEL_TEAM_ID", "")
  doppler_token         = get_env("TF_VAR_DOPPLER_TOKEN", "")
  git_repo              = get_env("TF_VAR_GIT_REPO", "project-thor/thor-v2")
}
