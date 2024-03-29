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
import d_lang from "dojo/_base/lang";
import declare from "dojo/_base/declare";
import _Connect from "ct/_Connect";
import ct_when from "ct/_when";
import Hash from "ct/Hash";
import apprt_request from "apprt-request";
import ComplexMemory from "ct/store/ComplexMemory";

export default declare([_Connect], {
    // injected
    dataformService: null,
    windowManager: null,
    store: null,
    bCtx: null,
    widgetDefinition: {
        "dataform-version": "1.0.0",
        "showLabels": false,
        "size": {
            "w": 380,
            "h": 190
        },
        "children": [{
            "type": "label",
            "cssClass": "title",
            "value": "${license}",
            "size": {
                "t": 0,
                "l": 5
            }
        }, {
            "type": "label",
            "cssClass": "title",
            "value": "${instructions}",
            "size": {
                "t": 100,
                "l": 5
            }
        }, {
            "type": "label",
            "value": "${version}",
            "size": {
                "t": 145,
                "l": 5
            }
        }, {
            "type": "selectbox",
            "field": "tagSelection",
            "searchable": false,
            "store": "tagsStore",
            "required": true,
            "size": {
                "t": 140,
                "l": 60
            }
        }, {
            "type": "button",
            "value": "${installButton}",
            "size": {
                "t": 140,
                "r": 5
            }
        }]
    },

    /**
     * @constructs
     */
    constructor: function () {
    },

    activate: function (ctx) {
        const i18n = this.i18n = this._i18n.get().bundleDetailsView;
        this.effectiveWidgetDefinition = this._substituteWidgetDefinition(this.widgetDefinition, i18n);
        this.bCtx = ctx.getBundleContext();
    },

    deactivate: function () {
        this.effectiveWidgetDefinition = null;
        this.i18n = null;
        this.disconnect();
    },

    showDetails: function (params) {
        const i18n = this.i18n;
        const id = params.getProperty && params.getProperty("id") || params.id;
        if (!id) {
            return;
        }
        const item = this.store.getBundleDetails(id);
        if (item.length && item[0].has_downloads) {
            this.currentItem = item[0];
            this._createWindow(this.currentItem, i18n);
        } else {

            const w = this.detailWindow = this.windowManager.createModalWindow({
                title: i18n.noReleasesTitle,
                draggable: true,
                dndDraggable: false,
                content: i18n.noReleasesYet,
                closable: true
            });
            w.show();
        }
    },

    _createWindow: function (item, i18n) {
        const tagsUrl = "https://api.github.com/repos/conterra/" + item.name + "/releases";
        const id = "tagsStore";

        ct_when(apprt_request(tagsUrl, {jsonp: true}), function (response) {

            let content;

            if (response.data.length) {
                const releases = response.data.filter((release) => !release.name.includes("SNAPSHOT"));
                releases.sort((a, b) => b.name.replace(/\d+/g, n => +n + 100000)
                    .localeCompare(a.name.replace(/\d+/g, n => +n + 100000)));

                const tagsStore = new ComplexMemory({
                    id: id,
                    idProperty: "name",
                    data: releases // version contained here
                });

                this.bCtx.registerService(["ct.api.Store"], tagsStore, {
                    id: id,
                    useIn: ["dataform"]
                });

                const widget = this._createWidget(item, i18n);

                widget.connect(widget, "onControlEvent", d_lang.hitch(this, function (evt, foo) {

                    const buttonWidget = this.buttonWidget = evt.control._getWidget();
                    buttonWidget.set("disabled", true);
                    buttonWidget.set("iconClass", "icon-spinner");

                    this._triggerAddBundleProcess();

                }));
                content = widget;

            } else {
                content = i18n.noReleasesYet;
            }
            const w = this.detailWindow = this.windowManager.createModalWindow({
                title: d_lang.replace(i18n.windowTitle, item),
                draggable: true,
                dndDraggable: false,
                content: content,
                closable: true
            });
            w.show();
        }, this);


    },

    _createWidget: function (item, i18n) {
        const dfService = this.dataformService;
        const form = this.form = dfService.createDataForm(this.effectiveWidgetDefinition);
        const binding = dfService.createBinding("object", {
            data: item
        });
        form.set("dataBinding", binding);

        return form;
    },

    _substituteWidgetDefinition: function (widgetDefinition, params) {
        return new Hash(widgetDefinition).substitute(params, true).asMap();
    },

    _triggerAddBundleProcess: function () {
        const item = this.currentItem;
        const binding = this.form.get("dataBinding");
        let tag;
        if (binding) {
            tag = binding.data.tagSelection;
        }
        if (tag) {
            const url = "https://github.com/conterra/" + item.name
                + "/releases/download/" + tag + "/"
                + item.name + "-bundle.zip";
            this.buttonWidget.set("label", this.i18n.downloading);


            const downloadRequest = this._downloadArchive(url);
            ct_when(downloadRequest, this._uploadBundle, function (error) {
                this.detailWindow.set("content", this.i18n.notFound);
            }, this);
        }
    },

    _downloadArchive: function (url) {
        return apprt_request(url, {
            handleAs: "blob"
        });
    },

    _uploadBundle: function (blob) {
        this.buttonWidget.set("label", this.i18n.uploading);
        const fileName = this.currentItem.name + ".zip";
        const url = this._properties.uploadTarget;
        const formData = new FormData();
        formData.append('file', blob, fileName);
        formData.append("f", "json");
        const uploadRequest = apprt_request.post(url, {
            data: formData
        });

        ct_when(uploadRequest, function (res) {
            this.buttonWidget.set("disabled", false);
            this.buttonWidget.set("iconClass", "icon-sign-success");
            this.buttonWidget.set("class", "input-success");
            this.buttonWidget.set("label", this.i18n.integrationSuccess);
            setTimeout(d_lang.hitch(this, function () {
                this.detailWindow.close()
            }), 1500);
        }, function (e) {
            this.detailWindow.set("content", this.i18n.integrationFailed);
        }, this);
    }
});
