resource "kubernetes_deployment" "frontend" {

  metadata {
    name      = "frontend"
    namespace = kubernetes_namespace.healmind.metadata[0].name
  }

  spec {

    replicas = 2

    selector {
      match_labels = {
        app = "frontend"
      }
    }

    template {

      metadata {
        labels = {
          app = "frontend"
        }
      }

      spec {

        container {

          name  = "frontend"

          image = "hagersherif/healmind-frontend:latest"

          port {
            container_port = 80
          }
        }
      }
    }
  }
}