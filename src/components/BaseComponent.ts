import { Locator, Page } from '@playwright/test';

/**
 * BaseComponent
 * Abstract class for UI components.
 * Provides a root locator and common helper methods.
 */
export abstract class BaseComponent {
  protected page: Page;
  protected root: Locator;

  /**
   * @param page - Playwright Page object
   * @param rootSelector - CSS selector for the component's root element
   */
  constructor(page: Page, rootSelector: string) {
    this.page = page;
    this.root = page.locator(rootSelector);
  }

  /** Returns true if the component is visible */
  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }

  /** Wait until the component is visible, with optional timeout */
  async waitForVisible(timeout = 5000): Promise<void> {
    await this.root.waitFor({ state: 'visible', timeout });
  }

  /** Wait until the component is hidden */
  async waitForHidden(timeout = 5000): Promise<void> {
    await this.root.waitFor({ state: 'hidden', timeout });
  }

  /** Click inside the component using a child selector */
  async click(selector: string, timeout = 5000): Promise<void> {
    const el = this.root.locator(selector);
    await el.waitFor({ state: 'visible', timeout });
    await el.click();
  }

  /** Fill an input inside the component */
  async fill(selector: string, value: string, timeout = 5000): Promise<void> {
    const el = this.root.locator(selector);
    await el.waitFor({ state: 'visible', timeout });
    await el.fill(value);
  }

  /** Return inner text of a child element */
  async text(selector: string): Promise<string> {
    const el = this.root.locator(selector);
    await el.waitFor({ state: 'visible', timeout: 5000 });
    return el.innerText();
  }
}
