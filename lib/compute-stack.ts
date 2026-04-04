import * as cdk from "aws-cdk-lib";
import { aws_ec2 as ec2 } from "aws-cdk-lib";
import { Construct } from "constructs";

interface ComputeStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
}

export class ComputeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ComputeStackProps) {
    super(scope, id, props);

    // ✅ Create EC2 Instance (Simulating Kubernetes Node)
    const instance = new ec2.Instance(this, "MyEC2Instance", {
      vpc: props.vpc,

      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO
      ),

      machineImage: ec2.MachineImage.latestAmazonLinux2(),

      // 🔥 USER DATA (Runs when EC2 starts)
      userData: ec2.UserData.custom(`
        #!/bin/bash
        yum update -y

        # Install Docker
        yum install -y docker
        service docker start
        usermod -a -G docker ec2-user

        # Simulate Kubernetes Node Setup
        echo "Kubernetes Worker Node Ready" > /home/ec2-user/k8s-node.txt
      `),
    });
    
  }
}