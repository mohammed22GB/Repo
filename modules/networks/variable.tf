# VPC Variables

variable "enable_dns_hostnames" {
  description = "Enable DNS hostnames for the VPC"
  default     = true
}

variable "enable_dns_support" {
  description = "Enable DNS support for the VPC"
  default     = true
}

# Common Subnet Variables
variable "enable_dns64" {
  description = "Enable DNS64 for subnets"
  default     = false
}

variable "map_public_ip_on_launch" {
  description = "Map public IPs to instances launched in the subnet"
  default     = true
}


variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "vpc_name" {
  description = "Name of the VPC"
  type        = string
  default     = "plug-apivpc-dev"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for the public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "vpc_id" {
  description = "VPC ID for the resources"
  type        = string
}

variable "availability_zones" {
  description = "Availability Zones for public subnets"
  default     = ["af-south-1a", "af-south-1b"]
}
