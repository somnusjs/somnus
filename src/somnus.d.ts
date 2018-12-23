import * as restify from 'restify';
import * as bunyan from 'bunyan';

export type RouteConfig = {
  // 'get /hello' : (req, res, next) => res.send('world')
  [routeSignature: string]: restify.RequestHandlerType;
}

export interface ISomnusStartOptions {
  routeConfig: RouteConfig;
}

declare namespace SomnusNS {

  function start(cb?: (addr: restify.AddressInterface) => void): void;
  function start(opts?: ISomnusStartOptions): void;
  function start(opts?: ISomnusStartOptions, cb?: (addr: restify.AddressInterface) => void): void;

  function stop(cb?: () => any): void;

  type Somnus = {

    server: restify.Server;
    restify: typeof restify;
    logger: bunyan;

    start: typeof start;
    stop: typeof stop;

  };
}

export type Somnus = SomnusNS.Somnus;
declare const somnus: Somnus;
export default somnus;
