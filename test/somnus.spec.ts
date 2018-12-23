import { ISomnus, IRouteConfig } from "../src/somnus.d";

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

  describe('without routeConfig', () => {

    before((done) => {
      somnus.start((addr): void => {
        currentPort = addr.port;
        done();
      });
    });

    it('should listen', () => {
      assert(isNaN(currentPort) === false);
    });

  });

  describe('with routeConfig', () => {

    const routeConfig: IRouteConfig = {
      'get /hello': [
        (req, res, next) => next(),
        (req, res, next) => res.send('world')
      ]
    };

    before((done) => {
      somnus.start({ routeConfig }, (addr): void => {
        currentPort = addr.port;
        done();
      });
    });

    it('should respond as configured', (done) => {
      fetch(`http://127.0.0.1:${currentPort}/hello`, {
        headers: { 'Accept': 'application/json' }
      })
        .then((val: Response) => val.json())
        .then((val: string) => {
          assert(val === 'world');
          done();
        });
    });

  });

});
