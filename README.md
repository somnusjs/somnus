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
somnus.get('/', function(req, res, next) {
  res.send('Hello, World');
});
somnus.listen(function() {
  console.log(`Somnus Framework listening at ${somnus.server.url}`);
});
```

#### Examples

Please take a look at `./examples/hello-world/index.js` source code for a more verbose usage example. To run the Hello World example itself, do the following in your
terminal:

```
npm run ex:hw
```
