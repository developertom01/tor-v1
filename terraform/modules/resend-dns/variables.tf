variable "domain" {
  description = "The base domain to add DNS records to (e.g. hairluksgudgh.com)"
  type        = string
}

variable "dns_records" {
  description = "DNS records returned by Resend domain registration (list of objects with name, type, value, optional priority)"
  type        = any
}

variable "team_id" {
  description = "Vercel team ID (leave empty for personal accounts)"
  type        = string
  default     = ""
}

# Required by root.hcl auto-generated providers.tf
variable "vercel_token" {
  description = "Vercel API token (injected by root.hcl)"
  type        = string
  sensitive   = true
  default     = ""
}

variable "vercel_team_id" {
  description = "Vercel team ID (injected by root.hcl)"
  type        = string
  default     = ""
}

# Other vars injected by root.hcl that must be declared to avoid errors
variable "supabase_access_token" {
  type    = string
  default = ""
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
variable "resend_api_key" {
  type      = string
  default   = ""
  sensitive = true
}
variable "doppler_token" {
  type      = string
  default   = ""
  sensitive = true
}
variable "paystack_public_key" {
  type    = string
  default = ""
}
variable "paystack_secret_key" {
  type      = string
  default   = ""
  sensitive = true
}
variable "git_repo" {
  type    = string
  default = ""
}
variable "google_client_id" {
  type    = string
  default = ""
}
variable "google_client_secret" {
  type      = string
  default   = ""
  sensitive = true
}
