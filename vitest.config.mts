import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

/**
 * Unit-test configuration for pure modules only. Async Server Components are
 * not supported by Vitest; those are covered by the manual browser smoke tests.
 */
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
