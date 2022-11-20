# NGINX Unit (unit-http) integration

## Forewords

If you're unsure what NGINX Unit is, then you most likely do NOT need this feature.
It's safe to stop reading now!

## I'm interested, what do I do?

Usually one would initiate the `somnus` library like so:

```javascript
// in the main app e.g. `server.js`
import somnus, { IRouteConfig } from 'somnus';
```

To make the server process compatible with Nginx unit, we can either:

### A. Load the app with a special loader

See [this instruction](https://unit.nginx.org/configuration/#nodejs-1416xandlater)

### B. Patch the internal workings of somnus

By importing `somnus/lib/nginxUnitPatch` BEFORE importing `somnus` itself, you
can ensure the resulted `somnus` server instance is `unit-http` compatible. This way you don't need to load the app with the special loader (as shown above).

```javascript
// in the main app e.g. `server.js`
import 'somnus/lib/nginxUnitPatch';
import somnus, { IRouteConfig } from 'somnus';
```

**IMPORTANT**: note that importing `somnus/lib/nginxUnitPatch` requires us to:
1. have the `unit-http` npm module installed
2. ensure `.node` files are loaded & compilable (in case we use a tool (e.g. `webpack`) to compile our app)

### Miscellaneous

Pro-tip: the patcher import call returns a boolean value reflecting whether
`somnus` was patched successfully with `unit-http` power ;) like so:

```javascript
import isPatched from 'somnus/lib/nginxUnitPatch';
assert(isPatched === true);
```