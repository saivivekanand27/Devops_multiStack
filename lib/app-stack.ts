import * as cdk from 'aws-cdk-lib';
import { 
  aws_ecr as ecr, 
  aws_ec2 as ec2, 
  aws_elasticloadbalancingv2 as elbv2,
  aws_route53 as route53
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

interface AppStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
}

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);

    // ✅ ECR Repository
    const repo = new ecr.Repository(this, 'MyECRRepo');

    // ✅ Application Load Balancer
    const alb = new elbv2.ApplicationLoadBalancer(this, 'MyALB', {
      vpc: props.vpc,
      internetFacing: true,
    });

    const listener = alb.addListener('Listener', {
      port: 80,
    });

    // ✅ Fixed response (your working output)
    listener.addAction('DefaultAction', {
      action: elbv2.ListenerAction.fixedResponse(200, {
        contentType: 'text/plain',
        messageBody: 'Hello from ALB',
      }),
    });

    // ✅ Route53 Hosted Zone (Simulation)
    const zone = new route53.PublicHostedZone(this, 'MyZone', {
      zoneName: 'myproject123.com', // dummy domain
    });

    // ✅ Output ALB DNS (VERY IMPORTANT FOR DEMO)
    new cdk.CfnOutput(this, 'ALBDNS', {
      value: alb.loadBalancerDnsName,
    });
  }
}