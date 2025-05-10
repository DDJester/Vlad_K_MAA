/*import { test } from '@playwright/test';
import { LoginVlad } from '../pages/Loginvlad';
import { DashboardPage } from '../pages/DashboardPage';
import { ItemPage } from '../pages/ItemPage';
import { CSRSearchPage } from '../pages/CSRSearchPage'; */
import { test } from '../fixtures';
import 'dotenv/config';

test('Verify item visibility in CSR search', async ({
    dashboardPage,
    itemPage,
    authCM,
    getCSRContext
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
       const csr = await getCSRContext();
    try {
      await csr.csrSearchPage.searchWithWait('Vlad');
      await csr.csrSearchPage.verifyItemVisible(onlineItemName);
      await csr.csrSearchPage.verifyItemNotVisible(offlineItemName);
    } finally {
      
      await csr.close();
    }
    });
});