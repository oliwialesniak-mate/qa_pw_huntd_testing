import { BasePage } from './BasePage';
import { Page } from '@playwright/test';
import { HeaderComponent } from '../components/HeaderComponent';

export class HomePage extends BasePage {
  readonly header: HeaderComponent;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
  }

  async openHome() {
    await this.goto('/');
  }
}
