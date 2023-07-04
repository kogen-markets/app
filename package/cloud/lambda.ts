"use strict";
import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
// import { url as webappUrl } from "./webapp";
// import { url as backendUrl } from "./backend";
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

// const dynamoLambdaPolicy = new aws.iam.Policy(lambdaPackageName + "-dynamo", {
//   policy: lastProcessedBlockTable.arn.apply((arn) =>
//     JSON.stringify({
//       Version: "2012-10-17",
//       Statement: [
//         {
//           Effect: "Allow",
//           Action: [
//             "dynamodb:List*",
//             "dynamodb:DescribeReservedCapacity*",
//             "dynamodb:DescribeLimits",
//             "dynamodb:DescribeTimeToLive",
//           ],
//           Resource: "*",
//         },
//         {
//           Effect: "Allow",
//           Action: [
//             "dynamodb:BatchGet*",
//             "dynamodb:DescribeStream",
//             "dynamodb:DescribeTable",
//             "dynamodb:Get*",
//             "dynamodb:Query",
//             "dynamodb:Scan",
//             "dynamodb:BatchWrite*",
//             "dynamodb:CreateTable",
//             "dynamodb:Delete*",
//             "dynamodb:Update*",
//             "dynamodb:PutItem",
//           ],
//           Resource: arn,
//         },
//       ],
//     })
//   ),
// });

new aws.iam.RolePolicyAttachment(lambdaPackageName + "-lambdaExecute", {
  role: lambdaRole,
  policyArn: aws.iam.ManagedPolicies.AWSLambdaExecute,
});

// new aws.iam.RolePolicyAttachment(lambdaPackageName + "-dynamoPolicy", {
//   role: lambdaRole,
//   policyArn: dynamoLambdaPolicy.arn,
// });

// export const apiBackend = new aws.lambda.Function(
//   lambdaPackageName + "-apiBackend",
//   {
//     code: buildCodeAsset(
//       require.resolve("@howlpack/howlpack-backend/serverless.js"),
//       true
//     ),
//     handler: "index.handler",
//     runtime: "nodejs18.x",
//     role: lambdaRole.arn,
//     timeout: 30,
//     memorySize: 512,
//     environment: {
//       variables: {
//         ...environment,
//         FRONTEND_URL: webappUrl,
//         BACKEND_URL: backendUrl,
//         ENCRYPTION_SECRET_KEY: howlpackConfig.getSecret(
//           "ENCRYPTION_SECRET_KEY"
//         ),
//         WINSTON_WOLFE_KEY: howlpackConfig.getSecret("WINSTON_WOLFE_KEY"),
//         HOWL_POSTS_ADDR: junoConfig.get("howl_posts"),
//         HOWL_STAKING: junoConfig.get("howl_staking"),
//         HOWL_TOKEN: junoConfig.get("howl_token"),
//         HOWL_MNEMONIC: howlpackConfig.getSecret("HOWL_MNEMONIC"),
//         ROLLBAR_ACCESS_TOKEN: howlpackConfig.getSecret("ROLLBAR_ACCESS_TOKEN"),
//         RPC_ENDPOINTS: (JSON.parse(junoConfig.require("rpcs")) || []).join(","),
//       },
//     },
//   }
// );

const cronRule = new aws.cloudwatch.EventRule(
  lambdaPackageName + "exercise-bot-cron",
  {
    scheduleExpression: "rate(1 hour)",
  }
);

export const watcher = new aws.lambda.Function(
  lambdaPackageName + "-exercise-bot",
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
        OPTION_CONTRACT_ADDR: exerciseConfig.get("option_contract_addr")!,
        CHAIN_ID: exerciseConfig.get("chain_id")!,
        PYTH_PRICE_FEED_URL: exerciseConfig.get("pyth_price_feed_url")!,
      },
    },
  }
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cronTarget = new aws.cloudwatch.EventTarget(
  lambdaPackageName + "exercise-bot-event-target",
  {
    arn: watcher.arn,
    rule: cronRule.name,
  }
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cronPermission = new aws.lambda.Permission(
  lambdaPackageName + "exercise-bot-permission",
  {
    action: "lambda:InvokeFunction",
    function: watcher.name,
    principal: "events.amazonaws.com",
    sourceArn: cronRule.arn,
  }
);
