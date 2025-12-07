import { Page, Locator } from '@playwright/test';

export class MenuItem {
  locator: Locator;
  constructor(locator: Locator) {
    this.locator = locator;
  }

  async click() {
    await this.locator.click();
  }
}

export class MenuComposite {
  private page: Page;
  private menuRoot: Locator;
  private children: MenuItem[] = [];

  constructor(page: Page, rootSelector: string) {
    this.page = page;
    this.menuRoot = page.locator(rootSelector);
  }

  async loadChildren(itemSelector = 'li') {
    const items = this.menuRoot.locator(itemSelector);
    const count = await items.count();
    for (let i = 0; i < count; i++) {
      this.children.push(new MenuItem(items.nth(i)));
    }
  }

  item(index: number): MenuItem {
    return this.children[index];
  }

  async clickAll() {
    for (const c of this.children) {
      await c.click();
    }
  }
}
