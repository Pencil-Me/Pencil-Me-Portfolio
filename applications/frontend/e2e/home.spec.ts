import { expect, test } from '@playwright/test';

import { gotoWithApiMocks } from './helpers/api-mocks';

test.describe('Home', () => {
  test('shows hero and primary contact action', async ({ page }) => {
    await gotoWithApiMocks(page, '/home');

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Johannes Kromer');
    await expect(page.getByRole('button', { name: 'Kontakt' })).toBeVisible();
  });
});
