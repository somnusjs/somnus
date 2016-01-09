"use strict";

// declare the Somnus Framework instance
let somnus = require('../../');

// points to the inner Restify server instance
let server = somnus.server;

// starts listening for network requests
somnus.listen(process.env.PORT, function() {
  let now = new Date();
  console.info(
    `%s PID %s -- %s %s listening at %s`,
    now.toTimeString(),
    server.log.fields.pid,
    server.name,
    server.versions,
    server.url
  );
});
