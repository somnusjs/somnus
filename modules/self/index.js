"use strict";

let Self = function(framework) {

  let logger = framework.logger;
  logger.trace("Using module `Self`");

  let server = framework.server;
  let restify = framework.restify;

  // controller method
  server.head('/ping', function(req, res, next) {
    res.setHeader('connection', 'close');
    return res.send(200);
  });

  // api methods to share with other modules via the notation framework.modules[<module_name>]
  return {
    description: 'Metadata & Service Discovery for ' + framework.name,
    endPoints: [{ route: '[HEAD] /ping', description: 'Returns a simple 200 OK' }]
  };

};

module.exports = Self;
