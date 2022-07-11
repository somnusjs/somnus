import { getNginxUnitPatched, setNginxUnitPatched } from './isNginxUnitPatched';

function nginxUnitPatch() {
  if (getNginxUnitPatched()) return;

  const unitHttp = require('unit-http');
  const http = require('http');
  // patch the `http::createServer` method before `restify` uses it
  http.createServer = unitHttp.createServer.bind(unitHttp);
  // see more here: https://github.com/restify/node-restify/blob/9153587c023a876237c1d8bc7491fee4984d9074/lib/server.js#L33
  require('restify/lib/request')(unitHttp.IncomingMessage);
  // see more here: https://github.com/restify/node-restify/blob/9153587c023a876237c1d8bc7491fee4984d9074/lib/server.js#L32
  require('restify/lib/response')(unitHttp.ServerResponse);

  setNginxUnitPatched();
}

nginxUnitPatch();

export default getNginxUnitPatched();
