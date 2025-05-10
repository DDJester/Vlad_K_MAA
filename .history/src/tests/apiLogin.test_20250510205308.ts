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
  // 1. Получаем параметры из .env
  const {
    API_BASE_LOGIN_URL,
    DASHBOARD_URL,
    CM_USERNAME,
    CM_PASSWORD
  } = process.env;

  // 2. Проверяем наличие всех переменных
  if (!API_BASE_LOGIN_URL || !CM_USERNAME || !CM_PASSWORD || !DASHBOARD_URL) {
    throw new Error('Missing required environment variables');
  }

  // 3. Делаем API-запрос (простая версия без лишних проверок)
  const response = await page.request.post(API_BASE_LOGIN_URL!, {
    data: {
      username: CM_USERNAME,
      password: CM_PASSWORD
    },
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // 4. Базовая проверка ответа
  expect(response.status()).toBe(200);
  const result = await response.json();
  expect(result).toEqual({ status: "SUCCESS", data: "vlad" });

  // 5. Проверяем UI
  await page.goto(DASHBOARD_URL!);
  await expect(page.locator('#kms-login-to-layout-button')).toBeVisible();
});
});