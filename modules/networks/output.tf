# VPC Outputs
output "vpc_cidr_block" {
  description = "The CIDR block of the created VPC"
  value       = aws_vpc.plug_vpc_dev.cidr_block
}

output "vpc_id" {
  value = aws_vpc.plug_vpc_dev.id
}

output "vpc_name" {
  description = "The Name tag of the created VPC"
  value       = aws_vpc.plug_vpc_dev.tags["Name"]
}


output "plug-api-dev-sg-ecs" {
  description = "The ID of the created security group."
  value       = aws_security_group.plug_security_group.id
}


output "public_subnets" {
  description = "IDs of the created public subnets"
  value       = aws_subnet.public_subnets[*].id
}

output "internet_gateway_id" {
  description = "ID of the created Internet Gateway"
  value       = aws_internet_gateway.igw.id
}            
