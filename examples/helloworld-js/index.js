/**
 * This is a pure JavaScript example of using Somnus.
 * This requires a successful build (`npm run build`) so that the build artfacts
 * can be found in the `lib` directory, otherwise this example will fail to run.
 */

const somnus = require('../../lib/somnus').default;

somnus.start({
  routeConfig: {
    'get /hello': async (req, res) => {
      res.send('world');
    },
    'get /hi': (req, res, next) => {
      res.send('earth');
    }
  }
});
