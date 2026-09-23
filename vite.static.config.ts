import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  // Relative URLs work for both username.github.io and /repository/ Pages URLs.
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist-static",
    emptyOutDir: true,
  },
});
