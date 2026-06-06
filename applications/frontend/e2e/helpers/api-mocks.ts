import type { Page } from '@playwright/test';

const emptyList = '[]';

export async function mockPortfolioApi(page: Page): Promise<void> {
  await page.route('**/api2/**', async (route) => {
    if (route.request().method() !== 'GET') {
      await route.fulfill({ status: 405, body: 'Method Not Allowed' });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: emptyList,
    });
  });
}

export async function gotoWithApiMocks(page: Page, path: string): Promise<void> {
  await mockPortfolioApi(page);
  await page.goto(path);
}
