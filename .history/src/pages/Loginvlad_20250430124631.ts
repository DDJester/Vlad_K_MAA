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
    await this.page.goto('https://kmsqacm.lighthouse-cloud.com/');
    await this.expectToBeVisible(this.usernameField);
  }

  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameField, username);
    await this.fill(this.passwordField, password);
    await this.click(this.submitButton);
    await this.expectUrl('https://kmsqacm.lighthouse-cloud.com/kms/lh/');
    await this.expectToBeVisible(this.layoutButton);
  }

  async goToLayout(): Promise<void> {
    await this.click(this.layoutButton);
    await this.expectUrl(/LAYOUT/);
  }
}