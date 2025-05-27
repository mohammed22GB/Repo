

  frontend_alb_name   = "plug-frontend-dev-alb"
  alb_name            = "plug-api-dev-ecs-alb"
  domain_name         = "*.plugonline.io"
  vpc_cidr            = "10.0.0.0/16"
  public_subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24"]

  
  ###### ECS ######
  frontend_cluster_name        = "plug-frontend-dev-css"
  frontend_task_family         = "plug-frontends-dev-tf"
  frontend_ecr_image           = "379565802996.dkr.ecr.af-south-1.amazonaws.com/plug-frontend-dev"
  frontend_service_name        = "plug-frontend-dev-servicess"
  frontend_task_memory         = 4096
  frontend_task_cpu            = 2048
  frontend_execution_role_arn  = "arn:aws:iam::379565802996:role/EcsS3GetObject"
  frontend_task_role_arn       = "arn:aws:iam::379565802996:role/EcsS3GetObject"
  frontend_desired_count       = 1
  target_group_frontend_name   = "plug-frontend-dev-ecs-tg"
  frontend_min_capacity        = 1
  frontend_max_capacity        = 5
  frontend_environment_file    = "arn:aws:s3:::plug-api-env/plug-frontend/.env"
  public_subnets      = ["subnet-08a794d1b19b71444", "subnet-026bde4f2c0a74254"]
  vpc_id              = "vpc-025ae6efe5425a77d"
  subject_alternative_names = ["*.plugonline.io", "plugonline.io"]
  

###### plug-api ######
  aws_ecs_task_definition = false
  codedeploy_role_arn    = "arn:aws:iam::379565802996:role/CodeDeployECSServiceRole"
  https_listener_arn  = "arn:aws:elasticloadbalancing:af-south-1:379565802996:listener/app/plug-api-dev-ecs-alb/c3e1df5eda0b5043/8c676a372be8d73d"
  cluster_name        = "plug-api-dev-cs"
  task_family         = "plug-api-dev-tf"
  ecr_image           = "379565802996.dkr.ecr.af-south-1.amazonaws.com/plug_api_dev"
  service_name        = "plug-api-dev-service"
  task_memory         = 16384
  task_cpu            = 4096
  execution_role_arn  = "arn:aws:iam::379565802996:role/EcsS3GetObject"
  task_role_arn       = "arn:aws:iam::379565802996:role/EcsS3GetObject"
  desired_count       = 1
  target_group_name   = "plug-api-dev-tg"
  min_capacity        = 1
  max_capacity        = 5
  environment_file    = "arn:aws:s3:::plug-api-env/plug-api-dev-env/.env"

  
  
