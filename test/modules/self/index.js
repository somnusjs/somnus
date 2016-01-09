"use strict";

describe('Module `Self`', function() {

  let assert = require('assert');
  let knot, server, client;

  beforeEach(function(done) {
    delete require.cache[require.resolve('../../../')];
    knot = require('../../../');
    server = knot.server;
    server.log.level('warn'); // we might not want 'info' or below levels logging to interfere with mocha reporter
    server.listen(function() {
      client = knot.restify.createJsonClient({
        url: server.url,
        agent: false // very important as it prevents keep-alive connections, which takes a while to close, preventing mocha's done() hook to be called properly
      });
      done();
    });
  });

  afterEach(function(done) {
    client = null;
    server = null;
    knot.destroy(done);
    knot = null;
  });

  describe('[HEAD] /ping', function() {
    it('should respond with a 200 status and a "connection: close" header', function(done) {
      client.head('/ping', function(err, req, res, data) {
        assert.equal(res.statusCode, 200);
        assert.equal(res.headers['connection'], 'close');
        done();
      });
    });
  });

  describe(' [GET] /ping', function() {
    it('should respond with a status other than 200', function(done) {
      client.get('/ping', function(err, req, res, data) {
        assert.notEqual(res.statusCode, 200);
        done();
      });
    });
  });

});
