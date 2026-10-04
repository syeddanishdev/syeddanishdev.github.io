import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    reporter: [['list'], ['allure-playwright', { resultsDir: 'allure-results' }]],
    snapshotPathTemplate: '{testDir}/__screenshots__/{platform}/{testFilePath}/{arg}-{projectName}{ext}',
    expect: {
        toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled', timeout: 15_000 },
    },
    use: {
        baseURL: `http://127.0.0.1:${PORT}`,
        reducedMotion: 'reduce',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },
    projects: [
        {
            name: 'desktop',
            use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
        },
        {
            name: 'mobile',
            use: { ...devices['Pixel 7'] },
            testIgnore: /links\.spec\.ts/,
        },
    ],
    webServer: {
        command: `python3 -m http.server ${PORT} --bind 127.0.0.1`,
        url: `http://127.0.0.1:${PORT}`,
        reuseExistingServer: !process.env.CI,
        stderr: 'ignore',
    },
});
