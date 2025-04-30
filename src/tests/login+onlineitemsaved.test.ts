import { test } from '@playwright/test';
import { LoginVlad } from '../pages/Loginvlad';
//import { DashboardPage } from '../pages/DashboardPage';
//import { ItemPage } from '../pages/ItemPage';

test('Successful login with valid credentials', async ({ page }) => {
  // Инициализация страниц
  const loginPage = new LoginVlad(page);
  //const dashboardPage = new DashboardPage(page);
  //const itemPage = new ItemPage(page);

  // 1. Шаг авторизации
  await test.step('Login with valid credentials', async () => {    
    await loginPage.navigateToLogin();
    await loginPage.login('vlad', 'tesT1.');
    await loginPage.goToLayout();
    console.log('Login successful');
  });

  /* Закомментированный блок создания айтемов
  // 2. Работа с папками
  await test.step('Folder operations', async () => {
    await dashboardPage.rightClickFolder();
    await dashboardPage.createNewItem();
  });

  // 3. Создание Online айтема
  await test.step('Create Online item', async () => {
    await dashboardPage.searchAndSelectItem('vlad');
    await dashboardPage.clickNext();
    await dashboardPage.clickSkip();

    const itemName = await itemPage.fillItemName('Vlad Online Item');
    await itemPage.changeStatusToOnline();
    await itemPage.saveAndHandleDialog();
    await itemPage.verifyStatusOnline();
    await itemPage.locateInTree();
    await itemPage.locateAndVerifyInTree(itemName);
  });
  */

  console.log('Test completed');
});