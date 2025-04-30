import { test } from '@playwright/test';
import { LoginVlad } from '../pages/Loginvlad.ts'; 

test('Successful login with valid credentials', async ({ page }) => {
  const loginPage = new LoginVlad(page);
  
  try {
    // 1. Login
    await loginPage.navigateToLogin();
    await loginPage.login('vlad', 'tesT1.');
    await loginPage.goToLayout();
    
    // Здесь можно добавить дальнейшие действия
    // const itemPage = new ItemPage(page);
    // await itemPage.someMethod();
    
  } catch (error) {
    await page.screenshot({ path: `error_${Date.now()}.png` });
    console.error('Test failed:', error instanceof Error ? error.message : String(error));
    throw error;
  } finally {
    console.log('Test completed');
  }
});