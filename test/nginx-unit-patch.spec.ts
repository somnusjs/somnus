import assert from 'node:assert';
import { getNginxUnitPatched } from '../src/isNginxUnitPatched';
import * as isNginxUnitPatchedUtil from '../src/isNginxUnitPatched';

describe('nginxUnitPatch', () => {

  let countSetNginxUnitPatched: number = 0;

  before(() => {

    const mockedUnitHttp = require('./__mocks__/unitHttp');
    const origSetNginxUnitPatched = isNginxUnitPatchedUtil.setNginxUnitPatched;
    Object.defineProperty(isNginxUnitPatchedUtil, 'setNginxUnitPatched', {
      value: () => {
        countSetNginxUnitPatched++;
        return origSetNginxUnitPatched();
      }
    });

    // @NOTE that `unit-http` must be resolvable in the first place
    // (e.g. `node_modules/unit-http` exists)
    // before we can even mock it as shown below
    require.cache[require.resolve('unit-http')] = {
      isPreloading: false,
      exports: mockedUnitHttp,
      id: 'mocked-unit-http',
      require: mockedUnitHttp,
      filename: '',
      loaded: true,
      parent: null,
      children: [],
      path: '',
      paths: []
    };

  });

  after(() => {
    delete require.cache[require.resolve('unit-http')];
  });

  it('should not be patched initially', () => {
    assert(getNginxUnitPatched() === undefined);
  });

  it('should import the patcher successfully', async () => {

    const patchResult = (await import('../src/nginxUnitPatch')).default;

    // the patcher function returns the patching status as a boolean by default
    // so we may assert that behavior just as well
    assert(patchResult === true);

    assert(countSetNginxUnitPatched === 1);

  });

  /**
   * it's by design that importing `nginxUnitPatch` is an idempotent operation
   * so we make sure that calling it the 2nd time would be a no-op
   */
  it('should be a no-op when importing the patcher the 2nd time', async () => {
    await import('../src/nginxUnitPatch');
    assert(countSetNginxUnitPatched === 1);
  });

  it('should be patched after the patcher was imported', () => {
    assert(getNginxUnitPatched() === true);
  });

});
