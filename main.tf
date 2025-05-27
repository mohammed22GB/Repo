
module "alb" {
  source             = "./modules/alb"
  frontend_alb_name     = var.frontend_alb_name
  
  certificate_arn     = "arn:aws:acm:af-south-1:379565802996:certificate/5dcb35d7-e7f2-442f-86e4-d3a09a2182df"
  target_group_frontend_name   = var.target_group_frontend_name
  plug-api-dev-sg-ecs         = "sg-038f239c25c2b2a05"
  vpc_id              = var.vpc_id
  public_subnets      = var.public_subnets

  alb_name            = var.alb_name
  target_group_name   = var.target_group_name
}

module "ecs" {
  source                = "./modules/ecs"
  https_listener_arn = var.https_listener_arn
  target_group_name     = module.alb.app_tg_name
  aws_ecs_task_definition = var. aws_ecs_task_definition
  codedeploy_role_arn = var.codedeploy_role_arn
  frontend_cluster_name          = var.frontend_cluster_name
  frontend_alb_target_group_arn  = module.alb.frontend_target_group_arn
  frontend_lb_listener_arn       = module.alb.frontend_listener_arn
  frontend_task_family           = var.frontend_task_family
  frontend_ecr_image             = "379565802996.dkr.ecr.af-south-1.amazonaws.com/plug-frontend-dev"
  frontend_service_name          = var.frontend_service_name
  plug-api-dev-sg-ecs         = "sg-038f239c25c2b2a05"
  frontend_task_memory           = var.frontend_task_memory
  frontend_task_cpu              = var.frontend_task_cpu
  frontend_execution_role_arn    = var.frontend_execution_role_arn
  frontend_task_role_arn         = var.frontend_task_role_arn
  frontend_desired_count         = var.frontend_desired_count
  frontend_min_capacity          = var.frontend_min_capacity
  frontend_max_capacity          = var.frontend_max_capacity
  frontend_environment_file      = var.frontend_environment_file


  cluster_name          = var.cluster_name
  alb_target_group_arn  = module.alb.target_group_arn
  lb_listener_arn       = module.alb.listener_arn
  task_family           = var.task_family
  ecr_image             = "379565802996.dkr.ecr.af-south-1.amazonaws.com/plug_api_dev"
  service_name          = var.service_name
  task_memory           = var.task_memory
  task_cpu              = var.task_cpu
  execution_role_arn    = var.execution_role_arn
  task_role_arn         = var.task_role_arn
  desired_count         = var.desired_count
  min_capacity          = var.min_capacity
  max_capacity          = var.max_capacity
  environment_file      = var.environment_file
}


module "networks" {
  source                = "./modules/networks"
  vpc_cidr              = "10.0.0.0/16"
  vpc_id                = var.vpc_id
  public_subnet_cidrs   = var.public_subnet_cidrs
}
