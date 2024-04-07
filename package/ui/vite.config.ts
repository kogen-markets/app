import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import path from 'path';


// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      'react-dom': path.resolve(__dirname, '../../node_modules/react-dom'),
    },
  },

  // build: {
  //   sourcemap: true, // Make sure source maps are enabled
  // },
  optimizeDeps: {
    exclude: [
      // '@cosmjs/cosmwasm-stargate',
      // '@cosmos-kit/core',
      // 'cosmos-kit/react-lite',
      // '@cosmos-kit/leap-extension',
      // '@cosmos-kit/keplr-extension'
    ] // Exclude specific dependencies from pre-bundling
    ,
    include: ['@cosmjs/cosmwasm-stargate']
  },

  plugins: [react(), nodePolyfills({
    // To add only specific polyfills, add them here. If no option is passed, adds all polyfills
    include: [
      //'path'
    ],
    // To exclude specific polyfills, add them to this list. Note: if include is provided, this has no effect
    exclude: [
      //'http', // Excludes the polyfill for `http` and `node:http`.
    ],
    // Whether to polyfill specific globals.
    globals: {
      Buffer: true, // can also be 'build', 'dev', or false
      global: true,
      process: true,
    },
    // Override the default polyfills for specific modules.
    overrides: {
      // Since `fs` is not supported in browsers, we can use the `memfs` package to polyfill it.
      // fs: 'memfs',
    },
    // Whether to polyfill `node:` protocol imports.
    protocolImports: true,
  })],
});
