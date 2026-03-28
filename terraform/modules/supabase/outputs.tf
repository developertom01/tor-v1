output "project_ref" {
  description = "Supabase project reference ID"
  value       = supabase_project.this.id
}

output "url" {
  description = "Supabase API URL"
  value       = "https://${supabase_project.this.id}.supabase.co"
}

output "anon_key" {
  description = "Supabase publishable (anon) key"
  value       = data.supabase_apikeys.this.anon_key
  sensitive   = true
}

output "service_role_key" {
  description = "Supabase secret (service role) key"
  value       = data.supabase_apikeys.this.service_role_key
  sensitive   = true
}

output "db_password" {
  description = "Generated database password"
  value       = random_password.db_password.result
  sensitive   = true
}

output "database_url" {
  description = "Pooler connection string for migrations"
  value       = "postgresql://postgres.${supabase_project.this.id}:${urlencode(random_password.db_password.result)}@aws-0-${var.region}.pooler.supabase.com:5432/postgres"
  sensitive   = true
}
