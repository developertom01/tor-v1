output "client_id" {
  description = "Google OAuth client ID"
  value       = google_iap_client.this.client_id
}

output "client_secret" {
  description = "Google OAuth client secret"
  value       = google_iap_client.this.secret
  sensitive   = true
}
