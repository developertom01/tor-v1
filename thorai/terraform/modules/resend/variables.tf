variable "name" {
  description = "Project name (used for API key name)"
  type        = string
}

variable "domain" {
  description = "Domain to register with Resend"
  type        = string
}

variable "from_email" {
  description = "From email address (e.g. 'Store <orders@domain.com>')"
  type        = string
}

variable "resend_api_key" {
  description = "Resend API key (created manually in Resend dashboard)"
  type        = string
  sensitive   = true
}
