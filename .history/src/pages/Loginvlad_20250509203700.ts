import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';
import 'dotenv/config';

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

  async navigateToLogin(): Promise<void> {
    if (!process.env.BASE_URL || !process.env.LOGIN_URL) {
      throw new Error('BASE_URL or LOGIN_URL not defined in .env');
    }
    await this.page.goto(`${process.env.BASE_URL}${process.env.LOGIN_URL}`);
    await this.expectToBeVisible(this.usernameField);
  }

  async csrLogin(): Promise<void> {
    if (!process.env.CSR_USERNAME || !process.env.CSR_PASSWORD) {
      throw new Error('CSR credentials not defined in .env');
    }

    await this.fill(this.usernameField, process.env.CSR_USERNAME);
    await this.fill(this.passwordField, process.env.CSR_PASSWORD);
    await this.click(this.submitButton);
    await this.expectUrl(`${process.env.BASE_URL}${process.env.DASHBOARD_URL}`);
    await this.expectToBeVisible(this.layoutButton);
  }

  async CMlogin(): Promise<void> {
    if (!process.env.CM_USERNAME || !process.env.CM_PASSWORD) {
      throw new Error('Admin credentials not defined in .env');
    }
    await this.fill(this.usernameField, process.env.CM_USERNAME);
    await this.fill(this.passwordField, process.env.CM_PASSWORD);
    await this.click(this.submitButton);
    await this.expectUrl(`${process.env.BASE_URL}${process.env.DASHBOARD_URL}`);
    await this.expectToBeVisible(this.layoutButton);
  }

  async goToLayout(): Promise<void> {
    if (!process.env.LAYOUT_URL) {
      throw new Error('LAYOUT_URL not defined in .env');
    }
    await this.click(this.layoutButton);
    await this.expectUrl(new RegExp(process.env.LAYOUT_URL));
  }
}