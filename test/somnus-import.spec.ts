// `somnus` has been imported in `setup.js` as a global object. Let's see if it still works properly if we
// import it multiple times and/or dynamically import it;
// expected: only 1 instance of the Restify Server is ever created whatsoever

import * as assert from 'assert';
import Somnus1 from '../src/somnus';
import Somnus2 from '../src/somnus';

describe('somnus multiple imports', () => {

    it('should instantiate a single Restify Server instance ever', () => {
        assert(Somnus1.server === Somnus2.server);
    });

    describe('import from source', () => {
        it('should support the dynamic import API', async () => {
            const module = await import('../src/somnus');
            assert(module.somnus.server === Somnus1.server);
            assert(module.somnus.server === Somnus2.server);
        });
    });

    describe('import from dist', () => {
        it('should support the dynamic import API', async () => {
            const { somnus: somnus1 } = await import('../lib/somnus') as any;
            const { somnus: somnus2 } = await import('../lib/somnus') as any;
            assert(somnus1.server === somnus2.server);
        });
    });

});