"use strict";
import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { buildCodeAsset } from "./lambda-builder";

const exerciseConfig = new pulumi.Config("exercise");
const kogenConfig = new pulumi.Config("kogen");
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

const provider = new aws.Provider("us-east-provider", {
  region: "us-east-1",
});

const cronRule = new aws.cloudwatch.EventRule(
  lambdaPackageName + "exercise-bot-cron",
  {
    scheduleExpression: "cron(0/30 * * * ? *)",
  }, { provider: provider }
);

const MNEMONIC = exerciseConfig.get("mnemonic");

if (!MNEMONIC) {
  throw new Error("undefined config exercise:mnemonic");
}

const OPTION_CONTRACT_ADDR_INJECTIVE = kogenConfig.get(
  "VITE_CONTRACT_INJECTIVE_TESTNET",
);

if (!OPTION_CONTRACT_ADDR_INJECTIVE) {
  throw new Error("undefined config kogen:VITE_CONTRACT_INJECTIVE_TESTNET");
}


const FACTORY_CONTRACT_ADDR_INJECTIVE_JSON = "https://raw.githubusercontent.com/kogen-markets/app/main/contract_addresses.json";

export const exerciseBotInjective = new aws.lambda.Function(
  lambdaPackageName + "-exercise-bot-injective",
  {
    code: buildCodeAsset(
      require.resolve("@kogen/kogen-exercise-bot/exercise.js"),
      true,
    ),
    handler: "index.handler",
    runtime: "nodejs18.x",
    role: lambdaRole.arn,
    timeout: 55,
    memorySize: 512,
    environment: {
      variables: {
        MNEMONIC: MNEMONIC,
        OPTION_CONTRACT_ADDR: OPTION_CONTRACT_ADDR_INJECTIVE,
        FACTORY_CONTRACT_ADDR_JSON: FACTORY_CONTRACT_ADDR_INJECTIVE_JSON,
        CHAIN_ID: "injective-888",
        PYTH_PRICE_FEED_URL: "https://xc-testnet.pyth.network/api/latest_vaas",
      },
    },
  },
);


// const FACTORY_CONTRACT_ADDR_NEUTRON = contractAddresses.apply(addresses => addresses.FACTORY_NEUTRON_TESTNET.toLowerCase());

// if (!FACTORY_CONTRACT_ADDR_NEUTRON) {
//   throw new Error("undefined neutron factory contract address (https://raw.githubusercontent.com/kogen-markets/app/main/contract_addresses.json)");
// }


// export const exerciseBotNeutron = new aws.lambda.Function(
//   lambdaPackageName + "-exercise-bot-neutron",
//   {
//     code: buildCodeAsset(
//       require.resolve("@kogen/kogen-exercise-bot/exercise.js"),
//       true,
//     ),
//     handler: "index.handler",
//     runtime: "nodejs18.x",
//     role: lambdaRole.arn,
//     timeout: 55,
//     memorySize: 512,
//     environment: {
//       variables: {
//         MNEMONIC: MNEMONIC,
//         FACTORY_CONTRACT_ADDR: FACTORY_CONTRACT_ADDR_NEUTRON,
//         CHAIN_ID: "pion-1",
//         PYTH_PRICE_FEED_URL: "https://xc-testnet.pyth.network/api/latest_vaas",
//       },
//     },
//   },
// );

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cronTargetInjective = new aws.cloudwatch.EventTarget(
  lambdaPackageName + "exercise-bot-event-target-injective",
  {
    arn: exerciseBotInjective.arn,
    rule: cronRule.name,
  },
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cronPermissionInjective = new aws.lambda.Permission(
  lambdaPackageName + "exercise-bot-permission-injective",
  {
    action: "lambda:InvokeFunction",
    function: exerciseBotInjective.name,
    principal: "events.amazonaws.com",
    sourceArn: cronRule.arn,
  },
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const cronTargetNeutron = new aws.cloudwatch.EventTarget(
//   lambdaPackageName + "exercise-bot-event-target-neutron",
//   {
//     arn: exerciseBotNeutron.arn,
//     rule: cronRule.name,
//   },
// );

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const cronPermissionNeutron = new aws.lambda.Permission(
//   lambdaPackageName + "exercise-bot-permission-neutron",
//   {
//     action: "lambda:InvokeFunction",
//     function: exerciseBotNeutron.name,
//     principal: "events.amazonaws.com",
//     sourceArn: cronRule.arn,
//   },
// );
