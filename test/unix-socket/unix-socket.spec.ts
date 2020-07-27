import * as assert from 'assert';
import { fork, ChildProcess } from 'child_process';

const TEST_UNIX_SOCKET: string = './test.socket';

function spawnSomnusServerAsChildProcess(): ChildProcess {

  // tslint:disable-next-line:no-console
  // console.log(`starting child process with ${process.argv[0]}`);

  const modulePath = `${__dirname}/start-socket-bound-somnus.js`;
  return fork(modulePath, {
    execPath: process.argv[0],
    execArgv: [],
    env: {

      UNIX_SOCKET: TEST_UNIX_SOCKET,

      // @NOTE that right now this works only with dist build, and will fail with src (due to the complex nature of IPC + ts-node)
      TARGET_DIST_BUILD: 'true', // process.env.TARGET_DIST_BUILD,

      LOG_LEVEL: 'warn'

    }
  });

}

describe('somnus server listening to unix sockets', () => {

  let proc: ChildProcess;

  after((done) => {
    if (!proc.killed) {
      proc.once('exit', () => done());
      proc.kill('SIGINT');
    } else {
      done();
    }
  });

  it('should start successfully', (done) => {

    proc = spawnSomnusServerAsChildProcess();
    proc.on('message', m => {
      assert.equal((m as any).addr, TEST_UNIX_SOCKET, 'somnus server must listen at the designated unix socket');
      done();
    });

  });

  it('should stop gracefully when being killed unexpectedly (e.g. SIGINT)', (done) => {
    proc.once('exit', () => done());
    proc.kill('SIGINT');
  });

  // @TODO assert that the socket `TEST_UNIX_SOCKET` no longer exists?

  it('should start successfully again on the same socket (because it exited gracefully earlier)', (done) => {

    proc = spawnSomnusServerAsChildProcess();
    proc.on('message', m => {
      assert.equal((m as any).addr, TEST_UNIX_SOCKET, 'somnus server must listen at the designated unix socket');
      done();
    });

  });

});