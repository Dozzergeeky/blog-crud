import { test, expect } from '@playwright/test';

// Base URL can be overridden via PLAYWRIGHT_BASE_URL env when running against deployed env.
const base = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

async function createPost(page: any, title: string, content: string) {
  await page.goto(base + '/create');
  await page.fill('#title', title);
  await page.fill('#content', content);
  await page.click('button[type="submit"]');
  await page.waitForURL(base + '/');
}

test.describe('Posts CRUD', () => {
  test('create, list, update, delete', async ({ page }) => {
    const title = 'Playwright Post ' + Date.now();
    const content = 'Content body for playwright test ' + Math.random().toString(36).slice(2) + ' more than ten chars';

    // Create
    await createPost(page, title, content);
    await expect(page.locator('text=' + title)).toBeVisible();

  // Navigate to detail by clicking the title link
  await page.click(`a:has-text("${title}")`);

  // Edit
  await page.waitForURL(/\/post\//);
  await page.click('text=Edit');
  await page.waitForURL(/\/edit\//);
    const newTitle = title + ' Updated';
    await page.fill('#title', newTitle);
    await page.fill('#content', content + ' updated');
    await page.click('button[type="submit"]');
    await page.waitForURL(base + '/');
    await expect(page.locator('text=' + newTitle)).toBeVisible();

  // Delete using data-testid for the updated post card
  const card = page.locator(`[data-testid="post-card-"]`, { has: page.locator(`a:has-text("${newTitle}")`) });
  // Fallback: locate by heading then go to parent card
  await page.click(`button:has-text("Delete")`);
    // Confirm modal
    const confirm = page.locator('button:has-text("Confirm")');
    if (await confirm.isVisible()) {
      await confirm.click();
    }

    // Verify deletion (post should disappear)
    await expect(page.locator('text=' + newTitle)).toHaveCount(0, { timeout: 10000 });
  });
});
