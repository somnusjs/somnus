SOMNUS
======

Minimal, database-agnostic API Framework based on Restify

#### Installation

```
npm install somnus
```

#### Use

```
let somnus = require('somnus');

// create a route
somnus.get('/', function(req, res, next) {
  res.send('Hello, World');
});

// start listening to network requests
somnus.listen(function() {
  console.log(`Somnus Framework listening on port ${somnus.getPort()}`);
});
```

#### Examples

Please take a look at `./examples/hello-world/index.js` source code for a more verbose usage example. To run the Hello World example itself, do the following in your
terminal:

```
npm run ex:hw
```

#### Test

The following command will run all tests found under `./test` and its subdirectories:

```
npm test
```

The name of test files should reflect their corresponding library and module files' names and directory structure.

#### FAQs

> What special knowledge do I need to fully utilize Somnus?

Familiarity with the [Restify](https://www.npmjs.com/package/restify) library is recommended, though not necessarily to get you started with and profit from Somnus.

> Why Somnus?

Firstly, it's fun for the developer(s). Secondly, it might also be fun for the contributors. We all gotta invent something once in a while instead of just making money all day, no?

> What is Somnus, again?

**Somnus** is latin for **Sleep** (or at least that's [what Google told the developer](https://translate.google.com/?ie=UTF-8&hl=en&client=tw-ob#la/en/Somnus)). What better fits an API framework created for REST(ful) communications?

> What is Somnus, seriously?

Somnus is aimed to **make mundane day-to-day web/API development tasks as effortlessly fun as possible while maintaining the smallest codebase possible**. Well, at least that's the original intent of the developer, so if you're considering contributing (which is a beautiful thing), please adhere to the said philosophy!

> Why database-agnostic?

`SQL`, `MongoDB`, `RethinkDB` and a plethora of recently emerging database solutions have made it easier and more fun than ever before to play with data. At the same time, it gives framework developers a hard time deciding on any database technology to go with and invest in. Somnus is aimed to make things simple and minimal, not to magnify what's already clunky enough. Hence, it's up to Somnus users to choose the database technologies they feel most suitable to their projects.

In fact, Somnus isn't developed with any database driver built-in. It's essentially the only **C** in MVC.

> How to contribute?

1. Read through the `README` and see anything worth elaborating on? Go ahead!

2. Read through the `TODO` and see anything up to your interests? Attempt it!
