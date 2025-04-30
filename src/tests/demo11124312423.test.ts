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
      
  //Right click on a folder
  await page.locator('li[itemid="12"] button.dynatree-title').isVisible();
  await page.locator('li[itemid="12"] button.dynatree-title').hover();
  await page.locator('li[itemid="12"] button.dynatree-title').click({ button: 'right', delay: 1000 }); 
    
  // Click on New item
  await page.locator('a[href="#create"]').click();
  
  try {
    
    await test.step('Enter Vlad in input field', async () => {
      // Измененный локатор для поиска поля ввода
      const inputField = page.locator('input.ui-input-input[type="text"][placeholder="Search"]');
      await expect(inputField).toBeVisible({ timeout: 2000 });
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

  //1. Ждем iframe и получаем его contentFrame
const frame = page.frameLocator('iframe[name="itemscope"]');

// 2. Функция для надежного клика по Offline
async function clickOfflineWithRetry() {
  const maxRetries = 5;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt} to click Offline`);
      
      const offlineElement = frame.locator('.selection-container');
      
      // Ждем элемент и кликаем
      await offlineElement.waitFor({ state: 'visible', timeout: 3000 });
      await offlineElement.click({ force: true, timeout: 2000 });
      
      // Проверяем, что меню открылось
      await frame.locator('.iw-dropdown-filter-container').waitFor({ state: 'visible', timeout: 2000 });
      return true;
      
    } catch (error) {
      console.warn(`Attempt ${attempt} failed:`, error.message);
      await page.waitForTimeout(1000);
      if (attempt === maxRetries) throw error;
    }
  }
}

// 3. Функция для выбора Online
async function selectOnlineOption() {
  const onlineOption = frame.getByRole('option', { name: 'Online' });
  await onlineOption.waitFor({ state: 'visible', timeout: 10000 });
  
  await onlineOption.click({
    force: true,    // Принудительный клик (если элемент перекрыт)
    timeout: 5000,  // Таймаут для самого клика
    trial: true     // Предварительная проверка кликабельности
  });;
}

// Выполняем шаги
await test.step('Change status from Offline to Online', async () => {
  // Кликаем Offline (с повторами)
  await clickOfflineWithRetry();
  
  // Ждем появления выпадающего списка
  await frame.locator('#status-select').waitFor({ state: 'visible', timeout: 10000 });
  
  // Выбираем Online
  await selectOnlineOption();
  
  // Делаем скриншот для проверки
  await page.screenshot({ path: 'after-status-change.png' });
}); 
    
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  
  // Проверяем, появилось ли окно (без остановки теста)
const notificationDialog = page.locator('[aria-describedby="notification-dialog"]');
const isDialogVisible = await notificationDialog.isVisible().catch(() => false);

//  Если окно есть — кликаем "OK", если нет — идём дальше
if (isDialogVisible) {
  await page.getByRole('button', { name: 'Update' }).click();
  console.log('Закрыли всплывающее окно');
} 

const checkstatus = page.frameLocator('iframe[name="itemscope"]');
const onlineSpan = checkstatus.locator('.iw-dropdown-value-container .selection-container span');
await expect(onlineSpan).toHaveText(/^Online$/);


await page.locator('iframe[name="itemscope"]').contentFrame().getByRole('img', { name: 'Locate in tree' }).isVisible();
await page.locator('iframe[name="itemscope"]').contentFrame().getByRole('img', { name: 'Locate in tree' }).isEnabled();
await page.locator('iframe[name="itemscope"]').contentFrame().getByRole('img', { name: 'Locate in tree' }).click();
  
// 2. Альтернативные варианты локаторов
const button = await page.locator(`[role="button"][title="${entityName}"]`)
  .or(page.locator(`.dynatree-title:has-text("${entityName}")`))
  .or(page.getByRole('button', { name: entityName }))
  .first();

// 3. Улучшенная проверка существования
await expect(button).toBeVisible({ timeout: 15000 });

// 4. Получение полной информации об элементе
const elementInfo = await button.evaluate(el => ({
  outerHTML: el.outerHTML,
  classes: el.className,
  computedStyle: {
    color: getComputedStyle(el).color,
    backgroundColor: getComputedStyle(el).backgroundColor
  },
  boundingBox: el.getBoundingClientRect()
}));

console.log('Детальная информация об элементе:', elementInfo);

// 5. Гибкая проверка цвета
const actualColor = elementInfo.computedStyle.color;
expect(
  actualColor === 'rgb(10, 12, 13)' || 
  actualColor === '#0a0c0d' ||
  actualColor.toLowerCase().includes('0a0c0d')
).toBeTruthy();


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