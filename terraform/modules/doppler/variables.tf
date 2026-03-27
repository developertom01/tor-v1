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
