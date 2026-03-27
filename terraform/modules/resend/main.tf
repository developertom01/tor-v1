# Resend domain registration
resource "restapi_object" "domain" {
  path         = "/domains"
  data         = jsonencode({ name = var.domain })
  id_attribute = "id"
}
