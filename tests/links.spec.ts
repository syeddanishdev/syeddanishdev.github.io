import { expect, test } from '@playwright/test';

const PAGES = ['/', '/blog/', '/blog/flaky-suite-34-to-100.html'];

const DEPLOY_ONLY_PATHS = ['/report/', '/lighthouse/'];

const BOT_BLOCKING_HOSTS = ['www.linkedin.com', 'linkedin.com'];

for (const path of PAGES) {
    test(`all links on ${path} resolve`, async ({ page, request, baseURL }) => {
        await page.goto(path);
        const hrefs = await page.locator('a[href]').evaluateAll((links) =>
            links.map((a) => (a as HTMLAnchorElement).href),
        );

        const anchors = new Set<string>();
        const urls = new Set<string>();
        for (const href of hrefs) {
            const url = new URL(href);
            if (!url.protocol.startsWith('http')) continue;
            if (BOT_BLOCKING_HOSTS.includes(url.hostname)) continue;
            if (url.origin === baseURL && DEPLOY_ONLY_PATHS.includes(url.pathname)) continue;
            if (url.origin === baseURL && url.hash && url.pathname === new URL(page.url()).pathname) {
                anchors.add(url.hash.slice(1));
                continue;
            }
            url.hash = '';
            urls.add(url.toString());
        }

        for (const id of anchors) {
            await expect(page.locator(`[id="${id}"]`), `in-page anchor #${id}`).toHaveCount(1);
        }

        const results = await Promise.all(
            [...urls].map(async (url) => {
                try {
                    const res = await request.get(url, { timeout: 20_000, maxRedirects: 5 });
                    return { url, status: res.status() };
                } catch (err) {
                    return { url, status: String(err) };
                }
            }),
        );
        const broken = results.filter((r) => typeof r.status !== 'number' || r.status >= 400);
        expect(broken, `broken links on ${path}`).toEqual([]);
    });
}
