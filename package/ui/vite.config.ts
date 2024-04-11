import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "react-dom": path.resolve(__dirname, "../../node_modules/react-dom"),
    },
  },
  plugins: [react(), nodePolyfills()],
});
