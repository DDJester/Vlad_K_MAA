# Test info

- Name: Verify item visibility in CSR search
- Location: M:\PlaywrightStuff\src\tests\search.test.ts:9:5

# Error details

```
Error: expect(locator).toBeVisible()

Locator: locator('input.ui-input-input[type="text"][placeholder="Search"]')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 10000ms
  - waiting for locator('input.ui-input-input[type="text"][placeholder="Search"]')

    at DashboardPage.expectToBeVisible (M:\PlaywrightStuff\src\pages\basePage.ts:63:27)
    at DashboardPage.searchAndSelectItem (M:\PlaywrightStuff\src\pages\DashboardPage.ts:35:16)
    at M:\PlaywrightStuff\src\tests\search.test.ts:20:29
    at M:\PlaywrightStuff\src\tests\search.test.ts:17:28
```

# Test source

```ts
   1 | import { Page, Locator, FrameLocator, expect } from '@playwright/test';
   2 |
   3 | export class BasePage {
   4 |   protected readonly page: Page;
   5 |
   6 |   constructor(page: Page) {
   7 |     this.page = page;
   8 |   }
   9 |
  10 |   // Basic actions
  11 |   protected get expect() {
  12 |     return expect;
  13 |   }
  14 |
  15 |   async click(locator: Locator, options?: { timeout?: number }): Promise<void> {
  16 |     await locator.waitFor({ state: 'visible' });
  17 |     await locator.click(options);
  18 |   }
  19 |
  20 |   async fill(locator: Locator, text: string): Promise<void> {
  21 |     await locator.waitFor({ state: 'visible' });
  22 |     await locator.fill(text);
  23 |   }
  24 |
  25 |   async type(locator: Locator, text: string, delay = 100): Promise<void> {
  26 |     await locator.waitFor({ state: 'visible' });
  27 |     await locator.type(text, { delay });
  28 |   }
  29 |
  30 |   async clickWithRetry(
  31 |     locator: Locator,
  32 |     options?: {
  33 |       timeout?: number,
  34 |       maxRetries?: number,
  35 |       preAction?: () => Promise<void>
  36 |     }
  37 |   ): Promise<void> {
  38 |     const maxRetries = options?.maxRetries ?? 3;
  39 |     const timeout = options?.timeout ?? 5000;
  40 |
  41 |     for (let attempt = 1; attempt <= maxRetries; attempt++) {
  42 |       try {
  43 |         if (options?.preAction) {
  44 |           await options.preAction();
  45 |         }
  46 |
  47 |         await locator.waitFor({ state: 'visible', timeout });
  48 |         await locator.click();
  49 |         return;
  50 |       } catch (error) {
  51 |         if (attempt === maxRetries) throw error;
  52 |         await this.wait(1000);
  53 |       }
  54 |     }
  55 |   }
  56 |
  57 |   // Assertions
  58 |   async expectUrl(url: string | RegExp): Promise<void> {
  59 |     await expect(this.page).toHaveURL(url);
  60 |   }
  61 |
  62 |   async expectToBeVisible(locator: Locator, timeout = 10000): Promise<void> {
> 63 |     await expect(locator).toBeVisible({ timeout });
     |                           ^ Error: expect(locator).toBeVisible()
  64 |   }
  65 |
  66 |   async expectToBeEnabled(locator: Locator): Promise<void> {
  67 |     await expect(locator).toBeEnabled();
  68 |   }
  69 |
  70 |   async expectToHaveValue(locator: Locator, value: string): Promise<void> {
  71 |     await expect(locator).toHaveValue(value);
  72 |   }
  73 |
  74 |   async expectToHaveText(locator: Locator, text: string | RegExp): Promise<void> {
  75 |     await expect(locator).toHaveText(text);
  76 |   }
  77 |
  78 |   // Frame handling
  79 |   getFrame(selector: string): FrameLocator {
  80 |     return this.page.frameLocator(selector);
  81 |   }
  82 |
  83 |   // Utilities
  84 |   async screenshot(name: string): Promise<void> {
  85 |     await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  86 |   }
  87 |
  88 |   async wait(ms: number): Promise<void> {
  89 |     await this.page.waitForTimeout(ms);
  90 |   }
  91 | }
```