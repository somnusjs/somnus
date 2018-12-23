// for your production code: `import somnus from 'somnus'`
import somnus from '../../src/somnus';

somnus.start((addr): void => {
  somnus.logger.info(`Address: ${addr.address}`);
});
