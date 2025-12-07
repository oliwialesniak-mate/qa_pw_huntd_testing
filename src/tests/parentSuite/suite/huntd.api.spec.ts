import { test, expect } from '@playwright/test';
import { ApiFacade } from '../../../../facade/ApiFacade';
import { UserBuilder } from '../../../../builders/UserBuilder';

test.describe('parentSuite / suite / subSuite - API tests', () => {
  test('create user via GraphQL', async () => {
    const base = process.env.HUNTD_BASE_URL || 'http://localhost:3000';
    const facade = new ApiFacade(base);

    const user = new UserBuilder().withUsername(`api_user_${Date.now()}`).withEmail(`api_${Date.now()}@example.com`).build();

    const resp = await facade.createUser(user);
    expect(resp).toBeDefined();
    // check shape (depends on API)
    expect(resp.createUser.username).toBeTruthy();
  });
});
