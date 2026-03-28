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

output "database_url" {
  description = "Pooler connection string for migrations"
  value       = "postgresql://postgres.${supabase_project.this.id}:${urlencode(var.db_password)}@aws-0-${var.region}.pooler.supabase.com:5432/postgres"
  sensitive   = true
}

output "env_vars" {
  description = "Env vars map for downstream modules"
  value = {
    NEXT_PUBLIC_SUPABASE_URL             = "https://${supabase_project.this.id}.supabase.co"
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = data.supabase_apikeys.this.anon_key
    SUPABASE_SECRET_KEY                  = data.supabase_apikeys.this.service_role_key
  }
  sensitive = true
}
