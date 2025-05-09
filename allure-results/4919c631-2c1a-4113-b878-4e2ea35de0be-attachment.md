# Test info

- Name: Verify image adding to an item
- Location: M:\PlaywrightStuff\src\tests\filemanager.test.ts:7:5

# Error details

```
Error: page.waitForNavigation: Target page, context or browser has been closed
=========================== logs ===========================
waiting for navigation until "load"
  navigated to "https://kmsqacm.lighthouse-cloud.com/kms/CM/INTERNAL/LAYOUT?item_id=4"
  "domcontentloaded" event fired
============================================================
    at LoginVlad.goToLayout (M:\PlaywrightStuff\src\pages\Loginvlad.ts:70:17)
    at M:\PlaywrightStuff\src\tests\filemanager.test.ts:15:5
```

# Test source

```ts
   1 | import { Page, Locator } from '@playwright/test';
   2 | import { BasePage } from './basePage';
   3 | import dotenv from 'dotenv';
   4 | import path from 'path';
   5 |
   6 | // Загрузка .env из кастомной папки
   7 | dotenv.config({ path: path.join(__dirname, '../../config/.env') });
   8 |
   9 | export class LoginVlad extends BasePage {
  10 |   readonly usernameField: Locator;
  11 |   readonly passwordField: Locator;
  12 |   readonly submitButton: Locator;
  13 |   readonly layoutButton: Locator;
  14 |
  15 |   constructor(page: Page) {
  16 |     super(page);
  17 |     this.usernameField = page.locator('#login-username');
  18 |     this.passwordField = page.locator('#login-password');
  19 |     this.submitButton = page.locator('button[type="submit"]');
  20 |     this.layoutButton = page.locator('#kms-login-to-layout-button');
  21 |   }
  22 |
  23 |   async navigateToLogin(): Promise<void> {
  24 |     if (!process.env.BASE_URL || !process.env.LOGIN_URL) {
  25 |       console.error('Current working directory:', process.cwd());
  26 |       console.error('Environment variables:', process.env);
  27 |       throw new Error('BASE_URL or LOGIN_URL not defined. Check .env path and variables');
  28 |     }
  29 |
  30 |     const fullUrl = `${process.env.BASE_URL}${process.env.LOGIN_URL}`;
  31 |     console.log('Navigating to:', fullUrl); // Для отладки
  32 |     await this.page.goto(fullUrl);
  33 |     await this.expectToBeVisible(this.usernameField);
  34 |   }
  35 |
  36 |   async CSRLogin(): Promise<void> {
  37 |     if (!process.env.CSR_USERNAME || !process.env.CSR_PASSWORD) {
  38 |       throw new Error('CSR credentials not defined in .env');
  39 |     }
  40 |
  41 |     await this.fill(this.usernameField, process.env.CSR_USERNAME);
  42 |     await this.fill(this.passwordField, process.env.CSR_PASSWORD);
  43 |     await this.click(this.submitButton);
  44 |     await this.expectUrl(`${process.env.BASE_URL}${process.env.DASHBOARD_URL}`);
  45 |     await this.expectToBeVisible(this.layoutButton);
  46 |   }
  47 |
  48 |   async CMLogin(): Promise<void> {
  49 |     if (!process.env.CM_USERNAME || !process.env.CM_PASSWORD) {
  50 |       throw new Error('Admin credentials not defined in .env');
  51 |     }
  52 |     await this.fill(this.usernameField, process.env.CM_USERNAME);
  53 |     await this.fill(this.passwordField, process.env.CM_PASSWORD);
  54 |     await this.click(this.submitButton);
  55 |     await this.expectToBeVisible(this.layoutButton, 15000);
  56 |     //await this.page.waitForURL(/kms\/lh/);
  57 |     await this.expectUrl(`${process.env.BASE_URL}${process.env.DASHBOARD_URL}`);
  58 |     await this.expectToBeVisible(this.layoutButton);
  59 |
  60 |   }
  61 |
  62 |   async goToLayout(): Promise<void> {
  63 |     if (!process.env.LAYOUT_URL) {
  64 |       throw new Error('LAYOUT_URL not defined in .env');
  65 |     }
  66 |
  67 |     await this.expectToBeVisible(this.layoutButton, 15000);
  68 |     await this.expectToBeEnabled(this.layoutButton);
  69 |     await Promise.all([
> 70 |       this.page.waitForNavigation({ waitUntil: 'load' }),
     |                 ^ Error: page.waitForNavigation: Target page, context or browser has been closed
  71 |       this.click(this.layoutButton)
  72 |     ]);
  73 |     await this.expectUrl(/LAYOUT/);
  74 |   }
  75 | }
```