/**
 * This is a TypeScript example of using Somnus.
 * This requires a successful build (`npm run build`) so that the build artfacts
 * can be found in the `lib` directory, otherwise this example will fail to run.
 */

import somnus, { IRouteConfig } from '../../lib/somnus';

// you can add routes via the standard syntax
// as you would normally do with `express` or `restify`
somnus.server.get('/echo', (req, res, next) => res.send('echo echo'));

// or you can add routes by declaring a `routeConfig` object,
// which is then passed into `somnus.start()` method
const routeConfig: IRouteConfig = {
  'get /hello': [
    (req, res, next): void => next(),
    async (req, res): Promise<void> => {
      const retVal = await Promise.resolve('world');
      res.send(retVal);
    }
  ]
};

somnus.start({ routeConfig }, (addr): void => {
  somnus.logger.info(`address: ${addr.address}:${addr.port}`);
});

// from now on, all routes added above are available. Go ahead and test these
// paths with `curl` or your favourite web browser:
// - `/echo`
// - `/hello`
