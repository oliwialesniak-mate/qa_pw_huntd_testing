import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 30000,
  retries: 1,
  reporter: [
    ['list'],
    ['allure-playwright', { outputFolder: 'allure-results' }], // required for Allure
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  use: {
    headless: true,
    baseURL: process.env.HUNTD_BASE_URL,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ],
  outputDir: 'test-results/',
});
