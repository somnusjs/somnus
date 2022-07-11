#!/bin/sh
set -e

# somnus.js depends on its own (exported) lib module known as `somnus/lib/isNginxUnitPatched`;
# so for tests to run successfully, we MUST provision a user-land compatible environment where
# the dependency is available as if it was installed by a standard `npm install`

[ ! -f "lib/somnus.js" ] && npm run build:prod

mkdir -p node_modules/somnus/lib
cp lib/isNginxUnitPatched.js node_modules/somnus/lib/

npm run test:src && npm run test:dist