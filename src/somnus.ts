import { Somnus, ISomnusStartOptions } from '../src/somnus.d';
import * as restify from 'restify';
import * as RestifyErrors from 'restify-errors';
import * as bunyan from 'bunyan';

// defaults to `debug` during development,
// can be explicitly set to 'trace' during truly desperate times
let logLevel: bunyan.LogLevel  = 'debug';
switch(process.env.NODE_ENV) {
  case 'production' :
    logLevel = 'warn';
  break;
  case 'staging' :
    logLevel = 'info';
  break;
}

const server: restify.Server = restify.createServer({
  name: 'somnus',
  log: bunyan.createLogger({
    name: 'somnusDefaultLogger',
    level: process.env.LOG_LEVEL as bunyan.LogLevel || logLevel
  })
});

const logger: bunyan = server.log;

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
  if(!err.handled) {
    logger.error({ 'unhandleRestifyError': err });
  }
  return cb();
});

const somnus: Somnus = {

  server, // should not be used heavily in userland; included for advanced uses only
  restify, // should not be used heavily in userland; included for advanced uses only
  logger,

  start: function(): void {

    let opts: ISomnusStartOptions | undefined;
    let cb: (addr: restify.AddressInterface) => void | undefined;
    switch(arguments.length) {
      case 2 :
        opts = arguments[0] || {};
        cb = arguments[1];
      break;
      case 1 :
        if(typeof arguments[0] === 'function') {
          cb = arguments[0];
        } else if(typeof arguments[0] === 'object') {
          opts = arguments[0];
        }
      break;
      case 0 :
        // do nothing
      break;
      default :
        throw new Error('Too many arguments');
    }

    if(opts) {

      let pair: string[];
      for(let key in opts.routeConfig) {
        pair = key.replace(/\s{2,}/g, ' ').split(' ');
        const [verb, path] = pair;
        const handler: restify.RequestHandlerType = opts.routeConfig[key];
        server[verb](path, handler);
      }

    }

    server.listen(process.env.PORT, process.env.HOST, (): void => {
      const addr: restify.AddressInterface = server.address();
      logger.info(`somnus framework listening at ${addr.port}`);
      logger.info(`built for ENV: ${process.env.NODE_ENV}`);
      logger.info(`logger level: ${bunyan.nameFromLevel[logger.level()]}`);
      if(cb) {
        cb(addr);
      }
    });

  },

  stop: (cb?): void => server.close(cb)

}

export {
  somnus,
  RestifyErrors
}

export default somnus
