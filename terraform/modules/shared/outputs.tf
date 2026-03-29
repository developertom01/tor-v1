output "auth_encryption_key" {
  description = "AES-256 encryption key (hex) for per-store password encryption"
  value       = random_bytes.auth_encryption_key.hex
  sensitive   = true
}
