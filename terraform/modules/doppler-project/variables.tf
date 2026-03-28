variable "project_name" {
  description = "Doppler project name (store name, e.g. hairlukgud)"
  type        = string
}

# Required by the generated providers.tf from root.hcl
variable "supabase_access_token" {
  type      = string
  default   = ""
  sensitive = true
}

variable "google_project_id" {
  type    = string
  default = ""
}

variable "vercel_token" {
  type      = string
  default   = ""
  sensitive = true
}

variable "vercel_team_id" {
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
