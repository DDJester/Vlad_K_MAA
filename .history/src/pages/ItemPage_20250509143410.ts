import { Page, Locator, expect } from '@playwright/test';
import type { FrameLocator } from '@playwright/test';
import { BasePage } from './basePage';

export class ItemPage extends BasePage {
  readonly frame: FrameLocator;
  readonly saveButton: Locator;
  readonly notificationDialog: Locator;
  readonly updateButton: Locator;
  readonly itemtitle: Locator;

  constructor(page: Page) {
    super(page);
    this.itemtitle = page.locator('#itemTitleForEdit');
    this.frame = this.getFrame('iframe[name="itemscope"]');
    this.saveButton = page.getByRole('button', { name: 'Save', exact: true });
    this.notificationDialog = page.locator('[aria-describedby="notification-dialog"]');
    this.updateButton = page.getByRole('button', { name: 'Update' });
  }

  async openitemtab(): Promise<void> {
    await this.page.locator('iframe[name="itemscope"]').contentFrame().getByRole('link', { name: '1' }).click();
  }

  async addimagetoexternalfield(): Promise<void> {
    await this.page.locator('iframe[name="itemscope"]').contentFrame().locator('#item-update-tab-1 div').filter({ hasText: 'Browse' }).nth(4).click();
    await this.page.locator('div').filter({ hasText: /^download045\.jpeg$/ }).first().click();
    await this.page.getByRole('button', { name: 'Select file' }).click();
  }

  async checkaddedimagetoexternalfield(): Promise<void> {
    const frame = this.page.frameLocator('iframe[name="itemscope"]');
    const img = frame.locator('.file-widget-preview-thumbnail[src*="b6e0bfe5-a305-40c2-9b74-d81d80bf5f5f"]');
    await expect(img).toHaveAttribute(
      'src',
      'https://kmsqacm.lighthouse-cloud.com:443/kms/lh/archive/externalFiles/b6e0bfe5-a305-40c2-9b74-d81d80bf5f5f.jpeg');
  }

  async fillItemName(name: string): Promise<string> {
    const uniqueId = Date.now();
    const entityName = `${name} ${uniqueId}`;
    await this.frame.getByRole('heading', { name: 'New Item' }).click();
    await this.frame.locator('input[name="inplace_value"]').fill(entityName);
    console.log(`Created entity: ${entityName}`);
    return entityName;
  }

  async fillOnlineItemName(): Promise<string> {
    return this.fillItemName('Online Item');
  }

  async fillOfflineItemName(): Promise<string> {
    return this.fillItemName('Offline Item');
  }

  async changeStatusToOnline(): Promise<void> {
    const frame = this.page.frameLocator('iframe[name="itemscope"]');

    const clickOfflineWithRetry = async (maxRetries = 5) => {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`Attempt ${attempt} to click Offline`);
          const offlineElement = frame.locator('.selection-container');
          await offlineElement.waitFor({ state: 'visible', timeout: 5000 });
          await expect(offlineElement).toBeEnabled();
          await offlineElement.scrollIntoViewIfNeeded();
          await offlineElement.click({ force: true, timeout: 5000, trial: true });
          await frame.locator('.iw-dropdown-filter-container').waitFor({ state: 'visible', timeout: 5000 });
          return;
        } catch (error) {
          console.warn(`Attempt ${attempt} failed:`, error instanceof Error ? error.message : String(error));
          await this.wait(1000);
          if (attempt === maxRetries) throw error;
        }
      }
    };

    const selectOnlineOption = async () => {
      const onlineOption = frame.getByRole('option', { name: 'Online' });
      await onlineOption.waitFor({ state: 'visible', timeout: 10000 });
      await onlineOption.click({ force: true, timeout: 5000, trial: true });
      await frame.locator('#status-select').waitFor({ state: 'visible', timeout: 10000 });
    };

    await clickOfflineWithRetry();
    await selectOnlineOption();
    await this.screenshot('after-status-change');
  }

  async saveAndHandleDialog(): Promise<void> {
    await this.forceBlur();
    await this.expectToBeVisible(this.saveButton);
    await this.click(this.saveButton);

    if (await this.notificationDialog.isVisible().catch(() => false)) {
      await this.expectToBeVisible(this.updateButton);
      await this.click(this.updateButton);
      console.log('Closed notification dialog');
    }
  }

  private async forceBlur(): Promise<void> {
    await this.page.evaluate(() => {
      const active = document.activeElement as HTMLElement;
      if (active) active.blur();
    });

    await this.page.waitForTimeout(500); // Краткая пауза
  }

  async verifyItemInTree(itemName: string): Promise<void> {
    const itemInTree = this.page.locator(`[role="button"][title="${itemName}"]`)
      .or(this.page.locator(`.dynatree-title:has-text("${itemName}")`))
      .first();
    await this.expectToBeVisible(itemInTree, 15000);
  }

  async verifyStatusOnline(): Promise<void> {
    const statusText = this.frame.locator('.iw-dropdown-value-container .selection-container span');
    await this.expectToHaveText(statusText, /^Online$/);

  }

  async verifyOnlineItemColor(itemName: string): Promise<void> {
    const button = this.page.locator(`[role="button"][title="${itemName}"]`)
      .or(this.page.locator(`.dynatree-title:has-text("${itemName}")`))
      .or(this.page.getByRole('button', { name: itemName }))
      .first();

    await this.expect(button).toBeVisible({ timeout: 15000 }); // Исправлено здесь

    const elementInfo = await button.evaluate(el => ({
      color: getComputedStyle(el).color,
      backgroundColor: getComputedStyle(el).backgroundColor
    }));

    console.log('Цвет Online элемента:', elementInfo.color);

    const actualColor = elementInfo.color;
    if (!(actualColor === 'rgb(10, 12, 13)' ||
      actualColor === '#0a0c0d' ||
      actualColor.toLowerCase().includes('0a0c0d'))) {
      await this.page.screenshot({ path: 'online-color-error.png' });
      throw new Error(`Некорректный цвет Online элемента. Ожидался 0a0c0d, получен: ${actualColor}`);
    }
  }

  async verifyStatusOffline(): Promise<void> {
    const statusText = this.frame.locator('.iw-dropdown-value-container .selection-container span');
    await this.expectToHaveText(statusText, /^Offline$/);
  }

  async verifyOfflineItemColor(itemName: string): Promise<void> {
    const button = this.page.locator(`[role="button"][title="${itemName}"]`)
      .or(this.page.locator(`.dynatree-title:has-text("${itemName}")`))
      .or(this.page.getByRole('button', { name: itemName }))
      .first();

    await expect(button).toBeVisible({ timeout: 15000 });

    const elementInfo = await button.evaluate(el => ({
      color: getComputedStyle(el).color,
      backgroundColor: getComputedStyle(el).backgroundColor
    }));

    console.log('Цвет Offline элемента:', elementInfo.color);

    const actualColor = elementInfo.color;
    if (!(actualColor === 'rgb(255, 0, 0)' ||
      actualColor === '#808080' ||
      actualColor.toLowerCase().includes('808080'))) {
      await this.page.screenshot({ path: 'offline-color-error.png' });
      throw new Error(`Некорректный цвет Offline элемента. Ожидался 808080, получен: ${actualColor}`);
    }
  }

  async locateInTree(): Promise<void> {
    const locateBtn = this.frame.getByRole('img', { name: 'Locate in tree' });
    await this.expectToBeVisible(locateBtn);
    await this.expectToBeEnabled(locateBtn);
    await this.click(locateBtn);
  }

  async locateAndVerifyInTree(itemName: string): Promise<void> {
    await this.locateInTree();
    await this.verifyItemInTree(itemName);
  }

}