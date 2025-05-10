import { test, expect } from '../fixtures';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

test.describe('API Login Tests', () => {
  test('API login + UI verification', async ({ browser }) => {
    // 1. Получаем параметры из .env
    const {
      API_BASE_LOGIN_URL,
      DASHBOARD_URL,
      CM_USERNAME,
      CM_PASSWORD
    } = process.env;

    if (!API_BASE_LOGIN_URL || !DASHBOARD_URL || !CM_USERNAME || !CM_PASSWORD) {
      throw new Error('Missing required environment variables');
    }

    // 2. Создаём новый контекст с сохранением кук
    const context = await browser.newContext();
    const apiRequest = context.request;

    // 3. Делаем API-запрос (FormData - самый надёжный вариант)
    const response = await apiRequest.post(API_BASE_LOGIN_URL, {
      form: {
        username: CM_USERNAME,
        password: CM_PASSWORD
      },
      headers: {
        'Origin': new URL(DASHBOARD_URL).origin
      }
    });

    // 4. Проверяем ответ
    expect(response.status()).toBe(200);
    const result = await response.json();
    expect(result).toEqual({
      status: "SUCCESS",
      data: "vlad"
    });

    // 5. Получаем сессионные куки
    const cookies = await context.cookies();
    const sessionCookie = cookies.find(c => c.name.includes('SESSION'));
    if (!sessionCookie) {
      throw new Error('Session cookie not found after login');
    }

    // 6. Создаём UI-страницу с теми же куками
    const page = await context.newPage();
    
    // 7. Переходим на dashboard
    await page.goto(DASHBOARD_URL, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // 8. Проверяем успешную загрузку
    await expect(page.locator('#kms-login-to-layout-button')).toBeVisible({
      timeout: 15000
    });

    // 9. Дополнительная проверка URL
    await expect(page).toHaveURL(new RegExp(DASHBOARD_URL.replace(/\//g, '\\/')));
  });
});