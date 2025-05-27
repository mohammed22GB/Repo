# ALB Outputs

# modules/alb/outputs.tf

output "listener_arn" {
  value = aws_lb_listener.https.arn
}

output "app_tg_name" {
  value = aws_lb_target_group.app_tg.name
}

output "app_tg_green_name" {
  value = aws_lb_target_group.app_tg_green.name
}



output "target_group_name" {
  value = aws_lb_target_group.app_tg.name
}

output "alb_arn" {
  description = "ARN of the Application Load Balancer"
  value       = aws_lb.app_alb.arn
}

output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.app_alb.dns_name
}

output "alb_zone_id" {
  description = "Zone ID of the Application Load Balancer"
  value       = aws_lb.app_alb.zone_id
}

output "target_group_arn" {
  value       = aws_lb_target_group.app_tg.arn
  description = "ARN of the ALB Target Group"
}

output "listener_arns" {
  value       = aws_lb_listener.https.arn
  description = "ARN of the ALB Listener"
}

output "load_balancer_arn" {
  value       = aws_lb.app_alb.arn
  description = "ARN of the Load Balancer"
}

#### plug-frontend

output "frontend_alb_arn" {
  description = "ARN of the Application Load Balancer"
  value       = aws_lb.frontend_alb.arn
}

output "frontend_alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.frontend_alb.dns_name
}

output "frontend_alb_zone_id" {
  description = "Zone ID of the Application Load Balancer"
  value       = aws_lb.frontend_alb.zone_id
}

output "frontend_target_group_arn" {
  value       = aws_lb_target_group.frontend_app_tg.arn
  description = "ARN of the ALB Target Group"
}

output "frontend_listener_arn" {
  value       = aws_lb_listener.frontend_https.arn
  description = "ARN of the ALB Listener"
}

output "frontend_load_balancer_arn" {
  value       = aws_lb.frontend_alb.arn
  description = "ARN of the Load Balancer"
}
