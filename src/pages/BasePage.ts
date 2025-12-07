// src/pages/BasePage.ts
import { Page } from '@playwright/test';

export class BasePage {
  protected baseUrl: string;

  constructor(protected page: Page) {
    // Fail fast if HUNTD_BASE_URL is not set
    if (!process.env.HUNTD_BASE_URL) {
      throw new Error(
        'HUNTD_BASE_URL environment variable is not set. Please set it before running tests.'
      );
    }
    this.baseUrl = process.env.HUNTD_BASE_URL;
  }

  /**
   * Navigate to a given path relative to baseUrl
   * @param target Path or full URL
   */
  async goto(target: string) {
    const normalizedPath = target.startsWith('/') ? target : `/${target}`;
    const url = `${this.baseUrl}${normalizedPath}`;
    await this.page.goto(url, { waitUntil: 'load' });
  }

  /**
   * Optionally, a helper for navigating with retries
   */
  async gotoWithRetry(target: string, retries = 2) {
    for (let i = 0; i <= retries; i++) {
      try {
        await this.goto(target);
        return;
      } catch (error) {
        if (i === retries) throw error;
        console.warn(`Navigation failed, retrying (${i + 1}/${retries})...`);
      }
    }
  }
}
