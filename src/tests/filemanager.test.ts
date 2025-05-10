/*import { test } from '@playwright/test';
import { LoginVlad } from '../pages/Loginvlad';
import { DashboardPage } from '../pages/DashboardPage';
import { ItemPage } from '../pages/ItemPage'; */
import { test } from '../fixtures';
import 'dotenv/config';

test('Verify image adding to an item', async ({ 
  dashboardPage, 
  itemPage,
  authCM: _authCM
}) => {

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