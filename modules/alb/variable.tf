# ALB Configuration
variable "alb_name" {
  description = "Name of the Application Load Balancer"
  type        = string
}

variable "plug-api-dev-sg-ecs" {
  description = "Id of the security group"
  type        = string
}

# Listener Configuration

# Target Group Configuration
variable "target_group_name" {
  description = "Name of the target group"
  type        = string
}

variable "vpc_id" {
  description = "ID of the VPC for the target group"
  type        = string
}

variable "public_subnets" {
  description = "CIDR blocks for the public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "certificate_arn" {
  description = "ARN of the certificate to use for the ALB"
  type        = string
}




variable "frontend_alb_name" {
  description = "Name of the Application Load Balancer"
  type        = string
}

# Listener Configuration

# Target Group Configuration
variable "target_group_frontend_name" {
  description = "Name of the target group"
  type        = string
}
