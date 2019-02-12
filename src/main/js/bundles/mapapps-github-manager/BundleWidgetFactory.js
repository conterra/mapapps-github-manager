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

import BundleWidget from "./BundleWidget";
import BundleTopWidget from "./BundleTopWidget.vue";
import Vue from "apprt-vue/Vue";
import VueDijit from "apprt-vue/VueDijit";

export default class BundleWidgetFactory {

    activate() {
        let i18n = this._i18n.get();
        const vm = new Vue(BundleTopWidget);
        this.topWidget = VueDijit(vm);
        vm.store = this.store;
        vm.bundleDetailsController = this._bundleDetailsController;
        vm.i18n = i18n;
    }

    createInstance() {
        let i18n = this._i18n.get();
        return new BundleWidget({
            i18n: i18n,
            githubBundlesDataView: this._githubBundlesDataView,
            topWidget: this.topWidget
        });
    }

}

