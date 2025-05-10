# Test info

- Name: Verify item visibility in CSR search
- Location: M:\PlaywrightStuff\src\tests\search.test.ts:9:5

# Error details

```
Error: expect(locator).toBeVisible()

Locator: locator('iframe[name="itemscope"]').contentFrame().locator('.result-title-caption h3:has-text("Vlad Online Item 1746882305480")')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 10000ms
  - waiting for locator('iframe[name="itemscope"]').contentFrame().locator('.result-title-caption h3:has-text("Vlad Online Item 1746882305480")')

    at CSRSearchPage.verifyItemVisible (M:\PlaywrightStuff\src\pages\CSRSearchPage.ts:37:39)
    at M:\PlaywrightStuff\src\tests\search.test.ts:53:29
    at M:\PlaywrightStuff\src\tests\search.test.ts:50:5
```

# Page snapshot

```yaml
- status
- banner:
  - link "Skip To Main Content":
    - /url: "#"
  - button "Content World Menu":
    - img
  - link "Go to the home page":
    - img: 
  - list "Main menu":
    - listitem:
      - link "Exams & Surveys":
        - /url: "#"
    - listitem:
      - link "Compare":
        - /url: "#"
    - listitem:
      - link "Forum":
        - /url: "#"
    - listitem:
      - link "Utilities":
        - /url: "#"
    - listitem:
      - link "Glossary":
        - /url: "#"
    - listitem:
      - link "Request item":
        - /url: "#"
    - listitem:
      - link:
        - /url: "#"
        - img: 
  - list "Tools Menu":
    - listitem:
      - button "Toggle Accessibility Toolbar":
        - img: 
    - listitem:
      - button "Recent Items":
        - img: 
    - listitem:
      - button "Basket":
        - img: 
    - listitem:
      - button "Favorites":
        - img: 
    - listitem:
      - button "Inbox Notifications":
        - img: 
        - text: "54"
    - listitem:
      - button "csr csr "
- banner "Go to the home page"
- search:
  - img: 
  - searchbox "Add search words": Vlad
  - button "Clear":
    - img "Clear": 
  - text: English
  - img
  - button "Search":
    - img "Go": 
    - progressbar
- link "Company's Web Site":
  - /url: http://www.kmslh.com
- main:
  - iframe
- button "Accessibility Declaration":  Accessibility Declaration
- group:
  - listitem "Preview":
    - button "Preview":
      - img: 
  - listitem "Request new version":
    - button "Request new version":
      - img: 
  - listitem "Copy Link":
    - button "Copy Link":
      - img: 
  - listitem:
    - button "Item Info":
      - img "Item Info": 
  - listitem "Add to Basket":
    - button "Add to Basket":
      - img: 
  - listitem "Add to Favorites":
    - button "Add to Favorites":
      - img: 
  - listitem "Write Feedback":
    - button "Write Feedback":
      - img: 
  - listitem "Share":
    - button "Share":
      - img: 
  - listitem "Search in Text":
    - button "Search in Text":
      - img: 
- contentinfo: © 2025 KMS Lighthouse Ltd
- contentinfo:
  - img: 
- status
```

# Test source

```ts
   1 | import { Page, Locator, FrameLocator, expect } from '@playwright/test';
   2 |
   3 | export class CSRSearchPage {
   4 |     readonly page: Page;
   5 |     readonly searchInput: Locator;
   6 |     readonly searchButton: Locator;
   7 |     readonly iframeScope: FrameLocator;
   8 |
   9 |     constructor(page: Page) {
  10 |         this.page = page;
  11 |         this.searchInput = page.locator('#search-input');
  12 |         this.searchButton = page.locator('.search-box__submit.ladda-button');
  13 |         this.iframeScope = page.frameLocator('iframe[name="itemscope"]');
  14 |     }
  15 |
  16 |     async searchWithWait(query: string): Promise<void> {
  17 |         // Очищаем поле и вводим запрос с задержкой
  18 |         await this.searchInput.fill('');
  19 |         await this.searchInput.type(query, { delay: 100 });
  20 |
  21 |         // Ждем активации кнопки
  22 |         await this.waitForActiveButton();
  23 |
  24 |         // Кликаем и ждем загрузки
  25 |         await this.searchButton.click();
  26 |         await this.page.waitForTimeout(1000); // Краткая пауза для стабилизации
  27 |     }
  28 |
  29 |     async verifyItemVisible(itemName: string): Promise<void> {
  30 |
  31 |         // Ищем элемент в iframe с несколькими попытками
  32 |         const maxAttempts = 3;
  33 |         for (let attempt = 1; attempt <= maxAttempts; attempt++) {
  34 |
  35 |             console.log(`Attempt ${attempt} to find item "${itemName}"`);
  36 |             const itemLocator = this.iframeScope.locator(`.result-title-caption h3:has-text("${itemName}")`);
> 37 |             await expect(itemLocator).toBeVisible({ timeout: 10000 });
     |                                       ^ Error: expect(locator).toBeVisible()
  38 |             console.log(`Item "${itemName}" found and visible`);
  39 |             return;
  40 |
  41 |         }
  42 |
  43 |     }
  44 |
  45 |     async verifyItemNotVisible(itemName: string): Promise<void> {
  46 |
  47 |         const itemLocator = this.iframeScope.locator(`.result-title-caption h3:has-text("${itemName}")`);
  48 |         await expect(itemLocator).not.toBeVisible({ timeout: 8000 });
  49 |
  50 |         // Дополнительная проверка
  51 |         const allItems = await this.iframeScope.locator('.result-title-caption h3').allTextContents();
  52 |         if (allItems.some(text => text.includes(itemName))) {
  53 |             throw new Error(`Item "${itemName}" was found in results`);
  54 |         }
  55 |
  56 |     }
  57 |
  58 |     private async waitForActiveButton(): Promise<void> {
  59 |         await expect(this.searchButton).toBeEnabled();
  60 |         await expect(this.searchButton).not.toHaveClass(/ladda-loading/);
  61 |     }
  62 | }
```