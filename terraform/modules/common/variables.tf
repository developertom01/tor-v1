variable "env" {
  description = "Environment name (dev, prod)"
  type        = string
}

variable "doppler_project" {
  description = "Doppler project name for common secrets (e.g. tor-common)"
  type        = string
  default     = "tor-common"
}

# ── Required by root.hcl-generated providers.tf ──

variable "doppler_token" {
  type      = string
  sensitive = true
  default   = ""
}

variable "vercel_token" {
  type      = string
  sensitive = true
  default   = ""
}

variable "vercel_team_id" {
  type    = string
  default = ""
}

variable "resend_api_key" {
  type      = string
  sensitive = true
  default   = ""
}

variable "supabase_access_token" {
  type      = string
  sensitive = true
  default   = ""
}

variable "supabase_org_id" {
  type    = string
  default = ""
}

variable "supabase_region" {
  type    = string
  default = ""
}

variable "google_project_id" {
  type    = string
  default = ""
}

variable "google_support_email" {
  type    = string
  default = ""
}

variable "google_client_id" {
  type    = string
  default = ""
}

variable "google_client_secret" {
  type      = string
  sensitive = true
  default   = ""
}

variable "paystack_public_key" {
  type      = string
  sensitive = true
  default   = ""
}

variable "paystack_secret_key" {
  type      = string
  sensitive = true
  default   = ""
}

variable "git_repo" {
  type    = string
  default = ""
}
