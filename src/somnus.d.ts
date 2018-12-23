import * as restify from 'restify';
import * as bunyan from 'bunyan';

declare namespace SomnusNS {

  interface ISomnusStartOptions {}

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
export interface ISomnusStartOptions extends SomnusNS.ISomnusStartOptions {}
export default somnus;
