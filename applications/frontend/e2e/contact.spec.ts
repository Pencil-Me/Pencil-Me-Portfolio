import { expect, test } from '@playwright/test';

import { gotoWithApiMocks } from './helpers/api-mocks';

test.describe('Contact form', () => {
  test('submits general contact with mocked API', async ({ page }) => {
    await gotoWithApiMocks(page, '/contact');

    await page.getByRole('button', { name: 'Allgemeiner Kontakt' }).click();
    await page.locator('#generally_name').fill('John Doe');
    await page.locator('#generally_email').fill('john@example.com');
    await page.locator('#generally_message').fill('Playwright E2E message');
    await page.getByRole('checkbox', { name: /Ich stimme zu/ }).check();

    await page
      .locator('form')
      .filter({ has: page.locator('#generally_name') })
      .getByRole('button', { name: 'Senden' })
      .click();

    await expect(page.getByRole('heading', { name: 'Erfolgreich gesendet!' })).toBeVisible({
      timeout: 10_000,
    });
  });

  test('shows validation hint when required fields missing', async ({ page }) => {
    await gotoWithApiMocks(page, '/contact');

    await page.getByRole('button', { name: 'Allgemeiner Kontakt' }).click();
    await page.getByRole('button', { name: 'Senden' }).click();

    await expect(page.getByText('Überprüfe deine Eingabe.')).toBeVisible();
  });
});
