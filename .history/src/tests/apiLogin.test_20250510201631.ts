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
  // 1. Берём credentials из .env
  const username = process.env.CM_USERNAME;
  const password = process.env.CM_PASSWORD;
  
  if (!username || !password) {
    throw new Error('Add CM_USERNAME and CM_PASSWORD to .env');
  }

  // 2. Делаем API-логин (получаем имя пользователя)
  const response = await loginPage.apiLogin(username, password);
  expect(response.status).toBe("SUCCESS");
  expect(response.data).toBe("vlad"); // Проверяем, что сервер узнал пользователя

  // 3. Переходим на UI (сессия должна быть создана автоматически)
  await loginPage.navigateToLogin();

  // 4. Проверяем авторизацию через UI элементы
  await expect(dashboardPage.createButton).toBeVisible();
  
  // Дополнительно: проверяем отображение имени пользователя (если есть)
  const userProfileName = loginPage.page.locator('.user-profile-name');
  if (await userProfileName.isVisible()) {
    await expect(userProfileName).toHaveText(response.data); // "vlad"
  }
});
});