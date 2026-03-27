variable "name" {
  description = "Doppler project name"
  type        = string
}

variable "secrets" {
  description = "Map of secrets to store in Doppler"
  type        = map(string)
  sensitive   = true
  default     = {}
}

variable "vercel_project_id" {
  description = "Vercel project ID for integration sync"
  type        = string
  default     = ""
}
