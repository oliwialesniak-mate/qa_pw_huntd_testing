import { BasePage } from './BasePage';
import { Page } from '@playwright/test';

export class HuntdPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async createHunt(name: string) {
    // Placeholder - replace with real selectors
    await this.page.click('[data-test=create-hunt]');
    await this.page.fill('[data-test=hunt-name]', name);
    await this.page.click('[data-test=submit-hunt]');
  }

  async findHuntInList(name: string) {
    return this.page.locator(`text=${name}`).first();
  }
}
