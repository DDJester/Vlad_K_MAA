import { test, expect, APIRequestContext } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Загрузка переменных окружения
dotenv.config({ path: path.join(__dirname, '../.env') });

// Интерфейсы для типизации ответов
interface LoginResponse {
  status: string;
  data: string;
}

interface SessionInfo {
  status: string;
  data: {
    userId: number;
    userFullName: string;
    username: string;
  };
}

test.describe('API Authentication Tests', () => {
  let apiContext: APIRequestContext;

  test.beforeAll(async ({ playwright }) => {
    // Проверка обязательных переменных окружения
    const BASE_URL = process.env.BASE_URL;
    if (!BASE_URL) throw new Error('BASE_URL is not defined in .env');
    
    apiContext = await playwright.request.newContext({
      baseURL: BASE_URL,
      extraHTTPHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  const testLogin = async (username: string, password: string) => {
    if (!username || !password) {
      throw new Error('Username and password must be defined');
    }

    const API_BASE_LOGIN_URL = process.env.API_BASE_LOGIN_URL;
    if (!API_BASE_LOGIN_URL) throw new Error('API_BASE_LOGIN_URL is not defined');

    // 1. API Login
    const loginResponse = await apiContext.post(API_BASE_LOGIN_URL, {
      params: { username, password }
    });

    // Проверка ответа
    expect(loginResponse.status()).toBe(200);
    const loginData = await loginResponse.json() as LoginResponse;
    expect(loginData).toEqual({
      status: 'SUCCESS',
      data: username === process.env.CM_USERNAME ? 'vlad' : 'csr'
    });

    // 2. Проверка сессии
    const sessionResponse = await apiContext.get('/kms/lh/api/sessionInfo');
    expect(sessionResponse.status()).toBe(200);
    
    const sessionData = await sessionResponse.json() as SessionInfo;
    expect(sessionData.data.username).toBe(username);
  };

  test('CM User Login', async () => {
    const { CM_USERNAME, CM_PASSWORD } = process.env;
    await testLogin(CM_USERNAME!, CM_PASSWORD!);
  });

  test('CSR User Login', async () => {
    const { CSR_USERNAME, CSR_PASSWORD } = process.env;
    await testLogin(CSR_USERNAME!, CSR_PASSWORD!);
  });
});