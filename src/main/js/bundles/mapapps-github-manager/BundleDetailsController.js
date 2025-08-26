/*
 * Copyright (C) 2023 con terra GmbH (info@conterra.de)
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
import Hash from "ct/Hash";
import { apprtFetch, apprtFetchJson } from "apprt-fetch";
import { replace } from "apprt-core/string-replace";
import { sourceId } from "source-info!";
import { loggerForName } from "apprt-core/Logger";
const LOG = loggerForName(sourceId);

export default class BundleDetailsController {
    // injected
    dataformService = null;
    windowManager = null;
    store = null;
    bCtx = null;
    widgetDefinition = {
        "dataform-version": "1.0.0",
        "showLabels": false,
        "size": {
            w: 380,
            h: 190
        },
        "children": [
            {
                type: "label",
                cssClass: "title",
                value: "${license}",
                size: {
                    t: 0,
                    l: 5
                }
            },
            {
                type: "label",
                cssClass: "title",
                value: "${instructions}",
                size: {
                    t: 100,
                    l: 5
                }
            },
            {
                type: "label",
                value: "${version}",
                size: {
                    t: 145,
                    l: 5
                }
            },
            {
                type: "selectbox",
                field: "tagSelection",
                searchable: false,
                values: {
                    field: "availableTags"
                },
                required: true,
                size: {
                    t: 140,
                    l: 60
                }
            },
            {
                type: "button",
                value: "${installButton}",
                size: {
                    t: 140,
                    r: 5
                }
            }
        ]
    };

    activate(ctx) {
        const i18n = (this.i18n = this._i18n.get().bundleDetailsView);
        this.effectiveWidgetDefinition = this._substituteWidgetDefinition(this.widgetDefinition, i18n);
        this.bCtx = ctx.getBundleContext();
    }

    deactivate() {
        this.effectiveWidgetDefinition = null;
        this.i18n = null;
        this.disconnect();
    }

    async showDetails(params) {
        const i18n = this.i18n;
        const id = (params.getProperty && params.getProperty("id")) || params.id;
        if (!id) {
            return;
        }
        const item = await this.store.get(id);
        if (item?.has_downloads) {
            this._createWindow(item, i18n);
        } else {
            const w = (this.detailWindow = this.windowManager.createModalWindow({
                title: i18n.noReleasesTitle,
                draggable: true,
                dndDraggable: false,
                content: i18n.noReleasesYet,
                closable: true
            }));
            w.show();
        }
    }

    async _lookupAvailableTags(repositoryName) {
        const tagsUrl = "https://api.github.com/repos/conterra/" + repositoryName + "/releases";
        try {
            const data = await apprtFetchJson(tagsUrl, {
                proxyMode: "force-off"
            });
            const releases = data.filter((release) => !release.name.includes("SNAPSHOT"));
            releases.sort((a, b) =>
                b.name.replace(/\d+/g, (n) => +n + 100000).localeCompare(a.name.replace(/\d+/g, (n) => +n + 100000))
            );
            return releases.map((r) => r.name);
        } catch (e) {
            console.error("Could not fetch tags from " + tagsUrl, e);
            return [];
        }
    }

    async _createWindow(item, i18n) {
        const tags = await this._lookupAvailableTags(item.name);

        let content;

        if (tags.length) {
            const widget = this._createWidget(item, tags);
            widget.on("ControlEvent", (evt) => {
                const buttonWidget = (this.buttonWidget = evt.control._getWidget());
                buttonWidget.set("disabled", true);
                buttonWidget.set("iconClass", "icon-spinner");
                this._triggerAddBundleProcess(widget);
            });
            content = widget;
        } else {
            content = i18n.noReleasesYet;
        }
        const w = (this.detailWindow = this.windowManager.createModalWindow({
            title: replace(i18n.windowTitle, item),
            draggable: true,
            dndDraggable: false,
            content: content,
            closable: true
        }));
        w.show();
    }

    _createWidget(item, tags) {
        const dfService = this.dataformService;
        const form = dfService.createDataForm(this.effectiveWidgetDefinition);
        const binding = dfService.createBinding("object", {
            data: {
                tagSelection: null,
                availableTags: tags,
                item
            }
        });
        form.set("dataBinding", binding);
        return form;
    }

    _substituteWidgetDefinition(widgetDefinition, params) {
        return new Hash(widgetDefinition).substitute(params, true).asMap();
    }

    async _triggerAddBundleProcess(form) {
        const binding = form.get("dataBinding");
        const tag = binding.data.tagSelection;
        const item = binding.data.item;

        const url =
            "https://github.com/conterra/" + item.name + "/releases/download/" + tag + "/" + item.name + "-bundle.zip";
        this.buttonWidget.set("label", this.i18n.downloading);

        try {
            const blob = await this._downloadArchive(url);
            await this._uploadBundle(blob, item.name);
        } catch (e) {
            this.detailWindow.set("content", this.i18n.notFound);
        }
    }

    async _downloadArchive(url) {
        // Currently throws a CORS error (from GitHub) and then uses the map.apps proxy.
        const response = await apprtFetch(url, { checkStatus: true });
        return await response.blob();
    }

    async _uploadBundle(blob, itemName) {
        this.buttonWidget.set("label", this.i18n.uploading);
        const fileName = itemName + ".zip";
        const url = this._properties.uploadTarget;
        const formData = new FormData();
        formData.append("file", blob, fileName);
        formData.append("f", "json");
        try {
            await apprtFetch(url, {
                method: "POST",
                body: formData,
                checkStatus: true,
                proxyMode: "force-off"
            });
            this.buttonWidget.set("disabled", false);
            this.buttonWidget.set("iconClass", "icon-sign-success");
            this.buttonWidget.set("class", "input-success");
            this.buttonWidget.set("label", this.i18n.integrationSuccess);
            setTimeout(() => {
                this.detailWindow.close();
            }, 1500);
        } catch (e) {
            LOG.error("Failed to upload bundle", e);
            this.detailWindow.set("content", this.i18n.integrationFailed);
        }
    }
}
