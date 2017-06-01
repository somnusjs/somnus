import Somnus from '../src/index';

describe('Somnus Framework', function() {

  let assert = require('assert');
  let somnus, server;

  before(function() {
    delete require.cache[require.resolve('../src/index')];
    somnus = Somnus.init({modulesDir: './src/modules'});
    server = somnus.server;
    server.log.level('warn');
  });

  after(function(done) {
    server = null;
    somnus.destroy(done);
    somnus = null;
  });

  describe('#listen', function() {
    it('should start accepting HTTP requests at some url and port', function(done) {
      somnus.listen(function() {
        assert.equal(server.url.indexOf('http://'), 0);
        let lastColon = server.url.lastIndexOf(':');
        let assumedPort = parseInt(server.url.substring(lastColon+1));
        assert.equal(isNaN(assumedPort), false);
        done();
      });
    });
  });

});
