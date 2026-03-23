import { test, expect } from '@playwright/test';


var runId = '';
var desktopLink = '';


test('Get sample test data', async ({ page }) => {

  await page.goto('https://takehome-desktop.d.tekvisionflow.com/testgenerator.html');
  
  expect(page.locator('[id="resetBtn"]')).toBeVisible();
  await page.locator('[id="resetBtn"]').click();
  
  await expect(page.locator('[id="submitBtn"]')).toBeVisible();
  await page.locator('[id="submitBtn"]').click();
  
  await expect(page.locator('[id="resultStatus"]')).toBeVisible();
  //await page.locator('[id="resultStatus"]').click();

  await expect(page.locator('[id="runIdValue"]')).toBeVisible();
  runId = await page.locator('[id="runIdValue"]').innerText();

  
  await expect(page.locator('[id="desktopLink"]')).toBeVisible();
  desktopLink = await page.locator('[id="desktopLink"]').innerText();

  //const messages = await page.locator('#payloadEditor').allInnerTexts();

  console.log(runId);
  console.log(desktopLink);

  
});

test('should load agent desktop and display core UI', async ({ page }) => {

  await page.goto('https://takehome-desktop.d.tekvisionflow.com/desktop/'+runId);

  // Validate page loaded
  await expect(page).toHaveTitle(/Mock Agent Desktop/);

  // Validate key UI elements
  await expect(page.locator('[data-testid="desktop-header"]')).toBeVisible();
  await expect(page.locator('[data-testid="connection-status"]')).toBeVisible();
  await expect(page.locator('[data-testid="agent-status-control"]')).toBeVisible();
  await expect(page.locator('[data-testid="agent-status-select"]')).toBeVisible();
  await expect(page.locator('[data-testid="chat-transcript"]')).toBeVisible();
  await expect(page.locator('[data-testid="chat-waiting"]')).toBeVisible();
  await expect(page.locator('[data-testid="workspace-gated"]')).toBeVisible();
});