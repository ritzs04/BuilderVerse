import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 90_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3111",
    trace: "retain-on-failure",
    ...devices["Desktop Chrome"],
  },
  webServer: {
    // Build once, then serve the production build with `next start`
    // (the same `next start` the Docker image runs).
    command: "npm run build && node scripts/e2e-server.mjs",
    url: "http://localhost:3111",
    env: { PORT: "3111", HOSTNAME: "0.0.0.0" },
    reuseExistingServer: false,
    timeout: 300_000,
  },
});