import * as cdk from 'aws-cdk-lib';
import { 
  aws_ecr as ecr, 
  aws_ec2 as ec2, 
  aws_elasticloadbalancingv2 as elbv2 
} from 'aws-cdk-lib';
import { InstanceIdTarget } from 'aws-cdk-lib/aws-elasticloadbalancingv2-targets';
import { Construct } from 'constructs';

interface AppStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
  instance: ec2.Instance;
}

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);

    // ✅ ECR
    new ecr.Repository(this, 'MyECRRepo');

    // ✅ ALB
    const alb = new elbv2.ApplicationLoadBalancer(this, 'MyALB', {
      vpc: props.vpc,
      internetFacing: true,
    });

    // 🔥 CONNECT ALB → EC2
    alb.connections.allowTo(props.instance, ec2.Port.tcp(80));

    const listener = alb.addListener('Listener', {
      port: 80,
      open: true,
    });

    listener.addTargets('Targets', {
      port: 80,
      targets: [new InstanceIdTarget(props.instance.instanceId)],
      healthCheck: {
        path: '/',
        port: '80',
        healthyHttpCodes: '200',
      },
    });

    new cdk.CfnOutput(this, 'ALBDNS', {
      value: alb.loadBalancerDnsName,
    });
  }
}