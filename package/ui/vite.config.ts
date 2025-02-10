import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  base: "./", // Ensure proper asset loading in production
  plugins: [
    react(),
    nodePolyfills({
      include: ["crypto", "stream", "assert", "util"],
    }),
  ],
  resolve: {
    alias: {
      stream: "stream-browserify",
      assert: "assert",
      util: "util",
    },
  },
  optimizeDeps: {
    include: ["@metamask/obs-store"],
  },
});
