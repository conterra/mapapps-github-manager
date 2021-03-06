<!--

    Copyright (C) 2021 con terra GmbH (info@conterra.de)

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

-->
<template>
    <div>
        <div class="bundleTitle">
            {{ i18n.highlightBundles }}
        </div>
        <v-carousel
            v-if="bundles.length>0"
            :cycle="false"
            :height="320"
        >
            <v-carousel-item
                v-for="bundle in bundles"
                :key="bundle.id"
            >
                <v-container class="bundleInfoContainer">
                    <v-card raised>
                        <v-layout
                            row
                            wrap
                        >
                            <v-flex
                                xs12
                                sm8
                                md6
                            >
                                <v-card-title>
                                    <div>
                                        <h3 class="headline mb-0">
                                            {{ bundle.name }}
                                        </h3>
                                    </div>
                                </v-card-title>
                                <v-card-text>
                                    <div class="description">
                                        {{ bundle.description }}
                                    </div>
                                </v-card-text>
                                <v-spacer />
                                <v-card-actions>
                                    <v-btn
                                        color="primary"
                                        @click="installBundle(bundle.id)"
                                    >
                                        <v-icon
                                            class="hidden-sm-and-down"
                                            left
                                        >
                                            icon-download
                                        </v-icon>
                                        <span class="hidden-sm-and-down">{{ i18n.highlightBundleView.install }}</span>
                                        <v-icon class="hidden-md-and-up">
                                            icon-download
                                        </v-icon>
                                    </v-btn>
                                    <v-btn
                                        color="info"
                                        @click="openLink(bundle.homepage)"
                                    >
                                        <v-icon
                                            class="hidden-sm-and-down"
                                            left
                                        >
                                            icon-app-launch
                                        </v-icon>
                                        <span class="hidden-sm-and-down">{{ i18n.highlightBundleView.demo }}</span>
                                        <v-icon class="hidden-md-and-up">
                                            icon-app-launch
                                        </v-icon>
                                    </v-btn>
                                    <v-btn
                                        color="info"
                                        @click="openLink(bundle.html_url)"
                                    >
                                        <v-icon
                                            class="hidden-sm-and-down"
                                            left
                                        >
                                            launch
                                        </v-icon>
                                        <span
                                            class="hidden-sm-and-down"
                                        >
                                            {{ i18n.highlightBundleView.openInGithub }}
                                        </span>
                                        <v-icon class="hidden-md-and-up">
                                            launch
                                        </v-icon>
                                    </v-btn>
                                </v-card-actions>
                            </v-flex>
                            <v-flex
                                xs12
                                sm4
                                md6
                                class="hidden-xs-and-down"
                            >
                                <v-img
                                    :src="bundle.html_url + '/raw/' + bundle.default_branch + '/' + 'screenshot.JPG'"
                                    height="250px"
                                    @click="openLink(bundle.html_url + '/raw/' + bundle.default_branch + '/' + 'screenshot.JPG')"
                                />
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-container>
            </v-carousel-item>
        </v-carousel>
    </div>
</template>
<script>
    import Bindable from "apprt-vue/mixins/Bindable";
    import ct_when from "ct/_when";

    export default {
        mixins: [Bindable],
        data: function () {
            return {
                i18n: {},
                bundles: [],
                selectedTag: null
            };
        },
        mounted: function () {
            const highlightTopic = this.store.highlightTopic;
            ct_when(this.store.query({}), (results) => {
                this.bundles = results.filter((bundle) => !!bundle.topics.includes(highlightTopic));
            });
        },
        methods: {
            openLink: function (url) {
                window.open(url, '_blank');
            },
            installBundle: function (id) {
                this.bundleDetailsController.showDetails({
                    id: id
                });
            }
        }
    };
</script>
