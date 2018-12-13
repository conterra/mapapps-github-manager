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
import "dijit/layout/BorderContainer";
import "dijit/layout/ContentPane";

const FilterHandler = declare([_Widget], {
    activate: function (ctx) {
    },
    deactivate: function () {
        this.disconnect();
    },
    filter4x: function () {
        if('3.x' in this._githubBundlesDataView.model.namedQueries._namedQueries){
            this._githubBundlesDataView.model.removeNamedQuery('3.x')
        }
        if('4.x' in this._githubBundlesDataView.model.namedQueries._namedQueries){
           return
        }
        this._githubBundlesDataView.model.setNamedQuery({
            name: "4.x", //  the name of the query. We use this to remove or overwrite this query later
            query: {
                fourXsupport: {"$eq": true}
            }  // the actual query object
        });
    },

    filter3x: function () {
        if('4.x' in this._githubBundlesDataView.model.namedQueries._namedQueries){
            this._githubBundlesDataView.model.removeNamedQuery('4.x')
        }
        if('3.x' in this._githubBundlesDataView.model.namedQueries._namedQueries){
            return
        }
        this._githubBundlesDataView.model.setNamedQuery({
            name: "3.x", //  the name of the query. We use this to remove or overwrite this query later
            query: {
                threeXsupport: {"$eq": true}
            }  // the actual query object
        });
    },

    clearFilter: function () {
        if('3.x' in this._githubBundlesDataView.model.namedQueries._namedQueries){
            this._githubBundlesDataView.model.removeNamedQuery('3.x')
        }
        if('4.x' in this._githubBundlesDataView.model.namedQueries._namedQueries){
            this._githubBundlesDataView.model.removeNamedQuery('4.x')
        }
    }

});

module.exports = FilterHandler;
