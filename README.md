# Kogen

Kogen is a project that utilizes npm workspaces to manage multiple packages within a single repository.

## Table of Contents

- [Project Structure](#project-structure)
- [Workspaces](#workspaces)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Development](#development)
- [Testing Production Build](#testing-production-build)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Project Structure

The project is organized using npm workspaces, with the following structure:

```
kogen/
├── package.json
├── package/
│   └── ui/
│       ├── .env.example
│       ├── package.json
│       └── ...
└── ...
```

## Workspaces

This project uses npm workspaces, which is a feature that allows you to manage multiple packages within a single repository. Workspaces offer several benefits:

1. **Simplified dependency management**: Shared dependencies are hoisted to the root, reducing duplication and saving disk space.
2. **Cross-package development**: You can easily work on and test multiple packages simultaneously.
3. **Consistent versioning**: Ensures all packages use the same version of shared dependencies.

In this project, we have a workspace called `@kogen/kogen-ui` located in the `package/ui` directory.

## Getting Started

### Prerequisites

- Node.js (version 12.22.9 or higher)
- npm (version 8.19.3 or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/kogen-markets/app.git
   cd app
   ```

2. Set up the environment for the UI package:
   ```
   cp package/ui/.env.example package/ui/.env
   ```

3. Install dependencies:
   ```
   npm i
   ```

## Development

To start the development server for the UI package:

```
npm -w @kogen/kogen-ui run dev
```

This command uses the `-w` flag to specify the workspace package you want to run the script in.

## Testing Production Build

To build and serve the production version of the UI package:

1. Build the production version:
   ```
   npm run -w @kogen/kogen-ui build:prod
   ```

2. Serve the built files:
   ```
   npx serve package/ui/dist
   ```

## Troubleshooting

### `TypeError: Cannot read properties of undefined (reading 'isBuffer')` when submitting an order

This is caused by missing Node.js polyfills (`Buffer`, `crypto`, `stream`) in
the browser bundle, which the Injective SDK depends on. The fix — configuring
`vite-plugin-node-polyfills` instead of patching `keccak256` with
`patch-package` — is documented in detail in the
[UI package README](package/ui/README.md#node-polyfills-fix-for-issue-96).
See issue [#96](https://github.com/kogen-markets/app/issues/96) and
PR [#98](https://github.com/kogen-markets/app/pull/98).

If dependency-related errors persist after upgrading packages, clear Vite's
dependency cache with `npm run vite` (removes `package/ui/node_modules/.vite/deps`).
