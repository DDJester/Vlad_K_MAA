import { test, expect } from '../fixtures';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

test.describe('API Login Tests', () => {
  test('Full login flow with all checks', async ({ browser }) => {
    // ==================== 1. Подготовка ====================
    const {
      API_BASE_LOGIN_URL,
      DASHBOARD_URL,
      CM_USERNAME,
      CM_PASSWORD
    } = process.env;

    // Проверка переменных окружения
    if (!API_BASE_LOGIN_URL || !DASHBOARD_URL || !CM_USERNAME || !CM_PASSWORD) {
      throw new Error(`
        Missing environment variables!
        Required: API_BASE_LOGIN_URL, DASHBOARD_URL, CM_USERNAME, CM_PASSWORD
        Current values: ${JSON.stringify({
          API_BASE_LOGIN_URL,
          DASHBOARD_URL,
          CM_USERNAME: CM_USERNAME ? '***' : undefined,
          CM_PASSWORD: CM_PASSWORD ? '***' : undefined
        }, null, 2)}
      `);
    }

    // ==================== 2. API Login ====================
    const context = await browser.newContext();
    const request = context.request;

    console.log('Making login request to:', API_BASE_LOGIN_URL);
    const response = await request.post(API_BASE_LOGIN_URL, {
      form: { username: CM_USERNAME, password: CM_PASSWORD },
      headers: { 'Origin': new URL(DASHBOARD_URL).origin }
    });

    // Проверка статуса ответа
    if (response.status() !== 200) {
      const body = await response.text();
      throw new Error(`
        Login failed with status ${response.status()}
        Response body: ${body}
        Headers: ${JSON.stringify(response.headers(), null, 2)}
      `);
    }

    // Проверка структуры ответа
    const result = await response.json();
    if (!result || result.status !== "SUCCESS" || result.data !== "vlad") {
      throw new Error(`
        Invalid API response format!
        Expected: { status: "SUCCESS", data: "vlad" }
        Received: ${JSON.stringify(result, null, 2)}
      `);
    }

    // ==================== 3. Session Verification ====================
    const cookies = await context.cookies();
    console.log('Received cookies:', cookies);

    const sessionCookie = cookies.find(c => c.name.includes('SESSION'));
    if (!sessionCookie) {
      throw new Error(`
        No session cookie found after login!
        All cookies: ${JSON.stringify(cookies, null, 2)}
      `);
    }

    // ==================== 4. UI Check ====================
    const page = await context.newPage();
    
    console.log('Navigating to dashboard:', DASHBOARD_URL);
    const navigationResponse = await page.goto(DASHBOARD_URL, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Проверка загрузки страницы
    if (!navigationResponse || navigationResponse.status() >= 400) {
      throw new Error(`
        Dashboard loading failed with status: ${navigationResponse?.status()}
        Response: ${await navigationResponse?.text()}
      `);
    }

    // Проверка UI элементов
    const layoutButton = page.locator('#kms-login-to-layout-button');
    await expect(layoutButton).toBeVisible({ timeout: 15000 });

    // Дополнительная проверка URL
    await expect(page).toHaveURL(new RegExp(DASHBOARD_URL.replace(/\//g, '\\/')));

    console.log('TEST COMPLETED SUCCESSFULLY');
    
  });
});