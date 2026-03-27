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
  value       = supabase_project.this.anon_key
  sensitive   = true
}

output "service_role_key" {
  description = "Supabase secret (service role) key"
  value       = supabase_project.this.service_role_key
  sensitive   = true
}

output "env_vars" {
  description = "Env vars map for downstream modules"
  value = {
    NEXT_PUBLIC_SUPABASE_URL             = "https://${supabase_project.this.id}.supabase.co"
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = supabase_project.this.anon_key
    SUPABASE_SECRET_KEY                  = supabase_project.this.service_role_key
  }
  sensitive = true
}
