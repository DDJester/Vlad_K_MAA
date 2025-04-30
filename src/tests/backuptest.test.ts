import { test, expect } from '@playwright/test';
import { LoginVlad } from '../pages/Loginvlad.ts';
import { DashboardPage } from '../pages/DashboardPage';
import { ItemPage } from '../pages/ItemPage';
import { CSRSearchPage } from '../pages/CSRSearchPage';

test('Successful login with valid credentials', async ({ page, browser }) => {
    const loginPage = new LoginVlad(page);
    const dashboardPage = new DashboardPage(page);
    const itemPage = new ItemPage(page);


    // 1. Login
    await loginPage.navigateToLogin();
    await loginPage.login('vlad', 'tesT1.');
    await loginPage.goToLayout();

    // 2. Create Online item
    await test.step('Create Online item', async () => {
        await dashboardPage.searchAndSelectItem('vlad');
        await dashboardPage.rightClickFolder();
        await dashboardPage.createNewItem();
        await dashboardPage.searchAndSelectItem('vlad');
        await dashboardPage.clickNext();
        await dashboardPage.clickSkip();

        const onlineItemName = await itemPage.fillItemName('Vlad Online Item');
        await itemPage.changeStatusToOnline();
        await itemPage.saveAndHandleDialog();
        await itemPage.verifyStatusOnline();
        await itemPage.locateInTree();
        await itemPage.locateAndVerifyInTree(onlineItemName);
    });

    // 3. Create Offline item
    await test.step('Create Offline item', async () => {
        await dashboardPage.rightClickFolder();
        await dashboardPage.createNewItem();
        await dashboardPage.searchAndSelectItem('vlad');
        await dashboardPage.clickNext();
        await dashboardPage.clickSkip();

        const offlineItemName  = await itemPage.fillItemName('Vlad Offline Item');
        await itemPage.saveAndHandleDialog();
        await itemPage.verifyStatusOffline();
        await itemPage.locateInTree();
        await itemPage.locateAndVerifyInTree(offlineItemName );
        
    });

    // 4. Relogin as CSR

    await test.step('Relogin as CSR and search', async () => {
        // Сохраняем имя оффлайн-итема в переменную, доступную для всего теста
            
        // 1. Создаем полностью изолированный контекст
        const csrContext = await browser.newContext();
        const csrPage = await csrContext.newPage();    
        // 2. Инициализируем CSR-страницы в новом контексте
        const csrLoginPage = new LoginVlad(csrPage);
        const csrSearchPage = new CSRSearchPage(csrPage);
    
        // 3. Логин CSR в новом окне
        await csrLoginPage.navigateToLogin();
        await csrLoginPage.login('csr', 'csr');
        await csrLoginPage.goToLayout();
    
        // 4. Поиск
        
    
        // 5. Всегда закрываем контекст
        await csrContext.close();
    });


});