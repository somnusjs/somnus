## [8.2.0] - 2022-04-10
### Changed
- updated README
- added webpack config `output.globalObject`
- updated webpack config `output.library`
- switched CI to travis-ci.com

### Added
- support for [NGINX Unit](https://www.nginx.com/blog/introducing-nginx-unit/)
- `unit-http` filed as an optional dependency

### Removed
- the file `tslint.json` from the npm distribution package

## [8.1.0] - 2020-07-27
### Changed
- examples are no longer run directly from 'npm scripts' but via `scripts/run-example.js`
- examples are run in such a manner that the main process is not killed before the child process fully exits
- the exported `somnus` object is now created via `Object.create(null)`

### Added
- env var `UNIX_SOCKET` (please see README for details)
- example code for starting `somnus` on a unix socket
- unix socket -related test cases

## [8.0.0] - 2020-07-25
### Changed
- upgraded multiple dependencies, most notably restify@8
- updated webpack build command to support existing `import` and `require` APIs

### Fixed
- issue #2: using `delete` as HTTP method name in `routeConfig` crashes the process

### Added
- more unit tests

## [3.0.1] - 2018-12-23
### Changed
- renamed the ENV var `TEST_BUILD` into `TARGET_DIST_BUILD`
- refactored test suite for easy future expansions
- framework startup info log message now announces log level by name, not number
- a few typo updates in the README and the `helloworld-ts` example

### Added
- `ENV variables` documentation in the README
- a pure JavaScript example (`examples/helloworld-js`)
- (updated) npm run scripts to conveniently invoke currently available examples
- more verbose comments for the example applications

## [3.0.0] - 2018-12-23
### Changed
- complete rewrite over `somnus@2`
- new APIs on old philosophies: make REST API fun, simple, and productive
- breaking change: `somnus@3` can only be installed afresh, and cannot be 'upgraded' from any of the previous versions
- new repo address (`somnusjs/somnus`)
