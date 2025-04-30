import { Page, Locator, expect } from '@playwright/test';

export class CSRSearchPage {
    readonly page: Page;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly searchResults: Locator;
    private readonly iframeScope: Locator;

    constructor(page: Page) {
        this.page = page;
        this.searchInput = page.locator('#search-input');
        this.searchButton = page.locator('.search-box__submit.ladda-button');
        this.searchResults = page.locator('.search-results__container');
        this.iframeScope = page.locator('iframe#itemscope');
    }
    
    async searchWithWait(query: string): Promise<void> {
        console.log(`[SEARCH] Выполняю поиск по запросу: "${query}"`);
        await this.searchInput.fill(query);
        await this.waitForActiveButton();
        await this.searchButton.click();
    }

    async verifyItemVisible(itemName: string): Promise<void> {
        console.log(`[VERIFY] Проверяю видимость ONLINE айтема: "${itemName}"`);
        
        await this.iframeScope.waitFor({ state: 'attached', timeout: 10000 });
        const iframeContent = await this.iframeScope.contentFrame();
        
        if (!iframeContent) {
            console.error('[ERROR] Не удалось получить содержимое iframe');
            throw new Error('Unable to get iframe content');
        }

        const itemLocator = iframeContent.locator(`:text("${itemName}")`).first();
        await expect(itemLocator).toBeVisible({ timeout: 5000 });
        console.log(`[SUCCESS] ONLINE айтем "${itemName}" успешно найден и виден`);
    }

    async verifyItemNotVisible(itemName: string): Promise<void> {
        console.log(`[VERIFY] Проверяю отсутствие OFFLINE айтема: "${itemName}"`);
        
        await this.iframeScope.waitFor({ state: 'attached', timeout: 10000 });
        const iframeContent = await this.iframeScope.contentFrame();
        
        if (!iframeContent) {
            console.error('[ERROR] Не удалось получить содержимое iframe');
            throw new Error('Unable to get iframe content');
        }

        const itemLocator = iframeContent.locator(`:text("${itemName}")`).first();
        await expect(itemLocator).not.toBeVisible({ timeout: 5000 });
        
        // Дополнительная проверка
        const allItems = await iframeContent.locator('.result-item').allTextContents();
        if (allItems.some(text => text.includes(itemName))) {
            console.error(`[FAIL] OFFLINE айтем "${itemName}" найден в результатах поиска`);
            await this.page.screenshot({ path: 'error_offline_item_found.png' });
            throw new Error(`Offline item "${itemName}" was found in search results`);
        }
        
        console.log(`[SUCCESS] OFFLINE айтем "${itemName}" отсутствует, как и ожидалось`);
    }

    private async waitForActiveButton(): Promise<void> {
        await expect(this.searchButton).toBeEnabled();
        await expect(this.searchButton).not.toHaveClass(/ladda-loading/);
    }
}