variable "name" {
  description = "Vercel project name"
  type        = string
}

variable "domain" {
  description = "Primary domain"
  type        = string
}

variable "dev_subdomain" {
  description = "Dev subdomain prefix (e.g. 'dev' for dev.domain.com)"
  type        = string
  default     = "dev"
}

variable "root_dir" {
  description = "Root directory in monorepo (e.g. apps/hairlukgud)"
  type        = string
}

variable "git_repo" {
  description = "GitHub repository (org/repo)"
  type        = string
}

variable "git_branch" {
  description = "Git branch for deployments"
  type        = string
  default     = "main"
}

variable "team_id" {
  description = "Vercel team ID"
  type        = string
  default     = ""
}

variable "env_vars" {
  description = "Environment variables to set on the project"
  type        = map(string)
  sensitive   = true
  default     = {}
}

variable "env" {
  description = "Environment name (dev, prod)"
  type        = string
  default     = "prod"
}

variable "framework" {
  description = "Framework preset"
  type        = string
  default     = "nextjs"
}

variable "node_version" {
  description = "Node.js version"
  type        = string
  default     = "22.x"
}
