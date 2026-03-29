variable "env" {
  description = "Environment name (dev, prod)"
  type        = string
}

variable "doppler_project" {
  description = "Doppler project name for common secrets (e.g. tor-common)"
  type        = string
  default     = "tor-common"
}
