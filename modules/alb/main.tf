resource "aws_lb" "app_alb" {
  name                = var.alb_name
  internal            = false
  load_balancer_type  = "application"
  security_groups     = [var.plug-api-dev-sg-ecs]
  subnets             = var.public_subnets
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.app_alb.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = var.certificate_arn

  default_action {
    type             = "forward"
    forward {
      target_group {
        arn    = aws_lb_target_group.app_tg.arn  # Blue
        weight = 100
      }
      target_group {
        arn    = aws_lb_target_group.app_tg_green.arn  # Green
        weight = 0
      }
      stickiness {
        enabled  = false
        duration = 1
      }
    }
  }
}



resource "aws_lb_target_group" "app_tg" {
  name        = var.target_group_name
  port        = 80
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"
  health_check {
    path                = "/health"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

resource "aws_lb_target_group" "app_tg_green" {
  name        = "${var.target_group_name}-green"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"
  health_check {
    path                = "/health"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}



##### plug-frontend #####

resource "aws_lb" "frontend_alb" {
  name                = var.frontend_alb_name
  internal            = false
  load_balancer_type  = "application"
  security_groups     = [var.plug-api-dev-sg-ecs]
  subnets             = var.public_subnets
}

resource "aws_lb_listener" "frontend_https" {
  load_balancer_arn = aws_lb.frontend_alb.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = var.certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend_app_tg.arn
  }
}


resource "aws_lb_target_group" "frontend_app_tg" {
  name        = var.target_group_frontend_name
  port        = 80
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"
  health_check {
    path                = "/health"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}
