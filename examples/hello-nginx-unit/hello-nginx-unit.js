#!/usr/bin/env node

/**
 * This requires a successful build (`npm run build`) so that the build artfacts
 * can be found in the `lib` directory, otherwise this example will fail to run.
 */

const somnus = require('../../lib/unit').default;

somnus.logger.info({
  'from': '../../lib/unit',
  'unit-http': somnus.server.server
});

somnus.start({
  routeConfig: {
    'get /hello': (req, res) => res.send('unit')
  }
});

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
