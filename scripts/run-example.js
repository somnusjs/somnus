#!/usr/bin/env node

let cmd = `echo 'Please provide a valid example name'`;
switch (process.argv[2]) {

  case 'helloworld-js':
    cmd = `LOG_LEVEL=info node examples/helloworld-js | npx bunyan -o short`;
    break;

  case 'helloworld-ts':
    cmd = `LOG_LEVEL=info PORT=3001 npx ts-node examples/helloworld-ts | npx bunyan -o short`;
    break;

  case 'unix-socket':
    cmd = `cd examples/unix-socket/; ` +
      `LOG_LEVEL=info UNIX_SOCKET=example.sock npx ts-node unix-socket-example.ts | npx bunyan -o short`;

  default:
    break;

}

console.log(`About to run an example for you. Alternatively, you could also run the following command directly:\n${cmd}\n`);

// spawning a shell to execute the given command, piping its outputs to the main process
const cp = require('child_process').exec(cmd);
cp.stdout.pipe(process.stdout);
cp.stderr.pipe(process.stderr);

// this does not affect the examples, we just need it so that any log (if at all)
// sent from the child process is properly displayed by the main process before the
// main process itself is killed
process.once('SIGINT', () => {
  console.log(`SIGINT on ${process.pid} :: waiting for the shell process ${cp.pid} to exit...`);
});