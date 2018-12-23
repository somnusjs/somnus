/**
 * This is a TypeScript example of using Somnus.
 * As somnus is taken straight from the `src` directory, there is no build step
 * needed and you can run this example directly with `ts-node`
 */

// for your production code, do `import somnus, { IRouteConfig } from 'somnus'`
// as opposed to importing them separately from `src` as seen here
import somnus from '../../src/somnus';
import { IRouteConfig } from '../../src/somnus.d';

const routeConfig: IRouteConfig = {
  'get /hello': [
    (req, res, next): void => next(),
    (req, res, next): void => res.send('world')
  ]
};

somnus.start({ routeConfig }, (addr): void => {
  somnus.logger.info(`address: ${addr.address}`);
});
