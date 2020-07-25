/**
 * This is a TypeScript example of using Somnus.
 * This requires a successful build (`npm run build`) so that the build artfacts
 * can be found in the `lib` directory, otherwise this example will fail to run.
 */

import somnus, { IRouteConfig } from '../../lib/somnus';

const routeConfig: IRouteConfig = {
  'get /hello': [
    (req, res, next): void => next(),
    (req, res, next): void => res.send('world')
  ]
};

somnus.start({ routeConfig }, (addr): void => {
  somnus.logger.info(`address: ${addr.address}`);
});
