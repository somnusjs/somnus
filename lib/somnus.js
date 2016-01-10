"use strict";

let Somnus = function() {

  let restify   = require('restify');
  let pkg       = require('../package.json');
  let bunyan    = require('bunyan');

  let logLevel  = 'debug'; // default (a.k.a development); can be explicitly set to 'trace' during truly desperate times
  switch(process.env.NODE_ENV) {
    case 'production' :
      logLevel  = 'warn';
    break;
    case 'staging' :
      logLevel  = 'info';
    break;
  }

  /** create the base Restify server instance */
  let server    = restify.createServer({
    name        : pkg.name + '-restify',
    version     : pkg.version,
    log         : bunyan.createLogger({ name: pkg.name, level: logLevel })
  });

  let framework = {

    /** framework/microservice metadata */
    name        : pkg.name,
    version     : pkg.version,
    description : pkg.description,
    guid        : 'cbc34ec944db3cb65e41dbe8355a07b5',

    /** operational metadata */
    getAddress  : function() { return server.address().address; },
    getPort     : function() { return server.address().port; },
    pid         : server.log.fields.pid,

    /** useful singletons to pass around */
    server      : server,
    logger      : server.log,
    restify     : restify,
    package     : pkg,
    modules     : { /* to be populated later during module auto-loading phase */ },

    init        : init,
    destroy     : destroy

  };

  /** basic setups */
  server.use(restify.acceptParser(server.acceptable));
  server.use(restify.queryParser());
  server.use(restify.bodyParser());
  server.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Server', `${framework.name} ${pkg.version}`);
    return next();
  });

  /** module auto-loading */
  let path = require('path');
  const MODULES_DIR = path.join(__dirname, '../modules');
  require('fs').readdir(MODULES_DIR, function(err, files) {
    if(err) return framework.logger.warn(`Cannot load modules from ${MODULES_DIR}. Make sure some exist!`);
    files.forEach(function(file) {
      let suffID = file.indexOf('.js');
      let moduleName = (suffID > 0)? file.substring(0, suffID) : file;
      let mod = require(path.join(MODULES_DIR, file))(framework);
      framework.modules[moduleName] = mod;
    });
    framework.logger.info(require('util').inspect(framework.modules, { depth: 3 }));
  });

  function init() {
    /** proxy functions to the inner Restify server instance */
    ['use', 'listen', 'head', 'get', 'post', 'put', 'patch', 'del', 'opts']
    .forEach((methodName) => {
      // as we do this, please be cautious of a risk when Restify developers
      // intentionally change the `this` scope of these functions - if that does
      // ever happen!
      framework[methodName] = server[methodName].bind(server);
    });
  }

  function destroy(cb) {
    restify = null;
    pkg = null;
    bunyan = null;
    logLevel = null;
    framework = null;
    server.close(function() {
      server = null;
      if(typeof cb === 'function')
        cb();
    });
  }

  return framework;

}

module.exports = Somnus;
