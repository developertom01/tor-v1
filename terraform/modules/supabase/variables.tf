variable "name" {
  description = "Project name (e.g. tor-dev, tor-prod)"
  type        = string
}

variable "org_id" {
  description = "Supabase organization ID"
  type        = string
}

variable "region" {
  description = "Supabase region"
  type        = string
  default     = "eu-west-2"
}

variable "google_client_id" {
  description = "Google OAuth client ID for Supabase Auth"
  type        = string
  default     = ""
}

variable "google_client_secret" {
  description = "Google OAuth client secret for Supabase Auth"
  type        = string
  sensitive   = true
  default     = ""
}

variable "domains" {
  description = "List of all store domains that use this Supabase project (for auth redirect URLs)"
  type        = list(string)
}

# ── Provider variables (declared by root.hcl generated providers.tf) ──

variable "supabase_access_token" {
  type      = string
  sensitive = true
  default   = ""
}

variable "google_project_id" {
  type    = string
  default = ""
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

variable "doppler_token" {
  type      = string
  sensitive = true
  default   = ""
}
