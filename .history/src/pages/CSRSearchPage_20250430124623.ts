import { Page, Locator, FrameLocator, expect } from '@playwright/test';

export class CSRSearchPage {
    readonly page: Page;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly iframeScope: FrameLocator;

    constructor(page: Page) {
        this.page = page;
        this.searchInput = page.locator('#search-input');
        this.searchButton = page.locator('.search-box__submit.ladda-button');
        this.iframeScope = page.frameLocator('iframe[name="itemscope"]');
    }

    async searchWithWait(query: string): Promise<void> {
        // Очищаем поле и вводим запрос с задержкой
        await this.searchInput.fill('');
        await this.searchInput.type(query, { delay: 100 });

        // Ждем активации кнопки
        await this.waitForActiveButton();

        // Кликаем и ждем загрузки
        await this.searchButton.click();
        await this.page.waitForTimeout(1000); // Краткая пауза для стабилизации
    }

    async verifyItemVisible(itemName: string): Promise<void> {

        // Ищем элемент в iframe с несколькими попытками
        const maxAttempts = 3;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {

            console.log(`Attempt ${attempt} to find item "${itemName}"`);
            const itemLocator = this.iframeScope.locator(`.result-title-caption h3:has-text("${itemName}")`);
            await expect(itemLocator).toBeVisible({ timeout: 10000 });
            console.log(`Item "${itemName}" found and visible`);
            return;

        }

    }

    async verifyItemNotVisible(itemName: string): Promise<void> {

        const itemLocator = this.iframeScope.locator(`.result-title-caption h3:has-text("${itemName}")`);
        await expect(itemLocator).not.toBeVisible({ timeout: 8000 });

        // Дополнительная проверка
        const allItems = await this.iframeScope.locator('.result-title-caption h3').allTextContents();
        if (allItems.some(text => text.includes(itemName))) {
            throw new Error(`Item "${itemName}" was found in results`);
        }

    }

    private async waitForActiveButton(): Promise<void> {
        await expect(this.searchButton).toBeEnabled();
        await expect(this.searchButton).not.toHaveClass(/ladda-loading/);
    }
}