# Test info

- Name: API Login Tests >> Successful login with valid credentials
- Location: M:\PlaywrightStuff\src\tests\apiLogin.test.ts:8:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 400
    at M:\PlaywrightStuff\src\tests\apiLogin.test.ts:30:31
```

# Test source

```ts
   1 | import { test, expect } from '../fixtures';
   2 | import dotenv from 'dotenv';
   3 | import path from 'path';
   4 |
   5 | dotenv.config({ path: path.join(__dirname, '../.env') });
   6 |
   7 | test.describe('API Login Tests', () => {
   8 |   test('Successful login with valid credentials', async ({ page }) => {
   9 |     const {
  10 |       API_BASE_LOGIN_URL,
  11 |       CM_USERNAME,
  12 |       CM_PASSWORD
  13 |     } = process.env;
  14 |
  15 |     if (!API_BASE_LOGIN_URL || !CM_USERNAME || !CM_PASSWORD) {
  16 |       throw new Error('Missing required environment variables');
  17 |     }
  18 |
  19 |     // Делаем запрос через page.request
  20 |     const response = await page.request.post(API_BASE_LOGIN_URL, {
  21 |       data: {
  22 |         username: CM_USERNAME,
  23 |         password: CM_PASSWORD
  24 |       },
  25 |       headers: {
  26 |         'Content-Type': 'application/json'
  27 |       }
  28 |     });
  29 |
> 30 |     expect(response.status()).toBe(200);
     |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  31 |     const result = await response.json();
  32 |     expect(result).toEqual({
  33 |       status: "SUCCESS",
  34 |       data: "vlad"
  35 |     });
  36 |   });
  37 |
  38 |   test('API login + UI verification', async ({ page }) => {
  39 |     const {
  40 |       API_BASE_LOGIN_URL,
  41 |       DASHBOARD_URL,
  42 |       CM_USERNAME,
  43 |       CM_PASSWORD
  44 |     } = process.env;
  45 |
  46 |     if (!API_BASE_LOGIN_URL || !DASHBOARD_URL || !CM_USERNAME || !CM_PASSWORD) {
  47 |       throw new Error('Missing required environment variables');
  48 |     }
  49 |
  50 |     // Тот же самый запрос, что и в первом тесте
  51 |     const response = await page.request.post(API_BASE_LOGIN_URL, {
  52 |       data: {
  53 |         username: CM_USERNAME,
  54 |         password: CM_PASSWORD
  55 |       },
  56 |       headers: {
  57 |         'Content-Type': 'application/json'
  58 |       }
  59 |     });
  60 |
  61 |     expect(response.status()).toBe(200);
  62 |     const result = await response.json();
  63 |     expect(result).toEqual({
  64 |       status: "SUCCESS",
  65 |       data: "vlad"
  66 |     });
  67 |
  68 |     // Проверяем UI
  69 |     await page.goto(DASHBOARD_URL);
  70 |     await expect(page.locator('#kms-login-to-layout-button')).toBeVisible({
  71 |       timeout: 10000
  72 |     });
  73 |   });
  74 | });
```