resource "kubernetes_service" "frontend" {

  metadata {
    name      = "frontend-service"
    namespace = kubernetes_namespace.healmind.metadata[0].name
  }

  spec {

    selector = {
      app = "frontend"
    }

    port {
      port        = 80
      target_port = 80
    }

    type = "NodePort"
  }
}