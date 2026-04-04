import * as cdk from 'aws-cdk-lib';
import { aws_ec2 as ec2 } from 'aws-cdk-lib';

export class NetworkStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;

  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    this.vpc = new ec2.Vpc(this, 'MyVPC', {
      maxAzs: 2,
    });
  }
}