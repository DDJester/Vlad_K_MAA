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

  test('API login + UI verification', async ({ page, dashboardPage }) => {
  // 1. Получаем credentials
  const username = process.env.CM_USERNAME;
  const password = process.env.CM_PASSWORD;
  
  // 2. Делаем API-запрос ЧЕРЕЗ БРАУЗЕРНЫЙ КОНТЕКСТ
  const apiResponse = await page.request.post(`${process.env.API_BASE_URL}/api/login`, {
    data: { username, password }
  });
  
  expect(apiResponse.status()).toBe(200);
  const { data } = await apiResponse.json();
  expect(data).toBe("vlad");

  // 3. Куки автоматически сохранились в контексте браузера!
  await page.goto(`${process.env.UI_BASE_URL}/dashboard`);
  await expect(dashboardPage.createButton).toBeVisible();
});
});