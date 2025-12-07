import { Page } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

/**
 * HeaderComponent
 * Represents the page header with navigation links.
 */
export class HeaderComponent extends BaseComponent {
  constructor(page: Page) {
    super(page, 'header'); // assumes the main <header> element
  }

  /** Clicks the login link in the header */
  async goToLogin(): Promise<void> {
    await this.click('a[href="/login"]');
  }

  /** Clicks the logout button if present */
  async logout(): Promise<void> {
    const logoutBtn = this.root.locator('button#logout');
    const isVisible = await logoutBtn.isVisible();
    if (isVisible) {
      await logoutBtn.click();
    }
  }

  /** Returns the main header title text */
  async getTitleText(): Promise<string> {
    return this.text('h1');
  }

  /** Navigate to a header navigation link by text */
  async clickNavLink(linkText: string): Promise<void> {
    const link = this.root.locator('nav a', { hasText: linkText });
    await link.waitFor({ state: 'visible', timeout: 5000 });
    await link.click();
  }
}
