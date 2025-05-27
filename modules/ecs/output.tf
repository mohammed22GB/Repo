output "cluster_name" {
  description = "ID of the ECS cluster"
  value       = aws_ecs_cluster.cluster.name
}

output "ecs_task_definition_arn" {
  description = "ARN of the ECS Task Definition"
  value       = aws_ecs_task_definition.app.arn
}

output "ecs_service_name" {
  description = "Name of the ECS Service"
  value       = aws_ecs_service.app.name
}


output "autoscaling_target_id" {
  description = "ID of the Auto Scaling Target"
  value       = aws_appautoscaling_target.ecs_scaling.id
}

output "scale_up_policy_arn" {
  description = "ARN of the scale-up policy"
  value       = aws_appautoscaling_policy.scale_up.arn
}

output "scale_down_policy_arn" {
  description = "ARN of the scale-down policy"
  value       = aws_appautoscaling_policy.scale_down.arn
}



###### plug-frontend ######

output "frontend_cluster_name" {
  description = "ID of the ECS cluster"
  value       = aws_ecs_cluster.frontend_cluster.name
}

output "frontend_ecs_task_definition_arn" {
  description = "ARN of the ECS Task Definition"
  value       = aws_ecs_task_definition.frontend_app.arn
}

output "frontend_ecs_service_name" {
  description = "Name of the ECS Service"
  value       = aws_ecs_service.frontend_app.name
}


output "frontend_autoscaling_target_id" {
  description = "ID of the Auto Scaling Target"
  value       = aws_appautoscaling_target.frontend_ecs_scaling.id
}

output "frontend_scale_up_policy_arn" {
  description = "ARN of the scale-up policy"
  value       = aws_appautoscaling_policy.frontend_scale_up.arn
}

output "frontend_scale_down_policy_arn" {
  description = "ARN of the scale-down policy"
  value       = aws_appautoscaling_policy.frontend_scale_down.arn
}