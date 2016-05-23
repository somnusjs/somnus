SOMNUS
======

Minimal, database-agnostic API Framework based on Restify

[![Build Status](https://travis-ci.org/dklabco/somnus.svg)](https://travis-ci.org/dklabco/somnus)

## Features

Somnus is a very thin layer wrapping around the [Restify](https://www.npmjs.com/package/restify) NodeJS library. It aims to set up some basic features of a web/API framework, then adding common utilities which can be shared across controllers. All of these tasks might eventually get too repetitive and tedious for any Restify user. The added features include:

- Setting the `Access-Control-Allow-Origin` header to a desired value during setup, or leave blank to use `"*"`, which is a very elaborating value best suited for development or fully-public API-services.
- Implementing the use of [Bunyan](https://www.npmjs.com/package/bunyan) logger by default. This in turn discourages the spam of `console.log` which seems convenient at first but eventually will turn your project into a mess.
- Some example test-beds to get you started with running tests for a Restify-based product.
- Utility / Helper code to help you handle the most trivial tasks during day-to-day web/API development projects.

While the original developer's intention is to add commonly essential features on top of Restify, it's also important to note that the key principal is to keep the codebase as small as possible, living up to Restify's standard of being a lighter library than the colossus we have in ExpressJS. Please keep this in mind should you decide to contribute to Somnus!

## Developer & User notices

Somnus strongly promotes the use of next-gen JavaScript (ES6, ES7, etc.). Hence, it will most likely always enforce the latest [LTS version of NodeJS](https://github.com/nodejs/LTS) (for example `4.2.0` at writing time). Besides, it encourages the use of [modern JS features](https://github.com/lukehoban/es6features) such as **arrow functions**, **const identifier** and others.

Currently, we have no plan to make Somnus compatible with old NodeJS versions (such as `0.10.x` or `0.12.x`). While we're very sorry about this, we also believe it is for everyone's common interests to aim for the latest standards. If you have a very specific reason to use Somnus with an outdated NodeJS flavor, please [drop us a word](mailto:gate@dklab.co) and we'll see if there's any way we can help!

## Installation

With [NodeJS](https://nodejs.org) and [npm](https://www.npmjs.com/) installed, simply run:

```
npm install somnus
```

## Usage

```
'use strict';

let somnus = require('somnus').init({
  accessControlAllowOrigin: '*'
});

// create a route
somnus.get('/', function(req, res, next) {
  res.send('Hello, World');
});

// start listening to network HTTP requests
somnus.listen(function() {
  console.log('Somnus Framework listening on port', somnus.getPort());
});
```

## Examples

Please take a look at [the Hello World example](./examples/hello-world/index.js) source code for a more verbose usage example. To run the Hello World example itself, do the following in your
terminal:

```
npm run ex:hw
```

## Test

The following command will run all tests found under `./test` and its subdirectories:

```
npm test
```

The name of test files should reflect their corresponding library and module files' names and directory structure.

## Migration

- From 1.0.x to 1.1.x:

  There is a breaking change. Before, it was `let somnus = require('somnus');`, now it is `let somnus = require('somnus').init();`. This allows passing in an optional config object to initialize Somnus. One use for it is to pass the key `accessControlAllowOrigin` with a desired value.


FAQs
====

## 1. What special knowledge do I need to fully utilize Somnus?
Familiarity with the [Restify](https://www.npmjs.com/package/restify) library is recommended, though not necessarily to get you started with and profit from Somnus.

## 2. Why Somnus?
Firstly, it's fun for the developer(s). Secondly, it might also be fun for the contributors. We all gotta invent something once in a while instead of just making money all day, no?

## 3. What is Somnus, again?
**Somnus** is latin for **Sleep** (or at least that's [what Google told the developer](https://translate.google.com/?ie=UTF-8&hl=en&client=tw-ob#la/en/Somnus)). What better fits an API framework created for REST(ful) communications?

## 4. What is Somnus, seriously?
Somnus is aimed to **make mundane day-to-day web/API development tasks as effortlessly fun as possible while maintaining the smallest codebase possible**. Well, at least that's the original intent of the developer, so if you're considering contributing (which is a beautiful thing), please adhere to the said philosophy!

## 5. Why database-agnostic?
`SQL`, `MongoDB`, `RethinkDB` and a plethora of recently emerging database solutions have made it easier and more fun than ever before to play with data. At the same time, it gives framework developers a hard time deciding on any database technology to go with and invest in. Somnus is aimed to make things simple and minimal, not to magnify what's already clunky enough. Hence, it's up to Somnus users to choose the database technologies they feel most suitable to their projects.

In fact, Somnus isn't developed with any database driver built-in. It's essentially the only **C** in MVC.

## 6. How to contribute?
- Read through the [README](./README.md) and see anything worth elaborating on? Go ahead!
- Read through the [TODO](./TODO.md) and see anything up to your interests? Attempt it!
