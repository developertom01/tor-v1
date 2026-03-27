variable "display_name" {
  description = "Display name for the OAuth client"
  type        = string
}

variable "project_id" {
  description = "Google Cloud project ID"
  type        = string
}

variable "support_email" {
  description = "Support email for OAuth consent screen"
  type        = string
}

variable "redirect_uri" {
  description = "OAuth redirect URI (Supabase callback)"
  type        = string
}
