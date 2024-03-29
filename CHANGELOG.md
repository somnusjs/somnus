## [11.0.0] - 2023-08-22
### Changed
- general dependency upgrades inc. `restify@11`
- Node.js v18 is supported
- updated a few examples to adapt the `async/await` syntax for route handler declaration

## Removed
- support for older (end-of-life / near end-of-life) Node.js versions (e.g. v16 and below)
- `tslint.json` config (in favour of `eslint`); the removed config is quoted below for historic reasons:
  ```
  {
    "defaultSeverity": "error",
    "extends": [
        "tslint:recommended"
    ],
    "jsRules": {},
    "rules": {
      "quotemark": [true, "single"],
      "ordered-imports": [false],
      "object-literal-sort-keys": [false],
      "only-arrow-functions": [false],
      "forin": false
    },
    "rulesDirectory": []
  }
  ```
- Travis-CI integration (in favour of GitHub Actions)

## [8.4.0] - 2022-07-11
### Changed
- truly decoupled `unit-http` from `somnus` in user-land (see https://github.com/somnusjs/somnus/issues/33)
- upgraded a few dependencies

### Added
- the command `npm run local-pack` which prepares a somnus tarball for local installation (wraps `npm pack`)

## [8.3.2] - 2022-05-30
### Changed
- GitHub Action config now supports both registries: npm (stable usage) and GitHub Packages (experimental usage)
- upgraded several devDependencies, clearing out security issues reported by `npm audit`

## [8.3.1] - 2022-05-25
### Changed
- upgraded `restify` to v8.6.1
- upgraded `bunyan` to 1.8.15

### Removed
- GitHub Action config files in the release tarball (which are irrelevant for the users)

## [8.2.1] - 2022-04-10
### Changed
- merged dependabledot security-fix PRs
- upgraded `webpack` library version to a stable one
- synced `package-lock.json` content

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
