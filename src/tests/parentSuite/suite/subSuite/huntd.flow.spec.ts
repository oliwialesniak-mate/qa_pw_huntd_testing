import { test, expect } from '@playwright/test';
import { HomePage } from '../../../../pages/HomePage';
import { HuntdPage } from '../../../../pages/HuntdPage';
import { UserBuilder } from '../../../../builders/UserBuilder';
import { ApiFacade } from '../../../../facade/ApiFacade';

test.describe.parallel('parentSuite / suite / subSuite - Huntd flows', () => {
  test.beforeEach(async ({ page }) => {
    // optional global setup before each test
  });

  test('should create a hunt via UI and find it in list', async ({ page, baseURL }) => {
    const home = new HomePage(page);
    const huntd = new HuntdPage(page);

    await home.openHome();

    const name = `hunt-${Date.now()}`;
    await huntd.createHunt(name);

    const locator = await huntd.findHuntInList(name);
    await expect(locator).toBeVisible();
  });

  test('should create user via API then login via UI', async ({ page }) => {
    const base = process.env.HUNTD_BASE_URL || (await page.context().baseUrl());
    const facade = new ApiFacade(base);

    const user = new UserBuilder().withRole('admin').build();
    await facade.createUser(user); // prepare precondition via GraphQL

    // Now do UI login (selector placeholders)
    await page.goto('/');
    await page.fill('[data-test=login-username]', user.username);
    await page.fill('[data-test=login-password]', user.password);
    await page.click('[data-test=login-button]');

    await expect(page.locator('[data-test=profile-username]')).toHaveText(user.username);
  });
});
