import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';
import { APIRequestContext } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Загрузка .env из кастомной папки
dotenv.config({ path: path.join(__dirname, '../../config/.env') });

export class LoginVlad extends BasePage {
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly submitButton: Locator;
  readonly layoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameField = page.locator('#login-username');
    this.passwordField = page.locator('#login-password');
    this.submitButton = page.locator('button[type="submit"]');
    this.layoutButton = page.locator('#kms-login-to-layout-button');
  }

  async apiLogin(username: string, password: string): Promise<{ status: string, data: string }> {
  if (!process.env.API_BASE_LOGIN_URL) {
    throw new Error('API_BASE_LOGIN_URL is not defined in .env');
  }

  const response = await this.page.request.post(`${process.env.API_BASE_LOGIN_URL}`, {
    params: { username, password }
  });

  if (response.status() !== 200) {
    throw new Error(`Login failed with status ${response.status()}`);
  }

  const responseBody = await response.json();
  
  // Проверяем ожидаемую структуру ответа
  if (!responseBody.status || !responseBody.data) {
    throw new Error(`Invalid login response format. Received: ${JSON.stringify(responseBody)}`);
  }

  return responseBody;
}
  async navigateToLogin(): Promise<void> {
    if (!process.env.BASE_URL || !process.env.LOGIN_URL) {
      console.error('Current working directory:', process.cwd());
      console.error('Environment variables:', process.env);
      throw new Error('BASE_URL or LOGIN_URL not defined. Check .env path and variables');
    }

    const fullUrl = `${process.env.BASE_URL}${process.env.LOGIN_URL}`;
    console.log('Navigating to:', fullUrl); // Для отладки
    await this.page.goto(fullUrl);
    await this.expectToBeVisible(this.usernameField);
  }

  async CSRLogin(): Promise<void> {
    if (!process.env.CSR_USERNAME || !process.env.CSR_PASSWORD) {
      throw new Error('CSR credentials not defined in .env');
    }

    await this.fill(this.usernameField, process.env.CSR_USERNAME);
    await this.fill(this.passwordField, process.env.CSR_PASSWORD);
    await this.click(this.submitButton);
    await this.expectUrl(`${process.env.BASE_URL}${process.env.DASHBOARD_URL}`);
    await this.expectToBeVisible(this.layoutButton);
  }

  async CMLogin(): Promise<void> {
    if (!process.env.CM_USERNAME || !process.env.CM_PASSWORD) {
      throw new Error('Admin credentials not defined in .env');
    }
    await this.fill(this.usernameField, process.env.CM_USERNAME);
    await this.fill(this.passwordField, process.env.CM_PASSWORD);
    await this.click(this.submitButton);
    await this.expectToBeVisible(this.layoutButton, 15000);
    //await this.page.waitForURL(/kms\/lh/);
    await this.expectUrl(`${process.env.DASHBOARD_URL}`);
    await this.expectToBeVisible(this.layoutButton);

  }

  async goToLayout(): Promise<void> {
    if (!process.env.LAYOUT_URL) {
      throw new Error('LAYOUT_URL not defined in .env');
    }
    await this.expectToBeEnabled(this.layoutButton);
    await this.click(this.layoutButton);
    await this.page.waitForLoadState('load');
    await this.expectUrl(/LAYOUT/);
  }
}