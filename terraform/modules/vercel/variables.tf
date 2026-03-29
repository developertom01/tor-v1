variable "project_id" {
  description = "Vercel project ID (created separately by vercel-project module)"
  type        = string
}

variable "domain" {
  description = "Domain for this environment"
  type        = string
}

variable "env" {
  description = "Environment name (dev, prod)"
  type        = string
}

variable "env_vars" {
  description = "Environment variables to set on the project"
  type        = map(string)
  default     = {}
}

variable "team_id" {
  description = "Vercel team ID"
  type        = string
  default     = ""
}

# ── Required by root.hcl-generated providers.tf ──

variable "vercel_token" {
  type      = string
  sensitive = true
  default   = ""
}

variable "vercel_team_id" {
  type    = string
  default = ""
}

variable "doppler_token" {
  type      = string
  sensitive = true
  default   = ""
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
