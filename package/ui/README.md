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

## Node Polyfills

This project uses `vite-plugin-node-polyfills` to provide Node.js polyfills for the browser environment. This is particularly useful when working with libraries that depend on Node.js built-in modules.

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