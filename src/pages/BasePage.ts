import { Page } from '@playwright/test';

export abstract class BasePage {
  protected page: Page;
  readonly baseUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = process.env.HUNTD_BASE_URL || this.page.context().baseUrl() || '';
  }

  async goto(path = '') {
    const url = this.baseUrl + path;
    await this.page.goto(url);
  }

  async title() {
    return this.page.title();
  }
}
