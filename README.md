# discovery-fra

## Usage

### Setup

1. `npm install`
2. `npm run start`
If the hostname doesn't get properly resolved, try changing the --hostname parameter for both `frau-appconfig-builder` and `frau-local-appresolver`
3. Output will look like:
```
  app-class: urn:d2l:fra:class:discovery
  app-config: http://{HOST_ADDRESS}:{PORT}/app/appconfig.json
```
4. Use LE's Free-Range App Manager and use the above app-config

### Tests

To run tests:
```
npm run test
```

## Deployment

### Development

Commits on any branch are deployed to the Dev Brightspace CDN. Check the publish job from CircleCI of your corresponding branch for the published URL.

To build and host via iFrauToaster, run `npm run buildDev`.
To test against a custom ifrautoaster configuration:
	- create your config file in the root folder as `ifrautoaster-custom.json`. This file will not be commited.
	- run `npm run buildDev:custom`.
You should be able to view the fra at http://localhost:9090/d2l/le/discovery/view/home.
While hosting, it should rebuild after editing the source or lang files, so disable browser caching and refresh your browser after build completion to view changes.

### Production

#### Publish to CDN
Use `npm version` to update the package version as well as commit a tag.

```
npm version #.#.# -m "Version: %s"
git push origin master --tags
```

This will trigger a CircleCI job to publish to the Production Brightspace CDN.

#### Update CDN Manager

Please familiarize yourself with the README for https://github.com/Brightspace/cdn-manager.

Corresponding cdn-manager file for this FRA: https://github.com/Brightspace/cdn-manager/blob/master/app-inventory/discovery.json
