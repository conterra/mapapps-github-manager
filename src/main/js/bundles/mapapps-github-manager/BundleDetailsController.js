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
define([
    "dojo/_base/lang", "dojo/_base/declare", "ct/_Connect", "ct/_when", "ct/Hash", "dojo/json", "ct/util/TypeFormat", "apprt-request", "ct/store/ComplexMemory"
], function (d_lang, declare, _Connect, ct_when, Hash, JSON, TypeFormat, apprt_request, ComplexMemory) {


    return declare([_Connect], {
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
                "h": 90
            },
            "children": [{
                "type": "label",
                "cssClass": "title",
                "value": "${instructions}",
                "size": {
                    "t": 0,
                    "l": 5
                }
            },
                {
                    "type": "label",
                    "value": "${version}",
                    "size": {
                        "t": 45,
                        "l": 5
                    }
                },
                {
                    "type": "selectbox",
                    "field": "tagSelection",
                    "searchable": false,
                    "store": "tagsStore",
                    "required": true,
                    "size": {
                        "t": 40,
                        "l": 60
                    }
                }, {
                    "type": "button",
                    "value": "${installButton}",
                    "size": {
                        "t": 40,
                        "r": 5
                    }
                }
            ]
        },
        /**
         * @constructs
         */
        constructor: function () {
        }
        ,
        activate: function (ctx) {
            var i18n = this.i18n = this._i18n.get().bundleDetailsView;
            this.effectiveWidgetDefinition = this._substituteWidgetDefinition(this.widgetDefinition, i18n);
            this.bCtx = ctx.getBundleContext();

        }
        ,
        deactivate: function () {
            this.effectiveWidgetDefinition = null;
            this.i18n = null;
            this.disconnect();
        }
        ,
        showDetails: function (params) {

            var i18n = this.i18n;
            var id = params.getProperty("id");
            if (!id) {
                return;
            }
            var item = this.store.getBundleDetails(id);
            if (item.length && item[0].has_downloads) {
                this.currentItem = item[0];
                this._createWindow(this.currentItem, i18n);
            }
            else {

                //todo handle case if no downloads are available
            }
        }
        ,
        _createWindow: function (item, i18n) {

            var tagsUrl = "https://api.github.com/repos/conterra/" + item.name + "/releases";
            var id = "tagsStore";

            ct_when(apprt_request(tagsUrl, {jsonp: true}), function (response) {

                var content;

                if (response.data.length) {
                    var tagsStore = new ComplexMemory({
                        id: id,
                        idProperty: "name",
                        data: response.data
                    });

                    this.bCtx.registerService(["ct.api.Store"], tagsStore, {
                        id: id,
                        useIn: ["dataform"]
                    });

                    var widget = this._createWidget(item, i18n);

                    widget.connect(widget, "onControlEvent", d_lang.hitch(this, function (evt, foo) {

                        var buttonWidget = this.buttonWidget = evt.control._getWidget();
                        buttonWidget.set("disabled", true);
                        buttonWidget.set("iconClass", "icon-spinner");

                        this._triggerAddBundleProcess();

                    }));
                    content = widget;

                }
                else {
                    content = i18n.noReleasesYet;
                }
                var w = this.detailWindow = this.windowManager.createModalWindow({
                    title: d_lang.replace(i18n.windowTitle, item),
                    draggable: true,
                    dndDraggable: false,
                    content: content,
                    closable: true
                });
                w.show();
            }, this);


        }
        ,
        _createWidget: function (item, i18n) {
            var dfService = this.dataformService;
            var form = this.form = dfService.createDataForm(this.effectiveWidgetDefinition);
            var binding = dfService.createBinding("object", {
                data: item
            });
            // binding.watch("*", function(name, oldVal, newVal) {
            //     debugger
            //     // called when a property is changed in the object
            // });
            form.set("dataBinding", binding);

            return form;
        }
        ,
        _substituteWidgetDefinition: function (widgetDefinition, params) {
            return new Hash(widgetDefinition).substitute(params, true).asMap();
        }
        ,
        _triggerAddBundleProcess: function () {
            var item = this.currentItem;

            var binding = this.form.get("dataBinding");
            var tag;
            if (binding) {
                tag = binding.data.tagSelection;
            }
            if (tag) {

                var url = "https://github.com/conterra/" + item.name + "/releases/download/" + tag + "/" + item.name + "-bundle.zip";
                this.buttonWidget.set("label",this.i18n.downloading);


                var downloadRequest = this._downloadArchive(url);
                ct_when(downloadRequest, this._uploadBundle, function (error) {
                    this.detailWindow.set("content", this.i18n.notFound);
                }, this);
            }
        }
        ,
        _downloadArchive: function (url) {
            return apprt_request(url, {
                handleAs: "blob"
            });
        }
        ,
        _uploadBundle: function (blob, appId) {

            this.buttonWidget.set("label",this.i18n.uploading);
            var fileName = this.currentItem.name + ".zip";
            var url = this._properties.uploadTarget;
            var formData = new FormData();
            formData.append('file', blob, fileName);
            formData.append("f", "json");
            var uploadRequest = apprt_request.post(url, {
                data: formData
            });

            ct_when(uploadRequest, function (res) {

                this.buttonWidget.set("disabled", false);
                this.buttonWidget.set("iconClass", "icon-sign-success");
                this.buttonWidget.set("class","input-success");
                this.buttonWidget.set("label", this.i18n.integrationSuccess);
                setTimeout(d_lang.hitch(this, function () {
                    this.detailWindow.close()
                }), 1500);
            }, function (e) {

                this.detailWindow.set("content", this.i18n.integrationFailed);

            }, this);
        }
    });
})
;