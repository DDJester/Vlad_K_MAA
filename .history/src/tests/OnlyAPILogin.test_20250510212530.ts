import { test, expect, APIRequestContext } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Загрузка .env с абсолютным путем
const envPath = path.join(__dirname, '../../.env');
dotenv.config({ path: envPath });

test.describe('API Authentication Tests', () => {
  let apiContext: APIRequestContext;

  test.beforeAll(async ({ playwright }) => {
    // Проверка обязательных переменных
    const requiredVars = ['BASE_URL', 'API_BASE_LOGIN_URL', 
                         'CM_USERNAME', 'CM_PASSWORD',
                         'CSR_USERNAME', 'CSR_PASSWORD'];
    
    for (const varName of requiredVars) {
      if (!process.env[varName]) {
        throw new Error(`Missing ${varName} in .env`);
      }
    }

    apiContext = await playwright.request.newContext({
      baseURL: process.env.BASE_URL,
      extraHTTPHeaders: {
        'Accept': 'application/json'
      }
    });
  });

  test.afterAll(async () => {
    if (apiContext) {
      await apiContext.dispose();
    }
  });

  const testLogin = async (userType: 'CM' | 'CSR', expectedName: string) => {
    const username = userType === 'CM' 
      ? process.env.CM_USERNAME
      : process.env.CSR_USERNAME;
    
    const password = userType === 'CM'
      ? process.env.CM_PASSWORD
      : process.env.CSR_PASSWORD;

    if (!username || !password) {
      throw new Error(`Missing credentials for ${userType} in .env`);
    }

    const response = await apiContext.post(process.env.API_BASE_LOGIN_URL!, {
      params: { username, password }
    });

    expect(response.status()).toBe(200);
    const result = await response.json();
    expect(result).toEqual({
      status: 'SUCCESS',
      data: expectedName
    });
  };

  test('CM User Login', async () => {
    await testLogin('CM', 'vlad');
  });

  test('CSR User Login', async () => {
    await testLogin('CSR', 'csr');
  });
});