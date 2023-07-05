"use strict";
import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { buildCodeAsset } from "./lambda-builder";

const exerciseConfig = new pulumi.Config("exercise");
const lambdaPackageName = "kogen--package-lambda";

const lambdaRole = new aws.iam.Role(lambdaPackageName, {
  assumeRolePolicy: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "sts:AssumeRole",
        Principal: {
          Service: "lambda.amazonaws.com",
        },
        Effect: "Allow",
        Sid: "",
      },
    ],
  },
});

new aws.iam.RolePolicyAttachment(lambdaPackageName + "-lambdaExecute", {
  role: lambdaRole,
  policyArn: aws.iam.ManagedPolicies.AWSLambdaExecute,
});

const cronRule = new aws.cloudwatch.EventRule(
  lambdaPackageName + "exercise-bot-cron",
  {
    scheduleExpression: "cron(0 * * * ? *)",
  }
);

export const exerciseBotInjective = new aws.lambda.Function(
  lambdaPackageName + "-exercise-bot-injective",
  {
    code: buildCodeAsset(
      require.resolve("@kogen/kogen-exercise-bot/exercise.js"),
      true
    ),
    handler: "index.handler",
    runtime: "nodejs18.x",
    role: lambdaRole.arn,
    timeout: 55,
    memorySize: 512,
    environment: {
      variables: {
        MNEMONIC: exerciseConfig.get("mnemonic")!,
        OPTION_CONTRACT_ADDR: "inj1xugskgygskm8neu9swxjmegz8339j9p0jlxlk7",
        CHAIN_ID: "injective-888",
        PYTH_PRICE_FEED_URL: "https://xc-testnet.pyth.network/api/latest_vaas",
      },
    },
  }
);

export const exerciseBotNeutron = new aws.lambda.Function(
  lambdaPackageName + "-exercise-bot-neutron",
  {
    code: buildCodeAsset(
      require.resolve("@kogen/kogen-exercise-bot/exercise.js"),
      true
    ),
    handler: "index.handler",
    runtime: "nodejs18.x",
    role: lambdaRole.arn,
    timeout: 55,
    memorySize: 512,
    environment: {
      variables: {
        MNEMONIC: exerciseConfig.get("mnemonic")!,
        OPTION_CONTRACT_ADDR:
          "neutron1w7jvt6nt0d79nwpzt32w32qss0cnlt20naevljmx70nhathe5sfqh23tmq",
        CHAIN_ID: "pion-1",
        PYTH_PRICE_FEED_URL: "https://xc-testnet.pyth.network/api/latest_vaas",
      },
    },
  }
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cronTargetInjective = new aws.cloudwatch.EventTarget(
  lambdaPackageName + "exercise-bot-event-target-injective",
  {
    arn: exerciseBotInjective.arn,
    rule: cronRule.name,
  }
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cronPermissionInjective = new aws.lambda.Permission(
  lambdaPackageName + "exercise-bot-permission-injective",
  {
    action: "lambda:InvokeFunction",
    function: exerciseBotInjective.name,
    principal: "events.amazonaws.com",
    sourceArn: cronRule.arn,
  }
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cronTargetNeutron = new aws.cloudwatch.EventTarget(
  lambdaPackageName + "exercise-bot-event-target-neutron",
  {
    arn: exerciseBotNeutron.arn,
    rule: cronRule.name,
  }
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cronPermissionNeutron = new aws.lambda.Permission(
  lambdaPackageName + "exercise-bot-permission-neutron",
  {
    action: "lambda:InvokeFunction",
    function: exerciseBotNeutron.name,
    principal: "events.amazonaws.com",
    sourceArn: cronRule.arn,
  }
);
