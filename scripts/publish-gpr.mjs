#!/usr/bin/env -S node --experimental-top-level-await

// @TODO consider bailing out immediately if git state is dirty
// as this util has only been tested for use under
// a clean git state & after a standard `npm publish` has finished

import { promises as fs } from 'fs';
import { exec } from 'child_process';
import readline from 'readline';
import util from 'util';

const PACKAGE_JSON_PATH = './package.json';
const PACKAGE_LOCK_JSON_PATH = './package-lock.json';

const pkg = JSON.parse(await fs.readFile(PACKAGE_JSON_PATH, 'utf-8'));
const defaultPkg = { ...pkg };
const defaultPkgLck = JSON.parse(await fs.readFile(PACKAGE_LOCK_JSON_PATH, 'utf-8'));

let isPackageJsonDirty = false;
let publishSubProc;

/**
 * scope the project under `@somnusjs` which needed when publishing into GitHub Packages
 * registry (but _NOT_ desired when publishing into the traditional npm registry)
 */
async function rescope() {
  pkg.name = '@somnusjs/somnus';
  await fs.writeFile(PACKAGE_JSON_PATH, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
  isPackageJsonDirty = true;
}

/**
 * @TODO publish in such a way that dependencies are also included,
 * because right now, even though the publishing operation succeeds,
 * users still cannot `npm install` the package from GitHub regitry
 * due to missing dependencies on said registry
 * @DEPRECATION this function should not be invoked manually in favour
 * of a CI/CD integrated approach
 */
async function doPublishGithub() {
  return new Promise((resolve, reject) => {
    if (publishSubProc && publishSubProc.exitCode === null) {
      return reject('GitHub Publishing subprocess still running at pid', publishSubProc.pid);
    }
    publishSubProc = exec('npm publish --registry=https://npm.pkg.github.com', (err, stdout, stderr) => {
      if (err) return reject(err);
      return resolve({ stdout, stderr });
    });
    publishSubProc.stdout.pipe(process.stdout);
    publishSubProc.stderr.pipe(process.stderr);
  });
}

/**
 * @DEPRECATION this function only makes sense when used together with `doPublishGithub`,
 * which is now deprecated (which renders both deprecated)
 */
async function restoreNpmPkg() {
  await fs.writeFile(PACKAGE_JSON_PATH, JSON.stringify(defaultPkg, null, 2) + '\n', 'utf-8');
  await fs.writeFile(PACKAGE_LOCK_JSON_PATH, JSON.stringify(defaultPkgLck, null, 2) + '\n', 'utf-8');
}

/**
 * @DEPRECATION this function only makes sense when used together with `doPublishGithub`,
 * which is now deprecated (which renders both deprecated)
 */
function forceStoppingPublishGithubOperation() {
  if (publishSubProc && publishSubProc.exitCode === null) {
    publishSubProc.kill();
  }
}

async function main() {

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const prompt = util.promisify(rl.question).bind(rl);

  async function manualGitHubPublishPrompt() {
    log('DEPRECATION WARNING: manually publishing is discouraged in favour of a CI/CD integration');
    log('Please only proceed if you\'re absolutely sure what you are doing');
    const userResponse = (await prompt('Are you sure you wish to proceed? (y/n) ')).toLowerCase();
    if (userResponse === 'y' || userResponse === 'yes') return true;
    if (userResponse === 'n' || userResponse === 'no') return false;
    return manualGitHubPublishPrompt();
  }

  switch (process.argv[2]) {
    case 'publish':

      const shouldProceed = await manualGitHubPublishPrompt();
      if (!shouldProceed) break;

      let resp;
      await rescope();
      try {
        rl.once('SIGINT', forceStoppingPublishGithubOperation);
        resp = await doPublishGithub();
      } catch (e) {
        log('failed publishing; please check process log for more details.');
      }
      await restoreNpmPkg();

      break;

    // namespaced as 'unsafe' because this function mutates `package.json`
    case 'unsafe-rescope':
      await rescope();
      log('WARNING: `package.json` is dirty now');
      break;

    default:
      log(`${process.argv[1]} <command>\n`);
      log('All commands:\n');
      log('publish, unsafe-rescope');
      log('');
      break;
  }

  rl.close();
}

function log(...rest) {
  // tslint:disable-next-line:no-console
  console.log(...rest);
}

main();