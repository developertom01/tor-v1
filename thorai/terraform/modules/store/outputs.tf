output "admin_email" {
  description = "Admin email for this store"
  value       = local.admin_email
}

output "admin_password" {
  description = "Generated admin password"
  value       = random_password.admin_password.result
  sensitive   = true
}

output "vercel_domain" {
  value = module.vercel.domain
}


output "doppler_project" {
  value = module.doppler.project_name
}
