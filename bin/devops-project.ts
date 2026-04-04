#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { NetworkStack } from '../lib/network-stack';
import { ComputeStack } from '../lib/compute-stack';
import { AppStack } from '../lib/app-stack';
import { PipelineStack } from '../lib/pipeline-stack';



const app = new cdk.App();

new PipelineStack(app, 'PipelineStack');

// ✅ 1. Create Network Stack FIRST
const network = new NetworkStack(app, 'NetworkStack');

// ✅ 2. Compute Stack (uses VPC)
new ComputeStack(app, 'ComputeStack', {
  vpc: network.vpc,
});

// ✅ 3. App Stack (also uses VPC)
new AppStack(app, 'AppStack', {
  vpc: network.vpc,
});