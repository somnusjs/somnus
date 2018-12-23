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

  function start(opts?: ISomnusStartOptions): void;
  function start(opts?: ISomnusStartOptions, cb?: (addr: restify.AddressInterface) => void): void;

  type Somnus = {

    server: restify.Server;
    restify: typeof restify;
    logger: bunyan;

    start: typeof start;

  };
}

declare const somnus: SomnusNS.Somnus;

export type Somnus = SomnusNS.Somnus;
export default somnus;
