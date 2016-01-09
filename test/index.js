"use strict";

describe('Somnus Framework', function() {

  let assert = require('assert');
  let knot, server;

  before(function() {
    delete require.cache[require.resolve('../')];
    knot = require('../');
    server = knot.server;
    server.log.level('warn');
  });

  after(function(done) {
    server = null;
    knot.destroy(done);
    knot = null;
  });

  describe('#listen', function() {
    it('should start accepting HTTP requests at some url and port', function(done) {
      knot.listen(function() {
        assert.equal(server.url.indexOf('http://'), 0);
        let lastColon = server.url.lastIndexOf(':');
        let assumedPort = parseInt(server.url.substring(lastColon+1));
        assert.equal(isNaN(assumedPort), false);
        done();
      });
    });
  });

});
