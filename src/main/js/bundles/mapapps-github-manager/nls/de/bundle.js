/*
 * Copyright (C) 2018 con terra GmbH (info@conterra.de)
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
    bundleName: "GitHub Bundle Installer",
    bundleDescription: "Bietet eine Oberfl\u00E4che zur GitHub-Bundle-Installation",
    bundleListTool: {
        title: "Developer Network Bundles"
    },
    highlightBundles: "Ausgew\u00E4hlte Highlights",
    allBundles: "Alle Bundles",
    highlightBundleView: {
        install: "Installieren",
        openInGithub: "In GitHub \u00f6ffnen",
        demo: "Demo"
    },
    dataViewCommon: {
        filter: {
            menuDefaultLabel: "Alle",
            textBoxPlaceHolder: ""
        },
        pager: {
            backButtonTooltip: "Vorherige Seite",
            forwardButtonTooltip: "N\u00E4chste Seite",
            firstButtonTooltip: "Erste Seite",
            lastButtonTooltip: "Letzte Seite",
            /**
             * the page lable literal (template)
             */
            pageLabelText: "Seite:",
            /**
             * the page size label literal (template)
             */
            pageSizeLabelText: "Treffer ${pageStartItemNumber}-${pageEndItemNumber} von ${itemCount}"
        }
    },
    bundlesView: {
        noDataMessage: "Es sind keine Bundles vorhanden...",
        name: "Name",
        version: "Version",
        title: "Titel",
        desc: "Beschreibung",
        topics: "map.apps Version",
        demo: "Demo",
        url: "GitHub Homepage",
        stars: "Stars",
        modifiedBy: "Ge\u00E4ndert durch",
        modifiedAt: "Ge\u00E4ndert am",
        productName: "Produktname"
    },
    bundleDetailsView: {
        windowTitle: "Bundle '{name}'",
        createWindowTitle: "Bundle hochladen",
        noReleasesYet: "Dieses Bundle hat leider noch keine Releases.",
        noReleasesTitle: "Kein Release gefunden",
        notFound: "Das Bundle konnte leider nicht von GitHub heruntergeladen werden.",
        integrationFailed: "Ein Fehler trat auf, das Bundle konnte leider nicht in map.apps integriert werden.",
        integrationSuccess: "Bundle installiert.",
        uploading: "Speichere Bundle",
        downloading: "Lade Bundle",
        name: "Name:",
        version: "Version:",
        location: "Ort:",
        title: "Titel:",
        description: "Beschreibung:",
        createdAt: "Erstellt am:",
        createdBy: "Erstellt durch:",
        modifiedBy: "Ge\u00E4ndert durch",
        modifiedAt: "Ge\u00E4ndert am",
        productName: "Produktname:",
        id: "ID:",
        installButton: "Installieren",
        instructions: "Wählen Sie die gewünschte Version und klicken anschließend auf 'Installieren'"
    },
    filter: {
        filter: "Filter ",
        four: "Linie 4",
        three: "Linie 3",
        all: "Alle"
    }

};
