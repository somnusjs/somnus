import { Somnus, RouteConfig } from "../src/somnus.d";

// normally, it's enough to test against source files, but if we're skeptical
// about @babel/preset-typescript and/or webpack, it is also possible to test
// directly against the build artefacts by setting the env `TEST_BUILD` to `true`
const somnus: Somnus = process.env.TEST_BUILD === 'true'
  ? require('../lib/somnus').default // if we want to test against the final output in ./lib
  : require('../src/somnus').default; // if we want to test against files in ./src

import * as assert from 'assert';
import fetch, { Response } from 'node-fetch';

describe("somnus", () => {

  let currentPort: number = NaN;

  afterEach((done) => {
    currentPort = NaN;
    somnus.stop(done);
  });

  describe("without routeConfig", () => {

    before((done) => {
      somnus.start((addr): void => {
        currentPort = addr.port;
        done();
      });
    });

    it("should listen", () => {
      assert(isNaN(currentPort) === false);
    });

  });

  describe("with routeConfig", () => {

    const routeConfig: RouteConfig = {
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

    it("should respond as configured", (done) => {
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
