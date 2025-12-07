import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * HuntdPage - stable selectors and explicit waits for creating and locating hunts.
 *
 * NOTE: These selectors are concrete and chosen to be robust:
 * - Buttons use IDs where possible (#create-hunt-btn, #submit-hunt-btn)
 * - Inputs use name attributes (input[name="huntName"])
 * - List items use a semantic container (.hunt-list .hunt-item) and contain the hunt name text
 *
 * If your application uses different attributes, update the strings below to match the app.
 */
export class HuntdPage extends BasePage {
  private selectors = {
    createButton: '#create-hunt-btn',
    nameInput: 'input[name="huntName"]',
    descriptionInput: 'textarea[name="huntDescription"]',
    submitButton: '#submit-hunt-btn',
    successToast: '.toast-success',
    huntList: '.hunt-list',
    huntItem: '.hunt-list .hunt-item',
    huntItemName: '.hunt-item__name', // used within the hunt item element
    loadingSpinner: '.loading-spinner'
  };

  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  /** Open the main hunts page */
  async openHuntsPage() {
    await this.goto('/hunts');
    // Wait until either the list or a clear empty-state is visible
    await Promise.race([
      this.page.locator(this.selectors.huntList).waitFor({ state: 'visible', timeout: 5000 }),
      this.page.locator(this.selectors.loadingSpinner).waitFor({ state: 'hidden', timeout: 5000 })
    ]).catch(() => {
      // best-effort: continue if neither condition met quickly
    });
  }

  /**
   * Create a hunt with a name and optional description.
   * Returns the created hunt name for convenience.
   */
  async createHunt(name: string, description?: string) {
    // ensure we're on the hunts page
    await this.openHuntsPage();

    // Click the create button
    await this.click(this.selectors.createButton);

    // Wait for form to appear: name input visible
    const nameLocator = this.page.locator(this.selectors.nameInput);
    await nameLocator.waitFor({ state: 'visible', timeout: 5000 });

    // Fill fields
    await nameLocator.fill(name);

    if (description !== undefined) {
      const desc = this.page.locator(this.selectors.descriptionInput);
      // wait but don't fail if description input is absent
      try {
        await desc.waitFor({ state: 'visible', timeout: 1000 });
        await desc.fill(description);
      } catch {
        // ignore: optional field
      }
    }

    // Submit
    await this.click(this.selectors.submitButton);

    // Wait for backend processing: either success toast or new item in list
    const toast = this.page.locator(this.selectors.successToast);
    const newItem = this.page.locator(this.selectors.huntItem, { hasText: name });

    await Promise.race([
      toast.waitFor({ state: 'visible', timeout: 7000 }),
      newItem.waitFor({ state: 'visible', timeout: 7000 })
    ]).catch(() => {
      // Provide a helpful error if neither appeared
      throw new Error(`createHunt: neither success toast nor list item appeared for hunt "${name}"`);
    });

    // final sanity: assert the item exists in the list
    await expect(newItem).toBeVisible({ timeout: 2000 });

    return name;
  }

  /**
   * Find a hunt row element by its exact name. Returns a Locator pointing to the item.
   * Throws if not found within timeout.
   */
  async findHuntInList(name: string) {
    await this.openHuntsPage();

    const item = this.page.locator(this.selectors.huntItem, { hasText: name }).first();
    await item.waitFor({ state: 'visible', timeout: 5000 });
    return item;
  }

  /**
   * Delete a hunt by name. Assumes each .hunt-item has a delete button with class .hunt-item__delete
   * Returns true if deleted, false if not found.
   */
  async deleteHuntByName(name: string) {
    await this.openHuntsPage();

    const item = this.page.locator(this.selectors.huntItem, { hasText: name }).first();
    const exists = await item.count();
    if (!exists) return false;

    const deleteBtn = item.locator('.hunt-item__delete');
    await deleteBtn.waitFor({ state: 'visible', timeout: 3000 });
    await deleteBtn.click();

    // Wait for item to disappear
    await item.waitFor({ state: 'detached', timeout: 7000 }).catch(() => {
      throw new Error(`deleteHuntByName: item "${name}" did not disappear after delete`);
    });

    return true;
  }
}
