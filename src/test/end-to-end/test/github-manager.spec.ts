///
/// Copyright (C) 2026 con terra GmbH (info@conterra.de)
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///         http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import { expect, test } from '@playwright/test';

import {
    installableReleases,
    offeredBundles,
    readReleases,
    readSearchResult,
    waitForArchiveRequest,
    waitForReleaseLookup,
    waitForRepositorySearch
} from './common/githubApi';
import { BundleManagementView, TEXTS } from './components/bundle-management-view';

test('lists the bundles GitHub reports', async ({ page }) => {
    const view = new BundleManagementView(page);
    const search = waitForRepositorySearch(page);

    await view.open();

    const response = await search;
    expect(response.status(), 'the repository search failed').toBe(200);

    const searchResult = await readSearchResult(response);
    expect(searchResult.items, 'GitHub returned no repositories at all').not.toHaveLength(0);
    expect(
        offeredBundles(searchResult),
        "no repository passes the topic '4x' / archived filter of BundleStore any more"
    ).not.toHaveLength(0);
});

test('offers the released versions of the highlighted bundle', async ({ page }) => {
    const view = new BundleManagementView(page);
    await view.open();

    const bundleName = await view.highlightedBundleName();
    const releaseLookup = waitForReleaseLookup(page);

    await view.openHighlightedBundle();

    // Checked before the GitHub response, so that a view that offers nothing fails right here.
    const detailsWindow = view.detailsWindow();
    await expect(detailsWindow).toBeVisible();
    await expect(detailsWindow).toContainText(`Bundle '${bundleName}'`);
    // The version form is only rendered when releases were found.
    await expect(detailsWindow).toContainText(TEXTS.instructions);
    await expect(detailsWindow).not.toContainText(TEXTS.noReleasesYet);

    const response = await releaseLookup;
    expect(response.url(), 'the release lookup no longer uses the expected URL').toBe(
        `https://api.github.com/repos/conterra/${bundleName}/releases`
    );
    expect(response.status(), `the release lookup for ${bundleName} failed`).toBe(200);

    const releases = await readReleases(response);
    expect(Array.isArray(releases), 'the releases endpoint no longer answers with an array').toBe(true);
    const installable = installableReleases(releases);
    expect(installable, `GitHub reports no installable release for ${bundleName}`).not.toHaveLength(0);

    // The preselected version has to be one GitHub really offers.
    const shownText = await view.detailsWindowText();
    const offeredVersions = installable.map((release) => release.name).filter((name) => shownText.includes(name!));
    expect(offeredVersions, 'the details window shows no version that GitHub reports').not.toHaveLength(0);
});

test('opens the details of a bundle selected from the list', async ({ page }) => {
    const view = new BundleManagementView(page);
    await view.open();

    const releaseLookup = waitForReleaseLookup(page);
    await view.selectBundle();

    // Any bundle may legitimately have no release yet, so this only pins down the request the
    // controller sends and that the window opens at all.
    const response = await releaseLookup;
    expect(response.status(), `the release lookup ${response.url()} failed`).toBe(200);
    await expect(view.detailsWindow()).toBeVisible();
});

/**
 * The install button builds the archive URL from the release name. If GitHub changes that URL layout,
 * or the release stops carrying a "<bundle>-bundle.zip" asset, installing fails.
 */
test('downloads an existing release archive when installing', async ({ page }) => {
    const view = new BundleManagementView(page);
    await view.open();

    await view.openHighlightedBundle();
    const detailsWindow = view.detailsWindow();
    await expect(detailsWindow).toContainText(TEXTS.instructions);

    const archiveRequest = waitForArchiveRequest(page);
    await view.confirmInstall();

    const response = await archiveRequest;
    // 302 is the redirect to the asset storage. A 404 means the URL the bundle builds is wrong.
    expect(
        [200, 206, 302],
        `${response.url()} answered with ${response.status()}, the release archive URL is no longer valid`
    ).toContain(response.status());

    /*
     * A failed download reports "could not locate this bundle on GitHub", while a rejected upload
     * reports "could not be integrated into map.apps". Only the download is GitHub's business - the
     * jsregistry of the local development server accepts no uploads at all - so the test passes on
     * either upload outcome but never on a failed download.
     */
    const uploadOutcome = new RegExp(
        [TEXTS.integrationSuccess, TEXTS.integrationFailed].map(escapeForRegExp).join('|')
    );
    await expect(detailsWindow.getByText(uploadOutcome)).toBeVisible();
    await expect(detailsWindow).not.toContainText(TEXTS.notFound);
});

function escapeForRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
