# discovery-fra

__Local Development__
1. Change frauLocalAppResolver's hostname config in package.json to your hostname
example:
```json
  "frauLocalAppResolver": {
    ...
    "hostname": "10.128.40.137",
    ...
  },
```
2. `npm run start`
3. Output from previous step will look like:
```
  app-class: urn:d2l:fra:class:discovery
  app-config: http://10.128.40.137:3000/app/appconfig.json
```
4. Use LE's Free-Range App Manager and use the above app-config