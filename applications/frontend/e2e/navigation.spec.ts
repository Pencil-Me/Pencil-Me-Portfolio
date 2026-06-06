import { expect, test } from '@playwright/test';

import { gotoWithApiMocks } from './helpers/api-mocks';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await gotoWithApiMocks(page, '/home');
  });

  test('navigates to projects via main nav', async ({ page }) => {
    await page.getByRole('link', { name: /Projekte/i }).click();
    await expect(page).toHaveURL(/\/projects$/);
  });

  test('navigates to contact via main nav', async ({ page }) => {
    await page.getByRole('link', { name: /Kontakt/i }).click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.getByRole('heading', { name: 'Kontakt', level: 2 })).toBeVisible();
  });

  test('shows 404 page for unknown routes', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    await expect(page.getByRole('heading', { name: /404/i })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Zur Startseite' })).toBeVisible();
  });
});
