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

  test('API login + UI verification', async ({ page }) => {
  // 1. Получаем конфигурацию
  const {
    BASE_URL,
    API_LOGIN_PATH,
    UI_DASHBOARD_PATH,
    CM_USERNAME,
    CM_PASSWORD
  } = process.env;

  if (!BASE_URL || !CM_USERNAME || !CM_PASSWORD) {
    throw new Error('Missing required environment variables');
  }

  // 2. API-логин
  const apiResponse = await page.request.post(`${BASE_URL}${API_LOGIN_PATH}`, {
    data: { username: CM_USERNAME, password: CM_PASSWORD },
    headers: { 'Content-Type': 'application/json' }
  });

  // 3. Проверка ответа
  expect(apiResponse.status()).toBe(200);
  const { status, data } = await apiResponse.json();
  expect(status).toBe("SUCCESS");
  expect(data).toBe(CM_USERNAME); // Используем CM_USERNAME для проверки

  // 4. Переход на UI
  await page.goto(`${BASE_URL}${UI_DASHBOARD_PATH}`);
  
  // 5. Проверка элементов
  await expect(page.locator('#kms-login-to-layout-button')).toBeVisible();
  await expect(page.locator('.user-name')).toHaveText(CM_USERNAME);
});
});