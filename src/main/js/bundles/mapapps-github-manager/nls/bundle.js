/*
 * Copyright (C) 2021 con terra GmbH (info@conterra.de)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
module.exports = {
    root: {
        bundleName: "GitHub Bundle Management",
        bundleDescription: "Integrate GitHub bundles into your map.apps installation",

        bundleListTool: {
            title: "Developer Network Bundles"
        },
        highlightBundles: "Selected Highlights",
        allBundles: "All Bundles",
        highlightBundleView: {
            install: "Install",
            openInGithub: "Open in GitHub",
            demo: "Demo"
        },
        dataViewCommon: {
            filter: {
                menuDefaultLabel: "All",
                textBoxPlaceHolder: ""
            },
            pager: {
                backButtonTooltip: "Previous page",
                forwardButtonTooltip: "Next page",
                firstButtonTooltip: "First page",
                lastButtonTooltip: "Last page",
                /**
                 * the page lable literal (template)
                 */
                //pageLabelText: "Page ${currentPage} of ${endPage}",
                pageLabeltext: "Page:",
                /**
                 * the page size label literal (template)
                 */
                pageSizeLabelText: "Items ${pageStartItemNumber}-${pageEndItemNumber} of ${itemCount}"
            }
        },
        bundlesView: {
            noDataMessage: "No bundles available...",
            name: "Name",
            version: "Version",
            demo: "Demo",
            url: "GitHub Homepage",
            title: "Title",
            desc: "Description",
            topics: "map.apps Version",
            stars: "Stars",
            modifiedBy: "Modified By",
            modifiedAt: "Modified At",
            productName: "Product Name"
        },
        bundleDetailsView: {
            windowTitle: "Bundle '{name}'",
            createWindowTitle: "Bundle Upload",
            noReleasesYet: "Sorry, this bundle doesn't have any releases yet.",
            noReleasesTitle: "No releases found",
            notFound: "Sorry, we could not locate this bundle on GitHub.",
            integrationFailed: "Sorry, the bundle could not be integrated into map.apps.",
            downloading: "Fetching bundle",
            uploading: "Storing bundle",
            integrationSuccess: "Bundle installed.",
            name: "Name",
            version: "Version",
            location: "Location",
            title: "Title:",
            description: "Description:",
            createdAt: "Created At:",
            createdBy: "Created By:",
            modifiedAt: "Modified At:",
            modifiedBy: "Modified By:",
            productName: "Product Name:",
            id: "ID:",
            installButton: "Install",
            instructions: "Please choose the desired bundle version and press 'Install'",
            license: "Developer Network Bundles are subject to their own license terms. Details about the license can be found in the respective GitHub repository. By installing the bundle, you accept these terms."
        },
        filter:{
            filter: "Filter ",
            four: "Line 4",
            three: "Line 3",
            all: "All"
        }
    },
    "de": true
};
