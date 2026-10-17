import { test, expect } from '@playwright/test';
test('metrics room loads and adds metric', async ({ page }) => {
  await page.goto('http://localhost:3000/room/demo');
  await expect(page.locator('h1')).toContainText('MetricsRoom: demo');
  await page.locator('.add-btn').click();
  await expect(page.locator('.metric-list').locator('div').first()).toBeVisible();
});
