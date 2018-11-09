# discovery-fra

__Local Development__

1. `npm install`
2. `npm run start`
If the hostname doesn't get properly resolved, try changing the --hostname parameter for both `frau-appconfig-builder` and `frau-local-appresolver`
3. Output will look like:
```
  app-class: urn:d2l:fra:class:discovery
  app-config: http://{HOST_ADDRESS}:{PORT}/app/appconfig.json
```
4. Use LE's Free-Range App Manager and use the above app-config