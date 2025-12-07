import { Page, Locator } from '@playwright/test';

/**
 * MenuItem represents a single clickable item inside a menu.
 */
export class MenuItem {
  locator: Locator;

  constructor(locator: Locator) {
    this.locator = locator;
  }

  /** Click the menu item */
  async click(): Promise<void> {
    await this.locator.waitFor({ state: 'visible', timeout: 5000 });
    await this.locator.click();
  }

  /** Return the inner text of the menu item */
  async text(): Promise<string> {
    return this.locator.innerText();
  }
}

/**
 * MenuComposite represents a menu with multiple child MenuItems.
 * Implements the Composite pattern: parent menu has child items.
 */
export class MenuComposite {
  private page: Page;
  private menuRoot: Locator;
  private children: MenuItem[] = [];

  /**
   * @param page - Playwright Page object
   * @param rootSelector - CSS selector for the menu container
   */
  constructor(page: Page, rootSelector: string) {
    this.page = page;
    this.menuRoot = page.locator(rootSelector);
  }

  /**
   * Loads the menu items from the DOM into the children array.
   * Resets any previously loaded items to avoid duplication.
   * @param itemSelector - CSS selector for child menu items
   */
  async loadChildren(itemSelector = 'li'): Promise<void> {
    this.children = [];
    const items = this.menuRoot.locator(itemSelector);
    const count = await items.count();

    for (let i = 0; i < count; i++) {
      this.children.push(new MenuItem(items.nth(i)));
    }
  }

  /** Access a child menu item by index, throws if out-of-bounds */
  item(index: number): MenuItem {
    if (index < 0 || index >= this.children.length) {
      throw new Error(`MenuComposite: invalid index ${index}`);
    }
    return this.children[index];
  }

  /** Click all child menu items sequentially */
  async clickAll(): Promise<void> {
    for (const child of this.children) {
      await child.click();
    }
  }

  /** Return all child texts */
  async getAllTexts(): Promise<string[]> {
    const texts: string[] = [];
    for (const child of this.children) {
      texts.push(await child.text());
    }
    return texts;
  }
}
