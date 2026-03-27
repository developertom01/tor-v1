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
