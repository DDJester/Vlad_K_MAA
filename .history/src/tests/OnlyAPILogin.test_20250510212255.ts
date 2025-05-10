import { test, expect, APIRequestContext } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// 1. Загрузка .env файла с абсолютным путём
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

// Проверка загрузки переменных (для отладки)
console.log('BASE_URL:', process.env.BASE_URL);
console.log('API_BASE_LOGIN_URL:', process.env.API_BASE_LOGIN_URL);

test.describe('API Authentication Tests', () => {
  let apiContext: APIRequestContext;

  test.beforeAll(async ({ playwright }) => {
    // 2. Проверка всех обязательных переменных
    const requiredEnvVars = {
      BASE_URL: process.env.BASE_URL,
      API_BASE_LOGIN_URL: process.env.API_BASE_LOGIN_URL,
      CM_USERNAME: process.env.CM_USERNAME,
      CM_PASSWORD: process.env.CM_PASSWORD,
      CSR_USERNAME: process.env.CSR_USERNAME,
      CSR_PASSWORD: process.env.CSR_PASSWORD
    };

    for (const [varName, value] of Object.entries(requiredEnvVars)) {
      if (!value) {
        throw new Error(`Missing ${varName} in .env file`);
      }
    }

    // 3. Инициализация API контекста
    apiContext = await playwright.request.newContext({
      baseURL: requiredEnvVars.BASE_URL,
      extraHTTPHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  });

  test.afterAll(async () => {
    // 4. Безопасное закрытие контекста
    if (apiContext) {
      await apiContext.dispose();
    }
  });

  const testLogin = async (username: string, expectedName: string) => {
    const response = await apiContext.post(process.env.API_BASE_LOGIN_URL!, {
      params: { username, password: process.env[`${username}_PASSWORD`] }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toEqual({
      status: 'SUCCESS',
      data: expectedName
    });
  };

  test('CM User Login', async () => {
    await testLogin('CM_USERNAME', 'vlad');
  });

  test('CSR User Login', async () => {
    await testLogin('CSR_USERNAME', 'csr');
  });
});