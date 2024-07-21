# Kogen Chore

The `@kogen/kogen-chore` package is responsible for various maintenance tasks, such as code generation and linting, within the Kogen project.

## Features

- TypeScript code generation using `@cosmwasm/ts-codegen`
- Automated linting and formatting with ESLint and Prettier
- Jest for testing

## Prerequisites

- Node.js (version compatible with the project)
- npm (version compatible with the project)

## Installation

1. Navigate to the chore package directory:
   ```
   cd package/chore
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Scripts

### Test

The `test` script currently outputs a placeholder message and exits successfully:
```json:package/chore/package.json
startLine: 6
endLine: 6
```

### Code Generation

The `codegen` script runs TypeScript code generation and then fixes any linting issues in the generated code:
```json:package/chore/package.json
startLine: 7
endLine: 7
```

To run the code generation script:
```
npm run codegen
```

## Dependencies

### DevDependencies

- `@cosmwasm/ts-codegen`: TypeScript code generation for CosmWasm contracts
- `@types/jest`: TypeScript definitions for Jest
- `@typescript-eslint/eslint-plugin`: ESLint plugin for TypeScript
- `@typescript-eslint/parser`: TypeScript parser for ESLint
- `eslint`: Pluggable JavaScript linter
- `eslint-config-prettier`: Config for disabling ESLint rules that conflict with Prettier
- `eslint-plugin-import`: ESLint plugin for import/export syntax
- `eslint-plugin-jest`: ESLint plugin for Jest
- `eslint-plugin-prettier`: Runs Prettier as an ESLint rule
- `eslint-plugin-sonarjs`: ESLint plugin for SonarJS rules
- `jest`: JavaScript testing framework
- `nodemon`: Tool for automatically restarting the node application when file changes are detected
- `prettier`: Code formatter
- `supertest`: HTTP assertions for testing

### Dependencies

- `dotenv-cli`: CLI for loading environment variables from a `.env` file

For a full list of dependencies, please refer to the `package.json` file:
```json:package/chore/package.json
startLine: 11
endLine: 29
```
