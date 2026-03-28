output "admin_email" {
  description = "Admin email for this store"
  value       = local.admin_email
}

output "admin_password" {
  description = "Generated admin password"
  value       = random_password.admin_password.result
  sensitive   = true
}

output "vercel_domains" {
  value = module.vercel.domains
}

output "resend_dns_records" {
  description = "DNS records to add at your registrar (prod only)"
  value       = var.env == "prod" ? module.resend[0].dns_records : []
}

output "doppler_project" {
  value = module.doppler.project_name
}
