import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class DashboardPage extends BasePage {
  readonly folderItem: Locator;
  readonly createButton: Locator;
  readonly searchInput: Locator;
  readonly nextButton: Locator;
  readonly skipButton: Locator;
  readonly itemTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.folderItem = page.locator('li[itemid="12"] button.dynatree-title').nth(0);
    this.createButton = page.locator('a[href="#create"]');
    this.searchInput = page.locator('input.ui-input-input[type="text"][placeholder="Search"]');
    this.nextButton = page.locator('button.wf-button.--primary:has-text("Next")');
    this.skipButton = page.getByRole('button', { name: 'Skip' });
    this.itemTitle = page.locator('.item-create-dialog-list__item-title');
  }

  async rightClickFolder(): Promise<void> {
    await this.folderItem.scrollIntoViewIfNeeded();
    await this.expectToBeVisible(this.folderItem);
    await this.folderItem.hover();
    await this.folderItem.click({ button: 'right', delay: 1000 });
  }

  async createNewItem(): Promise<void> {
    await this.expectToBeVisible(this.createButton);
    await this.click(this.createButton);
  }

  async searchAndSelectItem(text: string): Promise<void> {
    await this.expectToBeVisible(this.searchInput);
    await this.fill(this.searchInput, '');
    await this.type(this.searchInput, text);
    await this.expectToHaveValue(this.searchInput, text);
    
    const targetItem = this.itemTitle.filter({ hasText: text });
    await this.expectToBeVisible(targetItem);
    await this.click(targetItem);
  }

  async clickNext(): Promise<void> {
    await this.expectToBeVisible(this.nextButton);
    await this.expectToBeEnabled(this.nextButton);
    await this.click(this.nextButton);
    await this.wait(1000);
  }

  async clickSkip(): Promise<void> {
    await this.expectToBeVisible(this.skipButton);
    await this.expectToBeEnabled(this.skipButton);
    await this.click(this.skipButton);
    await this.wait(1000);
  }
}