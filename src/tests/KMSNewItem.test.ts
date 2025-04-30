import { test, expect } from '@playwright/test';

test('Successful login with valid credentials', async ({ page }) => {
  // Переходим на страницу логина
  await page.goto('https://kmsqacm.lighthouse-cloud.com/');
  await page.fill('#login-username', 'vlad');
  await page.fill('#login-password', 'tesT1.');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('https://kmsqacm.lighthouse-cloud.com/kms/lh/');
  await page.waitForSelector('#kms-login-to-layout-button');
  await page.click('#kms-login-to-layout-button');
  await expect(page).toHaveURL(/LAYOUT/);
 
  async function rightClickWithRetry(page, locator, menuSelector, attempts = 3) {
    for (let i = 1; i <= attempts; i++) {
      try {
        console.log(`Попытка правого клика #${i}`);
        
        // Вариант 1: Стандартный правый клик
        //await locator.click({ button: 'right' });
        //await page.waitForTimeout(500);
        
        // Проверяем появилось ли меню
        //if (await page.locator(menuSelector).isVisible({ timeout: 2000 })) {
        //  console.log(`Меню успешно открыто на попытке #${i}`);
        //  return true;
        //}
  
        // Вариант 2: Клик через координаты
        const box = await locator.boundingBox();
        await page.mouse.move(box.x + box.width/2, box.y + box.height/2);
        await page.waitForTimeout(300);
        await page.mouse.click(box.x + box.width/2, box.y + box.height/2, { 
          button: 'right',
          delay: 100
        });
  
        if (await page.locator(menuSelector).isVisible({ timeout: 2000 })) {
          console.log(`Меню открыто через координатный клик (попытка #${i})`);
          return true;
        }
  
      } catch (error) {
        console.warn(`Ошибка в попытке #${i}:`, error.message);
        await page.screenshot({ path: `right-click-error-attempt-${i}.png` });
      }
      await page.waitForTimeout(1000);
    }
    return false;
  }
  
  // Использование функции правого клика
  const contextButton = page.locator('xpath=//*[@id="cmTree"]/ul/li[7]/span/button');
  const menuItemSelector = 'a[href="#create"]';
  
  if (!await rightClickWithRetry(page, contextButton, menuItemSelector)) {
    throw new Error('Не удалось открыть контекстное меню после всех попыток');
  }
  
  await page.click(menuItemSelector);
  await page.waitForTimeout(2000);

  try {
    
    await test.step('Enter Vlad in input field', async () => {
      // Измененный локатор для поиска поля ввода
      const inputField = page.locator('input.ui-input-input[type="text"][placeholder="Search"]');
      await expect(inputField).toBeVisible({ timeout: 10000 });
      await expect(inputField).toBeEditable();
      
      // Очищаем поле и вводим текст
      await inputField.fill('');
      await inputField.type('vlad', { delay: 100 });
      
      // Проверяем что текст введен
      await expect(inputField).toHaveValue('vlad');
    });

    // 2. Клик по появившемуся элементу
    await test.step('Select item from list', async () => {
      const targetElement = page.locator('.item-create-dialog-list__item-title', { hasText: 'vlad' });      
      await expect(targetElement).toBeVisible({ timeout: 3000 });
      await targetElement.click();
    });
// Проверка и клик по кнопке Next
await test.step('Check and click Next button', async () => {
  const nextButton = page.locator('button.wf-button.--primary:has-text("Next")');
  
  // Проверка активности кнопки
  await expect(nextButton).toBeEnabled({ timeout: 5000 });
  
  // Проверка, что кнопка действительно стала активной (имеет нужные классы)
  await expect(nextButton).toHaveClass(/--primary/);
  
  // Клик по кнопке
  await nextButton.click();
  await page.waitForTimeout(1000); // Небольшая пауза после клика
});
    // 3. Работа с кнопками подтверждения
    await test.step('Confirm and submit', async () => {
      const primaryBtn = page.getByRole('button', { name: 'Skip' });
      
      // Проверка активности кнопки
      await expect(primaryBtn).toBeEnabled({ timeout: 2000 });
      
      // Первый клик
      await primaryBtn.click();
      await page.waitForTimeout(1000);
      
      const uniqueId = Date.now();
      const entityName = `Vlad test item for automation task 2 - ${uniqueId}`;

// Кликаем на заголовок "New Item"
await page.locator('iframe[name="itemscope"]')
  .contentFrame()
  .getByRole('heading', { name: 'New Item' })
  .click();

// Заполняем поле названия с уникальным идентификатором
await page.locator('iframe[name="itemscope"]')
  .contentFrame()
  .locator('input[name="inplace_value"]')
  .fill(entityName);

// Для отладки можно вывести в консоль созданное имя
console.log(`Created entity with name: ${entityName}`);


  //await page.locator('iframe[name="itemscope"]').contentFrame().locator('div').filter({ hasText: /^Offline$/ }).toBeVisible;
  //await page.locator('iframe[name="itemscope"]').contentFrame().locator('div').filter({ hasText: /^Offline$/ }).first().click();
  //await page.locator('iframe[name="itemscope"]').contentFrame().locator('div').filter({ hasText: /^Offline$/ }).first().click();
  //await page.locator('#status-select').toBeVisible
  //await page.locator('.iw-dropdown-filter-container').isVisible();
  //await page.locator('iframe[name="itemscope"]').contentFrame().getByRole('option', { name: 'Online' }).locator('span').nth(1).click();  
  
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await page.getByRole('button', { name: 'Update', exact: true }).click();
  await page.locator('iframe[name="itemscope"]').contentFrame().getByRole('img', { name: 'Locate in tree' }).isVisible();
  await page.locator('iframe[name="itemscope"]').contentFrame().getByRole('img', { name: 'Locate in tree' }).click();
        });
    }
    catch (error) {
    await page.screenshot({ path: 'error.png' });
    throw new Error(`Тест упал на шаге: ${error.message}`);
    }
    finally {
      // Опционально: дополнительные действия перед завершением
      console.log('Test completed');
    }
});