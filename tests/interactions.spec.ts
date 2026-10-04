import { expect, test } from '@playwright/test';
import { BUG_COUNT, openHome, stubGitHubRuns } from './support/site';

test.describe('theme', () => {
    test('toggle switches to light and persists across reloads', async ({ page }) => {
        await openHome(page);
        await expect(page.locator('body')).toHaveAttribute('data-theme', 'dark');

        await page.getByRole('button', { name: 'Switch to light theme' }).click();
        await expect(page.locator('body')).toHaveAttribute('data-theme', 'light');

        await page.reload();
        await expect(page.locator('body')).toHaveAttribute('data-theme', 'light');
        await expect(page.getByRole('button', { name: 'Switch to dark theme' })).toBeVisible();
    });

    test('blog pages follow the saved theme', async ({ page }) => {
        await openHome(page);
        await page.getByRole('button', { name: 'Switch to light theme' }).click();
        await page.goto('/blog/');
        await expect(page.locator('body')).toHaveAttribute('data-theme', 'light');
    });
});

test.describe('mobile navigation', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('menu opens, navigates, and closes', async ({ page }) => {
        await openHome(page);
        const menuButton = page.getByRole('button', { name: 'Toggle navigation menu' });
        const experienceLink = page.getByRole('navigation').getByRole('link', { name: 'Experience' });

        await expect(experienceLink).toBeHidden();
        await menuButton.click();
        await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
        await experienceLink.click();

        await expect(page).toHaveURL(/#experience$/);
        await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
        await expect(experienceLink).toBeHidden();
    });
});

test.describe('phone reveal', () => {
    test('reveals a dialable number on click', async ({ page }) => {
        await openHome(page);
        await page.getByRole('button', { name: 'Reveal phone number' }).click();
        await expect(page.getByRole('link', { name: '(647) 833-9990' })).toHaveAttribute('href', 'tel:+16478339990');
    });

    test('reveals the number from the keyboard', async ({ page }) => {
        await openHome(page);
        await page.getByRole('button', { name: 'Reveal phone number' }).focus();
        await page.keyboard.press('Enter');
        await expect(page.locator('#phoneDisplay')).toHaveText('(647) 833-9990');
    });
});

test.describe('hero terminal', () => {
    test('shows the full run immediately for reduced-motion users', async ({ page }) => {
        await openHome(page);
        await expect(page.locator('#terminal .t-line.t-hidden')).toHaveCount(0);
        await expect(page.locator('#terminal')).toContainText('6 passed');
    });

    test('types the run out line by line', async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        await openHome(page);
        const lines = page.locator('#terminal .t-line');

        await expect(lines.first()).toBeVisible();
        await expect(page.locator('#terminal .t-line.t-hidden')).not.toHaveCount(0);
        await expect(page.locator('#terminal .t-line.t-hidden')).toHaveCount(0, { timeout: 10_000 });
        await expect(lines.last()).toContainText('6 passed');
    });
});

test.describe('live CI status', () => {
    test('shows passing runs with links to the run', async ({ page }) => {
        await openHome(page);
        const rows = page.locator('.ci-row');

        await expect(rows).toHaveCount(3);
        for (const row of await rows.all()) {
            await expect(row.locator('.ci-pill')).toHaveText('passing');
            await expect(row.locator('.ci-time')).toHaveText('2 hours ago');
            await expect(row.getByRole('link')).toHaveAttribute('href', /\/actions\/runs\/1$/);
        }
    });

    test('flags failing runs', async ({ page }) => {
        await stubGitHubRuns(page, 'failure');
        await page.goto('/');
        await expect(page.locator('.ci-pill[data-state="failing"]')).toHaveCount(3);
    });

    test('degrades gracefully when the GitHub API is unavailable', async ({ page }) => {
        await stubGitHubRuns(page, 'error');
        await page.goto('/');
        await expect(page.locator('.ci-pill')).toHaveText(['unavailable', 'unavailable', 'unavailable']);
    });
});

test.describe('bug hunt', () => {
    test('plants bugs, counts finds, and congratulates at the end', async ({ page }) => {
        await openHome(page);
        await page.getByRole('button', { name: '🐞 Bug hunt' }).click();

        const panel = page.locator('#bugHuntPanel');
        await expect(panel).toBeVisible();
        await expect(page.locator('#bugCount')).toHaveText(`0 / ${BUG_COUNT} found`);
        await expect(page.locator('nav .logo')).toHaveText('Danish Alli');

        const bugs = page.locator('[data-bug]');
        await expect(bugs).toHaveCount(BUG_COUNT);
        for (let i = 0; i < BUG_COUNT; i++) {
            await bugs.nth(i).click();
        }

        await expect(page.locator('#bugCount')).toHaveText(`${BUG_COUNT} / ${BUG_COUNT} found`);
        await expect(panel.getByText('All 5 found')).toBeVisible();
        await expect(page).not.toHaveURL(/#contact$/);
    });

    test('counts each bug only once', async ({ page }) => {
        await openHome(page);
        await page.getByRole('button', { name: '🐞 Bug hunt' }).click();
        const logo = page.locator('nav .logo');

        await logo.click();
        await logo.click();
        await expect(page.locator('#bugCount')).toHaveText(`1 / ${BUG_COUNT} found`);
    });

    test('bugs can be reported from the keyboard', async ({ page }) => {
        await openHome(page);
        await page.getByRole('button', { name: '🐞 Bug hunt' }).click();
        await page.getByRole('button', { name: 'Report bug: Professional Experiance' }).focus();
        await page.keyboard.press('Enter');
        await expect(page.locator('#bugCount')).toHaveText(`1 / ${BUG_COUNT} found`);
    });

    test('ending the hunt restores the page', async ({ page }) => {
        await openHome(page);
        const toggle = page.locator('#bugHuntToggle');

        await toggle.click();
        await page.locator('nav .logo').click();
        await toggle.click();

        await expect(page.locator('#bugHuntPanel')).toBeHidden();
        await expect(page.locator('nav .logo')).toHaveText('Danish Ali');
        await expect(page.getByRole('heading', { name: 'Professional Experience' })).toBeVisible();
        await expect(page.locator('[data-bug="footer"]')).toContainText('© 2026');
        await expect(page.locator('.bug-found, .bug-tilt')).toHaveCount(0);
        await expect(page.locator('[data-bug][tabindex]')).toHaveCount(0);

        await page.getByRole('link', { name: 'Get In Touch' }).click();
        await expect(page).toHaveURL(/#contact$/);
    });
});

test('greets visitors who open the console', async ({ page }) => {
    const messages: string[] = [];
    page.on('console', (msg) => messages.push(msg.text()));
    await openHome(page);
    await expect.poll(() => messages.join('\n')).toContain('Inspecting my site?');
});

test('page loads without script errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await openHome(page);
    await page.getByRole('button', { name: '🐞 Bug hunt' }).click();
    expect(errors).toEqual([]);
});

test('case study links through to the write-up', async ({ page }) => {
    await openHome(page);
    await page.getByRole('link', { name: 'Read the full write-up →' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('How I took a flaky regression suite from 34% to 100%');
    await page.getByRole('link', { name: 'All writing' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Writing');
});
