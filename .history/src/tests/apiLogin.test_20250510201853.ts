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

  test('API login + UI verification', async ({ loginPage, dashboardPage, page }) => {
  // 1. API-логин (создаёт сессию)
  const { data: username } = await loginPage.apiLogin(
    process.env.CM_USERNAME!, 
    process.env.CM_PASSWORD!
  );

  // 2. Проверяем куки (для отладки)
  const cookies = await page.context().cookies();
  expect(cookies.some(c => c.name.includes('session'))).toBeTruthy();

  // 3. Переходим на UI (с теми же куки)
  await loginPage.navigateToLogin();

  // 4. Проверяем авторизацию
  await expect(dashboardPage.createButton).toBeVisible();
  
  // 5. Доп. проверка: имя пользователя в интерфейсе
  await expect(page.locator('.user-name')).toHaveText(username);
});
});