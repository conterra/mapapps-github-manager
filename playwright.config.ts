import {
    defineConfig,
    devices,
    PlaywrightTestConfig
} from "@playwright/test";

// "CI" environment variable can be used to activate
// specific settings for CI environments.
const envCI = !!process.env.CI;

const isHeaded = process.argv.includes('--headed');

// gpu is disabled for Chromium in headless mode
// to ensure stability and performance
// in environments where gpu acceleration is not supported
const chromiumLaunchOptions = {
    args: isHeaded ? [] : ["--disable-gpu"]
};

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
    testDir: "./src/test/end-to-end",
    outputDir: "./target/end-to-end/results",
    snapshotDir: "./src/test/end-to-end/snapshots",

    /* The tests talk to api.github.com and download a release archive, so allow for slow answers. */
    timeout: 120000,
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: envCI,
    /* Retry on CI only. Also covers the occasional GitHub hiccup. */
    retries: envCI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: envCI ? 1 : 2,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [
        [
            "list"
        ],
        [
            "html",
            {
                outputFolder: "./target/end-to-end/reports/html",
                open: envCI ? "never" : "on-failure"
            }
        ]
    ],

    expect: {
        /* The bundle list and the release lookup wait on GitHub. */
        timeout: 30000
    },

    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: "http://localhost:9090",

        /**
         * See https://playwright.dev/docs/trace-viewer
         * ci: Collect trace when retrying the failed test.
         * local: Collect trace for all tests.
         */
        trace: envCI ? "on-first-retry": "on"
    },

    /* The management view is a desktop administration UI, so no mobile device is covered. */
    projects: [
        {
            name: "Desktop Chrome",
            use: {
                ...devices["Desktop Chrome"],
                launchOptions: chromiumLaunchOptions
            }
        }
    ]
};


export default defineConfig(config);
