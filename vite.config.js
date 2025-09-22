import { defineConfig } from "vite";

export default defineConfig({
  base: "/ice_path/",
  build: {
    chunkSizeWarningLimit: 1000, // Increase limit for Phaser games
    rollupOptions: {
      output: {
        manualChunks: {
          // Split Phaser into its own chunk
          phaser: ['phaser'],
          // Keep game logic in main chunk (it's small)
        }
      }
    },
    // Optimize for production
    minify: 'esbuild'
  }
});
