/*
 * Copyright (C) 2017 con terra GmbH (info@conterra.de)
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
    "dojo/_base/declare", "ct/store/ComplexMemory", "ct/util/TypeFormat", "ct/_when", "apprt-request", "dojo/_base/lang", "dojo/_base/array"
], function (declare, ComplexMemory, TypeFormat, ct_when, apprt_request, d_lang, d_array) {
    return declare([ComplexMemory], {
        jsonp: true,
        constructor: function () {
            if (TypeFormat["stars"]) {
                return;
            }
            // register new formatter at ct/util/TypeFormatter class
            TypeFormat["stars"] = function (value) {
                var star = '<svg aria-label="stars" class="octicon octicon-star" height="16" role="img" version="1.1" viewBox="0 0 14 16" width="14"><path fill="#f1c40f" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74z"></path></svg>'
                return star + " " + value;
            };

            this.metadata = {
                title: "Bundle Service",
                displayField: "name",
                fields: [{
                    "name": this.idProperty,
                    "type": "string",
                    "identifier": true
                }, {
                    "name": "name",
                    "type": "string"
                }, {
                    "name": "description",
                    "type": "string"
                }, {
                    "name": "releases_url",
                    "type": "link"
                }, {
                    "name": "html_url",
                    "type": "link"
                }, {
                    "name": "updated_at",
                    "type": "datetime"
                }, {
                    "name": "stargazers_count",
                    "type": "string",
                    "subtype": "stars"
                }]
            };
            this.target = this.target.lastIndexOf("/") === (this.target.length - 1) ? this.target.substring(0, this.target.lastIndexOf("/")) : this.target;

            var url = this.target + this.searchString + "&per_page=100";
            
            var request = apprt_request(url,
                {useProxy: false});

            ct_when(request, function (data) {

                this.setData(data);
            }, this.handleError, this);
        },
        handleError: function (error) {
            console.error(error);
            throw error;
        },
        getBundleDetails: function (id, options) {
            return d_array.filter(this.data, function (bundle) {
                return bundle.id === id;
            });
        }
    });
});
