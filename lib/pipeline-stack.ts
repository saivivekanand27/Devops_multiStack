import * as cdk from 'aws-cdk-lib';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';

export class PipelineStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new CodePipeline(this, 'Pipeline', {
      pipelineName: 'MyPipeline',

      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('saivivekanand27/Devops_multiStack', 'main'),

        commands: [
          'npm install',
          'npm run build',
          'npx cdk synth'
        ],
      }),
    });
  }
}