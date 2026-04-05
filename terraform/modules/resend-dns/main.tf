locals {
  # Build a stable map keyed by "type-name" for use with for_each
  records_map = {
    for r in var.dns_records :
    "${r.type}-${replace(coalesce(r.name, "root"), ".", "-")}" => r
  }

  # Split into MX and non-MX so we can handle mx_priority separately
  mx_records  = { for k, r in local.records_map : k => r if r.type == "MX" }
  txt_records = { for k, r in local.records_map : k => r if r.type != "MX" }
}

# TXT, CNAME records (SPF text, DKIM, DMARC)
resource "vercel_dns_record" "txt" {
  for_each = local.txt_records

  domain  = var.domain
  name    = each.value.name
  type    = each.value.type
  value   = each.value.value
  ttl     = 300
  team_id = var.team_id != "" ? var.team_id : null
}

# MX records (Resend bounce handling)
resource "vercel_dns_record" "mx" {
  for_each = local.mx_records

  domain      = var.domain
  name        = each.value.name
  type        = "MX"
  value       = each.value.value
  mx_priority = try(each.value.priority, 10)
  ttl         = 300
  team_id     = var.team_id != "" ? var.team_id : null
}
