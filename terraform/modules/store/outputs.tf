output "supabase_url" {
  value = module.supabase.url
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
