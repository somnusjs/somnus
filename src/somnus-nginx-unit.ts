/***************************************************************************************************************
 *
 * the following hints of a possibility to use 'dynamic import';
 * however this approach needs more research
 * proposed (alpha) usage: const somnus = require('somnus/unit').default.somnus;
 * expected (final) usage: const somnus = await import('somnus/unit');
 *
 */

// const holder: any = {};

// const unitHttpProm = import('unit-http');
// const httpProm = import('http');
// const requestPatchProm = import('restify/lib/request');
// const responsePathProm = import('restify/lib/response');
// Promise.all([unitHttpProm, httpProm, requestPatchProm, responsePathProm])
//   .then(([unitHttp, http, requestPatch, responsePatch]) => {

//     http.createServer = unitHttp.default.createServer.bind(unitHttp.default);
//     requestPatch.default(unitHttp.default.IncomingMessage);
//     responsePatch.default(unitHttp.default.ServerResponse);

//     holder.somnus = require('./somnus').default;
//     holder.somnus.logger.info('somnus-nginx-unit ready');

//   });

// export default holder;

/***************************************************************************************************************
 *
 * the following is the current working implementation, which (1) patches the objects involved and (2) `require`s
 * the main `somnus` module, which will operate on the already-patched objects
 *
 */
// tslint:disable:no-var-requires
const unitHttp = require('unit-http');
const http = require('http');
// patch the `http::createServer` method before restify uses it
http.createServer = unitHttp.createServer.bind(unitHttp);
// see more here: https://github.com/restify/node-restify/blob/9153587c023a876237c1d8bc7491fee4984d9074/lib/server.js#L33
require('restify/lib/request')(unitHttp.IncomingMessage);
// see more here: https://github.com/restify/node-restify/blob/9153587c023a876237c1d8bc7491fee4984d9074/lib/server.js#L32
require('restify/lib/response')(unitHttp.ServerResponse);
const somnusModule = require('./somnus');
// tslint:enable
export default somnusModule.somnus;
export const { somnus, RestifyErrors } = somnusModule;

/***************************************************************************************************************
 *
 * "fun" fact: the below `export`ing approach doesn't seem to work, likely because `import` causes `somnus`
 * to be immutable
 *
 */
// import somnus from './somnus';
// export default somnus;
// export * from './somnus';