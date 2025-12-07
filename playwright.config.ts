import { PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  timeout: 60_000,
  expect: { timeout: 5000 },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  projects: [
    { name: 'chromium', use: { browserName: 'chromium', headless: true } }
    // add firefox/webkit if desired
  ],
  use: {
    baseURL: process.env.HUNTD_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  testDir: 'src/tests'
};

export default config;
