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
import { AsyncInMemoryStore } from "store-api/InMemoryStore";
import TypeFormat from "ct/util/TypeFormat";
import apprt_request from "apprt-request";
import stringEscape from "apprt-core/string-escape";

export default class BundleStoreFactory {
    #storeInstance = undefined;
    async activate() {
        registerCustomTypeFormatters();
        const { target, user, topic, highlightTopic } = this._properties;
        const data = await fetchBundlesFromGitHub(target, user, topic);

        this.#storeInstance = new AsyncInMemoryStore({
            idProperty: "id",
            data,
            metadata: storeMetadata()
        });
        // used as topic keyword BundleTopWidget
        this.#storeInstance.highlightTopic = highlightTopic;
    }
    createInstance() {
        return this.#storeInstance;
    }
    destroyInstance() {
        this.#storeInstance = undefined;
    }
}

async function fetchBundlesFromGitHub(target, user, topic) {
    target = target.replace(/\/+$/, "");
    let url = target + "?q=user%3A" + user;
    if (topic !== "") {
        url = url + "+topic%3A" + topic;
    }
    url = url + "&per_page=100";
    try {
        const data = await apprt_request(url, {
            useProxy: false,
            headers: {
                Accept: "application/vnd.github.mercy-preview+json"
            }
        });
        const filteredData = data.items.filter((item) => item.topics.includes("4x"));
        return filteredData;
    } catch (e) {
        console.error(`Error fetching data from github ${url}:`, e);
        throw e;
    }
}

function registerCustomTypeFormatters() {
    if (TypeFormat["stars"]) {
        return;
    }
    // register new formatter at ct/util/TypeFormatter class
    TypeFormat["stars"] = function (value) {
        // eslint-disable-next-line max-len
        const star =
            '<svg aria-label="stars" class="octicon octicon-star" height="16" role="img" version="1.1" viewBox="0 0 14 16" width="14"><path fill="#f1c40f" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74z"></path></svg>';
        return {
            html: `${star} ${stringEscape(value)}`
        };
    };

    if (TypeFormat["version"]) {
        return;
    }
    // register new formatter at ct/util/TypeFormatter class
    TypeFormat["version"] = function (value) {
        const version = [];
        if (value.includes("4x")) {
            version.push("4x");
        }
        // if (value.includes('3x')) {
        //     version.push('3x');
        // }
        return version;
    };
}

function storeMetadata() {
    return {
        title: "Bundle Service",
        displayField: "name",
        fields: [
            {
                name: "id",
                type: "string",
                identifier: true
            },
            {
                name: "name",
                type: "string"
            },
            {
                name: "description",
                type: "string"
            },
            {
                name: "releases_url",
                type: "link"
            },
            {
                name: "html_url",
                type: "link"
            },
            {
                name: "homepage",
                type: "link"
            },
            {
                name: "updated_at",
                type: "datetime"
            },
            // {
            //     "name": "fourXsupport",
            //     "type": "boolean"
            // },
            // {
            //     "name": "threeXsupport",
            //     "type": "boolean"
            // },
            {
                name: "topics",
                type: "string",
                subtype: "version"
            },
            {
                name: "stargazers_count",
                type: "string",
                subtype: "stars"
            }
        ]
    };
}
