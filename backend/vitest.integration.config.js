import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: false,
    clearMocks: true,
    restoreMocks: true,
    include: ["tests/integration/**/*.test.js"],
    setupFiles: ["./tests/integration/setup-env.js"],
    fileParallelism: false,
    testTimeout: 15000,
  },
});