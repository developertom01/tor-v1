output "supabase_url" {
  value = module.supabase.url
}

output "supabase_project_ref" {
  description = "Supabase project reference for CLI and API access"
  value       = module.supabase.project_ref
}

output "supabase_service_role_key" {
  description = "Supabase service role key for admin operations"
  value       = module.supabase.service_role_key
  sensitive   = true
}

output "admin_email" {
  description = "Admin email for this store"
  value       = local.admin_email
}

output "admin_password" {
  description = "Generated admin password"
  value       = random_password.admin_password.result
  sensitive   = true
}

output "supabase_db_password" {
  description = "Generated database password"
  value       = random_password.db_password.result
  sensitive   = true
}

output "supabase_database_url" {
  description = "Pooler connection string for migrations"
  value       = module.supabase.database_url
  sensitive   = true
}

output "vercel_domains" {
  value = module.vercel.domains
}

output "resend_dns_records" {
  description = "DNS records to add at your registrar (prd only)"
  value       = var.env == "prod" ? module.resend[0].dns_records : []
}

output "doppler_project" {
  value = module.doppler.project_name
}
