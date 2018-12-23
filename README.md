SOMNUS
======

Minimal, database-agnostic API Framework based on Restify

[![Build Status](https://travis-ci.org/dklabco/somnus.svg)](https://travis-ci.org/dklabco/somnus)

## Features

Somnus is a very thin layer wrapping around the [Restify](https://www.npmjs.com/package/restify) NodeJS library. It aims to set up some basic features of a web/API framework by adding (sometimes opinionated) out-of-the-box configurations on top of the bare-bone Restify. In short, it helps you:

- setup your web/API platform in the shortest time possible
- implement the use of [Bunyan](https://www.npmjs.com/package/bunyan) logger by default. This in turn discourages the spam of `console.log` which seems convenient at first but eventually will turn your project into a mess
- package utility/helper functions supporting the repetitive, trivial tasks during day-to-day web/API development projects.

While the original developer's intention is to add commonly essential features on top of Restify, it's also important to note that the key principal is to keep the codebase as small as possible, living up to Restify's standard of being a lighter library than the colossus we have in ExpressJS. Please keep this in mind should you decide to contribute to Somnus!

## Developer & User notices

Somnus strongly promotes the use of next-gen JavaScript (ES6, ES7, etc.). Hence, it will most likely always enforce the latest [LTS version of NodeJS](https://github.com/nodejs/LTS) (for example `10.14.2` at writing time). Besides, it encourages the use of [modern JS features](https://github.com/lukehoban/es6features) such as **arrow functions**, **const identifier** and others (where they make sense).

## Installation

With [NodeJS](https://nodejs.org) and [npm](https://www.npmjs.com/) installed, simply run:

```
npm install somnus
```

## Usage

```
import somnus from 'somnus';
// or const somnus = require('somnus').default;

somnus.start({
  routeConfig: {
    'get /hello': (req, res) => res.send('world')
  }
});
```

## ENV variables

```
// to be documented
```

## Types

For those loving TypeScript: type-def for Somnus is backed directly into the npm package so you don't have to install anything else. If your IDE doesn't seem to pick up the definitions automatically, please manually check/import the `node_modules/somnus/lib/somnus.d.ts` file!

## Test

The following command will run all tests found under `./test` and its subdirectories:

```
npm test
```

## Migration

- If you have never used **somnus@1.x** or **somnus@2.x**, migration is of no concern for you
- If you are using **somnus@1.x** or **somnus@2.x**, please understand that **somnus@3** is completely rewritten, and there is no migration path at all between v2 and v3. v3 exposes a different set of APIs and philosophies behind how the entire framework should be used.

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
- Currently, there is no formal contribution guide. It probably makes sense to start there!
