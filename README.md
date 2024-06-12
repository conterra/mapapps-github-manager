# GitHub Manager
This project is intended to be integrated as a bundle to the installation of your map.apps manager.

## Installation Guide
**Requirement: map.apps 4.14**

Before you add the Bundle to your manager, please configure the user and the topic property in the manifest.json to point to your GitHub account. Topic can be left empty.
You will have to add a released bundle.jar/zip as a bundle in your map.apps manager.
Furthermore, you have to add the following lines to your  `application.properties` or `custom.application.properties`, or `build.properties`:

`proxy.allowedServerUrls = https://github.com,followRedirects:true`

`manager.config.viewbundles=appmanagement,reportmanagement,bundlemanagement,bundleupdatechecker,mapapps-github-manager`

Restart your map.apps instance. You should now see a new tab in the manager view.

### Configurable Components of mapapps-github-manager:

#### BundleStore
 | Property                       | Type    | Possible Values               | Default            | Description                          |
 |--------------------------------|---------|-------------------------------|--------------------|--------------------------------------|
 | user                           | String  |                               |                    | GitHub user name                     |
 | topic                          | String  |                               |                    | Topic used in GitHub                 |


## Quick start

Clone this project and ensure that you have all required dependencies installed correctly (see [Documentation](https://docs.conterra.de/en/mapapps/latest/developersguide/getting-started/set-up-development-environment.html)).

Then run the following commands from the project root directory to start a local development server:

```bash
# install all required node modules
$ mvn initialize

# start dev server
$ mvn compile -Denv=dev -Pinclude-mapapps-deps

# run unit tests
$ mvn test -P run-js-tests,include-mapapps-deps
```
