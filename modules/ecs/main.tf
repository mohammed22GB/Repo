resource "aws_codedeploy_app" "ecs_app" {
  name = "${var.service_name}-codedeploy"
  compute_platform = "ECS"
}

resource "aws_codedeploy_deployment_group" "ecs_dg" {
  app_name              = aws_codedeploy_app.ecs_app.name
  deployment_group_name = "${var.service_name}-dg"
  service_role_arn      = var.codedeploy_role_arn

  deployment_config_name = "CodeDeployDefault.ECSAllAtOnce"

  deployment_style {
    deployment_type = "BLUE_GREEN"
    deployment_option = "WITH_TRAFFIC_CONTROL"
  }

  ecs_service {
    cluster_name = aws_ecs_cluster.cluster.name
    service_name = aws_ecs_service.app.name
  }

  load_balancer_info {
    target_group_pair_info {
      prod_traffic_route {
        listener_arns = [var.https_listener_arn]
      }

      target_group {
        name = var.target_group_name
      }

      target_group {
        name = "${var.target_group_name}-green"
      }
    }
  }

  # ✅ Required blue/green config
  blue_green_deployment_config {
    terminate_blue_instances_on_deployment_success {
      action                             = "TERMINATE"
      termination_wait_time_in_minutes  = 5
    }

    deployment_ready_option {
      action_on_timeout              = "CONTINUE_DEPLOYMENT"
      wait_time_in_minutes          = 0
    }

  }

  auto_rollback_configuration {
    enabled = true
    events  = ["DEPLOYMENT_FAILURE"]
  }
}


resource "aws_iam_role" "codedeploy_role" {
  name = "CodeDeployECSServiceRole"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = {
        Service = "codedeploy.amazonaws.com"
      },
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "codedeploy_policy_attach" {
  role       = aws_iam_role.codedeploy_role.name
  policy_arn = "arn:aws:iam::aws:policy/AWSCodeDeployRoleForECS"
}


data "aws_ecr_image" "latest2" {
  repository_name = "plug_api_dev"
  most_recent     = true
}

data "aws_ecr_image" "latest" {
  repository_name = "plug-frontend-dev"
  most_recent     = true
}

resource "aws_ecs_cluster" "cluster" {
  name = var.cluster_name
}

resource "aws_ecs_task_definition" "app" {
  family                   = var.task_family
  container_definitions    = jsonencode([
    {
      name      = "plug-api-dev"
      image     = "${data.aws_ecr_image.latest2.image_uri}"
      essential = true
      portMappings = [
        { containerPort = 5050, hostPort = 5050 },
        { containerPort = 80, hostPort = 80 },
        { containerPort = 6379, hostPort = 6379 },
        { containerPort = 27017, hostPort = 27017 },
        { containerPort = 443, hostPort = 443 }
      ]
      environmentFiles = [
        {
          type = "s3"
          value = var.environment_file
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs_logs.name
          awslogs-region        = "af-south-1"
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])
  execution_role_arn       = var.execution_role_arn
  task_role_arn            = var.task_role_arn
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  memory                   = var.task_memory
  cpu                      = var.task_cpu
}

resource "aws_cloudwatch_log_group" "ecs_logs" {
  name              = "/ecs/${var.task_family}"
  retention_in_days = 7 

  tags = {
    Name = "ecs-log-group"
  }
}

resource "aws_ecs_service" "app" {
  name            = var.service_name
  cluster         = aws_ecs_cluster.cluster.id
  desired_count   = var.desired_count
  task_definition = var.aws_ecs_task_definition ? aws_ecs_task_definition.app.arn : null
  launch_type     = "FARGATE"
  deployment_controller {
    type = "CODE_DEPLOY"
  }
  network_configuration {
    subnets         = var.public_subnets
    security_groups = [var.plug-api-dev-sg-ecs]
    assign_public_ip = true
  }
  load_balancer {
    target_group_arn = var.alb_target_group_arn
    container_name   = "plug-api-dev"
    container_port   = 5050
  }
  lifecycle {
    ignore_changes = [
      task_definition,  # Let CodeDeploy manage this after first deploy
    ]
  }
  enable_execute_command = true

  depends_on = [var.lb_listener_arn]
}


resource "aws_appautoscaling_target" "ecs_scaling" {
  depends_on = [aws_ecs_service.app]
  service_namespace  = "ecs"
  scalable_dimension = "ecs:service:DesiredCount"
  resource_id        = "service/${var.cluster_name}/${aws_ecs_service.app.name}"
  min_capacity       = var.min_capacity
  max_capacity       = var.max_capacity
}

resource "aws_appautoscaling_policy" "scale_up" {
  name              = "scale-up"
  policy_type       = "StepScaling"
  resource_id       = aws_appautoscaling_target.ecs_scaling.resource_id
  service_namespace = aws_appautoscaling_target.ecs_scaling.service_namespace
  scalable_dimension = aws_appautoscaling_target.ecs_scaling.scalable_dimension


  step_scaling_policy_configuration {
    adjustment_type = "ChangeInCapacity"

    step_adjustment {
      scaling_adjustment          = 1
      metric_interval_lower_bound = 0
    }
  }
}




resource "aws_appautoscaling_policy" "scale_down" {
  name               = "scale-down"
  policy_type       = "StepScaling"
  resource_id       = aws_appautoscaling_target.ecs_scaling.resource_id
  service_namespace = aws_appautoscaling_target.ecs_scaling.service_namespace
  scalable_dimension = aws_appautoscaling_target.ecs_scaling.scalable_dimension

  step_scaling_policy_configuration {
    adjustment_type = "ChangeInCapacity"

    step_adjustment {
      scaling_adjustment          = -1
      metric_interval_lower_bound = 0
    }
  }
}



resource "aws_iam_role" "ecs_task_execution_role" {
  name               = "execution_role3"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_policy_attachment" "ecs_task_s3_policy" {
  name       = "ecs-task-s3-policy-attachment3"
  roles      = [aws_iam_role.ecs_task_execution_role.name]
  policy_arn = aws_iam_policy.ecs_s3_policy.arn
}

resource "aws_iam_policy" "ecs_s3_policy" {
  name        = "ecs-s3-policies"
  description = "Policy to allow ECS to read .env file from S3 and enable SSM Session Manager"
  policy      = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = ["s3:GetObject"]
        Effect   = "Allow"
        Resource = "arn:aws:s3:::plug-api-env/plug-api-dev-env/.env"
      },
      {
        Action   = [
          "ecs:ExecuteCommand",
          "ssmmessages:CreateControlChannel",
          "ssmmessages:CreateDataChannel",
          "ssmmessages:OpenControlChannel",
          "ssmmessages:OpenDataChannel"
        ]
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}




###### plug-frontend ######

resource "aws_ecs_cluster" "frontend_cluster" {
  name = var.frontend_cluster_name
}

resource "aws_ecs_task_definition" "frontend_app" {
  family                   = var.frontend_task_family
  container_definitions    = jsonencode([
    {
      name      = "plug-frontend"
      image     = "${data.aws_ecr_image.latest.image_uri}"
      essential = true
      portMappings = [
        { containerPort = 80, hostPort = 80 }
      ]
      environmentFiles = [
        {
          type = "s3"
          value = var.frontend_environment_file
        }
      ]
    }
  ])
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  memory                   = var.frontend_task_memory
  cpu                      = var.frontend_task_cpu
  execution_role_arn       = var.frontend_execution_role_arn
  task_role_arn            = var.frontend_task_role_arn
}

resource "aws_ecs_service" "frontend_app" {
  name            = var.frontend_service_name
  cluster         = aws_ecs_cluster.frontend_cluster.id
  task_definition = aws_ecs_task_definition.frontend_app.arn
  desired_count   = var.frontend_desired_count
  launch_type     = "FARGATE"
  network_configuration {
    subnets         = var.public_subnets
    security_groups = [var.plug-api-dev-sg-ecs]
    assign_public_ip = true
  }
  load_balancer {
    target_group_arn = var.frontend_alb_target_group_arn
    container_name   = "plug-frontend"
    container_port   = 80
  }
  depends_on = [var.frontend_lb_listener_arn]
}


resource "aws_appautoscaling_target" "frontend_ecs_scaling" {
  depends_on = [aws_ecs_service.frontend_app]
  service_namespace  = "ecs"
  scalable_dimension = "ecs:service:DesiredCount"
  resource_id        = "service/${var.frontend_cluster_name}/${aws_ecs_service.frontend_app.name}"
  min_capacity       = var.frontend_min_capacity
  max_capacity       = var.frontend_max_capacity
}

resource "aws_appautoscaling_policy" "frontend_scale_up" {
  name              = "scale-up"
  policy_type       = "StepScaling"
  resource_id       = aws_appautoscaling_target.frontend_ecs_scaling.resource_id
  service_namespace = aws_appautoscaling_target.frontend_ecs_scaling.service_namespace
  scalable_dimension = aws_appautoscaling_target.frontend_ecs_scaling.scalable_dimension


  step_scaling_policy_configuration {
    adjustment_type = "ChangeInCapacity"

    step_adjustment {
      scaling_adjustment          = 1
      metric_interval_lower_bound = 0
    }
  }
}


resource "aws_appautoscaling_policy" "frontend_scale_down" {
  name               = "scale-down"
  policy_type       = "StepScaling"
  resource_id       = aws_appautoscaling_target.frontend_ecs_scaling.resource_id
  service_namespace = aws_appautoscaling_target.frontend_ecs_scaling.service_namespace
  scalable_dimension = aws_appautoscaling_target.frontend_ecs_scaling.scalable_dimension

  step_scaling_policy_configuration {
    adjustment_type = "ChangeInCapacity"

    step_adjustment {
      scaling_adjustment          = -1
      metric_interval_lower_bound = 0
    }
  }
}
