resource "kubernetes_deployment" "backend" {

  metadata {
    name      = "backend"
    namespace = kubernetes_namespace.healmind.metadata[0].name
  }

  spec {
    replicas = 2

    selector {
      match_labels = {
        app = "backend"
      }
    }

    template {
      metadata {
        labels = {
          app = "backend"
        }
      }

      spec {
        container {

          name  = "backend"

          image = "hagersherif/healmind-backend"

          port {
            container_port = 5000
          }
        }
      }
    }
  }
}