# ── Store-specific variables ──

variable "name" {
  description = "Unique project name (e.g. hairlukgud-dev)"
  type        = string
}

variable "store_id" {
  description = "Store identifier for multi-tenant isolation (e.g. hairlukgud)"
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

# ── Shared Supabase (provisioned separately, passed in) ──

variable "supabase_url" {
  description = "Shared Supabase API URL"
  type        = string
}

variable "supabase_anon_key" {
  description = "Shared Supabase publishable (anon) key"
  type        = string
  sensitive   = true
}

variable "supabase_service_role_key" {
  description = "Shared Supabase secret (service role) key"
  type        = string
  sensitive   = true
}

variable "supabase_db_password" {
  description = "Shared Supabase database password"
  type        = string
  sensitive   = true
}

variable "supabase_database_url" {
  description = "Shared Supabase pooler connection string"
  type        = string
  sensitive   = true
}

# ── Shared credentials & config (passed via root.hcl inputs) ──

variable "google_project_id" {
  type    = string
  default = ""
}

variable "google_support_email" {
  type    = string
  default = ""
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


variable "auth_encryption_key" {
  description = "AES-256 key from tor-common (64 hex chars)"
  type        = string
  sensitive   = true
}
