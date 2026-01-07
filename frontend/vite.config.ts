import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { tanstackRouter } from "@tanstack/router-vite-plugin"
import path from "path"

export default defineConfig({
  plugins: [
    tanstackRouter(),   // REQUIRED
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
})
