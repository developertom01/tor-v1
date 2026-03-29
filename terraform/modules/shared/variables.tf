variable "env" {
  description = "Environment name (dev, prod)"
  type        = string
}

variable "doppler_project" {
  description = "Doppler project name for shared secrets (e.g. tor-shared)"
  type        = string
  default     = "tor-shared"
}
