# Kogen Shared

The `@kogen/kogen-shared` package contains shared utilities and dependencies used across the Kogen project.

## Features

- Common utilities for interacting with Cosmos SDK-based blockchains
- Shared dependencies for cryptographic operations and protocol signing
- Functional programming utilities with Ramda

## Prerequisites

- Node.js (version compatible with the project)
- npm (version compatible with the project)

## Installation

1. Navigate to the shared package directory:
   ```
   cd package/shared
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Usage

This package is intended to be used as a dependency in other parts of the Kogen project. You can import and use the utilities provided by this package in your code.

Example:
```typescript
import { someUtility } from '@kogen/kogen-shared';

// Use the utility function
someUtility();
```

## Scripts

### Test

The `test` script runs the test suite using Jest with the specified environment variables:
```json:package/shared/package.json
startLine: 5
endLine: 6
```

To run the tests:
```
npm test
```

## Dependencies

The package includes the following dependencies:
```json:package/shared/package.json
startLine: 9
endLine: 15
```

- `@cosmjs/cosmwasm-stargate`: Utilities for interacting with CosmWasm smart contracts on Stargate-based chains
- `@cosmjs/crypto`: Cryptographic utilities for Cosmos SDK-based blockchains
- `@cosmjs/proto-signing`: Protocol signing utilities for Cosmos SDK-based blockchains
- `@cosmjs/stargate`: Utilities for interacting with Stargate-based chains
- `chain-registry`: Chain registry for Cosmos SDK-based blockchains
- `ramda`: Functional programming utilities
