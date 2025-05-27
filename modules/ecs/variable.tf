variable "codedeploy_role_arn" {
  description = "ARN of the IAM role for CodeDeploy"
  type        = string
}

variable "aws_ecs_task_definition" {
  description = "ARN of the IAM role for CodeDeploy"
  type        = string
}

variable "https_listener_arn" {
  description = "ARN of the HTTPS listener from ALB"
  type        = string
}

variable "target_group_name" {
  description = "Base name of the target group (blue target group)"
  type        = string
}



variable "cluster_name" {}

variable "task_family" {
  description = "Task family name for ECS Task Definition"
  type        = string
}

variable "ecr_image" {
  description = "ECR image URL for the container"
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

variable "execution_role_arn" {
  description = "IAM Role ARN for ECS Task Execution"
  type        = string
}

variable "task_role_arn" {
  description = "IAM Role ARN for ECS Task Role"
  type        = string
}


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

variable "public_subnets" {
  description = "CIDR blocks for the public subnets"
  type        = list(string)
  default     = ["subnet-08a794d1b19b71444", "subnet-026bde4f2c0a74254"]
}



variable "service_name" {
  description = "The ECS service name"
  type        = string
}

variable "plug-api-dev-sg-ecs" {}

variable "alb_target_group_arn" {
  description = "alb_target_group_arn"
  type        = string
}

variable "lb_listener_arn" {
  description = "The ARN of the load balancer listener"
  type        = string
}




###### plug-frontend ######

variable "frontend_cluster_name" {}

variable "frontend_task_family" {
  description = "Task family name for ECS Task Definition"
  type        = string
}

variable "frontend_ecr_image" {
  description = "ECR image URL for the container"
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

variable "frontend_execution_role_arn" {
  description = "IAM Role ARN for ECS Task Execution"
  type        = string
}

variable "frontend_task_role_arn" {
  description = "IAM Role ARN for ECS Task Role"
  type        = string
}


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



variable "frontend_service_name" {
  description = "The ECS service name"
  type        = string
}


variable "frontend_alb_target_group_arn" {
  description = "alb_target_group_arn"
  type        = string
}

variable "frontend_lb_listener_arn" {
  description = "The ARN of the load balancer listener"
  type        = string
}
