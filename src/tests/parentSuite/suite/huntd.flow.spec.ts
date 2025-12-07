import { test, expect } from '@playwright/test';
import { HuntdPage } from '../../../../pages/HuntdPage';
import { UserBuilder } from '../../../../builders/UserBuilder';
import { ApiFacade } from '../../../../facade/ApiFacade';

/**
 * End-to-end flow tests for Huntd functionality.
 * Organized under parentSuite / suite / subSuite.
 */
test.describe('parentSuite / suite / subSuite - Huntd flows', () => {

  test('should create a hunt via UI and verify it in the list', async ({ page }) => {
    const huntdPage = new HuntdPage(page);

    const huntName = `hunt-${Date.now()}`;
    await huntdPage.createHunt(huntName, 'Automated test hunt description');

    const huntRow = await huntdPage.findHuntInList(huntName);
    await expect(huntRow).toBeVisible();
  });

  test('should create a user via API then login via UI', async ({ page }) => {
    const baseUrl = process.env.HUNTD_BASE_URL || 'https://app.huntd.io';
    const api = new ApiFacade(baseUrl);

    // Build user test data
    const user = new UserBuilder()
      .withRole('admin')
      .build();

    // Create user via API
    const createdUser = await api.createUser(user);
    expect(createdUser.username).toBe(user.username);

    // Login via UI
    await page.goto(`${baseUrl}/login`);
    await page.fill('input[name="username"]', user.username);
    await page.fill('input[name="password"]', user.password);
    await page.click('button#login');

    // Verify login successful
    const profileUsername = page.locator('#profile-username');
    await expect(profileUsername).toHaveText(user.username, { timeout: 5000 });
  });

  test('should delete a hunt via UI', async ({ page }) => {
    const huntdPage = new HuntdPage(page);
    const huntName = `hunt-to-delete-${Date.now()}`;

    // Create hunt first
    await huntdPage.createHunt(huntName);

    // Delete hunt
    const deleted = await huntdPage.deleteHuntByName(huntName);
    expect(deleted).toBe(true);
  });

});
