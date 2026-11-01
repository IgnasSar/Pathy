import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
    clearMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
    coverage: {
      provider: "istanbul",
      reportOnFailure: true,
      include: [
        "packages/api/src/app.ts",
        "packages/api/src/db/*Repository.ts",
        "packages/api/src/lib/*.ts",
        "packages/web/src/utils/geo.ts",
      ],
      reporter: ["text", "html", "lcov"],
    },
  },
});
