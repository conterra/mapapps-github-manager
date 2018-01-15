# GitHub Manager


This project is intended to be integrated as a bundle in the destination installation of your map.apps manager.

Installation Guide
------------------

You will have to add a released bundle.jar/zip as a bundle in your map.apps manager. 
Furthermore, you have to add the following lines to your  `application.properties` or `custom.application.properties`, or `build.properties`:


`proxy.allowedServerUrls = https://github.com,followRedirects:true`

`manager.config.viewbundles=appmanagement,reportmanagement,bundlemanagement,bundleupdatechecker,mapapps-github-manager`

Restart your map.apps instance. You should now see a new tab in the manager view.

Attention
---------

The included sample app is just for ui design. Functional tests can only be performed in full installed map.apps manager (role=maAdmin).