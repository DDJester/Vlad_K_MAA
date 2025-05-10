# Test info

- Name: API Tests >> Login and get session info
- Location: M:\PlaywrightStuff\src\tests\OnlyAPILogin.test.ts:21:7

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
    at M:\PlaywrightStuff\src\tests\OnlyAPILogin.test.ts:24:32
```

# Test source

```ts
   1 | import { test, expect, APIRequestContext } from '@playwright/test';
   2 |
   3 | test.describe('API Tests', () => {
   4 |   let apiContext: APIRequestContext;
   5 |
   6 |   test.beforeAll(async ({ playwright }) => {
   7 |     // Создаем отдельный контекст для API запросов
   8 |     apiContext = await playwright.request.newContext({
   9 |       baseURL: 'https://kmsqacm.lighthouse-cloud.com/kms/lh/api',
  10 |       extraHTTPHeaders: {
  11 |         'Accept': 'application/json'
  12 |       }
  13 |     });
  14 |   });
  15 |
  16 |   test.afterAll(async () => {
  17 |     // Закрываем контекст после всех тестов
  18 |     await apiContext.dispose();
  19 |   });
  20 |
  21 |   test('Login and get session info', async () => {
  22 |     // 1. Логин
  23 |     const loginResponse = await apiContext.post('/login?username=cm&password=cm');
> 24 |     expect(loginResponse.ok()).toBeTruthy();
     |                                ^ Error: expect(received).toBeTruthy()
  25 |     
  26 |     const loginResponseBody = await loginResponse.json();
  27 |     expect(loginResponseBody).toEqual({
  28 |       status: 'SUCCESS',
  29 |       data: expect.any(String) // Или конкретное значение, например "vlad"
  30 |     });
  31 |
  32 |     // 2. Проверка сессии
  33 |     const sessionResponse = await apiContext.get('/sessionInfo');
  34 |     expect(sessionResponse.ok()).toBeTruthy();
  35 |     
  36 |     const sessionResponseBody = await sessionResponse.json();
  37 |     expect(sessionResponseBody).toEqual({
  38 |       status: 'SUCCESS',
  39 |       data: {
  40 |         userId: 6,
  41 |         userFullName: 'Content Manager',
  42 |         username: 'cm'
  43 |       }
  44 |     });
  45 |
  46 |     // 3. Детальная проверка данных пользователя
  47 |     expect(sessionResponseBody.data).toEqual({
  48 |       userId: 6,
  49 |       userFullName: 'Content Manager',
  50 |       username: 'cm'
  51 |     });
  52 |   });
  53 | });
```