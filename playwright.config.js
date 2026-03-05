// @ts-check
const { defineConfig, devices } = require('@playwright/test');

const FRONTEND_PORT = parseInt(process.env.FRONTEND_PORT) || 3000;
const BACKEND_PORT = parseInt(process.env.BACKEND_PORT) || 3030;

module.exports = defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL || `http://localhost:${FRONTEND_PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: `npm run start:backend`,
      port: BACKEND_PORT,
      reuseExistingServer: !process.env.CI,
      env: { PORT: String(BACKEND_PORT) },
    },
    {
      command: `npm run start:frontend`,
      port: FRONTEND_PORT,
      reuseExistingServer: !process.env.CI,
      env: { PORT: String(FRONTEND_PORT), BROWSER: 'none' },
    },
  ],
});
