import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig(() => {
  return {
    plugins: [react()],
    publicDir: "./public",
    server: {
      port: 3000,
    },
    build: {
      outDir: "dist",
    },
  }
})
