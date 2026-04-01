variable "name" {
  description = "Vercel project name (e.g. hairlukgud)"
  type        = string
}

variable "root_dir" {
  description = "Monorepo root directory (e.g. apps/hairlukgud)"
  type        = string
}

variable "git_repo" {
  description = "GitHub repository (org/repo)"
  type        = string
  default     = "developertom01/tor-v1"
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

variable "git_repo_full" {
  type    = string
  default = ""
}
