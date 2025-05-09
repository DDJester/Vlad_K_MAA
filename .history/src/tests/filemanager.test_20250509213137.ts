import { test } from '@playwright/test';
import { LoginVlad } from '../pages/Loginvlad';
import { DashboardPage } from '../pages/DashboardPage';
import { ItemPage } from '../pages/ItemPage';
import 'dotenv/config';

test('Verify image adding to an item', async ({ page, browser }) => {
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
        await itemPage.openitemtab();
        await itemPage.addimagetoexternalfield();
        await itemPage.checkaddedimagetoexternalfield();
        await itemPage.changeStatusToOnline();
        await itemPage.saveAndHandleDialog();
        await itemPage.verifyStatusOnline();
    });    
});