# Resend domain registration
resource "restapi_object" "domain" {
  path         = "/domains"
  data         = jsonencode({ name = var.domain })
  id_attribute = "id"
}

# Per-store API key
resource "restapi_object" "api_key" {
  path = "/api-keys"
  data = jsonencode({
    name       = "${var.name}-key"
    permission = "full_access"
  })
  id_attribute = "id"
}
