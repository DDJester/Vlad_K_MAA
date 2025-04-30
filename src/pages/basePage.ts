import { Page, Locator, FrameLocator, expect } from '@playwright/test';

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Basic actions
  protected get expect() {
    return expect;
  }

  async click(locator: Locator, options?: { timeout?: number }): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click(options);
  }

  async fill(locator: Locator, text: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.fill(text);
  }

  async type(locator: Locator, text: string, delay = 100): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.type(text, { delay });
  }

  async clickWithRetry(
    locator: Locator,
    options?: {
      timeout?: number,
      maxRetries?: number,
      preAction?: () => Promise<void>
    }
  ): Promise<void> {
    const maxRetries = options?.maxRetries ?? 3;
    const timeout = options?.timeout ?? 5000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        if (options?.preAction) {
          await options.preAction();
        }

        await locator.waitFor({ state: 'visible', timeout });
        await locator.click();
        return;
      } catch (error) {
        if (attempt === maxRetries) throw error;
        await this.wait(1000);
      }
    }
  }

  // Assertions
  async expectUrl(url: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(url);
  }

  async expectToBeVisible(locator: Locator, timeout = 10000): Promise<void> {
    await expect(locator).toBeVisible({ timeout });
  }

  async expectToBeEnabled(locator: Locator): Promise<void> {
    await expect(locator).toBeEnabled();
  }

  async expectToHaveValue(locator: Locator, value: string): Promise<void> {
    await expect(locator).toHaveValue(value);
  }

  async expectToHaveText(locator: Locator, text: string | RegExp): Promise<void> {
    await expect(locator).toHaveText(text);
  }

  // Frame handling
  getFrame(selector: string): FrameLocator {
    return this.page.frameLocator(selector);
  }

  // Utilities
  async screenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }

  async wait(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }
}