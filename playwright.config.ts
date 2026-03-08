import { defineConfig, devices } from "@playwright/test";

const E2E_PORT = 4173;
const E2E_HOST = "127.0.0.1";
const E2E_BASE_URL = `http://${E2E_HOST}:${E2E_PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 120_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: E2E_BASE_URL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "init",
      testMatch: /init\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "search-book",
      testMatch: /search-book\.spec\.ts/,
      dependencies: ["init"],
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "favorite-book",
      testMatch: /favorite-book\.spec\.ts/,
      dependencies: ["search-book"],
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
  webServer: {
    command: `npm run dev -- --host ${E2E_HOST} --port ${E2E_PORT}`,
    url: E2E_BASE_URL,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
    env: {
      ...process.env,
      VITE_KAKAO_REST_API_KEY: "playwright-e2e-test-key",
    },
  },
});
