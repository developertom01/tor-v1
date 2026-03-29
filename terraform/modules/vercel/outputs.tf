output "domain" {
  description = "Primary domain for this environment"
  value       = vercel_project_domain.this.domain
}
