variable "name" {
  description = "Project name"
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

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
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

variable "storage_buckets" {
  description = "List of storage buckets to create"
  type = list(object({
    name   = string
    public = bool
  }))
  default = [{ name = "products", public = true }]
}
