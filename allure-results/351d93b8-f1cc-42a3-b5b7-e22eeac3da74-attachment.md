# Test info

- Name: API Login Tests >> API login + UI verification
- Location: M:\PlaywrightStuff\src\tests\apiLogin.test.ts:56:7

# Error details

```
Error: expect(locator).toBeVisible()

Locator: locator('#kms-login-to-layout-button')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 10000ms
  - waiting for locator('#kms-login-to-layout-button')

    at M:\PlaywrightStuff\src\tests\apiLogin.test.ts:98:67
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
   19 |     // Пробуем 3 варианта Content-Type
   20 |     const contentTypes = [
   21 |       'application/json',
   22 |       'application/x-www-form-urlencoded',
   23 |       'text/plain'
   24 |     ];
   25 |
   26 |     let lastError;
   27 |     
   28 |     for (const contentType of contentTypes) {
   29 |       try {
   30 |         const data = contentType === 'application/json' 
   31 |           ? { username: CM_USERNAME, password: CM_PASSWORD }
   32 |           : `username=${CM_USERNAME}&password=${CM_PASSWORD}`;
   33 |
   34 |         const response = await page.request.post(API_BASE_LOGIN_URL, {
   35 |           data,
   36 |           headers: { 'Content-Type': contentType }
   37 |         });
   38 |
   39 |         expect(response.status()).toBe(200);
   40 |         const result = await response.json();
   41 |         expect(result).toEqual({
   42 |           status: "SUCCESS",
   43 |           data: "vlad"
   44 |         });
   45 |         return; // Успех - выходим из теста
   46 |         
   47 |       } catch (error) {
   48 |         lastError = error;
   49 |         console.log(`Failed with ${contentType}, trying next...`);
   50 |       }
   51 |     }
   52 |     
   53 |     throw lastError || new Error('All content types failed');
   54 |   });
   55 |
   56 |   test('API login + UI verification', async ({ page }) => {
   57 |     const {
   58 |       API_BASE_LOGIN_URL,
   59 |       DASHBOARD_URL,
   60 |       CM_USERNAME,
   61 |       CM_PASSWORD
   62 |     } = process.env;
   63 |
   64 |     if (!API_BASE_LOGIN_URL || !DASHBOARD_URL || !CM_USERNAME || !CM_PASSWORD) {
   65 |       throw new Error('Missing required environment variables');
   66 |     }
   67 |
   68 |     // Пробуем оба основных формата
   69 |     const formats = [
   70 |       {
   71 |         contentType: 'application/json',
   72 |         data: { username: CM_USERNAME, password: CM_PASSWORD }
   73 |       },
   74 |       {
   75 |         contentType: 'application/x-www-form-urlencoded',
   76 |         data: `username=${CM_USERNAME}&password=${CM_PASSWORD}`
   77 |       }
   78 |     ];
   79 |
   80 |     let lastError;
   81 |     
   82 |     for (const format of formats) {
   83 |       try {
   84 |         const response = await page.request.post(API_BASE_LOGIN_URL, {
   85 |           data: format.data,
   86 |           headers: { 'Content-Type': format.contentType }
   87 |         });
   88 |
   89 |         expect(response.status()).toBe(200);
   90 |         const result = await response.json();
   91 |         expect(result).toEqual({
   92 |           status: "SUCCESS",
   93 |           data: "vlad"
   94 |         });
   95 |
   96 |         // Проверяем UI
   97 |         await page.goto(DASHBOARD_URL);
>  98 |         await expect(page.locator('#kms-login-to-layout-button')).toBeVisible({
      |                                                                   ^ Error: expect(locator).toBeVisible()
   99 |           timeout: 10000
  100 |         });
  101 |         return; // Успех - выходим
  102 |         
  103 |       } catch (error) {
  104 |         lastError = error;
  105 |         console.log(`Failed with ${format.contentType}, trying next...`);
  106 |       }
  107 |     }
  108 |     
  109 |     throw lastError || new Error('All formats failed');
  110 |   });
  111 | });
```