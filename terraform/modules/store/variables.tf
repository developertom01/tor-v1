# ── Store-specific variables ──

variable "name" {
  description = "Unique project name (e.g. hairlukgud-dev)"
  type        = string
}

variable "display_name" {
  description = "Human-readable store name"
  type        = string
}

variable "domain" {
  description = "Domain for this environment (e.g. dev.hairlookgoodgh.com)"
  type        = string
}

variable "base_domain" {
  description = "Base domain without prefix (e.g. hairlookgoodgh.com)"
  type        = string
}

variable "root_dir" {
  description = "Monorepo root directory (e.g. apps/hairlukgud)"
  type        = string
}

variable "from_email" {
  description = "From email address for transactional emails"
  type        = string
}

variable "env" {
  description = "Environment name (dev, prod)"
  type        = string
}

# ── Shared credentials & config (passed via root.hcl inputs) ──

variable "supabase_access_token" {
  type      = string
  sensitive = true
}

variable "supabase_org_id" {
  type = string
}

variable "supabase_region" {
  type    = string
  default = "eu-west-2"
}

variable "supabase_db_password" {
  type      = string
  sensitive = true
}

variable "google_project_id" {
  type = string
}

variable "google_support_email" {
  type = string
}

variable "google_client_id" {
  description = "Google OAuth client ID (created manually in GCP console)"
  type        = string
  default     = ""
}

variable "google_client_secret" {
  description = "Google OAuth client secret (created manually in GCP console)"
  type        = string
  sensitive   = true
  default     = ""
}

variable "resend_api_key" {
  type      = string
  sensitive = true
}

variable "vercel_token" {
  type      = string
  sensitive = true
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

variable "paystack_public_key" {
  type      = string
  sensitive = true
}

variable "paystack_secret_key" {
  type      = string
  sensitive = true
}

variable "git_repo" {
  type    = string
  default = "developertom01/tor-v1"
}

variable "git_branch" {
  type    = string
  default = "main"
}
