provider "aws" {
  region = "af-south-1"
  
}

terraform {
  required_version = ">= 1.9.8"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.78.0"
    }
  }

  backend "s3" {
    bucket         = "plug-api-dev-tf-state"
    key            = "plug-api-dev.tf-state"
    region         = "af-south-1"
  }
}


resource "aws_acm_certificate" "certificate" {
  domain_name               = var.domain_name
  key_algorithm             = var.key_algorithm
  subject_alternative_names = var.subject_alternative_names
  tags                      = {}
    tags_all                  = {}
}


###ALB####