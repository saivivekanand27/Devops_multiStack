import * as cdk from "aws-cdk-lib";
import { aws_ec2 as ec2 } from "aws-cdk-lib";
import { Construct } from "constructs";

interface ComputeStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
}

export class ComputeStack extends cdk.Stack {
  public readonly instance: ec2.Instance;

  constructor(scope: Construct, id: string, props: ComputeStackProps) {
    super(scope, id, props);

    const sg = new ec2.SecurityGroup(this, "InstanceSG", {
      vpc: props.vpc,
      allowAllOutbound: true,
    });

    // Allow HTTP
    sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80));

    this.instance = new ec2.Instance(this, "MyEC2Instance", {
      vpc: props.vpc,

      // ✅ PUBLIC SUBNET
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },

      // ✅ PUBLIC IP
      associatePublicIpAddress: true,

      securityGroup: sg,

      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO
      ),

      machineImage: ec2.MachineImage.latestAmazonLinux2(),
    });

    // ✅ Apache setup
    this.instance.addUserData(
      "#!/bin/bash",
      "yum update -y",
      "yum install -y httpd",
      "systemctl start httpd",
      "systemctl enable httpd",
      "echo '<h1>Hello from EC2 via ALB RAVITEJA 🚀</h1>' > /var/www/html/index.html",
      "systemctl restart httpd"
    );
  }
}