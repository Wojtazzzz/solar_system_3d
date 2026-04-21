import { defineConfig } from "vite";

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (
            id.includes("node_modules/three") &&
            !id.includes("examples/jsm")
          ) {
            return "three";
          }
        },
      },
    },
  },
});
