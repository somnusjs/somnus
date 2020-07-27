import somnus from '../../lib/somnus';
import { Request, Response } from 'restify';

// this example assumes `process.env.UNIX_SOCKET` was properly provided,
// you can see `scripts/run-example.js` for related details

somnus.start({
  routeConfig: {
    'get /hello-socket': (req: Request, res: Response) => res.send({
      message: `socket is ${process.env.UNIX_SOCKET}`,
      details: { 'requestParams': req.params }
    })
  }
});

// now to communicate with the Node.js process via a unix socket, you
// can set up a reverse proxy, or otherwise use any approach you prefer