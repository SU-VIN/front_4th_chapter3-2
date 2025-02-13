import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/__tests__/e2e',
  timeout: 30000,
  expect: { timeout: 5000 },
  use: {
    baseURL: 'http://localhost:5173',
    browserName: 'chromium',
    headless: false,
    actionTimeout: 5000,
    video: 'on-first-retry',
    trace: 'on',
  },
  projects: [
    {
      name: 'Chromium',
      use: { browserName: 'chromium' },
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
});
