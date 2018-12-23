// for your production code, do `import somnus, { RouteConfig } from 'somnus'`
// as opposed to importing them separately as seen here
import somnus from '../../src/somnus';
import { RouteConfig } from '../../src/somnus.d';

const routeConfig: RouteConfig = {
  'get /hello': [
    (req, res, next): void => next(),
    (req, res, next): void => res.send('world')
  ]
};

somnus.start({ routeConfig }, (addr): void => {
  somnus.logger.info(`Address: ${addr.address}`);
});
