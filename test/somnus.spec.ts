// @ts-nocheck
import { ISomnus, IRouteConfig } from '../src/somnus.d';

// this is actually declared in `setup.js` that runs before all tests
declare const somnus: ISomnus;

import assert from 'node:assert';

describe('somnus', function() {
  this.timeout(5000); // so somnus has enough time to stop after each test

  let currentPort: number = NaN;

  afterEach((done) => {
    currentPort = NaN;
    somnus.stop(done);
  });

  describe('without `routeConfig`', () => {

    beforeEach((done) => {
      somnus.start((addr): void => {
        currentPort = addr.port;
        done();
      });
    });

    it('should listen', () => {
      assert(isNaN(currentPort) === false);
    });

  });

  describe('with a malformed `routeConfig`', () => {

    const malformedRouteConfig: IRouteConfig = {
      'get /bad route config': (req, res, next) => res.send(500)
    };

    it('should throw the correct error', () => {
      assert.throws(() => {
        somnus.start({ routeConfig: malformedRouteConfig }, (addr): void => {
          currentPort = addr.port;
        });
      }, new Error('Malformed `routeConfig`'));
    });

  });

  describe('with a standard `routeConfig`', () => {

    const routeConfig: IRouteConfig = {
      'get /echo': [
        (req, res, next) => next(),
        (req, res, next) => res.send('echo echo')
      ],
      'post /echo': [
        (req, res, next) => next(),
        (req, res, next) => res.send({ foo: req.params.foo })
      ],
      '   put /echo': (req, res, next) => res.send({ message: req.params }),
      'delete /echo': (req, res, next) => res.send({ message: '`delete` understood as `del`' }),
      '<>{}\~/patch*!@#$%^&()   /echo': (req, res, next) => res.send({ message: 'weird verbs? no problemo' }),
    };

    beforeEach((done) => {
      somnus.start({ routeConfig }, (addr): void => {
        currentPort = addr.port;
        done();
      });
    });

    afterEach(() => {
      const { routes } = somnus.server.getDebugInfo();
      for (const { name } of routes) {
        somnus.server.rm(name);
      }
    });

    it('should respond as configured', (done) => {
      fetch(`http://127.0.0.1:${currentPort}/echo`, {
        headers: { 'Accept': 'application/json' }
      })
        .then((val: Response) => val.json())
        .then((val: string) => {
          assert(val === 'echo echo');
          done();
        });
    });

    it('should handle extra spaces before HTTP verbs in `routeConfig`', (done) => {
      fetch(`http://127.0.0.1:${currentPort}/echo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fooz: 'bars' })
      })
        .then((resp: Response) => resp.json())
        .then((resp: { message: any }) => {
          assert.strictEqual(resp.message.fooz, 'bars');
          done();
        });
    });

    it('should use the `bodyParser` plugin', (done) => {
      fetch(`http://127.0.0.1:${currentPort}/echo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foo: 'bar' })
      })
        .then((resp: Response) => resp.json())
        .then((resp: { foo: unknown }) => {
          assert(resp.foo === 'bar');
          done();
        });
    });

    it('should understand `delete` HTTP verb as `del`', (done) => {
      fetch(`http://127.0.0.1:${currentPort}/echo`, {
        method: 'DELETE'
      })
        .then((resp: Response) => resp.json())
        .then((resp: { message: unknown }) => {
          assert(resp.message === '`delete` understood as `del`');
          done();
        });
    });

    it('should handle weird characters in standard HTTP verbs', (done) => {
      fetch(`http://127.0.0.1:${currentPort}/echo`, {
        method: 'PATCH'
      })
        .then((resp: Response) => resp.json())
        .then((resp: { message: unknown }) => {
          assert(resp.message === 'weird verbs? no problemo');
          done();
        });
    });

  });

});
