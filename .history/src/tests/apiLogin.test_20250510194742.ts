import { test, expect } from '../fixtures';

test.describe('API Login Tests', () => {
  test('Successful login with valid credentials', async ({ loginPage }) => {
    const credentials = {
      username: process.env.CM_USERNAME || 'cm',
      password: process.env.CM_PASSWORD || 'cm'
    };

    const authData = await loginPage.apiLogin(credentials.username, credentials.password);
    
    expect(authData.token).toBeTruthy();
    expect(authData.userId).toBeTruthy();
    expect(authData.token.length).toBeGreaterThan(30); // Проверяем, что токен достаточно длинный
  });

  test('Login with invalid credentials should fail', async ({ loginPage }) => {
    await expect(async () => {
      await loginPage.apiLogin('invalid', 'invalid');
    }).rejects.toThrow('Login failed with status 401');
  });

  test('API login + UI verification', async ({ loginPage, dashboardPage, apiAuth }) => {
    // Авторизация через API (выполняется в фикстуре apiAuth)
    expect(apiAuth.token).toBeTruthy();
    
    // Переходим на UI и проверяем, что мы авторизованы
    await loginPage.navigateToLogin();
    
    // Если нужно передать API токен в UI (например через localStorage)
    await loginPage.page.evaluate((token) => {
      localStorage.setItem('authToken', token);
    }, apiAuth.token);
    
    // Проверяем элементы dashboard
    await expect(dashboardPage.createButton).toBeVisible();
  });
});