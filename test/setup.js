// this prevents Somnus's own logger from polluting mocha console output because
// the level is set at `debug` for development build, which can be a bit too verbose;
// this MUST be called before initializing somnus (as seen below)
process.env.LOG_LEVEL = 'warn';

// normally, it's enough to test against source files, but if we're skeptical
// about @babel/preset-typescript and/or webpack, it is also possible to test
// directly against the build artifacts by setting the env `TEST_BUILD` to `true`
const targetDistBuild = process.env.TARGET_DIST_BUILD === 'true';
console.log(`test suite targeting ${targetDistBuild ? 'dist' : 'source'}`);

// @TODO explore ways to use `import` for the calls below?
global.somnus = targetDistBuild
  ? require('../lib/somnus').default // if we want to test against the final output in ./lib
  : require('../src/somnus').default; // if we want to test against files in ./src
