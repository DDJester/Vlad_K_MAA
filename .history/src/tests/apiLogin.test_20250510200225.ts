import { test, expect } from '../fixtures';

test.describe('API Login Tests', () => {
  test('Successful login with valid credentials', async ({ loginPage }) => {
    const response = await loginPage.apiLogin('cm', 'cm');
    
    // Проверяем структуру ответа
    expect(response).toEqual({
      status: "SUCCESS",
      data: expect.any(String)
    });
    
    // Дополнительные проверки
    expect(response.status).toBe("SUCCESS");
    expect(response.data).toBe("vlad"); // или expect.stringContaining("vlad")
  });

  /*test('Login with invalid credentials should fail', async ({ loginPage }) => {
    await expect(async () => {
      await loginPage.apiLogin('invalid', 'invalid');
    }).rejects.toThrow('Login failed with status 401');
  }); */

  test('API login + UI verification', async ({ loginPage, dashboardPage, apiAuth }) => {
    // Авторизация через API (выполняется в фикстуре apiAuth)
    expect(apiAuth.token).toBeTruthy();
    
    // Переходим на UI и проверяем, что мы авторизованы
    await loginPage.navigateToLogin();
    
    // Если нужно передать API токен в UI (например через localStorage)
    /*await loginPage.page.evaluate((token) => {
      localStorage.setItem('authToken', token);
    }, apiAuth.token);*/
    
    // Проверяем элементы dashboard
    await expect(dashboardPage.createButton).toBeVisible();
  });
});