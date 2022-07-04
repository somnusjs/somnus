import { getIsNginxUnitPatched } from './isNginxUnitPatched';

// until the `NXT_UNIT_INIT` env var is more verbosely documented, we admit that we
// are using it at our own risk to determine when a Node.js process was started by
// NGINX Unit. Related info [here](https://github.com/nginx/unit/issues/230)
const PROC_WAS_STARTED_BY_NGINX_UNIT: boolean = process.env.NXT_UNIT_INIT != null;

// more recent versions of NGINX Unit `unit-http` supports its own custom loader
// which makes it possible to run the app as-is without patching the `http` object;
// therefore, we only patch when the user explicitly turns this mode on
const IS_NGINX_UNIT_MANUAL_PATCH_MODE: boolean = process.env.IS_NGINX_UNIT_MANUAL_PATCH_MODE != null
  && process.env.IS_NGINX_UNIT_MANUAL_PATCH_MODE !== 'false';

const shouldPerformNginxUnitPatch: boolean = PROC_WAS_STARTED_BY_NGINX_UNIT
  && IS_NGINX_UNIT_MANUAL_PATCH_MODE;

if (shouldPerformNginxUnitPatch && !getIsNginxUnitPatched()) {
  throw new Error('nginxUnitPatch::nginxUnitPatch() must be invoked before somnus is imported');
}

import { ISomnus, ISomnusStartOptions } from '../src/somnus.d';
import * as restify from 'restify';
import * as RestifyErrors from 'restify-errors';
import * as bunyan from 'bunyan';

// defaults to `debug` during development,
// can be explicitly set to 'trace' during truly desperate times
let logLevel: bunyan.LogLevel  = 'debug';
switch (process.env.NODE_ENV) {
  case 'production' :
    logLevel = 'warn';
    break;
  case 'staging' :
  default:
    logLevel = 'info';
    break;
}

const UNIX_SOCKET: string | undefined = process.env.UNIX_SOCKET && process.env.UNIX_SOCKET !== ''
  ? process.env.UNIX_SOCKET
  : undefined;

const server: restify.Server = restify.createServer({
  name: 'somnus',
  log: bunyan.createLogger({
    name: 'somnusDefaultLogger',
    level: process.env.LOG_LEVEL as bunyan.LogLevel || logLevel,
  }),
});

const logger: bunyan = server.log;

// tslint:disable-next-line:no-var-requires
require('gracefulize')(server, { log: logger.info.bind(logger) });

// things to take care of for the users:
// bodyParser
// queryParser
// routeConfig
// ... ?
server.pre(restify.plugins.pre.dedupeSlashes());
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser({ mapParams: true }));
server.use(restify.plugins.bodyParser({ mapParams: true }));

// catch all
server.on('restifyError', (req, res, err, cb) => {
  if (!err.handled) {
    logger.error({ unhandleRestifyError: err });
  }
  return cb();
});

const somnus: ISomnus = Object.assign(Object.create(null), {

  server, // should not be used heavily in userland; included for advanced uses only
  restify, // should not be used heavily in userland; included for advanced uses only
  logger,

  start(): void {

    let opts: ISomnusStartOptions | undefined;
    let cb: ((addr: restify.AddressInterface) => void) | null = null;
    switch (arguments.length) {
      case 2 :
        opts = arguments[0] || {};
        cb = arguments[1];
        break;
      case 1 :
        if (typeof arguments[0] === 'function') {
          cb = arguments[0];
        } else if (typeof arguments[0] === 'object') {
          opts = arguments[0];
        }
        break;
      case 0 :
        // do nothing
        break;
      default :
        throw new Error('Too many arguments');
    }

    if (opts) {

      let pair: string[];
      for (const key in opts.routeConfig) {

        pair = key.trim().replace(/\s{2,}/g, ' ').split(' ');

        if (pair.length !== 2) {
          throw new Error('Malformed `routeConfig`');
        }

        const [rawVerb, path] = pair;
        const handler: restify.RequestHandlerType = opts.routeConfig[key];

        // sanitize user-provided HTTP verbs
        let verb = rawVerb.trim().toLowerCase().replace(/(\W|_|\d)/g, '');
        if (verb === 'delete') {
          verb = 'del';
        }

        // e.g. server.get('/some-route', someHandler)
        server[verb](path, handler);

      }

    }

    if (UNIX_SOCKET) {
      server.listen(UNIX_SOCKET, onStarted.bind(undefined, cb));
    } else {
      server.listen(process.env.PORT, process.env.HOST, onStarted.bind(undefined, cb));
    }

  },

  stop: (cb?): void => server.close(cb),

});

function onStarted(cb?: (addr: restify.AddressInterface) => void): void {
  if (PROC_WAS_STARTED_BY_NGINX_UNIT) {
    logger.info(`somnus framework started by NGINX Unit`);
    logger.info(`IS_NGINX_UNIT_MANUAL_PATCH_MODE: ${IS_NGINX_UNIT_MANUAL_PATCH_MODE}`);
    logger.info(`ensure you configure NGINX Unit as instructed here: https://unit.nginx.org/howto/samples/#node-js`);
    if (cb) {
      cb({
        address: 'unit-http managed',
        port: 'unit-http managed'
      } as any); // force casting since this is an edge case (most people don't use the `unit-http` manual patch mode)
    }
  } else {
    const addr: restify.AddressInterface = server.address();
    const effectiveAddr: string = UNIX_SOCKET || `${addr.address}:${addr.port}`;
    logger.info(`somnus framework listening at ${effectiveAddr}`);
    logger.info(`somnus was built for: ${process.env.NODE_ENV}`); // note that we let webpack overwrite this value in the dist build
    logger.info(`somnus logger level: ${bunyan.nameFromLevel[logger.level()]}`);
    if (cb) {
      cb(addr);
    }
  }
}

export {
  somnus,
  RestifyErrors,
};

export default somnus;
