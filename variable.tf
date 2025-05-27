
######### For ECS #########

variable "frontend_cluster_name" {
  description = "Name of the ECS cluster"
  type        = string
}

variable "frontend_task_family" {
  description = "Task family name for ECS Task Definition"
  type        = string
}


variable "frontend_environment_file" {
  description = "S3 ARN of the environment file"
  type        = string
}

variable "frontend_task_memory" {
  description = "Memory allocated for the ECS Task"
  type        = string
}

variable "frontend_task_cpu" {
  description = "CPU allocated for the ECS Task"
  type        = string
}

variable "frontend_execution_role_arn" {}

variable "frontend_task_role_arn" {}

variable "frontend_service_name" {}

variable "frontend_desired_count" {
  description = "Desired number of ECS tasks for the service"
  type        = number
}


variable "frontend_min_capacity" {
  description = "Minimum capacity for ECS service autoscaling"
  type        = number
}

variable "frontend_max_capacity" {
  description = "Maximum capacity for ECS service autoscaling"
  type        = number
}


##### ALB #####

# ALB Configuration
variable "frontend_alb_name" {}


variable "frontend_ecr_image" {}


variable "vpc_cidr" {
  description = "The CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}


variable "public_subnet_cidrs" {
  description = "CIDR blocks for the public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "vpc_id" {}

variable "public_subnets" {}




variable "subject_alternative_names" {
  description = "A list of additional FQDNs to be included in the Subject Alternative Name extension of the ACM certificate."
  type        = list(string)
  default     = []
}


variable "target_group_frontend_name" {}




###### plug-api ######

variable "cluster_name" {
  description = "Name of the ECS cluster"
  type        = string
}

variable "task_family" {
  description = "Task family name for ECS Task Definition"
  type        = string
}


variable "environment_file" {
  description = "S3 ARN of the environment file"
  type        = string
}

variable "task_memory" {
  description = "Memory allocated for the ECS Task"
  type        = string
}

variable "task_cpu" {
  description = "CPU allocated for the ECS Task"
  type        = string
}
variable "target_group_name" {}

variable "execution_role_arn" {}

variable "task_role_arn" {}

variable "service_name" {}

variable "desired_count" {
  description = "Desired number of ECS tasks for the service"
  type        = number
}


variable "min_capacity" {
  description = "Minimum capacity for ECS service autoscaling"
  type        = number
}

variable "max_capacity" {
  description = "Maximum capacity for ECS service autoscaling"
  type        = number
}


##### ALB #####

# ALB Configuration
variable "alb_name" {}


variable "ecr_image" {}


variable "domain_name" {
  description = "The domain name for which the ACM certificate is requested."
  type        = string
  default     = "*.plugonline.io"
}



variable "key_algorithm" {
  description = "The key algorithm for the ACM certificate."
  type        = string
  default     = "RSA_2048"
}


variable "https_listener_arn" {
  type        = string
  description = "ARN of the HTTPS listener"
}


variable "codedeploy_role_arn" {
  description = "ARN of the CodeDeploy service role"
  type        = string
}

variable aws_ecs_task_definition {}
