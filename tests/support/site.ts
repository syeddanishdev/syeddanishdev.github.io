import type { Page } from '@playwright/test';

export const BUG_COUNT = 5;

type RunConclusion = 'success' | 'failure';

export async function stubGitHubRuns(page: Page, conclusion: RunConclusion | 'error' = 'success') {
    await page.route('https://api.github.com/repos/**', async (route) => {
        if (conclusion === 'error') {
            await route.fulfill({ status: 503, body: 'unavailable' });
            return;
        }
        const repo = new URL(route.request().url()).pathname.split('/')[3];
        await route.fulfill({
            json: {
                workflow_runs: [
                    {
                        status: 'completed',
                        conclusion,
                        updated_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
                        html_url: `https://github.com/syeddanishdev/${repo}/actions/runs/1`,
                    },
                ],
            },
        });
    });
}

export async function blockExternalImages(page: Page) {
    await page.route(/^https:\/\/github\.com\/.*\/badge\.svg$/, (route) =>
        route.fulfill({
            contentType: 'image/svg+xml',
            body: '<svg xmlns="http://www.w3.org/2000/svg" width="110" height="20"><rect width="110" height="20" fill="#3fb950"/></svg>',
        }),
    );
}

export async function openHome(page: Page) {
    await stubGitHubRuns(page);
    await blockExternalImages(page);
    await page.goto('/');
}
