SOMNUS
======

Minimal, database-agnostic REST API Framework based on Restify

[![Build Status](https://app.travis-ci.com/somnusjs/somnus.svg?branch=master)](https://app.travis-ci.com/somnusjs/somnus)
[![Package Quality](https://npm.packagequality.com/shield/somnus.svg)](https://packagequality.com/#?package=somnus)

## Features

Somnus is a very thin layer wrapping around the [Restify](https://www.npmjs.com/package/restify) Node.js library. It aims to set up foundational features of a web/API framework by adding (sometimes opinionated) out-of-the-box configurations on top of the bare-bone Restify. In short, it helps you:

- set up your web/API platform in the shortest time possible
- implement the use of [Bunyan](https://www.npmjs.com/package/bunyan) logger by default. This in turn discourages the spam of `console.log` which seems convenient at first but eventually will turn your project into a mess
- add utility/helper functions supporting the repetitive, trivial tasks during day-to-day web/API development projects
- integrate with [NGINX Unit](https://www.nginx.com/blog/introducing-nginx-unit/) seamlessly

While the original developer's intention is to add commonly essential features on top of Restify, it's also important to note that the key principal is to keep the codebase as small as possible, living up to Restify's standard of being a lighter library than the colossus we have in [Express.js](https://expressjs.com/). Please keep this in mind should you decide to contribute to Somnus!

## Developer & User notices

Somnus strongly promotes the use of next-gen JavaScript (ES6, ES7, etc.). Hence, it will most likely always enforce the latest [LTS version of Node.js](https://github.com/nodejs/LTS) (for example `10.14.2` when this project was first started). Besides, it encourages the use of [modern JS features](https://github.com/lukehoban/es6features) such as **arrow functions**, **const identifier** and others (where they make sense).

Starting v8.2.0, somnus has NGINX Unit integration support built in. Please see [this section](#usage-with-nginx-unit) for details.

## Installation

With [Node.js](https://nodejs.org) and [npm](https://www.npmjs.com/) installed, simply run:

```bash
# installs a production build of this framework from the global npm repo
npm install somnus
```

## Build

> Note: this section is only for contributors. If you only need to use Somnus, the installation step above is enough.

You can build the framework yourself by checking out this repository, `cd`ing into it then running the `build` or `build:prod` npm script, for example:

```bash
# installs the toolchains needed for the build process
npm install

# outputs a development build into `lib/`
npm run build

# or if you want a production build
npm run build:prod
```

> TBA: explain the difference between development and production builds

## Usage

```javascript
import somnus from 'somnus';
// or const somnus = require('somnus').default;

// you can add routes via the standard syntax
// as you would normally do with `express` or `restify`
somnus.server.get('/echo', (req, res) => res.send('echo echo'));

// or you can add routes by declaring a `routeConfig` object,
// which is then passed into `somnus.start()`
const routeConfig = {
  'get /hello': (req, res) => res.send('world')
}
somnus.start({ routeConfig });

// from now on, all routes added above are available. Go ahead and test these
// paths with `curl` or your favourite web browser:
// - `/echo`
// - `/hello`
```

## Usage with NGINX Unit

Support for [NGINX Unit](https://www.nginx.com/blog/introducing-nginx-unit/) is available starting from `somnus@8.2.0`. To use your `somnus`-based application with NGINX Unit, you need to:
1. ensure the `unit-http` module is installed (`npm i -g unit-http`). NGINX [recommends](https://unit.nginx.org/installation/#node-js) a global installation of this module
    - if you fail to install this module, be sure to follow up [Unit's installation guide](http://unit.nginx.org/installation/) itself first. For example, MacOS users may want to follow the [homebrew guide](https://github.com/nginx/homebrew-unit).
2. `cd` into your existing `somnus`-based application (where `somnus` is at least at v8.2.0)
3. link `unit-http` into your application (`npm link unit-http`) (as instructed [here](https://unit.nginx.org/howto/samples/#node-js))
4. add the line `#!/usr/bin/env node` on top of the entry file of your app
    - if you have troubles adding the above shebang line to your webpack-compiled module, try using `webpack.BannerPlugin` like so: `new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true })`, as shared in [this SO answer](https://stackoverflow.com/a/40763389/3429055).
5. make the entry file executable (e.g. `chmod +x /path/to/your/entry.js`)

and voilà, you can start it up with NGINX Unit as instructed in [this tutorial](https://unit.nginx.org/howto/samples/#node-js)

Further integration instructions are available in [this documentation](docs/nginx-unit-integration.md)

## ENV variables

- `UNIX_SOCKET`: the unix socket at which the underlying `http` server listens, defaults to `undefined`, taking precedence over `HOST` and `PORT` (explained below) when defined
- `HOST`: the host at which the underlying `http` server listens, defaults to `localhost`
- `PORT`: the port at which the underlying `http` server listens, defaults to a random available port on your system
- `LOG_LEVEL`: enum of [bunyan log levels](https://github.com/trentm/node-bunyan#levels). If set, this will overwrite the default value, which is `warn` for production build and `debug` for development build.
- `TARGET_DIST_BUILD`: **only used** when running tests. If true, the tests are run against the build artifact (`lib/somnus.js`); otherwise, the source file (`src/somnus.ts`)

## Types

For those loving TypeScript: type-def for Somnus is backed directly into the build artifact so you don't have to install anything else. If your IDE somehow doesn't pick up the definitions automatically, please manually check/import the `node_modules/somnus/lib/somnus.d.ts` file.

Also, as Somnus bases itself on Restify, you may benefit from installing `@types/restify` and `@types/restify-errors` in addition (Somnus doesn't bake them in for you).

## Test

The following command will run all tests found under `./test` and its subdirectories:

```bash
npm test
```

Why do we run tests for both `src` and `lib` directories? Because as library authors, we're responsible for ensuring that the build process transpiles & outputs as it should, and the best way to do that is by testing the code from both source and dist.

## Migration

### from v3 to v8
- the **somnus@8** API itself is backward compatible, so you should expect no major breaking changes in this space
- minor TypeScript update is needed (TypeScript will otherwise warn you the same):
  - before: `import somnus, { RouteConfig } from "somnus"`
  - after: `import somnus, { IRouteConfig } from "somnus"`
- as `somnus` is designed to be just a thin wrapper around `restify`, starting v8, its major version will always match that of `restify`. Please consult the corresponding [Restify migration guide](http://restify.com/docs/home/) for breaking changes regarding Restify internal itself.

### from below to v3
- If you have never used **somnus@1** or **somnus@2**, migration is of no concern for you
- If you are using **somnus@1** or **somnus@2**, please understand that **somnus@3** is completely rewritten, and there is no migration path at all between v2 and v3. v3 exposes a different set of APIs and philosophies behind how the entire framework should be used.

FAQs
====

## 1. What special knowledge do I need to fully utilize Somnus?
Familiarity with the [Restify](https://www.npmjs.com/package/restify) library is recommended, though not necessarily to get you started with and profit from Somnus.

## 2. Why Somnus?
Practicality, Productivity, Simplicity, Fun (well, hopefully)

## 3. What is Somnus, again?
**Somnus** is latin for **Sleep** (or at least that's [what Google told the developer](https://translate.google.com/?ie=UTF-8&hl=en&client=tw-ob#la/en/Somnus)). What better fits an API framework created for REST(ful) communications?

## 4. What is Somnus, seriously?
Somnus is aimed to **make mundane day-to-day web/API development tasks as effortlessly fun as possible while maintaining the smallest codebase possible**. Well, at least that's the original intent of the developer, so if you're considering contributing (which is a beautiful thing), please adhere to the said philosophy!

## 5. Why database-agnostic?
`SQL`, `MongoDB`, `RethinkDB` and a plethora of other database solutions have made it easier and more fun than ever before to play with data. At the same time, it gives framework developers a hard time deciding on any database technology to go with and invest in. Somnus is aimed to make things simple and minimal, not to magnify what's already clunky enough. Hence, it's up to Somnus users to choose the database technologies they feel most suitable to their projects.

In fact, Somnus isn't developed with any database driver built-in. It's essentially the **C** in MVC.

## 6. How may I contribute?
Currently, there is no formal contribution guide. It probably makes sense to start there!
