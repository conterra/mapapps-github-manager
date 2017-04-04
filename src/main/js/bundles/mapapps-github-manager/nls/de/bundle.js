/*
 * Copyright (C) 2015 con terra GmbH (info@conterra.de)
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
define({
    bundleName: "GitHub Bundle Installer",
    bundleDescription: "Bietet eine Oberfl\u00E4che zur GitHub-Bundle-Installation",
    commonDelete: {
        saveQuery: "Wollen Sie wirklich {number} Element(e) l\u00F6schen?",
        error: "Das L\u00F6schen der Elemente '{items}' ist fehlgeschlagen!",
        partialSuccess: "Einige Elemente konnten nicht gel\u00F6scht werden!",
        errorFinish: "Kein Element konnte gel\u00F6scht werden!",
        success: "Der L\u00F6schvorgang wurde erfolgreich beendet!"
    },
    bundleListTool: {
        title: "GitHub",
        desc: "Liste von GitHub Bundles"
    },
    removeSelectedBundlesTool: {
        title: "L\u00F6schen",
        desc: "L\u00F6sche Bundle"
    },
    createBundleTool: {
        title: "Hochladen",
        desc: "Bundles hochladen"
    },
    dataViewCommon: {
        filter: {
            textBoxPlaceHolder: "",
            menuDefaultLabel: "Alle"
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
        installButton: "Bundle installieren",
        instructions: "Wählen Sie die gewünschte Version und klicken anschließend auf 'Installieren'"
    }
});