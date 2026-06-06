import { expect, test } from '@playwright/test';

import { gotoWithApiMocks } from './helpers/api-mocks';

test.describe('API error handling', () => {
  test('shows load error on projects page when API fails', async ({ page }) => {
    await gotoWithApiMocks(page, '/projects', { mode: 'projects-error' });

    const errorPanel = page.locator('.pm-load-error').first();
    await expect(errorPanel).toBeVisible({ timeout: 15_000 });
    await expect(errorPanel).toContainText('Fehler beim Laden');
    await expect(page.getByRole('button', { name: 'Erneut versuchen' }).first()).toBeVisible();
  });
});
