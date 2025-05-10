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

    // Пробуем 3 варианта Content-Type
    const contentTypes = [
      'application/json',
      'application/x-www-form-urlencoded',
      'text/plain'
    ];

    let lastError;
    
    for (const contentType of contentTypes) {
      try {
        const data = contentType === 'application/json' 
          ? { username: CM_USERNAME, password: CM_PASSWORD }
          : `username=${CM_USERNAME}&password=${CM_PASSWORD}`;

        const response = await page.request.post(API_BASE_LOGIN_URL, {
          data,
          headers: { 'Content-Type': contentType }
        });

        expect(response.status()).toBe(200);
        const result = await response.json();
        expect(result).toEqual({
          status: "SUCCESS",
          data: "vlad"
        });
        return; // Успех - выходим из теста
        
      } catch (error) {
        lastError = error;
        console.log(`Failed with ${contentType}, trying next...`);
      }
    }
    
    throw lastError || new Error('All content types failed');
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

    // Пробуем оба основных формата
    const formats = [
      {
        contentType: 'application/json',
        data: { username: CM_USERNAME, password: CM_PASSWORD }
      },
      {
        contentType: 'application/x-www-form-urlencoded',
        data: `username=${CM_USERNAME}&password=${CM_PASSWORD}`
      }
    ];

    let lastError;
    
    for (const format of formats) {
      try {
        const response = await page.request.post(API_BASE_LOGIN_URL, {
          data: format.data,
          headers: { 'Content-Type': format.contentType }
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
        return; // Успех - выходим
        
      } catch (error) {
        lastError = error;
        console.log(`Failed with ${format.contentType}, trying next...`);
      }
    }
    
    throw lastError || new Error('All formats failed');
  });
});