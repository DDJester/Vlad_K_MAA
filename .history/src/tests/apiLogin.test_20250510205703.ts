import { test, expect } from '../fixtures';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

test.describe('API Login Tests', () => {
  test('Successful login with valid credentials', async ({ page }) => {
    const {
      API_BASE_LOGIN_URL,
      CM_USERNAME,
      CM_PASSWORD
    } = process.env;

    if (!API_BASE_LOGIN_URL || !CM_USERNAME || !CM_PASSWORD) {
      throw new Error('Missing required environment variables');
    }

    // Делаем запрос через page.request
    const response = await page.request.post(API_BASE_LOGIN_URL, {
      data: {
        username: CM_USERNAME,
        password: CM_PASSWORD
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
    const result = await response.json();
    expect(result).toEqual({
      status: "SUCCESS",
      data: "vlad"
    });
  });

  test('API login + UI verification', async ({ page }) => {
    const {
      API_BASE_LOGIN_URL,
      DASHBOARD_URL,
      CM_USERNAME,
      CM_PASSWORD
    } = process.env;

    if (!API_BASE_LOGIN_URL || !DASHBOARD_URL || !CM_USERNAME || !CM_PASSWORD) {
      throw new Error('Missing required environment variables');
    }

    // Тот же самый запрос, что и в первом тесте
    const response = await page.request.post(API_BASE_LOGIN_URL, {
      data: {
        username: CM_USERNAME,
        password: CM_PASSWORD
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
    const result = await response.json();
    expect(result).toEqual({
      status: "SUCCESS",
      data: "vlad"
    });

    // Проверяем UI
    await page.goto(DASHBOARD_URL);
    await expect(page.locator('#kms-login-to-layout-button')).toBeVisible({
      timeout: 10000
    });
  });
});