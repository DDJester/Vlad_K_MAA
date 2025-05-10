import { test as baseTest, Page, Browser } from '@playwright/test';
import { LoginVlad } from 'src/pages/Loginvlad';
import { DashboardPage } from 'src/pages/DashboardPage';
import { ItemPage } from 'src/pages/ItemPage';
import { CSRSearchPage } from 'src/pages/CSRSearchPage';
import 'dotenv/config';

export const test = baseTest.extend<{
  // Страницы
  loginPage: LoginVlad;
  dashboardPage: DashboardPage;
  itemPage: ItemPage;
  csrSearchPage: CSRSearchPage;

  createCSRContext: {
    page: Page;
    csrSearchPage: CSRSearchPage;
  };

  // Авторизация
  authCM: void; // Фикстура для входа как CM
  authCSR: void; // Фикстура для входа как CSR

  // CSR-контекст (для тестов с двумя браузерами)
  csrContext: {
    page: Page;
    csrSearchPage: CSRSearchPage;
  };
}>({
  // Инициализация страниц
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginVlad(page);
    await use(loginPage);
  },
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
  itemPage: async ({ page }, use) => {
    const itemPage = new ItemPage(page);
    await use(itemPage);
  },
  csrSearchPage: async ({ page }, use) => {
    const csrSearchPage = new CSRSearchPage(page);
    await use(csrSearchPage);
  },

  // Фикстура для входа как CM
  authCM: async ({ loginPage, page }, use) => {
    await loginPage.navigateToLogin();
    await loginPage.CMLogin();
    await loginPage.goToLayout();
    await use(); // Тест начнётся после авторизации
  },

  // Фикстура для входа как CSR
  authCSR: async ({ loginPage, page }, use) => {
    await loginPage.navigateToLogin();
    await loginPage.CSRLogin();
    await loginPage.goToLayout();
    await use();
  },

  // Фикстура для CSR-контекста (отдельный браузер)
  createCSRContext: async ({ browser }, use) => {
    // Эта функция будет вызываться только когда тест явно запросит контекст
    const createContext = async () => {
      const context = await browser.newContext();
      const page = await context.newPage();
      
      const loginPage = new LoginVlad(page);
      const csrSearchPage = new CSRSearchPage(page);
      
      await loginPage.navigateToLogin();
      await loginPage.CSRLogin();
      await loginPage.goToLayout();
      
      return {
        page,
        csrSearchPage,
        close: async () => await context.close()
      };
    };

    await use(createContext);
  },
});

export { expect } from '@playwright/test';