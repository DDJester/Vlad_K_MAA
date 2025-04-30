import { Page, Locator, expect } from '@playwright/test';

export class CSRSearchPage {
    readonly page: Page;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly iframeScope: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.searchInput = page.locator('#search-input');
        this.searchButton = page.locator('.search-box__submit.ladda-button');
        this.iframeScope = page.locator('iframe[name="itemscope"]');
    }
    
    async searchWithWait(query: string): Promise<void> {
        // 1. Perform search in main window
        await this.searchInput.fill('');
        await this.searchInput.type(query, { delay: 100 });
        await this.waitForActiveButton();
        await this.searchButton.click();
        
        // 2. Wait for iframe to be ready
        await this.iframeScope.waitFor({ state: 'attached', timeout: 15000 });
    }

    async verifyItemVisible(itemName: string): Promise<void> {
        // Get the iframe content
        const iFrameContent = await this.iframeScope.contentFrame();
        if (!iFrameContent) throw new Error('Iframe content not found');
        
        // Search within iframe
        const itemLocator = iFrameContent.locator(`.result-title-caption h3:has-text("${itemName}")`);
        await expect(itemLocator).toBeVisible({ timeout: 10000 });
    }

    async verifyItemNotVisible(itemName: string): Promise<void> {
        const iFrameContent = await this.iframeScope.contentFrame();
        if (!iFrameContent) throw new Error('Iframe content not found');
        
        const itemLocator = iFrameContent.locator(`.result-title-caption h3:has-text("${itemName}")`);
        await expect(itemLocator).not.toBeVisible({ timeout: 10000 });
        
        // Additional verification
        const allItems = await iFrameContent.locator('.result-title-caption h3').allTextContents();
        if (allItems.some(text => text.includes(itemName))) {
            await this.page.screenshot({ path: 'error_item_found.png' });
            throw new Error(`Item "${itemName}" was found in search results`);
        }
    }

    private async waitForActiveButton(): Promise<void> {
        await expect(this.searchButton).toBeEnabled();
        await expect(this.searchButton).not.toHaveClass(/ladda-loading/);
    }
}