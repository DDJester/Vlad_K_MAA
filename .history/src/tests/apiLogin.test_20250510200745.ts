import { test, expect } from '../fixtures';
import dotenv from 'dotenv';
import path from 'path';

// Загружаем переменные окружения из .env файла
dotenv.config({ path: path.join(__dirname, '../.env') });

test.describe('API Login Tests', () => {
  test('Successful login with valid credentials', async ({ loginPage }) => {
    // Получаем credentials из .env
    const username = process.env.CM_USERNAME;
    const password = process.env.CM_PASSWORD;

    if (!username || !password) {
      throw new Error('CM_USERNAME or CM_PASSWORD not defined in .env file');
    }

    // Выполняем API запрос
    const response = await loginPage.apiLogin(username, password);
    
    // Проверяем структуру ответа
    expect(response).toEqual({
      status: "SUCCESS",
      data: expect.any(String)
    });
    
    // Проверяем конкретные значения
    expect(response.status).toBe("SUCCESS");
    expect(response.data).toBe("vlad");
  });

  test('API login + UI verification', async ({ loginPage, dashboardPage }) => {
    // Получаем credentials из .env
    const username = process.env.CM_USERNAME;
    const password = process.env.CM_PASSWORD;

    // Выполняем API логин
   /* const { token } = await loginPage.apiLogin(username, password);
    expect(token).toBeTruthy();
    
    // Переходим на UI
    await loginPage.navigateToLogin();
    
    // Устанавливаем токен в localStorage для авторизации
    await loginPage.page.evaluate((t) => {
      localStorage.setItem('authToken', t);
    }, token);
    
    // Проверяем, что мы авторизованы
    await expect(dashboardPage.createButton).toBeVisible();*/
  });
});