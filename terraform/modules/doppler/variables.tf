variable "project_name" {
  description = "Doppler project name (store name, e.g. hairlukgud)"
  type        = string
}

variable "env" {
  description = "Environment to write secrets to (dev, staging, prod)"
  type        = string
}

variable "doppler_token" {
  description = "Doppler API token for project existence check"
  type        = string
  sensitive   = true
}

variable "secrets" {
  description = "Map of secrets to store in Doppler"
  type        = map(string)
  sensitive   = true
  default     = {}
}
