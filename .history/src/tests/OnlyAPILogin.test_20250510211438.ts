import { test, expect } from '@playwright/test';

test.describe('API Tests', () => {
  let apiContext: APIRequestContext;

  test.beforeAll(async ({ playwright }) => {
    // Создаем отдельный контекст для API запросов
    apiContext = await playwright.request.newContext({
      baseURL: 'https://kmsqacm.lighthouse-cloud.com/kms/lh/api',
      extraHTTPHeaders: {
        'Accept': 'application/json'
      }
    });
  });

  test.afterAll(async () => {
    // Закрываем контекст после всех тестов
    await apiContext.dispose();
  });

  test('Login and get session info', async () => {
    // 1. Логин
    const loginResponse = await apiContext.post('/login?username=cm&password=cm');
    expect(loginResponse.ok()).toBeTruthy();
    
    const loginResponseBody = await loginResponse.json();
    expect(loginResponseBody).toEqual({
      status: 'SUCCESS',
      data: expect.any(String) // Или конкретное значение, например "vlad"
    });

    // 2. Проверка сессии
    const sessionResponse = await apiContext.get('/sessionInfo');
    expect(sessionResponse.ok()).toBeTruthy();
    
    const sessionResponseBody = await sessionResponse.json();
    expect(sessionResponseBody).toEqual({
      status: 'SUCCESS',
      data: {
        userId: 6,
        userFullName: 'Content Manager',
        username: 'cm'
      }
    });

    // 3. Детальная проверка данных пользователя
    expect(sessionResponseBody.data).toEqual({
      userId: 6,
      userFullName: 'Content Manager',
      username: 'cm'
    });
  });
});