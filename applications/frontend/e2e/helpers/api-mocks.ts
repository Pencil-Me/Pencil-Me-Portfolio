import type { Page, Route } from '@playwright/test';

import { resolveMockApiBody, type MockApiMode } from './api-fixtures';

export type MockPortfolioApiOptions = {
  mode?: MockApiMode;
};

export async function mockPortfolioApi(
  page: Page,
  options: MockPortfolioApiOptions = {},
): Promise<void> {
  const mode = options.mode ?? 'success';

  await page.route('**/api2/**', async (route: Route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname;

    if (request.method() === 'POST' && path.includes('send_email')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Data forwarded successfully' }),
      });
      return;
    }

    if (request.method() !== 'GET') {
      await route.fulfill({ status: 405, body: 'Method Not Allowed' });
      return;
    }

    if (mode === 'projects-error' && path.includes('all_projects')) {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: resolveMockApiBody(path, mode),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: resolveMockApiBody(path, mode),
    });
  });
}

export async function gotoWithApiMocks(
  page: Page,
  path: string,
  options: MockPortfolioApiOptions = {},
): Promise<void> {
  await mockPortfolioApi(page, options);
  await page.goto(path);
}
