output "domain_id" {
  description = "Resend domain ID"
  value       = restapi_object.domain.id
}

output "dns_records" {
  description = "DNS records to add for domain verification"
  value       = jsondecode(restapi_object.domain.api_response).records
}

output "env_vars" {
  description = "Env vars for downstream modules"
  value = {
    RESEND_API_KEY = var.resend_api_key
    FROM_EMAIL     = var.from_email
  }
  sensitive = true
}
