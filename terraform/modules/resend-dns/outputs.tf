output "record_count" {
  description = "Number of DNS records created"
  value       = length(vercel_dns_record.txt) + length(vercel_dns_record.mx)
}
