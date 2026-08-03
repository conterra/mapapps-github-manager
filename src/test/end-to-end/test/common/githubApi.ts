/*
 * Copyright (C) con terra GmbH
 */
import { Page, Response } from "@playwright/test";
import { Release, Repository, RepositorySearchResult } from "../api";

/** The endpoints the bundle uses. Keep in sync with BundleStore and BundleDetailsController. */
export const REPOSITORY_SEARCH_URL = "https://api.github.com/search/repositories";
export const RELEASES_URL = /^https:\/\/api\.github\.com\/repos\/conterra\/[^/]+\/releases$/;

/** Waits for the repository search BundleStore triggers while the app starts. */
export function waitForRepositorySearch(page: Page): Promise<Response> {
    return page.waitForResponse((response) => response.url().startsWith(REPOSITORY_SEARCH_URL));
}

/** Waits for the release lookup BundleDetailsController triggers when a bundle is opened. */
export function waitForReleaseLookup(page: Page): Promise<Response> {
    return page.waitForResponse((response) => RELEASES_URL.test(response.url()));
}

/**
 * Waits for the release archive request the install button triggers.
 *
 * github.com sends no CORS headers for release assets, so the direct request fails in the browser and
 * map.apps retries through its proxy. The proxy URL carries the original one as a query parameter,
 * which is why both variants are matched here.
 */
export function waitForArchiveRequest(page: Page): Promise<Response> {
    return page.waitForResponse((response) => response.url().includes("/releases/download/"));
}

export async function readSearchResult(response: Response): Promise<RepositorySearchResult> {
    return await response.json() as RepositorySearchResult;
}

export async function readReleases(response: Response): Promise<Release[]> {
    return await response.json() as Release[];
}

/**
 * The filter BundleStore applies to the search result - these are the bundles the app offers.
 * See fetchBundlesFromGitHub in BundleStore.js.
 */
export function offeredBundles(searchResult: RepositorySearchResult): Repository[] {
    return searchResult.items.filter((item) => item.topics.includes("4x") && item.archived === false);
}

/**
 * The releases the version selectbox offers. See _lookupAvailableTags in BundleDetailsController.js.
 */
export function installableReleases(releases: Release[]): Release[] {
    return releases.filter((release) => !!release.name && !release.name.includes("SNAPSHOT"));
}
