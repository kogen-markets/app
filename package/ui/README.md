# Kogen UI

This package contains the user interface for the Kogen project, built with React and Vite.

## Features

- React-based UI
- Vite for fast development and building
- Cosmos Kit integration for wallet connections
- Material-UI for styling
- React Router for navigation
- Recoil for state management
- TypeScript support

## Prerequisites

- Node.js (version compatible with the project)
- npm (version compatible with the project)

## Installation

1. Navigate to the UI package directory:
   ```
   cd package/ui
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Development

To start the development server:

```
npm run dev
```

This will start a Vite development server with hot module replacement.

## Building

For development build:

```
npm run build:dev
```

For production build:

```
npm run build:prod
```

Both commands will create a build in the `dist` directory.

## Preview

To preview the production build:

```
npm run preview
```

## Testing

Currently, there are no tests implemented. The test script exits successfully:

```
npm test
```

## Node Polyfills (fix for issue #96)

The Injective SDK (`@injectivelabs/*`) and its transitive dependencies (notably
`keccak256`) rely on Node.js built-ins such as `Buffer`, `crypto`, and
`stream`, which do not exist in the browser and are not polyfilled by Vite by
default. Without polyfills, submitting a bid or ask order crashes at runtime
with:

```
TypeError: Cannot read properties of undefined (reading 'isBuffer')
    at toBuffer (...)
    at keccak256 (...)
    at createTransactionWithSigners (...)
```

(Reported as [#96](https://github.com/kogen-markets/app/issues/96).)

The original workaround was a `patch-package` patch that hand-edited
`node_modules/keccak256` to import `Buffer` and set it on `globalThis`. That
approach was fragile — it broke whenever the dependency tree shifted — and was
removed in [#98](https://github.com/kogen-markets/app/pull/98) in favor of
configuring the bundler properly in [`vite.config.ts`](./vite.config.ts):

- `vite-plugin-node-polyfills` is configured with
  `include: ['crypto', 'stream', 'assert', 'util']`. The plugin also injects
  the `Buffer` and `process` globals, which is what the crash was actually
  about.
- `resolve.alias` maps `stream` to `stream-browserify` (with `assert` and
  `util` aliased to their npm polyfill packages) so bare imports of Node
  built-ins resolve to browser-compatible implementations.
- `optimizeDeps.include` lists `@metamask/obs-store` so Vite pre-bundles this
  CommonJS dependency during dev.

If you see `Buffer`/`isBuffer`/`crypto`-related errors after upgrading wallet
or Injective SDK dependencies, check that the polyfill configuration in
`vite.config.ts` still covers the modules those packages expect. Clearing
Vite's dependency cache can also help: `npm run vite` from the repository root
(removes `package/ui/node_modules/.vite/deps`).

## Dependencies

Key dependencies include:

- React 18
- Cosmos Kit for wallet integration
- Material-UI for UI components
- React Router for navigation
- Recoil for state management
- Vite for build tooling

For a full list of dependencies, please refer to the `package.json` file.

## Development Dependencies

The project uses TypeScript, ESLint, and Prettier for code quality and formatting. Vite is used as the build tool.