import { test } from '@playwright/test';
import { LoginVlad } from '../pages/Loginvlad';
import { DashboardPage } from '../pages/DashboardPage';
import { ItemPage } from '../pages/ItemPage';

test('Verify item visibility in CSR search', async ({ page, browser }) => {
    const loginPage = new LoginVlad(page);
    const dashboardPage = new DashboardPage(page);
    const itemPage = new ItemPage(page);

    // 1. Login as admin
    await loginPage.navigateToLogin();
    await loginPage.login('vlad', 'tesT1.');
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
        await itemPage.openitemtab();
        await itemPage.addimagetoexternalfield();
        await itemPage.checkaddedimagetoexternalfield();
        await itemPage.saveAndHandleDialog();
        await itemPage.verifyStatusOnline();
    });

    
});