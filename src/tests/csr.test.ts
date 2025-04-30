import { test } from '@playwright/test';
import { LoginVlad } from '../pages/Loginvlad.ts';
import { DashboardPage } from '../pages/DashboardPage';
import { ItemPage } from '../pages/ItemPage';
import { CSRSearchPage } from '../pages/CSRSearchPage';

test('Successful login with valid credentials', async ({ page, browser }) => {
    const loginPage = new LoginVlad(page);
    try {
        await test.step('Relogin as CSR and search', async () => {

            // 1. Открываем новое окно (2 строки)
            //const context = await browser.newContext();
            //const page = await context.newPage();
            const csrPage = new CSRSearchPage(page);

            // 2. Логин 
            await loginPage.navigateToLogin();
            await loginPage.login('csr', 'csr');
            await loginPage.goToLayout();

            // 3. Поиск
            await test.step('Search for Vlad', async () => {
                await csrPage.searchWithWait('Vlad');
            });

            // 4. Закрываем контекст (важно!)
            //await context.close();
        });

    } catch (error) {
        await page.screenshot({ path: `error_${Date.now()}.png` });
        console.error('Test failed:', error instanceof Error ? error.message : String(error));
        throw error;
    } finally {
        console.log('Test completed');
    }
});