/*
 * Copyright (C) con terra GmbH
 */
import { expect, Locator, Page } from "@playwright/test";

/**
 * Texts of the bundle, taken from nls/bundle.js. Used as locator names, because the map.apps widgets
 * the view is built from (menu bar, dgrid, modal window, dataform) offer no stable ids.
 * The app is opened with "?lang=en" so that these English texts are the ones rendered.
 */
export const TEXTS = {
    bundleListTool: "Developer Network Bundles",
    highlightBundles: "Selected Highlights",
    install: "Install",
    instructions: "Please choose the desired bundle version and press 'Install'",
    noReleasesYet: "Sorry, this bundle doesn't have any releases yet.",
    notFound: "Sorry, we could not locate this bundle on GitHub.",
    integrationFailed: "Sorry, the bundle could not be integrated into map.apps.",
    integrationSuccess: "Bundle installed."
};

/**
 * The GitHub bundle management view: the highlight carousel of BundleTopWidget.vue and the bundle
 * list of the GithubBundlesDataView, plus the details window BundleDetailsController opens.
 */
export class BundleManagementView {
    readonly page: Page;
    /** Root node of BundleWidget, which uses "bundleWidget" as baseClass. */
    readonly widget: Locator;
    /** Rows of the GithubBundlesDataView, which is configured with class "ctBundlesDataView". */
    readonly bundleRows: Locator;
    /**
     * The carousel card of BundleTopWidget.vue that is currently on display. All cards are in the
     * DOM at the same time, so the hidden ones have to be filtered out.
     */
    readonly highlightedBundle: Locator;

    constructor(page: Page) {
        this.page = page;
        this.widget = page.locator(".bundleWidget");
        this.bundleRows = page.locator(".ctBundlesDataView .dgrid-row");
        this.highlightedBundle = page.locator(".bundleWidget .bundleInfoContainer:visible").first();
    }

    /** Opens the app in English and the management view via the tool in the menu bar. */
    async open(): Promise<void> {
        await this.page.goto("/?lang=en");
        await this.page.getByRole("menuitemcheckbox", { name: TEXTS.bundleListTool }).click();
        await this.loaded();
    }

    /** Waits until the bundles fetched from GitHub are rendered. */
    async loaded(): Promise<void> {
        await expect(this.widget).toBeVisible();
        await expect(this.widget).toContainText(TEXTS.highlightBundles);
        await expect(this.bundleRows.first()).toBeVisible();
    }

    /** Name of the bundle the carousel currently shows. */
    async highlightedBundleName(): Promise<string> {
        return (await this.highlightedBundle.locator("h3").first().innerText()).trim();
    }

    /** Presses "Install" on the highlighted bundle, which opens its details window. */
    async openHighlightedBundle(): Promise<void> {
        await this.highlightedBundle.getByRole("button", { name: TEXTS.install }).click();
    }

    /** Selects a bundle in the list, which is what most users do. */
    async selectBundle(index = 0): Promise<void> {
        await this.bundleRows.nth(index).click();
    }

    /**
     * The modal window BundleDetailsController opens for a bundle. Told apart from the window of the
     * management view itself, which carries the widgetRole as a class - matching on the window content
     * instead would hide exactly the regressions these tests are about.
     */
    detailsWindow(): Locator {
        return this.page.locator(".ctWindow:not(.githubBundlesWidget)");
    }

    /** Text of the details window, including the offered version. */
    async detailsWindowText(): Promise<string> {
        return await this.detailsWindow().innerText();
    }

    /** Presses "Install" in the details window, which downloads and uploads the bundle. */
    async confirmInstall(): Promise<void> {
        await this.detailsWindow().getByRole("button", { name: TEXTS.install }).click();
    }
}
