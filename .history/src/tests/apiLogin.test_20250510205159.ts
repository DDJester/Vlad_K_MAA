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

  test('API login + UI check', async ({ page }) => {
  // 1. Конфигурация из .env
  const API_URL = 'https://kmsqacm.lighthouse-cloud.com/kms/lh/api/login';
  const { CM_USERNAME, CM_PASSWORD } = process.env;

  // 2. Делаем простой POST-запрос
  const response = await page.request.post(API_URL, {
    data: {
      username: CM_USERNAME,
      password: CM_PASSWORD
    },
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // 3. Проверяем успешный ответ
  expect(response.status()).toBe(200);
  const result = await response.json();
  expect(result).toEqual({ status: "SUCCESS", data: "vlad" });

  // 4. Проверяем UI (куки уже сохранены)
  await page.goto('https://kmsqacm.lighthouse-cloud.com/kms/lh');
  await expect(page.locator('#kms-login-to-layout-button')).toBeVisible();
});
});