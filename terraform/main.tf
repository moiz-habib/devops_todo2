provider "aws" {
  region = var.aws_region
}

locals {
  key_path = "${path.module}/swarm_key.pub"
}

resource "aws_key_pair" "deploy" {
  key_name   = var.key_name
  public_key = file(local.key_path)
}

resource "aws_security_group" "swarm_sg" {
  name        = "swarm-sg"
  description = "Allow SSH, HTTP, API"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
   ingress{
    from_port = 3000
    to_port = 3000
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
   ingress{
    from_port = 8000
    to_port = 8000
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

}

resource "aws_instance" "swarm_mgr" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  key_name               = aws_key_pair.deploy.key_name
  vpc_security_group_ids = [aws_security_group.swarm_sg.id]
  tags = { Name = "swarm-manager" }
}

output "manager_ip" {
  value = aws_instance.swarm_mgr.public_ip
}