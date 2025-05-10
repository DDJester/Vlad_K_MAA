import { test as baseTest } from '@playwright/test';
import { LoginVlad } from 'src/pages/Loginvlad';
import { DashboardPage } from 'src/pages/DashboardPage';

export const test = baseTest.extend<{
  loginPage: LoginVlad;
  dashboardPage: DashboardPage;
}>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginVlad(page);
    await use(loginPage);
  },
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
});