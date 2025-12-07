import { Page } from '@playwright/test';

/**
 * BasePage - safe and deterministic URL handling + common helpers.
 *
 * Rules:
 * - Prefer HUNTD_BASE_URL environment variable (set by CI, Docker, or local env).
 * - If a full URL (http(s)://...) is provided to goto(), it will be used as-is.
 * - If a relative path is provided and HUNTD_BASE_URL is set, the URL will be resolved against it.
 * - Avoid reading page.context().baseUrl() in the constructor (it may be unavailable).
 */
export abstract class BasePage {
  protected page: Page;
  private readonly baseUrl: string | undefined;

  constructor(page: Page) {
    this.page = page;
    // Use explicit environment variable for determinism in CI / Docker / local runs.
    // If not set, baseUrl remains undefined and goto() will accept absolute URLs only.
    this.baseUrl = process.env.HUNTD_BASE_URL || undefined;
  }

  /**
   * Navigate to a path or absolute URL.
   * - If target is an absolute URL, it is used as-is.
   * - If target is a relative path and baseUrl is set, it will be resolved.
   * - If target is a relative path and no baseUrl is set, it will treat it as path (Playwright accepts paths too).
   */
  async goto(target: string = '/') {
    if (!target) target = '/';

    const isAbsolute = /^https?:\/\//i.test(target);

    if (isAbsolute) {
      await this.page.goto(target);
      return;
    }

    if (this.baseUrl) {
      // ensure exactly one slash between base and path
      const normalizedBase = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
      const normalizedPath = target.startsWith('/') ? target : `/${target}`;
      const url = `${normalizedBase}${normalizedPath}`;
      await this.page.goto(url);
      return;
    }

    // No baseUrl provided, use target as-is (Playwright will resolve relative to about:blank -> treat as path)
    await this.page.goto(target);
  }

  /** Return the current page title */
  async title(): Promise<string> {
    return this.page.title();
  }

  /** Wait for network to be idle — useful after actions that trigger navigation / background loads */
  async waitForIdle(timeout = 5000): Promise<void> {
    // wait for networkidle by waiting for loadstate 'networkidle'
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  /** Helper to reload current page */
  async reload() {
    await this.page.reload();
    await this.waitForIdle();
  }

  /** Click helper that waits for element to be visible & enabled before clicking */
  async click(selector: string, options?: { timeout?: number }) {
    const timeout = options?.timeout ?? 5000;
    const el = this.page.locator(selector);
    await el.waitFor({ state: 'visible', timeout });
    await el.click();
  }

  /** Fill helper that waits for element to be visible before filling */
  async fill(selector: string, value: string, options?: { timeout?: number }) {
    const timeout = options?.timeout ?? 5000;
    const el = this.page.locator(selector);
    await el.waitFor({ state: 'visible', timeout });
    await el.fill(value);
  }
}
