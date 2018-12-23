// for your production code, do `import somnus, { RouteConfig } from 'somnus'`
// for this example, we import `somnus` and its type declarations separately
// as seen below
import { RouteConfig } from '../../types/somnus.d';
import somnus from '../../src/somnus';

const routeConfig: RouteConfig = {
  'get /hello': [
    (req, res, next): void => next(),
    (req, res, next): void => res.send('world')
  ]
};

somnus.start({ routeConfig }, (addr): void => {
  somnus.logger.info(`Address: ${addr.address}`);
});
