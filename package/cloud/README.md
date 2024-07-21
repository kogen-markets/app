# Cloud Package

The `cloud` package is responsible for building and deploying AWS Lambda functions using Pulumi and esbuild.

## Features

- Uses Pulumi for infrastructure as code
- Uses esbuild for bundling and minifying Lambda function code
- Supports external dependencies for AWS SDK modules

## Prerequisites

- Node.js (version compatible with the project)
- npm (version compatible with the project)
- Pulumi CLI
- AWS CLI (configured with appropriate credentials)

## Installation

1. Navigate to the cloud package directory:
   ```
   cd package/cloud
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Usage

### Building Lambda Function Code

The `build` function uses esbuild to bundle and minify the Lambda function code. It takes the following parameters:
- `entrypoint`: The entry point file for the Lambda function
- `minify`: A boolean indicating whether to minify the code

Example usage:
```typescript:package/cloud/lambda-builder.ts
startLine: 3
endLine: 23
```

### Creating a Pulumi Asset Archive

The `buildCodeAsset` function creates a Pulumi `AssetArchive` containing the bundled Lambda function code. It takes the following parameters:
- `entrypoint`: The entry point file for the Lambda function
- `minify`: A boolean indicating whether to minify the code (default is `false`)
- `optionalAssets`: An object containing additional assets to include in the archive

Example usage:
```typescript:package/cloud/lambda-builder.ts
startLine: 25
endLine: 34
```

## Deployment

To deploy the Lambda function using Pulumi:

1. Ensure you have configured your AWS credentials.
2. Run the Pulumi stack:
   ```
   pulumi up
   ```

## Dependencies

Key dependencies include:

- Pulumi for infrastructure as code
- esbuild for bundling and minifying code

For a full list of dependencies, please refer to the `package.json` file.
