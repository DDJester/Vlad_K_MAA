import { Page, Locator, expect } from '@playwright/test';

export class CSRSearchPage {
    readonly page: Page;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly searchResults: Locator;

    constructor(page: Page) {
        this.page = page;
        this.searchInput = page.locator('#search-input');
        this.searchButton = page.locator('.search-box__submit.ladda-button');
        this.searchResults = page.locator('.search-results__container');
    }
    
    async searchWithWait(query: string): Promise<void> {
        await this.searchInput.fill(query);
        await this.waitForActiveButton();
        await this.searchButton.click();
        //await this.searchResults.waitFor({ state: 'visible', timeout: 10000 });
    }

    async verifyItemVisible(itemName: string): Promise<void> {
        const itemLocator = this.searchResults.locator(`:text("${itemName}")`).first();
        await expect(itemLocator).toBeVisible({ timeout: 5000 });
    }

    async verifyItemNotVisible(itemName: string): Promise<void> {
        const itemLocator = this.searchResults.locator(`:text("${itemName}")`).first();
        await expect(itemLocator).not.toBeVisible({ timeout: 5000 });
        
        // Дополнительная проверка для надежности
        const allItems = await this.searchResults.locator('.result-item').allTextContents();
        if (allItems.some(text => text.includes(itemName))) {
            await this.page.screenshot({ path: 'error_offline_item_found.png' });
            throw new Error(`Offline item "${itemName}" was found in search results`);
        }
    }

    private async waitForActiveButton(): Promise<void> {
        await expect(this.searchButton).toBeEnabled();
        await expect(this.searchButton).not.toHaveClass(/ladda-loading/);
    }
}