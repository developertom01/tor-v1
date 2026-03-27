output "project_name" {
  description = "Doppler project name"
  value       = doppler_project.this.name
}

output "environments" {
  description = "Doppler environment slugs"
  value = {
    dev = doppler_environment.dev.slug
    staging = doppler_environment.staging.slug
    prod    = doppler_environment.prod.slug
  }
}
