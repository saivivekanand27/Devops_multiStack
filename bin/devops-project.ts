#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { NetworkStack } from '../lib/network-stack';
import { ComputeStack } from '../lib/compute-stack';
import { AppStack } from '../lib/app-stack';

const app = new cdk.App();

// ✅ Network
const network = new NetworkStack(app, 'NetworkStack');

// ✅ Compute
const compute = new ComputeStack(app, 'ComputeStack', {
  vpc: network.vpc,
});

// ✅ App
new AppStack(app, 'AppStack', {
  vpc: network.vpc,
  instance: compute.instance,
});