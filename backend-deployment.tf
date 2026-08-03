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

          image = "hagersherif/healmind-backend:latest"

          port {

            container_port = 5000
          }

          env_from {

            config_map_ref {
              name = kubernetes_config_map.backend_config.metadata[0].name
            }
          }

          env {

            name = "MONGO_URI"

            value_from {

              secret_key_ref {

                name = kubernetes_secret.backend_secret.metadata[0].name

                key = "MONGO_URI"
              }
            }
          }

          env {

            name = "JWT_SECRET"

            value_from {

              secret_key_ref {

                name = kubernetes_secret.backend_secret.metadata[0].name

                key = "JWT_SECRET"
              }
            }
          }

        }
      }
    }
  }
}