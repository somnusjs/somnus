'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Somnus = function Somnus(opts) {

  opts = opts || {
    accessControlAllowOrigin: '*' // defaults to a very elaborating value. In production, please specifically set this value to something wise!
  };

  var restify = require('restify');
  var pkg = require('../package.json');
  var bunyan = require('bunyan');

  var logLevel = 'debug'; // defaults to `debug` during development; can be explicitly set to 'trace' during truly desperate times
  switch (process.env.NODE_ENV) {
    case 'production':
      logLevel = 'warn';
      break;
    case 'staging':
      logLevel = 'info';
      break;
  }

  /** create the base Restify server instance */
  var server = restify.createServer({
    name: pkg.name + '-restify',
    version: pkg.version,
    log: bunyan.createLogger({ name: pkg.name, level: logLevel })
  });

  var framework = {

    /** framework/microservice metadata */
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    guid: 'cbc34ec944db3cb65e41dbe8355a07b5',

    /** operational metadata */
    getAddress: function getAddress() {
      return server.address().address;
    },
    getPort: function getPort() {
      return server.address().port;
    },
    pid: server.log.fields.pid,

    /** useful singletons to pass around */
    server: server,
    logger: server.log,
    restify: restify,
    package: pkg,
    modules: {/* to be populated later during module auto-loading phase */},

    init: init,
    destroy: destroy

  };

  // Access-Control-Allow-Origin Header is one of the more important topics
  // when it comes to web/API framework. So let's be a bit verbose here to make
  // sure our users know what they are doing
  if (process.env.NODE_ENV === 'production' && opts.accessControlAllowOrigin === '*') framework.logger.warn('Access-Control-Allow-Origin Header is set to \'*\'. Consider providing a specific value when requiring ' + framework.name);

  /** basic setups */
  server.use(restify.acceptParser(server.acceptable));
  server.use(restify.queryParser());
  server.use(restify.bodyParser());
  server.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', opts.accessControlAllowOrigin);
    res.setHeader('Server', framework.name + ' ' + pkg.version);
    return next();
  });

  /** module auto-loading */
  var path = require('path');
  var MODULES_DIR = path.join(process.cwd(), './modules');
  require('fs').readdir(MODULES_DIR, function (err, files) {
    if (err) return framework.logger.warn('Cannot load modules from ' + MODULES_DIR + '. You may wanna add some!');
    files.forEach(function (file) {
      var suffID = file.indexOf('.js');
      var moduleName = suffID > 0 ? file.substring(0, suffID) : file;
      var mod = require(path.join(MODULES_DIR, file))(framework);
      framework.modules[moduleName] = mod;
    });
    framework.logger.info(require('util').inspect(framework.modules, { depth: 3 }));
  });

  function init() {
    /** proxy functions to the inner Restify server instance */
    ['use', 'listen', 'head', 'get', 'post', 'put', 'patch', 'del', 'opts'].forEach(function (methodName) {
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
    server.close(function () {
      server = null;
      if (typeof cb === 'function') cb();
    });
  }

  return framework;
};

exports.default = Somnus;