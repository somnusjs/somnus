"use strict";

// declare the Somnus Framework instance
// note that in your production project, you'll do something like
// `let somnus = require('somnus').init()`
let somnus = require('../../').init({
  accessControlAllowOrigin: '*'
});

// set up a basic route for [GET] / to return a plain text message 'Hello, World'
somnus.get('/', function(req, res, next) {
  res.contentType = 'text/plain';
  res.send('Hello, World');
});

// starts listening for network requests
somnus.listen(process.env.PORT || 0, function() {
  let now = new Date();
  console.info(
    '%s PID %s -- %s %s listening on port %s',
    now.toTimeString(),
    somnus.pid,
    somnus.name,
    somnus.version,
    somnus.getPort()
  );
});

// now from your web browser, go to `http://localhost:<PORT>`
// or from your terminal, do `curl http://localhost:<PORT>`
// to see the expected output
