#!/usr/bin/env node

/**
 * This requires a successful build (`npm run build`) so that the build artfacts
 * can be found in the `lib` directory, otherwise this example will fail to run.
 */

const somnus = require('../../lib/somnus').default;

somnus.logger.debug({
  'http.Server': somnus.server.server
});

somnus.start({
  routeConfig: {
    'get /hello': (req, res) => res.send('unit')
  }
});

// now you can use this file as the `executable` for an `external`-type nginx unit
// application as [documented here](https://unit.nginx.org/howto/samples/#node-js)

/**
 * This is an example of using barebone Node.js http server with nginx unit (`unit-http`)
 * Uncomment it and comment the block above to enable this mode
 */
// const unitHttp = require('unit-http');
// const http = require('http');
// http.ServerResponse = unitHttp.ServerResponse;
// http.IncomingMessage = unitHttp.IncomingMessage;
// http.createServer = unitHttp.createServer.bind(unitHttp);

// require('http').createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello, I am unit patched barebone Node.js http');
// }).listen(() => {
//   console.log('Barebone Node.js http server started');
// });
