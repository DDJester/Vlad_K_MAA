# Test info

- Name: Verify image adding to an item
- Location: M:\PlaywrightStuff\src\tests\filemanager.test.ts:8:5

# Error details

```
Error: locator.scrollIntoViewIfNeeded: Target page, context or browser has been closed
Call log:
  - waiting for locator('li[itemid="12"] button.dynatree-title').first()

    at DashboardPage.rightClickFolder (M:\PlaywrightStuff\src\pages\DashboardPage.ts:23:27)
    at M:\PlaywrightStuff\src\tests\filemanager.test.ts:15:29
    at M:\PlaywrightStuff\src\tests\filemanager.test.ts:14:39
```

# Test source

```ts
   1 | import { Page, Locator } from '@playwright/test';
   2 | import { BasePage } from './basePage';
   3 |
   4 | export class DashboardPage extends BasePage {
   5 |   readonly folderItem: Locator;
   6 |   readonly createButton: Locator;
   7 |   readonly searchInput: Locator;
   8 |   readonly nextButton: Locator;
   9 |   readonly skipButton: Locator;
  10 |   readonly itemTitle: Locator;
  11 |
  12 |   constructor(page: Page) {
  13 |     super(page);
  14 |     this.folderItem = page.locator('li[itemid="12"] button.dynatree-title').nth(0);
  15 |     this.createButton = page.locator('a[href="#create"]');
  16 |     this.searchInput = page.locator('input.ui-input-input[type="text"][placeholder="Search"]');
  17 |     this.nextButton = page.locator('button.wf-button.--primary:has-text("Next")');
  18 |     this.skipButton = page.getByRole('button', { name: 'Skip' });
  19 |     this.itemTitle = page.locator('.item-create-dialog-list__item-title');
  20 |   }
  21 |
  22 |   async rightClickFolder(): Promise<void> {
> 23 |     await this.folderItem.scrollIntoViewIfNeeded();
     |                           ^ Error: locator.scrollIntoViewIfNeeded: Target page, context or browser has been closed
  24 |     await this.expectToBeVisible(this.folderItem);
  25 |     await this.folderItem.hover();
  26 |     await this.folderItem.click({ button: 'right', delay: 1000 });
  27 |   }
  28 |
  29 |   async createNewItem(): Promise<void> {
  30 |     await this.expectToBeVisible(this.createButton);
  31 |     await this.click(this.createButton);
  32 |   }
  33 |
  34 |   async searchAndSelectItem(text: string): Promise<void> {
  35 |     await this.expectToBeVisible(this.searchInput);
  36 |     await this.fill(this.searchInput, '');
  37 |     await this.type(this.searchInput, text);
  38 |     await this.expectToHaveValue(this.searchInput, text);
  39 |     
  40 |     const targetItem = this.itemTitle.filter({ hasText: text });
  41 |     await this.expectToBeVisible(targetItem);
  42 |     await this.click(targetItem);
  43 |   }
  44 |
  45 |   async clickNext(): Promise<void> {
  46 |     await this.expectToBeVisible(this.nextButton);
  47 |     await this.expectToBeEnabled(this.nextButton);
  48 |     await this.click(this.nextButton);
  49 |     await this.wait(1000);
  50 |   }
  51 |
  52 |   async clickSkip(): Promise<void> {
  53 |     await this.expectToBeVisible(this.skipButton);
  54 |     await this.expectToBeEnabled(this.skipButton);
  55 |     await this.click(this.skipButton);
  56 |     await this.wait(1000);
  57 |   }
  58 | }
```