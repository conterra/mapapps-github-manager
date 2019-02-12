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
import ComplexMemory from "ct/store/ComplexMemory";
import TypeFormat from "ct/util/TypeFormat";
import ct_when from "ct/_when";
import apprt_request from "apprt-request";
import d_array from "dojo/_base/array";

export default declare([ComplexMemory], {
    jsonp: true,
    constructor: function () {
        if (TypeFormat["stars"]) {
            return;
        }
        // register new formatter at ct/util/TypeFormatter class
        TypeFormat["stars"] = function (value) {
            let star = '<svg aria-label="stars" class="octicon octicon-star" height="16" role="img" version="1.1" viewBox="0 0 14 16" width="14"><path fill="#f1c40f" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74z"></path></svg>'
            return star + " " + value;
        };

        if (TypeFormat["version"]) {
            return;
        }
        // register new formatter at ct/util/TypeFormatter class
        TypeFormat["version"] = function (value) {
            let version = [];
            if (value.includes('4x')) {
                version.push('4x');
            }
            if (value.includes('3x')) {
                version.push('3x');
            }
            return version;
        };

        this.metadata = {
            title: "Bundle Service",
            displayField: "name",
            fields: [
                {
                    "name": this.idProperty,
                    "type": "string",
                    "identifier": true
                },
                {
                    "name": "name",
                    "type": "string"
                },
                {
                    "name": "description",
                    "type": "string"
                },
                {
                    "name": "releases_url",
                    "type": "link"
                },
                {
                    "name": "html_url",
                    "type": "link"
                },
                {
                    "name": "homepage",
                    "type": "link"
                },
                {
                    "name": "updated_at",
                    "type": "datetime"
                },
                {
                    "name": "fourXsupport",
                    "type": "boolean"
                },
                {
                    "name": "threeXsupport",
                    "type": "boolean"
                },
                {
                    "name": "topics",
                    "type": "string",
                    "subtype": "version"
                },
                {
                    "name": "stargazers_count",
                    "type": "string",
                    "subtype": "stars"
                }
            ]
        };
        this.target = this.target.lastIndexOf("/") === (this.target.length - 1) ? this.target.substring(0, this.target.lastIndexOf("/")) : this.target;
        let url = this.target + "?q=user%3A" + this.user;
        if (this.topic !== "") {
            url = url + "+topic%3A" + this.topic;
        }

        url = url + "&per_page=100";

        let request = apprt_request(url,
            {
                useProxy: false,
                headers: {
                    'Accept': 'application/vnd.github.mercy-preview+json'
                }
            });

        ct_when(request, function (data) {
            data.items.forEach(item => {
                if (item.topics.includes('4x')) {
                    item.fourXsupport = true;
                }
                if (item.topics.includes('3x')) {
                    item.threeXsupport = true;
                }
            });
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
