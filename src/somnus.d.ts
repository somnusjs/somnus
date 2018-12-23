import * as restify from 'restify';
import * as bunyan from 'bunyan';

export interface IRouteConfig {
  // 'get /hello' : (req, res, next) => res.send('world')
  [routeSignature: string]: restify.RequestHandlerType;
}

export interface ISomnusStartOptions {
  routeConfig: IRouteConfig;
}

declare function start(arg?: ISomnusStartOptions | ((addr: restify.AddressInterface) => void)): void;
declare function start(opts?: ISomnusStartOptions, cb?: (addr: restify.AddressInterface) => void): void;

declare function stop(cb?: () => any): void;

export interface ISomnus {

  server: restify.Server;
  restify: typeof restify;
  logger: bunyan;

  start: typeof start;
  stop: typeof stop;

}

declare const somnus: ISomnus;
export default somnus;
