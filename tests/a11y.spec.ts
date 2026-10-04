import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { openHome } from './support/site';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

async function expectNoViolations(page: Page) {
    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    const summary = results.violations.map(
        (v) => `${v.id} (${v.impact}): ${v.help}\n  ${v.nodes.map((n) => n.target.join(' ')).join('\n  ')}`,
    );
    expect(summary, summary.join('\n\n')).toEqual([]);
}

test('home page (dark theme) has no WCAG A/AA violations', async ({ page }) => {
    await openHome(page);
    await expectNoViolations(page);
});

test('home page (light theme) has no WCAG A/AA violations', async ({ page }) => {
    await openHome(page);
    await page.getByRole('button', { name: 'Switch to light theme' }).click();
    await expectNoViolations(page);
});

test('home page with bug hunt active has no WCAG A/AA violations', async ({ page }) => {
    await openHome(page);
    await page.getByRole('button', { name: '🐞 Bug hunt' }).click();
    await expectNoViolations(page);
});

for (const path of ['/blog/', '/blog/flaky-suite-34-to-100.html']) {
    test(`${path} has no WCAG A/AA violations`, async ({ page }) => {
        await page.goto(path);
        await expectNoViolations(page);
    });
}
