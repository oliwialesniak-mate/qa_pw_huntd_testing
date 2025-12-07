import { BaseComponent } from './BaseComponent';

export class HeaderComponent extends BaseComponent {
  constructor(page: any) {
    super(page, 'header');
  }

  async goToLogin() {
    await this.root.locator('[data-test=login-link]').click();
  }

  async getTitleText() {
    return this.root.locator('h1').innerText();
  }
}
