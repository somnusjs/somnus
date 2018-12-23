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
