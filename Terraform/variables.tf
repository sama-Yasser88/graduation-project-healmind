variable "docker_username" {
  default = "samaYasser88"
}

variable "frontend_image" {
  default = "healmind-frontend"
}

variable "backend_image" {
  default = "healmind-backend"
}

variable "namespace" {
  default = "healmind"
}
variable "mongo_uri" {
  type = string
}

variable "jwt_secret" {
  type = string
}