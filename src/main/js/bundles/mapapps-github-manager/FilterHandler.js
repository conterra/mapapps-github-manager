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
// import declare from "dojo/_base/declare";
// import _Widget from "dijit/_Widget";
// import "dijit/layout/BorderContainer";
// import "dijit/layout/ContentPane";
// import css from "ct/util/css";

// export default declare([_Widget], {
//     filter4x: function (e) {
//         console.log("Filter: 4x");
//         if ('4.x' in this._githubBundlesDataView.model.namedQueries._namedQueries) {
//             return
//         }
//         if (this.activeFilter) {
//             css.toggleClass(this.activeFilter, 'dijitChecked'); //adds class if its not added yet, else removes
//         }
//         if ('3.x' in this._githubBundlesDataView.model.namedQueries._namedQueries) {
//             this._githubBundlesDataView.model.removeNamedQuery('3.x')
//         }

//         this._githubBundlesDataView.model.setNamedQuery({
//             name: "4.x", //  the name of the query. We use this to remove or overwrite this query later
//             query: {
//                 fourXsupport: {"$eq": true}
//             }  // the actual query object
//         });

//         css.toggleClass(e.buttonEvent.target.parentElement, 'dijitChecked');
//         this.activeFilter = e.buttonEvent.target.parentElement;
//     },

//     filter3x: function (e) {
//         console.log("Filter: 3x");
//         if ('3.x' in this._githubBundlesDataView.model.namedQueries._namedQueries) {
//             return
//         }
//         if (this.activeFilter) {
//             css.toggleClass(this.activeFilter, 'dijitChecked'); //adds class if its not added yet, else removes
//         }
//         if ('4.x' in this._githubBundlesDataView.model.namedQueries._namedQueries) {
//             this._githubBundlesDataView.model.removeNamedQuery('4.x')
//         }
//         this._githubBundlesDataView.model.setNamedQuery({
//             name: "3.x", //  the name of the query. We use this to remove or overwrite this query later
//             query: {
//                 threeXsupport: {"$eq": true}
//             }  // the actual query object
//         });
//         css.toggleClass(e.buttonEvent.target.parentElement, 'dijitChecked');
//         this.activeFilter = e.buttonEvent.target.parentElement;
//     },

//     clearFilter: function (e) {
//         console.log("Filter: Clear");
//         if (this.activeFilter === e.buttonEvent.target.parentElement) {
//             return;
//         }
//         if (this.activeFilter) {
//             css.toggleClass(this.activeFilter, 'dijitChecked'); //adds class if its not added yet, else removes
//         }
//         if ('3.x' in this._githubBundlesDataView.model.namedQueries._namedQueries) {
//             this._githubBundlesDataView.model.removeNamedQuery('3.x')
//         }
//         if ('4.x' in this._githubBundlesDataView.model.namedQueries._namedQueries) {
//             this._githubBundlesDataView.model.removeNamedQuery('4.x')
//         }
//         css.toggleClass(e.buttonEvent.target.parentElement, 'dijitChecked');
//         this.activeFilter = e.buttonEvent.target.parentElement;
//     }

// });
