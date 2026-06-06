import { expect, test } from '@playwright/test';

import { gotoWithApiMocks } from './helpers/api-mocks';

test.describe('Theme', () => {
  test('toggles light and dark color scheme', async ({ page }) => {
    await gotoWithApiMocks(page, '/home');

    const toggle = page.getByRole('button', {
      name: /Farbschema aktivieren/i,
    });
    await expect(toggle).toBeVisible();

    const initialTheme = await page.locator('html').getAttribute('data-bs-theme');
    expect(initialTheme === 'light' || initialTheme === 'dark').toBeTruthy();

    await toggle.click();
    const toggledTheme = await page.locator('html').getAttribute('data-bs-theme');
    expect(toggledTheme).not.toBe(initialTheme);

    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-bs-theme', initialTheme ?? '');
  });
});
