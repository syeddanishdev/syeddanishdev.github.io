import { expect, test } from '@playwright/test';
import { openHome } from './support/site';

test('home page (dark)', async ({ page }) => {
    await openHome(page);
    await expect(page).toHaveScreenshot('home-dark.png', {
        fullPage: true,
        mask: [page.locator('.ci-time')],
    });
});

test('home page (light)', async ({ page }) => {
    await openHome(page);
    await page.getByRole('button', { name: 'Switch to light theme' }).click();
    await expect(page).toHaveScreenshot('home-light.png', {
        fullPage: true,
        mask: [page.locator('.ci-time')],
    });
});

test('blog post', async ({ page }) => {
    await page.goto('/blog/flaky-suite-34-to-100.html');
    await expect(page).toHaveScreenshot('blog-post.png', { fullPage: true });
});
