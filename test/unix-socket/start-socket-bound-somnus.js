// tslint:disable-next-line
const path = require('path');

// @NOTE that right now this works only with dist build, and will fail with src (due to the complex nature of IPC + ts-node)
const targetDistBuild = process.env.TARGET_DIST_BUILD === 'true';
const moduleFile = targetDistBuild ? '../../lib/somnus.js' : '../../src/somnus';
const modulePath = path.resolve(__dirname, moduleFile);

let mod;

// module cache busting so we get a clean import for this test suite, which 'reloads' the new `process.env.UNIX_SOCKET`
// that is set by this test (see more below)
delete require.cache[require.resolve(modulePath)];

const routeConfig = {
  'get /hello': (req, res, next) => res.send('world')
};

async function main() {

  // we can ensure the `import()` syntax is supported in older Node.js versions by using the `--experimental-modules` flag
  mod = await import(modulePath);

  // module cache busting so we get a clean import on the next test suite, which isn't 'polluted' by `process.env.UNIX_SOCKET`
  // that was set in this test
  delete require.cache[require.resolve(modulePath)];

  mod.default.somnus.start({ routeConfig }, addr => {
    process.send({ addr });
  });

}

main();