import { expect, test } from '@playwright/test';

import { gotoWithApiMocks } from './helpers/api-mocks';

test.describe('Projects page', () => {
  test('renders mocked project list', async ({ page }) => {
    await gotoWithApiMocks(page, '/projects');

    await expect(page.getByRole('heading', { name: 'Projekte', level: 2 })).toBeVisible();
    // Projekte werden per scheduleIdleWork (~2,5 s) nachgeladen
    await expect(page.getByRole('button', { name: 'E2E Test Project' })).toBeVisible({
      timeout: 15_000,
    });
    await expect(
      page.getByRole('heading', { name: 'Projekte als Auftragnehmer', level: 3 }),
    ).toBeVisible();
  });
});
