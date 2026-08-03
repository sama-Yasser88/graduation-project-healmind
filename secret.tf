resource "kubernetes_secret" "backend_secret" {

  metadata {
    name      = "backend-secret"
    namespace = kubernetes_namespace.healmind.metadata[0].name
  }

  data = {
    MONGO_URI = base64encode(var.mongo_uri)
    JWT_SECRET = base64encode(var.jwt_secret)
  }

  type = "Opaque"
}