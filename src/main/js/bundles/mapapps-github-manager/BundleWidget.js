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
import declare from "dojo/_base/declare";
import _Widget from "dijit/_Widget";
import domConstruct from "dojo/dom-construct";
import _TemplatedMixin from "dijit/_TemplatedMixin";
import _WidgetsInTemplateMixin from "dijit/_WidgetsInTemplateMixin";
import template from "dojo/text!./templates/BundleWidget.html";
import "dijit/layout/BorderContainer";
import "dijit/layout/ContentPane";

const BundleWidget = declare([_Widget, _TemplatedMixin, _WidgetsInTemplateMixin], {

    baseClass: "bundleWidget",
    templateString: template,

    postCreate: function () {
        this.inherited(arguments);
        this._centerContentPane.set("content", this.githubBundlesDataView);
        domConstruct.place(this.topWidget.domNode, this._topContentPane.domNode);
    },

    resize: function (dims) {
        this._container.resize(dims);
    }
});

module.exports = BundleWidget;