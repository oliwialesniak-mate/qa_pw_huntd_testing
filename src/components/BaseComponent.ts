import { Locator, Page } from '@playwright/test';

export abstract class BaseComponent {
  protected page: Page;
  protected root: Locator;

  constructor(page: Page, rootLocator: string) {
    this.page = page;
    this.root = page.locator(rootLocator);
  }

  async isVisible() {
    return this.root.isVisible();
  }
}
