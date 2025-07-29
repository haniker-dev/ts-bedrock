import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./spec/TestSetup.ts"],
    include: ["./spec/**/*.spec.ts"],
  },
})
