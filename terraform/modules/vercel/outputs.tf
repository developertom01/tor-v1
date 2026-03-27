output "project_id" {
  description = "Vercel project ID"
  value       = vercel_project.this.id
}

output "domains" {
  description = "Configured domains"
  value = {
    apex = vercel_project_domain.apex.domain
    www  = vercel_project_domain.www.domain
    dev  = vercel_project_domain.dev.domain
  }
}
