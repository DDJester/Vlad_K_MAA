import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Загружаем переменные окружения
dotenv.config({ path: path.join(__dirname, '../.env') });

test.describe('API Authentication Tests', () => {
  let apiContext: APIRequestContext;

  test.beforeAll(async ({ playwright }) => {
    // Инициализация API контекста
    apiContext = await playwright.request.newContext({
      baseURL: process.env.BASE_URL,
      extraHTTPHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test('CM User Login and Session Verification', async () => {
    // 1. API Login
    const loginResponse = await apiContext.post(process.env.API_BASE_LOGIN_URL!, {
      params: {
        username: process.env.CM_USERNAME,
        password: process.env.CM_PASSWORD
      }
    });

    // Проверка ответа логина
    expect(loginResponse.status()).toBe(200);
    const loginData = await loginResponse.json();
    expect(loginData).toEqual({
      status: 'SUCCESS',
      data: 'vlad' // Или ожидаемое имя пользователя
    });

    // 2. Проверка сессии
    const sessionResponse = await apiContext.get('/kms/lh/api/sessionInfo');
    expect(sessionResponse.status()).toBe(200);
    
    const sessionData = await sessionResponse.json();
    expect(sessionData).toEqual({
      status: 'SUCCESS',
      data: {
        userId: expect.any(Number),
        userFullName: expect.any(String),
        username: process.env.CM_USERNAME
      }
    });
  });

  test('CSR User Login and Session Verification', async () => {
    // 1. API Login
    const loginResponse = await apiContext.post(process.env.API_BASE_LOGIN_URL!, {
      params: {
        username: process.env.CSR_USERNAME,
        password: process.env.CSR_PASSWORD
      }
    });

    // Проверка ответа логина
    expect(loginResponse.status()).toBe(200);
    const loginData = await loginResponse.json();
    expect(loginData).toEqual({
      status: 'SUCCESS',
      data: 'vlad' // Или ожидаемое имя пользователя для CSR
    });

    // 2. Проверка сессии
    const sessionResponse = await apiContext.get('/kms/lh/api/sessionInfo');
    expect(sessionResponse.status()).toBe(200);
    
    const sessionData = await sessionResponse.json();
    expect(sessionData).toEqual({
      status: 'SUCCESS',
      data: {
        userId: expect.any(Number),
        userFullName: expect.any(String),
        username: process.env.CSR_USERNAME
      }
    });
  });
});