<template>
    <div>
        <div class="bundleTitle">{{i18n.highlightBundles}}</div>
        <v-carousel v-if="bundles.length>0" :cycle=false :height="350">
            <v-carousel-item v-for="(bundle, index) in bundles" :key="bundle.id">
                <v-container class="bundleInfoContainer">
                    <v-card raised>
                        <v-layout row wrap>
                            <v-flex xs12 sm8 md6>
                                <v-card-title>
                                    <div>
                                        <h3 class="headline mb-0">{{bundle.name}}</h3>
                                    </div>
                                </v-card-title>
                                <v-card-text>
                                    <div class="description">{{bundle.description}}</div>
                                    <!--<div class="chips">
                                        <v-chip v-for="topic in bundle.topics" :key="topic" disabled>{{topic}}</v-chip>
                                    </div>-->
                                </v-card-text>
                                <v-spacer></v-spacer>
                                <v-card-actions>
                                    <v-btn @click="installBundle(bundle.id)" color="primary">
                                        <v-icon class="hidden-sm-and-down" left>icon-download</v-icon>
                                        <span class="hidden-sm-and-down">{{i18n.highlightBundleView.install}}</span>
                                        <v-icon class="hidden-md-and-up">icon-download</v-icon>
                                    </v-btn>
                                    <v-btn @click="openLink(bundle.homepage)" color="info">
                                        <v-icon class="hidden-sm-and-down" left>icon-app-launch</v-icon>
                                        <span class="hidden-sm-and-down">{{i18n.highlightBundleView.demo}}</span>
                                        <v-icon class="hidden-md-and-up">icon-app-launch</v-icon>
                                    </v-btn>
                                    <v-btn @click="openLink(bundle.html_url)" color="info">
                                        <v-icon class="hidden-sm-and-down" left>launch</v-icon>
                                        <span class="hidden-sm-and-down">{{i18n.highlightBundleView.openInGithub}}</span>
                                        <v-icon class="hidden-md-and-up">launch</v-icon>
                                    </v-btn>
                                </v-card-actions>
                            </v-flex>
                            <v-flex xs12 sm4 md6 class="hidden-xs-and-down">
                                <v-img
                                        @click="openLink(bundle.html_url + '/raw/' + bundle.default_branch + '/' + 'screenshot.JPG')"
                                        v-bind:src="bundle.html_url + '/raw/' + bundle.default_branch + '/' + 'screenshot.JPG'"
                                        height="250px">
                                </v-img>
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
        mounted: function () {
            let highlightTopic = this.store.highlightTopic;
            ct_when(this.store.query({}), (results) => {
                this.bundles = results.filter((bundle) => {
                    return !!bundle.topics.includes(highlightTopic);
                });
            });
        },
        components: {},
        data: function () {
            return {
                i18n: {},
                bundles: [],
                selectedTag: null
            };
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
