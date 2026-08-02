resource "kubernetes_service" "backend" {

  metadata {
    name      = "backend-service"
    namespace = kubernetes_namespace.healmind.metadata[0].name
  }

  spec {

    selector = {
      app = "backend"
    }

    port {
      port        = 5000
      target_port = 5000
    }

    type = "ClusterIP"
  }
}