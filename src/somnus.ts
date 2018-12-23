import { Somnus, ISomnusStartOptions } from "../types/somnus.d";
import * as restify from 'restify';
import * as RestifyErrors from 'restify-errors';
import * as bunyan from 'bunyan';

// defaults to `debug` during development,
// can be explicitly set to 'trace' during truly desperate times
let logLevel  = 'debug';
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
  log: bunyan.createLogger({ name: 'somnusDefaultLogger', level: logLevel as bunyan.LogLevel })
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

    let opts: ISomnusStartOptions;
    let cb: Function;
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

    if(opts.routeConfig) {
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
      logger.info(`NODE_ENV: ${process.env.NODE_ENV}`);
      logger.info(`logger level: ${logger.level()}`);
      if(cb) {
        cb(addr);
      }
    });

  }

}

export {
  somnus,
  RestifyErrors
}

export default somnus
