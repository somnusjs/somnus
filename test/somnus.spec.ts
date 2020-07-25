import { ISomnus, IRouteConfig } from '../src/somnus.d';

// this is actually declared in `setup.js` that runs before all tests
declare const somnus: ISomnus;

import * as assert from 'assert';
import fetch, { Response } from 'node-fetch';

describe('somnus', () => {

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

  describe('with `routeConfig`', () => {

    const routeConfig: IRouteConfig = {
      'get /echo': [
        (req, res, next) => next(),
        (req, res, next) => res.send('echo echo')
      ],
      'post /echo': [
        (req, res, next) => next(),
        (req, res, next) => res.send({ foo: req.params.foo })
      ],
      'put /echo': (req, res) => res.send({ message: req.params })
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

    it('should respond as configured', (done) => {
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

  });

});
