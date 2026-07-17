import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright-report', open: 'never' }],
    ['junit', { outputFile: 'reports/junit-results.xml' }]
  ],
  use: {
    baseURL:
      process.env.API_BASE_URL ??
      process.env.BASE_URL ??
      'http://127.0.0.1:3000',
    extraHTTPHeaders: {
      'Content-Type': 'application/json'
    }
  }
});