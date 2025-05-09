import { test } from '@playwright/test';
import { LoginVlad } from '../pages/Loginvlad';
import { DashboardPage } from '../pages/DashboardPage';
import { ItemPage } from '../pages/ItemPage';
import { CSRSearchPage } from '../pages/CSRSearchPage';

test('Verify item visibility in CSR search', async ({ page, browser }) => {
    const loginPage = new LoginVlad(page);
    const dashboardPage = new DashboardPage(page);
    const itemPage = new ItemPage(page);

    // 1. Login as admin
    await loginPage.navigateToLogin(); // URL берётся из .env
    await loginPage.CMLogin(); // Креды берутся из .env
    await loginPage.goToLayout();

    // 2. Create Online item (сохраняем имя для проверки)
    const onlineItemName = await test.step('Create Online item', async () => {
        await dashboardPage.rightClickFolder();
        await dashboardPage.createNewItem();
        await dashboardPage.searchAndSelectItem('vlad');
        await dashboardPage.clickNext();
        await dashboardPage.clickSkip();

        const name = await itemPage.fillItemName('Vlad Online Item');
        await itemPage.changeStatusToOnline();
        await itemPage.saveAndHandleDialog();
        await itemPage.verifyStatusOnline();
        await itemPage.locateAndVerifyInTree(name);
        await itemPage.verifyOnlineItemColor(name);
        return name;
    });

    // 3. Create Offline item (сохраняем имя для проверки)
    const offlineItemName = await test.step('Create Offline item', async () => {
        await dashboardPage.rightClickFolder();
        await dashboardPage.createNewItem();
        await dashboardPage.searchAndSelectItem('vlad');
        await dashboardPage.clickNext();
        await dashboardPage.clickSkip();

        const name = await itemPage.fillItemName('Vlad Offline Item');
        await itemPage.saveAndHandleDialog();
        await itemPage.verifyStatusOffline();
        await itemPage.locateAndVerifyInTree(name);
        await itemPage.verifyOfflineItemColor(name);
        return name;
    });

    // 4. Switch to CSR context
    await test.step('CSR: Verify item visibility', async () => {
        const csrContext = await browser.newContext();
        const csrPage = await csrContext.newPage();
        const csrLoginPage = new LoginVlad(csrPage);
        const csrSearchPage = new CSRSearchPage(csrPage);

        await csrLoginPage.navigateToLogin();
        await csrLoginPage.CSRLogin();
        await csrLoginPage.goToLayout();

        // 4.1 Search for items
        await test.step('Search and verify items', async () => {
            await csrPage.waitForTimeout(2000); // Wait for UI stabilization
            await csrSearchPage.searchWithWait('Vlad');

            // Verify ONLINE item IS visible
            await csrSearchPage.verifyItemVisible(onlineItemName);

            // Verify OFFLINE item is NOT visible
            await csrSearchPage.verifyItemNotVisible(offlineItemName);
        });

        await csrContext.close();
    });
});