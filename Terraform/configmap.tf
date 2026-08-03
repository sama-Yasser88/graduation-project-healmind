resource "kubernetes_config_map" "backend_config" {

  metadata {
    name      = "backend-config"
    namespace = kubernetes_namespace.healmind.metadata[0].name
  }

  data = {
    NODE_ENV = "production"
    PORT     = "5000"
  }
}